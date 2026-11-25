(() => {
  const demo = document.querySelector('[data-alarm-demo]');
  const slider = demo.querySelector('input');
  const result = demo.querySelector('output');
  function update() {
    const percent = Number(slider.value);
    const trueAlarms = 90 * percent;
    const falseAlarms = 5 * (100 - percent);
    const precision = 100 * trueAlarms / (trueAlarms + falseAlarms);
    slider.setAttribute('aria-valuetext', percent + '퍼센트');
    result.textContent = `장애물 비율 ${percent}% · 10,000구간당 진짜 경보 ${trueAlarms}건, 오경보 ${falseAlarms}건 · 경보 뒤 장애물 확률 ${precision.toFixed(1)}%`;
  }
  slider.addEventListener('input', update);
  update();
  demo.hidden = false;
})();
