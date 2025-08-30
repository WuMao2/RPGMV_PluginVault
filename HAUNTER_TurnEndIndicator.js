/*:
 * @target MV
 * @plugindesc CTB Turn End Indicator addon for YEP_X_BattleSysCTB + CTBIcon. Adds TurnEnd marker synced to pacing, with text/picture/icon options. v1.3-stable
 * @author Haunter
 *
 * @help
 * Place BELOW YEP_BattleEngineCore, YEP_X_BattleSysCTB and other CTBIcon edits.
 *
 * Features:
 *  - Injects a pseudo-battler "TurnEnd" into CTB turn order.
 *  - Can render Picture, Icon, Text, or Picture + Text.
 *  - Text supports %1 = next turn number.
 *  - TurnEnd pacing is exact to 400 charge over 150 ticks.
 *  - Parameters for text color and font size.
 *
 * @param TurnEnd Enabled
 * @type boolean
 * @default true
 *
 * @param Turn End Picture
 * @type file
 * @dir img/pictures/
 * @default
 *
 * @param Turn End Icon
 * @type number
 * @min 0
 * @default 1
 *
 * @param Turn End Border Color
 * @type string
 * @default 29
 *
 * @param Turn End Background Color
 * @type string
 * @default 1
 *
 * @param Turn End Text
 * @type string
 * @default
 * @desc Text to draw. Supports %1 for next turn.
 *
 * @param Turn End Text Size
 * @type number
 * @min 8
 * @max 48
 * @default 20
 *
 * @param Turn End Text Color
 * @type number
 * @min 0
 * @max 31
 * @default 0
 * @desc Window textColor ID for the text drawn.
 */

var Imported = Imported || {};
Imported.HAUNTER_TurnEndIndicator = true;

var CTB_TurnEnd = CTB_TurnEnd || {};
(function ($) {
  "use strict";

  $.Parameters = PluginManager.parameters("HAUNTER_TurnEndIndicator");
  $.Enable = eval(String($.Parameters["TurnEnd Enabled"] || "true"));
  $.Pic = String($.Parameters["Turn End Picture"] || "");
  $.Icon = Number($.Parameters["Turn End Icon"] || 1) || 1;
  $.BorderColor = String($.Parameters["Turn End Border Color"] || 29);
  $.BackColor = String($.Parameters["Turn End Background Color"] || 1);
  $.Text = String($.Parameters["Turn End Text"] || "");
  $.TextSize = Number($.Parameters["Turn End Text Size"] || 20);
  $.TextColor = Number($.Parameters["Turn End Text Color"] || 0);

  //=============================================================================
  // Pseudo-battler
  //=============================================================================
  function CTB_TurnEndBattler() {
    this.initialize.apply(this, arguments);
  }
  CTB_TurnEndBattler.prototype.initialize = function () {};
  CTB_TurnEndBattler.prototype.isActor = function () {
    return false;
  };
  CTB_TurnEndBattler.prototype.isEnemy = function () {
    return false;
  };
  CTB_TurnEndBattler.prototype.isTurnEnd = function () {
    return true;
  };
  CTB_TurnEndBattler.prototype.isDead = function () {
    return false;
  };
  CTB_TurnEndBattler.prototype.isHidden = function () {
    return false;
  };
  CTB_TurnEndBattler.prototype.isSelected = function () {
    return false;
  };
  CTB_TurnEndBattler.prototype.ctbBorderColor = function () {
    return $.BorderColor;
  };
  CTB_TurnEndBattler.prototype.ctbBackgroundColor = function () {
    return $.BackColor;
  };
  CTB_TurnEndBattler.prototype.ctbPicture = function () {
    return $.Pic || "";
  };

  CTB_TurnEndBattler.prototype.ctbTextColor = function () {
    return $.TextColor || 5; // Uses the Turn End Text Color parameter
  };

  CTB_TurnEndBattler.prototype.ctbIcon = function () {
    if ($.Text && $.Text.length > 0) {
      return -2; // flag for text mode (with or without picture)
    }
    return $.Pic ? -1 : $.Icon;
  };

  // Correct pacing with synthetic AGI ~70
  CTB_TurnEndBattler.prototype.ctbTicksToReady = function () {
    var agi = 70;
    var start = 133;
    var perTick = Math.pow(agi, 1.67) * 0.00125;
    var needed = 400;
    var ticksPassed = BattleManager._ctbTicks || 0;
    var current = start + ticksPassed * perTick;
    var remain = Math.max(0, needed - current);
    return remain / perTick + 0.0001;
  };

  //=============================================================================
  // BattleManager hooks
  //=============================================================================
  (function () {
    var _bm_startCTB = BattleManager.startCTB;
    BattleManager.startCTB = function () {
      _bm_startCTB.call(this);
      this._ctbTurnEnd = new CTB_TurnEndBattler();
      this._ctbTurnCount = 0;
    };

    var _bm_endTurn = BattleManager.endTurn;
    BattleManager.endTurn = function () {
      this._ctbTurnCount = (this._ctbTurnCount || 0) + 1;
      _bm_endTurn.call(this);
    };

    BattleManager.turnEndIndicatorBattler = function () {
      if (!this._ctbTurnEnd) this._ctbTurnEnd = new CTB_TurnEndBattler();
      return this._ctbTurnEnd;
    };

    var _bm_ctbTurnOrder = BattleManager.ctbTurnOrder;
    BattleManager.ctbTurnOrder = function () {
      var order = _bm_ctbTurnOrder.call(this);
      if (!$.Enable) return order;
      if (!this.isCTB || !this.isCTB()) return order;
      order = order.slice();
      var turnEnd = this.turnEndIndicatorBattler();
      if (order.indexOf(turnEnd) < 0) order.push(turnEnd);
      order.sort(function (a, b) {
        var ta = a && a.ctbTicksToReady ? a.ctbTicksToReady() : 999999;
        var tb = b && b.ctbTicksToReady ? b.ctbTicksToReady() : 999999;
        return ta - tb;
      });
      return order;
    };
  })();

  //=============================================================================
  // Scene_Battle: create custom window
  //=============================================================================
  (function () {
    var _sc_createAllWindows = Scene_Battle.prototype.createAllWindows;
    Scene_Battle.prototype.createAllWindows = function () {
      _sc_createAllWindows.call(this);
      this.createCTBTurnEndIcon();
    };

    Scene_Battle.prototype.createCTBTurnEndIcon = function () {
      if (!$.Enable) return;
      if (!Yanfly || !Yanfly.Param || !Yanfly.Param.CTBTurnOrder) return;
      this._ctbTurnEndProxy = {
        _battler: BattleManager.turnEndIndicatorBattler(),
      };
      this._ctbTurnEndIcon = new Window_CTBIcon(this._ctbTurnEndProxy);
      if (this._windowLayer)
        this._ctbTurnEndIcon.setWindowLayer(this._windowLayer);
      this.addChild(this._ctbTurnEndIcon);

      var win = this._ctbTurnEndIcon;
      var _redraw = win.redraw;
      win.redraw = function () {
        console.log("Text color", $.TextColor, this.textColor($.TextColor));
        var battler = this._battler;
        if ($.Text && battler && battler.ctbIcon() === -2) {
          this.contents.clear();
          // draw border/background normally
          if (this.drawBorder) this.drawBorder();

          // optional picture layer first
          if (battler.ctbPicture && battler.ctbPicture()) {
            var bmp = ImageManager.loadPicture(battler.ctbPicture());
            if (bmp && bmp.isReady()) {
              var dx = (this.contents.width - bmp.width) / 2;
              var dy = (this.contents.height - bmp.height) / 2;
              this.contents.blt(bmp, 0, 0, bmp.width, bmp.height, dx, dy);
            }
          }

          // draw text on top
          var txt = $.Text.replace(
            "%1",
            String((BattleManager._ctbTurnCount || 0) + 1)
          );
          this.resetFontSettings();
          this.contents.fontSize = $.TextSize;
          this.changeTextColor(this.textColor($.TextColor));
          console.log("Text color", $.TextColor, this.textColor($.TextColor));
          this.drawText(txt, 0, 0, this.contents.width, "center");
        } else {
          _redraw.call(this);
        }
      };
    };

    var _sc_update = Scene_Battle.prototype.update;
    Scene_Battle.prototype.update = function () {
      _sc_update.call(this);
      if (this._ctbTurnEndIcon) {
        var show =
          $gameParty.inBattle() &&
          BattleManager.isCTB &&
          BattleManager.isCTB() &&
          $.Enable &&
          Yanfly.Param.CTBTurnOrder;
        this._ctbTurnEndIcon.visible = show;
        if (this._ctbTurnEndProxy)
          this._ctbTurnEndProxy._battler =
            BattleManager.turnEndIndicatorBattler();
      }
    };
  })();
})(CTB_TurnEnd);
