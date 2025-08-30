/* CTB TurnEnd: Text-Mode Drawing Patch
   Place below YEP_X_BattleSysCTB and below your HAUNTER_TurnEndIndicator addon.
*/
(function () {
  var CTB = window.CTB_TurnEnd || {};

  // --- update: mark redraw when turn count changes (for text mode) ---
  var _WCTB_update = Window_CTBIcon.prototype.update;
  Window_CTBIcon.prototype.update = function () {
    _WCTB_update.call(this);
    try {
      if (
        this._battler &&
        typeof this._battler.ctbIcon === "function" &&
        this._battler.ctbIcon() === -2
      ) {
        // text mode flag
        var tc = BattleManager._ctbTurnCount || 0;
        if (this._lastTurnCount !== tc) {
          this._lastTurnCount = tc;
          this._redraw = true; // force redraw on turn change
        }
      }
    } catch (e) {
      // safe guard so we don't break the engine
      if (console && console.warn)
        console.warn("[CTB TurnEnd Patch] update err", e);
    }
  };

  // --- updateRedraw: handle text mode even when _image is missing ---
  var _WCTB_updateRedraw = Window_CTBIcon.prototype.updateRedraw;
  Window_CTBIcon.prototype.updateRedraw = function () {
    // Detect text mode via the special ctbIcon() === -2 flag we used
    var isTextMode =
      this._battler &&
      typeof this._battler.ctbIcon === "function" &&
      this._battler.ctbIcon() === -2;

    if (isTextMode) {
      if (!this._redraw) return;
      this._redraw = false;

      // Clear & draw the normal CTB icon border/background
      this.contents.clear();
      try {
        this.drawBorder();
      } catch (e) {
        // non-fatal, continue
      }

      // Get text & turn number
      var rawText =
        CTB.Text !== undefined
          ? CTB.Text
          : (CTB.Parameters && CTB.Parameters["Turn End Text"]) || "";
      var turnNum = String((BattleManager._ctbTurnCount || 0) + 1);
      var txt;
      try {
        txt = rawText.replace("%1", turnNum);
      } catch (e) {
        txt = rawText || "Turn: " + turnNum;
      }

      // Draw text centered
      var oldSize = this.contents.fontSize;
      var size =
        CTB.TextSize || CTB.TextSize === 0
          ? CTB.TextSize
          : (CTB.Parameters &&
              Number(CTB.Parameters["Turn End Text Size"] || 20)) ||
            20;
      if (this.resetFontSettings) this.resetFontSettings();
      this.contents.fontSize = size;

      // Use battler border color if available, else default
      try {
        this.changeTextColor(this.textColor(5));
      } catch (e) {
        /* ignore */
      }

      this.drawText(txt, 0, 0, this.contents.width, "center");

      // restore font size
      this.contents.fontSize = oldSize;

      // Non-spammy debug message if CTB debug enabled
      if (CTB.Debug && console && console.log) {
        console.log(
          "[CTB TurnEnd] drew text:",
          txt,
          "turnCount=",
          BattleManager._ctbTurnCount || 0
        );
      }
      return;
    }

    // non-text mode -> fallback to original Yanfly logic
    _WCTB_updateRedraw.call(this);
  };

  // --- ensure we request a redraw after battler set for text-mode (safety) ---
  var _WCTB_updateBattler = Window_CTBIcon.prototype.updateBattler;
  Window_CTBIcon.prototype.updateBattler = function () {
    var prevBatt = this._battler;
    _WCTB_updateBattler.call(this);
    try {
      if (
        this._battler &&
        typeof this._battler.ctbIcon === "function" &&
        this._battler.ctbIcon() === -2
      ) {
        this._redraw = true;
      }
    } catch (e) {
      // swallow
    }
  };
})();
