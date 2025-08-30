//=============================================================================
// HideActorCommandScrollArrows.js
// ----------------------------------------------------------------------------
// Hides the windowskin scroll arrows (▲▼) on Actor Command (and optional Party Command) windows.
// Useful with MOG_BattleCommand where the default arrows show up in the wrong place.
// Place BELOW MOG_BattleCommand.
//=============================================================================

/*:
 * @plugindesc Hides windowskin scroll arrows in Actor Command (and optional Party Command) windows. (MV)
 * @author Haunter
 *
 * @param HideOnActorCommand
 * @type boolean
 * @on Yes
 * @off No
 * @desc Hide windowskin scroll arrows on Actor Command Window.
 * @default true
 *
 * @param HideOnPartyCommand
 * @type boolean
 * @on Yes
 * @off No
 * @desc Also hide arrows on Party Command Window (optional).
 * @default false
 *
 * @help
 * This patch targets ONLY the windowskin scroll arrows (the small ▲▼ drawn
 * from System/Window.png). It does NOT remove the selection rectangle cursor,
 * and it does NOT affect message window pause signs.
 *
 * Place this BELOW MOG_BattleCommand so it takes priority after Mog’s setup.
 *
 * No plugin commands.
 */

(function () {
  "use strict";

  var PLUGIN_NAME = "HAUNTER_HideActorCommandScrollArrows";
  var params = PluginManager.parameters(PLUGIN_NAME);
  var HIDE_ACTOR = String(params["HideOnActorCommand"] || "true") === "true";
  var HIDE_PARTY = String(params["HideOnPartyCommand"] || "false") === "true";

  function hideArrows(w) {
    if (!w) return;
    if (w._downArrowSprite) {
      w._downArrowSprite.visible = false;
      w._downArrowSprite.alpha = 0;
      w._downArrowSprite.x = -9999;
      w._downArrowSprite.y = -9999;
    }
    if (w._upArrowSprite) {
      w._upArrowSprite.visible = false;
      w._upArrowSprite.alpha = 0;
      w._upArrowSprite.x = -9999;
      w._upArrowSprite.y = -9999;
    }
  }

  // Patch a window class to permanently suppress windowskin arrows.
  function patchWindowClass(WindowClass) {
    if (!WindowClass) return;

    // Keep aliases robust if other plugins replace these later.
    var _refreshArrows = WindowClass.prototype._refreshArrows;
    var _update = WindowClass.prototype.update;
    var _updateArrows = WindowClass.prototype.updateArrows || null;

    if (_refreshArrows) {
      WindowClass.prototype._refreshArrows = function () {
        _refreshArrows.call(this);
        hideArrows(this);
      };
    }

    // MV calls update() every frame; ensure arrows stay hidden even if re-shown.
    WindowClass.prototype.update = function () {
      _update.call(this);
      hideArrows(this);
    };

    // Some builds also use updateArrows to toggle visibility each frame.
    if (_updateArrows) {
      WindowClass.prototype.updateArrows = function () {
        _updateArrows.call(this);
        hideArrows(this);
      };
    }
  }

  if (HIDE_ACTOR && window.Window_ActorCommand) {
    patchWindowClass(Window_ActorCommand);
  }

  if (HIDE_PARTY && window.Window_PartyCommand) {
    patchWindowClass(Window_PartyCommand);
  }
})();
