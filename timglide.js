/* Minimal, dependency-free TimeGlide date selector (UMD build) */
(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.TimeGlide = factory();
  }
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  function clamp(n, min, max) { return Math.max(min, Math.min(max, n)); }
  function daysBetween(a, b) { return Math.floor((b - a) / (1000 * 60 * 60 * 24)); }

  const STYLE = `
  :host, .tg-root { box-sizing: border-box; }
  *, *::before, *::after { box-sizing: inherit; }

  .tg-selector {
    background: var(--tg-background, #1a1a1a);
    border-radius: 16px;
    padding: 45px 30px 35px;
    max-width: 780px;
    width: 100%;
    position: relative;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif;
    color: var(--tg-text, #fff);
    -webkit-font-smoothing: antialiased;
  }

  .tg-selected-date {
    text-align: center;
    font-size: 54px;
    font-weight: 200;
    color: var(--tg-text, #fff);
    margin-bottom: 12px;
    letter-spacing: -2px;
    transition: color 0.3s ease;
  }
  .tg-selected-date.is-today { color: var(--tg-accent, #ff3333); }

  .tg-date-details {
    text-align: center;
    font-size: 13px;
    color: #999;
    margin-bottom: 35px;
    text-transform: uppercase;
    letter-spacing: 2px;
  }

  .tg-fine-tune { display: flex; justify-content: center; align-items: center; gap: 20px; margin-bottom: 20px; position: relative; }
  .tg-control-label { font-size: 10px; color: #777; text-transform: uppercase; letter-spacing: 1.5px; user-select: none; }
  .tg-day-buttons { display: flex; gap: 8px; align-items: center; }
  .tg-day-btn {
    min-width: 36px; height: 32px; padding: 0 10px; border: 1px solid #333; background: transparent; color: #bbb;
    border-radius: 6px; cursor: pointer; display: inline-flex; align-items: center; justify-content: center; font-size: 14px;
    transition: background 0.15s ease, border-color 0.15s ease, color 0.15s ease; position: relative; user-select: none;
  }
  .tg-day-btn:hover { border-color: #666; color: #ddd; background: rgba(255,255,255,0.04); }
  .tg-day-btn:active { transform: translateY(1px); }
  .tg-day-btn.speed-1 { border-color: #666; color: #ddd; animation: tg-pulse-slow 1s infinite; }
  .tg-day-btn.speed-2 { border-color: #888; color: #eee; animation: tg-pulse-medium 0.6s infinite; }
  .tg-day-btn.speed-3 { border-color: #aaa; color: #fff; background: rgba(255,255,255,0.05); animation: tg-pulse-fast 0.3s infinite; }
  .tg-day-btn.speed-4 { border-color: #fff; color: #000; background: rgba(255,255,255,0.9); animation: tg-pulse-ultra 0.15s infinite; }
  @keyframes tg-pulse-slow { 0%, 100% { opacity: 1; } 50% { opacity: 0.6; } }
  @keyframes tg-pulse-medium { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.05); } }
  @keyframes tg-pulse-fast { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.1); } }
  @keyframes tg-pulse-ultra { 0%, 100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(255,255,255,0.3);} 50% { transform: scale(1.15); box-shadow: 0 0 15px 3px rgba(255,255,255,0.1);} }
  .tg-speed-indicator { position: absolute; top: -18px; left: 50%; transform: translateX(-50%); font-size: 9px; color: #999; text-transform: uppercase; letter-spacing: 0.5px; opacity: 0; transition: opacity 0.2s ease; white-space: nowrap; pointer-events: none; }
  .tg-speed-indicator.visible { opacity: 1; }

  .tg-slider { position: relative; height: 65px; margin: 0 10px; cursor: pointer; }
  .tg-track { position: absolute; top: 50%; left: 0; right: 0; height: 3px; background: var(--tg-track, #2a2a2a); transform: translateY(-50%); }
  .tg-year-marks { position: absolute; top: 50%; left: 0; right: 0; height: 16px; transform: translateY(-50%); pointer-events: none; }
  .tg-year-mark { position: absolute; top: 50%; transform: translate(-50%, -50%); width: 1px; height: 8px; background: #333; }
  .tg-year-mark.major { height: 16px; background: #444; }
  .tg-year-mark.decade { height: 12px; background: #3a3a3a; }
  .tg-year-label { position: absolute; top: 100%; left: 50%; transform: translateX(-50%); margin-top: 6px; font-size: 9px; color: #777; font-weight: 600; }
  .tg-progress { position: absolute; top: 0; left: 0; height: 100%; background: linear-gradient(90deg, transparent, rgba(255,255,255,0.15)); transition: width 0.05s linear; pointer-events: none; }
  .tg-thumb { position: absolute; top: 50%; width: 18px; height: 18px; background: var(--tg-thumb, #ffffff); border-radius: 50%; transform: translate(-50%, -50%); cursor: grab; z-index: 10; box-shadow: 0 0 10px rgba(255,255,255,0.2); will-change: left; }
  .tg-thumb:hover { transform: translate(-50%, -50%) scale(1.3); }
  .tg-thumb.dragging { cursor: grabbing; transform: translate(-50%, -50%) scale(1.4); transition: none; }
  .tg-today-marker { position: absolute; top: 50%; width: 2px; height: 20px; background: var(--tg-accent, #ff3333); transform: translate(-50%, -50%); z-index: 5; }
  .tg-today-label { position: absolute; bottom: -20px; left: 50%; transform: translateX(-50%); font-size: 8px; color: var(--tg-accent, #ff3333); text-transform: uppercase; letter-spacing: 1px; white-space: nowrap; cursor: pointer; padding: 2px 4px; border-radius: 2px; transition: all 0.2s ease; }
  .tg-today-label:hover { background: rgba(255, 51, 51, 0.1); transform: translateX(-50%) translateY(-1px); }
  .tg-hover-info { position: absolute; top: -32px; padding: 5px 10px; background: #fff; color: #000; border-radius: 4px; font-size: 11px; font-weight: 500; white-space: nowrap; opacity: 0; pointer-events: none; transition: opacity 0.15s ease; transform: translateX(-50%); will-change: left, opacity; }
  .tg-hover-info.visible { opacity: 1; }
  .tg-hover-info.on-today { background: var(--tg-accent, #ff3333); color: #fff; }

  @media (max-width: 600px) {
    .tg-selected-date { font-size: 42px; }
    .tg-selector { padding: 35px 20px 30px; }
    .tg-day-buttons { gap: 6px; }
    .tg-day-btn { width: 34px; height: 34px; }
  }
  `;

  class TimeGlide {
    constructor(options) {
      if (!options || !options.container) throw new Error('TimeGlide: container is required');
      this.host = typeof options.container === 'string' ? document.querySelector(options.container) : options.container;
      if (!this.host) throw new Error('TimeGlide: container not found');

      // Options
      this.showTodayMarker = options.showTodayMarker !== false;
      this.enableKeyboard = options.enableKeyboard !== false;
      this.accelerationDelay = Number(options.accelerationDelay || 300);
      this.shadow = options.shadow !== false; // default true
      this.theme = options.theme || 'dark'; // 'dark' | 'light' | 'auto'
      this.palette = options.palette || null; // optional custom colors

      // Date range
      this.startDate = options.startDate ? new Date(options.startDate) : new Date(options.startYear || 1900, 0, 1);
      this.endDate = options.endDate ? new Date(options.endDate) : new Date(options.endYear || 2050, 11, 31);
      this.today = new Date(); this.today.setHours(0, 0, 0, 0);
      this.totalDays = Math.max(1, daysBetween(this.startDate, this.endDate));
      this.selectedDate = options.defaultDate ? new Date(options.defaultDate) : new Date(this.today);
      if (this.selectedDate < this.startDate) this.selectedDate = new Date(this.startDate);
      if (this.selectedDate > this.endDate) this.selectedDate = new Date(this.endDate);
      this.onChange = typeof options.onChange === 'function' ? options.onChange : null;

      // DOM
      this.root = this.shadow && this.host.attachShadow ? this.host.attachShadow({ mode: 'open' }) : this.host;
      this.#mount();
      this.#applyTheme(this.theme, this.palette);
      this.#attachEvents();
      this.#generateYearMarks();
      this.updateDisplay();
    }

    // Public API
    getDate() { return new Date(this.selectedDate); }
    setDate(date) {
      const d = new Date(date);
      if (isNaN(d)) return;
      if (d < this.startDate || d > this.endDate) return;
      this.selectedDate = d;
      this.updateDisplay();
      if (this.onChange) this.onChange(this.getDate());
    }
    destroy() {
      this.#detachEvents();
      if (this._mql) { this._mql.removeEventListener('change', this._onMqlChange); this._mql = null; }
      if (this.shadow && this.host.shadowRoot) {
        this.host.shadowRoot.innerHTML = '';
      } else {
        this.host.innerHTML = '';
      }
    }

    // Theme API
    setTheme(theme, palette) {
      this.theme = theme || this.theme;
      this.palette = palette || this.palette || null;
      this.#applyTheme(this.theme, this.palette);
    }
    getTheme() { return this.theme; }

    // Internal helpers
    #mount() {
      const wrap = document.createElement('div');
      wrap.className = 'tg-selector';
      wrap.setAttribute('role', 'group');

      const style = document.createElement('style');
      style.textContent = STYLE;

      wrap.innerHTML = `
        <div class="tg-selected-date" aria-live="polite"></div>
        <div class="tg-date-details"></div>
        <div class="tg-fine-tune">
          <span class="tg-control-label">Fine tune</span>
          <div class="tg-day-buttons">
            <button class="tg-day-btn tg-prev" type="button" aria-label="Decrease date">
              &lt;
              <span class="tg-speed-indicator"></span>
            </button>
            <button class="tg-day-btn tg-next" type="button" aria-label="Increase date">
              &gt;
              <span class="tg-speed-indicator"></span>
            </button>
          </div>
        </div>
        <div class="tg-slider" aria-label="Date timeline">
          <div class="tg-track"></div>
          <div class="tg-year-marks"></div>
          <div class="tg-progress"></div>
          ${this.showTodayMarker ? '<div class="tg-today-marker"><span class="tg-today-label">Today</span></div>' : ''}
          <div class="tg-hover-info" hidden></div>
          <div class="tg-thumb" tabindex="0" role="slider" aria-valuemin="0" aria-valuemax="100" aria-valuenow="0" aria-label="Selected date"></div>
        </div>
      `;

      // Mount
      if (this.root instanceof ShadowRoot) {
        this.root.appendChild(style);
        this.root.appendChild(wrap);
        this.host.tabIndex = 0;
      } else {
        this.root.appendChild(style);
        this.root.appendChild(wrap);
        this.host.tabIndex = 0;
      }

      // Refs
      this.$root = wrap;
      this.$selected = wrap.querySelector('.tg-selected-date');
      this.$details = wrap.querySelector('.tg-date-details');
      this.$slider = wrap.querySelector('.tg-slider');
      this.$track = wrap.querySelector('.tg-track');
      this.$progress = wrap.querySelector('.tg-progress');
      this.$thumb = wrap.querySelector('.tg-thumb');
      this.$marks = wrap.querySelector('.tg-year-marks');
      this.$hover = wrap.querySelector('.tg-hover-info');
      this.$todayMarker = wrap.querySelector('.tg-today-marker');
      this.$todayLabel = wrap.querySelector('.tg-today-label');
      this.$prevBtn = wrap.querySelector('.tg-prev');
      this.$nextBtn = wrap.querySelector('.tg-next');
      this.$prevSpeed = this.$prevBtn.querySelector('.tg-speed-indicator');
      this.$nextSpeed = this.$nextBtn.querySelector('.tg-speed-indicator');
    }

    #attachEvents() {
      // Pointer and hover
      this._onMouseMove = (e) => this.#handlePointerMove(e.clientX);
      this._onTouchMove = (e) => { if (e.touches && e.touches[0]) this.#handlePointerMove(e.touches[0].clientX); };
      this._onMouseDown = (e) => this.#handlePointerDown(e.clientX, e.clientY, e);
      this._onTouchStart = (e) => { if (e.touches && e.touches[0]) this.#handlePointerDown(e.touches[0].clientX, e.touches[0].clientY, e); };
      this._onMouseUp = () => this.#handlePointerUp();
      this._onMouseLeave = () => this.#handleMouseLeave();

      this.$slider.addEventListener('mousemove', this._onMouseMove);
      this.$slider.addEventListener('mousedown', this._onMouseDown);
      this.$slider.addEventListener('mouseleave', this._onMouseLeave);
      this.$slider.addEventListener('touchstart', this._onTouchStart, { passive: false });
      this.$slider.addEventListener('touchmove', this._onTouchMove, { passive: false });
      window.addEventListener('mouseup', this._onMouseUp);
      window.addEventListener('touchend', this._onMouseUp);

      // Today label
      if (this.$todayLabel) {
        this.$todayLabel.addEventListener('click', (e) => { e.stopPropagation(); this.setDate(this.today); });
      }

      // Buttons with acceleration
      this._startPrev = (e) => { e.preventDefault(); this.#startLongPress(-1, this.$prevBtn, this.$prevSpeed); };
      this._startNext = (e) => { e.preventDefault(); this.#startLongPress(1, this.$nextBtn, this.$nextSpeed); };
      this._stopPress = () => this.#stopLongPress();
      this.$prevBtn.addEventListener('mousedown', this._startPrev);
      this.$prevBtn.addEventListener('mouseup', this._stopPress);
      this.$prevBtn.addEventListener('mouseleave', this._stopPress);
      this.$prevBtn.addEventListener('touchstart', this._startPrev, { passive: false });
      this.$prevBtn.addEventListener('touchend', this._stopPress);
      this.$nextBtn.addEventListener('mousedown', this._startNext);
      this.$nextBtn.addEventListener('mouseup', this._stopPress);
      this.$nextBtn.addEventListener('mouseleave', this._stopPress);
      this.$nextBtn.addEventListener('touchstart', this._startNext, { passive: false });
      this.$nextBtn.addEventListener('touchend', this._stopPress);

      // Keyboard (active when host focused or any child focused)
      if (this.enableKeyboard) {
        this._onKeyDown = (e) => {
          const k = e.key;
          if (k === 'ArrowLeft') { this.#adjustDay(-1); e.preventDefault(); }
          else if (k === 'ArrowRight') { this.#adjustDay(1); e.preventDefault(); }
          else if (k === 'ArrowUp') { this.#adjustDay(7); e.preventDefault(); }
          else if (k === 'ArrowDown') { this.#adjustDay(-7); e.preventDefault(); }
          else if (k === 't' || k === 'T') { this.setDate(this.today); e.preventDefault(); }
        };
        this.host.addEventListener('keydown', this._onKeyDown);
      }
    }

    #detachEvents() {
      this.$slider.removeEventListener('mousemove', this._onMouseMove);
      this.$slider.removeEventListener('mousedown', this._onMouseDown);
      this.$slider.removeEventListener('mouseleave', this._onMouseLeave);
      this.$slider.removeEventListener('touchstart', this._onTouchStart);
      this.$slider.removeEventListener('touchmove', this._onTouchMove);
      window.removeEventListener('mouseup', this._onMouseUp);
      window.removeEventListener('touchend', this._onMouseUp);
      this.$prevBtn.removeEventListener('mousedown', this._startPrev);
      this.$prevBtn.removeEventListener('mouseup', this._stopPress);
      this.$prevBtn.removeEventListener('mouseleave', this._stopPress);
      this.$prevBtn.removeEventListener('touchstart', this._startPrev);
      this.$prevBtn.removeEventListener('touchend', this._stopPress);
      this.$nextBtn.removeEventListener('mousedown', this._startNext);
      this.$nextBtn.removeEventListener('mouseup', this._stopPress);
      this.$nextBtn.removeEventListener('mouseleave', this._stopPress);
      this.$nextBtn.removeEventListener('touchstart', this._startNext);
      this.$nextBtn.removeEventListener('touchend', this._stopPress);
      if (this.enableKeyboard) this.host.removeEventListener('keydown', this._onKeyDown);
    }

    #dateToPosition(date) {
      const days = daysBetween(this.startDate, date);
      return clamp(days / this.totalDays, 0, 1);
    }

    #positionToDate(pos) {
      const days = Math.floor(clamp(pos, 0, 1) * this.totalDays);
      const d = new Date(this.startDate);
      d.setDate(d.getDate() + days);
      return d;
    }

    #formatMainDate(date) {
      const m = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
      return `${date.getDate()} ${m[date.getMonth()]} ${date.getFullYear()}`;
    }

    #formatDetails(date) {
      const daysName = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
      const normalized = new Date(date); normalized.setHours(0,0,0,0);
      const diff = daysBetween(this.today, normalized);
      if (diff === 0) return 'Today';
      if (diff === 1) return 'Tomorrow';
      if (diff === -1) return 'Yesterday';
      if (diff > 0) return `${daysName[date.getDay()]} • ${diff} days from now`;
      return `${daysName[date.getDay()]} • ${Math.abs(diff)} days ago`;
    }

    #formatHover(date) {
      const m = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
      return `${m[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
    }

    updateDisplay() {
      const pos = this.#dateToPosition(this.selectedDate);
      const pct = pos * 100;
      this.$thumb.style.left = pct + '%';
      this.$thumb.setAttribute('aria-valuenow', String(Math.round(pct)));
      this.$thumb.setAttribute('aria-valuetext', this.getDate().toDateString());
      this.$progress.style.width = pct + '%';
      this.$selected.textContent = this.#formatMainDate(this.selectedDate);
      this.$details.textContent = this.#formatDetails(this.selectedDate);

      const ns = new Date(this.selectedDate); ns.setHours(0,0,0,0);
      const isToday = ns.getTime() === this.today.getTime();
      this.$selected.classList.toggle('is-today', isToday);

      if (this.onChange) this.onChange(this.getDate());
      // Fire DOM event for framework-agnostic integration
      try { this.host.dispatchEvent(new CustomEvent('change', { detail: { date: this.getDate() } })); } catch (e) {}
    }

    #generateYearMarks() {
      const startYear = this.startDate.getFullYear();
      const endYear = this.endDate.getFullYear();
      let html = '';
      for (let y = startYear; y <= endYear; y++) {
        if (y % 5 !== 0 && y !== startYear && y !== endYear) continue;
        const pos = this.#dateToPosition(new Date(y, 0, 1));
        let cls = 'tg-year-mark';
        let label = '';
        if (y % 50 === 0 || y === startYear || y === endYear) { cls += ' major'; label = `<span class="tg-year-label">${y}</span>`; }
        else if (y % 10 === 0) { cls += ' decade'; if (y % 20 === 0) label = `<span class="tg-year-label">${y}</span>`; }
        html += `<div class="${cls}" style="left:${(pos*100).toFixed(4)}%">${label}</div>`;
      }
      this.$marks.innerHTML = html;

      if (this.$todayMarker) {
        const tpos = this.#dateToPosition(this.today);
        if (tpos >= 0 && tpos <= 1) {
          this.$todayMarker.style.left = (tpos * 100) + '%';
        } else {
          this.$todayMarker.style.display = 'none';
        }
      }
    }

    #handlePointerMove(clientX) {
      if (this._raf) cancelAnimationFrame(this._raf);
      this._raf = requestAnimationFrame(() => {
        const rect = this.$slider.getBoundingClientRect();
        const pos = clamp((clientX - rect.left) / rect.width, 0, 1);
        const date = this.#positionToDate(pos);
        this.$hover.textContent = this.#formatHover(date);
        this.$hover.style.left = (pos * 100) + '%';
        this.$hover.hidden = false;
        this.$hover.classList.add('visible');

        const normalized = new Date(date); normalized.setHours(0,0,0,0);
        const isToday = Math.abs(normalized - this.today) < 24*60*60*1000;
        this.$hover.classList.toggle('on-today', isToday);

        if (this._dragging) {
          this.selectedDate = date;
          this.updateDisplay();
        }
      });
    }

    #handlePointerDown(clientX, clientY, e) {
      const rect = this.$slider.getBoundingClientRect();
      const y = clientY - rect.top;
      if (y >= 15 && y <= 50) {
        this._dragging = true;
        this.$thumb.classList.add('dragging');
        const pos = clamp((clientX - rect.left) / rect.width, 0, 1);
        this.selectedDate = this.#positionToDate(pos);
        this.updateDisplay();
        if (e && e.preventDefault) e.preventDefault();
        // track pointer while dragging outside slider
        this._dragWindowMove = (evt) => this.#handlePointerMove(evt.clientX || (evt.touches && evt.touches[0] && evt.touches[0].clientX) || 0);
        window.addEventListener('mousemove', this._dragWindowMove);
        window.addEventListener('touchmove', this._dragWindowMove, { passive: false });
      }
    }

    #handlePointerUp() {
      this._dragging = false;
      this.$thumb.classList.remove('dragging');
      if (this._dragWindowMove) {
        window.removeEventListener('mousemove', this._dragWindowMove);
        window.removeEventListener('touchmove', this._dragWindowMove);
        this._dragWindowMove = null;
      }
    }

    #handleMouseLeave() {
      this.$hover.classList.remove('visible');
      this.$hover.hidden = true;
      if (this._raf) { cancelAnimationFrame(this._raf); this._raf = null; }
    }

    #adjustDay(amount) {
      const d = new Date(this.selectedDate);
      d.setDate(d.getDate() + amount);
      if (d >= this.startDate && d <= this.endDate) {
        this.selectedDate = d;
        this.updateDisplay();
      }
    }

    #startLongPress(direction, button, speedEl) {
      this.#adjustDay(direction);
      this._pressDuration = 0;
      this._pressSpeed = 1;
      this._activeButton = button;
      this._activeSpeed = speedEl;

      this._pressTimer = setTimeout(() => {
        this._pressInterval = setInterval(() => {
          this._pressDuration += 50;
          if (this._pressDuration > 3000) {
            if (this._pressSpeed !== 4) { this._pressSpeed = 4; button.classList.remove('speed-1','speed-2','speed-3'); button.classList.add('speed-4'); speedEl.textContent = 'month'; speedEl.classList.add('visible'); }
            const d = new Date(this.selectedDate); d.setMonth(d.getMonth() + direction);
            if (d >= this.startDate && d <= this.endDate) { this.selectedDate = d; this.updateDisplay(); }
          } else if (this._pressDuration > 1500) {
            if (this._pressSpeed !== 3) { this._pressSpeed = 3; button.classList.remove('speed-1','speed-2','speed-4'); button.classList.add('speed-3'); speedEl.textContent = 'week'; speedEl.classList.add('visible'); }
            this.#adjustDay(direction * 7);
          } else if (this._pressDuration > 600) {
            if (this._pressSpeed !== 2) { this._pressSpeed = 2; button.classList.remove('speed-1','speed-3','speed-4'); button.classList.add('speed-2'); speedEl.textContent = '3 days'; speedEl.classList.add('visible'); }
            this.#adjustDay(direction * 3);
          } else {
            if (this._pressSpeed !== 1) { this._pressSpeed = 1; button.classList.remove('speed-2','speed-3','speed-4'); button.classList.add('speed-1'); }
            this.#adjustDay(direction);
          }
        }, 50);
      }, this.accelerationDelay);
    }

    #stopLongPress() {
      if (this._pressTimer) { clearTimeout(this._pressTimer); this._pressTimer = null; }
      if (this._pressInterval) { clearInterval(this._pressInterval); this._pressInterval = null; }
      if (this._activeButton) { this._activeButton.classList.remove('speed-1','speed-2','speed-3','speed-4'); }
      if (this._activeSpeed) { this._activeSpeed.classList.remove('visible'); }
      this._pressDuration = 0; this._pressSpeed = 1; this._activeButton = null; this._activeSpeed = null;
    }

    #applyTheme(theme, palette) {
      // clear auto listener
      if (this._mql) { this._mql.removeEventListener('change', this._onMqlChange); this._mql = null; }

      if (theme === 'auto') {
        this._mql = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)');
        const mode = this._mql && this._mql.matches ? 'dark' : 'light';
        this.#setPalette(this.#getBuiltInPalette(mode, palette));
        this._onMqlChange = (e) => { this.#setPalette(this.#getBuiltInPalette(e.matches ? 'dark' : 'light', palette)); };
        if (this._mql) this._mql.addEventListener('change', this._onMqlChange);
      } else {
        this.#setPalette(this.#getBuiltInPalette(theme, palette));
      }
    }

    #getBuiltInPalette(theme, overrides) {
      const dark = { background: '#1a1a1a', text: '#ffffff', accent: '#ff3333', track: '#2a2a2a', thumb: '#ffffff' };
      const light = { background: '#ffffff', text: '#111111', accent: '#d02626', track: '#e6e6e6', thumb: '#111111' };
      const base = theme === 'light' ? light : dark;
      return Object.assign({}, base, overrides || {});
    }

    #setPalette(vars) {
      if (!vars) return;
      const style = this.host.style;
      style.setProperty('--tg-background', vars.background);
      style.setProperty('--tg-text', vars.text);
      style.setProperty('--tg-accent', vars.accent);
      style.setProperty('--tg-track', vars.track);
      style.setProperty('--tg-thumb', vars.thumb);
    }
  }
  return TimeGlide;
});
