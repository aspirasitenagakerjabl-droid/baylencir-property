
/*
 * BAYLENCIR PROPERTY
 * Fungsi pencarian, kategori, berbagi, dan pengajuan properti.
 *
 * Catatan:
 * - Pengajuan saat ini dikirim melalui WhatsApp.
 * - Data belum disimpan ke database.
 * - Nomor admin harus diatur sebelum formulir digunakan.
 */

const ADMIN_WHATSAPP = ""; 
// Isi nanti dengan nomor admin, contoh format: 6281234567890
// Jangan gunakan tanda +, spasi, atau tanda hubung.

const properties = [
  {
    id: 1,
    name: "Contoh Rumah di Bayung Lencir",
    type: "Rumah",
    location: "Bayung Lencir, Musi Banyuasin",
    price: 350000000,
    area: "120 m²",
    image:
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=900&q=80"
  },
  {
    id: 2,
    name: "Contoh Tanah di Bayung Lencir",
    type: "Tanah",
    location: "Bayung Lencir, Musi Banyuasin",
    price: 150000000,
    area: "300 m²",
    image:
      "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=900&q=80"
  },
  {
    id: 3,
    name: "Contoh Kebun di Sekitar Bayung Lencir",
    type: "Kebun",
    location: "Sekitar Bayung Lencir",
    price: 500000000,
    area: "1 hektare",
    image:
      "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=900&q=80"
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

  const query = (
    document.getElementById("q")?.value || ""
  ).trim().toLowerCase();

  const type = document.getElementById("jenis")?.value || "";

  const filtered = properties.filter((property) => {
    const searchable =
      `${property.name} ${property.location} ${property.type}`
        .toLowerCase();

    return (
      searchable.includes(query) &&
      (!type || property.type === type) &&
      (!selectedCategory || property.type === selectedCategory)
    );
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
          <span>Contoh tampilan</span>
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

  const message = [
    property.name,
    `Jenis: ${property.type}`,
    `Lokasi: ${property.location}`,
    `Harga contoh: ${rupiah(property.price)}`,
    "",
    "Contoh tampilan BAYLENCIR PROPERTY, bukan penawaran properti terverifikasi."
  ].join("\n");

  shareContent(property.name, message);
}

async function shareContent(title, text) {
  try {
    if (navigator.share) {
      await navigator.share({
        title,
        text,
        url: window.location.href
      });
      return;
    }

    if (navigator.clipboard) {
      await navigator.clipboard.writeText(
        `${text}\n${window.location.href}`
      );
      alert("Informasi berhasil disalin.");
      return;
    }

    alert(`${text}\n${window.location.href}`);
  } catch (error) {
    if (error?.name !== "AbortError") {
      alert("Informasi belum berhasil dibagikan. Silakan coba lagi.");
    }
  }
}

function shareWebsite() {
  shareContent(
    "BAYLENCIR PROPERTY",
    "Temukan dan ajukan properti untuk dipromosikan di Bayung Lencir."
  );
}

function submitProperty(event) {
  event.preventDefault();

  const form = event.currentTarget;

  if (!form.reportValidity()) return;

  if (!ADMIN_WHATSAPP) {
    alert(
      "Nomor WhatsApp admin belum diatur. " +
      "Pengajuan belum dikirim dan belum disimpan."
    );
    return;
  }

  const data = new FormData(form);
  const values = Object.fromEntries(data.entries());

  const message = [
    "PENGAJUAN PROMOSI PROPERTI",
    "",
    `Nama pemilik/pihak berwenang: ${values.nama}`,
    `WhatsApp pemohon: ${values.wa}`,
    `Jenis properti: ${values.jenis}`,
    `Lokasi: ${values.lokasi}`,
    `Harga yang diminta: ${values.harga}`,
    `Luas: ${values.luas || "-"}`,
    `Keterangan: ${values.detail || "-"}`,
    "",
    "Pernyataan pemohon:",
    "Pemohon menyetujui pernyataan pada formulir pengajuan.",
    "",
    "Catatan: Pengajuan harus ditinjau admin sebelum iklan ditayangkan."
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

      document.querySelectorAll(".category").forEach((button) => {
        button.classList.remove("active");
      });

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
