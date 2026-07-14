// components.js

function updateDateTime() {
  const dateEl = document.getElementById('currentDate');
  const timeEl = document.getElementById('currentTime');
  if (!dateEl || !timeEl) return;

  const now = new Date();
  dateEl.textContent = now.toLocaleDateString('en-US', {
    weekday: 'short', year: 'numeric', month: 'short', day: 'numeric'
  });

  let h = now.getHours();
  const m = String(now.getMinutes()).padStart(2, '0');
  const s = String(now.getSeconds()).padStart(2, '0');
  const ap = h >= 12 ? 'PM' : 'AM';
  h = h % 12 || 12;
  timeEl.textContent = `${String(h).padStart(2, '0')}:${m}:${s} ${ap}`;
}

function isMobileView() {
  return window.matchMedia('(max-width: 768px)').matches;
}

function initHeaderAndSidebar() {
  // Sidebar Toggle
  const sidebarToggle = document.getElementById('sidebarToggle');
  const sidebar = document.getElementById('sidebar');

  // Create a backdrop for the mobile sidebar overlay (created once, reused on every page)
  let sidebarBackdrop = document.getElementById('sidebarBackdrop');
  if (!sidebarBackdrop) {
    sidebarBackdrop = document.createElement('div');
    sidebarBackdrop.id = 'sidebarBackdrop';
    sidebarBackdrop.className = 'sidebar-backdrop';
    document.body.appendChild(sidebarBackdrop);
  }

  function setToggleIcon() {
    if (!sidebarToggle) return;
    const icon = sidebarToggle.querySelector('i');
    if (!icon) return;
    icon.className = sidebar.classList.contains('hidden') ? 'fas fa-chevron-right' : 'fas fa-bars';
  }

  function openSidebar() {
    sidebar.classList.remove('hidden');
    if (isMobileView()) sidebarBackdrop.classList.add('active');
    setToggleIcon();
  }

  function closeSidebar() {
    sidebar.classList.add('hidden');
    sidebarBackdrop.classList.remove('active');
    setToggleIcon();
  }

  if (sidebarToggle && sidebar) {
    // Sidebar is closed by default on mobile screens
    if (isMobileView()) {
      closeSidebar();
    }

    sidebarToggle.addEventListener('click', () => {
      if (sidebar.classList.contains('hidden')) {
        openSidebar();
      } else {
        closeSidebar();
      }
    });

    // Tapping the backdrop closes the sidebar (mobile)
    sidebarBackdrop.addEventListener('click', closeSidebar);

    // Auto-close the sidebar when an actual navigation link is tapped on mobile
    // (excludes the "View Details" dropdown-toggle links, which only expand/collapse)
    sidebar.querySelectorAll('.nav-link:not(.dropdown-toggle), .dropdown-item-side').forEach((link) => {
      link.addEventListener('click', () => {
        if (isMobileView()) closeSidebar();
      });
    });

    // Keep sidebar state sane if the device is rotated / window resized across the breakpoint
    window.addEventListener('resize', () => {
      if (!isMobileView()) {
        sidebarBackdrop.classList.remove('active');
      }
    });
  }

  // Fullscreen Toggle
  const fullscreenToggle = document.getElementById('fullscreenToggle');
  if (fullscreenToggle) {
    fullscreenToggle.addEventListener('click', () => {
      if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen();
        fullscreenToggle.querySelector('i').className = 'fas fa-compress';
      } else {
        document.exitFullscreen();
        fullscreenToggle.querySelector('i').className = 'fas fa-expand';
      }
    });
  }

  // Header Three Dots Dropdown
  const threeDotsBtn = document.getElementById('threeDotsBtn');
  const dropdownMenu = document.getElementById('headerDropdown');
  if (threeDotsBtn && dropdownMenu) {
    threeDotsBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      dropdownMenu.classList.toggle('active');
    });
    document.addEventListener('click', () => dropdownMenu.classList.remove('active'));
  }

  // Date & Time
  updateDateTime();
  setInterval(updateDateTime, 1000);

  // Sidebar Dropdowns (Admission & Fee View Details)
  const admissionDropdown = document.getElementById('admissionViewDropdown');
  const admissionToggle = document.getElementById('admissionViewToggle');
  const feeDropdown = document.getElementById('feeViewDropdown');
  const feeToggle = document.getElementById('feeViewToggle');

  if (admissionToggle && admissionDropdown) {
    admissionToggle.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      if (feeDropdown) feeDropdown.classList.remove('active');
      admissionDropdown.classList.toggle('active');
    });
  }

  if (feeToggle && feeDropdown) {
    feeToggle.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      if (admissionDropdown) admissionDropdown.classList.remove('active');
      feeDropdown.classList.toggle('active');
    });
  }

  // Close dropdowns when clicking outside
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.dropdown-nav')) {
      if (admissionDropdown) admissionDropdown.classList.remove('active');
      if (feeDropdown) feeDropdown.classList.remove('active');
    }
  });
}

// Export function so we can call it from dashboard.html
window.initHeaderAndSidebar = initHeaderAndSidebar;