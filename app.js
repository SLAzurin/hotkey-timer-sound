const fs = require("fs");
let player = null;

function startTimer(duration) {
  let remainingTime = duration;
  const intervalId = setInterval(() => {
    document.getElementById(
      "timer"
    ).innerHTML = `Time remaining: ${--remainingTime}s`;
    if (remainingTime <= 0) {
      clearInterval(intervalId);
    }
  }, 1000);
  return new Promise((resolve) => {
    setTimeout(resolve, duration * 1000);
  });
}

async function playMP3(filePath) {
  return new Promise((resolve, reject) => {
    if (player != null) {
      player.pause();
    }
    player = new Audio("Discotheque.mp3");
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

async function main() {
  const duration = 1; //prompt(`Enter timer duration in seconds: `);
  const filePath = "Discotheque.mp3"; //prompt(`Enter MP3 file path: `);
  document
    .getElementById("start-button")
    .addEventListener("click", async () => {
      await startTimer(duration);
      await playMP3(filePath);
    });
  console.log("done main");
}

document.addEventListener("DOMContentLoaded", function () {
  main();
});
