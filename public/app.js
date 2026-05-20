fetch('songs.json')
  .then(res => res.json())
  .then(songs => {

    const container = document.getElementById('songs');
    const lyricsPage = document.getElementById('lyricsPage');
    const songTitle = document.getElementById('songTitle');
    const songArtist = document.getElementById('songArtist');
    const lyrics = document.getElementById('lyrics');
    const backBtn = document.getElementById('backBtn');
    const search = document.getElementById('search');

    const fullscreenBtn = document.getElementById('fullscreenBtn');
    const scrollSlow = document.getElementById('scrollSlow');
    const scrollMedium = document.getElementById('scrollMedium');
    const scrollFast = document.getElementById('scrollFast');
    const scrollStop = document.getElementById('scrollStop');

    let autoScroll = null;
    let scrollSpeed = 0;

    function stopScroll() {
      scrollSpeed = 0;

      if (autoScroll) {
        cancelAnimationFrame(autoScroll);
        autoScroll = null;
      }
    }

    function scrollLoop() {
      if (scrollSpeed > 0) {
        window.scrollBy(0, scrollSpeed);
        autoScroll = requestAnimationFrame(scrollLoop);
      }
    }

    function startScroll(speed, interval) {

  stopScroll();

  autoScroll = setInterval(() => {

    lyrics.scrollBy(0, speed);

  }, interval);

}

function stopScroll() {

  clearInterval(autoScroll);

}

    function showSongs() {
      stopScroll();

      // AJOUT : On retire le mode karaoké pour retrouver le scroll normal de la liste
      document.body.classList.remove('mode-karaoke');
      
      container.style.display = 'block';
      search.style.display = 'block';
      lyricsPage.classList.add('hidden');
      window.scrollTo(0, 0);
    }

    function showLyrics(song) {
      stopScroll();

      // AJOUT : On active le mode karaoké pour bloquer le scroll du PC/vidéoprojecteur
      document.body.classList.add('mode-karaoke');
      
      container.style.display = 'none';
      search.style.display = 'none';
      lyricsPage.classList.remove('hidden');

      songTitle.textContent = song.title;
      songArtist.textContent = song.artist;
      let formattedLyrics = song.lyrics

  .replace(
    /## REFRAIN([\s\S]*?)## FIN REFRAIN/g,
    '<div class="refrain">$1</div>'
  )

  .replace(/\n/g, '<br>');

lyrics.innerHTML = formattedLyrics;

      window.scrollTo(0, 0);
    }

    function createTable(title, list, startNumber) {
      const section = document.createElement('section');
      section.className = 'toc-section';

      section.innerHTML = `<h2>${title}</h2>`;

      const table = document.createElement('table');
      table.className = 'toc-table';

      table.innerHTML = `
        <thead>
          <tr>
            <th>N°</th>
            <th>Titre / interprète</th>
          </tr>
        </thead>
        <tbody></tbody>
      `;

      const tbody = table.querySelector('tbody');

      list.forEach((song, index) => {
        const tr = document.createElement('tr');

        tr.innerHTML = `
          <td>${String(startNumber + index).padStart(2, '0')}</td>
          <td>
            <button class="toc-link">
              ${song.title} <span>(${song.artist})</span>
            </button>
          </td>
        `;

        tr.querySelector('button').onclick = () => showLyrics(song);
        tbody.appendChild(tr);
      });

      section.appendChild(table);
      container.appendChild(section);
    }

    function displaySongs(list) {
      container.innerHTML = '';

      const french = list.slice(0, 50);
      const english = list.slice(50);

      createTable('Titres Français', french, 1);
      createTable('Titres Anglais', english, 51);
    }

    search.addEventListener('input', () => {
      const value = search.value.toLowerCase();

      const filtered = songs.filter(song =>
        song.title.toLowerCase().includes(value) ||
        song.artist.toLowerCase().includes(value)
      );
      displaySongs(filtered);
    });

    backBtn.onclick = showSongs;

    if (fullscreenBtn) {
      fullscreenBtn.onclick = () => {
        const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);

        if (isMobile) {
          alert('Le mode plein écran est conseillé uniquement sur PC/TV.');
          return;
        }

        if (!document.fullscreenElement) {
          document.documentElement.requestFullscreen();
        } else {
          document.exitFullscreen();
        }
      };
    }

    scrollSlow.onclick = () => startScroll(1, 70);
    scrollMedium.onclick = () => startScroll(1, 45);
    scrollFast.onclick = () => startScroll(1, 25);
    scrollStop.onclick = stopScroll;

    displaySongs(songs);

  });
