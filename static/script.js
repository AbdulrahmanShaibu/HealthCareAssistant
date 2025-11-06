let recognizing = false;
let recognition;

if ("webkitSpeechRecognition" in window) {
  recognition = new webkitSpeechRecognition();
  recognition.continuous = false;
  recognition.lang = "sw-TZ"; // Swahili language
  recognition.interimResults = false;

  recognition.onstart = () => {
    recognizing = true;
    document.getElementById("mic-btn").textContent = "🎙️ Inasikiliza...";
  };

  recognition.onend = () => {
    recognizing = false;
    document.getElementById("mic-btn").textContent = "🎤 Sema";
  };

  recognition.onresult = (event) => {
    const transcript = event.results[0][0].transcript;
    document.getElementById("user-input").value = transcript;
    sendMessage();
  };
}

function toggleMic() {
  if (recognizing) recognition.stop();
  else recognition.start();
}

async function sendMessage() {
  const input = document.getElementById("user-input");
  const chatbox = document.getElementById("chatbox");
  const message = input.value.trim();
  if (!message) return;

  chatbox.innerHTML += `<div class='message user'><b>Wewe:</b> ${message}</div>`;
  input.value = "";

  try {
    const res = await fetch("/ask", {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({message})
    });

    const data = await res.json();

    chatbox.innerHTML += `<div class='message bot'><b>AI:</b> ${data.response}</div>`;
    chatbox.scrollTop = chatbox.scrollHeight;

    if (data.audio) {
      const audio = document.getElementById("audio");
      audio.src = "data:audio/mp3;base64," + data.audio;
      audio.hidden = false;

      try {
        await audio.play();
      } catch (err) {
        console.warn("Audio play issue:", err);
      }
    }
  } catch (error) {
    chatbox.innerHTML += `<div class='message bot'><b>AI:</b> Samahani, kuna hitilafu ya mtandao.</div>`;
    console.error("Error:", error);
  }
}

// ====== SLIDESHOW ======
const slides = document.querySelectorAll("#slideshow img");
let currentSlide = 0;

function nextSlide() {
  slides[currentSlide].classList.remove("active");
  currentSlide = (currentSlide + 1) % slides.length;
  slides[currentSlide].classList.add("active");
}
setInterval(nextSlide, 6000);

// ====== HELP MODAL ======
const helpBtn = document.getElementById('help-btn');
const modal = document.getElementById('help-modal');
const closeBtn = document.querySelector('.close-btn');

helpBtn.addEventListener('click', () => modal.style.display = 'flex');
closeBtn.addEventListener('click', () => modal.style.display = 'none');
window.addEventListener('click', e => { if (e.target === modal) modal.style.display = 'none'; });

// ====== LOADING SCREEN ======
window.addEventListener("load", () => {
  const loader = document.querySelector(".loading-screen");
  setTimeout(() => loader.style.display = "none", 3500);
});

// ====== KEEP SERVER ALIVE (Render fix) ======
setInterval(() => fetch("/ping"), 180000);
