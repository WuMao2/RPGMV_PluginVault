//=============================================================================
// MyItemCardWindow.js (Horizontal item cards + smooth scroll + mouse drag + edge arrows)
//=============================================================================
/*:
 * @plugindesc Horizontal "card" style item list for RPG Maker MV with smooth scrolling, hover lift, mouse/touch drag, and edge arrows.
 * @author Haunter
 *
 * @help
 * This plugin mirrors the behavior of a horizontal skill card list, but for
 * items (Window_ItemList). Each item is drawn as a card in a single row you
 * can scroll horizontally. It supports mouse/touch drag scrolling, hover
 * lift animation on the selected card, and optional left/right edge arrows
 * that appear only when more content is available.
 *
 * To use card images, add this notetag to the Item's note box:
 *   <Item Card: filename>
 * The file should exist at img/pictures/filename.png (or supported extension).
 * If the image is not ready yet, a fallback rectangle with the item name will
 * be drawn until it loads.
 *
 * Place this file in js/plugins and enable it via Plugin Manager.
 *
 * @param Card Width
 * @type number
 * @min 1
 * @default 180
 * @desc The width of each item card in pixels.
 *
 * @param Card Height
 * @type number
 * @min 1
 * @default 120
 * @desc The height of each item card in pixels.
 *
 * @param Card Spacing
 * @type number
 * @min 0
 * @default 10
 * @desc Horizontal spacing between cards in pixels.
 *
 * @param Card Top Offset
 * @type number
 * @default 20
 * @desc Y offset from the top of the window where cards start drawing.
 *
 * @param Cursor Image
 * @type file
 * @dir img/pictures/
 * @default ScrollArrow
 * @desc The filename (without extension) for the edge arrow indicator image.
 *
 * @param Cursor Width
 * @type number
 * @default 24
 * @desc Display width of the edge arrow in pixels.
 *
 * @param Cursor Height
 * @type number
 * @default 24
 * @desc Display height of the edge arrow in pixels.
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

  const parameters = PluginManager.parameters("HAUNTER_ItemCardWindow");
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
    if (this instanceof Window_ItemList) {
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
    function sceneHasActiveItemWindow() {
      const scene = SceneManager._scene;
      if (!scene) return false;
      for (const key in scene) {
        const val = scene[key];
        if (!val) continue;
        // check directly held window
        if (val instanceof Window_ItemList && val.active) return true;
        // check arrays of windows (some plugins store lists)
        if (Array.isArray(val)) {
          for (let i = 0; i < val.length; i++) {
            const w = val[i];
            if (w instanceof Window_ItemList && w.active) return true;
          }
        }
      }
      return false;
    }

    SoundManager.playCursor = function () {
      if (sceneHasActiveItemWindow()) {
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

  //=============================================================================
  // Window_ItemList modifications
  //=============================================================================

  const _Window_ItemList_initialize = Window_ItemList.prototype.initialize;
  Window_ItemList.prototype.initialize = function (x, y, width, height) {
    _Window_ItemList_initialize.call(this, x, y, width, height);

    // scrolling state
    this._scrollX = 0;
    this._targetScrollX = 0;
    this._scrollSpeed = 8; // larger = slower ease

    // hover/selection visual
    this._lastIndex = -1;
    this._hoverOffsets = {};

    // touch/drag state
    this._isTouched = false;
    this._isDragged = false;
    this._touchStartX = 0;
    this._touchScrollStartX = 0;

    // make window chrome invisible for clean cards look
    this.opacity = 0;
    this.backOpacity = 0;

    // edge arrows (left & right)
    this._leftArrowSprite = new Sprite(ImageManager.loadPicture(cursorImage));
    this._leftArrowSprite.anchor.set(0.5, 0.5);
    this.addChild(this._leftArrowSprite);

    this._rightArrowSprite = new Sprite(ImageManager.loadPicture(cursorImage));
    this._rightArrowSprite.anchor.set(0.5, 0.5);
    this._rightArrowSprite.scale.x = -1; // flip horizontally
    this.addChild(this._rightArrowSprite);

    this.updateArrowVisibility(true); // initial placement hidden until first update
  };

  // horizontal layout characteristics
  Window_ItemList.prototype.maxCols = function () {
    return 999;
  };
  Window_ItemList.prototype.spacing = function () {
    return cardSpacing;
  };
  Window_ItemList.prototype.itemWidth = function () {
    return cardWidth;
  };
  Window_ItemList.prototype.itemHeight = function () {
    return cardHeight;
  };

  const _ItemList_itemRect = Window_Selectable.prototype.itemRect;
  Window_ItemList.prototype.itemRect = function (index) {
    const rect = _ItemList_itemRect.call(this, index);
    rect.y += cardTopOffset;
    return rect;
  };

  Window_ItemList.prototype.contentsWidth = function () {
    const total =
      this.maxItems() * (this.itemWidth() + this.spacing()) - this.spacing();
    return Math.max(total, this.width - this.padding * 2);
  };

  Window_ItemList.prototype.maxPageItems = function () {
    return Math.ceil(
      (this.width - this.padding * 2) / (this.itemWidth() + this.spacing())
    );
  };

  //=============================================================================
  // Update loop: scroll + draw + arrows
  //=============================================================================

  const _Window_ItemList_update = Window_ItemList.prototype.update;
  Window_ItemList.prototype.update = function () {
    _Window_ItemList_update.call(this);

    this.updateScroll();

    // Clear only the visible region to avoid trails while animating hover
    this.contents.clearRect(this.origin.x, 0, this.width, this.height);

    this.updateDraw();
    this.updateArrowVisibility(false);
  };

  Window_ItemList.prototype.updateScroll = function () {
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

  Window_ItemList.prototype.updateDraw = function () {
    const viewWidth = this.width - this.padding * 2;
    const unitWidth = this.itemWidth() + this.spacing();
    const leftEdge = this.origin.x;
    const rightEdge = leftEdge + viewWidth;

    const first = Math.max(0, Math.floor(leftEdge / unitWidth) - 1);
    const last = Math.min(
      this.maxItems() - 1,
      Math.ceil(rightEdge / unitWidth) + 1
    );

    for (let i = first; i <= last; i++) this.drawItem(i);
  };

  // keep selected card in view with margins
  Window_ItemList.prototype.scrollToCursor = function () {
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

  const _Window_ItemList_select = Window_ItemList.prototype.select;
  Window_ItemList.prototype.select = function (index) {
    if (this._lastIndex !== index) {
      if (this._lastIndex >= 0) this.drawItem(this._lastIndex);
      if (index >= 0) this.drawItem(index);
      this._lastIndex = index;
    }
    _Window_ItemList_select.call(this, index);
    if (!this._isTouched) this.scrollToCursor();
  };

  //=============================================================================
  // Touch/Mouse: drag to scroll + click to select
  //=============================================================================

  Window_ItemList.prototype.processTouch = function () {
    if (this.isOpenAndActive()) {
      if (TouchInput.isCancelled()) {
        if (this.isCancelEnabled()) this.processCancel();
        return;
      }
      if (TouchInput.isTriggered() && this.isTouchedInsideFrame())
        this.onTouchStart();
      if (this._isTouched) {
        if (TouchInput.isMoved()) this.onTouchMove();
        if (TouchInput.isReleased()) this.onTouchEnd();
      }
    }
  };

  Window_ItemList.prototype.onTouchStart = function () {
    this._isTouched = true;
    this._isDragged = false;
    this._touchStartX = TouchInput.x;
    this._touchScrollStartX = this._scrollX;
  };

  Window_ItemList.prototype.onTouchMove = function () {
    const dx = TouchInput.x - this._touchStartX;
    if (Math.abs(dx) > 5) this._isDragged = true;

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

  Window_ItemList.prototype.onTouchEnd = function () {
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

  Window_ItemList.prototype.hitTest = function (x, y) {
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
        if (hitRect.contains(cx, cy)) return i;
      }
    }
    return -1;
  };

  //=============================================================================
  // Drawing
  //=============================================================================

  Window_ItemList.prototype.drawItem = function (index) {
    const item = this._data && this._data[index];
    if (!item) return;

    const rect = this.itemRect(index);
    if (this._hoverOffsets[index] === undefined) this._hoverOffsets[index] = 0;

    const targetOffset = index === this.index() ? -10 : 0;
    const currentOffset = this._hoverOffsets[index];
    const newOffset = currentOffset + (targetOffset - currentOffset) * 0.2;
    this._hoverOffsets[index] = newOffset;
    const yOffset = Math.round(newOffset);

    this.changePaintOpacity(this.isEnabled(item));

    // Note tag parsing: <Item Card: filename>
    let drew = false;
    if (item.note) {
      const match = item.note.match(/<Item\s*Card:\s*(.*?)>/i);
      if (match) {
        const filename = match[1].trim();
        const bitmap = ImageManager.loadPicture(filename);
        if (bitmap.isReady()) {
          this.contents.blt(
            bitmap,
            0,
            0,
            bitmap.width,
            bitmap.height,
            rect.x,
            rect.y + yOffset,
            rect.width,
            rect.height
          );
          drew = true;
        } else {
          bitmap.addLoadListener(this.drawItem.bind(this, index));
        }
      }
    }

    if (!drew) this.drawFallback(rect, item.name, yOffset);

    this.changePaintOpacity(true);
  };

  Window_ItemList.prototype.drawFallback = function (rect, name, yOffset) {
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

  // Hide frame/back only for this window type
  const _Window_Base__refreshAllParts = Window_Base.prototype._refreshAllParts;
  Window_Base.prototype._refreshAllParts = function () {
    _Window_Base__refreshAllParts.call(this);
    if (this instanceof Window_ItemList) {
      if (this._windowFrameSprite) this._windowFrameSprite.opacity = 0;
      if (this._windowBackSprite) this._windowBackSprite.opacity = 0;
    }
  };

  Window_ItemList.prototype._refreshCursor = function () {};
  Window_ItemList.prototype.drawCursorRect = function () {};

  //=============================================================================
  // Edge Arrows (visibility + synced idle animation)
  //=============================================================================

  Window_ItemList.prototype.updateArrowVisibility = function (initial) {
    const viewWidth = this.width - this.padding * 2;

    // can scroll left?
    const canScrollLeft = this.origin.x > 0;

    // can scroll right? (hide if last item fully visible)
    let canScrollRight = false;
    if (this.maxItems() > 0) {
      const lastIndex = this.maxItems() - 1;
      const lastRect = this.itemRect(lastIndex);
      const rightEdge = this.origin.x + viewWidth;
      // last fully visible? hide; otherwise show
      canScrollRight = lastRect.x + lastRect.width > rightEdge + 1;
    }

    // synced idle animation (both arrows same phase)
    const time = Graphics.frameCount / 30.0;
    const floatOffset = Math.sin(time) * 4; // ±4px

    // Left arrow
    this._leftArrowSprite.visible = canScrollLeft;
    if (this._leftArrowSprite.visible || initial) {
      this._leftArrowSprite.x = this.padding + cursorWidth / 2 + floatOffset;
      this._leftArrowSprite.y = this.height / 2;
      const bmp = this._leftArrowSprite.bitmap;
      if (bmp && bmp.width > 0 && bmp.height > 0) {
        this._leftArrowSprite.scale.x = cursorWidth / bmp.width;
        this._leftArrowSprite.scale.y = cursorHeight / bmp.height;
      }
    }

    // Right arrow
    this._rightArrowSprite.visible = canScrollRight;
    if (this._rightArrowSprite.visible || initial) {
      this._rightArrowSprite.x =
        this.width - this.padding - cursorWidth / 2 + floatOffset;
      this._rightArrowSprite.y = this.height / 2;
      const bmp2 = this._rightArrowSprite.bitmap;
      if (bmp2 && bmp2.width > 0 && bmp2.height > 0) {
        // negative x-scale keeps the horizontal flip
        this._rightArrowSprite.scale.x = -cursorWidth / bmp2.width;
        this._rightArrowSprite.scale.y = cursorHeight / bmp2.height;
      }
    }
  };
})();
