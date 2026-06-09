const DEFAULT_VIDEO_ID = '3-OuEDkHiCk';
const DEFAULT_SOUND_ON_SRC = 'assets/icons/sound-high-solid.png';
const DEFAULT_SOUND_OFF_SRC = 'assets/icons/sound-off-solid.png';

const SOUND_ON_SRC = document.body.dataset.soundOn || DEFAULT_SOUND_ON_SRC;
const SOUND_OFF_SRC = document.body.dataset.soundOff || DEFAULT_SOUND_OFF_SRC;

let player;
let soundOn = true;
let playerReady = false;
let playerInitStarted = false;

const soundToggle = document.getElementById('sound-toggle');
const soundIcon = document.getElementById('sound-icon');

function getVideoId() {
  const raw = document.body.dataset.videoId || DEFAULT_VIDEO_ID;
  const trimmed = raw.trim();

  if (/^[a-zA-Z0-9_-]{11}$/.test(trimmed)) {
    return trimmed;
  }

  const match = trimmed.match(/(?:v=|youtu\.be\/|embed\/)([a-zA-Z0-9_-]{11})/);
  return match ? match[1] : DEFAULT_VIDEO_ID;
}

function updateSoundIcon() {
  if (!soundIcon || !soundToggle) {
    return;
  }

  soundIcon.src = soundOn ? SOUND_ON_SRC : SOUND_OFF_SRC;
  soundToggle.setAttribute('aria-label', soundOn ? 'Turn sound off' : 'Turn sound on');
}

function tryStartMusic() {
  if (!playerReady || !player || typeof player.playVideo !== 'function') {
    return;
  }

  player.playVideo();

  if (soundOn) {
    player.unMute();
  }
}

function onYouTubeIframeAPIReady() {
  if (!document.getElementById('youtube-player') || playerInitStarted) {
    return;
  }

  playerInitStarted = true;

  const videoId = getVideoId();
  const playerVars = {
    autoplay: 1,
    mute: 1,
    loop: 1,
    playlist: videoId,
    controls: 0,
    disablekb: 1,
    rel: 0,
    playsinline: 1,
  };

  if (window.location.origin && window.location.origin !== 'null') {
    playerVars.origin = window.location.origin;
  }

  player = new YT.Player('youtube-player', {
    height: '0',
    width: '0',
    videoId,
    playerVars,
    events: {
      onReady: (event) => {
        playerReady = true;
        event.target.playVideo();

        if (soundOn) {
          event.target.unMute();
        }
      },
      onStateChange: (event) => {
        if (event.data === YT.PlayerState.ENDED) {
          event.target.seekTo(0);
          event.target.playVideo();
        }
      },
    },
  });
}

if (soundToggle) {
  soundToggle.addEventListener('click', () => {
    soundOn = !soundOn;
    updateSoundIcon();

    if (!playerReady || !player || typeof player.playVideo !== 'function') {
      return;
    }

    if (soundOn) {
      player.unMute();
      player.playVideo();
    } else {
      player.mute();
    }
  });
}

document.addEventListener('click', tryStartMusic);
document.addEventListener('touchstart', tryStartMusic, { passive: true });

window.onYouTubeIframeAPIReady = onYouTubeIframeAPIReady;

if (window.YT && typeof window.YT.Player === 'function') {
  onYouTubeIframeAPIReady();
}
