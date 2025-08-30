/*:
 * @plugindesc v2.5 Displays CTB info, images, and an enhanced Time Attack mode.
 * @author Haunter
 *
 * @param ---General Settings---
 * @default
 *
 * @param Display X
 * @parent ---General Settings---
 * @type number
 * @min 0
 * @desc X coordinate for the floating text display.
 * @default 0
 *
 * @param Display Y
 * @parent ---General Settings---
 * @type number
 * @min 0
 * @desc Y coordinate for the floating text display.
 * @default 0
 *
 * @param Display Width
 * @parent ---General Settings---
 * @type number
 * @min 100
 * @desc Width of the area for the floating text.
 * @default 200
 *
 * @param Display Height
 * @parent ---General Settings---
 * @type number
 * @min 36
 * @desc Height of the area for the floating text.
 * @default 60
 *
 * @param Text Format
 * @parent ---General Settings---
 * @desc Format of the displayed text. %1: ticks, %2: turn.
 * @default Ticks: %1 | Turn: %2
 *
 * @param Font Size
 * @parent ---General Settings---
 * @type number
 * @min 12
 * @desc Font size for the displayed text.
 * @default 22
 *
 * @param Text Color
 * @parent ---General Settings---
 * @desc HTML color code for the text.
 * @default #FFFFFF
 *
 * @param Tick Up Speed
 * @parent ---General Settings---
 * @type number
 * @min 1
 * @desc Speed for ticks animating upwards.
 * @default 10
 *
 * @param Tick Down Speed
 * @parent ---General Settings---
 * @type number
 * @min 1
 * @desc Speed for ticks animating downwards.
 * @default 1
 *
 * @param Vertical Transition Speed
 * @parent ---General Settings---
 * @type number
 * @min 0.01
 * @decimals 2
 * @desc The speed of the vertical transition (0.01 - 1.00). Lower is slower.
 * @default 0.20
 *
 * @param Vertical Transition Curve
 * @parent ---General Settings---
 * @desc The animation curve for the vertical transition (linear, easeOut, easeInOut).
 * @default linear
 *
 * @param Color Change Speed
 * @parent ---General Settings---
 * @type number
 * @min 0.01
 * @decimals 2
 * @desc The speed of the text color fade (0.01 - 1.00). Lower is slower.
 * @default 0.05
 *
 * @param ---Image 1 Settings---
 * @default
 *
 * @param Image File
 * @parent ---Image 1 Settings---
 * @type file
 * @dir img/pictures/
 * @desc The first image to display (above text). Leave blank to disable.
 * @default
 *
 * @param Image X
 * @parent ---Image 1 Settings---
 * @type number
 * @min -9000
 * @desc X coordinate for the first image.
 * @default 100
 *
 * @param Image Y
 * @parent ---Image 1 Settings---
 * @type number
 * @min -9000
 * @desc Y coordinate for the first image.
 * @default 50
 *
 * @param Image Scale
 * @parent ---Image 1 Settings---
 * @type number
 * @min 0.01
 * @decimals 2
 * @desc Scale of the first image.
 * @default 1.00
 *
 * @param Spin Duration
 * @parent ---Image 1 Settings---
 * @type number
 * @min 1
 * @desc Duration of the 180-degree spin animation (frames).
 * @default 60
 *
 * @param Cubic Bezier
 * @parent ---Image 1 Settings---
 * @desc Animation timing for the first image spin.
 * @default 0.42, 0, 0.58, 1
 *
 * @param Image Change Duration
 * @parent ---Image 1 Settings---
 * @type number
 * @min 1
 * @desc The duration of the image change fade in/out in frames.
 * @default 30
 *
 * @param ---Image 2 Settings---
 * @default
 *
 * @param Second Image File
 * @parent ---Image 2 Settings---
 * @type file
 * @dir img/pictures/
 * @desc The second image to display (below text). Leave blank to disable.
 * @default
 *
 * @param Second Image X
 * @parent ---Image 2 Settings---
 * @type number
 * @min -9000
 * @desc X coordinate for the second image.
 * @default 100
 *
 * @param Second Image Y
 * @parent ---Image 2 Settings---
 * @type number
 * @min -9000
 * @desc Y coordinate for the second image.
 * @default 110
 *
 * @param Second Image Scale
 * @parent ---Image 2 Settings---
 * @type number
 * @min 0.01
 * @decimals 2
 * @desc Scale of the second image.
 * @default 1.00
 *
 * @param Second Image Opacity
 * @parent ---Image 2 Settings---
 * @type number
 * @min 0
 * @max 255
 * @desc Opacity of the second image (0-255). 0: transparent, 255: opaque.
 * @default 255
 *
 * @param ---Sound Settings---
 * @default
 *
 * @param Sound File
 * @parent ---Sound Settings---
 * @type file
 * @dir audio/se/
 * @desc The sound effect to play when the turn changes.
 * @default Bell
 *
 * @param Sound Volume
 * @parent ---Sound Settings---
 * @type number
 * @min 0
 * @max 100
 * @desc Volume of the sound effect.
 * @default 90
 *
 * @param Sound Pitch
 * @parent ---Sound Settings---
 * @type number
 * @min 50
 * @max 150
 * @desc Pitch of the sound effect.
 * @default 100
 *
 * @param Sound Pan
 * @parent ---Sound Settings---
 * @type number
 * @min -100
 * @max 100
 * @desc Pan of the sound effect (-100: left, 100: right).
 * @default 0
 *
 * @param ---Time Attack Mode---
 * @default
 *
 * @param TA Display X
 * @parent ---Time Attack Mode---
 * @type number
 * @min 0
 * @desc X coordinate for the Time Attack text display.
 * @default 616
 *
 * @param TA Display Y
 * @parent ---Time Attack Mode---
 * @type number
 * @min 0
 * @desc Y coordinate for the Time Attack text display.
 * @default 0
 *
 * @param TA Display Width
 * @parent ---Time Attack Mode---
 * @type number
 * @min 100
 * @desc Width of the Time Attack text display.
 * @default 200
 *
 * @param TA Display Height
 * @parent ---Time Attack Mode---
 * @type number
 * @min 36
 * @desc Height of the Time Attack text display.
 * @default 60
 *
 * @param TA Text Format
 * @parent ---Time Attack Mode---
 * @desc Format of the Time Attack text. %1: remaining ticks.
 * @default Ticks Remaining: %1
 *
 * @param TA Font Size
 * @parent ---Time Attack Mode---
 * @type number
 * @min 12
 * @desc Font size for the Time Attack text.
 * @default 22
 *
 * @param TA Text Color
 * @parent ---Time Attack Mode---
 * @desc HTML color code for the Time Attack text.
 * @default #FFD700
 *
 * @param TA Image File
 * @parent ---Time Attack Mode---
 * @type file
 * @dir img/pictures/
 * @desc Image to display during time attack mode. Leave blank to disable.
 * @default
 *
 * @param TA Image X
 * @parent ---Time Attack Mode---
 * @type number
 * @min -9000
 * @desc X coordinate for the time attack image. Centered on text by default.
 * @default 716
 *
 * @param TA Image Y
 * @parent ---Time Attack Mode---
 * @type number
 * @min -9000
 * @desc Y coordinate for the time attack image. Centered on text by default.
 * @default 30
 *
 * @param TA Image Scale
 * @parent ---Time Attack Mode---
 * @type number
 * @min 0.01
 * @decimals 2
 * @desc Scale of the time attack image.
 * @default 1.00
 *
 * @param TA Image Opacity
 * @parent ---Time Attack Mode---
 * @type number
 * @min 0
 * @max 255
 * @desc Opacity of the time attack image (0-255). 0: transparent, 255: opaque.
 * @default 255
 *
 * @help
 * ============================================================================
 * Introduction
 * ============================================================================
 * Displays CTB information with text, images, and a Time Attack mode.
 * The Time Attack mode adds a tick countdown with optional consequences that
 * will immediately interrupt the battle.
 *
 * ============================================================================
 * Plugin Commands
 * ============================================================================
 *
 * --- General Commands ---
 * CTB_ChangeSound <filename> <volume> <pitch> <pan>
 * CTB_ChangeTextColor <#hexcode>
 * CTB_ChangeImage <filename> <scale>
 * CTB_ResetDefaults
 *
 * ---Time Attack Commands---
 *
 * CTB_SetMode TimeAttack
 * - Sets the next battle to be a Time Attack. This is for one battle only.
 *
 * CTB_SetGoal <ticks>
 * - Sets the number of ticks for the next Time Attack battle.
 * - Example: CTB_SetGoal 5000
 *
 * CTB_ChangeTATextColor <#hexcode>
 * - Changes the Time Attack text color for the next battle only.
 * - Example: CTB_ChangeTATextColor #FF6347
 *
 * CTB_SetWarning <Threshold> <Common Event ID>
 * - Triggers a Common Event when ticks fall at or below the Threshold.
 * - Example: CTB_SetWarning 1000 5
 *
 * CTB_SetGameOver <Common Event ID>
 * - Triggers a Common Event when the tick counter reaches 0.
 * - Example: CTB_SetGameOver 6
 *
 * ============================================================================
 * Compatibility
 * ============================================================================
 * Requires YEP_BattleEngineCore.js and YEP_X_BattleSysCTB.js. Place below them.
 *
 * ============================================================================
 * Changelog
 * ============================================================================
 * Version 2.5:
 * - Added parameters to control the opacity of the Time Attack Image and Image 2.
 * Version 2.4:
 * - Fixed a visual bug where the Time Attack image was not properly layered
 * behind the Time Attack text by default.
 * Version 2.3:
 * - Warning and Game Over common events now trigger immediately, interrupting
 * the battle flow, instead of waiting for a turn to end.
 * Version 2.2:
 * - Added CTB_SetWarning to trigger a common event at a tick threshold.
 * - Added CTB_SetGameOver to trigger a common event when ticks run out.
 * - Added CTB_ChangeTATextColor to change the TA text color for one battle.
 * Version 2.1:
 * - Fixed a bug where the Time Attack tick countdown was off by one.
 * - Added a new, non-spinning image that is only visible during Time Attack mode.
 * Version 2.0:
 * - Added Time Attack mode with a separate tick countdown display.
 * - Added plugin commands CTB_SetMode and CTB_SetGoal.
 * Version 1.0:
 * - Release.
 */

(function () {
  // --- Plugin Parameters ---
  var parameters = PluginManager.parameters("HAUNTER_TurnTicksDisplay");
  var displayX = Number(parameters["Display X"] || 0);
  var displayY = Number(parameters["Display Y"] || 0);
  var displayWidth = Number(parameters["Display Width"] || 200);
  var displayHeight = Number(parameters["Display Height"] || 60);
  var textFormat = String(parameters["Text Format"] || "Ticks: %1 | Turn: %2");
  var fontSize = Number(parameters["Font Size"] || 22);
  var textColor = String(parameters["Text Color"] || "#FFFFFF");
  var tickUpSpeed = Number(parameters["Tick Up Speed"] || 10);
  var tickDownSpeed = Number(parameters["Tick Down Speed"] || 1);
  var imageFile = String(parameters["Image File"] || "");
  var imageX = Number(parameters["Image X"] || displayX + displayWidth / 2);
  var imageY = Number(parameters["Image Y"] || displayY + displayHeight / 3);
  var imageScale = Number(parameters["Image Scale"] || 1.0);
  var spinDuration = Number(parameters["Spin Duration"] || 60);
  var cubicBezier = String(parameters["Cubic Bezier"] || "0.42, 0, 0.58, 1")
    .split(",")
    .map(Number);
  var cubicBezierX1 = cubicBezier[0];
  var cubicBezierY1 = cubicBezier[1];
  var cubicBezierX2 = cubicBezier[2];
  var cubicBezierY2 = cubicBezier[3];
  var secondImageFile = String(parameters["Second Image File"] || "");
  var secondImageX = Number(
    parameters["Second Image X"] || displayX + displayWidth / 2
  );
  var secondImageY = Number(
    parameters["Second Image Y"] || displayY + (displayHeight * 2) / 3
  );
  var secondImageScale = Number(parameters["Second Image Scale"] || 1.0);
  var secondImageOpacity = Number(parameters["Second Image Opacity"] || 255); // NEW
  var soundFile = String(parameters["Sound File"] || "");
  var soundVolume = Number(parameters["Sound Volume"] || 90);
  var soundPitch = Number(parameters["Sound Pitch"] || 100);
  var soundPan = Number(parameters["Sound Pan"] || 0);
  var verticalTransitionSpeed = Number(
    parameters["Vertical Transition Speed"] || 0.2
  );
  var verticalTransitionCurve = String(
    parameters["Vertical Transition Curve"] || "linear"
  );
  var colorChangeSpeed = Number(parameters["Color Change Speed"] || 0.05);
  var imageChangeDuration = Number(parameters["Image Change Duration"] || 30);

  // Time Attack Parameters
  var taDisplayX = Number(parameters["TA Display X"] || 616);
  var taDisplayY = Number(parameters["TA Display Y"] || 0);
  var taDisplayWidth = Number(parameters["TA Display Width"] || 200);
  var taDisplayHeight = Number(parameters["TA Display Height"] || 60);
  var taTextFormat = String(
    parameters["TA Text Format"] || "Ticks Remaining: %1"
  );
  var taFontSize = Number(parameters["TA Font Size"] || 22);
  var taTextColor = String(parameters["TA Text Color"] || "#FFD700");
  var taImageFile = String(parameters["TA Image File"] || "");
  var taImageScale = Number(parameters["TA Image Scale"] || 1.0);
  var taImageOpacity = Number(parameters["TA Image Opacity"] || 255); // NEW
  // [BUG FIX] Calculate default image position based on text position
  var taImageX = Number(
    parameters["TA Image X"] || taDisplayX + taDisplayWidth / 2
  );
  var taImageY = Number(
    parameters["TA Image Y"] || taDisplayY + taDisplayHeight / 2
  );

  // ============================================================================
  // Global Plugin Variables
  // ============================================================================
  var globalTextColor = textColor;
  var globalImageFile = imageFile;
  var globalImageScale = imageScale;
  var globalSoundFile = soundFile;
  var globalSoundVolume = soundVolume;
  var globalSoundPitch = soundPitch;
  var globalSoundPan = soundPan;

  // Time Attack Variables
  var _timeAttackModeEnabled = false;
  var _timeAttackGoal = 0;
  var _timeAttackRemainingTicks = 0;
  var _isTimeAttackActiveInBattle = false;
  var _timeAttackNextColor = null;
  var _timeAttackWarningThreshold = 0;
  var _timeAttackWarningEventId = 0;
  var _timeAttackGameOverEventId = 0;
  var _timeAttackWarningTriggered = false;
  var _isTimeAttackGameOver = false;

  // ============================================================================
  // Helper Functions
  // ============================================================================
  function getBezierValue(t, y1, y2) {
    // Correct formula for a cubic-bezier easing curve with P0=(0,0) and P3=(1,1)
    var one_minus_t = 1 - t;
    var term1 = 3 * y1 * one_minus_t * one_minus_t * t;
    var term2 = 3 * y2 * one_minus_t * t * t;
    var term3 = t * t * t;
    return term1 + term2 + term3;
  }

  function lerp(start, end, t) {
    if (verticalTransitionCurve === "easeOut") {
      t = 1 - Math.pow(1 - t, 2);
    } else if (verticalTransitionCurve === "easeInOut") {
      t = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
    }
    return start * (1 - t) + end * t;
  }

  function hexToRgb(hex) {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
      ? {
          r: parseInt(result[1], 16),
          g: parseInt(result[2], 16),
          b: parseInt(result[3], 16),
        }
      : null;
  }

  function rgbToHex(r, g, b) {
    return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
  }

  function lerpColor(startHex, endHex, t) {
    var startRgb = hexToRgb(startHex);
    var endRgb = hexToRgb(endHex);
    if (!startRgb || !endRgb) return startHex;

    var r = Math.round(startRgb.r + (endRgb.r - startRgb.r) * t);
    var g = Math.round(startRgb.g + (endRgb.g - startRgb.g) * t);
    var b = Math.round(startRgb.b + (endRgb.b - startRgb.b) * t);

    return rgbToHex(r, g, b);
  }

  // ============================================================================
  // Sprite_TimeAttackDisplay
  // ============================================================================

  function Sprite_TimeAttackDisplay() {
    this.initialize.apply(this, arguments);
  }

  Sprite_TimeAttackDisplay.prototype = Object.create(Sprite.prototype);
  Sprite_TimeAttackDisplay.prototype.constructor = Sprite_TimeAttackDisplay;

  Sprite_TimeAttackDisplay.prototype.initialize = function () {
    Sprite.prototype.initialize.call(this);
    this.bitmap = new Bitmap(taDisplayWidth, taDisplayHeight);
    this._displayedTicks = 0;
    this._currentColor = taTextColor;
    this.visible = false;
    this.z = 8;
    this.refresh();
  };

  Sprite_TimeAttackDisplay.prototype.update = function () {
    Sprite.prototype.update.call(this);
    this.updateVisibility();
    this.updatePosition();
    this.updateTickAnimation();
  };

  Sprite_TimeAttackDisplay.prototype.setColor = function (color) {
    this._currentColor = color;
    this.refresh();
  };

  Sprite_TimeAttackDisplay.prototype.updatePosition = function () {
    var targetY = taDisplayY + SceneManager._scene.targetYOffset;
    this.x = taDisplayX;
    this.y = lerp(this.y, targetY, verticalTransitionSpeed);
  };

  Sprite_TimeAttackDisplay.prototype.updateVisibility = function () {
    this.visible =
      _isTimeAttackActiveInBattle &&
      BattleManager.isCTB() &&
      BattleManager._phase !== "start" &&
      BattleManager._phase !== "battleEnd" &&
      !SceneManager.isSceneChanging();
  };

  Sprite_TimeAttackDisplay.prototype.updateTickAnimation = function () {
    if (!this.visible) return;
    var currentTicks = Math.max(0, _timeAttackRemainingTicks);
    if (this._displayedTicks !== currentTicks) {
      if (currentTicks < this._displayedTicks) {
        var diff = this._displayedTicks - currentTicks;
        var change = Math.min(diff, tickDownSpeed);
        this._displayedTicks -= change;
      } else {
        this._displayedTicks = currentTicks;
      }
      this.refresh();
    }
  };

  Sprite_TimeAttackDisplay.prototype.setInitialTicks = function (ticks) {
    this._displayedTicks = ticks;
    this.refresh();
  };

  Sprite_TimeAttackDisplay.prototype.refresh = function () {
    this.bitmap.clear();
    this.bitmap.fontSize = taFontSize;
    this.bitmap.textColor = this._currentColor;
    var text = taTextFormat.format(Math.floor(this._displayedTicks));
    this.bitmap.drawText(
      text,
      0,
      0,
      this.bitmap.width,
      this.bitmap.height,
      "center"
    );
  };

  // ============================================================================
  // Sprite_TimeAttackImage
  // ============================================================================

  function Sprite_TimeAttackImage() {
    this.initialize.apply(this, arguments);
  }

  Sprite_TimeAttackImage.prototype = Object.create(Sprite.prototype);
  Sprite_TimeAttackImage.prototype.constructor = Sprite_TimeAttackImage;

  Sprite_TimeAttackImage.prototype.initialize = function () {
    Sprite.prototype.initialize.call(this);
    this.scale.set(taImageScale);
    this.anchor.set(0.5);
    this.visible = false;
    this.opacity = taImageOpacity; // NEW
    this.z = 5; // [BUG FIX] Lower Z to be behind other UI elements
    this.loadBitmap();
  };

  Sprite_TimeAttackImage.prototype.loadBitmap = function () {
    if (taImageFile) {
      this.bitmap = ImageManager.loadPicture(taImageFile);
    } else {
      this.bitmap = new Bitmap(1, 1);
    }
  };

  Sprite_TimeAttackImage.prototype.update = function () {
    Sprite.prototype.update.call(this);
    this.updateVisibility();
    this.updatePosition();
  };

  Sprite_TimeAttackImage.prototype.updatePosition = function () {
    var targetY = taImageY + SceneManager._scene.targetYOffset;
    this.x = taImageX;
    this.y = lerp(this.y, targetY, verticalTransitionSpeed);
  };

  Sprite_TimeAttackImage.prototype.updateVisibility = function () {
    this.visible =
      _isTimeAttackActiveInBattle &&
      BattleManager.isCTB() &&
      BattleManager._phase !== "start" &&
      BattleManager._phase !== "battleEnd" &&
      !SceneManager.isSceneChanging() &&
      taImageFile;
  };

  // ============================================================================
  // Sprite_CTBTicksDisplay
  // ============================================================================

  function Sprite_CTBTicksDisplay() {
    this.initialize.apply(this, arguments);
  }

  Sprite_CTBTicksDisplay.prototype = Object.create(Sprite.prototype);
  Sprite_CTBTicksDisplay.prototype.constructor = Sprite_CTBTicksDisplay;

  Sprite_CTBTicksDisplay.prototype.initialize = function () {
    Sprite.prototype.initialize.call(this);
    this.bitmap = new Bitmap(displayWidth, displayHeight);
    this._currentTicks = -1;
    this._displayedTicks = 0;
    this._currentTurn = -1;
    this._currentColor = globalTextColor;
    this._targetColor = globalTextColor;
    this.visible = false;
    this.z = 8;
    this.refresh();
  };

  Sprite_CTBTicksDisplay.prototype.update = function () {
    Sprite.prototype.update.call(this);
    this.updateVisibility();
    this.updatePosition();
    this.updateContent();
    this.updateTickAnimation();
    this.updateColor();
  };

  Sprite_CTBTicksDisplay.prototype.updatePosition = function () {
    var targetY = displayY + SceneManager._scene.targetYOffset;
    this.x = displayX;
    this.y = lerp(this.y, targetY, verticalTransitionSpeed);
  };

  Sprite_CTBTicksDisplay.prototype.updateColor = function () {
    if (this._currentColor !== this._targetColor) {
      this._currentColor = lerpColor(
        this._currentColor,
        this._targetColor,
        colorChangeSpeed
      );
      if (this._currentColor === this._targetColor) {
        this._currentColor = this._targetColor;
      }
      this.refresh();
    }
  };

  Sprite_CTBTicksDisplay.prototype.updateVisibility = function () {
    this.visible =
      BattleManager.isCTB() &&
      BattleManager._phase !== "start" &&
      BattleManager._phase !== "battleEnd" &&
      !SceneManager.isSceneChanging();
  };

  Sprite_CTBTicksDisplay.prototype.updateContent = function () {
    if (!this.visible) return;
    if (!BattleManager.isCTB() || !BattleManager._ctbFullTurn) return;
    var remainingTicks = Math.max(
      0,
      BattleManager._ctbFullTurn - BattleManager._ctbTicks
    );
    var currentTurn = $gameTroop.turnCount();

    if (
      this._currentTicks !== remainingTicks ||
      this._currentTurn !== currentTurn
    ) {
      this._currentTicks = remainingTicks;
      this._currentTurn = currentTurn;
    }
  };

  Sprite_CTBTicksDisplay.prototype.updateTickAnimation = function () {
    if (this._displayedTicks !== this._currentTicks) {
      var diff = this._currentTicks - this._displayedTicks;
      var speed = diff > 0 ? tickUpSpeed : tickDownSpeed;
      var change = Math.sign(diff) * Math.min(Math.abs(diff), speed);
      this._displayedTicks += change;
      this.refresh();
    }
  };

  Sprite_CTBTicksDisplay.prototype.refresh = function () {
    this.bitmap.clear();
    this.bitmap.fontSize = fontSize;
    this.bitmap.textColor = this._currentColor;
    var text = textFormat.format(
      Math.floor(this._displayedTicks),
      this._currentTurn
    );
    this.bitmap.drawText(
      text,
      0,
      0,
      this.bitmap.width,
      this.bitmap.height,
      "center"
    );
  };

  Sprite_CTBTicksDisplay.prototype.setTargetColor = function (color) {
    this._targetColor = color;
  };

  // ============================================================================
  // Sprite_CTBTicksImage
  // ============================================================================

  function Sprite_CTBTicksImage() {
    this.initialize.apply(this, arguments);
  }

  Sprite_CTBTicksImage.prototype = Object.create(Sprite.prototype);
  Sprite_CTBTicksImage.prototype.constructor = Sprite_CTBTicksImage;

  Sprite_CTBTicksImage.prototype.initialize = function () {
    Sprite.prototype.initialize.call(this);
    this.scale.set(globalImageScale);
    this.anchor.set(0.5);
    this.visible = false;
    this.z = 7;
    this._spinStartTime = 0;
    this._spinStartRotation = 0;
    this._totalRotation = 0; // This will now track the target rotation internally.
    this._isSpinning = false;
    this._isChangingImage = false;
    this._fadeTime = 0;
    this._targetImage = globalImageFile;
    this.loadBitmap();
  };

  Sprite_CTBTicksImage.prototype.loadBitmap = function () {
    if (globalImageFile) {
      this.bitmap = ImageManager.loadPicture(globalImageFile);
    } else {
      this.bitmap = new Bitmap(1, 1);
    }
  };

  Sprite_CTBTicksImage.prototype.update = function () {
    Sprite.prototype.update.call(this);
    this.updateVisibility();
    this.updatePosition();
    this.updateSpin();
    this.updateImageChange();
  };

  Sprite_CTBTicksImage.prototype.updateImageChange = function () {
    if (!this._isChangingImage) return;

    var t = this._fadeTime / imageChangeDuration;

    if (t <= 0.5) {
      this.opacity = 255 * (1 - t * 2);
    } else {
      if (this.bitmap.url.indexOf(this._targetImage) === -1) {
        this.bitmap = ImageManager.loadPicture(this._targetImage);
        this.scale.x = globalImageScale;
        this.scale.y = globalImageScale;
      }
      this.opacity = 255 * ((t - 0.5) * 2);
    }

    this._fadeTime++;

    if (this._fadeTime > imageChangeDuration) {
      this._isChangingImage = false;
      this.opacity = 255;
      this._fadeTime = 0;
    }
  };

  Sprite_CTBTicksImage.prototype.updatePosition = function () {
    var targetY = imageY + SceneManager._scene.targetYOffset;
    this.x = imageX;
    this.y = lerp(this.y, targetY, verticalTransitionSpeed);
  };

  Sprite_CTBTicksImage.prototype.updateVisibility = function () {
    this.visible =
      BattleManager.isCTB() &&
      BattleManager._phase !== "start" &&
      BattleManager._phase !== "battleEnd" &&
      !SceneManager.isSceneChanging() &&
      globalImageFile;
  };

  Sprite_CTBTicksImage.prototype.updateSpin = function () {
    if (!this._isSpinning) return;
    var elapsedFrames = Graphics.frameCount - this._spinStartTime;
    var progress = Math.min(elapsedFrames / spinDuration, 1);
    // **FIXED**: Using the correct Y parameters for the bezier curve
    var cubicProgress = getBezierValue(progress, cubicBezierY1, cubicBezierY2);

    // Animate from the rotation we started at towards the next 180-degree turn.
    this.rotation = this._spinStartRotation + cubicProgress * Math.PI;

    // When the animation is complete...
    if (progress >= 1) {
      this._isSpinning = false;
      // ...snap perfectly to the final target rotation. This prevents any tilting.
      this.rotation = this._totalRotation;
    }
  };

  Sprite_CTBTicksImage.prototype.startSpin = function () {
    this._isSpinning = true;
    this._spinStartTime = Graphics.frameCount;
    // Remember the rotation where this specific spin animation should begin.
    this._spinStartRotation = this._totalRotation;
    // Set the new target by adding another 180 degrees (PI in radians).
    this._totalRotation += Math.PI;
  };

  Sprite_CTBTicksImage.prototype.startImageChange = function (
    newImage,
    newScale
  ) {
    this._isChangingImage = true;
    this._fadeTime = 0;
    this._targetImage = newImage;
    globalImageScale = newScale;
  };

  Sprite_CTBTicksImage.prototype.resetImage = function () {
    this.bitmap = ImageManager.loadPicture(globalImageFile);
    this.scale.set(globalImageScale);
    this.rotation = 0;
    this._totalRotation = 0; // Also reset our internal rotation tracker.
    this.opacity = 255;
    this._isSpinning = false;
    this._isChangingImage = false;
    this._fadeTime = 0;
  };

  // ============================================================================
  // Sprite_CTBSecondImage
  // ============================================================================

  function Sprite_CTBSecondImage() {
    this.initialize.apply(this, arguments);
  }

  Sprite_CTBSecondImage.prototype = Object.create(Sprite.prototype);
  Sprite_CTBSecondImage.prototype.constructor = Sprite_CTBSecondImage;

  Sprite_CTBSecondImage.prototype.initialize = function () {
    Sprite.prototype.initialize.call(this);
    this.scale.set(secondImageScale);
    this.anchor.set(0.5);
    this.visible = false;
    this.opacity = secondImageOpacity; // NEW
    this.z = 6;
    this.loadBitmap();
  };

  Sprite_CTBSecondImage.prototype.loadBitmap = function () {
    if (secondImageFile) {
      this.bitmap = ImageManager.loadPicture(secondImageFile);
    } else {
      this.bitmap = new Bitmap(1, 1);
    }
  };

  Sprite_CTBSecondImage.prototype.update = function () {
    Sprite.prototype.update.call(this);
    this.updateVisibility();
    this.updatePosition();
  };

  Sprite_CTBSecondImage.prototype.updatePosition = function () {
    var targetY = secondImageY + SceneManager._scene.targetYOffset;
    this.x = secondImageX;
    this.y = lerp(this.y, targetY, verticalTransitionSpeed);
  };

  Sprite_CTBSecondImage.prototype.updateVisibility = function () {
    this.visible =
      BattleManager.isCTB() &&
      BattleManager._phase !== "start" &&
      BattleManager._phase !== "battleEnd" &&
      !SceneManager.isSceneChanging() &&
      secondImageFile;
  };

  // ============================================================================
  // BattleManager Modifications
  // ============================================================================

  var _BattleManager_startBattle = BattleManager.startBattle;
  BattleManager.startBattle = function () {
    _BattleManager_startBattle.call(this);
    if (this.isCTB() && _timeAttackModeEnabled) {
      _isTimeAttackActiveInBattle = true;
      _timeAttackRemainingTicks = _timeAttackGoal;
      _timeAttackWarningTriggered = false;
      _isTimeAttackGameOver = false;
      _timeAttackModeEnabled = false;
    }
  };

  var _BattleManager_updateBattlerCTB = BattleManager.updateBattlerCTB;
  BattleManager.updateBattlerCTB = function () {
    _BattleManager_updateBattlerCTB.call(this);
    if (
      _isTimeAttackActiveInBattle &&
      (this._phase === "ctb" || this._phase === "input")
    ) {
      _timeAttackRemainingTicks--;

      if (
        !_timeAttackWarningTriggered &&
        _timeAttackWarningEventId > 0 &&
        _timeAttackRemainingTicks <= _timeAttackWarningThreshold
      ) {
        $gameTemp.reserveCommonEvent(_timeAttackWarningEventId);
        _timeAttackWarningTriggered = true;
        $gameTroop.updateInterpreter();
      }

      if (
        !_isTimeAttackGameOver &&
        _timeAttackGameOverEventId > 0 &&
        _timeAttackRemainingTicks <= 0
      ) {
        $gameTemp.reserveCommonEvent(_timeAttackGameOverEventId);
        _isTimeAttackGameOver = true;
        $gameTroop.updateInterpreter();
      }
    }
  };

  // ============================================================================
  // Scene_Battle Modifications
  // ============================================================================

  var _Scene_Battle_createSpriteset = Scene_Battle.prototype.createSpriteset;
  Scene_Battle.prototype.createSpriteset = function () {
    _Scene_Battle_createSpriteset.call(this);
    this.createCTBTicksDisplaySprites();
  };

  var _Scene_Battle_createDisplayObjects =
    Scene_Battle.prototype.createDisplayObjects;
  Scene_Battle.prototype.createDisplayObjects = function () {
    _Scene_Battle_createDisplayObjects.call(this);
    this.targetYOffset = 0;
  };

  Scene_Battle.prototype.createCTBTicksDisplaySprites = function () {
    this._timeAttackImageSprite = new Sprite_TimeAttackImage();
    this._ctbSecondImageSprite = new Sprite_CTBSecondImage();
    this._ctbTicksImageSprite = new Sprite_CTBTicksImage();
    this._ctbTicksDisplaySprite = new Sprite_CTBTicksDisplay();
    this._timeAttackDisplaySprite = new Sprite_TimeAttackDisplay();

    this.addChild(this._timeAttackImageSprite);
    this.addChild(this._ctbSecondImageSprite);
    this.addChild(this._ctbTicksImageSprite);
    this.addChild(this._ctbTicksDisplaySprite);
    this.addChild(this._timeAttackDisplaySprite);

    this._currentTurn = -1;
  };

  var _Scene_Battle_start = Scene_Battle.prototype.start;
  Scene_Battle.prototype.start = function () {
    _Scene_Battle_start.call(this);
    if (_isTimeAttackActiveInBattle && this._timeAttackDisplaySprite) {
      this._timeAttackDisplaySprite.setInitialTicks(_timeAttackRemainingTicks);
      var color = _timeAttackNextColor || taTextColor;
      this._timeAttackDisplaySprite.setColor(color);
      _timeAttackNextColor = null; // Reset for next battle
    }
  };

  var _Scene_Battle_update = Scene_Battle.prototype.update;
  Scene_Battle.prototype.update = function () {
    _Scene_Battle_update.call(this);
    this.updateCTBDisplaySpin();
    this.updateCTBPosition();
  };

  Scene_Battle.prototype.updateCTBPosition = function () {
    this.targetYOffset = this._helpWindow.visible
      ? this._helpWindow.height - 30
      : 0;
  };

  Scene_Battle.prototype.updateCTBDisplaySpin = function () {
    if (!BattleManager.isCTB()) return;
    var currentTurn = $gameTroop.turnCount();
    if (this._currentTurn !== currentTurn) {
      this._currentTurn = currentTurn;

      if (currentTurn > 1) {
        if (this._ctbTicksImageSprite) {
          this._ctbTicksImageSprite.startSpin();
        }
        if (globalSoundFile) {
          AudioManager.playSe({
            name: globalSoundFile,
            volume: globalSoundVolume,
            pitch: globalSoundPitch,
            pan: globalSoundPan,
          });
        }
      }
    }
  };

  function resetToDefaults(isAnimated) {
    globalTextColor = textColor;
    globalImageFile = imageFile;
    globalImageScale = imageScale;
    globalSoundFile = soundFile;
    globalSoundVolume = soundVolume;
    globalSoundPitch = soundPitch;
    globalSoundPan = soundPan;

    if (isAnimated && SceneManager._scene instanceof Scene_Battle) {
      var scene = SceneManager._scene;
      scene._ctbTicksDisplaySprite.setTargetColor(globalTextColor);
      scene._ctbTicksImageSprite.startImageChange(
        globalImageFile,
        globalImageScale
      );
    }
  }

  var _Scene_Battle_terminate = Scene_Battle.prototype.terminate;
  Scene_Battle.prototype.terminate = function () {
    resetToDefaults(false);
    _isTimeAttackActiveInBattle = false;
    _timeAttackWarningTriggered = false;
    _isTimeAttackGameOver = false;

    var sprites = [
      this._ctbTicksDisplaySprite,
      this._ctbTicksImageSprite,
      this._ctbSecondImageSprite,
      this._timeAttackDisplaySprite,
      this._timeAttackImageSprite,
    ];
    sprites.forEach(function (sprite) {
      if (sprite) {
        this.removeChild(sprite);
        sprite.destroy();
        sprite = null;
      }
    }, this);

    _Scene_Battle_terminate.call(this);
  };

  // ============================================================================
  // Plugin Commands
  // ============================================================================

  var _Game_Interpreter_pluginCommand =
    Game_Interpreter.prototype.pluginCommand;
  Game_Interpreter.prototype.pluginCommand = function (command, args) {
    _Game_Interpreter_pluginCommand.call(this, command, args);
    if (command === "CTB_ChangeSound") {
      globalSoundFile = String(args[0] || soundFile);
      globalSoundVolume = Number(args[1] || soundVolume);
      globalSoundPitch = Number(args[2] || soundPitch);
      globalSoundPan = Number(args[3] || soundPan);
    } else if (command === "CTB_ChangeTextColor") {
      if (SceneManager._scene instanceof Scene_Battle) {
        var newColor = String(args[0] || globalTextColor);
        SceneManager._scene._ctbTicksDisplaySprite.setTargetColor(newColor);
      }
    } else if (command === "CTB_ChangeImage") {
      if (SceneManager._scene instanceof Scene_Battle) {
        var newImageFile = String(args[0] || globalImageFile);
        var newImageScale = Number(args[1] || globalImageScale);
        SceneManager._scene._ctbTicksImageSprite.startImageChange(
          newImageFile,
          newImageScale
        );
      }
    } else if (command === "CTB_ResetDefaults") {
      if (SceneManager._scene instanceof Scene_Battle) {
        resetToDefaults(true);
      }
    } else if (command === "CTB_SetMode") {
      if (String(args[0]).toLowerCase() === "timeattack") {
        _timeAttackModeEnabled = true;
      }
    } else if (command === "CTB_SetGoal") {
      _timeAttackGoal = Number(args[0]) || 0;
    } else if (command === "CTB_ChangeTATextColor") {
      _timeAttackNextColor = String(args[0]) || taTextColor;
    } else if (command === "CTB_SetWarning") {
      _timeAttackWarningThreshold = Number(args[0]) || 0;
      _timeAttackWarningEventId = Number(args[1]) || 0;
    } else if (command === "CTB_SetGameOver") {
      _timeAttackGameOverEventId = Number(args[0]) || 0;
    }
  };
})();
