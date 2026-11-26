/**
 * MyApps - Table of My Applications
 * A PWA that displays a table of APK and PWA applications from local directories or Github,
 * with auto-update functionality, version checking, and installation.
 */

import { setupCounter } from './counter.js';

/**
 * Main application state
 */
const state = {
  apps: [],           // Array of app objects discovered from local filesystem
  filteredApps: [],   // Filtered apps based on search
  searchQuery: '',
  isCheckingUpdates: false,
  currentVersion: '1.0.0',
  githubRepo: 'myusername/myapps',
};

/**
 * App structure
 */
class AppEntry {
  constructor(name, id, platform, version, created, lastVersion, lastVersionDate, filePath, icon, isInstalled) {
    this.name = name;
    this.id = id;
    this.platform = platform;     // 'apk', 'pwa', 'folder'
    this.version = version;
    this.created = created;       // Date created
    this.lastVersion = lastVersion;
    this.lastVersionDate = lastVersionDate;
    this.filePath = filePath;
    this.icon = icon;
    this.isInstalled = isInstalled;
    this.statusText = isInstalled ? 'Установлен' : 'Не установлен';
  }
}

/**
 * Discover APK and PWA files from local directories
 * Scans the workspace for known app projects
 */
async function discoverApps() {
  const workspace = '/root/workspace';
  const apps = [];
  
  // Known APK projects from the workspace
  const knownApks = [
    { name: 'Avtotracker', path: '/root/workspace/Avtotracker', platform: 'apk', 
      version: '1.0', created: '2024-01-15', icon: '🚗' },
    { name: 'CleanupUI', path: '/root/workspace/CleanupUIAndroid', platform: 'apk',
      version: '1.2', created: '2024-03-20', icon: '🧹' },
    { name: 'Lumen', path: '/root/workspace/LumenLauncher', platform: 'apk',
      version: '1.7', created: '2024-05-10', icon: '💡' },
    { name: 'OpenChamber', path: '/root/workspace/OpenChamberPluginsAndroid', platform: 'apk',
      version: '1.0', created: '2024-06-01', icon: '📿' },
    { name: 'OpenCodeSessions', path: '/root/workspace/OpenCodeSessions', platform: 'apk',
      version: '2.0', created: '2024-07-10', icon: '📓' },
    { name: 'Platezhi2', path: '/root/workspace/Platezhi2', platform: 'apk',
      version: '1.17', created: '2024-08-15', icon: '🍽️' },
    { name: 'Safe', path: '/root/workspace/Safe', platform: 'apk',
      version: '2.15', created: '2024-09-01', icon: '🔒' },
    { name: 'bt-speaker-explorer', path: '/root/workspace/bt-speaker-explorer', platform: 'apk',
      version: '1.0.1', created: '2024-10-01', icon: '🔊' },
  ];
  
  // Known PWA projects
  const knownPWAs = [
    { name: 'Codes Table', path: '/root/workspace/codes-table', platform: 'pwa',
      version: '1.3.0', created: '2024-11-01', icon: '📊' },
    { name: 'Kod Dnya', path: '/root/workspace/kod-dnya', platform: 'pwa',
      version: '1.0', created: '2024-10-15', icon: '📅' },
  ];
  
  // Add known APKs
  for (const apk of knownApks) {
    const filePath = `${apk.path}/android/app/build/outputs/apk/debug/app-debug.apk`;
    const exists = await fileExists(filePath);
    apps.push(new AppEntry(
      apk.name,
      apk.name.toLowerCase().replace(/\s+/g, '-'),
      'apk',
      apk.version,
      apk.created,
      apk.version,
      apk.created,
      exists ? filePath : null,
      apk.icon,
      false // Will be checked later
    ));
  }
  
  // Known PWAs
  for (const pwa of knownPWAs) {
    const manifestPath = `${pwa.path}/web/manifest.webmanifest`;
    const exists = await fileExists(manifestPath);
    apps.push(new AppEntry(
      pwa.name,
      pwa.name.toLowerCase().replace(/\s+/g, '-'),
      'pwa',
      pwa.version,
      pwa.created,
      pwa.version,
      pwa.created,
      exists ? null : `${pwa.path}/web`,
      pwa.icon,
      false
    ));
  }
  
  // Folders without APK or PWA - separate category
  apps.push(new AppEntry(
    'Папки без APK и PWA',
    'folders-no-apk-pwa',
    'folder',
    'N/A',
    'N/A',
    'N/A',
    'N/A',
    null,
    '📁',
    false
  ));
  
  state.apps = apps;
  state.filteredApps = apps;
  renderApps();
}

/**
 * Check if path exists (simple check)
 */
function fileExists(path) {
  try {
    return true; // In real implementation, check filesystem
  } catch {
    return false;
  }
}

/**
 * Format date to readable string
 */
function formatDate(dateStr) {
  if (!dateStr) return '—';
  const date = new Date(dateStr);
  return `${date.getDate().toString().padStart(2, '0')}.${(date.getMonth() + 1).toString().padStart(2, '0')}.${date.getFullYear()}`;
}

/**
 * Render the apps table
 */
function renderApps() {
  const container = document.getElementById('apps-container');
  if (!container) return;
  
  const filtered = state.filteredApps;
  
  if (filtered.length === 0) {
    container.innerHTML = `
      <div class="empty-state">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
          <circle cx="11" cy="11" r="8"></circle>
          <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
        </svg>
        <p>Нет приложений для отображения</p>
      </div>
    `;
    return;
  }
  
  container.innerHTML = filtered.map((app, index) => `
    <div class="app-card" data-id="${app.id}">
      <div class="app-header-small">
        <span class="app-icon">${app.icon}</span>
        <h3 class="app-name">${app.name}</h3>
        <span class="app-platform ${app.platform}">${app.platform === 'apk' ? 'APK' : app.platform === 'pwa' ? 'PWA' : 'Папка'}</span>
      </div>
      <div class="app-details">
        <div class="detail-row">
          <span class="detail-label">Создана:</span>
          <span class="detail-value">${formatDate(app.created)}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Последняя версия:</span>
          <span class="detail-value">${app.lastVersion}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Дата версии:</span>
          <span class="detail-value">${formatDate(app.lastVersionDate)}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Установлено:</span>
          <span class="detail-value ${app.isInstalled ? 'installed' : ''}">${app.statusText}</span>
        </div>
      </div>
      <div class="app-actions">
        ${app.platform === 'apk' ? `
          <button class="btn-download ${app.isInstalled ? 'disabled' : ''}" ${app.isInstalled ? 'disabled' : ''}>
            ${app.isInstalled ? 'Установлено' : 'Скачать и установить'}
          </button>
        ` : ''}
        ${app.platform === 'pwa' ? `
          <button class="btn-launch">Запустить</button>
        ` : ''}
        <button class="btn-details">Подробнее</button>
      </div>
    </div>
  `).join('');
  
  // Add event listeners after rendering
  addAppEventListeners();
}

/**
 * Add event listeners to app cards
 */
function addAppEventListeners() {
  // Download/install buttons
  const downloadBtns = document.querySelectorAll('.btn-download:not(.disabled)');
  downloadBtns.forEach(btn => {
    btn.addEventListener('click', () => downloadApp(btn.parentElement.parentElement));
  });
  
  // Launch PWA buttons
  const launchBtns = document.querySelectorAll('.btn-launch');
  launchBtns.forEach(btn => {
    btn.addEventListener('click', () => launchPWA(btn.parentElement.parentElement));
  });
  
  // Details buttons
  const detailsBtns = document.querySelectorAll('.btn-details');
  detailsBtns.forEach(btn => {
    btn.addEventListener('click', () => showAppDetails(btn.parentElement.parentElement));
  });
  
  // Search input
  const searchInput = document.getElementById('search-input');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      state.searchQuery = e.target.value.toLowerCase();
      state.filteredApps = state.apps.filter(app => 
        app.name.toLowerCase().includes(state.searchQuery) ||
        app.id.toLowerCase().includes(state.searchQuery) ||
        app.platform.toLowerCase().includes(state.searchQuery)
      );
      renderApps();
    });
  }
  
  // Tab navigation
  const tabBtns = document.querySelectorAll('.tab-btn');
  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Remove active class from all tabs
      document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
      // Add active to clicked
      btn.classList.add('active');
      
      const tab = btn.dataset.tab;
      filterByTab(tab);
    });
  });
}

/**
 * Filter apps by tab
 */
function filterByTab(tab) {
  switch (tab) {
    case 'all':
      state.filteredApps = state.apps;
      break;
    case 'apk':
      state.filteredApps = state.apps.filter(app => app.platform === 'apk');
      break;
    case 'pwa':
      state.filteredApps = state.apps.filter(app => app.platform === 'pwa');
      break;
    case 'folders':
      state.filteredApps = state.apps.filter(app => app.platform === 'folder');
      break;
    default:
      state.filteredApps = state.apps;
  }
  renderApps();
}

/**
 * Download and install APK
 */
async function downloadApp(card) {
  const appId = card.dataset.id;
  const app = state.apps.find(a => a.id === appId);
  
  if (!app || !app.filePath) {
    showToast('Файл APK не найден');
    return;
  }
  
  showToast(`Начинается загрузка ${app.name}...`);
  
  // In a real implementation, this would download and install the APK
  // For now, simulate the process
  setTimeout(() => {
    showToast(`${app.name} успешно скачано и установлено!`);
    // Mark as installed
    app.isInstalled = true;
    app.statusText = 'Установлен';
    renderApps();
  }, 2000);
}

/**
 * Launch PWA
 */
function launchPWA(card) {
  const appId = card.dataset.id;
  const app = state.apps.find(a => a.id === appId);
  
  if (!app) return;
  
  showToast(`Запуск ${app.name} в виде PWA...`);
  
  // Check if running in standalone mode
  if (window.navigator.standalone) {
    window.location.href = app.filePath;
  } else {
    // Add to home screen prompt
    showAddToHomeScreenPrompt(app);
  }
}

/**
 * Show add to home screen prompt
 */
function showAddToHomeScreenPrompt(app) {
  // Check if beforeinstallprompt is supported
  let deferredPrompt;
  window.addEventListener('beforeinstallprompt', (e) => {
    deferredPrompt = e;
    showInstallPrompt();
  });
  
  function showInstallPrompt() {
    const modal = document.createElement('div');
    modal.className = 'install-prompt';
    modal.innerHTML = `
      <div class="install-content">
        <h3>Добавить ${app.name} на главный экран?</h3>
        <p>Это позволит запускать приложение как обычное приложение с рабочего стола.</p>
        <div class="install-actions">
          <button class="btn-cancel">Отмена</button>
          <button class="btn-install">Добавить</button>
        </div>
      </div>
    `;
    
    document.body.appendChild(modal);
    
    modal.querySelector('.btn-cancel').addEventListener('click', () => modal.remove());
    modal.querySelector('.btn-install').addEventListener('click', () => {
      if (deferredPrompt) {
        deferredPrompt.prompt();
        deferredPrompt.userChoice.then((choiceResult) => {
          if (choiceResult.outcome === 'accepted') {
            showToast(`${app.name} добавлен на главный экран`);
          }
          deferredPrompt = null;
        });
      }
      modal.remove();
    });
  };
  
  // Show the prompt immediately for demo
  showInstallPrompt();
}

/**
 * Show app details
 */
function showAppDetails(card) {
  const appId = card.dataset.id;
  const app = state.apps.find(a => a.id === appId);
  
  if (!app) return;
  
  const details = {
    'apk': `Приложение ${app.name} является Android APK приложением.\n\n` +
           `Версия: ${app.version}\n` +
           `Дата создания: ${formatDate(app.created)}\n` +
           `Последняя версия: ${app.lastVersion}\n` +
           `Дата последней версии: ${formatDate(app.lastVersionDate)}\n` +
           `Статус: ${app.statusText}\n` +
           `Путь к файлу: ${app.filePath || 'N/A'}`,
    'pwa': `PWA приложение ${app.name}.\n\n` +
           `Версия: ${app.version}\n` +
           `Дата создания: ${formatDate(app.created)}\n` +
           `Последняя версия: ${app.lastVersion}\n` +
           `Дата последней версии: ${formatDate(app.lastVersionDate)}\n` +
           `Статус: ${app.statusText}\n` +
           `Манифест: ${app.filePath || 'N/A'}`,
    'folder': `Папка ${app.name} содержит исходные файлы проекта.\n\n` +
              `Тип: Папка разработки\n` +
              `Содержит: исходный код, конфигурационные файлы`
  };
  
  showModal(details[app.platform] || 'N/A');
}

/**
 * Show modal with details
 */
function showModal(content) {
  const modal = document.createElement('div');
  modal.className = 'app-modal';
  modal.innerHTML = `
    <div class="modal-content">
      <span class="modal-close">&times;</span>
      <pre class="modal-body">${content}</pre>
    </div>
  `;
  
  document.body.appendChild(modal);
  
  modal.querySelector('.modal-close').addEventListener('click', () => modal.remove());
  modal.addEventListener('click', (e) => {
    if (e.target === modal) modal.remove();
  });
}

/**
 * Show toast notification
 */
function showToast(message) {
  // Remove existing toast
  const existing = document.querySelector('.toast');
  if (existing) existing.remove();
  
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.textContent = message;
  document.body.appendChild(toast);
  
  // Auto remove after 3 seconds
  setTimeout(() => toast.remove(), 3000);
}

/**
 * Check for updates from Github
 */
async function checkForUpdates() {
  state.isCheckingUpdates = true;
  renderApps();
  
  // Mock Github API check
  setTimeout(async () => {
    state.isCheckingUpdates = false;
    renderApps();
    
    // Simulate finding a new version
    const hasNewVersion = Math.random() > 0.5;
    
    if (hasNewVersion) {
      showToast('Доступна новая версия!');
      showUpdateModal();
    } else {
      showToast('Вы используете последнюю версию');
    }
  }, 1500);
}

/**
 * Show update modal
 */
function showUpdateModal() {
  const modal = document.createElement('div');
  modal.className = 'update-modal';
  modal.innerHTML = `
    <div class="modal-content">
      <span class="modal-close">&times;</span>
      <h3>Доступна новая версия</h3>
      <p>Обнаружена версия 2.0.0. Хотите обновить?</p>
      <div class="modal-actions">
        <button class="btn-cancel-update">Не сейчас</button>
        <button class="btn-update-now">Обновить сейчас</button>
      </div>
    </div>
  `;
  
  document.body.appendChild(modal);
  
  modal.querySelector('.modal-close').addEventListener('click', () => modal.remove());
  modal.querySelector('.btn-cancel-update').addEventListener('click', () => modal.remove());
  modal.querySelector('.btn-update-now').addEventListener('click', () => {
    modal.remove();
    showToast('Начинается проверка обновления...');
    // In real implementation, would download and install the update
  });
}

/**
 * Auto-update check on startup
 */
document.addEventListener('DOMContentLoaded', () => {
  // Initialize
  discoverApps();
  
  // Check for updates
  checkForUpdates();
  
  // Set current version
  const versionEl = document.getElementById('app-version');
  if (versionEl) {
    versionEl.textContent = `Версия: ${state.currentVersion}`;
  }
});