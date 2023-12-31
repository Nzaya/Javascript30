const video =document.querySelector('.player');
const canvas = document.querySelector('.photo');
const ctx = canvas.getContext('2d');
const strip = document.querySelector('.strip');
const snap = document.querySelector('.snap');

function getVideo(){
    navigator.mediaDevices.getUserMedia({video: true, audio: false})
        .then(localMediaStream =>{
            console.log(localMediaStream);
            video.src = window.URL.createObjectURL(localMediaStream); //convert media stream
            video.play();
        })
        .catch(err =>{
            console.log(`OH NOOOO!!`, err);
        })
}

function paintTocanvas(){
    const width = video.videoWidth;
    const height = video.videoheight;
    console.log(width, height);
    canvas.width = width;
    canvas.height = height;

    return setInterval(() =>{
        ctx.drawImage(video, 0, 0, width, height);
        // take the pixels out
        let pixels = ctx.getImageData(0, 0, width, height);
        //mess with them
        // pixels = redEffect(pixels);

        // pixels = rgbSplit(pixels);
        // ctx.globalAlpha = 0.8;

        pixels = greenScreen(pixels);
        //put them back
        ctx.putImageData(pixels, 0, 0);
        console.log(pixels);
    }, 16);
}

function takePhoto(){
    //play the sound
    snap.currentTime = 0;
    snap.play();

    //take data out of the canvas
    const data = canvas.toDataURL('image/jpeg');
    console.log(data);
    //create link and image to put in our strip
    const link = document.createElement('a');
    link.href = data;
    link.setAttribute('download', 'picture');
    // link.textContent = 'Download Image';
    link.innerHTML = `<img src="${data}" alt= "Perfect picture">`;
    strip.insertBefore(link, strip.firstChild);
}

function redEffect(pixels){
    for(let i = 0; i < pixels.data.length; i+=4){
        pixels[i + 0] = pixel.data[i + 0] + 100 // red
        pixels[i + 1] = pixel.data[i + 1] - 50 // green
        pixels[i + 2] = pixel.data[i + 2] * 0.5; // blue
    }

    return pixels;
}

function rgbSplit(pixels){
    for(let i = 0; i < pixels.data.length; i+=4){
        pixels[i + 150] = pixel.data[i + 0] // red
        pixels[i + 100] = pixel.data[i + 1] // green
        pixels[i - 150] = pixel.data[i + 2] // blue
    }

    return pixels;
}

function greenScreen(pixels) {
    const levels = {};
  
    document.querySelectorAll('.rgb input').forEach((input) => {
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

getVideo();

video.addEventListener('canplay', paintTocanvas);