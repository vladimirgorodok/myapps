(function(){let e=document.createElement(`link`).relList;if(e&&e.supports&&e.supports(`modulepreload`))return;for(let e of document.querySelectorAll(`link[rel="modulepreload"]`))n(e);new MutationObserver(e=>{for(let t of e)if(t.type===`childList`)for(let e of t.addedNodes)e.tagName===`LINK`&&e.rel===`modulepreload`&&n(e)}).observe(document,{childList:!0,subtree:!0});function t(e){let t={};return e.integrity&&(t.integrity=e.integrity),e.referrerPolicy&&(t.referrerPolicy=e.referrerPolicy),t.credentials=e.crossOrigin===`use-credentials`?`include`:e.crossOrigin===`anonymous`?`omit`:`same-origin`,t}function n(e){if(e.ep)return;e.ep=!0;let n=t(e);fetch(e.href,n)}})();var e={apps:[],filteredApps:[],searchQuery:``,isCheckingUpdates:!1,currentVersion:`1.0.0`,githubRepo:`myusername/myapps`},t=class{constructor(e,t,n,r,i,a,o,s,c,l){this.name=e,this.id=t,this.platform=n,this.version=r,this.created=i,this.lastVersion=a,this.lastVersionDate=o,this.filePath=s,this.icon=c,this.isInstalled=l,this.statusText=l?`Установлен`:`Не установлен`}};async function n(){let n=[],i=[{name:`Avtotracker`,path:`/root/workspace/Avtotracker`,platform:`apk`,version:`1.0`,created:`2024-01-15`,icon:`🚗`},{name:`CleanupUI`,path:`/root/workspace/CleanupUIAndroid`,platform:`apk`,version:`1.2`,created:`2024-03-20`,icon:`🧹`},{name:`Lumen`,path:`/root/workspace/LumenLauncher`,platform:`apk`,version:`1.7`,created:`2024-05-10`,icon:`💡`},{name:`OpenChamber`,path:`/root/workspace/OpenChamberPluginsAndroid`,platform:`apk`,version:`1.0`,created:`2024-06-01`,icon:`📿`},{name:`OpenCodeSessions`,path:`/root/workspace/OpenCodeSessions`,platform:`apk`,version:`2.0`,created:`2024-07-10`,icon:`📓`},{name:`Platezhi2`,path:`/root/workspace/Platezhi2`,platform:`apk`,version:`1.17`,created:`2024-08-15`,icon:`🍽️`},{name:`Safe`,path:`/root/workspace/Safe`,platform:`apk`,version:`2.15`,created:`2024-09-01`,icon:`🔒`},{name:`bt-speaker-explorer`,path:`/root/workspace/bt-speaker-explorer`,platform:`apk`,version:`1.0.1`,created:`2024-10-01`,icon:`🔊`}],o=[{name:`Codes Table`,path:`/root/workspace/codes-table`,platform:`pwa`,version:`1.3.0`,created:`2024-11-01`,icon:`📊`},{name:`Kod Dnya`,path:`/root/workspace/kod-dnya`,platform:`pwa`,version:`1.0`,created:`2024-10-15`,icon:`📅`}];for(let e of i){let i=`${e.path}/android/app/build/outputs/apk/debug/app-debug.apk`,a=await r(i);n.push(new t(e.name,e.name.toLowerCase().replace(/\s+/g,`-`),`apk`,e.version,e.created,e.version,e.created,a?i:null,e.icon,!1))}for(let e of o){let i=await r(`${e.path}/web/manifest.webmanifest`);n.push(new t(e.name,e.name.toLowerCase().replace(/\s+/g,`-`),`pwa`,e.version,e.created,e.version,e.created,i?null:`${e.path}/web`,e.icon,!1))}n.push(new t(`Папки без APK и PWA`,`folders-no-apk-pwa`,`folder`,`N/A`,`N/A`,`N/A`,`N/A`,null,`📁`,!1)),e.apps=n,e.filteredApps=n,a()}function r(e){try{return!0}catch{return!1}}function i(e){if(!e)return`—`;let t=new Date(e);return`${t.getDate().toString().padStart(2,`0`)}.${(t.getMonth()+1).toString().padStart(2,`0`)}.${t.getFullYear()}`}function a(){let t=document.getElementById(`apps-container`);if(!t)return;let n=e.filteredApps;n.length===0?t.innerHTML=`
      <div class="empty-state">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
          <circle cx="11" cy="11" r="8"></circle>
          <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
        </svg>
        <p>Нет приложений для отображения</p>
      </div>
    `:(t.innerHTML=n.map((e,t)=>`
    <div class="app-card" data-id="${e.id}">
      <div class="app-header-small">
        <span class="app-icon">${e.icon}</span>
        <h3 class="app-name">${e.name}</h3>
        <span class="app-platform ${e.platform}">${e.platform===`apk`?`APK`:e.platform===`pwa`?`PWA`:`Папка`}</span>
      </div>
      <div class="app-details">
        <div class="detail-row">
          <span class="detail-label">Создана:</span>
          <span class="detail-value">${i(e.created)}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Последняя версия:</span>
          <span class="detail-value">${e.lastVersion}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Дата версии:</span>
          <span class="detail-value">${i(e.lastVersionDate)}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Установлено:</span>
          <span class="detail-value ${e.isInstalled?`installed`:``}">${e.statusText}</span>
        </div>
      </div>
      <div class="app-actions">
        ${e.platform===`apk`?`
          <button class="btn-download ${e.isInstalled?`disabled`:``}" ${e.isInstalled?`disabled`:``}>
            ${e.isInstalled?`Установлено`:`Скачать и установить`}
          </button>
        `:``}
        ${e.platform===`pwa`?`
          <button class="btn-launch">Запустить</button>
        `:``}
        <button class="btn-details">Подробнее</button>
      </div>
    </div>
  `).join(``),o())}function o(){document.querySelectorAll(`.btn-download:not(.disabled)`).forEach(e=>{e.addEventListener(`click`,()=>c(e.parentElement.parentElement))}),document.querySelectorAll(`.btn-launch`).forEach(e=>{e.addEventListener(`click`,()=>l(e.parentElement.parentElement))}),document.querySelectorAll(`.btn-details`).forEach(e=>{e.addEventListener(`click`,()=>d(e.parentElement.parentElement))});let t=document.getElementById(`search-input`);t&&t.addEventListener(`input`,t=>{e.searchQuery=t.target.value.toLowerCase(),e.filteredApps=e.apps.filter(t=>t.name.toLowerCase().includes(e.searchQuery)||t.id.toLowerCase().includes(e.searchQuery)||t.platform.toLowerCase().includes(e.searchQuery)),a()}),document.querySelectorAll(`.tab-btn`).forEach(e=>{e.addEventListener(`click`,()=>{document.querySelectorAll(`.tab-btn`).forEach(e=>e.classList.remove(`active`)),e.classList.add(`active`),s(e.dataset.tab)})})}function s(t){switch(t){case`all`:e.filteredApps=e.apps;break;case`apk`:e.filteredApps=e.apps.filter(e=>e.platform===`apk`);break;case`pwa`:e.filteredApps=e.apps.filter(e=>e.platform===`pwa`);break;case`folders`:e.filteredApps=e.apps.filter(e=>e.platform===`folder`);break;default:e.filteredApps=e.apps}a()}async function c(t){let n=t.dataset.id,r=e.apps.find(e=>e.id===n);!r||!r.filePath?p(`Файл APK не найден`):(p(`Начинается загрузка ${r.name}...`),setTimeout(()=>{p(`${r.name} успешно скачано и установлено!`),r.isInstalled=!0,r.statusText=`Установлен`,a()},2e3))}function l(t){let n=t.dataset.id,r=e.apps.find(e=>e.id===n);r&&(p(`Запуск ${r.name} в виде PWA...`),window.navigator.standalone?window.location.href=r.filePath:u(r))}function u(e){let t;window.addEventListener(`beforeinstallprompt`,e=>{t=e,n()});function n(){let n=document.createElement(`div`);n.className=`install-prompt`,n.innerHTML=`
      <div class="install-content">
        <h3>Добавить ${e.name} на главный экран?</h3>
        <p>Это позволит запускать приложение как обычное приложение с рабочего стола.</p>
        <div class="install-actions">
          <button class="btn-cancel">Отмена</button>
          <button class="btn-install">Добавить</button>
        </div>
      </div>
    `,document.body.appendChild(n),n.querySelector(`.btn-cancel`).addEventListener(`click`,()=>n.remove()),n.querySelector(`.btn-install`).addEventListener(`click`,()=>{t&&(t.prompt(),t.userChoice.then(n=>{n.outcome===`accepted`&&p(`${e.name} добавлен на главный экран`),t=null})),n.remove()})}n()}function d(t){let n=t.dataset.id,r=e.apps.find(e=>e.id===n);r&&f({apk:`Приложение ${r.name} является Android APK приложением.\n\nВерсия: ${r.version}\nДата создания: ${i(r.created)}\nПоследняя версия: ${r.lastVersion}\nДата последней версии: ${i(r.lastVersionDate)}\nСтатус: ${r.statusText}\nПуть к файлу: ${r.filePath||`N/A`}`,pwa:`PWA приложение ${r.name}.\n\nВерсия: ${r.version}\nДата создания: ${i(r.created)}\nПоследняя версия: ${r.lastVersion}\nДата последней версии: ${i(r.lastVersionDate)}\nСтатус: ${r.statusText}\nМанифест: ${r.filePath||`N/A`}`,folder:`Папка ${r.name} содержит исходные файлы проекта.\n\nТип: Папка разработки\nСодержит: исходный код, конфигурационные файлы`}[r.platform]||`N/A`)}function f(e){let t=document.createElement(`div`);t.className=`app-modal`,t.innerHTML=`
    <div class="modal-content">
      <span class="modal-close">&times;</span>
      <pre class="modal-body">${e}</pre>
    </div>
  `,document.body.appendChild(t),t.querySelector(`.modal-close`).addEventListener(`click`,()=>t.remove()),t.addEventListener(`click`,e=>{e.target===t&&t.remove()})}function p(e){let t=document.querySelector(`.toast`);t&&t.remove();let n=document.createElement(`div`);n.className=`toast`,n.textContent=e,document.body.appendChild(n),setTimeout(()=>n.remove(),3e3)}async function m(){e.isCheckingUpdates=!0,a(),setTimeout(async()=>{e.isCheckingUpdates=!1,a(),Math.random()>.5?(p(`Доступна новая версия!`),h()):p(`Вы используете последнюю версию`)},1500)}function h(){let e=document.createElement(`div`);e.className=`update-modal`,e.innerHTML=`
    <div class="modal-content">
      <span class="modal-close">&times;</span>
      <h3>Доступна новая версия</h3>
      <p>Обнаружена версия 2.0.0. Хотите обновить?</p>
      <div class="modal-actions">
        <button class="btn-cancel-update">Не сейчас</button>
        <button class="btn-update-now">Обновить сейчас</button>
      </div>
    </div>
  `,document.body.appendChild(e),e.querySelector(`.modal-close`).addEventListener(`click`,()=>e.remove()),e.querySelector(`.btn-cancel-update`).addEventListener(`click`,()=>e.remove()),e.querySelector(`.btn-update-now`).addEventListener(`click`,()=>{e.remove(),p(`Начинается проверка обновления...`)})}document.addEventListener(`DOMContentLoaded`,()=>{n(),m();let t=document.getElementById(`app-version`);t&&(t.textContent=`Версия: ${e.currentVersion}`)});