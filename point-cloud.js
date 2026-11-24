const TAU = 2 * Math.PI;
const KOREA_LONGITUDE = 128 * Math.PI / 180;
const KOREA_COLOR = '#63ff00';
const POINT_COLORS = ['#79797970', '#a5a5a58c', '#acacac', '#cacaca', '#e5e5e5', '#ffffff', KOREA_COLOR];

function isLand(longitude, latitude) {
  const { columns, rows, bits } = LAND_MASK;
  const col = Math.min(columns - 1, Math.floor((longitude + Math.PI) * columns / TAU));
  const row = Math.min(rows - 1, Math.floor((latitude + Math.PI / 2) * rows / Math.PI));
  const cell = row * columns + col;
  return Boolean(bits.charCodeAt(cell >> 3) & (1 << (cell & 7)));
}

// Sample along horizontal laser sweeps. Land returns are denser than water.
function buildPointCloud() {
  const points = [];
  let seed = 73;
  function random() {
    seed = (Math.imul(1664525, seed) + 1013904223) >>> 0;
    return seed / 4294967296;
  }

  const channels = 88;
  for (let channel = 0; channel < channels; channel++) {
    const latitude = Math.PI * ((channel + .5) / channels - .5);
    const ring = Math.cos(latitude);
    const samples = Math.ceil(415 * ring);
    const offset = random();
    for (let i = 0; i < samples; i++) {
      const longitude = TAU * (i + offset) / samples - Math.PI;
      const land = isLand(longitude, latitude);
      const intensity = random();
      const majorRing = channel % 8 === 0;
      if (!land && intensity > (majorRing ? .85 : .055)) continue;
      if (land && intensity < .12) continue;
      const range = 1 + (random() - .5) * .009;
      points.push({
        x: ring * Math.sin(longitude) * range,
        y: Math.sin(latitude) * range,
        z: ring * Math.cos(longitude) * range,
        land, intensity, majorRing
      });
    }
  }
  // Southern Korean land sampled every quarter degree (latitude, west, east).
  // Source: Natural Earth 1:50m Admin 0 countries, geometry with ADM0_A3 = KOR.
  const koreaRows = [
    [33.25, 126.25, 126.5], [33.5, 126.5, 126.75], [34.5, 126.25, 126.5],
    [34.75, 126.5, 127], [34.75, 128, 128], [35, 126.5, 127.75], [35, 128.25, 128.25],
    [35.25, 126.5, 129.25], [35.5, 126.5, 129.25], [35.75, 126.75, 129.5],
    [36, 126.75, 129.5], [36.25, 126.75, 129.25], [36.5, 126.75, 129.25],
    [36.75, 126.25, 129.25], [37, 126.5, 126.5], [37, 127, 129.25],
    [37.25, 127, 129.25], [37.5, 126.75, 129], [37.75, 126.5, 128.75],
    [38, 127, 128.75], [38.25, 127.25, 128.5]
  ];
  for (const [latitude, west, east] of koreaRows) {
    const lat = latitude * Math.PI / 180;
    for (let degree = west; degree <= east; degree += .25) {
      const lon = degree * Math.PI / 180;
      points.push({
        x: Math.cos(lat) * Math.sin(lon), y: Math.sin(lat), z: Math.cos(lat) * Math.cos(lon),
        land: true, korea: true, intensity: .7
      });
    }
  }
  return points;
}

function drawGrid(ctx, project) {
  ctx.strokeStyle = '#696969';
  ctx.lineWidth = .65;
  ctx.beginPath();
  for (let i = -7; i <= 7; i++) {
    const v = i * .55;
    ctx.moveTo(...project(v, -3.85));
    ctx.lineTo(...project(v, 3.85));
    ctx.moveTo(...project(-3.85, v));
    ctx.lineTo(...project(3.85, v));
  }
  ctx.stroke();
}

// Discontinuous rings are ground returns in the same frame as the grid and axes.
function drawGroundReturns(ctx, project, radius) {
  const size = Math.max(.65, radius * .0054);
  ctx.fillStyle = '#d5d5d5ae';
  ctx.beginPath();
  for (let beam = 0; beam < 10; beam++) {
    const range = .36 + beam * .14 + beam * beam * .005;
    const samples = Math.ceil(370 * range);
    for (let i = 0; i < samples; i++) {
      const angle = i * TAU / samples;
      if (Math.sin(angle * 3 + beam * .53) + .63 * Math.cos(angle * 7 + beam) < -.69) continue;
      const scatter = .003 * Math.sin(i * 3.67 + beam);
      const [x, y] = project((range + scatter) * Math.cos(angle), (range + scatter) * Math.sin(angle));
      ctx.rect(x, y, size, size);
    }
  }
  ctx.fill();
}

function drawAxes(ctx, width, height) {
  const arm = Math.min(29, width * .065);
  const ox = width - arm - 22;
  const oy = height - arm * .45 - 17;
  ctx.font = '11px ui-monospace, monospace';
  ctx.lineWidth = 2;
  for (const [label, dx, dy, color] of [
    ['X', -arm, arm * .45, '#ff4545'],
    ['Y', arm, arm * .45, '#42e052'],
    ['Z', 0, -arm * 1.17, '#5c7fff']
  ]) {
    const ex = ox + dx;
    const ey = oy + dy;
    ctx.strokeStyle = color;
    ctx.beginPath();
    ctx.moveTo(ox, oy);
    ctx.lineTo(ex, ey);
    ctx.stroke();
    ctx.fillStyle = color;
    ctx.fillText(label, ex + (label === 'X' ? -10 : 4), ey + 4);
  }
}

function drawSphere(ctx, points, cx, cy, radius, angle) {
  const yawCos = Math.cos(angle);
  const yawSin = Math.sin(angle);
  const pitchCos = Math.cos(.33);
  const pitchSin = Math.sin(.33);
  const batches = POINT_COLORS.map(() => []);
  // Attenuate the floor through the point cloud without outlining its silhouette.
  ctx.fillStyle = '#303030cf';
  ctx.beginPath();
  ctx.arc(cx, cy, radius * 1.002, 0, TAU);
  ctx.fill();

  let labelAnchor;
  for (const point of points) {
    const x = point.x * yawCos - point.z * yawSin;
    const z = point.x * yawSin + point.z * yawCos;
    const y = point.y * pitchCos - z * pitchSin;
    const depth = point.y * pitchSin + z * pitchCos;
    if (depth < 0 && (!point.majorRing || point.intensity > .5)) continue;
    let level = 0;
    if (depth >= 0) {
      level = point.land ? 2 + Math.min(3, Math.floor(point.intensity * 2.6 + depth * 1.5)) : Number(point.majorRing);
    }
    if (point.korea) {
      if (depth <= 0) continue;
      level = POINT_COLORS.length - 1;
      if (depth > .17 && !labelAnchor) labelAnchor = [cx + x * radius, cy - y * radius];
    }
    const size = Math.max(.62, radius * (.0035 + .0038 * point.intensity + .0015 * Math.max(0, depth)));
    batches[level].push(cx + x * radius, cy - y * radius, size);
  }
  batches.forEach((batch, level) => {
    ctx.fillStyle = POINT_COLORS[level];
    ctx.beginPath();
    for (let i = 0; i < batch.length; i += 3) ctx.rect(batch[i], batch[i + 1], batch[i + 2], batch[i + 2]);
    ctx.fill();
  });
  if (labelAnchor) {
    const [x, y] = labelAnchor;
    const lx = x + 22;
    const ly = y - 20;
    ctx.save();
    ctx.strokeStyle = KOREA_COLOR;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(lx - 6, ly);
    ctx.lineTo(lx, ly);
    ctx.stroke();
    ctx.font = '600 12px system-ui, sans-serif';
    ctx.strokeStyle = '#303030';
    ctx.lineWidth = 3;
    ctx.strokeText('대한민국', lx + 4, ly + 4);
    ctx.fillStyle = KOREA_COLOR;
    ctx.fillText('대한민국', lx + 4, ly + 4);
    ctx.restore();
  }
}

function drawGlobe(ctx, points, width, height, angle, progress, mobile, layers) {
  const cx = width * (mobile ? .5 : .59 + .09 * progress);
  const cy = height * .402;
  const radius = Math.min(height * .327, width * (mobile ? .31 : .205));
  const originY = cy + radius * 1.14;
  // Oblique camera, Z up. All ground geometry shares this projection.
  function project(x, y, z = 0) {
    const forward = (x + y) * Math.SQRT1_2;
    const scale = radius / (1 - .075 * (.89 * forward + .45 * z));
    return [cx + (y - x) * Math.SQRT1_2 * scale, originY + (.45 * forward - .89 * z) * scale];
  }
  ctx.clearRect(0, 0, width, height);
  if (layers.grid) drawGrid(ctx, project);
  if (layers.cloud) {
    drawGroundReturns(ctx, project, radius);
    drawSphere(ctx, points, cx, cy, radius, angle);
  }
  if (layers.axes) drawAxes(ctx, width, height);
}
