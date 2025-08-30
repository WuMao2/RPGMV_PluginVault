/*:
 * @plugindesc Get and use real-world time for comparisons.
 * @author Haunter
 *
 * @help
 * This plugin allows you to retrieve real-world time components and use
 * them for comparisons within your game, typically through Game Variables
 * and Switches.
 *
 * --- Plugin Commands: ---
 *
 * 1.  RefreshRealTimeVariables
 * - Updates the Game Variables with the current real-world time components.
 * Use this when you need the latest time information immediately.
 *
 * 2.  IsRealTimeBetween <startHour> <startMinute> <endHour> <endMinute> <switchId>
 * - Checks if the current real-world time falls within the specified range.
 * - <startHour>, <startMinute>, <endHour>, <endMinute>: Integers (0-23 for hours, 0-59 for minutes).
 * - <switchId>: The ID of the Game Switch to set (TRUE if within range, FALSE otherwise).
 * - Note: If end time is earlier than start time (e.g., 22 0 6 0), it assumes the range
 * crosses midnight (22:00 to 06:00 the next day).
 * - Example: IsRealTimeBetween 9 0 17 30 10  (Checks if between 9:00 AM and 5:30 PM, sets Switch 10)
 *
 * 3.  IsRealDayOfWeek <dayIndex> <switchId>
 * - Checks if the current real-world day of the week matches the specified index.
 * - <dayIndex>: Integer (0 for Sunday, 1 for Monday, ..., 6 for Saturday).
 * - <switchId>: The ID of the Game Switch to set (TRUE if it's that day, FALSE otherwise).
 * - Example: IsRealDayOfWeek 1 11 (Checks if it's Monday, sets Switch 11)
 *
 * --- Game Variables Setup: ---
 *
 * You must define Game Variables in the RPG Maker MV database for this plugin
 * to store time values. Set a variable ID to 0 to disable storing that specific
 * time component.
 *
 * @param Variable for Year
 * @type variable
 * @default 0
 * @desc Game Variable ID to store the current real-world year (e.g., 2024). Set 0 to disable.
 *
 * @param Variable for Month
 * @type variable
 * @default 0
 * @desc Game Variable ID to store the current real-world month (1-12). Set 0 to disable.
 *
 * @param Variable for Day
 * @type variable
 * @default 0
 * @desc Game Variable ID to store the current real-world day of the month (1-31). Set 0 to disable.
 *
 * @param Variable for Day of Week
 * @type variable
 * @default 0
 * @desc Game Variable ID to store the current real-world day of the week (0=Sun, 6=Sat). Set 0 to disable.
 *
 * @param Variable for Hour
 * @type variable
 * @default 0
 * @desc Game Variable ID to store the current real-world hour (0-23). Set 0 to disable.
 *
 * @param Variable for Minute
 * @type variable
 * @default 0
 * @desc Game Variable ID to store the current real-world minute (0-59). Set 0 to disable.
 *
 * @param Variable for Second
 * @type variable
 * @default 0
 * @desc Game Variable ID to store the current real-world second (0-59). Set 0 to disable.
 *
 * @param Auto Update Interval (ms)
 * @type number
 * @min 0
 * @default 1000
 * @desc Interval in milliseconds to automatically update real-time variables. Set 0 to disable auto-update.
 */

(function () {
  var pluginName = "HAUNTER_RealTime";
  var params = PluginManager.parameters(pluginName);

  var varYearId = Number(params["Variable for Year"] || 0);
  var varMonthId = Number(params["Variable for Month"] || 0);
  var varDayId = Number(params["Variable for Day"] || 0);
  var varDayOfWeekId = Number(params["Variable for Day of Week"] || 0);
  var varHourId = Number(params["Variable for Hour"] || 0);
  var varMinuteId = Number(params["Variable for Minute"] || 0);
  var varSecondId = Number(params["Variable for Second"] || 0);
  var autoUpdateInterval = Number(params["Auto Update Interval (ms)"] || 1000);

  // --- Helper function to update Game Variables with current real time ---
  var updateRealTimeVariables = function () {
    var now = new Date();
    if (varYearId > 0) $gameVariables.setValue(varYearId, now.getFullYear());
    if (varMonthId > 0) $gameVariables.setValue(varMonthId, now.getMonth() + 1); // Month is 0-indexed
    if (varDayId > 0) $gameVariables.setValue(varDayId, now.getDate());
    if (varDayOfWeekId > 0)
      $gameVariables.setValue(varDayOfWeekId, now.getDay()); // 0 = Sunday, 6 = Saturday
    if (varHourId > 0) $gameVariables.setValue(varHourId, now.getHours());
    if (varMinuteId > 0) $gameVariables.setValue(varMinuteId, now.getMinutes());
    if (varSecondId > 0) $gameVariables.setValue(varSecondId, now.getSeconds());
  };

  // --- Game_System: Initialize last update time ---
  var _Game_System_initialize = Game_System.prototype.initialize;
  Game_System.prototype.initialize = function () {
    _Game_System_initialize.apply(this, arguments);
    this._lastRealTimeUpdate = 0;
  };

  // --- Scene_Map: Auto-update time ---
  // This runs on the map screen to keep time updated during gameplay
  var _Scene_Map_update = Scene_Map.prototype.update;
  Scene_Map.prototype.update = function () {
    _Scene_Map_update.apply(this, arguments);
    if (autoUpdateInterval > 0) {
      var now = Date.now();
      if (now - $gameSystem._lastRealTimeUpdate >= autoUpdateInterval) {
        updateRealTimeVariables();
        $gameSystem._lastRealTimeUpdate = now;
      }
    }
  };

  // --- Game_Interpreter: Plugin Commands ---
  var _Game_Interpreter_pluginCommand =
    Game_Interpreter.prototype.pluginCommand;
  Game_Interpreter.prototype.pluginCommand = function (command, args) {
    _Game_Interpreter_pluginCommand.apply(this, arguments);

    if (command === "RefreshRealTimeVariables") {
      updateRealTimeVariables();
      $gameSystem._lastRealTimeUpdate = Date.now(); // Reset update timer
    } else if (command === "IsRealTimeBetween") {
      var startHour = Number(args[0]);
      var startMinute = Number(args[1]);
      var endHour = Number(args[2]);
      var endMinute = Number(args[3]);
      var switchId = Number(args[4]);

      var now = new Date();
      var currentHour = now.getHours();
      var currentMinute = now.getMinutes();

      var currentTimeInMinutes = currentHour * 60 + currentMinute;
      var startTimeInMinutes = startHour * 60 + startMinute;
      var endTimeInMinutes = endHour * 60 + endMinute;

      var result = false;

      if (startTimeInMinutes <= endTimeInMinutes) {
        // Case 1: Time range does not cross midnight (e.g., 9:00 to 17:00)
        result =
          currentTimeInMinutes >= startTimeInMinutes &&
          currentTimeInMinutes <= endTimeInMinutes;
      } else {
        // Case 2: Time range crosses midnight (e.g., 22:00 to 6:00)
        result =
          currentTimeInMinutes >= startTimeInMinutes ||
          currentTimeInMinutes <= endTimeInMinutes;
      }

      if (switchId > 0) {
        $gameSwitches.setValue(switchId, result);
      }
    } else if (command === "IsRealDayOfWeek") {
      var targetDayIndex = Number(args[0]); // 0=Sun, 1=Mon, ..., 6=Sat
      var switchId = Number(args[1]);

      var now = new Date();
      var currentDayOfWeek = now.getDay();

      var result = currentDayOfWeek === targetDayIndex;

      if (switchId > 0) {
        $gameSwitches.setValue(switchId, result);
      }
    }
  };
})();
