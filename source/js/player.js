const currentSongBlock = document.querySelector('.song.song--current');
const trackCover = currentSongBlock?.querySelector('.song__cover-img');
const trackTitle = currentSongBlock?.querySelector('.song__title');
const trackArtist = currentSongBlock?.querySelector('.song__artist');
const trackInfo = currentSongBlock?.querySelector('.song__info');

const prevSongBlock = document.querySelector('.song--prev');
const prevTrackCover = prevSongBlock?.querySelector('.song__cover-img');
const nextSongBlock = document.querySelector('.song--next');
const nextTrackCover = nextSongBlock?.querySelector('.song__cover-img');

const currentTrack = document.createElement('audio');

const playPauseBtn = document.querySelector('.js-playBtn');
const prevBtn = document.querySelector('.js-prevBtn');
const nextBtn = document.querySelector('.js-nextBtn');
const randomBtn = document.querySelector('.js-randomeBtn');
const repeatBtn = document.querySelector('.js-repeatBtn');

const randomIcon = randomBtn?.querySelector('.options__icon');
const pauseIcon = playPauseBtn?.querySelector('.options__icon-pause');
const playIcon = playPauseBtn?.querySelector('.options__icon-play');

const queueBarArea = document.querySelector('.queue-bar');
const queueBar = queueBarArea?.querySelector('.js-queueBar');

let trackIndex = 0;
let isPlaying = false;
let isRandom = false;

window.addEventListener('load', () => {
  loadTrack(trackIndex);
  loadPrevTrackImg(trackIndex);
  loadNextTrackImg(trackIndex);
});

playPauseBtn?.addEventListener('click', playPauseTrack);
prevBtn?.addEventListener('click', prevTrack);
nextBtn?.addEventListener('click', nextTrack);
randomBtn?.addEventListener('click', randomTrack);
repeatBtn?.addEventListener('click', repeatTrack);
currentTrack?.addEventListener('timeupdate', queueaBarUpdate);
queueBarArea?.addEventListener('click', currentTrackUpdate);

function loadTrack(trackIndex) {
  currentTrack.src = audioTracks[trackIndex].track;
  currentTrack.load();

  trackCover.src = audioTracks[trackIndex].cover;
  trackTitle.textContent = audioTracks[trackIndex].title;
  trackArtist.textContent = audioTracks[trackIndex].artist;
  trackInfo.textContent = audioTracks[trackIndex].info;

  currentTrack.addEventListener('ended', nextTrack);
}

function loadPrevTrackImg(trackIndex) {
  if (trackIndex > 0) {
    trackIndex = trackIndex - 1;
  } else {
    trackIndex = audioTracks.length - 1;
  }

  prevTrackCover.src = audioTracks[trackIndex].cover;
}

function loadNextTrackImg(trackIndex) {
  if (trackIndex < audioTracks.length - 1) {
    trackIndex = trackIndex + 1;
  } else {
    trackIndex = 0;
  }

  nextTrackCover.src = audioTracks[trackIndex].cover;
}

function playPauseTrack() {
  isPlaying ? pauseTrack() : playTrack();
}

function playTrack() {
  pauseIcon.classList.remove('u-hidden');
  playIcon.classList.add('u-hidden');

  currentTrack.play();
  isPlaying = true;
}

function pauseTrack() {
  pauseIcon.classList.add('u-hidden');
  playIcon.classList.remove('u-hidden');

  currentTrack.pause();
  isPlaying = false;
}

function nextTrack() {
  if (trackIndex < audioTracks.length - 1 && isRandom === false) {
    trackIndex = trackIndex + 1;
  } else if (trackIndex < audioTracks.length - 1 && isRandom === true) {
    let randomIndex = Number.parseInt(Math.random() * audioTracks.length);

    trackIndex = randomIndex;
  } else {
    trackIndex = 0;
  }

  loadTrack(trackIndex);
  loadPrevTrackImg(trackIndex);
  loadNextTrackImg(trackIndex);
  playTrack();
}

function prevTrack() {
  if (trackIndex > 0) {
    trackIndex = trackIndex - 1;
  } else {
    trackIndex = audioTracks.length - 1;
  }

  loadTrack(trackIndex);
  loadPrevTrackImg(trackIndex);
  loadNextTrackImg(trackIndex);
  playTrack();
}

function randomTrack() {
  isRandom ? pauseRandom() : playRandom();
}

function playRandom() {
  randomIcon.classList.add('options__icon--active');

  isRandom = true;
}

function pauseRandom() {
  randomIcon.classList.remove('options__icon--active');

  isRandom = false;
}

function repeatTrack() {
  let currentIndex = trackIndex;

  loadTrack(currentIndex);
  playTrack();
}

function queueaBarUpdate(evt) {
  const currentTime = evt.target.currentTime;
  const duration = evt.target.duration;
  const queueBarWidth = (currentTime / duration) * 100;

  queueBar.style.width = `${queueBarWidth}%`;
}

function currentTrackUpdate(evt) {
  const progressWidth = queueBarArea.clientWidth;
  const clickedOffsetX = evt.offsetX;
  const songDuration = currentTrack.duration;

  currentTrack.currentTime = (clickedOffsetX / progressWidth) * songDuration;
  playTrack();
}
