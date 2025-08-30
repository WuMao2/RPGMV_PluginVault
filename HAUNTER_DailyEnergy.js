/*:
 * @plugindesc Daily Energy System
 * @author Haunter
 *
 * @param Energy Variable
 * @desc Game variable ID used to store current energy
 * @type number
 * @default 1
 *
 * @param Max Energy
 * @desc Maximum energy value
 * @type number
 * @default 100
 *
 * @param Frames Per Increment
 * @desc Number of frames between each energy increment
 * @type number
 * @default 3600
 *
 * @param Increment Amount
 * @desc How much energy to add per increment
 * @type number
 * @default 1
 *
 * @help
 * This plugin increments a variable every X frames. When the game is closed,
 * it saves the real-world time. On load, it calculates how many increments
 * should have happened while offline and updates energy accordingly.
 */

(function () {
  const parameters = PluginManager.parameters("HAUNTER_DailyEnergy");
  const energyVarId = Number(parameters["Energy Variable"] || 1);
  const maxEnergy = Number(parameters["Max Energy"] || 100);
  const framesPerIncrement = Number(parameters["Frames Per Increment"] || 3600);
  const incrementAmount = Number(parameters["Increment Amount"] || 1);

  let frameCounter = 0;

  // Common function to update energy
  function updateEnergyIncrement() {
    if ($gameVariables.value(energyVarId) < maxEnergy) {
      frameCounter++;
      if (frameCounter >= framesPerIncrement) {
        const newEnergy = Math.min(
          $gameVariables.value(energyVarId) + incrementAmount,
          maxEnergy
        );
        $gameVariables.setValue(energyVarId, newEnergy);
        frameCounter = 0;
      }
    }
  }

  // Hook into Scene_Map and Scene_Battle update methods
  var _Scene_Base_update = Scene_Base.prototype.update;
  Scene_Base.prototype.update = function () {
    _Scene_Base_update.call(this);
    $gameSystem.updateDailyEnergy();
  };

  Game_System.prototype.updateDailyEnergy = function () {
    if (!this._haunterFrameCounter) this._haunterFrameCounter = 0;

    if ($gameVariables.value(energyVarId) < maxEnergy) {
      this._haunterFrameCounter++;
      if (this._haunterFrameCounter >= framesPerIncrement) {
        const newEnergy = Math.min(
          $gameVariables.value(energyVarId) + incrementAmount,
          maxEnergy
        );
        $gameVariables.setValue(energyVarId, newEnergy);
        this._haunterFrameCounter = 0;
      }
    }
  };

  // Save timestamp when saving game
  const _DataManager_makeSaveContents = DataManager.makeSaveContents;
  DataManager.makeSaveContents = function () {
    const contents = _DataManager_makeSaveContents.call(this);
    contents._dailyEnergyTimestamp = Date.now();
    return contents;
  };

  // Load timestamp and catch up
  const _DataManager_extractSaveContents = DataManager.extractSaveContents;
  DataManager.extractSaveContents = function (contents) {
    _DataManager_extractSaveContents.call(this, contents);

    if (contents._dailyEnergyTimestamp) {
      const lastTime = contents._dailyEnergyTimestamp;
      const now = Date.now();
      const elapsedMs = now - lastTime;
      const elapsedFrames = elapsedMs / (1000 / 60); // assuming 60 FPS
      const increments = Math.floor(elapsedFrames / framesPerIncrement);
      if (increments > 0) {
        const newEnergy = Math.min(
          $gameVariables.value(energyVarId) + increments * incrementAmount,
          maxEnergy
        );
        $gameVariables.setValue(energyVarId, newEnergy);
      }
    }
  };
})();
