document.addEventListener('DOMContentLoaded', () => {
  loadMovies();

  document.getElementById('searchActorBtn').addEventListener('click', async () => {
    const actor = document.getElementById('actorInput').value;
    const res = await fetch('/search/actor', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ actor })
    });
    const data = await res.json();
    if (data.error || data.length === 0) return showError('Actor not found');
    renderNormalTable(data);
  });

  document.getElementById('searchYearBtn').addEventListener('click', async () => {
    const year = document.getElementById('yearInput').value;
    const res = await fetch('/search/year', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ year })
    });
    const data = await res.json();
    if (data.error || data.length === 0) return showError('No movies found for that year');
    renderNormalTable(data);
  });

  document.getElementById('searchActorYearBtn').addEventListener('click', async () => {
    const actor = document.getElementById('actorInputAY').value;
    const year = document.getElementById('yearInputAY').value;
    const res = await fetch('/search/actor-year', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ actor, year })
    });
    const data = await res.json();
    if (data.error || data.length === 0) return showError('No movies found for that actor and year');
    renderNormalTable(data);
  });

  document.getElementById('searchMoviesOnlyBtn').addEventListener('click', async () => {
    const selected = getSelectedMovies('movieSelect');
    if (!selected.length) return showError('Select at least one movie');
    const res = await fetch('/movies-only', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ titles: selected })
    });
    const data = await res.json();
    if (!data || data.length === 0) return showError('No movie data found');
    renderNormalTable(data);
  });

  document.getElementById('searchCastingBtn').addEventListener('click', async () => {
    const movies = getSelectedMovies('castingSelect');
    if (movies.length > 5) {
      alert('Selected amount exceeds the maximum (5)');
      return;
    }
    const res = await fetch('/search/casting', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ movies })
    });
    const data = await res.json();
    if (data.error || data.length === 0) return showError('Casting not found');
    renderCastingTable(data);
  });

});

function loadMovies() {
  fetch('/movies/list')
    .then(res => res.json())
    .then(data => {
      const select1 = document.getElementById('movieSelect');
      const select2 = document.getElementById('castingSelect');
      data.forEach(title => {
        const opt1 = new Option(title, title);
        const opt2 = new Option(title, title);
        select1.add(opt1);
        select2.add(opt2);
      });
    });
}

function getSelectedMovies(selectId) {
  return Array.from(document.getElementById(selectId).selectedOptions).map(opt => opt.value);
}

function showError(message) {
  const container = document.getElementById('resultContainer');
  container.innerHTML = `<div class="alert alert-danger">${message}</div>`;
}

function renderNormalTable(data) {
  const container = document.getElementById('resultContainer');
  container.innerHTML = '';

  if (data.length > 0) {
    const header = document.createElement('div');
    header.className = 'd-flex justify-content-between fw-bold border-bottom pb-2 mb-2';
    header.innerHTML = `<div style="width: 25%">Title</div><div style="width: 20%">Year</div><div style="width: 20%">Score</div><div style="width: 20%">Votes</div>`;
    container.appendChild(header);
  }

  data.forEach(movie => {
    const row = document.createElement('div');
    row.className = 'd-flex justify-content-between border p-2 rounded mb-2 bg-light';
    row.innerHTML = `
      <div style="width: 25%">${movie.Title}</div>
      <div style="width: 20%">${movie.Year || '-'}</div>
      <div style="width: 20%">${movie.Score || '-'}</div>
      <div style="width: 20%">${movie.Votes || '-'}</div>
    `;
    container.appendChild(row);
  });
}

function renderCastingTable(data) {
  const container = document.getElementById('resultContainer');
  container.innerHTML = '';
  let currentTitle = '';

  data.forEach(entry => {
    if (entry.Title !== currentTitle) {
      currentTitle = entry.Title;
      const titleDiv = document.createElement('div');
      titleDiv.className = 'fw-bold mt-4 fs-5 border-bottom pb-1';
      titleDiv.textContent = currentTitle;
      container.appendChild(titleDiv);
    }
    const actorDiv = document.createElement('div');
    actorDiv.className = 'ms-3 mb-1';
    actorDiv.textContent = entry.Name;
    container.appendChild(actorDiv);
  });
}
