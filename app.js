// ====== Settings ======
const SHOP_PHONE = "+12104166066";

// If your haircut photos in the repo are named cut_1.jpeg, cut_2.jpeg, etc:
const GALLERY_IMAGES = [
  "cut_1.jpeg","cut_2.jpeg","cut_3.jpeg","cut_4.jpeg","cut_5.jpeg",
  "cut_6.jpeg","cut_7.jpeg","cut_8.jpeg","cut_9.jpeg","cut_10.jpeg"
];

// Barbers list (with Any Barber option)
const BARBERS = [
  "Any Barber",
  "Antonio","Pablo","Joel","David","Brian","Alex","Daniel","Liseth",
  "Brandon","John","Angel","Anthony"
];

// ====== Time Slots (10:00 to 7:30, every 30 min) ======
function buildSlots() {
  const slots = [];
  const start = 10 * 60;       // 10:00
  const end = 19 * 60 + 30;    // 7:30pm
  for (let m = start; m <= end; m += 30) {
    const h24 = Math.floor(m / 60);
    const min = m % 60;
    const ampm = h24 >= 12 ? "PM" : "AM";
    const h12 = ((h24 + 11) % 12) + 1;
    const label = `${h12}:${min.toString().padStart(2,"0")} ${ampm}`;
    slots.push(label);
  }
  return slots;
}

function qs(id){ return document.getElementById(id); }

function setTodayMinDate() {
  const d = new Date();
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth()+1).padStart(2,"0");
  const dd = String(d.getDate()).padStart(2,"0");
  qs("date").min = `${yyyy}-${mm}-${dd}`;
  qs("date").value = `${yyyy}-${mm}-${dd}`;
}

function fillSelect(el, items) {
  el.innerHTML = "";
  items.forEach(v => {
    const opt = document.createElement("option");
    opt.value = v;
    opt.textContent = v;
    el.appendChild(opt);
  });
}

function renderGallery() {
  const wrap = qs("gallery");
  wrap.innerHTML = "";
  GALLERY_IMAGES.forEach(src => {
    const a = document.createElement("a");
    a.href = src;
    a.target = "_blank";
    a.rel = "noreferrer";

    const img = document.createElement("img");
    img.src = src;
    img.loading = "lazy";
    img.alt = "Blessed Fadez haircut";

    a.appendChild(img);
    wrap.appendChild(a);
  });
}

function formatDate(dateStr){
  if (!dateStr) return "";
  const [y,m,d] = dateStr.split("-");
  return `${m}/${d}/${y}`;
}

function toSMSLink(message) {
  // iOS likes sms:+number&body=... (some devices use ?&body=...)
  const body = encodeURIComponent(message);
  return `sms:${SHOP_PHONE}&body=${body}`;
}

function initBooking() {
  const timeEl = qs("time");
  const barberEl = qs("barber");
  fillSelect(timeEl, buildSlots());
  fillSelect(barberEl, BARBERS);
  setTodayMinDate();

  qs("bookingForm").addEventListener("submit", (e) => {
    e.preventDefault();

    const date = formatDate(qs("date").value);
    const time = timeEl.value;
    const service = qs("service").value;
    const barber = barberEl.value;
    const name = qs("name").value.trim();
    const notes = qs("notes").value.trim();

    const msgLines = [
      "Blessed Fadez — Booking Request",
      `Date: ${date}`,
      `Time: ${time}`,
      `Service: ${service}`,
      `Barber: ${barber}`,
      name ? `Name: ${name}` : null,
      notes ? `Notes: ${notes}` : null
    ].filter(Boolean);

    const msg = msgLines.join("\n");
    window.location.href = toSMSLink(msg);
  });
}

document.getElementById("year").textContent = new Date().getFullYear();

renderGallery();
initBooking();
