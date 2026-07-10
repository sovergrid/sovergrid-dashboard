/**
 * SoverGrid Shared Nav Injector — sg-nav.js
 *
 * Reads sg_mode from localStorage and injects the correct sidebar nav
 * into #sidebar-nav. Also updates the mode label in the footer.
 * Also handles sidebar collapse persistence and the toggle arrow.
 *
 * Usage: include this script at the bottom of every dashboard page.
 * The page must have:
 *   - <nav id="sidebar-nav"></nav>
 *   - <div id="mode-label"></div>
 *   - <button id="sidebar-toggle-btn" class="sidebar-toggle" onclick="toggleSidebar()">
 *   - <div id="sidebar" class="sidebar">
 *
 * Pass the active page name via: window.SG_ACTIVE_PAGE = 'billing';
 */

window.toggleSidebar = function () {
  const s = document.getElementById('sidebar');
  if (!s) return;
  const c = s.classList.toggle('collapsed');
  localStorage.setItem('sg_sidebar_collapsed', c ? '1' : '0');
  const btn = document.getElementById('sidebar-toggle-btn');
  if (btn) btn.style.transform = c ? 'rotate(180deg)' : '';
};

(function () {
  // ── Sidebar collapse persistence ────────────────────────────────────────────
  const sidebar = document.getElementById('sidebar');
  const toggleBtn = document.getElementById('sidebar-toggle-btn');
  const collapsed = localStorage.getItem('sg_sidebar_collapsed') === '1';
  if (sidebar && collapsed) sidebar.classList.add('collapsed');
  if (toggleBtn && collapsed) toggleBtn.style.transform = 'rotate(180deg)';

  // Toggle sidebar when clicking anywhere in empty space
  if (sidebar) {
    sidebar.addEventListener('click', function(e) {
      // Ignore if clicking the toggle button itself, or any links/buttons
      if (e.target.closest('button') || e.target.closest('a')) return;
      
      if (typeof toggleSidebar === 'function') {
        toggleSidebar();
      }
    });
  }

  const active = window.SG_ACTIVE_PAGE || '';

  // Auto-detect mode based on active page to prevent mismatches if opened directly
  const devPages = ['deployments-dev', 'containers', 'monitoring', 'apikeys', 'cli'];
  const consPages = ['myapps'];
  
  // Check URL params first to support file:/// navigation state persistence
  const urlParams = new URLSearchParams(window.location.search);
  const urlMode = urlParams.get('mode');
  
  if (urlMode) {
    localStorage.setItem('sg_mode', urlMode);
  } else if (devPages.includes(active)) {
    localStorage.setItem('sg_mode', 'developer');
  } else if (consPages.includes(active)) {
    localStorage.setItem('sg_mode', 'consumer');
  }

  const mode = localStorage.getItem('sg_mode') || 'consumer';
  const nav = document.getElementById('sidebar-nav');
  const modeLabel = document.getElementById('mode-label');

  if (modeLabel) {
    if (mode === 'developer') {
      modeLabel.textContent = 'Developer';
      modeLabel.style.color = '#7C3AED';
      modeLabel.style.fontWeight = '600';
    } else {
      modeLabel.textContent = 'Consumer';
      modeLabel.style.color = '';
      modeLabel.style.fontWeight = '';
    }
  }

  if (!nav) return;

  // ── Icon helpers ────────────────────────────────────────────────────────────
  function icon(path) {
    return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16">${path}</svg>`;
  }

  const ICONS = {
    deployments: icon('<rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M9 21V9"/>'),
    containers:  icon('<rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>'),
    dns:         icon('<circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>'),
    monitoring:  icon('<polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>'),
    apikeys:     icon('<path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4"/>'),
    cli:         icon('<polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/>'),
    billing:     icon('<rect x="2" y="5" width="20" height="14" rx="2"/><path d="M2 10h20"/>'),
    settings:    icon('<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>'),
    myapps:      icon('<rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/>'),
  };

  function navItem(href, iconKey, label, pageKey) {
    const isActive = active === pageKey ? ' active' : '';
    // Append mode to href for local file testing
    const hrefWithMode = href.includes('?') ? `${href}&mode=${mode}` : `${href}?mode=${mode}`;
    return `<a href="${hrefWithMode}" class="nav-item${isActive}">${ICONS[iconKey]}<span class="nav-item-label">${label}</span></a>`;
  }

  function section(title) {
    return `<div class="nav-category">${title}</div>`;
  }

  // ── Developer nav ─────────────────────────────────────────────────────────
  if (mode === 'developer') {
    nav.innerHTML = `
      ${section('Compute')}
      ${navItem('developer.html',  'myapps',      'Deployments',     'deployments-dev')}
      ${navItem('containers.html', 'containers',  'Container Groups', 'containers')}
      ${section('Networking')}
      ${navItem('dns.html',        'dns',         'Domains & DNS',   'dns')}
      ${navItem('monitoring.html', 'monitoring',  'Monitoring',      'monitoring')}
      ${section('Developer')}
      ${navItem('apikeys.html',    'apikeys',     'API Keys',        'apikeys')}
      ${navItem('cli-setup.html',  'cli',         'CLI Setup',       'cli')}
      ${section('Account')}
      ${navItem('billing.html',    'billing',     'Billing',         'billing')}
      ${navItem('settings.html', 'settings', 'Settings',  'settings')}
    `;
  } else {
    // ── Consumer nav ────────────────────────────────────────────────────────
    nav.innerHTML = `
      ${navItem('deployments.html',       'deployments', 'My Apps', 'myapps')}
      ${navItem('dns.html',               'dns',         'Domains & DNS', 'dns')}
      ${navItem('billing.html',           'billing',     'Billing', 'billing')}
      ${navItem('settings.html', 'settings',   'Settings','settings')}
    `;
  }

  // Expand sidebar if clicking ANY icon while collapsed
  const allLinks = nav.querySelectorAll('a.nav-item');
  allLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      if (sidebar && sidebar.classList.contains('collapsed')) {
        e.preventDefault(); // Don't reload the page, just expand
        if (typeof toggleSidebar === 'function') toggleSidebar();
      }
    });
  });
})();
