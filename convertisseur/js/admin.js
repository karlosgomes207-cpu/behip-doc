/**
 * Admin – Gestionnaire de publicité
 * BeHip convertisseur-video-mpquality
 * Offres marketing + emplacements publicitaires (localStorage)
 */

(function () {
  'use strict';

  const STORAGE_OFFERS = 'behip_admin_offers';
  const STORAGE_SLOTS = 'behip_admin_slots';
  const STORAGE_PASSWORD = 'behip_admin_password';
  const SESSION_AUTH = 'behip_admin_auth';
  const DEFAULT_PASSWORD = 'behip2025';

  const adminLogin = document.getElementById('adminLogin');
  const adminDashboard = document.getElementById('adminDashboard');
  const loginForm = document.getElementById('loginForm');
  const adminPasswordInput = document.getElementById('adminPassword');
  const loginError = document.getElementById('loginError');
  const btnLogout = document.getElementById('btnLogout');
  const offerForm = document.getElementById('offerForm');
  const offersBody = document.getElementById('offersBody');
  const slotForm = document.getElementById('slotForm');
  const slotsList = document.getElementById('slotsList');
  const btnExport = document.getElementById('btnExport');
  const newAdminPassword = document.getElementById('newAdminPassword');
  const btnSavePassword = document.getElementById('btnSavePassword');

  function getPassword() {
    return localStorage.getItem(STORAGE_PASSWORD) || DEFAULT_PASSWORD;
  }

  function setPassword(pwd) {
    if (pwd && pwd.trim()) localStorage.setItem(STORAGE_PASSWORD, pwd.trim());
  }

  function isAuthenticated() {
    return sessionStorage.getItem(SESSION_AUTH) === '1';
  }

  function setAuthenticated(ok) {
    if (ok) sessionStorage.setItem(SESSION_AUTH, '1');
    else sessionStorage.removeItem(SESSION_AUTH);
  }

  function checkAuth() {
    if (isAuthenticated()) {
      adminLogin.hidden = true;
      adminDashboard.hidden = false;
      loadOffers();
      loadSlots();
      return;
    }
    adminLogin.hidden = false;
    adminDashboard.hidden = true;
  }

  loginForm.addEventListener('submit', function (e) {
    e.preventDefault();
    const pwd = adminPasswordInput.value.trim();
    const expected = getPassword();
    loginError.textContent = '';
    if (pwd === expected) {
      setAuthenticated(true);
      adminPasswordInput.value = '';
      adminLogin.hidden = true;
      adminDashboard.hidden = false;
      loadOffers();
      loadSlots();
    } else {
      loginError.textContent = 'Mot de passe incorrect.';
    }
  });

  btnLogout.addEventListener('click', function () {
    setAuthenticated(false);
    checkAuth();
  });

  /* ----- Offres ----- */
  function getOffers() {
    try {
      const raw = localStorage.getItem(STORAGE_OFFERS);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  }

  function saveOffers(offers) {
    localStorage.setItem(STORAGE_OFFERS, JSON.stringify(offers));
  }

  function loadOffers() {
    const offers = getOffers();
    offersBody.innerHTML = '';
    if (offers.length === 0) {
      offersBody.innerHTML = '<tr><td colspan="6" class="text-muted">Aucune offre pour le moment.</td></tr>';
      return;
    }
    offers.forEach(function (o, i) {
      const tr = document.createElement('tr');
      const date = o.date ? new Date(o.date).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' }) : '–';
      tr.innerHTML =
        '<td>' + escapeHtml(date) + '</td>' +
        '<td>' + escapeHtml(o.contact || '–') + '</td>' +
        '<td>' + escapeHtml(o.company || '–') + '</td>' +
        '<td>' + escapeHtml(o.description || '–') + '</td>' +
        '<td><span class="status-badge ' + escapeHtml(o.status || 'nouveau') + '">' + escapeHtml(o.status || 'nouveau') + '</span></td>' +
        '<td><button type="button" class="btn-delete" data-index="' + i + '" aria-label="Supprimer">×</button></td>';
      offersBody.appendChild(tr);
    });
    offersBody.querySelectorAll('.btn-delete').forEach(function (btn) {
      btn.addEventListener('click', function () {
        const idx = parseInt(btn.getAttribute('data-index'), 10);
        const list = getOffers();
        list.splice(idx, 1);
        saveOffers(list);
        loadOffers();
      });
    });
  }

  function escapeHtml(s) {
    if (s == null) return '';
    const div = document.createElement('div');
    div.textContent = s;
    return div.innerHTML;
  }

  offerForm.addEventListener('submit', function (e) {
    e.preventDefault();
    const contact = document.getElementById('offerContact').value.trim();
    const company = document.getElementById('offerCompany').value.trim();
    const description = document.getElementById('offerDescription').value.trim();
    const status = document.getElementById('offerStatus').value;
    if (!contact) return;
    const offers = getOffers();
    offers.unshift({
      date: new Date().toISOString(),
      contact: contact,
      company: company,
      description: description,
      status: status,
    });
    saveOffers(offers);
    document.getElementById('offerContact').value = '';
    document.getElementById('offerCompany').value = '';
    document.getElementById('offerDescription').value = '';
    document.getElementById('offerStatus').value = 'nouveau';
    loadOffers();
  });

  /* ----- Slots ----- */
  function getSlots() {
    try {
      const raw = localStorage.getItem(STORAGE_SLOTS);
      if (raw) return JSON.parse(raw);
      return [{ id: '1', name: 'Bandeau bas', size: '300×100', status: 'disponible', notes: 'Emplacement principal (AdSense)' }];
    } catch {
      return [{ id: '1', name: 'Bandeau bas', size: '300×100', status: 'disponible', notes: '' }];
    }
  }

  function saveSlots(slots) {
    localStorage.setItem(STORAGE_SLOTS, JSON.stringify(slots));
  }

  function loadSlots() {
    const slots = getSlots();
    slotsList.innerHTML = '';
    slots.forEach(function (s, i) {
      const card = document.createElement('div');
      card.className = 'slot-card';
      card.innerHTML =
        '<div class="slot-info">' +
        '<p class="slot-name">' + escapeHtml(s.name || 'Sans nom') + '</p>' +
        '<p class="slot-meta">' + escapeHtml(s.size || '') + ' – ' + escapeHtml(s.status || '') + (s.notes ? ' · ' + escapeHtml(s.notes) : '') + '</p>' +
        '</div>' +
        '<button type="button" class="btn-delete-slot" data-index="' + i + '" aria-label="Supprimer">Supprimer</button>';
      slotsList.appendChild(card);
    });
    slotsList.querySelectorAll('.btn-delete-slot').forEach(function (btn) {
      btn.addEventListener('click', function () {
        const idx = parseInt(btn.getAttribute('data-index'), 10);
        const list = getSlots();
        list.splice(idx, 1);
        saveSlots(list);
        loadSlots();
      });
    });
  }

  slotForm.addEventListener('submit', function (e) {
    e.preventDefault();
    const name = document.getElementById('slotName').value.trim();
    const size = document.getElementById('slotSize').value.trim();
    const status = document.getElementById('slotStatus').value;
    const notes = document.getElementById('slotNotes').value.trim();
    if (!name) return;
    const slots = getSlots();
    slots.push({
      id: Date.now().toString(),
      name: name,
      size: size || '–',
      status: status,
      notes: notes,
    });
    saveSlots(slots);
    document.getElementById('slotName').value = '';
    document.getElementById('slotSize').value = '';
    document.getElementById('slotStatus').value = 'disponible';
    document.getElementById('slotNotes').value = '';
    loadSlots();
  });

  /* ----- Export ----- */
  btnExport.addEventListener('click', function () {
    const data = { offers: getOffers(), slots: getSlots(), exportedAt: new Date().toISOString() };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'behip-admin-export-' + new Date().toISOString().slice(0, 10) + '.json';
    a.click();
    URL.revokeObjectURL(a.href);
  });

  /* ----- Mot de passe ----- */
  btnSavePassword.addEventListener('click', function () {
    const pwd = newAdminPassword.value.trim();
    if (pwd) {
      setPassword(pwd);
      newAdminPassword.value = '';
      alert('Mot de passe admin enregistré.');
    }
  });

  checkAuth();
})();
