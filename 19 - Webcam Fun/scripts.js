const video = document.querySelector('.player');
const canvas = document.querySelector('.photo');
const ctx = canvas.getContext('2d');
const strip = document.querySelector('.strip');
const snap = document.querySelector('.snap');


function getVideo() {
    navigator.mediaDevices.getUserMedia({video: true, audio: false})
        .then(localMediaStream => {
            console.log(localMediaStream);
            video.src = window.URL.createObjectURL(localMediaStream);//set to be a live video feed
            video.play();
        })
        .catch(err => {
            console.error('OH NO!!!', err);
        });

}

function paintToCanvas() {
    const width = video.videoWidth;
    const height = video.videoHeight;
    canvas.width = width;
    canvas.height = height;

    //every 16 or so miliseconds we take the image and put it on the canvas
    return setInterval(() => {
        ctx.drawImage(video, 0, 0, width, height)//pass video into video context
        //start from top left and draw the width and height.
        let pixels = ctx.getImageData(0, 0, width, height);
        //pixels = redEffect(pixels);
        //pixels = rgbSplit(pixels);)
        pixels = greenScreen(pixels);
        ctx.putImageData(pixels, 0, 0);
        debugger;
    }, 16);
}

function takePhoto() {
    snap.currentTime = 0;
    snap.play();//photo sound

    //take data out of the canvas
    const data = canvas.toDataURL('image/jpeg');
    const link = document.createElement('a');
    link.href = data;
    link.setAttribute('download', 'handsome');
    link.innerHTML = `<img src="${data}" alt="person"/>`;
    strip.insertBefore(link, strip.firstChild);

}

function redEffect(pixels) {
    for(let i = 0; i < pixels.data.length; i+=4) {
        pixels.data[i] = pixels.data[i] + 100; // r
        pixels.data[i + 1] = pixels.data[i + 1] - 50; //g
        pixels.data[i + 2] = pixels.data[i + 2] * 0.5;//b
    }
    return values;
}

function rgbSplit(pixels) {
    for(let i = 0; i < pixels.data.length; i+=4) {
        pixels.data[i - 150] = pixels.data[i]; // r
        pixels.data[i + 100] = pixels.data[i + 1]; //g
        pixels.data[i + 150] = pixels.data[i + 2];//b
    }
    return values;
}

function greenScreen(pixels) {
    const levels = {};

    [...document.querySelectorAll('.rgb input')].forEach((input) => {
        levels[input.name] = input.value;
    });

    for (i = 0; i < pixels.data.length; i = i + 4) {
        red = pixels.data[i + 0];
        green = pixels.data[i + 1];
        blue = pixels.data[i + 2];
        alpha = pixels.data[i + 3];
    
        if (red >= levels.rmin
          && green >= levels.gmin
          && blue >= levels.bmin
          && red <= levels.rmax
          && green <= levels.gmax
          && blue <= levels.bmax) {
          // take it out!
          pixels.data[i + 3] = 0;
        }
      }
    
      return pixels;
}

getVideo(); //run on page load

video.addEventListener('canplay', paintToCanvas);