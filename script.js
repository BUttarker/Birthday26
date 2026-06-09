const DEFAULT_VIDEO_ID = '3-OuEDkHiCk';
const DEFAULT_SOUND_ON_SRC = 'assets/icons/sound-high-solid.png';
const DEFAULT_SOUND_OFF_SRC = 'assets/icons/sound-off-solid.png';

const VIDEO_ID = document.body.dataset.videoId || DEFAULT_VIDEO_ID;
const SOUND_ON_SRC = document.body.dataset.soundOn || DEFAULT_SOUND_ON_SRC;
const SOUND_OFF_SRC = document.body.dataset.soundOff || DEFAULT_SOUND_OFF_SRC;

let player;
let soundOn = true;
let playerReady = false;

const soundToggle = document.getElementById('sound-toggle');
const soundIcon = document.getElementById('sound-icon');

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
  if (!document.getElementById('youtube-player')) {
    return;
  }

  player = new YT.Player('youtube-player', {
    height: '0',
    width: '0',
    videoId: VIDEO_ID,
    playerVars: {
      autoplay: 1,
      mute: 1,
      loop: 1,
      playlist: VIDEO_ID,
      controls: 0,
      disablekb: 1,
      rel: 0,
      playsinline: 1,
      origin: window.location.origin,
    },
    events: {
      onReady: (event) => {
        playerReady = true;
        event.target.playVideo();

        if (soundOn) {
          event.target.unMute();
        }
      },
    },
  });
}

if (soundToggle) {
  soundToggle.addEventListener('click', () => {
    if (!playerReady || !player || typeof player.playVideo !== 'function') {
      return;
    }

    soundOn = !soundOn;

    if (soundOn) {
      player.unMute();
      player.playVideo();
    } else {
      player.mute();
    }

    updateSoundIcon();
  });
}

document.addEventListener('click', tryStartMusic, { once: true });
window.onYouTubeIframeAPIReady = onYouTubeIframeAPIReady;
