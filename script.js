'use strict';

(() => {
  const data = projectData;
  const stats = data.statistics;
  const format = new Intl.NumberFormat('en-US');
  const number = value => format.format(value);
  const make = (tag, text, className) => {
    const element = document.createElement(tag);
    if (text !== undefined) element.textContent = text;
    if (className) element.className = className;
    return element;
  };
  const prettyDate = value => new Intl.DateTimeFormat('en-GB', {
    day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC'
  }).format(new Date(value + 'T12:00:00Z'));
  const publicLink = item => {
    try {
      const url = new URL(item.url);
      if (url.protocol !== 'https:') return null;
      const link = make('a', item.label || item.name);
      link.href = url.href;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      return link;
    } catch { return null; }
  };
  for (const id of ['repoLink', 'footerRepo']) document.getElementById(id).href = data.repository;
  document.getElementById('project-status').textContent = data.status;
  document.getElementById('year').textContent = String(new Date().getFullYear());

  // Keep the latest unique, dated entries without silently duplicating milestones.
  const seen = new Set();
  const entries = projectUpdates.filter(item => {
    if (!item.id || seen.has(item.id) || !/^\d{4}-\d{2}-\d{2}$/.test(item.date) ||
        Number.isNaN(Date.parse(item.date + 'T12:00:00Z'))) return false;
    seen.add(item.id);
    return true;
  }).sort((a, b) => b.date.localeCompare(a.date) || a.id.localeCompare(b.id));
  const updated = entries.map(item => item.date).concat(data.verifiedOn).sort().at(-1);
  document.querySelectorAll('.last-updated').forEach(time => {
    time.dateTime = updated;
    time.textContent = prettyDate(updated);
  });

  const cards = [
    ['originalRecords', 'Original dataset records', 'Rows across the five original CSV exports, including historical entities and regional records before filtering.'],
    ['cleanedCropRecords', 'Cleaned crop records', 'Crop observations retained after identifier, year, numeric-value, and duplicate checks.'],
    ['mergedRecords', 'Final merged records', 'Country-year-crop observations with both climate measurements. These are preparation results, not model predictions.'],
    ['entities', 'Countries and territories', 'Distinct ISO3 identifiers in the final file. Coverage is not universal or identical across crops.'],
    ['crops', 'Research crops', 'Wheat, rice, and maize. No stability ranking has been calculated.'],
    ['thailandRecords', 'Thailand observations', 'Complete merged crop-year observations for the planned secondary case study.']
  ];
  for (const [key, title, description] of cards) {
    const details = make('details', undefined, 'stat-card');
    const summary = make('summary');
    summary.append(make('span', number(stats[key]), 'stat-number'),
      make('span', title, 'stat-label'), make('span', 'What this count means', 'stat-hint'));
    details.append(summary, make('p', description));
    document.getElementById('dataset-stats').append(details);
  }
  for (const crop of data.cropCoverage) {
    const row = make('tr');
    const heading = make('th', crop.crop); heading.scope = 'row';
    row.append(heading, make('td', number(crop.records)), make('td', number(crop.entities)),
      make('td', crop.start + '–' + crop.end));
    document.getElementById('crop-coverage').append(row);
  }
  for (const source of data.sources) {
    const card = make('article', undefined, 'source-card');
    card.append(make('h4', source.name), make('p', source.detail));
    const link = publicLink({ ...source, label: 'View ' + source.name.toLowerCase() + ' source ↗' });
    if (link) card.append(link);
    document.getElementById('source-cards').append(card);
  }
  for (const step of data.workflow) {
    const item = make('li');
    item.append(make('h3', step.title), make('p', step.detail));
    document.getElementById('cleaning-workflow').append(item);
  }
  document.getElementById('merge-explanation').textContent =
    number(stats.cleanedCropRecords) + ' cleaned crop observations were considered. ' +
    number(stats.excludedRecords) + ' lacked matching complete climate information, leaving ' +
    number(stats.mergedRecords) + ' observations for later analysis.';
  const keptPercentage = stats.mergedRecords / stats.cleanedCropRecords * 100;
  document.getElementById('merge-kept').style.width = keptPercentage + '%';
  document.getElementById('merge-excluded').style.width = (100 - keptPercentage) + '%';
  for (const [title, value] of [['Included', stats.mergedRecords], ['Incomplete climate coverage', stats.excludedRecords]]) {
    document.getElementById('merge-counts').append(make('dt', title), make('dd', number(value)));
  }

  const filter = document.getElementById('milestone-filter');
  for (const milestone of [...new Set(entries.map(item => item.milestone))].sort()) {
    const option = make('option', milestone); option.value = milestone; filter.append(option);
  }
  const listBlock = (heading, items) => {
    const section = make('section');
    section.append(make('h4', heading));
    const list = make('ul');
    items.forEach(item => list.append(make('li', item)));
    section.append(list);
    return section;
  };
  const renderUpdates = () => {
    const target = document.getElementById('updates');
    target.replaceChildren();
    const selected = entries.filter(item => filter.value === 'all' || item.milestone === filter.value);
    document.getElementById('update-count').textContent = selected.length + (selected.length === 1 ? ' update' : ' updates');
    if (!selected.length) {
      target.append(make('p', 'No updates here yet. Choose another milestone or check back as the research progresses.', 'empty-state'));
      return;
    }
    for (const item of selected) {
      const article = make('article', undefined, 'update'); article.id = 'update-' + item.id;
      const date = make('time', prettyDate(item.date)); date.dateTime = item.date;
      const content = make('div');
      const badges = make('div', undefined, 'update-badges');
      badges.append(make('span', item.milestone, 'pill'), make('span', item.status, 'status-badge'));
      content.append(make('h3', item.title), make('p', item.summary), badges);
      if (['completed', 'issues', 'nextSteps', 'links'].some(key => item[key]?.length)) {
        const details = make('details', undefined, 'update-details');
        details.append(make('summary', 'Read milestone details'));
        for (const [key, label] of [['completed', 'Work completed'], ['issues', 'Issues and limitations'], ['nextSteps', 'Next steps']]) {
          if (item[key]?.length) details.append(listBlock(label, item[key]));
        }
        if (item.links?.length) {
          const links = make('div', undefined, 'supporting-links');
          for (const resource of item.links) { const link = publicLink(resource); if (link) links.append(link); }
          details.append(links);
        }
        content.append(details);
      }
      article.append(date, content); target.append(article);
    }
  };
  filter.addEventListener('change', renderUpdates);
  renderUpdates();

  data.methodology.forEach((stage, index) => {
    const item = make('li', undefined, 'method-card');
    item.append(make('span', String(index + 1).padStart(2, '0'), 'card-num'),
      make('h3', stage.title), make('span', stage.state, 'status-badge ' + stage.kind), make('p', stage.detail));
    document.getElementById('method-stages').append(item);
  });
  [
    number(stats.duplicateKeys) + ' duplicate country-year-crop keys in the final dataset.',
    'No unexpected row multiplication during integration.',
    'All ' + number(stats.matchedMeasurements) + ' measurements across ' + number(stats.mergedRecords) +
      ' merged observations matched saved local source records in the independent audit.',
    'Statistically flagged outliers were retained for investigation.'
  ].forEach(item => document.getElementById('quality-findings').append(make('li', item)));
  [
    'Country and crop coverage is unequal; these counts do not represent a balanced global panel.',
    'The only complete crop observation for 2025 is US maize.',
    'Calendar-year climate may not align with each crop’s growing season. Historical boundary compatibility is partly unverified.',
    'Associations require further analysis; the research question has not been answered.'
  ].forEach(item => document.getElementById('research-limitations').append(make('li', item)));

  const menu = document.getElementById('menuBtn');
  const nav = document.getElementById('nav');
  const setMenu = open => {
    nav.classList.toggle('open', open);
    menu.setAttribute('aria-expanded', String(open));
    menu.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
  };
  menu.addEventListener('click', () => setMenu(menu.getAttribute('aria-expanded') !== 'true'));
  nav.querySelectorAll('a').forEach(link => link.addEventListener('click', () => setMenu(false)));
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && menu.getAttribute('aria-expanded') === 'true') { setMenu(false); menu.focus(); }
  });
  document.addEventListener('click', event => { if (!event.target.closest('.topbar')) setMenu(false); });
  window.matchMedia('(min-width: 1101px)').addEventListener('change', () => setMenu(false));
})();
