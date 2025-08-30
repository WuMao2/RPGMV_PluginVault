//=============================================================================
// MySkillCardWindow.js (Hover animation + fixed smooth scrolling + mouse navigation + fade effect)
//=============================================================================
/*:
 * @plugindesc RPG Maker MV Plugin that transforms the skill list into a horizontal, card-style window.
 * @author Haunter
 *
 * @help
 * This plugin redefines the `Window_SkillList` to display skills as
 * small, card-like windows in a single horizontal line. The window is
 * horizontally scrollable and features a fade-out effect on the left and right edges.
 *
 * To use:
 * 1. Save this file as `MySkillCardWindow.js` and place it in your project's
 * `js/plugins/` folder.
 * 2. Open the Plugin Manager in RPG Maker MV.
 * 3. Add this plugin to your list and activate it.
 * 4. In the Database, for each skill you want a card for, add a notetag:
 * <Skill Card: filename>
 * (e.g., <Skill Card: Fireball>)
 * Place the image file in your project's `img/pictures/` folder.
 *
 * @param Card Width
 * @desc The width of each skill card.
 * @type number
 * @default 180
 *
 * @param Card Height
 * @desc The height of each skill card.
 * @type number
 * @default 120
 *
 * @param Card Spacing
 * @desc Spacing between cards.
 * @type number
 * @default 10
 *
 * @param Card Top Offset
 * @desc Distance from the top of the window to the cards.
 * @type number
 * @default 20
 *
 * @param Fade Width
 * @desc The width of the fade-out effect on the edges in pixels.
 * @type number
 * @default 100
 *
 * @param Cursor Image
 * @desc Filename of the arrow cursor image (in img/pictures).
 * @default ScrollArrow
 *
 * @param Cursor Width
 * @desc Width of the arrow cursor.
 * @type number
 * @default 24
 *
 * @param Cursor Height
 * @desc Height of the arrow cursor.
 * @type number
 * @default 24
 *
 * @param Scroll Sound
 * @desc Filename of the sound effect for scrolling (in audio/se).
 * @type file
 * @dir audio/se/
 * @default Cursor1
 *
 * @param Scroll Sound Volume
 * @desc The volume for the scroll sound.
 * @type number
 * @default 90
 */

(function () {
  "use strict";

  const parameters = PluginManager.parameters("HAUNTER_SkillCardWindow");
  const cardWidth = Number(parameters["Card Width"] || 180);
  const cardHeight = Number(parameters["Card Height"] || 120);
  const cardSpacing = Number(parameters["Card Spacing"] || 10);
  const cardTopOffset = Number(parameters["Card Top Offset"] || 20);
  const cursorImage = String(parameters["Cursor Image"] || "ScrollArrow");
  const cursorWidth = Number(parameters["Cursor Width"] || 24);
  const cursorHeight = Number(parameters["Cursor Height"] || 24);
  const scrollSound = String(parameters["Scroll Sound"] || "Cursor1");
  const scrollSoundVolume = Number(parameters["Scroll Sound Volume"] || 90);

  const _Window_Selectable_playCursorSound =
    Window_Selectable.prototype.playCursorSound;
  Window_Selectable.prototype.playCursorSound = function () {
    if (this instanceof Window_SkillList) {
      AudioManager.playSe({
        name: scrollSound,
        pan: 0,
        pitch: 100,
        volume: scrollSoundVolume,
      });
    } else {
      _Window_Selectable_playCursorSound.call(this);
    }
  };

  (function () {
    const _SoundManager_playCursor = SoundManager.playCursor;
    function sceneHasActiveSkillWindow() {
      const scene = SceneManager._scene;
      if (!scene) return false;
      for (const key in scene) {
        const val = scene[key];
        if (!val) continue;
        // check directly held window
        if (val instanceof Window_SkillList && val.active) return true;
        // check arrays of windows (some plugins store lists)
        if (Array.isArray(val)) {
          for (let i = 0; i < val.length; i++) {
            const w = val[i];
            if (w instanceof Window_SkillList && w.active) return true;
          }
        }
      }
      return false;
    }

    SoundManager.playCursor = function () {
      if (sceneHasActiveSkillWindow()) {
        // play your custom sound instead of default
        AudioManager.playSe({
          name: scrollSound,
          pan: 0,
          pitch: 100,
          volume: scrollSoundVolume,
        });
        // debug: console.log('SoundManager.playCursor -> custom for skill list');
      } else {
        _SoundManager_playCursor.call(this);
      }
    };
  })();

  const _Window_SkillList_initialize = Window_SkillList.prototype.initialize;
  Window_SkillList.prototype.initialize = function (x, y, width, height) {
    _Window_SkillList_initialize.call(this, x, y, width, height);
    this._scrollX = 0;
    this._targetScrollX = 0;
    this._scrollSpeed = 8;
    this._lastIndex = -1;
    this._hoverOffsets = {};
    this.opacity = 0;
    this.backOpacity = 0;
    // New properties for touch/mouse input
    this._isTouched = false;
    this._isDragged = false;
    this._touchStartX = 0;
    this._touchScrollStartX = 0;

    // left arrow
    this._leftArrowSprite = new Sprite(ImageManager.loadPicture(cursorImage));
    this._leftArrowSprite.anchor.x = 0.5;
    this._leftArrowSprite.anchor.y = 0.5;
    this.addChild(this._leftArrowSprite);

    // right arrow
    this._rightArrowSprite = new Sprite(ImageManager.loadPicture(cursorImage));
    this._rightArrowSprite.anchor.x = 0.5;
    this._rightArrowSprite.anchor.y = 0.5;
    this._rightArrowSprite.scale.x = -1; // flip horizontally
    this.addChild(this._rightArrowSprite);

    this.updateArrowVisibility();
  };

  Window_SkillList.prototype.maxCols = function () {
    return 999;
  };
  Window_SkillList.prototype.spacing = function () {
    return cardSpacing;
  };
  Window_SkillList.prototype.itemWidth = function () {
    return cardWidth;
  };
  Window_SkillList.prototype.itemHeight = function () {
    return cardHeight;
  };

  Window_SkillList.prototype.itemRect = function (index) {
    const rect = Window_Selectable.prototype.itemRect.call(this, index);
    rect.y += cardTopOffset;
    return rect;
  };

  Window_SkillList.prototype.contentsWidth = function () {
    const total =
      this.maxItems() * (this.itemWidth() + this.spacing()) - this.spacing();
    return Math.max(total, this.width - this.padding * 2);
  };

  Window_SkillList.prototype.maxPageItems = function () {
    return Math.ceil(
      (this.width - this.padding * 2) / (this.itemWidth() + this.spacing())
    );
  };

  //=========================================================================
  // UPDATE LOGIC
  //=========================================================================

  const _Window_SkillList_update = Window_SkillList.prototype.update;
  Window_SkillList.prototype.update = function () {
    _Window_SkillList_update.call(this);
    this.updateScroll();
    this.contents.clearRect(this.origin.x, 0, this.width, this.height);
    this.updateDraw();
    this.updateArrowVisibility();
  };

  Window_SkillList.prototype.updateScroll = function () {
    if (!this._isTouched) {
      if (Math.abs(this._scrollX - this._targetScrollX) > 0.5) {
        const diff = this._targetScrollX - this._scrollX;
        this._scrollX += diff / this._scrollSpeed;
      } else {
        this._scrollX = this._targetScrollX;
      }
    }
    this.origin.x = Math.floor(this._scrollX);
  };

  Window_SkillList.prototype.updateDraw = function () {
    const viewWidth = this.width - this.padding * 2;
    const unitWidth = this.itemWidth() + this.spacing();
    const leftEdge = this.origin.x;
    const rightEdge = leftEdge + viewWidth;
    const first = Math.max(0, Math.floor(leftEdge / unitWidth) - 1);
    const last = Math.min(
      this.maxItems() - 1,
      Math.ceil(rightEdge / unitWidth) + 1
    );
    for (let i = first; i <= last; i++) {
      this.drawItem(i);
    }
  };

  Window_SkillList.prototype.scrollToCursor = function () {
    if (this.index() < 0) return;
    const rect = this.itemRect(this.index());
    const windowWidth = this.width - this.padding * 2;
    const leftMargin = windowWidth * 0.3;
    const rightMargin = windowWidth * 0.3;
    let target = this._targetScrollX;
    if (rect.x + rect.width > this._targetScrollX + windowWidth - rightMargin) {
      target = rect.x + rect.width - windowWidth + rightMargin;
    }
    if (rect.x < this._targetScrollX + leftMargin) {
      target = rect.x - leftMargin;
    }
    const totalContent =
      this.maxItems() * (this.itemWidth() + this.spacing()) - this.spacing();
    const maxScroll = Math.max(0, totalContent - windowWidth);
    this._targetScrollX = Math.max(0, Math.min(target, maxScroll));
  };

  /**
   * [MODIFIED] Replaces the original select method to prevent the default cursor sound.
   * This now manually handles index changes and plays the custom sound directly.
   */
  Window_SkillList.prototype.select = function (index) {
    // Manually set the index, replacing the core logic of Window_Selectable.prototype.select
    const lastIndex = this.index();
    this._index = index;

    // Redraw previous and current items for hover effect
    if (this._lastIndex !== index) {
      if (this._lastIndex >= 0) this.drawItem(this._lastIndex);
      if (index >= 0) this.drawItem(index);
      this._lastIndex = index;
    }

    // Play custom sound and update help window if selection changed
    if (this.index() !== lastIndex) {
      this.callUpdateHelp();
    }

    // Handle custom scrolling
    if (!this._isTouched) {
      this.scrollToCursor();
    }
  };

  Window_SkillList.prototype.updateArrowVisibility = function () {
    const viewWidth = this.width - this.padding * 2;
    const totalContent =
      this.maxItems() * (this.itemWidth() + this.spacing()) - this.spacing();

    // === Check left scroll ===
    const canScrollLeft = this.origin.x > 0;

    // === Check right scroll ===
    let canScrollRight = false;
    if (this.maxItems() > 0) {
      const lastIndex = this.maxItems() - 1;
      const lastRect = this.itemRect(lastIndex);
      const rightEdge = this.origin.x + viewWidth;
      canScrollRight = lastRect.x + lastRect.width > rightEdge + 1;
    }

    // === Animation (shared for both) ===
    const time = Graphics.frameCount / 30.0;
    const floatOffset = Math.sin(time) * 4; // synchronized bobbing

    // === LEFT arrow ===
    this._leftArrowSprite.visible = canScrollLeft;
    if (this._leftArrowSprite.visible) {
      this._leftArrowSprite.x = this.padding + cursorWidth / 2 + floatOffset;
      this._leftArrowSprite.y = this.height / 2;
      this._leftArrowSprite.scale.set(
        cursorWidth / this._leftArrowSprite.bitmap.width,
        cursorHeight / this._leftArrowSprite.bitmap.height
      );
    }

    // === RIGHT arrow ===
    this._rightArrowSprite.visible = canScrollRight;
    if (this._rightArrowSprite.visible) {
      this._rightArrowSprite.x =
        this.width - this.padding - cursorWidth / 2 + floatOffset;
      this._rightArrowSprite.y = this.height / 2;
      this._rightArrowSprite.scale.set(
        -cursorWidth / this._rightArrowSprite.bitmap.width,
        cursorHeight / this._rightArrowSprite.bitmap.height
      );
    }
  };

  //=========================================================================
  // TOUCH & MOUSE INPUT
  //=========================================================================

  Window_SkillList.prototype.processTouch = function () {
    if (this.isOpenAndActive()) {
      if (TouchInput.isCancelled()) {
        if (this.isCancelEnabled()) {
          this.processCancel();
        }
        return;
      }

      if (TouchInput.isTriggered() && this.isTouchedInsideFrame()) {
        this.onTouchStart();
      }
      if (this._isTouched) {
        if (TouchInput.isMoved()) {
          this.onTouchMove();
        }
        if (TouchInput.isReleased()) {
          this.onTouchEnd();
        }
      }
    }
  };

  Window_SkillList.prototype.onTouchStart = function () {
    this._isTouched = true;
    this._isDragged = false;
    this._touchStartX = TouchInput.x;
    this._touchScrollStartX = this._scrollX;
  };

  Window_SkillList.prototype.onTouchMove = function () {
    const dx = TouchInput.x - this._touchStartX;
    if (Math.abs(dx) > 5) {
      this._isDragged = true;
    }
    const newScrollX = this._touchScrollStartX - dx;
    const totalContent =
      this.maxItems() * (this.itemWidth() + this.spacing()) - this.spacing();
    const maxScroll = Math.max(
      0,
      totalContent - (this.width - this.padding * 2)
    );
    this._scrollX = Math.max(0, Math.min(newScrollX, maxScroll));
    this._targetScrollX = this._scrollX;
  };

  Window_SkillList.prototype.onTouchEnd = function () {
    this._isTouched = false;
    if (!this._isDragged) {
      const x = this.canvasToLocalX(TouchInput.x);
      const y = this.canvasToLocalY(TouchInput.y);
      const hitIndex = this.hitTest(x, y);
      if (hitIndex >= 0) {
        if (hitIndex === this.index()) {
          this.processOk();
        } else {
          this.playCursorSound();
          this.select(hitIndex);
        }
      }
    }
    this._isDragged = false;
  };

  Window_SkillList.prototype.hitTest = function (x, y) {
    if (this.isContentsArea(x, y)) {
      const cx = x - this.padding + this.origin.x;
      const cy = y - this.padding;
      for (let i = 0; i < this.maxItems(); i++) {
        const rect = this.itemRect(i);
        const yOffset = this._hoverOffsets[i] || 0;
        const hitRect = new Rectangle(
          rect.x,
          rect.y + yOffset,
          rect.width,
          rect.height
        );
        if (hitRect.contains(cx, cy)) {
          return i;
        }
      }
    }
    return -1;
  };

  //=========================================================================
  // DRAWING LOGIC
  //=========================================================================

  Window_SkillList.prototype.drawItem = function (index) {
    const skill = this._data[index];
    if (!skill) return;

    const rect = this.itemRect(index);
    if (this._hoverOffsets[index] === undefined) this._hoverOffsets[index] = 0;

    const targetOffset = index === this.index() ? -10 : 0;
    const currentOffset = this._hoverOffsets[index];
    const newOffset = currentOffset + (targetOffset - currentOffset) * 0.2;
    this._hoverOffsets[index] = newOffset;
    const yOffset = Math.round(newOffset);

    this.changePaintOpacity(this.isEnabled(skill));
    const filenameMatch = skill.note.match(/<Skill Card: (.*?)>/i);
    if (filenameMatch) {
      const filename = filenameMatch[1];
      const image = ImageManager.loadPicture(filename);
      if (image.isReady()) {
        this.contents.blt(
          image,
          0,
          0,
          image.width,
          image.height,
          rect.x,
          rect.y + yOffset,
          rect.width,
          rect.height
        );
      } else {
        image.addLoadListener(this.drawItem.bind(this, index));
        this.drawFallback(rect, skill.name, yOffset);
      }
    } else {
      this.drawFallback(rect, skill.name, yOffset);
    }
    this.changePaintOpacity(true);
  };

  Window_SkillList.prototype.drawFallback = function (rect, name, yOffset) {
    const color = "rgba(0,0,0,0.4)";
    this.contents.fillRect(
      rect.x,
      rect.y + yOffset,
      rect.width,
      rect.height,
      color
    );
    this.drawText(name, rect.x, rect.y + yOffset, rect.width, "center");
  };

  const _Window_Base__refreshAllParts = Window_Base.prototype._refreshAllParts;
  Window_Base.prototype._refreshAllParts = function () {
    _Window_Base__refreshAllParts.call(this);
    if (this instanceof Window_SkillList) {
      if (this._windowFrameSprite) this._windowFrameSprite.opacity = 0;
      if (this._windowBackSprite) this._windowBackSprite.opacity = 0;
    }
  };

  Window_SkillList.prototype._refreshCursor = function () {};
  Window_SkillList.prototype.drawCursorRect = function () {};
})();
