(() => {
  const controls = document.querySelector('.journal-controls');
  const buttons = [...controls.querySelectorAll('[data-filter]')];
  const topicLinks = [...document.querySelectorAll('[data-topic-filter]')];
  const topicButton = controls.querySelector('.active-topic');
  const status = controls.querySelector('[role="status"]');
  const entries = [...document.querySelectorAll('.entry')];
  const empty = document.querySelector('.empty-state');
  const journalHeading = document.querySelector('#journal-title');
  let kind = 'all';
  let topic = '';

  function updateFilters() {
    buttons.forEach(button => button.setAttribute('aria-pressed', String(kind === button.dataset.filter)));
    const activeLink = topicLinks.find(link => link.dataset.topicFilter === topic);
    topicLinks.forEach(link => {
      if (link === activeLink) link.setAttribute('aria-current', 'true');
      else link.removeAttribute('aria-current');
    });
    topicButton.hidden = !activeLink;
    if (activeLink) {
      const label = activeLink.querySelector('strong').textContent;
      topicButton.textContent = `${label} ×`;
      topicButton.setAttribute('aria-label', `${label} 주제 선택 해제`);
    }

    let count = 0;
    for (const entry of entries) {
      entry.hidden = (kind !== 'all' && entry.dataset.kind !== kind) || (topic !== '' && !entry.dataset.topics.split(' ').includes(topic));
      if (!entry.hidden) count++;
    }
    empty.hidden = count !== 0;
    status.textContent = `노트 ${count}개`;
  }

  buttons.forEach(button => button.addEventListener('click', () => {
    kind = button.dataset.filter;
    updateFilters();
  }));

  topicLinks.forEach(link => link.addEventListener('click', event => {
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    topic = link.dataset.topicFilter;
    kind = 'all';
    updateFilters();
    if (location.hash !== '#journal') location.hash = 'journal';
    journalHeading.setAttribute('tabindex', '-1');
    journalHeading.focus({ preventScroll: true });
    document.querySelector('#journal').scrollIntoView();
  }));

  topicButton.addEventListener('click', () => {
    topic = '';
    updateFilters();
    buttons.find(button => button.dataset.filter === kind).focus({ preventScroll: true });
  });

  controls.hidden = false;
  updateFilters();
})();
