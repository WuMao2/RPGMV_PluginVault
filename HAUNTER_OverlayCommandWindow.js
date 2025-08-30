/*:
 * @plugindesc Main Menu Scene with 8 selectable windows, a textbox, and customizable background. Also includes random character portrait and dialogue.
 * @author: Haunter
 *
 * @help
 * Plugin Commands:
 *
 * OpenCustomMenu
 * Opens the custom Main Menu scene. The background will appear instantly,
 * while the buttons and text box will fade in after a short delay.
 *
 * SetCustomMenuBackground <ImageFileName>
 * Sets the background image for the custom main menu. The image must be
 * located in your 'img/pictures/' folder.
 * Example: SetCustomMenuBackground MyNewBackground
 *
 * @param Energy gauge image
 * @default GaugeEnergy
 * @require 1
 * @dir img/system/
 * @type file
 * @desc Energy gauge image. Load from 'img/system'.
 *
 * @param Energy gauge config
 * @default -31, -2, -4, 30
 * @desc
 * Specify Energy gauge position/width/angle.
 * Format: X, Y, Width, Angle, (deg)
 *
 * @param Lv-Gauge horizontal padding
 * @type number
 * @default 20
 * @desc Horizontal spacing between Level text and Energy Gauge.
 *
 * @param Gauge-Currency horizontal padding
 * @type number
 * @default 20
 * @desc Horizontal spacing between Energy Gauge and Currency display.
 *
 * @param Default Background Image Name
 * @type file
 * @dir img/pictures/
 * @default GreenLake
 * @desc The default background image for the custom menu. Load from 'img/pictures'.
 * This will be used if no custom background is set via plugin command.
 *
 * @param Window Fade Speed
 * @type number
 * @min 1
 * @default 32
 * @desc Speed at which the menu windows (buttons, textbox) fade in. Higher is faster.
 *
 * @param Window Fade-in Delay
 * @type number
 * @min 0
 * @default 30
 * @desc Delay in frames before windows start fading in (60 frames = 1 second).
 *
 * @param --- Character Portrait & Dialogue ---
 * @default
 *
 * @param Portrait Image Folder
 * @type string
 * @default img/pictures/
 * @desc Folder where character portrait images are stored.
 *
 * @param Portrait X Offset
 * @type number
 * @min -9999
 * @default 0
 * @desc Horizontal adjustment for the character portrait.
 *
 * @param Portrait Y Offset
 * @type number
 * @min -9999
 * @default 0
 * @desc Vertical adjustment for the character portrait.
 *
 * @param Portrait Scale
 * @type number
 * @decimals 2
 * @min 0.01
 * @default 1.00
 * @desc Scale factor for the character portrait (1.00 = 100%).
 *
 * @param Min Dialogue Interval
 * @type number
 * @min 60
 * @default 300
 * @desc Minimum frames between character dialogue appearances (60 frames = 1 second).
 *
 * @param Max Dialogue Interval
 * @type number
 * @min 60
 * @default 900
 * @desc Maximum frames between character dialogue appearances (60 frames = 1 second).
 *
 * @param Dialogue Display Duration
 * @type number
 * @min 30
 * @default 180
 * @desc How long the dialogue window stays open (in frames).
 *
 * @param Dialogue Box X
 * @type number
 * @min -9999
 * @default 10
 * @desc X position of the character dialogue box.
 *
 * @param Dialogue Box Y
 * @type number
 * @min -9999
 * @default 300
 * @desc Y position of the character dialogue box.
 *
 * @param Dialogue Box Width
 * @type number
 * @min 10
 * @default 400
 * @desc Width of the character dialogue box.
 *
 * @param Dialogue Box Height
 * @type number
 * @min 10
 * @default 100
 * @desc Height of the character dialogue box.
 *
 * @param Dialogue Character Delay
 * @type number
 * @decimals 1
 * @min 0.1
 * @default 2.0
 * @desc Number of frames before the next character appears. Higher value = slower text. (e.g., 1.0 = 1 char/frame, 2.0 = 1 char/2 frames)
 */

(function () {
  var pluginName = "HAUNTER_OverlayCommandWindow";
  var pluginParams = PluginManager.parameters(pluginName);

  // =========================================================================
  // LOCAL PLUGIN PARAMETERS AND UTILITIES FOR HAUNTER_OverlayCommandWindow.js
  // =========================================================================

  var parseConfig = function (param) {
    var configReg = /([-]?\d+),\s*([-]?\d+),\s*([-]?\d+),\s*([-]?\d+)/;
    var DefaultGaugeConfig = { x: -31, y: -2, width: -4, angle: 30 };
    var config = {
      x: DefaultGaugeConfig.x,
      y: DefaultGaugeConfig.y,
      width: DefaultGaugeConfig.width,
      angle: DefaultGaugeConfig.angle,
    };

    var match = configReg.exec(pluginParams[param]);
    if (match) {
      config.x = Number(match[1]);
      config.y = Number(match[2]);
      config.width = Number(match[3]);
      config.angle = Number(match[4]);
    }
    return config;
  };

  var HAUNTER_Params = {};
  HAUNTER_Params.gaugeImage =
    pluginParams["Energy gauge image"] || "GaugeEnergy";
  HAUNTER_Params.gaugeConfig = parseConfig("Energy gauge config");

  HAUNTER_Params.lvGaugePadding = Number(
    pluginParams["Lv-Gauge horizontal padding"] || 20
  );
  HAUNTER_Params.gaugeCurrencyPadding = Number(
    pluginParams["Gauge-Currency horizontal padding"] || 20
  );

  HAUNTER_Params.defaultBackgroundImage =
    pluginParams["Default Background Image Name"] || "GreenLake";
  HAUNTER_Params.windowFadeSpeed = Number(
    pluginParams["Window Fade Speed"] || 32
  );
  HAUNTER_Params.windowFadeInDelay = Number(
    pluginParams["Window Fade-in Delay"] || 30
  );

  // Character Portrait & Dialogue Parameters
  HAUNTER_Params.portraitImageFolder =
    pluginParams["Portrait Image Folder"] || "img/pictures/";
  HAUNTER_Params.portraitXOffset = Number(
    pluginParams["Portrait X Offset"] || 0
  );
  HAUNTER_Params.portraitYOffset = Number(
    pluginParams["Portrait Y Offset"] || 0
  );
  HAUNTER_Params.portraitScale = Number(pluginParams["Portrait Scale"] || 1.0);
  HAUNTER_Params.minDialogueInterval = Number(
    pluginParams["Min Dialogue Interval"] || 300
  );
  HAUNTER_Params.maxDialogueInterval = Number(
    pluginParams["Max Dialogue Interval"] || 900
  );
  HAUNTER_Params.dialogueDisplayDuration = Number(
    pluginParams["Dialogue Display Duration"] || 180
  );
  HAUNTER_Params.dialogueBoxX = Number(pluginParams["Dialogue Box X"] || 10);
  HAUNTER_Params.dialogueBoxY = Number(pluginParams["Dialogue Box Y"] || 300);
  HAUNTER_Params.dialogueBoxWidth = Number(
    pluginParams["Dialogue Box Width"] || 400
  );
  HAUNTER_Params.dialogueBoxHeight = Number(
    pluginParams["Dialogue Box Height"] || 100
  );
  HAUNTER_Params.dialogueCharacterDelay = Number(
    pluginParams["Dialogue Character Delay"] || 2.0
  );

  // =========================================================================
  // CORE GAUGE DRAWING UTILITIES (Copied from KMS_AltGauge.js for self-sufficiency)
  // =========================================================================

  if (!Bitmap.prototype.skewBlt) {
    Bitmap.prototype.skewBlt = function (
      source,
      slope,
      sx,
      sy,
      sw,
      sh,
      dx,
      dy,
      dw
    ) {
      slope.clamp(-90, 90);
      var offset = sh / Math.tan((Math.PI * (90 - Math.abs(slope))) / 180.0);
      var diff = offset / sh;
      if (slope >= 0) {
        dx += Math.round(offset);
        diff = -diff;
      }

      for (var i = 0; i < sh; ++i) {
        this.blt(
          source,
          sx,
          sy + i,
          sw,
          1,
          dx + Math.round(diff * i),
          dy + i,
          dw
        );
      }
    };
  }

  if (!Window_Base.prototype._getEnergyGaugeBitmap) {
    Window_Base.prototype._getEnergyGaugeBitmap = function () {
      return ImageManager.loadBitmap("img/system/", HAUNTER_Params.gaugeImage);
    };
  }

  // =========================================================================
  // HELPER FUNCTIONS
  // =========================================================================

  /**
   * Selects an item from a weighted array.
   * Array items should have a 'weight' property (number).
   * @param {Array<Object>} items An array of objects, each with a 'weight' property.
   * @returns {Object|null} The randomly selected item, or null if array is empty or no valid weights.
   */
  function selectWeightedRandom(items) {
    if (!items || items.length === 0) {
      return null;
    }

    let totalWeight = 0;
    for (let i = 0; i < items.length; i++) {
      totalWeight += items[i].weight || 0;
    }

    if (totalWeight <= 0) {
      // If total weight is 0 or less, fallback to uniform random selection
      // of items that actually have a text/voicelineFile.
      const validItems = items.filter(
        (item) => item.text || item.voicelineFile
      );
      if (validItems.length > 0) {
        return validItems[Math.floor(Math.random() * validItems.length)];
      }
      return null; // No valid items to select
    }

    let random = Math.random() * totalWeight;
    for (let i = 0; i < items.length; i++) {
      random -= items[i].weight || 0;
      if (random <= 0) {
        return items[i];
      }
    }

    // Fallback in case of floating point inaccuracies or if random ends up exactly 0
    return items[items.length - 1];
  }

  // =========================================================================
  // MAIN PLUGIN LOGIC
  // =========================================================================

  // --- Game_System: Initialize custom background image storage ---
  var _Game_System_initialize = Game_System.prototype.initialize;
  Game_System.prototype.initialize = function () {
    _Game_System_initialize.apply(this, arguments);
    this._customMenuBgImage = null; // Stores the image name set by plugin command
  };

  // -----------------------------
  // Plugin Commands
  // -----------------------------
  const _Game_Interpreter_pluginCommand =
    Game_Interpreter.prototype.pluginCommand;
  Game_Interpreter.prototype.pluginCommand = function (command, args) {
    _Game_Interpreter_pluginCommand.call(this, command, args);
    if (command === "OpenCustomMenu") {
      SceneManager.push(Scene_CustomMainMenu);
    } else if (command === "SetCustomMenuBackground") {
      // Store the new background image name in Game_System
      if (args[0]) {
        $gameSystem._customMenuBgImage = String(args[0]);
      } else {
        // If no argument, clear the custom background, fall back to default
        $gameSystem._customMenuBgImage = null;
      }
    }
  };

  // -----------------------------
  // Sprite_PartyMemberPortrait
  // Handles displaying a character's menu portrait
  // -----------------------------
  function Sprite_PartyMemberPortrait() {
    this.initialize.apply(this, arguments);
  }

  Sprite_PartyMemberPortrait.prototype = Object.create(Sprite.prototype);
  Sprite_PartyMemberPortrait.prototype.constructor = Sprite_PartyMemberPortrait;

  Sprite_PartyMemberPortrait.prototype.initialize = function (actorData) {
    Sprite.prototype.initialize.call(this);
    this._actorData = null;
    this.anchor.x = 0.5; // Center anchor for scaling/positioning ease
    this.anchor.y = 1.0; // Anchor at the bottom center
    this.setActorData(actorData);
  };

  Sprite_PartyMemberPortrait.prototype.setActorData = function (actorData) {
    if (this._actorData !== actorData) {
      this._actorData = actorData;
      if (actorData && actorData.imageName) {
        this.bitmap = ImageManager.loadBitmap(
          HAUNTER_Params.portraitImageFolder,
          actorData.imageName
        );
      } else {
        this.bitmap = null;
      }
      this.updatePositionAndScale();
    }
  };

  Sprite_PartyMemberPortrait.prototype.update = function () {
    Sprite.prototype.update.call(this);
    // You can add animation or other updates here if needed
  };

  Sprite_PartyMemberPortrait.prototype.updatePositionAndScale = function () {
    if (this.bitmap) {
      // Position relative to screen center bottom + offsets
      this.x = Graphics.boxWidth / 2 + HAUNTER_Params.portraitXOffset;
      this.y = Graphics.boxHeight + HAUNTER_Params.portraitYOffset; // Bottom of the screen + offset
      this.scale.x = HAUNTER_Params.portraitScale;
      this.scale.y = HAUNTER_Params.portraitScale;
    }
  };

  // -----------------------------
  // Window_CharacterDialogue
  // Handles displaying random character dialogue
  // -----------------------------
  function Window_CharacterDialogue() {
    this.initialize.apply(this, arguments);
  }

  Window_CharacterDialogue.prototype = Object.create(Window_Base.prototype);
  Window_CharacterDialogue.prototype.constructor = Window_CharacterDialogue;

  Window_CharacterDialogue.prototype.initialize = function () {
    var x = HAUNTER_Params.dialogueBoxX;
    var y = HAUNTER_Params.dialogueBoxY;
    var width = HAUNTER_Params.dialogueBoxWidth;
    var height = HAUNTER_Params.dialogueBoxHeight;
    Window_Base.prototype.initialize.call(this, x, y, width, height);
    this._text = "";
    this._displayDuration = 0;
    this._shownCharacters = 0; // Tracks the number of characters currently displayed
    this._frameCount = 0; // New: Frame counter for delay
    this.openness = 0; // Start completely closed
    this.hide(); // Also hide the window itself
  };

  // Modified to accept a phrase object (which now includes voicelineFile and weight)
  Window_CharacterDialogue.prototype.setPhrase = function (phrase) {
    const newText = phrase ? phrase.text : "";
    const voicelineFile = phrase ? phrase.voicelineFile : null;

    if (this._text !== newText) {
      this._text = newText;
      this._shownCharacters = 0; // Reset shown characters for new text
      this._frameCount = 0; // Reset frame counter
      this.refresh();
      this._displayDuration = HAUNTER_Params.dialogueDisplayDuration;
      this.show(); // Make sure window is visible when text is set
      this.open(); // Start opening animation

      // Play voiceline if available
      this.playVoiceline(voicelineFile);
    }
  };

  // New method to handle voiceline playback
  Window_CharacterDialogue.prototype.playVoiceline = function (voicelineFile) {
    // Stop any current SE playing to prevent overlap (optional, but good practice for voices)
    AudioManager.stopSe();

    if (voicelineFile) {
      this.playCustomAudio(voicelineFile);
    }
  };

  // NEW: Custom function to play audio with a hardcoded path
  Window_CharacterDialogue.prototype.playCustomAudio = function (
    fileName,
    volume = 90,
    pitch = 100,
    pan = 0
  ) {
    if (!fileName) {
      return;
    }

    // Hardcode the path to audio/se
    const url = "audio/se/" + fileName;

    // Determine the audio extension based on browser support
    const ext = WebAudio.canPlayOgg() ? ".ogg" : ".m4a";
    const finalUrl = url + ext;

    const audio = new WebAudio(finalUrl);
    audio.volume = volume / 100;
    audio.pitch = pitch / 100;
    audio.pan = pan / 100;
    audio.play(false); // Play without looping

    // Store the currently playing audio for stopping
    this._currentVoicelineAudio = audio;
  };

  // Alias stopSe to also stop our custom audio
  const _AudioManager_stopSe = AudioManager.stopSe;
  AudioManager.stopSe = function () {
    _AudioManager_stopSe.apply(this, arguments);
    // Check if SceneManager has a current scene and that scene has a dialogue window with custom audio
    if (
      SceneManager._scene &&
      SceneManager._scene._dialogueWindow &&
      SceneManager._scene._dialogueWindow._currentVoicelineAudio
    ) {
      SceneManager._scene._dialogueWindow._currentVoicelineAudio.stop();
      SceneManager._scene._dialogueWindow._currentVoicelineAudio = null;
    }
  };

  Window_CharacterDialogue.prototype.refresh = function () {
    this.contents.clear();
    if (this._text) {
      // Draw only the portion of the text that has been revealed
      const displayedText = this._text.substring(
        0,
        Math.floor(this._shownCharacters)
      );
      this.drawTextEx(displayedText, 0, 0);
    }
  };

  Window_CharacterDialogue.prototype.update = function () {
    Window_Base.prototype.update.call(this);

    // Update text display (letter by letter)
    if (this._text && this._shownCharacters < this._text.length) {
      this._frameCount++;
      if (this._frameCount >= HAUNTER_Params.dialogueCharacterDelay) {
        this._shownCharacters++;
        this._frameCount = 0; // Reset frame count for the next character
        this.refresh(); // Refresh to draw more characters
      }
    }

    if (this.isOpen()) {
      // Only start counting down display duration when text is fully displayed
      if (this._text && this._shownCharacters >= this._text.length) {
        if (this._displayDuration > 0) {
          this._displayDuration--;
        } else if (this.isClosed()) {
          // If already closed, reset text to prevent re-opening
          this._text = "";
          // Ensure voiceline stops when dialogue closes, even if not clicked away
          if (this._currentVoicelineAudio) {
            this._currentVoicelineAudio.stop();
            this._currentVoicelineAudio = null;
          }
        } else if (this._displayDuration <= 0 && this.openness === 255) {
          // Only start closing when fully open and duration expired
          this.close();
        }
      }
    } else if (this.isClosed() && this.openness === 0 && this.visible) {
      // If fully closed and still visible (shouldn't happen with hide() but a safeguard)
      this.hide();
      this._text = ""; // Clear text to prevent immediate re-display
      // Ensure voiceline stops if dialogue hides
      if (this._currentVoicelineAudio) {
        this._currentVoicelineAudio.stop();
        this._currentVoicelineAudio = null;
      }
    }
  };

  // -----------------------------
  // Scene_CustomMainMenu
  // -----------------------------
  function Scene_CustomMainMenu() {
    this.initialize.apply(this, arguments);
  }

  Scene_CustomMainMenu.prototype = Object.create(Scene_MenuBase.prototype);
  Scene_CustomMainMenu.prototype.constructor = Scene_CustomMainMenu;

  var _Scene_CustomMainMenu_start_HAUNTER =
    Scene_CustomMainMenu.prototype.start;
  Scene_CustomMainMenu.prototype.start = function () {
    _Scene_CustomMainMenu_start_HAUNTER.apply(this, arguments);
    this._fadeDuration = 0;
    this.updateFade();

    this._windowFadeCountdown = HAUNTER_Params.windowFadeInDelay;
    this._windowFadeDuration = Math.round(255 / HAUNTER_Params.windowFadeSpeed);
    if (this._windowFadeDuration < 1) this._windowFadeDuration = 1;

    // Determine the party member for the menu when the scene starts
    this.determineMenuPartyMember();
    // Initialize dialogue timer immediately after setting the character
    this._dialogueTimer =
      Math.randomInt(
        HAUNTER_Params.maxDialogueInterval - HAUNTER_Params.minDialogueInterval
      ) + HAUNTER_Params.minDialogueInterval;
  };

  // New function to determine the party member for the menu
  Scene_CustomMainMenu.prototype.determineMenuPartyMember = function () {
    if (!this._portraitSprite) return;

    // Check if the character data array is defined by the separate plugin
    if (
      typeof HAUNTER_MenuCharacterData === "undefined" ||
      !Array.isArray(HAUNTER_MenuCharacterData)
    ) {
      // console.warn('HAUNTER_MenuCharacterData is not defined or is not an array. Please ensure HAUNTER_MenuCharacterData.js is enabled and placed above this plugin.');
      this._portraitSprite.setActorData(null); // Clear portrait if data is missing
      this._currentMenuActorData = null; // Also clear the internal reference
      return;
    }

    // Get all active party members
    const partyMembers = $gameParty.members();
    const availableCharacters = HAUNTER_MenuCharacterData.filter((data) =>
      partyMembers.some((actor) => actor.actorId() === data.actorId)
    );

    let selectedActorData = null;
    if (availableCharacters.length > 0) {
      // Randomly select one character from the available characters in the party
      const randomIndex = Math.floor(
        Math.random() * availableCharacters.length
      );
      selectedActorData = availableCharacters[randomIndex];
    }

    this._currentMenuActorData = selectedActorData; // Store the selected actor data
    this._portraitSprite.setActorData(selectedActorData);
  };

  Scene_CustomMainMenu.prototype.createBackground = function () {
    Scene_MenuBase.prototype.createBackground.call(this);

    if (this._backgroundSprite) {
      this.removeChild(this._backgroundSprite);
      this._backgroundSprite = null;
    }

    this._customBackgroundSprite = new Sprite();
    var bgImageName =
      $gameSystem._customMenuBgImage || HAUNTER_Params.defaultBackgroundImage;
    this._customBackgroundSprite.bitmap = ImageManager.loadPicture(bgImageName);
    this._customBackgroundSprite.width = Graphics.boxWidth;
    this._customBackgroundSprite.height = Graphics.boxHeight;
    this.addChild(this._customBackgroundSprite);
  };

  Scene_CustomMainMenu.prototype.create = function () {
    Scene_MenuBase.prototype.create.call(this); // This creates _windowLayer (default z=8) and adds it to the scene.

    // Create a container for the character portrait and dialogue
    // Insert it BEFORE the window layer instead of after
    this._characterContainer = new Sprite();

    // Find the index of the window layer
    var windowLayerIndex = this.children.indexOf(this._windowLayer);

    // Insert the character container before the window layer
    this.addChildAt(this._characterContainer, windowLayerIndex);

    this._portraitSprite = new Sprite_PartyMemberPortrait(null); // Will be set later
    this._characterContainer.addChild(this._portraitSprite);

    this._dialogueWindow = new Window_CharacterDialogue();
    this._characterContainer.addChild(this._dialogueWindow);

    // Rest of your weather code...
    if (Imported.MOG_Weather_EX) {
      this._weatherField_1 = new Sprite();
      this._weatherField_1.z = Moghunter.weatherEX_layer1;
      this.addChild(this._weatherField_1);

      this._weatherField_2 = new Sprite();
      this._weatherField_2.z = Moghunter.weatherEX_layer2;
      this.addChild(this._weatherField_2);

      this._weatherField_3 = new Sprite();
      this._weatherField_3.z = Moghunter.weatherEX_layer3;
      this.addChild(this._weatherField_3);

      this.reloadWeatherEX();
    }

    // Rest of your button creation code remains the same...
    this._buttons = [];
    const buttonTexts = [
      "\\I[189]  Story",
      "  \\I[190]  Dungeon",
      "\\I[6]  Seek  ",
      "  \\I[209]  Bag",
      "\\I[13]  Heroes",
      "  \\I[83]",
    ];

    const positions = [
      {
        x: 10,
        y: 440,
        w: 270,
        h: 270,
      }, // Square
      {
        x: 290,
        y: 610,
        w: 237,
        h: 100,
      },
      {
        x: 537,
        y: 610,
        w: 237,
        h: 100,
      },
      {
        x: 784,
        y: 610,
        w: 237,
        h: 100,
      },
      {
        x: 1031,
        y: 610,
        w: 237,
        h: 100,
      },
      {
        x: 1185,
        y: 10,
        w: 85,
        h: 85,
      },
    ];

    for (let i = 0; i < 6; i++) {
      const rect = positions[i];
      const win = new Window_MainMenuButton(rect, i + 1, buttonTexts[i]);
      win.openness = 0; // Start completely invisible
      win._scene = this;
      this.padding = 8;
      this.addWindow(win);
      this._buttons.push(win);
      win.deactivate();
    }

    this._textbox = new Window_CustomTextBox(
      10,
      10,
      Graphics.boxWidth - 115,
      85
    );
    this._textbox.openness = 0; // Start completely invisible
    this.addWindow(this._textbox);

    this._selectedIndex = 0;
    this.activateButton(this._selectedIndex);
  };

  Scene_CustomMainMenu.prototype.activateButton = function (index) {
    if (
      this._selectedIndex >= 0 &&
      this._selectedIndex < this._buttons.length
    ) {
      this._buttons[this._selectedIndex].deactivate();
    }
    this._selectedIndex = index;
    if (
      this._selectedIndex >= 0 &&
      this._selectedIndex < this._buttons.length
    ) {
      this._buttons[this._selectedIndex].activate();
    }
  };

  Scene_CustomMainMenu.prototype.update = function () {
    Scene_MenuBase.prototype.update.call(this);
    if (!this._buttons) return;

    // Handle initial window fade-in delay
    if (this._windowFadeCountdown > 0) {
      this._windowFadeCountdown--;
      if (this._windowFadeCountdown === 0) {
        this._buttons.forEach((button) => {
          button.openness = 0; // Ensure starts from 0 for open()
          button.open(this._windowFadeDuration);
        });
        this._textbox.openness = 0; // Ensure starts from 0 for open()
        this._textbox.open(this._windowFadeDuration);
      }
    }

    // Refresh textbox on update to keep values live
    if (this._textbox && this._textbox.isOpen()) {
      this._textbox.refresh();
    }

    // Dialogue updates still happen every frame for timing and display logic
    this.updateCharacterDialogue();

    if (Imported.MOG_Weather_EX) {
      if (this._weatherField_1) this._weatherField_1.update();
      if (this._weatherField_2) this._weatherField_2.update();
      if (this._weatherField_3) this._weatherField_3.update();
    }

    // Input handling only if windows are fully open (prevents input during fade-in)
    if (this._windowFadeCountdown === 0 && this._buttons[0].isOpen()) {
      if (Input.isRepeated("right")) {
        const newIndex = (this._selectedIndex + 1) % this._buttons.length;
        this.activateButton(newIndex);
        SoundManager.playCursor();
      } else if (Input.isRepeated("left")) {
        const newIndex =
          (this._selectedIndex + this._buttons.length - 1) %
          this._buttons.length;
        this.activateButton(newIndex);
        SoundManager.playCursor();
      } else if (Input.isTriggered("ok")) {
        this._buttons[this._selectedIndex].callCommonEvent();
        SoundManager.playOk();
      }

      for (let i = 0; i < this._buttons.length; i++) {
        if (this._buttons[i].isHovered() && TouchInput.isTriggered()) {
          this.activateButton(i);
          this._buttons[i].callCommonEvent();
          SoundManager.playOk();
          break;
        }
      }
    }
  };

  Scene_CustomMainMenu.prototype.updateCharacterDialogue = function () {
    if (!this._dialogueWindow || !this._currentMenuActorData) return; // No dialogue window or no character selected

    // Check if the character data array is defined by the separate plugin
    if (
      typeof HAUNTER_MenuCharacterData === "undefined" ||
      !Array.isArray(HAUNTER_MenuCharacterData)
    ) {
      return; // No character data to process dialogue
    }

    // Check if dialogue window is currently closing
    if (this._dialogueWindow.isClosing()) {
      // Do nothing while it's closing, wait for it to be fully closed.
      return;
    }

    // If dialogue window is fully closed, decrement timer for next dialogue
    if (this._dialogueWindow.isClosed()) {
      this._dialogueTimer--;
      if (this._dialogueTimer <= 0) {
        // Time to show a new dialogue from the CURRENTLY selected character
        const characterPhrases = this._currentMenuActorData.phrases;

        if (characterPhrases && characterPhrases.length > 0) {
          // Select a phrase from the chosen character based on weighted probability
          const selectedPhrase = selectWeightedRandom(characterPhrases);

          if (selectedPhrase) {
            this._dialogueWindow.setPhrase(selectedPhrase); // Pass the entire phrase object
          }
        }

        // Reset timer for next dialogue
        this._dialogueTimer =
          Math.randomInt(
            HAUNTER_Params.maxDialogueInterval -
              HAUNTER_Params.minDialogueInterval
          ) + HAUNTER_Params.minDialogueInterval;
      }
    }
  };

  Scene_CustomMainMenu.prototype.reloadWeatherEX = function () {
    this._weatherEXSprites = [];

    for (var i = 0; i < $gameSystem._weatherEX_Data.length; i++) {
      if (
        $gameSystem._weatherEX_Data[i] &&
        $gameSystem._weatherEX_Data[i].mode >= 0
      ) {
        var sprite = new SpriteWeatherEX(i);
        sprite.z = i + 10;

        if ($gameSystem._weatherEX_Data[i].z === 0) {
          this._weatherField_1.addChild(sprite);
        } else if ($gameSystem._weatherEX_Data[i].z === 1) {
          this._weatherField_2.addChild(sprite);
        } else {
          this._weatherField_3.addChild(sprite);
        }
        this._weatherEXSprites[i] = sprite;
      }
    }
  };

  Scene_CustomMainMenu.prototype.terminate = function () {
    Scene_MenuBase.prototype.terminate.call(this);

    // Clean up character container and its children
    if (this._characterContainer) {
      this.removeChild(this._characterContainer);
      this._characterContainer = null;
      this._portraitSprite = null;
      if (this._dialogueWindow) {
        // Stop any playing voiceline when scene terminates
        if (this._dialogueWindow._currentVoicelineAudio) {
          this._dialogueWindow._currentVoicelineAudio.stop();
          this._dialogueWindow._currentVoicelineAudio = null;
        }
        this._dialogueWindow = null;
      }
    }
    // Clear the current menu actor data when the scene terminates
    this._currentMenuActorData = null;

    if (Imported.MOG_Weather_EX) {
      if (this._weatherEXSprites) {
        for (let i = 0; i < this._weatherEXSprites.length; i++) {
          if (this._weatherEXSprites[i]) {
            this._weatherEXSprites[i].destroy();
          }
        }
      }
      if (this._weatherField_1) this.removeChild(this._weatherField_1);
      if (this._weatherField_2) this.removeChild(this._weatherField_2);
      if (this._weatherField_3) this.removeChild(this._weatherField_3);
    }
  };

  // -----------------------------
  // Window_MainMenuButton
  // -----------------------------
  function Window_MainMenuButton() {
    this.initialize.apply(this, arguments);
  }

  Window_MainMenuButton.prototype = Object.create(Window_Selectable.prototype);
  Window_MainMenuButton.prototype.constructor = Window_MainMenuButton;

  Window_MainMenuButton.prototype.initialize = function (rect, buttonId, text) {
    Window_Selectable.prototype.initialize.call(
      this,
      rect.x,
      rect.y,
      rect.w,
      rect.h
    );
    this._buttonId = buttonId;
    this._buttonText = text;
    this.select(0);
    this.refresh();
  };

  Window_MainMenuButton.prototype.maxItems = function () {
    return 1;
  };
  Window_MainMenuButton.prototype.drawItem = function (index) {
    this.contents.clear();
    const text = this._buttonText;
    const textWidth = this.textWidth(text);

    const textXOffset = 10;
    const textYOffset = -5;

    const x = (this.contentsWidth() - textWidth) / 2 + textXOffset;
    const y = this.contents.height / 2 - 12 + textYOffset;
    this.drawTextEx(text, x, y);
  };

  Window_MainMenuButton.prototype.updateCursor = function () {
    if (this.active && this._index >= 0) {
      this.setCursorRect(0, 0, this.width, this.height);
    } else {
      this.setCursorRect(0, 0, 0, 0);
    }
  };

  Window_MainMenuButton.prototype.isHovered = function () {
    const x = TouchInput.x;
    const y = TouchInput.y;
    return (
      x >= this.x &&
      x < this.x + this.width &&
      y >= this.y &&
      y < this.y + this.height
    );
  };

  Window_MainMenuButton.prototype.callCommonEvent = function () {
    const id = this._buttonId;
    if ($dataCommonEvents[id]) {
      $gameTemp.reserveCommonEvent(id);
      SceneManager.pop();
    }
  };

  // -----------------------------
  // Textbox Window
  // -----------------------------
  function Window_CustomTextBox() {
    this.initialize.apply(this, arguments);
  }

  Window_CustomTextBox.prototype = Object.create(Window_Base.prototype);
  Window_CustomTextBox.prototype.constructor = Window_CustomTextBox;

  Window_CustomTextBox.prototype.initialize = function (x, y, w, h) {
    Window_Base.prototype.initialize.call(this, x, y, w, h);
    this.refresh();
  };

  Window_CustomTextBox.prototype.drawEnergyGaugeCustom = function (
    x,
    y,
    width,
    rate
  ) {
    const config = HAUNTER_Params.gaugeConfig;
    x += config.x;
    y += config.y;
    width += config.width;

    const grid = 32;
    const fillW = Math.floor(width * rate);
    const bitmap = this._getEnergyGaugeBitmap();

    if (!bitmap.isReady()) {
      bitmap.addLoadListener(this.refresh.bind(this));
      return;
    }

    const gaugeW = bitmap.width / 2;
    const gaugeH = bitmap.height / 3;

    const gaugeY = y;

    // Background
    this.contents.skewBlt(bitmap, config.angle, 0, 0, grid, gaugeH, x, gaugeY);
    this.contents.skewBlt(
      bitmap,
      config.angle,
      grid,
      0,
      gaugeW,
      gaugeH,
      x + grid,
      gaugeY,
      width
    );
    this.contents.skewBlt(
      bitmap,
      config.angle,
      grid + gaugeW,
      0,
      grid,
      gaugeH,
      x + width + grid,
      gaugeY
    );

    // Fill
    const gw = (gaugeW * fillW) / width;
    this.contents.skewBlt(
      bitmap,
      config.angle,
      0,
      gaugeH,
      gw,
      gaugeH,
      x + grid,
      gaugeY,
      fillW
    );
  };

  Window_CustomTextBox.prototype.refresh = function () {
    this.contents.clear();

    // --- Configuration for your variables and icons ---
    const LEVEL_VARIABLE_ID = 8; // <<< REPLACE with your Level variable ID
    const ENERGY_GAUGE_VARIABLE_ID = 7; // <<< REPLACE with your Energy Gauge value variable ID
    const ENERGY_GAUGE_MAX_VALUE = 200;
    const ICON_GEMS_ID = 161; // <<< REPLACE with your Energy Icon ID (example: 70 for crystal)
    const ICON_CURRENCY_ID = 314; // <<< REPLACE with your Currency Icon ID (example: 164 for gold coin)
    const GEMS_CURRENCY_VARIABLE_ID = 17;

    const currentLevel = $gameVariables.value(LEVEL_VARIABLE_ID);
    const currentEnergyValue = $gameVariables.value(ENERGY_GAUGE_VARIABLE_ID);
    const currentCurrency = $gameParty.gold();
    const currentGems = $gameVariables.value(GEMS_CURRENCY_VARIABLE_ID);

    const energyGaugeRate = Math.min(
      currentEnergyValue / ENERGY_GAUGE_MAX_VALUE,
      1.0
    );

    let currentX = this.textPadding();
    const verticalOffset = 5;
    const textY = 0 + verticalOffset;

    // 1. Draw "Lv: X"
    const lvText = `Lv: ${currentLevel}`;
    this.drawTextEx(lvText, currentX, textY);
    currentX += this.textWidth(lvText) + HAUNTER_Params.lvGaugePadding;

    // 2. Draw Energy Gauge and its value (x/200)
    const gaugeVisualWidth = 210;
    const gaugeValueText = `${currentEnergyValue}/${ENERGY_GAUGE_MAX_VALUE}`;

    this.drawEnergyGaugeCustom(
      currentX,
      textY,
      gaugeVisualWidth,
      energyGaugeRate
    );

    this.changeTextColor(this.normalColor());
    this.drawText(gaugeValueText, currentX, textY, gaugeVisualWidth, "center");

    currentX += gaugeVisualWidth + HAUNTER_Params.gaugeCurrencyPadding;

    // 3. Draw Energy Icon and Currency Icon/Value
    const energyCurrencyText = `\\I[${ICON_GEMS_ID}] ${currentGems}  \\I[${ICON_CURRENCY_ID}] ${currentCurrency}`;
    this.drawTextEx(energyCurrencyText, currentX, textY);
  };
})();
