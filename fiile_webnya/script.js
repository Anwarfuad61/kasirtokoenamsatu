/* ========= ELEMENT ========= */
const elSplash = document.getElementById("splash");
const elLogin  = document.getElementById("login");
const elApp    = document.getElementById("app");

const elProdukGrid = document.getElementById("produkGrid");
const elKeranjang  = document.getElementById("keranjang");

const elNama = document.getElementById("nama");
const elKategori = document.getElementById("kategori");
const elHarga = document.getElementById("harga");
const elStok = document.getElementById("stok");
const elGambar = document.getElementById("gambar");
const elPreview = document.getElementById("preview");

const elTotal = document.getElementById("totalBayar");
const elBayar = document.getElementById("bayar");
const elKembalian = document.getElementById("kembalian");
const elDiskon = document.getElementById("diskon");
const elDiskonPersen = document.getElementById("diskonPersen");

const elLaporan = document.getElementById("laporan");
const elOmzet = document.getElementById("omzet");

const STOK_MINIMUM = 5; // 🔥 batas stok menipis
const toast = document.getElementById("toast");
const editModal  = document.getElementById("editModal");
const editNama   = document.getElementById("editNama");
const editHarga  = document.getElementById("editHarga");
const editStok   = document.getElementById("editStok");
const editPreview= document.getElementById("editPreview");
const editGambar = document.getElementById("editGambar");
const editKategori = document.getElementById("editKategori");
/* ========= DATA ========= */
let produk = JSON.parse(localStorage.getItem("produk")) || [];
let keranjang = [];
let laporan = JSON.parse(localStorage.getItem("laporan")) || [];
let lastDeleted = null;
let editId = null;
let startX = 0;
let metodeBayar = "tunai";
let riwayatPembelian = JSON.parse(localStorage.getItem("riwayatPembelian")) || [];
/* ========= SPLASH ========= */
setTimeout(() => elSplash.style.display="none", 1000);

/* ========= LOGIN ========= */
function login(){
  const pin = document.getElementById("pin").value;

  if(pin === "1234"){
    localStorage.setItem("kasir_login", "true");

    elLogin.style.display = "none";
    elApp.style.display   = "block";

    tampilProduk();
    tampilLaporan();
  } else {
    swalError("PIN salah");
  }
}

function logout(){
  swalConfirm("Keluar dari kasir?", ()=>{
    localStorage.removeItem("kasir_login");
    location.reload();
  });
}

/* ===== SWEET ALERT HELPERS ===== */
function swalError(text){
  Swal.fire({
    icon: "error",
    title: "Oops!",
    text,
    confirmButtonColor: "#ef4444"
  });
}

function swalSuccess(text){
  Swal.fire({
    icon: "success",
    title: "Berhasil",
    text,
    timer: 1500,
    showConfirmButton: false
  });
}

function swalWarning(text){
  Swal.fire({
    icon: "warning",
    title: "Perhatian",
    text,
    confirmButtonColor: "#f59e0b"
  });
}

function swalConfirm(text, callback){
  Swal.fire({
    icon: "question",
    title: "Konfirmasi",
    text,
    showCancelButton: true,
    confirmButtonText: "Ya",
    cancelButtonText: "Batal",
    confirmButtonColor: "#14b8a6"
  }).then(res=>{
    if(res.isConfirmed) callback();
  });
}
function toastSuccess(text){
  Swal.fire({
    toast: true,
    position: "top",
    icon: "success",
    title: text,
    showConfirmButton: false,
    timer: 2000
  });
}

function setMetode(m){
  metodeBayar = m;

  btnTunai.classList.remove("active");
  btnQris.classList.remove("active");

  if(m === "tunai"){
    btnTunai.classList.add("active");
    elBayar.disabled = false;
    elBayar.value = "";
  } else {
    btnQris.classList.add("active");
    elBayar.disabled = true;
    elBayar.value = "";
    elKembalian.value = formatRupiah(0);
  }
}
/* ===== LOADING POPUP ===== */
function showLoading(text = "Memproses..."){
  Swal.fire({
    title: text,
    allowOutsideClick: false,
    allowEscapeKey: false,
    showConfirmButton: false,
    didOpen: () => {
      Swal.showLoading();
    }
  });
}

function updateBadgeKeranjang(){
  const badge = document.getElementById("badgeKeranjang");
  const totalQty = keranjang.reduce((a,b)=>a + b.qty, 0);

  if(totalQty > 0){
    badge.innerText = totalQty;
    badge.style.display = "flex";
  } else {
    badge.style.display = "none";
  }
}

function hideLoading(){
  Swal.close();
}

/* ========= TAB ========= */
function showTab(tab, btn){
  haptic();

  document.querySelectorAll(".tab").forEach(t=>t.classList.remove("active"));
  document.getElementById("tab-"+tab)?.classList.add("active");

  const buttons = document.querySelectorAll(".bottom-nav button[data-tab]");
  buttons.forEach(b=>b.classList.remove("active"));
  btn?.classList.add("active");

  const index = [...buttons].indexOf(btn);
  document.querySelector(".nav-indicator")
    .style.transform = `translateX(${index * 100}%)`;

  localStorage.setItem("tab_aktif", tab);
}


document.addEventListener("DOMContentLoaded", ()=>{
  const tab = localStorage.getItem("tab_aktif") || "katalog";
  const btn = document.querySelector(`.bottom-nav button[data-tab="${tab}"]`);
  showTab(tab, btn);
});

/* ========= PRODUK ========= */
elGambar.onchange = e=>{
  const r=new FileReader();
  r.onload=()=>elPreview.src=r.result;
  r.readAsDataURL(e.target.files[0]);
};

async function tambahProduk(){
  const btn = document.getElementById("btnTambahProduk");

  if(!elNama.value || !elHarga.value){
    swalWarning("Lengkapi data produk");
    return;
  }
  // 🔥 TAMPILKAN LOADING
  showLoading("Menyimpan produk...");

  lockButton(btn);

  // kasih jeda kecil supaya popup muncul di HP
  await new Promise(r => setTimeout(r, 200))

  produk.push({
    id: Date.now(),
    nama: elNama.value.trim(),
    kategori: elKategori.value.trim(),
    harga: Number(elHarga.value),
    stok: Number(elStok.value),
    img: elPreview.src || ""
  });

  localStorage.setItem("produk", JSON.stringify(produk));

  // reset form
  elNama.value = "";
  elKategori.value = "";
  elHarga.value = "";
  elStok.value = "";
  elPreview.src = "";
  elPreview.classList.remove("show");
  elGambar.value = "";

  tampilProduk();
  refreshKategoriFilter();
  unlockButton(btn);
   // 🔥 TUTUP LOADING + TOAST
  hideLoading();
  toastSuccess("Produk ditambahkan");
}


/* ===== TAMPIL PRODUK (SEARCH + FILTER) ===== */
function tampilProduk(){
  const q = document.getElementById("search").value.toLowerCase();
  const kat = document.getElementById("filterKategori").value;

  elProdukGrid.innerHTML = "";

  let kategoriSet = new Set();
  produk.forEach(p => kategoriSet.add(p.kategori));

  // isi dropdown kategori
  filterKategori.innerHTML = `<option value="">Semua Kategori</option>`;
  kategoriSet.forEach(k=>{
    filterKategori.innerHTML += `<option value="${k}">${k}</option>`;
  });

  produk
    .filter(p =>
      (!q || p.nama.toLowerCase().includes(q)) &&
      (!kat || p.kategori === kat)
    )
    .forEach(p => {
     elProdukGrid.innerHTML += `
  <div class="produk-card-item">
    <div class="produk-img-wrap">
      <img src="${p.img}" onclick="zoomGambar('${p.img}')">
      <span class="badge-stok ${p.stok <= STOK_MINIMUM ? 'low' : ''}">
  Stok ${p.stok}
</span>
    </div>

    <div class="produk-info">
      <div class="produk-nama">${p.nama}</div>
      <div class="produk-kategori">${p.kategori}</div>
      <div class="produk-harga">${formatRupiah(p.harga)}</div>
    </div>

    <div class="produk-actions-btn">
      <button class="btn-add" onclick="tambahKeranjang(${p.id})" ${p.stok<=0?'disabled':''}>➕</button>
      <button class="btn-edit" onclick="bukaEdit(${p.id})">✏️</button>
      <button class="btn-del" onclick="hapusProduk(${p.id})">🗑️</button>
    </div>
  </div>
`;
    });
    cekStokMenipis();
}


/* TAMPILKAN TOAST */
function showToast(pesan){
  toast.innerText = pesan;
  toast.classList.add("show");

  setTimeout(() => {
    toast.classList.remove("show");
  }, 3000);
}

/* CEK STOK MENIPIS */
function cekStokMenipis(){
  const notified = JSON.parse(localStorage.getItem("stok_notif")) || [];

  produk.forEach(p => {
    if(p.stok <= STOK_MINIMUM && !notified.includes(p.id)){
      showToast(`⚠️ Stok "${p.nama}" hampir habis (${p.stok})`);
      notified.push(p.id);
    }
  });

  localStorage.setItem("stok_notif", JSON.stringify(notified));
}

/* BUKA MODAL EDIT */
function bukaEdit(id){
  const p = produk.find(x => x.id === id);
  if(!p) return;

  editId = id;

  editNama.value  = p.nama;
  editHarga.value = p.harga;
  editStok.value  = p.stok;
  editKategori.value = p.kategori || "";

  if(p.img){
    editPreview.src = p.img;
    editPreview.style.display = "block";
  } else {
    editPreview.style.display = "none";
  }

  editModal.classList.add("show"); // 🔥 INI KUNCI
}


/* SIMPAN EDIT */
function simpanEdit(){
  const p = produk.find(x => x.id === editId);
  if(!p) return;

  const nama  = editNama.value.trim();
  const harga = Number(editHarga.value);
  const stok  = Number(editStok.value);

  if(!nama){
    swalWarning("Nama produk wajib diisi");
    return;
  }
  if(isNaN(harga) || harga <= 0){
    swalWarning("Harga harus lebih dari 0");
    return;
  }
  if(isNaN(stok) || stok < 0){
    swalWarning("Stok tidak boleh negatif");
    return;
  }

  p.nama = nama;
  p.harga = harga;
  p.stok = stok;
  p.kategori = editKategori.value.trim();

  if(editPreview.src){
    p.img = editPreview.src;
  }

  localStorage.setItem("produk", JSON.stringify(produk));
  tampilProduk();
  refreshKategoriFilter();
  toastSuccess("Produk berhasil diperbarui");
  tutupEdit();
}

function refreshKategoriFilter(){
  const select = document.getElementById("filterKategori");
  if(!select) return;

  const kategoriSet = [...new Set(produk.map(p => p.kategori).filter(k => k))];

  select.innerHTML = `<option value="">Semua Kategori</option>`;
  kategoriSet.forEach(k => {
    select.innerHTML += `<option value="${k}">${k}</option>`;
  });
}


/* ISI DROPDOWN PRODUK */
function isiProdukPembelian(){
  const select = document.getElementById("produkPembelian");
  select.innerHTML = `<option value="">Pilih Produk</option>`;

  produk.forEach(p=>{
    select.innerHTML += `
      <option value="${p.id}">
        ${p.nama} (Stok: ${p.stok})
      </option>
    `;
  });
}

/* TUTUP MODAL */
function tutupEdit(){
  editModal.classList.remove("show");
}
function tutupEditByBackdrop(e){
  if(e.target.id === "editModal") tutupEdit();
}


/* ========= KERANJANG ========= */
function tambahKeranjang(id){
  const p = produk.find(x => x.id === id);
  if(!p) return;

  if(p.stok <= 0){
    swalError("Stok produk habis");
    return;
  }

  const k = keranjang.find(x => x.id === id);
  k ? k.qty++ : keranjang.push({...p, qty:1});

  p.stok--; // 🔥 STOK BERKURANG
  localStorage.setItem("produk", JSON.stringify(produk));
  cekStokMenipis();

  updateBadgeKeranjang();
  tampilProduk();
  tampilKeranjang();
  showTab('keranjang');
}

function beliProduk(){
  const id = parseInt(document.getElementById("produkPembelian").value);
  const jumlah = parseInt(document.getElementById("jumlahBeli").value);
  const hargaBeli = parseInt(document.getElementById("hargaBeli").value) || 0;

  if(!id || !jumlah || jumlah <= 0){
    swalWarning("Lengkapi data pembelian");
    return;
  }

  const p = produk.find(x => x.id === id);
  if(!p) return;

  // TAMBAH STOK
  p.stok += jumlah;

  // SIMPAN RIWAYAT
  const data = {
    waktu: new Date().toLocaleString(),
    nama: p.nama,
    jumlah,
    hargaBeli
  };

  riwayatPembelian.push(data);

  localStorage.setItem("produk", JSON.stringify(produk));
  localStorage.setItem("riwayatPembelian", JSON.stringify(riwayatPembelian));

  // RESET FORM
  document.getElementById("produkPembelian").value = "";
  document.getElementById("jumlahBeli").value = "";
  document.getElementById("hargaBeli").value = "";

  isiProdukPembelian();
  tampilRiwayatPembelian();
  tampilProduk();

  toastSuccess("Stok berhasil ditambahkan");
}

function resizeImage(base64, maxWidth = 400){
  return new Promise(resolve => {
    const img = new Image();
    img.onload = () => {
      const scale = maxWidth / img.width;
      const canvas = document.createElement("canvas");
      canvas.width = maxWidth;
      canvas.height = img.height * scale;

      const ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      resolve(canvas.toDataURL("image/jpeg", 0.7));
    };
    img.src = base64;
  });
}


function tampilRiwayatPembelian(){
  const el = document.getElementById("riwayatPembelian");
  el.innerHTML = "";

  if(riwayatPembelian.length === 0){
    el.innerHTML = `<p class="empty">Belum ada pembelian</p>`;
    return;
  }

  riwayatPembelian.slice().reverse().forEach(r=>{
    el.innerHTML += `
      <div class="riwayat-item">
        <div>
          <b>${r.nama}</b><br>
          <small>${r.waktu}</small>
        </div>
        <div class="riwayat-jumlah">
          +${r.jumlah}
        </div>
      </div>
    `;
  });
}

/* TOGGLE PANEL (ANIMASI) */
function togglePanel(panelId, btn){
  const panel = document.getElementById(panelId);
  const arrow = btn.querySelector(".arrow");

  const isOpen = panel.classList.contains("open");

  // tutup semua panel
  document.querySelectorAll(".panel").forEach(p=>{
    p.classList.remove("open");
    p.style.maxHeight = "0px";
  });

  document.querySelectorAll(".toggle-btn .arrow").forEach(a=>{
    a.classList.remove("rotate");
  });

  // buka panel yang diklik
  if(!isOpen){
    panel.classList.add("open");

    // delay kecil agar scrollHeight terbaca
    setTimeout(()=>{
      panel.style.maxHeight = panel.scrollHeight + "px";
    }, 10);

    arrow.classList.add("rotate");
  }
}


/* PANGGIL SAAT LOAD */
document.addEventListener("DOMContentLoaded", ()=>{
  isiProdukPembelian();
  tampilRiwayatPembelian();
});

function batalTransaksi(){
  keranjang.forEach(k=>{
    const p = produk.find(x=>x.id===k.id);
    if(p) p.stok += k.qty;
  });
  keranjang=[];
  localStorage.setItem("produk", JSON.stringify(produk));
  tampilProduk();
  tampilKeranjang();
  updateBadgeKeranjang();
}


function tampilKeranjang(){
  elKeranjang.innerHTML = "";
  let total = 0;

  if(keranjang.length === 0){
    elKeranjang.innerHTML = `
      <div class="keranjang-empty">
        🛒 Keranjang masih kosong
      </div>
    `;
    elTotal.innerText = formatRupiah(0);
    return;
  }

  keranjang.forEach((k, index) => {
    const subtotal = k.harga * k.qty;
    total += subtotal;

    elKeranjang.innerHTML += `
      <div class="keranjang-item">
        <div class="keranjang-info">
          <div class="nama">${k.nama}</div>
          <div class="harga">${formatRupiah(k.harga)}</div>
        </div>

        <div class="keranjang-action">
          <button onclick="kurangiQty(${index})">−</button>
          <span class="qty">${k.qty}</span>
          <button onclick="tambahQty(${index})">+</button>
        </div>

        <div class="keranjang-subtotal">
          ${formatRupiah(subtotal)}
          <button class="hapus" onclick="hapusKeranjang(${index})">🗑️</button>
        </div>
      </div>
    `;
  });

  // DISKON
  let diskonRp = +elDiskon.value || 0;
  let diskonPct = +elDiskonPersen.value || 0;
  let diskonTotal = diskonRp + (total * diskonPct / 100);

  const grandTotal = Math.max(total - diskonTotal, 0);
  elTotal.innerText = formatRupiah(grandTotal);
}

function tambahQty(index){
  const k = keranjang[index];
  const p = produk.find(x => x.id === k.id);
  if(!p || p.stok <= 0) return;

  k.qty++;
  p.stok--;
  localStorage.setItem("produk", JSON.stringify(produk));
  tampilKeranjang();
  tampilProduk();
  updateBadgeKeranjang();
}

function kurangiQty(index){
  const k = keranjang[index];
  const p = produk.find(x => x.id === k.id);

  k.qty--;
  p.stok++;

  if(k.qty <= 0){
    keranjang.splice(index,1);
  }

  localStorage.setItem("produk", JSON.stringify(produk));
  tampilKeranjang();
  tampilProduk();
  updateBadgeKeranjang();
}

function hapusKeranjang(index){
  const k = keranjang[index];
  const p = produk.find(x => x.id === k.id);

  // kembalikan stok
  p.stok += k.qty;

  keranjang.splice(index,1);
  localStorage.setItem("produk", JSON.stringify(produk));

  tampilKeranjang();
  tampilProduk();
  updateBadgeKeranjang();
}


function formatRupiah(angka){
  return "Rp " + angka.toLocaleString("id-ID");
}

/* ========= BAYAR ========= */
function hitungKembalian(){
  const total = parseInt(elTotal.innerText.replace(/\D/g,"")) || 0;
  const bayar = parseInt(elBayar.value) || 0;

  if(bayar <= 0){
    elKembalian.value = formatRupiah(0);
    return;
  }

  elKembalian.value = formatRupiah(bayar - total);
}


async function prosesBayar(){
  const btn = document.getElementById("btnBayar"); // id tombol bayar

  if(keranjang.length === 0){
    Swal.fire("Keranjang kosong", "", "warning");
    return;
  }

  // 🔒 LOCK BUTTON
  btn.disabled = true;

  // 🔥 SHOW LOADING
  showLoading();

  // 💨 BIAR UI NAFAS (PENTING DI HP)
  await new Promise(r => setTimeout(r, 300));

  try {
    const total = parseInt(elTotal.innerText.replace(/\D/g,"")) || 0;
    let bayar = parseInt(elBayar.value) || 0;
    let kembalian = 0;

    if(metodeBayar === "tunai"){
      if(bayar < total){
        hideLoading();
        Swal.fire("Uang kurang", "", "error");
        btn.disabled = false;
        return;
      }
      kembalian = bayar - total;
    } else {
      bayar = total;
      kembalian = 0;
    }

    const transaksi = {
      waktu: new Date().toLocaleString(),
      metode: metodeBayar.toUpperCase(),
      items: JSON.parse(JSON.stringify(keranjang)),
      total,
      bayar,
      kembalian
    };

    laporan.push(transaksi);
    localStorage.setItem("laporan", JSON.stringify(laporan));

    // 🔥 STRUK
    tampilStruk(transaksi);

    // RESET STATE
    keranjang = [];
    elKeranjang.innerHTML = "";
    elTotal.innerText = formatRupiah(0);
    elBayar.value = "";
    elKembalian.value = formatRupiah(0);

    updateBadgeKeranjang();
    tampilProduk();

    hideLoading();

    Swal.fire({
      icon: "success",
      title: "Pembayaran berhasil",
      timer: 1200,
      showConfirmButton: false
    });

  } catch(err){
    console.error(err);
    hideLoading();
    Swal.fire("Terjadi kesalahan", "Coba ulangi", "error");
  }

  // 🔓 UNLOCK BUTTON
  btn.disabled = false;
}


function haptic(ms = 15){
  if(navigator.vibrate){
    navigator.vibrate(ms);
  }
}


function tampilStruk(t){
  const el = document.getElementById("struk");

  let html = `
    <div class="struk-header">
      <b>TOKO ENAM SATU</b><br>
      Alat Pancing<br>
      -----------------------
    </div>
    <div class="struk-info">
      ${t.waktu}<br>
      Metode: ${t.metode}<br>
      -----------------------
    </div>
  `;

  t.items.forEach(i=>{
    html += `
      <div class="struk-item">
        ${i.nama}<br>
        ${i.qty} x ${formatRupiah(i.harga)}
        <span>${formatRupiah(i.qty * i.harga)}</span>
      </div>
    `;
  });

  html += `
    <div class="struk-total">
      -----------------------
      <div>Total <span>${formatRupiah(t.total)}</span></div>
      <div>Bayar <span>${formatRupiah(t.bayar)}</span></div>
      <div>Kembali <span>${formatRupiah(t.kembalian)}</span></div>
      -----------------------
      <center>Terima Kasih 🙏</center>
    </div>
  `;

  el.innerHTML = html;

  // 🔥 BUKA PANEL STRUK OTOMATIS
  document.getElementById("strukPanel").style.display = "block";
}
function printStruk(){
  const struk = document.getElementById("struk");
  if(!struk || struk.innerHTML.trim() === ""){
    swalWarning("Struk masih kosong");
    return;
  }

  window.print();
}


/* ========= LAPORAN ========= */
function tampilLaporan(data = laporan){
  elLaporan.innerHTML = "";

  if(data.length === 0){
    elLaporan.innerHTML = `
      <div class="laporan-empty">Belum ada transaksi</div>
    `;
    elOmzet.innerText = formatRupiah(0);
    document.getElementById("totalTransaksi").innerText = 0;
    return;
  }

  let omzet = 0;

  data.slice().reverse().forEach(t=>{
    omzet += t.total;

    elLaporan.innerHTML += `
      <div class="laporan-item">
        <div class="row">
          <span>${t.waktu}</span>
          <span>${t.metode}</span>
        </div>
        <div class="total">
          ${formatRupiah(t.total)}
        </div>
      </div>
    `;
  });

  elOmzet.innerText = formatRupiah(omzet);
  document.getElementById("totalTransaksi").innerText = data.length;
}

function filterLaporan(){
  const tgl = document.getElementById("filterTanggal").value;

  if(!tgl){
    tampilLaporan();
    return;
  }

  const hasil = laporan.filter(l=>{
    return l.waktu.startsWith(
      new Date(tgl).toLocaleDateString("id-ID")
    );
  });

  tampilLaporan(hasil);
}

function exportExcel(){
  if(laporan.length === 0){
    swalWarning("Tidak ada data laporan");
    return;
  }

  let csv = "Tanggal,Metode,Total\n";

  laporan.forEach(l=>{
    csv += `"${l.waktu}","${l.metode}",${l.total}\n`;
  });

  const blob = new Blob([csv], { type: "text/csv" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "laporan-penjualan.csv";
  a.click();
}


/* ========= UTIL ========= */
function togglePanel(id){
  const p=document.getElementById(id);
  p.style.display=p.style.display==="none"?"block":"none";
}

function setUkuranStruk(u){
  document.getElementById("struk").className="struk-print struk-"+u;
}
/* ===== ZOOM GAMBAR ===== */
function zoomGambar(src){
  if(!src) return;

  const modal = document.getElementById("zoomModal");
  const img = document.getElementById("zoomImg");

  img.src = src;
  modal.classList.add("show");
}

function tutupZoom(e){
  // jika klik gambar, jangan tutup
  if(e && e.target.id === "zoomImg") return;

  const modal = document.getElementById("zoomModal");
  const img = document.getElementById("zoomImg");

  modal.classList.remove("show");
  img.src = "";
}


function lockButton(btn) {
  btn.disabled = true;
  btn.classList.add("loading");
}

function unlockButton(btn) {
  btn.disabled = false;
  btn.classList.remove("loading");
}


/* ===== HAPUS + UNDO ===== */
function hapusProduk(id){
  const index = produk.findIndex(p => p.id === id);
  if(index === -1) return;

  lastDeleted = produk[index];
  produk.splice(index,1);
  localStorage.setItem("produk", JSON.stringify(produk));

  tampilProduk();
  undoBar.classList.add("show");

  setTimeout(()=>undoBar.classList.remove("show"), 5000);
}

function undoHapus(){
  if(!lastDeleted) return;
  produk.push(lastDeleted);
  localStorage.setItem("produk", JSON.stringify(produk));
  tampilProduk();
  undoBar.classList.remove("show");
}
/* ===== MODE KATALOG ===== */
function toggleKatalog(){
  document.body.classList.toggle("katalog-mode");
}

/* ===== EXPORT PDF (DUMMY) ===== */
function exportKatalogPDF(){
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF("p", "mm", "a4");

  const pageWidth = 210;
  const margin = 12;
  const colGap = 6;
  const colWidth = (pageWidth - margin*2 - colGap) / 2;

  let x = margin;
  let y = 20;
  let col = 0;

  // ===== HEADER =====
  doc.setFontSize(16);
  doc.text("Katalog Produk - Toko Enam Satu", margin, y);
  y += 8;

  doc.setFontSize(10);
  doc.text(
    `Dicetak: ${new Date().toLocaleString()}`,
    margin,
    y
  );
  y += 10;

  // ===== FILTER AKTIF =====
  const q = document.getElementById("search").value.toLowerCase();
  const kat = document.getElementById("filterKategori").value;

  const dataKatalog = produk.filter(p =>
    (!q || p.nama.toLowerCase().includes(q)) &&
    (!kat || p.kategori === kat)
  );

  if(dataKatalog.length === 0){
    swalWarning("Tidak ada produk untuk diexport");
    return;
  }

  // ===== LOOP PRODUK =====
  dataKatalog.forEach((p, i) => {

    // pindah kolom / halaman
    if(y > 270){
      if(col === 0){
        col = 1;
        x = margin + colWidth + colGap;
        y = 38;
      } else {
        doc.addPage();
        col = 0;
        x = margin;
        y = 20;
      }
    }

    // CARD
    doc.setDrawColor(220);
    doc.roundedRect(x, y, colWidth, 58, 4, 4);

    // GAMBAR (jika ada)
    if(p.img){
      try{
        doc.addImage(
          p.img,
          "JPEG",
          x + 2,
          y + 2,
          30,
          30
        );
      }catch(e){}
    }

    let textX = x + 36;
    let textY = y + 8;

    doc.setFontSize(11);
    doc.setFont(undefined, "bold");
    doc.text(p.nama, textX, textY, { maxWidth: colWidth - 38 });

    doc.setFont(undefined, "normal");
    doc.setFontSize(9);
    textY += 6;
    doc.text(`Kategori: ${p.kategori}`, textX, textY);

    textY += 5;
    doc.text(`Harga: Rp ${p.harga}`, textX, textY);

    textY += 5;
    doc.text(`Stok: ${p.stok}`, textX, textY);

    y += 62;
  });

  // ===== SIMPAN =====
  doc.save("katalog-produk-toko-enam-satu.pdf");
}

document.getElementById("btnTambahProduk")
  .addEventListener("click", tambahProduk, { passive: true });


/* PREVIEW GAMBAR EDIT */
editGambar.onchange = e => {
  const file = e.target.files[0];
  if(!file) return;

  const reader = new FileReader();
  reader.onload = () => {
    editPreview.src = reader.result;
    editPreview.style.display = "block";
  };
  reader.readAsDataURL(file);
};


elGambar.onchange = async (e) => {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();

  reader.onload = async () => {
    // resize agar ringan di HP
    const resized = await resizeImage(reader.result, 400);
    elPreview.src = resized;
    elPreview.classList.add("show");
  };

  reader.readAsDataURL(file);
};
document.addEventListener("DOMContentLoaded", ()=>{
  const tab = localStorage.getItem("tab_aktif") || "katalog";
  const btn = document.querySelector(`.bottom-nav button[data-tab="${tab}"]`);
  showTab(tab, btn);
  updateBadgeKeranjang();
});

// ===== AUTO LOGIN SAAT REFRESH =====
document.addEventListener("DOMContentLoaded", () => {
  const isLogin = localStorage.getItem("kasir_login");

  if(isLogin === "true"){
    elLogin.style.display = "none";
    elApp.style.display   = "block";

    tampilProduk();
    tampilLaporan();
  } else {
    elLogin.style.display = "flex";
    elApp.style.display   = "none";
  }
});
document.addEventListener("touchstart", e=>{
  startX = e.touches[0].clientX;
});

document.addEventListener("touchend", e=>{
  const endX = e.changedTouches[0].clientX;
  const diff = endX - startX;

  if(Math.abs(diff) < 80) return;

  const tabs = ["katalog","keranjang","laporan"];
  let current = localStorage.getItem("tab_aktif") || "katalog";
  let i = tabs.indexOf(current);

  if(diff < 0 && i < tabs.length-1) i++;
  if(diff > 0 && i > 0) i--;

  const btn = document.querySelector(`.bottom-nav button[data-tab="${tabs[i]}"]`);
  showTab(tabs[i], btn);
});