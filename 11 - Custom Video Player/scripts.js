const player = document.querySelector('.player');
const video = player.querySelector('.viewer');//video class
const progress = player.querySelector('.progress');
const progBar = player.querySelector('.progress__filled');
const toggle = player.querySelector('.toggle');
const skipButtons = player.querySelectorAll('[data-skip]');
const ranges = player.querySelectorAll('.player__slider');

function togglePlay() {
    const method = video.paused ? 'play' : 'pause';
    video[method]();
}

function updateButton() {
    //this is bound to the video itself
    toggle.textContent = this.paused ? '►' : '❚ ❚';
}

function skip() {
    video.currentTime += parseFloat(this.dataset.skip);
}

function handleRangeUpdate() {
    video[this.name] = this.value;
}

function handleProgress() {
    //make a percentage and update the flex-basis of the progress bar to correspond with how long it is
    const percent = (video.currentTime / video.duration) * 100;
    progBar.style.flexBasis = `${percent}%`;
}

function scrub(e) {
    //receives a mouse event and we can see where the click is
    //shows using offsetX and width of bar
    const scrubTime = (e.offsetX / progress.offsetWidth) * video.duration;
    //so, if you're watching a 60 second clip and halfway through it will tell you 30 seconds
    video.currentTime = scrubTime;
}

video.addEventListener('click', togglePlay);
video.addEventListener('play', updateButton);
video.addEventListener('pause', updateButton);
video.addEventListener('timeupdate', handleProgress);
//there's two events, both timeupdate and timeprogress

toggle.addEventListener('click', togglePlay);

skipButtons.forEach(button => button.addEventListener('click', skip));

ranges.forEach(button => button.addEventListener('change', handleRangeUpdate));
ranges.forEach(button => button.addEventListener('mousemove', handleRangeUpdate));

let mousedown = false;
progress.addEventListener('click', scrub);
progress.addEventListener('mousemove', (e) => mousedown && scrub(e) && handleProgress);
//first checks the variable and if mousedown, scrub. else, do nothing
progress.addEventListener('mousedown', () => mousedown = true);