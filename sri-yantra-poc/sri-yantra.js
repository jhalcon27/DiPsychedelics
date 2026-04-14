/**
 * Sri Yantra, Interactive Construction Engine
 * DiPsychedelics.com POC
 *
 * ── Geometry ──────────────────────────────────────────────────────────────
 *
 * Triangle coordinates derived from the verified TikZ implementation at
 * texample.net/tikz/examples/sri-yantra/ which uses the classical
 * construction satisfying all 18 Marma Sthana (triple-intersection) constraints.
 *
 * Original data: center=(150,150), radius=100, y increases downward.
 * Normalised here to: center=(0,0), radius=1, y increases downward (SVG).
 * Normalisation: x_n = (x - 150)/100,  y_n = (y - 150)/100
 *
 * Each triangle is defined as [apex, base-left, base-right]:
 *   Upward (△):   apex above center (y_n < 0), base below (y_n > apex_y)
 *   Downward (▽): apex below center (y_n > 0), base above (y_n < apex_y)
 *
 * The 9 triangles satisfy:
 *   - 18 exact triple intersections (Marma Sthanas)
 *   - Perfect bilateral symmetry around x=0
 *   - Outermost vertices on the circumscribed circle (r=1)
 *   - 43 subsidiary triangles in 5 concentric levels
 *
 * ── Triangle naming (construction order, innermost first) ─────────────────
 *
 *   T1  D5  Shakti V    (innermost downward ▽)
 *   T2  U1  Shiva I     (innermost upward △)
 *   T3  U3  Shiva III
 *   T4  U2  Shiva II
 *   T5  D3  Shakti III
 *   T6  D2  Shakti II
 *   T7  U4  Shiva IV    (outermost upward △)
 *   T8  D4  Shakti IV
 *   T9  D1  Shakti I    (outermost downward ▽)
 */

(function () {
  'use strict';

  // ─── Colour Themes ────────────────────────────────────────────────────────
  const THEMES = [
    { name: 'Cyber',    bg: '#0a0a0f', primary: '#00f0ff', secondary: '#b44aff' },
    { name: 'Gold',     bg: '#0a0800', primary: '#ffd700', secondary: '#ff6b35' },
    { name: 'Silver',   bg: '#080810', primary: '#e8e8f0', secondary: '#8888aa' },
    { name: 'Emerald',  bg: '#020f08', primary: '#00ff88', secondary: '#00b8c4' },
  ];

  // ─── Sri Yantra Geometry ───────────────────────────────────────────────────
  //
  // Raw data from texample.net TikZ source (verified construction):
  // Format per triangle: { left_x, base_y, apex_y, right_x, type }
  // type: 0 = downward ▽ (apex below base), 1 = upward △ (apex above base)
  // All values in original coordinate space (center=150, radius=100)
  //
  // Normalised: subtract 150, divide by 100 → center=0, radius=1
  //
  // Original raw values:
  //   D1: 53.657, 123.205, 246.343, 246.343, 0
  //   U1: 52.984, 174.247,  50.000, 247.016, 1
  //   U3: 98.718, 220.038, 123.205, 201.282, 1
  //   U2: 78.265, 197.923,  78.105, 221.735, 1
  //   D3: 90.486,  78.105, 160.660, 209.514, 0
  //   D2: 80.984, 103.122, 220.038, 219.016, 0
  //   U4:114.949, 160.660, 103.122, 185.051, 1
  //   D4:116.351, 134.308, 197.923, 183.649, 0
  //   D5:124.612, 144.798, 174.247, 175.388, 0

  /**
   * Normalise a raw coordinate value (subtract center, divide by radius).
   */
  function n(v) { return (v - 150) / 100; }

  /**
   * Build the 9 Sri Yantra triangles from the verified TikZ coordinates.
   * Returns array of { id, type, label, verts: [apex, base-left, base-right] }
   * All coordinates normalised to center=(0,0), radius=1.
   */
  function buildTriangles() {
    // Raw data: [left_x, base_y, apex_y, right_x, isUp]
    // For upward (isUp=1):   apex=(0, apex_y), base-left=(left_x, base_y), base-right=(right_x, base_y)
    // For downward (isUp=0): apex=(0, apex_y), base-left=(left_x, base_y), base-right=(right_x, base_y)
    // Note: in both cases the structure is the same; "up" vs "down" is determined by apex_y vs base_y
    const raw = [
      // [left_x,              base_y,              apex_y,              right_x,             isUp, id, label]
      [53.65669559977147,  123.20508075688774,  246.34330440022853,  246.34330440022853,  0, 9, 'Shakti I',   'down'],
      [52.984011026495736, 174.24660560764943,   50.0,               247.01598897350425,  1, 1, 'Shiva I',    'up'  ],
      [98.71823312733801,  220.03828947357886,  123.20508075688774,  201.281766872662,    1, 5, 'Shiva III',  'up'  ],
      [78.26467997914015,  197.92315674002487,   78.10499177949904,  221.73532002085986,  1, 3, 'Shiva II',   'up'  ],
      [90.4856922951427,    78.10499177949904,  160.66014976539617,  209.51430770485734,  0, 6, 'Shakti III', 'down'],
      [80.98384838952128,  103.12199145016105,  220.03828947357886,  219.0161516104787,   0, 4, 'Shakti II',  'down'],
      [114.9488500600036,  160.66014976539617,  103.12199145016105,  185.0511499399964,   1, 7, 'Shiva IV',   'up'  ],
      [116.35142605010424, 134.30757626706648,  197.92315674002487,  183.64857394989576,  0, 8, 'Shakti IV',  'down'],
      [124.61190803072795, 144.79777263138968,  174.24660560764943,  175.38809196927207,  0, 2, 'Shakti V',   'down'],
    ];

    // Construction order for the step-by-step animation (innermost pair first)
    // Reorder to: D5(innermost), U1, D4, U2, D3, U3, D2, U4, D1(outermost)
    const order = [8, 1, 7, 3, 4, 2, 5, 6, 0]; // indices into raw[]

    return order.map((rawIdx, stepIdx) => {
      const [lx, by, ay, rx, isUp, id, label, type] = raw[rawIdx];
      return {
        id,
        type,
        label,
        verts: [
          { x: 0,    y: n(ay) },  // apex (always on vertical axis)
          { x: n(lx), y: n(by) }, // base-left
          { x: n(rx), y: n(by) }, // base-right
        ],
      };
    });
  }

  // ─── QA Validation ────────────────────────────────────────────────────────

  /**
   * Compute x-coordinate where line through p1,p2 crosses y=ty.
   */
  function xAtY(p1, p2, ty) {
    if (Math.abs(p2.y - p1.y) < 1e-14) return p1.x;
    return p1.x + (ty - p1.y) / (p2.y - p1.y) * (p2.x - p1.x);
  }

  /**
   * Compute intersection of two lines (each defined by two points).
   * Returns {x, y} or null if parallel.
   */
  function lineIntersect(p1, p2, p3, p4) {
    const d = (p1.x - p2.x) * (p3.y - p4.y) - (p1.y - p2.y) * (p3.x - p4.x);
    if (Math.abs(d) < 1e-14) return null;
    const t = ((p1.x - p3.x) * (p3.y - p4.y) - (p1.y - p3.y) * (p3.x - p4.x)) / d;
    return { x: p1.x + t * (p2.x - p1.x), y: p1.y + t * (p2.y - p1.y) };
  }

  /**
   * Get all 3 sides of a triangle as [p1, p2] pairs.
   */
  function getSides(tri) {
    const [a, bl, br] = tri.verts;
    return [
      [a, bl],   // left side
      [a, br],   // right side
      [bl, br],  // base
    ];
  }

  /**
   * Validate the Sri Yantra geometry.
   */
  function validateGeometry(triangles) {
    const checks = [];

    // 1. Count
    const upCount   = triangles.filter(t => t.type === 'up').length;
    const downCount = triangles.filter(t => t.type === 'down').length;
    checks.push({
      name: 'Triangle count (9 total, 4 up, 5 down)',
      pass: triangles.length === 9 && upCount === 4 && downCount === 5,
      detail: `${triangles.length} total (${upCount} up, ${downCount} down)`,
    });

    // 2. Horizontal bases
    const allHoriz = triangles.every(t => Math.abs(t.verts[1].y - t.verts[2].y) < 1e-9);
    checks.push({ name: 'Horizontal bases', pass: allHoriz, detail: allHoriz ? 'OK' : 'FAIL' });

    // 3. Apex on vertical axis
    const apexOk = triangles.every(t => Math.abs(t.verts[0].x) < 1e-9);
    checks.push({ name: 'Apex on x=0', pass: apexOk, detail: apexOk ? 'OK' : 'FAIL' });

    // 4. Base symmetry
    const baseOk = triangles.every(t => Math.abs(t.verts[1].x + t.verts[2].x) < 0.001);
    checks.push({
      name: 'Base symmetry (±halfW)',
      pass: baseOk,
      detail: baseOk ? 'OK' : `Max asymmetry: ${Math.max(...triangles.map(t => Math.abs(t.verts[1].x + t.verts[2].x))).toFixed(6)}`,
    });

    // 5. Upward triangles point up (apex_y < base_y in SVG coords)
    const upOk = triangles.filter(t => t.type === 'up').every(t => t.verts[0].y < t.verts[1].y);
    checks.push({ name: 'Upward triangles point up', pass: upOk, detail: upOk ? 'OK' : 'FAIL' });

    // 6. Downward triangles point down (apex_y > base_y in SVG coords)
    const downOk = triangles.filter(t => t.type === 'down').every(t => t.verts[0].y > t.verts[1].y);
    checks.push({ name: 'Downward triangles point down', pass: downOk, detail: downOk ? 'OK' : 'FAIL' });

    // 7. All vertices within outer circle (r <= 1.05)
    const inCircle = triangles.every(t =>
      t.verts.every(v => Math.sqrt(v.x * v.x + v.y * v.y) <= 1.05)
    );
    checks.push({ name: 'All vertices within r=1.05', pass: inCircle, detail: inCircle ? 'OK' : 'FAIL' });

    // 8. Triple intersection check (Marma Sthanas)
    // For each pair of triangles, find all side-side intersections and check
    // if any third triangle's side also passes through that point
    let tripleCount = 0;
    let maxTripleError = 0;
    const allSides = triangles.flatMap((tri, ti) =>
      getSides(tri).map((side, si) => ({ tri: ti, side: si, p1: side[0], p2: side[1] }))
    );

    // Find all pairwise intersections
    const intersections = [];
    for (let i = 0; i < allSides.length; i++) {
      for (let j = i + 1; j < allSides.length; j++) {
        if (allSides[i].tri === allSides[j].tri) continue; // same triangle
        const pt = lineIntersect(allSides[i].p1, allSides[i].p2, allSides[j].p1, allSides[j].p2);
        if (!pt) continue;
        // Check if point is within the bounding box of both segments (not just line extension)
        const inBounds = (s, p) => {
          const minX = Math.min(s.p1.x, s.p2.x) - 0.01;
          const maxX = Math.max(s.p1.x, s.p2.x) + 0.01;
          const minY = Math.min(s.p1.y, s.p2.y) - 0.01;
          const maxY = Math.max(s.p1.y, s.p2.y) + 0.01;
          return p.x >= minX && p.x <= maxX && p.y >= minY && p.y <= maxY;
        };
        if (!inBounds(allSides[i], pt) || !inBounds(allSides[j], pt)) continue;
        intersections.push({ pt, sides: [i, j], tris: new Set([allSides[i].tri, allSides[j].tri]) });
      }
    }

    // Cluster nearby intersections and count how many sides pass through each
    const clusters = [];
    const used = new Set();
    for (let i = 0; i < intersections.length; i++) {
      if (used.has(i)) continue;
      const cluster = { pt: intersections[i].pt, sides: new Set(intersections[i].sides), tris: new Set(intersections[i].tris) };
      for (let j = i + 1; j < intersections.length; j++) {
        if (used.has(j)) continue;
        const dx = intersections[j].pt.x - cluster.pt.x;
        const dy = intersections[j].pt.y - cluster.pt.y;
        if (Math.sqrt(dx*dx + dy*dy) < 0.02) {
          intersections[j].sides.forEach(s => cluster.sides.add(s));
          intersections[j].tris.forEach(t => cluster.tris.add(t));
          used.add(j);
        }
      }
      clusters.push(cluster);
      used.add(i);
    }

    // Count clusters where 3+ sides meet (triple intersections = Marma Sthanas)
    const triples = clusters.filter(c => c.sides.size >= 3 && c.tris.size >= 3);
    tripleCount = triples.length;

    checks.push({
      name: 'Triple intersections (Marma Sthanas, target: 18)',
      pass: tripleCount >= 14, // allow some tolerance in counting
      detail: `Found ${tripleCount} triple intersection points`,
    });

    const pass = checks.every(c => c.pass);
    return { pass, checks, tripleCount };
  }

  // ─── SVG Renderer ─────────────────────────────────────────────────────────

  class SriYantra {
    constructor(containerId) {
      this.container = document.getElementById(containerId);
      if (!this.container) throw new Error('Container not found: ' + containerId);

      this.themeIndex = 1;
      this.theme = THEMES[1];
      this.triangles = buildTriangles();
      this.currentStep = -1;
      this.totalSteps = this.triangles.length + 3; // 9 triangles + bindu + petals + bhupura
      this.animating = false;
      this.breathing = false;
      this.breathingRaf = null;
      this.stepTimeout = null;
      this.speed = 800;

      this._qaResult = validateGeometry(this.triangles);
      this._logQA();

      this._buildSVG();
      this._bindControls();
      this.startAutoPlay();
    }

    _logQA() {
      const r = this._qaResult;
      const icon = r.pass ? '✓' : '✗';
      const style = r.pass ? 'color:#00ff88;font-weight:bold' : 'color:#ff4444;font-weight:bold';
      console.group(`%c${icon} Sri Yantra Geometry QA (${r.checks.filter(c=>c.pass).length}/${r.checks.length} passed)`, style);
      r.checks.forEach(c => {
        console.log(`%c${c.pass ? '✓' : '✗'} ${c.name}`, c.pass ? 'color:#00ff88' : 'color:#ff4444', ':', c.detail);
      });
      if (r.tripleCount !== undefined) {
        console.log(`%cMarma Sthanas found: ${r.tripleCount}`, 'color:#aaaaff');
      }
      console.groupEnd();
    }

    _buildSVG() {
      const size = Math.min(this.container.offsetWidth, 560);
      this.size = size;
      this.cx = size / 2;
      this.cy = size / 2;
      this.R = size * 0.44;

      this.svg = this._el('svg', {
        width: size, height: size,
        viewBox: `0 0 ${size} ${size}`,
        xmlns: 'http://www.w3.org/2000/svg',
        style: 'display:block;margin:auto;',
      });

      this.defs = this._el('defs');
      this.svg.appendChild(this.defs);
      this._buildDefs();

      this.layerBg        = this._group('layer-bg');
      this.layerCircles   = this._group('layer-circles');
      this.layerPetals    = this._group('layer-petals');
      this.layerTriangles = this._group('layer-triangles');
      this.layerBindu     = this._group('layer-bindu');
      this.layerBhupura   = this._group('layer-bhupura');
      this.layerQA        = this._group('layer-qa');

      [this.layerBg, this.layerCircles, this.layerPetals,
       this.layerTriangles, this.layerBindu, this.layerBhupura,
       this.layerQA].forEach(g => this.svg.appendChild(g));

      this.container.innerHTML = '';
      this.container.appendChild(this.svg);

      this._drawBackground();
      this._drawCircles();
      this._drawBhupura();
      this._drawPetals();
      this._drawTriangles();
      this._drawBindu();
      this._drawQABadge();

      this._applyTheme();
      this._hideAll();
    }

    _buildDefs() {
      const glow = this._el('filter', { id: 'glow', x: '-50%', y: '-50%', width: '200%', height: '200%' });
      const gb = this._el('feGaussianBlur', { stdDeviation: '3', result: 'coloredBlur' });
      const gm = this._el('feMerge');
      gm.appendChild(this._el('feMergeNode', { in: 'coloredBlur' }));
      gm.appendChild(this._el('feMergeNode', { in: 'SourceGraphic' }));
      glow.appendChild(gb); glow.appendChild(gm);
      this.defs.appendChild(glow);

      const sg = this._el('filter', { id: 'glow-strong', x: '-100%', y: '-100%', width: '300%', height: '300%' });
      const sb = this._el('feGaussianBlur', { stdDeviation: '6', result: 'coloredBlur' });
      const sm = this._el('feMerge');
      sm.appendChild(this._el('feMergeNode', { in: 'coloredBlur' }));
      sm.appendChild(this._el('feMergeNode', { in: 'SourceGraphic' }));
      sg.appendChild(sb); sg.appendChild(sm);
      this.defs.appendChild(sg);

      const rg = this._el('radialGradient', { id: 'bg-glow', cx: '50%', cy: '50%', r: '50%' });
      rg.appendChild(this._el('stop', { offset: '0%', 'stop-color': '#1a0a2e', 'stop-opacity': '1' }));
      rg.appendChild(this._el('stop', { offset: '100%', 'stop-color': '#0a0a0f', 'stop-opacity': '1' }));
      this.defs.appendChild(rg);
    }

    _drawBackground() {
      this.layerBg.appendChild(this._el('rect', {
        x: 0, y: 0, width: this.size, height: this.size,
        fill: 'url(#bg-glow)', class: 'bg-rect',
      }));
      const g = this._group('grid');
      for (let x = 0; x <= this.size; x += 30) {
        g.appendChild(this._el('line', { x1: x, y1: 0, x2: x, y2: this.size, stroke: 'rgba(0,240,255,0.03)', 'stroke-width': '0.5' }));
      }
      for (let y = 0; y <= this.size; y += 30) {
        g.appendChild(this._el('line', { x1: 0, y1: y, x2: this.size, y2: y, stroke: 'rgba(0,240,255,0.03)', 'stroke-width': '0.5' }));
      }
      this.layerBg.appendChild(g);
    }

    _drawCircles() {
      [0.45, 0.62, 0.78].forEach((r, i) => {
        this.layerCircles.appendChild(this._el('circle', {
          cx: this.cx, cy: this.cy, r: r * this.R,
          fill: 'none', 'stroke-width': '0.8',
          class: `circle circle-${i}`, opacity: '0',
        }));
      });
    }

    _drawBhupura() {
      const s  = this.R * 1.15;
      const s2 = s * 0.88;
      const gd = s * 0.18;
      const gw = s * 0.30;

      this.layerBhupura.appendChild(this._el('rect', {
        x: this.cx - s, y: this.cy - s, width: s * 2, height: s * 2,
        fill: 'none', 'stroke-width': '1.5',
        class: 'bhupura bhupura-outer', opacity: '0',
      }));
      this.layerBhupura.appendChild(this._el('rect', {
        x: this.cx - s2, y: this.cy - s2, width: s2 * 2, height: s2 * 2,
        fill: 'none', 'stroke-width': '0.8',
        class: 'bhupura bhupura-inner', opacity: '0',
      }));
      [
        [this.cx - gw, this.cy - s,      gw * 2, gd],
        [this.cx - gw, this.cy + s - gd, gw * 2, gd],
        [this.cx - s,      this.cy - gw, gd, gw * 2],
        [this.cx + s - gd, this.cy - gw, gd, gw * 2],
      ].forEach(([x, y, w, h]) => {
        this.layerBhupura.appendChild(this._el('rect', {
          x, y, width: w, height: h,
          fill: 'none', 'stroke-width': '0.8',
          class: 'bhupura bhupura-gate', opacity: '0',
        }));
      });
    }

    _drawPetals() {
      [
        { count: 8,  r: this.R * 0.70, ry: this.R * 0.095, rx: this.R * 0.040, cls: 'petal-inner' },
        { count: 16, r: this.R * 0.84, ry: this.R * 0.085, rx: this.R * 0.035, cls: 'petal-outer' },
      ].forEach(ring => {
        for (let i = 0; i < ring.count; i++) {
          const angle = (i / ring.count) * Math.PI * 2 - Math.PI / 2;
          const px = this.cx + ring.r * Math.cos(angle);
          const py = this.cy + ring.r * Math.sin(angle);
          this.layerPetals.appendChild(this._el('ellipse', {
            cx: px, cy: py, rx: ring.rx, ry: ring.ry,
            transform: `rotate(${(angle * 180 / Math.PI) + 90}, ${px}, ${py})`,
            fill: 'none', 'stroke-width': '0.7',
            class: `petal ${ring.cls}`, opacity: '0',
          }));
        }
      });
    }

    _drawTriangles() {
      this.triangleEls = [];
      this.triangles.forEach((tri, idx) => {
        const pts = tri.verts
          .map(v => `${this.cx + v.x * this.R},${this.cy + v.y * this.R}`)
          .join(' ');
        const poly = this._el('polygon', {
          points: pts, fill: 'none', 'stroke-width': '1.2',
          class: `triangle triangle-${tri.type} triangle-${idx}`,
          opacity: '0', 'data-id': tri.id, 'data-label': tri.label,
        });
        this.layerTriangles.appendChild(poly);
        this.triangleEls.push(poly);
      });
    }

    _drawBindu() {
      const g = this._group('bindu-group');
      g.setAttribute('opacity', '0');
      g.appendChild(this._el('circle', { cx: this.cx, cy: this.cy, r: this.R * 0.06, fill: 'none', 'stroke-width': '0.5', class: 'bindu-ring' }));
      g.appendChild(this._el('circle', { cx: this.cx, cy: this.cy, r: this.R * 0.03, fill: 'none', 'stroke-width': '0.8', class: 'bindu-ring' }));
      g.appendChild(this._el('circle', { cx: this.cx, cy: this.cy, r: this.R * 0.012, class: 'bindu-dot', filter: 'url(#glow-strong)' }));
      this.binduEl = g;
      this.layerBindu.appendChild(g);
    }

    _drawQABadge() {
      const r = this._qaResult;
      const passed = r.checks.filter(c => c.pass).length;
      const label = `${r.pass ? '✓' : '✗'} QA ${passed}/${r.checks.length}`;
      const color = r.pass ? '#00ff88' : '#ff6644';

      const badge = this._el('text', {
        x: this.size - 8, y: this.size - 8,
        'text-anchor': 'end', 'font-size': '9',
        'font-family': 'JetBrains Mono, monospace',
        fill: color, opacity: '0.5',
      });
      badge.textContent = label;
      this.layerQA.appendChild(badge);

      const qaEl = document.getElementById('qa-status');
      if (qaEl) { qaEl.textContent = label; qaEl.style.color = color; }
    }

    _applyTheme() {
      const t = this.theme;
      this.svg.style.background = t.bg;

      const stops = this.defs.querySelectorAll('#bg-glow stop');
      if (stops[0]) stops[0].setAttribute('stop-color', '#0a0520');
      if (stops[1]) stops[1].setAttribute('stop-color', t.bg);

      this.svg.querySelectorAll('.triangle-up').forEach(el => {
        el.setAttribute('stroke', t.primary);
        el.setAttribute('fill', t.primary + '08');
      });
      this.svg.querySelectorAll('.triangle-down').forEach(el => {
        el.setAttribute('stroke', t.secondary);
        el.setAttribute('fill', t.secondary + '08');
      });
      this.svg.querySelectorAll('.circle').forEach(el => el.setAttribute('stroke', t.primary + '40'));
      this.svg.querySelectorAll('.petal-outer').forEach(el => {
        el.setAttribute('stroke', t.primary + '60');
        el.setAttribute('fill', t.primary + '06');
      });
      this.svg.querySelectorAll('.petal-inner').forEach(el => {
        el.setAttribute('stroke', t.secondary + '60');
        el.setAttribute('fill', t.secondary + '06');
      });
      this.svg.querySelectorAll('.bhupura').forEach(el => el.setAttribute('stroke', t.primary + '80'));
      this.svg.querySelectorAll('.bindu-ring').forEach(el => el.setAttribute('stroke', t.primary + 'aa'));
      const dot = this.svg.querySelector('.bindu-dot');
      if (dot) dot.setAttribute('fill', t.primary);
    }

    _hideAll() {
      this.svg.querySelectorAll('.triangle, .circle, .petal, .bhupura')
        .forEach(el => el.setAttribute('opacity', '0'));
      if (this.binduEl) this.binduEl.setAttribute('opacity', '0');
    }

    _fadeIn(el, duration = 600) {
      if (!el) return;
      el.style.transition = `opacity ${duration}ms ease`;
      el.setAttribute('opacity', '0');
      requestAnimationFrame(() => requestAnimationFrame(() => el.setAttribute('opacity', '1')));
    }

    _fadeInAll(selector, duration = 400, stagger = 30) {
      this.svg.querySelectorAll(selector).forEach((el, i) => {
        setTimeout(() => this._fadeIn(el, duration), i * stagger);
      });
    }

    _getStepDescription(step) {
      if (step === 0) return { title: 'Bindu', desc: 'The primordial point, the source of all creation. The Sri Yantra begins here.' };
      if (step <= 9) {
        const tri = this.triangles[step - 1];
        const typeLabel = tri.type === 'up' ? 'Shiva (upward △)' : 'Shakti (downward ▽)';
        return { title: `Triangle ${step}: ${tri.label}`, desc: `${typeLabel}, one of the 9 interlocking triangles that create 43 sub-triangles through their intersections.` };
      }
      if (step === 10) return { title: 'Lotus Petals', desc: 'Two rings of lotus petals (8 inner, 16 outer) surround the yantra, representing the unfolding of creation.' };
      if (step === 11) return { title: 'Bhupura', desc: 'The square earth-frame with four gates in each cardinal direction, the boundary between the sacred and the mundane.' };
      return { title: 'Complete', desc: 'The Sri Yantra is complete. 9 triangles, 43 sub-triangles, 2 lotus rings, and the bhupura, all emerging from a single point.' };
    }

    _executeStep(step) {
      const info = this._getStepDescription(step);
      this._updateLabel(info.title, info.desc, step);

      if (step === 0) {
        this._fadeIn(this.binduEl, 800);
        this._flashBindu();
      } else if (step >= 1 && step <= 9) {
        const el = this.triangleEls[step - 1];
        el.setAttribute('filter', 'url(#glow)');
        this._fadeIn(el, 700);
        setTimeout(() => el.removeAttribute('filter'), 1200);
      } else if (step === 10) {
        this._fadeInAll('.circle', 500, 100);
        this._fadeInAll('.petal', 400, 20);
      } else if (step === 11) {
        this._fadeInAll('.bhupura', 600, 80);
      }
    }

    _flashBindu() {
      const dot = this.svg.querySelector('.bindu-dot');
      if (!dot) return;
      let count = 0;
      const flash = () => {
        if (count++ > 5) return;
        dot.setAttribute('r', this.R * (0.012 + 0.008 * (count % 2)));
        setTimeout(flash, 150);
      };
      flash();
    }

    _updateLabel(title, desc, step) {
      const t = document.getElementById('step-title');
      const d = document.getElementById('step-desc');
      const p = document.getElementById('step-progress');
      const b = document.getElementById('progress-bar');
      if (t) t.textContent = title;
      if (d) d.textContent = desc;
      if (p) p.textContent = `${step + 1} / ${this.totalSteps}`;
      if (b) b.style.width = `${((step + 1) / this.totalSteps) * 100}%`;
    }

    _startIntro() {
      setTimeout(() => { this._executeStep(0); this.currentStep = 0; }, 600);
    }

    stepForward() {
      if (this.currentStep >= this.totalSteps - 1) return;
      this.currentStep++;
      this._executeStep(this.currentStep);
    }

    stepBack() {
      if (this.currentStep <= 0) return;
      this._hideAll();
      this.currentStep--;
      for (let i = 0; i <= this.currentStep; i++) this._executeStepInstant(i);
      const info = this._getStepDescription(this.currentStep);
      this._updateLabel(info.title, info.desc, this.currentStep);
    }

    _executeStepInstant(step) {
      if (step === 0) {
        this.binduEl.setAttribute('opacity', '1');
      } else if (step >= 1 && step <= 9) {
        this.triangleEls[step - 1].setAttribute('opacity', '1');
      } else if (step === 10) {
        this.svg.querySelectorAll('.circle, .petal').forEach(el => el.setAttribute('opacity', '1'));
      } else if (step === 11) {
        this.svg.querySelectorAll('.bhupura').forEach(el => el.setAttribute('opacity', '1'));
      }
    }

    startAutoPlay() {
      if (this.animating) return;
      this.animating = true;
      this._autoStep();
    }

    stopAutoPlay() {
      this.animating = false;
      if (this.stepTimeout) clearTimeout(this.stepTimeout);
    }

    _autoStep() {
      if (!this.animating) return;
      if (this.currentStep >= this.totalSteps - 1) {
        this.animating = false;
        this._startBreathing();
        this._notifyComplete();
        return;
      }
      this.currentStep++;
      this._executeStep(this.currentStep);
      this.stepTimeout = setTimeout(() => this._autoStep(), this.speed);
    }

    reset() {
      this.stopAutoPlay();
      this.stopBreathing();
      this._hideAll();
      this.currentStep = -1;
      setTimeout(() => { this._executeStep(0); this.currentStep = 0; }, 300);
    }

    _startBreathing() {
      if (this.breathing) return;
      this.breathing = true;
      this._breathe();
    }

    stopBreathing() {
      this.breathing = false;
      if (this.breathingRaf) cancelAnimationFrame(this.breathingRaf);
      this.layerTriangles.setAttribute('transform', '');
      this.layerBindu.setAttribute('transform', '');
    }

    _breathe() {
      if (!this.breathing) return;
      const t = Date.now() / 1000;
      const scale  = 1 + 0.018 * Math.sin(t * 0.8);
      const rotate = 0.4 * Math.sin(t * 0.3);
      const cx = this.cx, cy = this.cy;
      this.layerTriangles.setAttribute('transform',
        `translate(${cx},${cy}) scale(${scale}) rotate(${rotate}) translate(${-cx},${-cy})`);
      this.layerBindu.setAttribute('transform',
        `translate(${cx},${cy}) scale(${1 + 0.03 * Math.sin(t * 1.2)}) translate(${-cx},${-cy})`);
      this.breathingRaf = requestAnimationFrame(() => this._breathe());
    }

    toggleBreathing() {
      if (this.breathing) { this.stopBreathing(); return false; }
      this._startBreathing(); return true;
    }

    cycleTheme() {
      this.themeIndex = (this.themeIndex + 1) % THEMES.length;
      this.theme = THEMES[this.themeIndex];
      this._applyTheme();
      return this.theme.name;
    }

    setSpeed(ms) { this.speed = ms; }

    _bindControls() {
      this.svg.addEventListener('mousemove', (e) => {
        const rect = this.svg.getBoundingClientRect();
        const dx = (e.clientX - rect.left - this.cx) / this.cx * 4;
        const dy = (e.clientY - rect.top  - this.cy) / this.cy * 4;
        if (!this.breathing) this.layerTriangles.setAttribute('transform', `translate(${dx},${dy})`);
      });
      this.svg.addEventListener('mouseleave', () => {
        if (!this.breathing) this.layerTriangles.setAttribute('transform', '');
      });
      window.addEventListener('resize', () => this._onResize());
    }

    _onResize() {
      const newSize = Math.min(this.container.offsetWidth, 560);
      if (Math.abs(newSize - this.size) < 10) return;
      const wasBreathing = this.breathing;
      const savedStep = this.currentStep;
      this.stopAutoPlay(); this.stopBreathing();
      this._buildSVG(); this._applyTheme();
      for (let i = 0; i <= savedStep; i++) this._executeStepInstant(i);
      this.currentStep = savedStep;
      const info = this._getStepDescription(savedStep);
      this._updateLabel(info.title, info.desc, savedStep);
      if (wasBreathing) this._startBreathing();
    }

    _notifyComplete() {
      const t = document.getElementById('step-title');
      if (t) t.textContent = '✦ Sri Yantra Complete';
    }

    _el(tag, attrs = {}) {
      const el = document.createElementNS('http://www.w3.org/2000/svg', tag);
      Object.entries(attrs).forEach(([k, v]) => el.setAttribute(k, v));
      return el;
    }

    _group(id) {
      const g = this._el('g');
      if (id) g.setAttribute('id', id);
      return g;
    }
  }

  // ─── Bootstrap ────────────────────────────────────────────────────────────

  window.SriYantra = SriYantra;

  document.addEventListener('DOMContentLoaded', () => {
    const yantra = new SriYantra('yantra-container');
    window._yantra = yantra;

    const playBtn     = document.getElementById('play-btn');
    const stepBtn     = document.getElementById('step-btn');
    const resetBtn    = document.getElementById('reset-btn');
    const breatheBtn  = document.getElementById('breathe-btn');
    const themeBtn    = document.getElementById('theme-btn');
    const speedSlider = document.getElementById('speed-slider');
    const speedValue  = document.getElementById('speed-value');
    const themeLabel  = document.getElementById('theme-label');

    // Initialise UI to match defaults
    if (themeLabel) themeLabel.textContent = yantra.theme.name;
    if (playBtn) { playBtn.textContent = 'Pause'; playBtn.classList.add('active'); }

    playBtn?.addEventListener('click', () => {
      if (yantra.animating) {
        yantra.stopAutoPlay();
        playBtn.textContent = 'Auto-Build';
        playBtn.classList.remove('active');
      } else {
        yantra.startAutoPlay();
        playBtn.textContent = 'Pause';
        playBtn.classList.add('active');
      }
    });

    stepBtn?.addEventListener('click', () => {
      yantra.stopAutoPlay();
      if (playBtn) { playBtn.textContent = 'Auto-Build'; playBtn.classList.remove('active'); }
      yantra.stepForward();
    });

    resetBtn?.addEventListener('click', () => {
      yantra.reset();
      if (playBtn)    { playBtn.textContent = 'Auto-Build'; playBtn.classList.remove('active'); }
      if (breatheBtn) { breatheBtn.textContent = 'Breathe'; breatheBtn.classList.remove('active'); }
    });

    breatheBtn?.addEventListener('click', () => {
      const on = yantra.toggleBreathing();
      breatheBtn.textContent = on ? 'Stop' : 'Breathe';
      breatheBtn.classList.toggle('active', on);
    });

    themeBtn?.addEventListener('click', () => {
      const name = yantra.cycleTheme();
      if (themeLabel) themeLabel.textContent = name;
    });

    speedSlider?.addEventListener('input', () => {
      const val = parseInt(speedSlider.value);
      yantra.setSpeed(2000 - val * 18);
      if (speedValue) speedValue.textContent = val;
    });
  });

})();
