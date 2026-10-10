
const ADMIN_WHATSAPP = ""; // Isi nomor admin nanti, contoh: 6281234567890

const properties = [
  {
    id: 1,
    name: "Rumah Nyaman di Bayung Lencir",
    type: "Rumah",
    location: "Bayung Lencir, Musi Banyuasin",
    price: 350000000,
    area: "120 m²",
    image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=900&q=80"
  },
  {
    id: 2,
    name: "Tanah Strategis untuk Investasi",
    type: "Tanah",
    location: "Bayung Lencir, Musi Banyuasin",
    price: 150000000,
    area: "300 m²",
    image: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=900&q=80"
  },
  {
    id: 3,
    name: "Kebun untuk Peluang Usaha",
    type: "Kebun",
    location: "Sekitar Bayung Lencir",
    price: 500000000,
    area: "1 hektare",
    image: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=900&q=80"
  }
];

let selectedCategory = "";

const rupiah = (number) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0
  }).format(number);

function renderProperties() {
  const listing = document.getElementById("listing");
  if (!listing) return;

  const query = (document.getElementById("q")?.value || "")
    .trim()
    .toLowerCase();

  const type = document.getElementById("jenis")?.value || "";

  const filtered = properties.filter((property) => {
    const matchesQuery =
      `${property.name} ${property.location} ${property.type}`
        .toLowerCase()
        .includes(query);

    const matchesType = !type || property.type === type;
    const matchesCategory =
      !selectedCategory || property.type === selectedCategory;

    return matchesQuery && matchesType && matchesCategory;
  });

  if (filtered.length === 0) {
    listing.innerHTML =
      '<div class="empty-state">Properti tidak ditemukan. Coba kata kunci lain.</div>';
    return;
  }

  listing.innerHTML = filtered.map((property) => `
    <article class="property-card">
      <div class="property-image">
        <img
          src="${property.image}"
          alt="${property.name}"
          loading="lazy"
          onerror="this.style.display='none'"
        >
        <span class="property-badge">${property.type}</span>
      </div>
      <div class="property-body">
        <h3>${property.name}</h3>
        <div class="property-location">📍 ${property.location}</div>
        <div class="property-price">${rupiah(property.price)}</div>
        <div class="property-meta">
          <span>📐 ${property.area}</span>
          <span>Informasi contoh</span>
        </div>
        <div class="property-actions">
          <button class="btn" onclick="shareProperty(${property.id})">
            Bagikan ↗
          </button>
        </div>
      </div>
    </article>
  `).join("");
}

function shareProperty(id) {
  const property = properties.find((item) => item.id === id);
  if (!property) return;

  const message =
    `${property.name}\n` +
    `Jenis: ${property.type}\n` +
    `Lokasi: ${property.location}\n` +
    `Harga contoh: ${rupiah(property.price)}\n\n` +
    `Informasi contoh BAYLENCIR PROPERTY. Hubungi admin untuk informasi properti terverifikasi.`;

  if (navigator.share) {
    navigator.share({
      title: property.name,
      text: message,
      url: window.location.href
    }).catch(() => {});
  } else if (navigator.clipboard) {
    navigator.clipboard.writeText(message)
      .then(() => alert("Informasi berhasil disalin."))
      .catch(() => alert(message));
  } else {
    alert(message);
  }
}

function shareWebsite() {
  const data = {
    title: "BAYLENCIR PROPERTY",
    text: "Cari dan pasarkan properti di Bayung Lencir.",
    url: window.location.href
  };

  if (navigator.share) {
    navigator.share(data).catch(() => {});
  } else if (navigator.clipboard) {
    navigator.clipboard.writeText(window.location.href)
      .then(() => alert("Tautan website berhasil disalin."))
      .catch(() => alert(window.location.href));
  } else {
    alert(window.location.href);
  }
}

function submitProperty(event) {
  event.preventDefault();

  const form = event.currentTarget;
  const data = new FormData(form);
  const values = Object.fromEntries(data.entries());

  if (!ADMIN_WHATSAPP) {
    alert("Nomor WhatsApp admin belum diatur. Data belum dikirim atau disimpan. Silakan atur ADMIN_WHATSAPP di app.js.");
    return;
  }

  const message = [
    "PENGAJUAN TITIP JUAL PROPERTI",
    `Nama pemilik: ${values.nama}`,
    `WhatsApp pemilik: ${values.wa}`,
    `Jenis: ${values.jenis}`,
    `Lokasi: ${values.lokasi}`,
    `Harga diminta: ${values.harga}`,
    `Luas: ${values.luas || "-"}`,
    `Keterangan: ${values.detail || "-"}`
  ].join("\n");

  const url =
    `https://wa.me/${ADMIN_WHATSAPP}?text=${encodeURIComponent(message)}`;

  window.open(url, "_blank", "noopener,noreferrer");
}

document.addEventListener("DOMContentLoaded", () => {
  renderProperties();

  document.getElementById("searchBtn")
    ?.addEventListener("click", renderProperties);

  document.getElementById("q")
    ?.addEventListener("input", renderProperties);

  document.getElementById("jenis")
    ?.addEventListener("change", () => {
      selectedCategory = "";
      document.querySelectorAll(".category")
        .forEach((button) => button.classList.remove("active"));
      renderProperties();
    });

  document.querySelectorAll(".category").forEach((button) => {
    button.addEventListener("click", () => {
      const category = button.dataset.category;
      selectedCategory =
        selectedCategory === category ? "" : category;

      const select = document.getElementById("jenis");
      if (select) select.value = "";

      document.querySelectorAll(".category").forEach((item) => {
        item.classList.toggle(
          "active",
          item.dataset.category === selectedCategory
        );
      });

      renderProperties();
    });
  });

  document.getElementById("shareSite")
    ?.addEventListener("click", shareWebsite);

  document.getElementById("sellForm")
    ?.addEventListener("submit", submitProperty);

  const year = document.getElementById("year");
  if (year) year.textContent = new Date().getFullYear();
});
