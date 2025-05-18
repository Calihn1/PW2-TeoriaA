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

});
