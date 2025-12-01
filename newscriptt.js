// ======================= QUICK ACTION BUTTONS WITH RINGTONE =======================
let ringtone; // global ringtone so we can stop it

function callNumber(number) {
    // Create popup
    const popup = document.createElement('div');
    popup.classList.add('call-popup');
    popup.innerHTML = `<p>Calling ${number}...</p>`;
    document.body.appendChild(popup);

    // Create audio if not already
    if (!ringtone) {
        ringtone = new Audio("https://actions.google.com/sounds/v1/alarms/phone_ring.ogg");
        ringtone.loop = true;
    }

    // Play audio (must be on user click)
    ringtone.play().catch((err) => {
        console.log("Audio play failed:", err);
        alert("Audio blocked by browser. Please click the button again.");
    });

    // Stop after 5 seconds
    setTimeout(() => {
        ringtone.pause();
        ringtone.currentTime = 0;
        document.body.removeChild(popup);
    }, 5000);
}

function callPolice() { callNumber('100'); }
function callTrusted() { callNumber('7508975937'); }

function playSiren() {
    const siren = new Audio("https://actions.google.com/sounds/v1/alarms/police_siren.ogg");
    siren.play().catch(() => console.log("Siren blocked."));
}
function searchNearbyPolice() {
    window.open("https://www.google.com/maps/search/nearby+police+station");
}

// ======================= MAIN MAP & MINI MAP =======================
if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition((pos) => {
        const lat = pos.coords.latitude;
        const lon = pos.coords.longitude;

        // MAIN MAP
        const map = L.map('map').setView([lat, lon], 15);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);
        L.marker([lat, lon]).addTo(map).bindPopup("You are here").openPopup();

        // MINI MAP
        const mapMini = L.map('map-mini').setView([lat, lon], 15);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(mapMini);
        L.marker([lat, lon]).addTo(mapMini);

        // SHOW COORDINATES
        const userLocation = document.getElementById("userLocation");
        if (userLocation) {
            userLocation.innerHTML = `<b>Latitude:</b> ${lat}<br><b>Longitude:</b> ${lon}`;
        }
    });
}

// ======================= SOS BUTTON =======================
const sosBtn = document.getElementById("sosBtn");
if (sosBtn) {
    sosBtn.addEventListener("click", function () {
        const status = document.getElementById("sosStatus");

        if (!navigator.geolocation) {
            status.textContent = "Your device does not support location.";
            return;
        }

        status.textContent = "Getting your location...";

        navigator.geolocation.getCurrentPosition(
            function (position) {
                const latitude = position.coords.latitude;
                const longitude = position.coords.longitude;

                status.innerHTML =
                    "Your Location: <br>" +
                    "Latitude: " + latitude + "<br>" +
                    "Longitude: " + longitude + "<br><br>" +
                    "Share this with emergency contacts!";
            },
            function () {
                status.textContent = "Unable to get your location.";
            }
        );
    });
}

// ======================= REPORT INCIDENT FORM =======================
const incidentForm = document.getElementById("incidentForm");
if (incidentForm) {
    incidentForm.addEventListener("submit", function (e) {
        e.preventDefault();
        document.getElementById("reportStatus").textContent =
            "Your report has been submitted. We will help you shortly.";
        incidentForm.reset();
    });
}

// ======================= DARK MODE TOGGLE =======================
const darkToggle = document.getElementById("darkToggle");
if (darkToggle) {
    darkToggle.addEventListener("click", function () {
        document.body.classList.toggle("dark");
    });
}

// ======================= QUIZ FUNCTION =======================
function checkAnswer(button, correct) {
    const result = button.parentElement.querySelector('.quiz-result');
    if (button.textContent === correct) {
        result.textContent = "✅ Correct!";
        result.style.color = "green";
    }
     else {
        result.textContent = "❌ Wrong! Try again.";
        result.style.color = "red";
    }
}
