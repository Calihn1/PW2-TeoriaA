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
});


