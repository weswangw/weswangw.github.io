let mic;
let fft;
let amp;

function setup() {
  createCanvas(windowWidth, windowHeight);

  mic = new p5.AudioIn();
  mic.start();

  fft = new p5.FFT();
  fft.setInput(mic);
  
  amp = new p5.Amplitude();
  noStroke();
}

function draw() {
  background(0, 15);

  let waveform = fft.waveform();

  fill(255,64,64);
  
  for (let i = 0; i < waveform.length; i++) {
    let x = map(i, 0, waveform.length, 0, width);
    let y = map(waveform[i], -1, 1, 0, height);

    ellipse(x, y, 5, 5);
    

  }
  
}


                