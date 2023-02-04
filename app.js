const fs = require("fs");
let player = null;
let duration = 10; //prompt(`Enter timer duration in seconds: `);
let filePath = "Discotheque.mp3"; //prompt(`Enter MP3 file path: `);
let volume = 0.1;

let intervalId = 0;
let timeoutId = 0;

function startTimer(duration, callback) {
  let intervalTime = 100;
  let remainingTime = duration * 1000;
  intervalId = setInterval(() => {
    remainingTime -= intervalTime;
    document.getElementById("timer").innerHTML = `Time remaining: ${(
      remainingTime / 1000
    ).toFixed(1)}s`;
    if (remainingTime <= 0) {
      clearInterval(intervalId);
    }
  }, intervalTime);
  return new Promise((resolve) => {
    timeoutId = setTimeout(resolve, duration * 1000);
  });
}

async function playMP3(filePath) {
  return new Promise((resolve, reject) => {
    if (player == null) {
      player = new Audio(filePath);
    }
    player.src = filePath;
    player.pause();
    player.currentTime = 0;
    player.volume = volume;
    player
      .play()
      .then(() => {
        resolve();
      })
      .catch((reason) => {
        reject(reason);
      });
  });
}

const resetAll = () => {
  clearInterval(intervalId);
  clearTimeout(timeoutId);
  if (player) {
    player.pause();
    player = null;
  }
};

async function main() {
  document
    .getElementById("start-button")
    .addEventListener("click", async () => {
      resetAll();
      document.getElementById(
        "timer"
      ).innerHTML = `Time remaining: ${duration}s`;
      await startTimer(duration);
      await playMP3(filePath);
    });

  document.getElementById("test-audio").addEventListener("click", async () => {
    resetAll();
    await playMP3(filePath);
  });
  document.getElementById("volume-slider").addEventListener("input", (e) => {
    volume = Number(e.target.value) / 100;
    if (player) {
      player.volume = volume;
    }
  });
  document.getElementById("mp3-file").addEventListener("input", (e) => {
    filePath = e.target.value;
  });
  console.log("done main");
}

document.addEventListener("DOMContentLoaded", function () {
  main();
});
