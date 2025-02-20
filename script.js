document.addEventListener("DOMContentLoaded", function () {
  const cake = document.querySelector(".cake");
  const candleCountDisplay = document.getElementById("candleCount");
  let candles = [];
  let audioContext;
  let analyser;
  let microphone;

  function updateCandleCount() {
    const activeCandles = candles.filter(
      (candle) => !candle.classList.contains("out")
    ).length;
    candleCountDisplay.textContent = activeCandles;
  }

  function addCandle(left, top) {
    const candle = document.createElement("div");
    candle.className = "candle";
    candle.style.left = left + "px";
    candle.style.top = top + "px";

    const flame = document.createElement("div");
    flame.className = "flame";
    candle.appendChild(flame);

    cake.appendChild(candle);
    candles.push(candle);
    updateCandleCount();
  }

  cake.addEventListener("click", function (event) {
    const rect = cake.getBoundingClientRect();
    const left = event.clientX - rect.left;
    const top = event.clientY - rect.top;
    addCandle(left, top);
  });

  function isBlowing() {
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    analyser.getByteFrequencyData(dataArray);

    let sum = 0;
    for (let i = 0; i < bufferLength; i++) {
      sum += dataArray[i];
    }
    let average = sum / bufferLength;

    return average > 40; //
  }

  function blowOutCandles() {
    let blownOut = 0;

    if (isBlowing()) {
      candles.forEach((candle) => {
        if (!candle.classList.contains("out") && Math.random() > 0.5) {
          candle.classList.add("out");
          blownOut++;
        }
      });
    }

    if (blownOut > 0) {
      updateCandleCount();
      if (candles.filter(candle => !candle.classList.contains("out")).length === 0) {
        showHappyBirthday();
        showOwlsAndCats();
      }
    }
  }

  function showHappyBirthday() {
    document.querySelector('.happy-birthday').classList.add('show');
    document.querySelector('.confetti').classList.add('show');
    addConfetti();
  }

  function showOwlsAndCats() {
    const owlContainer = document.querySelector('.owl-container');
    const catContainer = document.querySelector('.cat-container');
    for (let i = 0; i < 10; i++) { // Adjust the number of owls and cats as needed
      const owl = document.createElement('div');
      owl.className = 'owl';
      owl.style.top = `${Math.random() * 100}vh`;
      owl.style.left = `${Math.random() * 100}vw`;
      owlContainer.appendChild(owl);
      owl.style.display = 'block';

      const cat = document.createElement('div');
      cat.className = 'cat';
      cat.style.top = `${Math.random() * 100}vh`;
      cat.style.left = `${Math.random() * 100}vw`;
      catContainer.appendChild(cat);
      cat.style.display = 'block';
    }
  }

  function addConfetti() {
    const confettiContainer = document.querySelector('.confetti');
    for (let i = 0; i < 100; i++) {
      const confettiPiece = document.createElement('div');
      confettiPiece.className = 'confetti-piece';
      confettiPiece.style.left = `${Math.random() * 100}vw`;
      confettiPiece.style.animationDelay = `${Math.random() * 3}s`;
      confettiContainer.appendChild(confettiPiece);
    }
  }

  if (navigator.mediaDevices.getUserMedia) {
    navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then(function (stream) {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
        analyser = audioContext.createAnalyser();
        microphone = audioContext.createMediaStreamSource(stream);
        microphone.connect(analyser);
        analyser.fftSize = 256;
        setInterval(blowOutCandles, 200);
      })
      .catch(function (err) {
        console.log("Unable to access microphone: " + err);
      });
  } else {
    console.log("getUserMedia not supported on your browser!");
  }
});
