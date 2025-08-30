//=============================================================================
// ActorEscapeCommand.js
// ----------------------------------------------------------------------------
// Adds Escape command to the Actor Command Window.
// Works with Yanfly CTB escape logic (processEscapeCTB).
//=============================================================================

/*:
 * @plugindesc Adds an Escape command to Actor Command Window (MV + YEP CTB).
 * @author Haunter
 * @help
 * This plugin adds an Escape command to each actor’s command window in battle.
 *
 * Requirements:
 *  - Works with Yanfly CTB (must be placed BELOW YEP_BattleEngineCore and CTB).
 *  - Escape logic calls BattleManager.processEscape(), which will route to
 *    CTB’s processEscapeCTB if installed.
 *
 * No parameters. Plug-and-play.
 */

(function () {
  "use strict";

  //--------------------------------------------------------------------------
  // Add Escape to Actor Command
  //--------------------------------------------------------------------------
  const _Window_ActorCommand_makeCommandList =
    Window_ActorCommand.prototype.makeCommandList;
  Window_ActorCommand.prototype.makeCommandList = function () {
    _Window_ActorCommand_makeCommandList.call(this);
    if (this._actor) {
      this.addCommand(TextManager.escape, "escape", BattleManager.canEscape());
    }
  };

  //--------------------------------------------------------------------------
  // Hook escape handler into Scene_Battle
  //--------------------------------------------------------------------------
  const _Scene_Battle_createActorCommandWindow =
    Scene_Battle.prototype.createActorCommandWindow;
  Scene_Battle.prototype.createActorCommandWindow = function () {
    _Scene_Battle_createActorCommandWindow.call(this);
    this._actorCommandWindow.setHandler(
      "escape",
      this.commandActorEscape.bind(this)
    );
  };

  Scene_Battle.prototype.commandActorEscape = function () {
    // Let BattleManager handle everything
    const success = BattleManager.processEscape();
    if (!success) {
      // For CTB: processEscapeCTB already called processFailEscapeCTB,
      // so we just close actor window and let CTB resume naturally.
      this._actorCommandWindow.close();
      this._actorCommandWindow.deactivate();
      // Clear pending command so CTB doesn't get stuck
      BattleManager.clearActor();
    }
  };
})();
