// ============================================================
//  SITTA – Script Utama
//  Universitas Terbuka – Tugas Praktik 1 STSI4209
// ============================================================

/* ── Auth Helpers ─────────────────────────────────────────── */
function getSession() {
  try { return JSON.parse(sessionStorage.getItem('sitta_user')); } catch { return null; }
}
function setSession(user) {
  sessionStorage.setItem('sitta_user', JSON.stringify(user));
}
function clearSession() {
  sessionStorage.removeItem('sitta_user');
}
function requireAuth() {
  if (!getSession()) {
    window.location.href = 'index.html';
    return false;
  }
  return true;
}

/* ── Navbar Helper ────────────────────────────────────────── */
function renderNavbar(activePage) {
  const user = getSession();
  const initials = user ? user.nama.split(' ').map(w => w[0]).join('').slice(0,2).toUpperCase() : 'UT';
  const namaUser = user ? user.nama : '';
  const roleUser = user ? user.role : '';

  const nav = document.getElementById('navbar');
  if (!nav) return;
  nav.innerHTML = `
    <div class="navbar-brand">
      <div class="logo-circle">UT</div>
      <div>
        <span>SITTA</span><br>
        <small>Sistem Informasi Tiras & Transaksi Bahan Ajar</small>
      </div>
    </div>
    <ul class="nav-links">
      <li><a href="dashboard.html" class="${activePage==='dashboard'?'active':''}">🏠 Dashboard</a></li>
      <li><a href="stok.html" class="${activePage==='stok'?'active':''}">📦 Informasi Bahan Ajar</a></li>
      <li><a href="tracking.html" class="${activePage==='tracking'?'active':''}">🚚 Tracking Pengiriman</a></li>
      <li style="position:relative">
        <button class="nav-btn" onclick="toggleDropdown(this)">📊 Laporan ▾</button>
        <div class="dropdown-menu" id="laporanDropdown">
          <a href="laporan.html?tab=monitoring">📈 Monitoring Progress DO Bahan Ajar</a>
          <a href="laporan.html?tab=rekap">📋 Rekap Bahan Ajar</a>
        </div>
      </li>
      <li><a href="histori.html" class="${activePage==='histori'?'active':''}">🕐 Histori Transaksi</a></li>
    </ul>
    <div class="nav-user">
      <div class="avatar">${initials}</div>
      <div style="line-height:1.3">
        <div style="font-weight:600;font-size:13px">${namaUser}</div>
        <div style="font-size:11px;opacity:.7">${roleUser}</div>
      </div>
      <button class="btn-logout" onclick="logout()">Keluar</button>
    </div>
  `;
}

function toggleDropdown(btn) {
  const d = document.getElementById('laporanDropdown');
  if (d) d.style.display = d.style.display === 'block' ? 'none' : 'block';
}

function logout() {
  clearSession();
  window.location.href = 'index.html';
}

/* ── Greeting Helper ──────────────────────────────────────── */
function getGreeting() {
  const h = new Date().getHours();
  if (h >= 4  && h < 11) return { sapa: 'Selamat Pagi',  emoji: '🌤️',  sub: 'Semoga hari Anda produktif!' };
  if (h >= 11 && h < 15) return { sapa: 'Selamat Siang', emoji: '☀️',  sub: 'Jangan lupa istirahat sejenak.' };
  if (h >= 15 && h < 19) return { sapa: 'Selamat Sore',  emoji: '🌇', sub: 'Semangat menyelesaikan pekerjaan!' };
  return                         { sapa: 'Selamat Malam', emoji: '🌙', sub: 'Tetap semangat bekerja malam ini!' };
}

/* ── Modal Helpers ─────────────────────────────────────────── */
function openModal(id)  { const m = document.getElementById(id); if(m) m.classList.add('open'); }
function closeModal(id) { const m = document.getElementById(id); if(m) m.classList.remove('open'); }

/* ── Alert Helpers ─────────────────────────────────────────── */
function showAlert(id, msg, type='error') {
  const el = document.getElementById(id);
  if (!el) return;
  el.className = `alert alert-${type} show`;
  el.innerHTML = (type==='error'?'❌ ':type==='success'?'✅ ':'ℹ️ ') + msg;
  if (type !== 'error') setTimeout(() => el.classList.remove('show'), 4000);
}
function hideAlert(id) {
  const el = document.getElementById(id);
  if (el) el.classList.remove('show');
}

/* ── Format Tanggal ────────────────────────────────────────── */
function formatTanggal(str) {
  if (!str) return '-';
  const d = new Date(str);
  return d.toLocaleDateString('id-ID', { day:'2-digit', month:'long', year:'numeric' });
}
function formatWaktu(str) {
  if (!str) return '-';
  const [date, time] = str.split(' ');
  const d = new Date(date + 'T' + time);
  return d.toLocaleDateString('id-ID', { day:'2-digit', month:'short', year:'numeric' })
       + ' · ' + (time || '');
}

/* ── Close modal on overlay click ─────────────────────────── */
document.addEventListener('click', function(e) {
  if (e.target.classList.contains('modal-overlay')) {
    e.target.classList.remove('open');
  }
});
