/*:
 * @plugindesc Adds an "Observe" skill that opens a battler information window in battle.
 * @author Haunter
 *
 * @help
 * This plugin allows skills to open a special observation window in battle via a script call.
 * The window pauses the battle until closed.
 *
 * To trigger the observation window from a skill:
 * - Set the skill's damage type to "None".
 * - In the damage formula box, add:
 * // Game_Temp is accessible from the damage formula and can call our function.
 * $gameTemp.startObserveMode(); 0
 *
 * The skill will consume its cost (e.g., MP) normally.
 *
 * For actors, enemies, and states, use the following notetags:
 *
 * <Observe Description>
 * Your description text here. Supports:
 * \c[x]   → Color
 * \i[x]   → Icon
 * \n      → New line
 * %1      → (States only) Remaining turns
 * %2      → (States only) State counter (Requires YEP_BuffsStatesCore.js)
 * </Observe Description>
 *
 * <Observe Picture: filename>
 * Replaces the battler sprite with a custom 240x240 image.
 * The filename should not include the file extension. Place the image in the
 * img/pictures folder.
 *
 * ============================================================================
 * NEW FUNCTIONALITY (Community Request): Locked Descriptions
 * ============================================================================
 *
 * This new feature allows you to have a hidden description for enemies that can
 * be unlocked permanently via a script call.
 *
 * New Notetag for Enemies:
 *
 * <Lock Description [ID]>
 * Your locked description text here. This text will only be shown after it has
 * been unlocked.
 * </Lock Description [ID]>
 *
 * - Replace `[ID]` with a unique number for each locked description. For
 * example: `<Lock Description 1>`, `<Lock Description 2>`, etc.
 *
 * The description supports the same text codes as the main observe description.
 *
 * To unlock a specific description permanently, use the following script call:
 *
 * $gameTemp.unlockEnemyInfo(enemyId, lockId)
 *
 * - Replace `enemyId` with the ID of the enemy whose information you want to unlock.
 * - Replace `lockId` with the number from the notetag (e.g., 1 for
 * `<Lock Description 1>`).
 * - This change is saved with the game and persists across save/load.
 * - When a locked description is unlocked, it will be added to the displayed
 * information for that enemy.
 *
 * ============================================================================
 * NEW FUNCTIONALITY (Community Request): Hidden Ally Descriptions
 * ============================================================================
 *
 * For allies, you can now add a hidden description that appears only when a
 * specific switch is ON.
 *
 * <Hidden Observe Description: Switch X>
 * Your description text here. This description will be shown after the static
 * one only if the specified switch X is ON. There will be no separate header.
 * </Hidden Observe Description>
 *
 * The descriptions support TextEX codes.
 *============================================================================*/

(function () {
  //--------------------------------------------------------------------------
  // DataManager
  //--------------------------------------------------------------------------

  const _DataManager_isDatabaseLoaded = DataManager.isDatabaseLoaded;
  DataManager.isDatabaseLoaded = function () {
    if (!_DataManager_isDatabaseLoaded.call(this)) return false;
    this.extractObserveData($dataActors);
    this.extractObserveData($dataEnemies);
    this.extractObserveData($dataStates);
    return true;
  };

  DataManager.extractObserveData = function (data) {
    for (let i = 1; i < data.length; i++) {
      if (data[i]) {
        const note = data[i].note;
        // Notetag for description
        const descRegex =
          /<Observe Description>([\s\S]*?)<\/Observe Description>/i;
        const descMatch = descRegex.exec(note);
        if (descMatch) {
          data[i].meta.observeDesc = descMatch[1].trim();
        }

        // New notetag for picture
        const picRegex = /<Observe Picture:\s*(.*?)>/i;
        const picMatch = picRegex.exec(note);
        if (picMatch) {
          data[i].meta.observePicture = picMatch[1].trim();
        }

        if (data === $dataEnemies) {
          data[i].meta.lockedDescriptions = {};
          const lockedDescRegex =
            /<Lock Description (\d+)>([\s\S]*?)<\/Lock Description \1>/gi;
          let match;
          while ((match = lockedDescRegex.exec(note)) !== null) {
            const lockId = parseInt(match[1]);
            const desc = match[2].trim();
            if (lockId > 0) {
              data[i].meta.lockedDescriptions[lockId] = desc;
            }
          }
        }

        if (data === $dataActors) {
          const hiddenDescRegex =
            /<Hidden Observe Description: Switch\s*(\d+)>([\s\S]*?)<\/Hidden Observe Description>/i;
          const hiddenMatch = hiddenDescRegex.exec(note);
          if (hiddenMatch) {
            const switchId = parseInt(hiddenMatch[1]);
            const hiddenDesc = hiddenMatch[2].trim();
            data[i].meta.hiddenObserveDesc = {
              switchId: switchId,
              text: hiddenDesc,
            };
          }
        }
      }
    }
  };

  const _Game_System_initialize = Game_System.prototype.initialize;
  Game_System.prototype.initialize = function () {
    _Game_System_initialize.call(this);
    this._haunterObservedEnemies = {};
    this._haunterUnlockedEnemyInfo = {};
  };

  const _Game_Action_apply = Game_Action.prototype.apply;
  Game_Action.prototype.apply = function (target) {
    _Game_Action_apply.call(this, target);
    if (target.isEnemy() && this.item().damage.elementId > 0) {
      const enemyId = target.enemyId();
      const elementId = this.item().damage.elementId;

      if (!$gameSystem._haunterObservedEnemies) {
        $gameSystem._haunterObservedEnemies = {};
      }
      if (!$gameSystem._haunterObservedEnemies[enemyId]) {
        $gameSystem._haunterObservedEnemies[enemyId] = {};
      }
      $gameSystem._haunterObservedEnemies[enemyId][elementId] = true;
    }
  };

  //--------------------------------------------------------------------------
  // Game_Temp
  // This is a new function to bridge the gap between the damage formula
  // and the Scene_Battle method.
  //--------------------------------------------------------------------------
  Game_Temp.prototype.startObserveMode = function () {
    // Only call the function if we are in a battle scene.
    if (SceneManager._scene instanceof Scene_Battle) {
      SceneManager._scene.startObserveMode();
    }
  };

  Game_Temp.prototype.unlockEnemyInfo = function (enemyId, lockId) {
    if (!$gameSystem._haunterUnlockedEnemyInfo) {
      $gameSystem._haunterUnlockedEnemyInfo = {};
    }

    if (!$gameSystem._haunterUnlockedEnemyInfo[enemyId]) {
      $gameSystem._haunterUnlockedEnemyInfo[enemyId] = {};
    }

    $gameSystem._haunterUnlockedEnemyInfo[enemyId][lockId] = true;
  };

  //--------------------------------------------------------------------------
  // Scene_Battle
  //--------------------------------------------------------------------------

  const _Scene_Battle_createAllWindows =
    Scene_Battle.prototype.createAllWindows;
  Scene_Battle.prototype.createAllWindows = function () {
    _Scene_Battle_createAllWindows.call(this);
    this.createObserveWindows();
  };

  const _Scene_Battle_updateBattleProcess =
    Scene_Battle.prototype.updateBattleProcess;
  Scene_Battle.prototype.updateBattleProcess = function () {
    if (this._inObserveMode) return;
    _Scene_Battle_updateBattleProcess.call(this);
  };

  Scene_Battle.prototype.startObserveMode = function () {
    this._inObserveMode = true;
    this._observeSelectWindow.refresh();
    this._observeSelectWindow.open();
    this._observeDisplayWindow.open();
    this._observeInfoWindow.open();
    this._observeSelectWindow.activate();
    this._observeSelectWindow.select(0);
    this.updateObserveWindows();
  };

  Scene_Battle.prototype.createObserveWindows = function () {
    // Select window (left)
    const selectWidth = Graphics.boxWidth / 3;
    const selectHeight = Graphics.boxHeight;

    this._observeSelectWindow = new Window_ObserveSelect(
      0,
      0,
      selectWidth,
      selectHeight
    );
    this._observeSelectWindow.setHandler(
      "cancel",
      this.onObserveCancel.bind(this)
    );
    this._observeSelectWindow.setHandler(
      "changed",
      this.updateObserveWindows.bind(this)
    );

    // Set a custom handler for the OK button to toggle scroll mode
    this._observeSelectWindow.setHandler("ok", this.onObserveOk.bind(this));
    this.addWindow(this._observeSelectWindow);

    // Display window (top right)
    const displayX = selectWidth;
    const displayY = 0;
    const displayWidth = Graphics.boxWidth - selectWidth;
    const displayHeight = Graphics.boxHeight / 2;

    this._observeDisplayWindow = new Window_ObserveDisplay(
      displayX,
      displayY,
      displayWidth,
      displayHeight
    );
    this.addWindow(this._observeDisplayWindow);

    // Info window (bottom right)
    const infoX = selectWidth;
    const infoY = displayHeight;
    const infoWidth = Graphics.boxWidth - selectWidth;
    const infoHeight = Graphics.boxHeight - displayHeight;

    this._observeInfoWindow = new Window_ObserveInfo(
      infoX,
      infoY,
      infoWidth,
      infoHeight
    );
    this.addWindow(this._observeInfoWindow);

    // Scroll handlers. These are still set on the select window but will
    // be called when we are in scroll mode.
    this._observeSelectWindow.setHandler(
      "scrollUp",
      this._observeInfoWindow.scrollUp.bind(this._observeInfoWindow)
    );
    this._observeSelectWindow.setHandler(
      "scrollDown",
      this._observeInfoWindow.scrollDown.bind(this._observeInfoWindow)
    );

    // Keep windows hidden and inactive until they are needed.
    this._observeSelectWindow.close();
    this._observeDisplayWindow.close();
    this._observeInfoWindow.close();
    this._observeSelectWindow.deactivate();
  };

  // Custom OK handler for the ObserveSelect window.
  Scene_Battle.prototype.onObserveOk = function () {
    // Play the OK sound effect
    SoundManager.playOk();
    this._observeSelectWindow.startScrollMode();
  };

  Scene_Battle.prototype.updateObserveWindows = function () {
    const battler = this._observeSelectWindow.currentBattler();
    if (!battler) return;

    this._observeDisplayWindow.setBattler(battler);

    let finalDesc = "";
    let dynamicText = "";
    const battlerData = battler.isEnemy() ? battler.enemy() : battler.actor();
    const baseDescription = battlerData.meta.observeDesc || "";

    if (battler.isActor()) {
      // --- Display Actor Stats ---
      const critRate = battler.cri * 100;
      const critMultBonus = battler.criticalMultiplierBonus();
      const critMult = (3.0 + critMultBonus) * 100;

      dynamicText += "\\c[1]Base Stats\\c[0]\n";
      dynamicText += `Attack: ${battler.atk}\n`;
      dynamicText += `Defense: ${battler.def}\n`;
      dynamicText += `Magic Attack: ${battler.mat}\n`;
      dynamicText += `Magic Defense: ${battler.mdf}\n`;
      dynamicText += `Agility: ${battler.agi}\n`;
      dynamicText += `Luck: ${battler.luk}\n`;
      dynamicText += `Crit Rate: ${critRate.toFixed(1)}%\n`;
      dynamicText += `Crit Multiplier: ${critMult.toFixed(1)}%\n`;
      dynamicText += "--------------------\n";
    } else if (battler.isEnemy()) {
      // --- Display Enemy Elemental Rates ---
      dynamicText += "\\c[1]Elemental Rates\\c[0]\n";

      // Loop through all elements
      for (let i = 1; i < $dataSystem.elements.length; i++) {
        const elementName = $dataSystem.elements[i];

        // Ensure data object exists before trying to access it
        const observedElements =
          $gameSystem._haunterObservedEnemies[battler.enemyId()];
        const isObserved = observedElements ? observedElements[i] : false;

        let rateDisplay;
        let colorCode = 0; // Default to white

        if (isObserved) {
          // If the element is observed, we can display the actual rate
          const rate = battler.elementRate(i) * 100;
          rateDisplay = `${rate.toFixed(0)}%`;

          if (rate <= 0) {
            colorCode = 8; // Grey for immunity/absorption
          } else if (rate > 0 && rate < 100) {
            colorCode = 3; // Cyan for resistance
          } else if (rate > 100) {
            colorCode = 4; // Red for weakness
          }
        } else {
          // Otherwise, it remains a mystery
          rateDisplay = "Unknown";
        }

        dynamicText += `${elementName}: \\c[${colorCode}]${rateDisplay}\\c[0]\n`;
      }
      dynamicText += "--------------------\n";
    }

    const activeStates = battler.states();
    let statesText = "";
    for (const state of activeStates) {
      if (state.meta && state.meta.observeDesc) {
        let desc = state.meta.observeDesc;

        const turns = battler.stateTurns(state.id);
        desc = desc.replace(/%1/g, turns);

        if (Imported.YEP_BuffsStatesCore) {
          const counter = battler.getStateCounter(state.id);
          // Replace %2 with the counter value, defaulting to 0 if it's undefined.
          desc = desc.replace(/%2/g, counter || 0);
        }

        statesText += `\\i[${state.iconIndex}] ${state.name}: ${desc}\n`;
      }
    }

    if (statesText) {
      dynamicText += "\\c[1]Active States\\c[0]\n";
      dynamicText += statesText;
      dynamicText += "--------------------\n";
    }

    let lockedText = "";
    if (battler.isEnemy() && battlerData.meta.lockedDescriptions) {
      const enemyId = battler.enemyId();
      const unlockedInfo = $gameSystem._haunterUnlockedEnemyInfo[enemyId] || {};
      const lockedDescriptions = battlerData.meta.lockedDescriptions;

      const sortedLockIds = Object.keys(lockedDescriptions)
        .map(Number)
        .sort((a, b) => a - b);

      sortedLockIds.forEach((lockId) => {
        const desc = lockedDescriptions[lockId];
        if (unlockedInfo[lockId]) {
          // If unlocked, show only the description text.
          lockedText += desc + "\n\n";
        } else {
          // If locked, show a header and placeholder text.
          lockedText += `\\c[4]---Locked Info ${lockId}---\\c[0]\n`;
          lockedText += "Information not yet unlocked.\n\n";
        }
      });
    }

    let hiddenAllyDesc = "";
    if (battler.isActor() && battlerData.meta.hiddenObserveDesc) {
      const hiddenData = battlerData.meta.hiddenObserveDesc;
      if ($gameSwitches.value(hiddenData.switchId)) {
        hiddenAllyDesc = "\n" + hiddenData.text + "\n\n";
      }
    }

    finalDesc = dynamicText;
    if (baseDescription) {
      finalDesc += baseDescription + "\n\n";
    }
    finalDesc += lockedText;
    finalDesc += hiddenAllyDesc;

    if (!finalDesc.trim()) {
      finalDesc = "No description available.";
    }

    this._observeInfoWindow.setText(finalDesc);
  };

  Scene_Battle.prototype.onObserveCancel = function () {
    this._observeSelectWindow.deactivate();
    this._observeSelectWindow.close();
    this._observeDisplayWindow.close();
    this._observeInfoWindow.close();
    this._inObserveMode = false;
    BattleManager.endAction();
    this._logWindow.clear();
  };

  //--------------------------------------------------------------------------
  // Window_ObserveSelect
  //--------------------------------------------------------------------------

  function Window_ObserveSelect() {
    this.initialize.apply(this, arguments);
  }

  Window_ObserveSelect.prototype = Object.create(Window_Selectable.prototype);
  Window_ObserveSelect.prototype.constructor = Window_ObserveSelect;

  Window_ObserveSelect.prototype.initialize = function (x, y, width, height) {
    Window_Selectable.prototype.initialize.call(this, x, y, width, height);
    this._battlers = [];
    this._isScrollLocked = false; // Custom state variable for new control scheme
    this.refresh();
  };

  Window_ObserveSelect.prototype.numVisibleRows = function () {
    return Math.floor(this.contentsHeight() / this.lineHeight());
  };

  Window_ObserveSelect.prototype.makeItemList = function () {
    const allies = $gameParty.battleMembers();
    const enemies = $gameTroop.members(); // include all, alive or dead
    this._battlers = allies.concat(enemies);
  };

  Window_ObserveSelect.prototype.maxItems = function () {
    return this._battlers ? this._battlers.length : 0;
  };

  Window_ObserveSelect.prototype.currentBattler = function () {
    return this.index() >= 0 ? this._battlers[this.index()] : null;
  };

  Window_ObserveSelect.prototype.drawItem = function (index) {
    const battler = this._battlers[index];
    if (battler) {
      const rect = this.itemRectForText(index);
      this.changePaintOpacity(battler.isAlive());
      this.drawText(battler.name(), rect.x, rect.y, rect.width);
      this.changePaintOpacity(true);
    }
  };

  Window_ObserveSelect.prototype.refresh = function () {
    this.makeItemList();
    this.createContents();
    this.drawAllItems();
  };

  Window_ObserveSelect.prototype.callUpdateHelp = function () {
    if (this.active) {
      this.updateHelp();
    }
  };

  Window_ObserveSelect.prototype.updateHelp = function () {
    this.callHandler("changed");
  };

  Window_ObserveSelect.prototype.processCursorMove = function () {
    // We only process cursor movements if we are NOT in scroll mode
    if (!this._isScrollLocked) {
      Window_Selectable.prototype.processCursorMove.call(this);
    }
  };

  Window_ObserveSelect.prototype.update = function () {
    if (this._isScrollLocked) {
      // In scroll mode, only handle the specific scrolling and cancel inputs.
      // This bypasses the default update, preventing cursor animation.
      this.processWheel();
      if (Input.isTriggered("up") || Input.isRepeated("up")) {
        this.callHandler("scrollUp");
      }
      if (Input.isTriggered("down") || Input.isRepeated("down")) {
        this.callHandler("scrollDown");
      }
      if (Input.isTriggered("cancel")) {
        this.processCancel();
      }
      // Added a check for touch and mouse input to allow canceling scroll mode.
      this.processTouch();
    } else {
      // Otherwise, use the default update logic for battler selection.
      Window_Selectable.prototype.update.call(this);
    }
  };

  Window_ObserveSelect.prototype.processWheel = function () {
    const threshold = 20;
    if (TouchInput.wheelY >= threshold) {
      this.callHandler("scrollDown");
    }
    if (TouchInput.wheelY <= -threshold) {
      this.callHandler("scrollUp");
    }
  };

  // New method to start the scroll mode
  Window_ObserveSelect.prototype.startScrollMode = function () {
    // Don't lock if there's no item selected
    if (this.index() < 0) return;
    this._isScrollLocked = true;
    // Do not deactivate the window so it can still process cancel
    this.refresh();
    this.updateHelp();
  };

  Window_ObserveSelect.prototype.processOk = function () {
    if (!this._isScrollLocked) {
      this.callHandler("ok");
    }
  };

  Window_ObserveSelect.prototype.processCancel = function () {
    if (this._isScrollLocked) {
      // If we are locked in scroll mode, cancel returns to selection
      this._isScrollLocked = false;
      SoundManager.playCancel();
      this.refresh();
    } else {
      // If not locked, the default cancel behavior proceeds (closes the window)
      Window_Selectable.prototype.processCancel.call(this);
    }
  };

  //--------------------------------------------------------------------------
  // Utility: Dummy Battler
  //--------------------------------------------------------------------------

  function createDummyBattler(battler) {
    let dummy;
    if (battler.isActor()) {
      dummy = new Game_Actor(battler.actorId());
    } else {
      dummy = new Game_Enemy(
        battler.enemyId(),
        battler.screenX(),
        battler.screenY()
      );
    }
    dummy._hp = battler._hp;
    dummy._mp = battler._mp;
    dummy._tp = battler._tp;
    dummy._states = battler._states.slice();
    dummy._stateTurns = Object.assign({}, battler._stateTurns);
    dummy._effectType = battler._effectType;
    dummy._effectDuration = battler._effectDuration;
    return dummy;
  }

  //--------------------------------------------------------------------------
  // Window_ObserveDisplay
  //--------------------------------------------------------------------------

  function Window_ObserveDisplay() {
    this.initialize.apply(this, arguments);
  }

  Window_ObserveDisplay.prototype = Object.create(Window_Base.prototype);
  Window_ObserveDisplay.prototype.constructor = Window_ObserveDisplay;

  Window_ObserveDisplay.prototype.initialize = function (x, y, width, height) {
    Window_Base.prototype.initialize.call(this, x, y, width, height);
    this._battler = null;
    this._battlerSprite = null;
    this._battlerPicture = null;
  };

  Window_ObserveDisplay.prototype.numVisibleRows = function () {
    return Math.floor(this.contentsHeight() / this.lineHeight());
  };

  Window_ObserveDisplay.prototype.setBattler = function (battler) {
    this._battler = battler;
    if (this._battlerSprite) this.removeChild(this._battlerSprite);
    if (this._battlerPicture) this.removeChild(this._battlerPicture);

    if (battler) {
      if (battler.isActor() && !this.isSideView()) {
        this._battlerSprite = null;
      } else {
        const pictureName = battler.isActor()
          ? battler.actor().meta.observePicture
          : battler.enemy().meta.observePicture;

        if (pictureName) {
          const bitmap = ImageManager.loadPicture(pictureName);
          this._battlerPicture = new Sprite(bitmap);
          this._battlerPicture.anchor.set(0.5, 1.0);
          this._battlerPicture.x = 140;
          this._battlerPicture.y = 363;
          this.addChild(this._battlerPicture);
        } else {
          this._battlerPicture = null;
        }
      }
    }
    this.refresh();
  };

  Window_ObserveDisplay.prototype.isSideView = function () {
    return $gameSystem.isSideView();
  };

  Window_ObserveDisplay.prototype.update = function () {
    Window_Base.prototype.update.call(this);

    // If the window is closing and we have a picture, start fading it out
    if (this.isClosing() && this._battlerPicture) {
      this._battlerPicture.opacity -= 30; // Quick fade
      if (this._battlerPicture.opacity <= 0) {
        this.removeChild(this._battlerPicture);
        this._battlerPicture = null;
      }
    }
  };

  Window_ObserveDisplay.prototype.drawHp = function (
    battler,
    x,
    y,
    width = 186
  ) {
    const color1 = this.hpGaugeColor1();
    const color2 = this.hpGaugeColor2();
    this.drawGauge(x, y, width, battler.hpRate(), color1, color2);
    this.changeTextColor(this.systemColor());
    this.drawText(TextManager.hpA, x, y, 44);
  };

  Window_ObserveDisplay.prototype.refresh = function () {
    this.contents.clear();
    if (!this._battler) return;

    // Name
    if (!this._battler.isAlive()) {
      this.changeTextColor(this.deathColor());
    }
    this.drawText(this._battler.name(), 0, 0, this.contentsWidth(), "center");
    this.resetTextColor();

    // HP Gauge
    let nextY = this.lineHeight() - 5;
    this.drawActorHp(this._battler, 10, nextY, this.contentsWidth() - 20);
    nextY += this.lineHeight() * 2;

    // MP Gauge (Added)
    if (this._battler.isActor()) {
      const mpY = nextY - this.lineHeight() - 5;
      this.drawActorMp(this._battler, 10, mpY, this.contentsWidth() - 20);
      nextY = mpY + this.lineHeight(); // Adjust the y-coordinate for the next element
    }

    // Face (actors only, non-sideview, and no custom picture)
    const hasPicture = this._battler.isActor()
      ? this._battler.actor().meta.observePicture
      : this._battler.enemy().meta.observePicture;

    if (this._battler.isActor() && !this.isSideView() && !hasPicture) {
      this.drawFace(
        this._battler.faceName(),
        this._battler.faceIndex(),
        0,
        nextY,
        144,
        144
      );
      nextY += 144 + this.lineHeight();
    }
  };

  //--------------------------------------------------------------------------
  // Window_ObserveInfo
  //--------------------------------------------------------------------------

  function Window_ObserveInfo() {
    this.initialize.apply(this, arguments);
  }

  Window_ObserveInfo.prototype = Object.create(Window_Base.prototype);
  Window_ObserveInfo.prototype.constructor = Window_ObserveInfo;

  Window_ObserveInfo.prototype.initialize = function (x, y, width, height) {
    Window_Base.prototype.initialize.call(this, x, y, width, height);
    this._text = "";
    this._scrollY = 0;
    this._totalHeight = 0;
    this._isDragging = false;
    this._touchStartY = 0;
    this._scrollStartY = 0;
  };

  // New method to check if a touch is inside the window's frame.
  Window_ObserveInfo.prototype.isTouchedInsideFrame = function () {
    const x = this.canvasToLocalX(TouchInput.x);
    const y = this.canvasToLocalY(TouchInput.y);
    return x >= 0 && y >= 0 && x < this.width && y < this.height;
  };

  Window_ObserveInfo.prototype.numVisibleRows = function () {
    return Math.floor(this.contentsHeight() / this.lineHeight());
  };

  Window_ObserveInfo.prototype.setText = function (text) {
    this._text = text;
    this._scrollY = 0;
    const textState = {
      index: 0,
      text: this.convertEscapeCharacters(this._text),
    };
    this._totalHeight = this.calcTextHeight(textState, true);
    this.refresh();
  };

  Window_ObserveInfo.prototype.refresh = function () {
    this.contents.clear();
    this.drawTextEx(
      this._text,
      this.textPadding(),
      this.textPadding() - this._scrollY
    );
  };

  Window_ObserveInfo.prototype.update = function () {
    Window_Base.prototype.update.call(this);
    this.updateArrows();
    this.processTouch();
  };

  Window_ObserveInfo.prototype.processTouch = function () {
    // Check if a touch/mouse is being used inside this window.
    if (this.isTouchedInsideFrame()) {
      if (TouchInput.isTriggered()) {
        // Start dragging if a touch begins inside the window
        this._isDragging = true;
        this._touchStartY = TouchInput.y;
        this._scrollStartY = this._scrollY;
      }
    }

    if (this._isDragging) {
      if (TouchInput.isPressed()) {
        // Update scroll position based on drag movement
        const dy = TouchInput.y - this._touchStartY;
        this._scrollY = this._scrollStartY - dy;

        // Clamp the scroll position to the valid range
        const maxScroll = Math.max(
          0,
          this._totalHeight - this.contentsHeight()
        );
        this._scrollY = this._scrollY.clamp(0, maxScroll);
        this.refresh();
      } else {
        // End dragging when touch is released
        this._isDragging = false;
      }
    }
  };

  Window_ObserveInfo.prototype.updateArrows = function () {
    const maxScroll = Math.max(0, this._totalHeight - this.contentsHeight());
    this.downArrowVisible = this._scrollY < maxScroll;
    this.upArrowVisible = this._scrollY > 0;
  };

  Window_ObserveInfo.prototype.scrollUp = function () {
    const scrollAmount = this.lineHeight();
    this._scrollY = Math.max(this._scrollY - scrollAmount, 0);
    this.refresh();
  };

  Window_ObserveInfo.prototype.scrollDown = function () {
    const scrollAmount = this.lineHeight();
    const maxScroll = Math.max(0, this._totalHeight - this.contentsHeight());
    this._scrollY = Math.min(this._scrollY + scrollAmount, maxScroll);
    this.refresh();
  };

  //--------------------------------------------------------------------------
  // CTB Compatibility
  // (No changes here)
  //--------------------------------------------------------------------------

  if (Imported.YEP_X_BattleSysCTB) {
    const _CTBIcon_isReduceOpacity = Window_CTBIcon.prototype.isReduceOpacity;
    Window_CTBIcon.prototype.isReduceOpacity = function () {
      if (SceneManager._scene._inObserveMode) return true;
      return _CTBIcon_isReduceOpacity.call(this);
    };
  }
})();
