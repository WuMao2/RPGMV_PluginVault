//=============================================================================
// DisableActorCancel.js
// ----------------------------------------------------------------------------
// Disables Cancel (B/Esc/right-click) while the Actor Command Window is active.
// Plug-and-play. RPG Maker MV.
//=============================================================================

/*:
 * @plugindesc Disables Cancel (B/Esc) in the Actor Command Window (MV).
 * @author Haunter
 * @target MV
 * @help
 * Drop this plugin under your battle plugins. No parameters.
 *
 * Effect:
 *  - While the Actor Command Window is open, pressing Cancel/B/Esc/right-click
 *    will do nothing (you cannot back out to party command).
 *  - Other windows (skills, items, etc.) behave normally.
 */

(function () {
  "use strict";

  // Make the Actor Command Window report that Cancel isn't enabled.
  // This gates both keyboard (B/Esc) and TouchInput cancel handling.
  Window_ActorCommand.prototype.isCancelEnabled = function () {
    return false;
  };

  // (Optional safety) If another plugin force-calls the cancel handler,
  // swallow it gracefully by overriding callCancelHandler for this window.
  const _WAC_callCancelHandler =
    Window_ActorCommand.prototype.callCancelHandler;
  Window_ActorCommand.prototype.callCancelHandler = function () {
    // Do nothing if someone tries to force a cancel on this window.
    // Comment the next line back in if you prefer the original behavior:
    // _WAC_callCancelHandler.call(this);
  };
})();
