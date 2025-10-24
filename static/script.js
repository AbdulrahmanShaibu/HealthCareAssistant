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

async function sendMessage() {
  const input = document.getElementById("user-input");
  const chatbox = document.getElementById("chatbox");
  const message = input.value.trim();
  if (!message) return;

  chatbox.innerHTML += `<div class='message user'><b>Wewe:</b> ${message}</div>`;
  input.value = "";

  const res = await fetch("/ask", {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({message})
  });

  const data = await res.json();
  chatbox.innerHTML += `<div class='message bot'><b>AI:</b> ${data.response}</div>`;
  chatbox.scrollTop = chatbox.scrollHeight;

  const audio = document.getElementById("audio");
  audio.src = data.audio + "?v=" + new Date().getTime();
  audio.hidden = false;
  audio.play();
}

 const slides = document.querySelectorAll("#slideshow img");
    let currentSlide = 0;

    function nextSlide() {
      slides[currentSlide].classList.remove("active");
      currentSlide = (currentSlide + 1) % slides.length;
      slides[currentSlide].classList.add("active");
    }
    setInterval(nextSlide, 6000); // change image every 6 second