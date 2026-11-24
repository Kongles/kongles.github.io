(() => {
  const demo = document.getElementById('rail-demo');
  const mode = demo.querySelector('select');
  const noise = demo.querySelector('input');
  const sigma = demo.querySelector('#rail-sigma');
  const result = demo.querySelector('#rail-result');

  function update() {
    const linear = mode.value === 'kf';
    const predictedPosition = 4;
    const predictedVariance = 1;
    const predictedReading = linear ? predictedPosition : Math.hypot(predictedPosition, 3);
    const slope = linear ? 1 : predictedPosition / predictedReading;
    const innovation = (linear ? 6 : 5.5) - predictedReading;
    const variance = noise.valueAsNumber ** 2;
    const gain = predictedVariance * slope / (slope ** 2 * predictedVariance + variance);
    const position = predictedPosition + gain * innovation;
    const posteriorVariance = (1 - gain * slope) * predictedVariance;

    sigma.textContent = noise.valueAsNumber.toFixed(1) + ' m';
    result.textContent = 'R = ' + variance.toFixed(2) + ' m² · K = ' + gain.toFixed(3)
      + ' · 보정 위치 ' + position.toFixed(2) + ' m · 보정 표준편차 '
      + Math.sqrt(posteriorVariance).toFixed(2) + ' m';
  }

  mode.addEventListener('change', () => {
    noise.value = mode.value === 'kf' ? '1' : '0.6';
    update();
  });
  noise.addEventListener('input', update);
  update();
  demo.hidden = false;
})();
