<script>
let recognizing = false;
let recognition;

if ("webkitSpeechRecognition" in window) {
  recognition = new webkitSpeechRecognition();
  recognition.continuous = false;
  recognition.lang = "sw-TZ"; // Swahili
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

// ✅ FIXED sendMessage FUNCTION (compatible with Flask Base64 response)
async function sendMessage() {
  const input = document.getElementById("user-input");
  const chatbox = document.getElementById("chatbox");
  const message = input.value.trim();
  if (!message) return;

  // show user message
  chatbox.innerHTML += `<div class='message user'><b>Wewe:</b> ${message}</div>`;
  input.value = "";
  chatbox.scrollTop = chatbox.scrollHeight;

  try {
    const res = await fetch("/ask", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message }),
    });

    const data = await res.json();

    // show bot message
    chatbox.innerHTML += `<div class='message bot'><b>AI:</b> ${data.response}</div>`;
    chatbox.scrollTop = chatbox.scrollHeight;

    // ✅ play audio safely if exists (Base64)
    if (data.audio) {
      try {
        const audio = new Audio("data:audio/mp3;base64," + data.audio);
        audio.play().catch((err) => console.warn("Audio play issue:", err));
      } catch (err) {
        console.error("Audio error:", err);
      }
    } else {
      console.warn("No audio found in response");
    }

  } catch (error) {
    console.error("Error communicating with server:", error);
    chatbox.innerHTML += `<div class='message bot error'><b>AI:</b> ⚠️ Samahani, kuna tatizo la mawasiliano. Jaribu tena.</div>`;
  }
}

// ===== SLIDESHOW FUNCTIONALITY =====
const slides = document.querySelectorAll("#slideshow img");
let currentSlide = 0;

function nextSlide() {
  slides[currentSlide].classList.remove("active");
  currentSlide = (currentSlide + 1) % slides.length;
  slides[currentSlide].classList.add("active");
}
setInterval(nextSlide, 6000); // change image every 6 seconds

// ===== HELP MODAL FUNCTIONALITY =====
const helpBtn = document.getElementById("help-btn");
const modal = document.getElementById("help-modal");
const closeBtn = document.querySelector(".close-btn");

helpBtn.addEventListener("click", () => {
  modal.style.display = "flex";
});
closeBtn.addEventListener("click", () => {
  modal.style.display = "none";
});
window.addEventListener("click", (e) => {
  if (e.target === modal) modal.style.display = "none";
});

// ===== LOADING SCREEN FUNCTIONALITY =====
window.addEventListener("load", () => {
  const loader = document.querySelector(".loading-screen");
  setTimeout(() => (loader.style.display = "none"), 3500);
});
</script>
