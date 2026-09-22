/**
 * Spotify Web Player - Single Page Application Engine
 * Pure Modern JavaScript (ES6+) with Bootstrap 5 Integration
 */

// ==========================================================================
// 1. Music Catalog & Initial Data
// ==========================================================================
const songDatabase = [
  {
    id: 1,
    title: "Midnight Echoes",
    artist: "Aria Vance",
    album: "Synthwave Horizon",
    duration: 215, // seconds (3:35)
    category: "pop",
    cover: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=500&auto=format&fit=crop&q=80",
    lyrics: [
      "[Intro - Electronic atmospheric synths]",
      "Walking through the neon lights in the midnight air",
      "Echoes in the valley, running without a care",
      "Feel the rhythm take control of the beating heart",
      "We are infinite, nothing can tear us apart",
      "[Chorus]",
      "Underneath the strobe lights glowing so bright",
      "Dancing till tomorrow brings the morning light",
      "Midnight echoes calling out your name",
      "In this soundwave, we will never be the same"
    ],
    liked: true
  },
  {
    id: 2,
    title: "Neon Horizon",
    artist: "Marcus Cole",
    album: "Future Retro 2026",
    duration: 198,
    category: "electronic",
    cover: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=500&auto=format&fit=crop&q=80",
    lyrics: [
      "[Instrumental Synth Opening]",
      "Glow of the city on the highway drive",
      "Electricity keeps the night alive",
      "Pushing the throttle into the neon glow",
      "Where the future meets the radio",
      "[Drop]",
      "Neon horizon calling my soul",
      "Take the wheel and lose control"
    ],
    liked: false
  },
  {
    id: 3,
    title: "Chill Lo-Fi Study Beats",
    artist: "Luna Ray",
    album: "Rainy Afternoon Vibes",
    duration: 164,
    category: "lofi",
    cover: "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=500&auto=format&fit=crop&q=80",
    lyrics: [
      "[Soft vinyl crackle & warm Rhodes piano chords]",
      "Coffee in the cup, drops upon the window pane",
      "Drifting away from the noise and strain",
      "Notes flowing easy, peaceful and slow",
      "Watch the cozy afternoon shadows grow"
    ],
    liked: true
  },
  {
    id: 4,
    title: "Golden Hour Glow",
    artist: "Aria Vance",
    album: "Summer Reverie",
    duration: 182,
    category: "pop",
    cover: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=500&auto=format&fit=crop&q=80",
    lyrics: [
      "Sun sinking low on the ocean line",
      "Every single moment feeling so divine",
      "Hold my hand and step into the tide",
      "With you forever by my side",
      "[Chorus]",
      "Golden hour, golden skies",
      "Seeing the universe inside your eyes"
    ],
    liked: true
  },
  {
    id: 5,
    title: "Thunderbolt Requiem",
    artist: "The Synths & Rockers",
    album: "Electric Overdrive",
    duration: 245,
    category: "rock",
    cover: "https://images.unsplash.com/photo-1518609878373-06d740f60d8b?w=500&auto=format&fit=crop&q=80",
    lyrics: [
      "[Heavy distorted guitar riff intro]",
      "Lightning strikes in the heart of the storm",
      "A brand new revolution is being born",
      "Screaming guitars and drums of steel",
      "This is the rush that we all can feel!",
      "[Guitar Solo]"
    ],
    liked: false
  },
  {
    id: 6,
    title: "Cyber Streets & Hustle",
    artist: "Marcus Cole ft. Cyber Pulse",
    album: "Grid Lockdown",
    duration: 175,
    category: "hiphop",
    cover: "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=500&auto=format&fit=crop&q=80",
    lyrics: [
      "[808 Bass & Hi-Hat Trap Beat]",
      "From the basement to the skyscraper floor",
      "Kicking down every locked up door",
      "Stacking up the bars, keeping it real",
      "Only the strongest survive the deal"
    ],
    liked: true
  },
  {
    id: 7,
    title: "Astral Odyssey",
    artist: "Cyber Pulse",
    album: "Interstellar Journey",
    duration: 230,
    category: "electronic",
    cover: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=500&auto=format&fit=crop&q=80",
    lyrics: [
      "[Space ambient sweep]",
      "Floating past the orbit of Mars",
      "Lost in a galaxy of million stars",
      "Pulse of the cosmos, bass so deep",
      "Secrets that the dark nebulae keep"
    ],
    liked: false
  },
  {
    id: 8,
    title: "Deep Tech: Future of AI",
    artist: "Elena Rostova",
    album: "Tech Frontier Daily Podcast",
    duration: 290,
    category: "podcast",
    cover: "https://images.unsplash.com/photo-1590602847861-f357a9332bbc?w=500&auto=format&fit=crop&q=80",
    lyrics: [
      "[Podcast Intro Theme Music]",
      "Welcome back to Tech Frontier.",
      "Today we discuss artificial intelligence architectures, neural synthesis,",
      "and the next generation of full-stack web applications with responsive frameworks.",
      "Stay tuned for interviews with leading engineers."
    ],
    liked: true
  }
];

// User Created Playlists
let userPlaylists = [
  "Today's Top Hits",
  "Chill Lo-Fi Beats",
  "Global Pop 2026",
  "Rock Classics & Anthems",
  "Hip Hop Central",
  "Tech & Science Podcasts"
];

// ==========================================================================
// 2. Application State
// ==========================================================================
const appState = {
  currentSongIndex: 0,
  isPlaying: false,
  currentTime: 0,
  duration: 215,
  isShuffle: false,
  isRepeat: false,
  volume: 0.8,
  isMuted: false,
  activeFilter: "all",
  searchQuery: "",
  queue: [...songDatabase],
  audioContext: null,
  oscillator: null,
  gainNode: null,
  playbackTimer: null,
  visualizerStyle: "bars" // 'bars', 'waves', 'particles'
};

// ==========================================================================
// 3. Audio Player Engine (Web Audio API Synthesizer & Simulator)
// ==========================================================================
class WebAudioPlayer {
  constructor() {
    this.ctx = null;
    this.gain = null;
  }

  initContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
        this.gain = this.ctx.createGain();
        this.gain.gain.setValueAtTime(appState.volume, this.ctx.currentTime);
        this.gain.connect(this.ctx.destination);
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  playTone(freq = 440, type = 'sine', duration = 0.3) {
    try {
      this.initContext();
      if (!this.ctx || appState.isMuted) return;
      
      const osc = this.ctx.createOscillator();
      const noteGain = this.ctx.createGain();
      
      osc.type = type;
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
      
      const now = this.ctx.currentTime;
      noteGain.gain.setValueAtTime(appState.volume * 0.25, now);
      noteGain.gain.exponentialRampToValueAtTime(0.001, now + duration);
      
      osc.connect(noteGain);
      noteGain.connect(this.gain);
      
      osc.start(now);
      osc.stop(now + duration);
    } catch (e) {
      console.log('Audio synth message:', e);
    }
  }

  setVolume(val) {
    if (this.gain && this.ctx) {
      this.gain.gain.setValueAtTime(appState.isMuted ? 0 : val, this.ctx.currentTime);
    }
  }
}

const audioPlayer = new WebAudioPlayer();

// ==========================================================================
// 4. UI Helper Functions
// ==========================================================================
function formatTime(seconds) {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
}

function showToast(message, iconClass = "fa-circle-check", isSuccess = true) {
  const toastEl = document.getElementById('liveToast');
  const toastMsg = document.getElementById('toastMessage');
  const toastIcon = document.getElementById('toastIcon');

  if (toastEl && toastMsg && toastIcon) {
    toastMsg.textContent = message;
    toastIcon.className = `fa-solid ${iconClass} ${isSuccess ? 'text-success' : 'text-warning'} fs-5`;
    const toast = new bootstrap.Toast(toastEl, { delay: 3000 });
    toast.show();
  }
}

function updateLikedBadgeCount() {
  const count = songDatabase.filter(s => s.liked).length;
  const badge = document.getElementById('likedBadgeCount');
  if (badge) badge.textContent = count;
}

// ==========================================================================
// 5. Render Song Cards & Catalog
// ==========================================================================
function renderSongCards() {
  const container = document.getElementById('songGridContainer');
  if (!container) return;

  const filtered = songDatabase.filter(song => {
    const matchesFilter = appState.activeFilter === "all" || song.category === appState.activeFilter;
    const matchesSearch = song.title.toLowerCase().includes(appState.searchQuery.toLowerCase()) ||
                          song.artist.toLowerCase().includes(appState.searchQuery.toLowerCase()) ||
                          song.album.toLowerCase().includes(appState.searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  if (filtered.length === 0) {
    container.innerHTML = `
      <div class="col-12 text-center py-5 text-secondary">
        <i class="fa-solid fa-compact-disc fs-1 mb-3 text-muted"></i>
        <h5>No tracks found for "${appState.searchQuery || appState.activeFilter}"</h5>
        <p class="fs-7">Try searching for other artists, songs, or reset your filters.</p>
        <button class="btn btn-outline-light btn-sm rounded-pill mt-2" onclick="resetFilters()">Show All Songs</button>
      </div>
    `;
    return;
  }

  container.innerHTML = filtered.map(song => `
    <div class="col-6 col-sm-6 col-md-4 col-lg-3 col-xl-3">
      <div class="song-card p-3 rounded-4 h-100 d-flex flex-column" data-song-id="${song.id}">
        <div class="song-img-wrapper mb-3 position-relative">
          <img src="${song.cover}" alt="${song.title}" class="song-card-img rounded-3">
          <button class="btn btn-circle song-card-play-btn shadow" title="Play ${song.title}" data-song-id="${song.id}">
            <i class="fa-solid ${appState.isPlaying && songDatabase[appState.currentSongIndex].id === song.id ? 'fa-pause' : 'fa-play'}"></i>
          </button>
        </div>
        <div class="song-card-info flex-grow-1">
          <h6 class="text-white fw-bold text-truncate mb-1" title="${song.title}">${song.title}</h6>
          <p class="text-secondary fs-8 mb-2 text-truncate">${song.artist} • ${song.album}</p>
        </div>
        <div class="d-flex justify-content-between align-items-center mt-auto pt-2 border-top border-secondary border-opacity-10">
          <span class="badge bg-dark-subtle text-light rounded-pill fs-8 text-uppercase">${song.category}</span>
          <div class="d-flex gap-2">
            <button class="btn btn-sm btn-icon text-secondary heart-card-btn ${song.liked ? 'liked text-success' : ''}" data-song-id="${song.id}" title="${song.liked ? 'Unlike' : 'Like'}">
              <i class="${song.liked ? 'fa-solid text-success' : 'fa-regular'} fa-heart"></i>
            </button>
            <button class="btn btn-sm btn-icon text-secondary info-card-btn" data-song-id="${song.id}" title="View Details">
              <i class="fa-solid fa-ellipsis"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
  `).join('');

  attachCardEvents();
}

function attachCardEvents() {
  // Play buttons on cards
  document.querySelectorAll('.song-card-play-btn, .song-card').forEach(elem => {
    elem.addEventListener('click', (e) => {
      // Avoid conflict if clicking heart or info
      if (e.target.closest('.heart-card-btn') || e.target.closest('.info-card-btn')) return;
      
      const songId = parseInt(elem.getAttribute('data-song-id'));
      if (songId) {
        playSongById(songId);
      }
    });
  });

  // Like buttons on cards
  document.querySelectorAll('.heart-card-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const songId = parseInt(btn.getAttribute('data-song-id'));
      toggleLikeSong(songId);
    });
  });

  // Details button
  document.querySelectorAll('.info-card-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const songId = parseInt(btn.getAttribute('data-song-id'));
      loadSongIntoLyricsModal(songId);
      const lyricsModal = new bootstrap.Modal(document.getElementById('lyricsModal'));
      lyricsModal.show();
    });
  });
}

function renderQueue() {
  const container = document.getElementById('queueListContainer');
  if (!container) return;

  const currentSong = songDatabase[appState.currentSongIndex];
  
  // Update Now Playing in Queue Offcanvas
  const qImg = document.getElementById('queueNowPlayingImg');
  const qTitle = document.getElementById('queueNowPlayingTitle');
  const qArtist = document.getElementById('queueNowPlayingArtist');
  if (qImg) qImg.src = currentSong.cover;
  if (qTitle) qTitle.textContent = currentSong.title;
  if (qArtist) qArtist.textContent = currentSong.artist;

  // Render Queue list
  container.innerHTML = songDatabase.map((song, idx) => `
    <li class="d-flex align-items-center justify-content-between p-2 rounded-2 ${idx === appState.currentSongIndex ? 'bg-secondary bg-opacity-25' : 'hover-bg-dark'} cursor-pointer queue-item" data-song-id="${song.id}">
      <div class="d-flex align-items-center gap-2 text-truncate">
        <span class="fs-8 text-secondary font-monospace w-20">${idx + 1}</span>
        <img src="${song.cover}" alt="${song.title}" class="rounded-1" width="36" height="36">
        <div class="text-truncate">
          <div class="fs-7 ${idx === appState.currentSongIndex ? 'text-success fw-bold' : 'text-white'} text-truncate">${song.title}</div>
          <small class="text-secondary text-truncate">${song.artist}</small>
        </div>
      </div>
      <span class="fs-8 text-secondary font-monospace">${formatTime(song.duration)}</span>
    </li>
  `).join('');

  // Queue item click handlers
  document.querySelectorAll('.queue-item').forEach(item => {
    item.addEventListener('click', () => {
      const songId = parseInt(item.getAttribute('data-song-id'));
      playSongById(songId);
    });
  });
}

// ==========================================================================
// 6. Audio Playback Controls
// ==========================================================================
function playSongById(id) {
  const index = songDatabase.findIndex(s => s.id === id);
  if (index !== -1) {
    if (appState.currentSongIndex === index && appState.isPlaying) {
      pausePlayback();
    } else {
      appState.currentSongIndex = index;
      appState.currentTime = 0;
      appState.duration = songDatabase[index].duration;
      startPlayback();
    }
  }
}

function startPlayback() {
  audioPlayer.initContext();
  appState.isPlaying = true;

  // Trigger synth chime
  const currentSong = songDatabase[appState.currentSongIndex];
  const tones = [523.25, 659.25, 783.99, 1046.50]; // C Major arpeggio
  tones.forEach((t, i) => {
    setTimeout(() => {
      if (appState.isPlaying) audioPlayer.playTone(t, 'triangle', 0.25);
    }, i * 120);
  });

  updatePlayerUI();
  renderSongCards();
  renderQueue();
  updateLyricsPreview();

  if (appState.playbackTimer) clearInterval(appState.playbackTimer);

  appState.playbackTimer = setInterval(() => {
    if (appState.isPlaying) {
      appState.currentTime += 1;
      
      // Periodic subtle rhythm chime simulation
      if (appState.currentTime % 4 === 0) {
        audioPlayer.playTone(261.63, 'sine', 0.15); // Bass pulse
      }

      if (appState.currentTime >= appState.duration) {
        handleSongEnd();
      }
      updateProgressBar();
    }
  }, 1000);
}

function pausePlayback() {
  appState.isPlaying = false;
  if (appState.playbackTimer) clearInterval(appState.playbackTimer);
  updatePlayerUI();
  renderSongCards();
}

function togglePlayPause() {
  if (appState.isPlaying) {
    pausePlayback();
  } else {
    startPlayback();
  }
}

function playNextSong() {
  if (appState.isShuffle) {
    let nextIndex;
    do {
      nextIndex = Math.floor(Math.random() * songDatabase.length);
    } while (nextIndex === appState.currentSongIndex && songDatabase.length > 1);
    appState.currentSongIndex = nextIndex;
  } else {
    appState.currentSongIndex = (appState.currentSongIndex + 1) % songDatabase.length;
  }
  appState.currentTime = 0;
  appState.duration = songDatabase[appState.currentSongIndex].duration;
  startPlayback();
}

function playPrevSong() {
  if (appState.currentTime > 3) {
    appState.currentTime = 0;
    updateProgressBar();
  } else {
    appState.currentSongIndex = (appState.currentSongIndex - 1 + songDatabase.length) % songDatabase.length;
    appState.currentTime = 0;
    appState.duration = songDatabase[appState.currentSongIndex].duration;
    startPlayback();
  }
}

function handleSongEnd() {
  if (appState.isRepeat) {
    appState.currentTime = 0;
    startPlayback();
  } else {
    playNextSong();
  }
}

function updateProgressBar() {
  const progressBar = document.getElementById('progressBar');
  const currentTimeLabel = document.getElementById('currentTimeLabel');
  const durationLabel = document.getElementById('durationLabel');

  if (progressBar) {
    const pct = (appState.currentTime / appState.duration) * 100;
    progressBar.style.width = `${pct}%`;
  }
  if (currentTimeLabel) {
    currentTimeLabel.textContent = formatTime(appState.currentTime);
  }
  if (durationLabel) {
    durationLabel.textContent = formatTime(appState.duration);
  }
}

function updatePlayerUI() {
  const current = songDatabase[appState.currentSongIndex];
  
  // Player Thumb, Title, Artist
  const playerThumb = document.getElementById('playerThumb');
  const playerTitle = document.getElementById('playerTitle');
  const playerArtist = document.getElementById('playerArtist');
  const playPauseIcon = document.getElementById('playPauseIcon');
  const playerLikeBtn = document.getElementById('playerLikeBtn');

  if (playerThumb) playerThumb.src = current.cover;
  if (playerTitle) playerTitle.textContent = current.title;
  if (playerArtist) playerArtist.textContent = current.artist;

  if (playPauseIcon) {
    playPauseIcon.className = appState.isPlaying ? 'fa-solid fa-pause' : 'fa-solid fa-play';
  }

  if (playerLikeBtn) {
    playerLikeBtn.className = `btn btn-icon text-secondary heart-btn ms-1 ms-md-2 ${current.liked ? 'liked' : ''}`;
    playerLikeBtn.innerHTML = `<i class="${current.liked ? 'fa-solid text-success' : 'fa-regular'} fa-heart"></i>`;
  }

  updateProgressBar();
}

function toggleLikeSong(id) {
  const song = songDatabase.find(s => s.id === id);
  if (song) {
    song.liked = !song.liked;
    updateLikedBadgeCount();
    updatePlayerUI();
    renderSongCards();
    showToast(
      song.liked ? `Saved "${song.title}" to Liked Songs!` : `Removed "${song.title}" from Liked Songs`,
      song.liked ? "fa-heart" : "fa-trash",
      song.liked
    );
  }
}

function loadSongIntoLyricsModal(id) {
  const song = songDatabase.find(s => s.id === id);
  if (!song) return;

  const cover = document.getElementById('modalSongCover');
  const title = document.getElementById('modalSongTitle');
  const artist = document.getElementById('modalSongArtist');
  const container = document.getElementById('fullLyricsContainer');

  if (cover) cover.src = song.cover;
  if (title) title.textContent = song.title;
  if (artist) artist.textContent = `${song.artist} • ${song.album}`;

  if (container) {
    container.innerHTML = song.lyrics.map((line, idx) => `
      <p class="lyrics-verse ${idx === 2 ? 'fw-bold text-success' : ''}">${line}</p>
    `).join('');
  }
}

function updateLyricsPreview() {
  const current = songDatabase[appState.currentSongIndex];
  const titleEl = document.getElementById('nowPlayingLyricsTitle');
  const lyricsBox = document.getElementById('liveLyricsContainer');

  if (titleEl) titleEl.textContent = `${current.title} - ${current.artist}`;
  if (lyricsBox) {
    lyricsBox.innerHTML = current.lyrics.map((line, idx) => `
      <p class="lyrics-line ${idx === 1 ? 'active-line' : ''} mb-2">${line}</p>
    `).join('');
  }
}

function resetFilters() {
  appState.activeFilter = "all";
  appState.searchQuery = "";
  const searchInput = document.getElementById('globalSearchInput');
  const clearBtn = document.getElementById('clearSearchBtn');
  if (searchInput) searchInput.value = "";
  if (clearBtn) clearBtn.classList.add('d-none');

  document.querySelectorAll('#genrePillsNav .nav-link').forEach(btn => {
    btn.classList.toggle('active', btn.getAttribute('data-filter') === 'all');
  });

  renderSongCards();
}

// ==========================================================================
// 7. Interactive HTML5 Canvas Audio Visualizer
// ==========================================================================
function initAudioVisualizer() {
  const canvas = document.getElementById('audioVisualizerCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let animationFrameId;
  let phase = 0;

  function draw() {
    animationFrameId = requestAnimationFrame(draw);
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const width = canvas.width;
    const height = canvas.height;

    if (appState.visualizerStyle === 'bars') {
      // Dynamic frequency bars
      const numBars = 32;
      const barWidth = (width / numBars) - 3;
      
      for (let i = 0; i < numBars; i++) {
        let barHeight = 8;
        if (appState.isPlaying) {
          barHeight = Math.abs(Math.sin(phase + (i * 0.3)) * 80) + Math.abs(Math.cos(phase * 0.8 + i) * 35) + 10;
        }

        const gradient = ctx.createLinearGradient(0, height, 0, 0);
        gradient.addColorStop(0, '#1db954');
        gradient.addColorStop(0.7, '#1ed760');
        gradient.addColorStop(1, '#ffffff');

        ctx.fillStyle = gradient;
        ctx.fillRect(i * (barWidth + 3), height - barHeight, barWidth, barHeight);
      }
    } else if (appState.visualizerStyle === 'waves') {
      // Sine wave flow
      ctx.beginPath();
      ctx.lineWidth = 3;
      ctx.strokeStyle = '#1db954';

      for (let x = 0; x < width; x++) {
        const amplitude = appState.isPlaying ? 35 : 5;
        const y = height / 2 + Math.sin((x * 0.03) + phase) * amplitude * Math.cos(phase * 0.5);
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();

      // Secondary wave
      ctx.beginPath();
      ctx.lineWidth = 2;
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
      for (let x = 0; x < width; x++) {
        const amplitude = appState.isPlaying ? 20 : 2;
        const y = height / 2 + Math.cos((x * 0.04) - phase) * amplitude;
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();
    } else if (appState.visualizerStyle === 'particles') {
      // Neon circular pulse
      const centerX = width / 2;
      const centerY = height / 2;
      const baseRadius = appState.isPlaying ? 30 + Math.sin(phase * 3) * 15 : 20;

      ctx.beginPath();
      ctx.arc(centerX, centerY, baseRadius, 0, Math.PI * 2);
      ctx.strokeStyle = '#1db954';
      ctx.lineWidth = 4;
      ctx.shadowColor = '#1db954';
      ctx.shadowBlur = 15;
      ctx.stroke();
      ctx.shadowBlur = 0; // reset

      // Surrounding particle sparks
      const numParticles = 12;
      for (let i = 0; i < numParticles; i++) {
        const angle = (i / numParticles) * Math.PI * 2 + phase;
        const dist = baseRadius + (appState.isPlaying ? Math.abs(Math.sin(phase + i) * 35) + 10 : 8);
        const px = centerX + Math.cos(angle) * dist;
        const py = centerY + Math.sin(angle) * dist;

        ctx.beginPath();
        ctx.arc(px, py, 3, 0, Math.PI * 2);
        ctx.fillStyle = '#fff';
        ctx.fill();
      }
    }

    phase += appState.isPlaying ? 0.08 : 0.02;
  }

  draw();
}

// ==========================================================================
// 8. Event Listeners & Interactive Bindings
// ==========================================================================
document.addEventListener('DOMContentLoaded', () => {

  // Initialize UI
  renderSongCards();
  renderQueue();
  updatePlayerUI();
  updateLikedBadgeCount();
  initAudioVisualizer();

  // 1. Playback Button Controls
  const playPauseBtn = document.getElementById('playPauseBtn');
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');
  const shuffleBtn = document.getElementById('shuffleBtn');
  const repeatBtn = document.getElementById('repeatBtn');
  const playerLikeBtn = document.getElementById('playerLikeBtn');

  if (playPauseBtn) playPauseBtn.addEventListener('click', togglePlayPause);
  if (prevBtn) prevBtn.addEventListener('click', playPrevSong);
  if (nextBtn) nextBtn.addEventListener('click', playNextSong);

  if (shuffleBtn) {
    shuffleBtn.addEventListener('click', () => {
      appState.isShuffle = !appState.isShuffle;
      shuffleBtn.classList.toggle('text-success', appState.isShuffle);
      showToast(appState.isShuffle ? "Shuffle is ON" : "Shuffle is OFF", "fa-shuffle");
    });
  }

  if (repeatBtn) {
    repeatBtn.addEventListener('click', () => {
      appState.isRepeat = !appState.isRepeat;
      repeatBtn.classList.toggle('text-success', appState.isRepeat);
      showToast(appState.isRepeat ? "Repeat song is ON" : "Repeat is OFF", "fa-repeat");
    });
  }

  if (playerLikeBtn) {
    playerLikeBtn.addEventListener('click', () => {
      const current = songDatabase[appState.currentSongIndex];
      toggleLikeSong(current.id);
    });
  }

  // Hero play buttons
  document.querySelectorAll('.hero-play-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const songId = parseInt(btn.getAttribute('data-song-id')) || 1;
      playSongById(songId);
    });
  });

  // Quick shortcuts play buttons
  document.querySelectorAll('.quick-card').forEach(card => {
    card.addEventListener('click', () => {
      const songId = parseInt(card.getAttribute('data-song-id'));
      if (songId) playSongById(songId);
    });
  });

  // 2. Scrub Progress Bar
  const progressContainer = document.getElementById('progressContainer');
  if (progressContainer) {
    progressContainer.addEventListener('click', (e) => {
      const rect = progressContainer.getBoundingClientRect();
      const clickPos = (e.clientX - rect.left) / rect.width;
      appState.currentTime = Math.floor(clickPos * appState.duration);
      updateProgressBar();
    });
  }

  // 3. Volume & Mute Controls
  const volumeSlider = document.getElementById('volumeSlider');
  const volumeMuteBtn = document.getElementById('volumeMuteBtn');
  const volumeIcon = document.getElementById('volumeIcon');

  if (volumeSlider) {
    volumeSlider.addEventListener('input', (e) => {
      appState.volume = e.target.value / 100;
      appState.isMuted = appState.volume === 0;
      audioPlayer.setVolume(appState.volume);
      if (volumeIcon) {
        if (appState.volume === 0) volumeIcon.className = "fa-solid fa-volume-xmark";
        else if (appState.volume < 0.5) volumeIcon.className = "fa-solid fa-volume-low";
        else volumeIcon.className = "fa-solid fa-volume-high";
      }
    });
  }

  if (volumeMuteBtn) {
    volumeMuteBtn.addEventListener('click', () => {
      appState.isMuted = !appState.isMuted;
      audioPlayer.setVolume(appState.isMuted ? 0 : appState.volume);
      if (volumeIcon) {
        volumeIcon.className = appState.isMuted ? "fa-solid fa-volume-xmark text-danger" : "fa-solid fa-volume-high";
      }
      showToast(appState.isMuted ? "Muted Audio" : "Unmuted Audio", appState.isMuted ? "fa-volume-xmark" : "fa-volume-high");
    });
  }

  // 4. Live Global Search Input
  const globalSearchInput = document.getElementById('globalSearchInput');
  const clearSearchBtn = document.getElementById('clearSearchBtn');

  if (globalSearchInput) {
    globalSearchInput.addEventListener('input', (e) => {
      appState.searchQuery = e.target.value.trim();
      if (clearSearchBtn) {
        clearSearchBtn.classList.toggle('d-none', appState.searchQuery === "");
      }
      renderSongCards();
    });
  }

  if (clearSearchBtn) {
    clearSearchBtn.addEventListener('click', () => {
      globalSearchInput.value = "";
      appState.searchQuery = "";
      clearSearchBtn.classList.add('d-none');
      renderSongCards();
      globalSearchInput.focus();
    });
  }

  // 5. Category / Genre Pills Filter
  const genrePills = document.querySelectorAll('#genrePillsNav .nav-link');
  genrePills.forEach(pill => {
    pill.addEventListener('click', (e) => {
      e.preventDefault();
      genrePills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      appState.activeFilter = pill.getAttribute('data-filter');
      renderSongCards();
    });
  });

  // 6. Sidebar Playlist Filter Clicks
  document.querySelectorAll('.sidebar-playlist-link').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      document.querySelectorAll('.sidebar-playlist-link').forEach(l => l.classList.remove('active-playlist'));
      link.classList.add('active-playlist');
      const filter = link.getAttribute('data-filter');
      if (filter) {
        appState.activeFilter = filter;
        genrePills.forEach(p => p.classList.toggle('active', p.getAttribute('data-filter') === filter));
        renderSongCards();
      }
    });
  });

  // 7. Visualizer Style Switcher
  const btnBars = document.getElementById('visualizerStyleBars');
  const btnWaves = document.getElementById('visualizerStyleWaves');
  const btnParticles = document.getElementById('visualizerStyleParticles');

  [btnBars, btnWaves, btnParticles].forEach(btn => {
    if (btn) {
      btn.addEventListener('click', () => {
        [btnBars, btnWaves, btnParticles].forEach(b => b && b.classList.remove('active'));
        btn.classList.add('active');
        if (btn === btnBars) appState.visualizerStyle = 'bars';
        else if (btn === btnWaves) appState.visualizerStyle = 'waves';
        else if (btn === btnParticles) appState.visualizerStyle = 'particles';
      });
    }
  });

  // 8. Create Playlist Form Submission
  const createPlaylistForm = document.getElementById('createPlaylistForm');
  if (createPlaylistForm) {
    createPlaylistForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const titleInput = document.getElementById('playlistTitleInput');
      const name = titleInput.value.trim();
      if (name) {
        userPlaylists.push(name);
        const list = document.getElementById('sidebarPlaylistList');
        if (list) {
          const li = document.createElement('li');
          li.innerHTML = `<a href="#" class="sidebar-playlist-link" data-filter="all">${name}</a>`;
          list.appendChild(li);
        }
        titleInput.value = "";
        
        // Hide modal using bootstrap instance
        const modalEl = document.getElementById('createPlaylistModal');
        const modal = bootstrap.Modal.getInstance(modalEl);
        if (modal) modal.hide();

        showToast(`Created playlist "${name}"!`, "fa-folder-plus");
      }
    });
  }

  // 9. Premium Plan Selection
  document.querySelectorAll('.select-plan-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const planName = btn.getAttribute('data-plan') || "Premium Individual";
      const planPrice = btn.getAttribute('data-price') || "$10.99/mo";
      
      const badge = document.getElementById('selectedPlanBadge');
      const display = document.getElementById('selectedPlanPriceDisplay');

      if (badge) badge.textContent = planName;
      if (display) display.textContent = `${planPrice} (Free for 30 Days)`;

      const premModal = new bootstrap.Modal(document.getElementById('premiumModal'));
      premModal.show();
    });
  });

  const confirmSubscribeBtn = document.getElementById('confirmSubscribeBtn');
  if (confirmSubscribeBtn) {
    confirmSubscribeBtn.addEventListener('click', () => {
      const modalEl = document.getElementById('premiumModal');
      const modal = bootstrap.Modal.getInstance(modalEl);
      if (modal) modal.hide();
      showToast("Welcome to Spotify Premium! 30-Day Free Trial activated.", "fa-crown");
    });
  }

  // 10. Follow Artist Buttons
  document.querySelectorAll('.follow-artist-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const artist = btn.getAttribute('data-artist');
      const isFollowing = btn.classList.contains('btn-success');

      if (isFollowing) {
        btn.className = "btn btn-sm btn-outline-light rounded-pill px-3 follow-artist-btn";
        btn.textContent = "Follow";
        showToast(`Unfollowed ${artist}`, "fa-user-minus", false);
      } else {
        btn.className = "btn btn-sm btn-success rounded-pill px-3 follow-artist-btn";
        btn.textContent = "Following";
        showToast(`Following ${artist}!`, "fa-user-check", true);
      }
    });
  });

  // 11. Newsletter Form
  const newsletterForm = document.getElementById('newsletterForm');
  if (newsletterForm) {
    newsletterForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = document.getElementById('newsletterEmail');
      showToast(`Thank you! ${email.value} subscribed to Spotify releases.`, "fa-envelope-circle-check");
      email.value = "";
    });
  }

  // 12. View Lyrics button in banner
  const viewLyricsBtn = document.getElementById('viewLyricsBtn');
  if (viewLyricsBtn) {
    viewLyricsBtn.addEventListener('click', () => {
      loadSongIntoLyricsModal(songDatabase[appState.currentSongIndex].id);
    });
  }

  // 13. Sidebar Liked Songs shortcut
  const sidebarLikedBtn = document.getElementById('sidebarLikedBtn');
  if (sidebarLikedBtn) {
    sidebarLikedBtn.addEventListener('click', () => {
      appState.activeFilter = "all";
      const likedSongs = songDatabase.filter(s => s.liked);
      if (likedSongs.length > 0) {
        playSongById(likedSongs[0].id);
        showToast(`Playing Liked Songs collection (${likedSongs.length} tracks)`, "fa-heart");
      } else {
        showToast("You haven't liked any songs yet!", "fa-circle-exclamation", false);
      }
    });
  }

  // 14. Install App button
  const installAppBtn = document.getElementById('installAppBtn');
  if (installAppBtn) {
    installAppBtn.addEventListener('click', () => {
      showToast("Spotify Web App is already running in your browser!", "fa-circle-check");
    });
  }

  // 15. See all music link
  const seeAllMusicBtn = document.getElementById('seeAllMusicBtn');
  if (seeAllMusicBtn) {
    seeAllMusicBtn.addEventListener('click', (e) => {
      e.preventDefault();
      resetFilters();
    });
  }

  // 16. Keyboard Shortcuts
  document.addEventListener('keydown', (e) => {
    // Only if not focused on inputs
    if (['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement.tagName)) return;

    if (e.code === 'Space') {
      e.preventDefault();
      togglePlayPause();
    } else if (e.code === 'ArrowRight' && e.shiftKey) {
      playNextSong();
    } else if (e.code === 'ArrowLeft' && e.shiftKey) {
      playPrevSong();
    } else if (e.key.toLowerCase() === 'm') {
      const volumeMuteBtn = document.getElementById('volumeMuteBtn');
      if (volumeMuteBtn) volumeMuteBtn.click();
    }
  });

});