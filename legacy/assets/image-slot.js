/*
 * <image-slot> — standalone, dependency-free image placeholder.
 *
 * A lightweight reimplementation of the design-code <image-slot> element so
 * the landing page renders without the Claude design runtime. It shows a warm
 * branded placeholder until an image is provided, and supports:
 *
 *   src          Optional image URL to display.
 *   shape        'rect' | 'rounded' | 'circle' | 'pill'   (default 'rounded')
 *   radius       Corner radius in px for 'rounded'.        (default 12)
 *   fit          object-fit: cover | contain | fill.       (default 'cover')
 *   position     object-position for the image.            (default '50% 50%')
 *   placeholder  Empty-state caption.
 *
 * Size/layout come from ordinary CSS on the element (width/height inline or a
 * parent grid). As a convenience, clicking or dropping an image file fills the
 * slot for the current session (not persisted) so the page can be previewed
 * with real imagery.
 */
(function () {
  'use strict';

  var ACCEPT = 'image/png,image/jpeg,image/webp,image/avif,image/gif';

  var CSS =
    ':host{display:inline-block;position:relative;vertical-align:top;width:240px;height:160px;' +
    '  font-family:Archivo,system-ui,-apple-system,sans-serif}' +
    '.frame{position:absolute;inset:0;overflow:hidden;' +
    '  background:linear-gradient(135deg,#EDE2D2 0%,#E7D6C4 48%,#F0CDBA 100%)}' +
    '.frame::after{content:"";position:absolute;inset:0;' +
    '  background:radial-gradient(70% 60% at 30% 20%,' +
    '    color-mix(in srgb,var(--lc-accent,#FF6B00) 16%,transparent),transparent 60%)}' +
    '.frame img{position:absolute;inset:0;width:100%;height:100%;display:block;z-index:2}' +
    '.empty{position:absolute;inset:0;z-index:1;display:flex;flex-direction:column;' +
    '  align-items:center;justify-content:center;gap:12px;text-align:center;padding:20px;' +
    '  box-sizing:border-box;cursor:pointer;color:#8a7a64}' +
    '.empty .ic{width:46px;height:46px;border-radius:50%;display:flex;align-items:center;' +
    '  justify-content:center;background:rgba(255,255,255,.6);' +
    '  box-shadow:0 10px 28px -16px rgba(60,40,20,.5)}' +
    '.empty .cap{font-size:13px;font-weight:600;letter-spacing:.01em;max-width:80%;line-height:1.4}' +
    '.empty .sub{font-size:11px;color:#a3937c}' +
    ':host([data-over]) .frame{outline:2px solid var(--lc-accent,#FF6B00);outline-offset:-2px}';

  var ICON =
    '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor"' +
    ' stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">' +
    '<rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/>' +
    '<path d="m21 15-5-5L5 21"/></svg>';

  function radiusFor(host) {
    var shape = (host.getAttribute('shape') || 'rounded').toLowerCase();
    if (shape === 'circle') return '50%';
    if (shape === 'pill') return '9999px';
    if (shape === 'rect') return '0';
    var n = parseFloat(host.getAttribute('radius'));
    return (isFinite(n) ? n : 12) + 'px';
  }

  var Slot = function () {};
  Slot.prototype = Object.create(HTMLElement.prototype);

  function defineSlot() {
    function ImageSlot() {
      var self = Reflect.construct(HTMLElement, [], ImageSlot);
      var root = self.attachShadow({ mode: 'open' });
      root.innerHTML =
        '<style>' + CSS + '</style>' +
        '<div class="frame">' +
        '  <img alt="" style="display:none">' +
        '  <div class="empty">' +
        '    <span class="ic">' + ICON + '</span>' +
        '    <span class="cap"></span>' +
        '    <span class="sub">Drop or click to add an image</span>' +
        '  </div>' +
        '</div>' +
        '<input type="file" accept="' + ACCEPT + '" hidden>';
      self._frame = root.querySelector('.frame');
      self._img = root.querySelector('img');
      self._empty = root.querySelector('.empty');
      self._cap = root.querySelector('.cap');
      self._input = root.querySelector('input');
      self._empty.addEventListener('click', function () { self._input.click(); });
      self._input.addEventListener('change', function () {
        var f = self._input.files && self._input.files[0];
        if (f) self._fill(URL.createObjectURL(f));
        self._input.value = '';
      });
      return self;
    }
    ImageSlot.prototype = Object.create(HTMLElement.prototype);
    ImageSlot.prototype.constructor = ImageSlot;

    ImageSlot.observedAttributes = ['src', 'shape', 'radius', 'fit', 'position', 'placeholder'];
    Object.defineProperty(ImageSlot, 'observedAttributes', {
      get: function () { return ['src', 'shape', 'radius', 'fit', 'position', 'placeholder']; }
    });

    ImageSlot.prototype.connectedCallback = function () {
      var self = this;
      this.addEventListener('dragover', function (e) {
        e.preventDefault(); self.setAttribute('data-over', '');
      });
      this.addEventListener('dragleave', function () { self.removeAttribute('data-over'); });
      this.addEventListener('drop', function (e) {
        e.preventDefault(); self.removeAttribute('data-over');
        var f = e.dataTransfer && e.dataTransfer.files && e.dataTransfer.files[0];
        if (f) self._fill(URL.createObjectURL(f));
      });
      this._render();
    };

    ImageSlot.prototype.attributeChangedCallback = function () {
      if (this.shadowRoot) this._render();
    };

    ImageSlot.prototype._fill = function (url) {
      this._userUrl = url;
      this._render();
    };

    ImageSlot.prototype._render = function () {
      var r = radiusFor(this);
      this._frame.style.borderRadius = r;
      this._cap.textContent = this.getAttribute('placeholder') || 'Add an image';
      var url = this._userUrl || this.getAttribute('src') || '';
      if (url) {
        this._img.src = url;
        this._img.style.objectFit = this.getAttribute('fit') || 'cover';
        this._img.style.objectPosition = this.getAttribute('position') || '50% 50%';
        this._img.style.display = 'block';
        this._empty.style.display = 'none';
      } else {
        this._img.removeAttribute('src');
        this._img.style.display = 'none';
        this._empty.style.display = 'flex';
      }
    };

    customElements.define('image-slot', ImageSlot);
  }

  if (!customElements.get('image-slot')) defineSlot();
})();
