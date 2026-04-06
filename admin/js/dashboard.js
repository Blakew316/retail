/* =========================================
   WILD CAST OUTFITTERS - Dashboard JS
   ========================================= */

document.addEventListener('DOMContentLoaded', () => {
  initSidebar();
  initDatePicker();
  initSalesChart();
});

/* --- Sidebar Toggle (mobile) --- */
function initSidebar() {
  const toggle = document.getElementById('sidebarToggle');
  const sidebar = document.getElementById('sidebar');
  const overlay = document.getElementById('sidebarOverlay');

  if (toggle) {
    toggle.addEventListener('click', () => {
      sidebar.classList.toggle('open');
      overlay.classList.toggle('active');
    });
  }

  if (overlay) {
    overlay.addEventListener('click', () => {
      sidebar.classList.remove('open');
      overlay.classList.remove('active');
    });
  }
}

/* --- Date Picker --- */
function initDatePicker() {
  const picker = document.getElementById('datePicker');
  const dropdown = document.getElementById('dateDropdown');
  const label = document.getElementById('datePickerLabel');

  if (!picker) return;

  picker.addEventListener('click', (e) => {
    e.stopPropagation();
    dropdown.classList.toggle('open');
  });

  document.addEventListener('click', () => {
    dropdown?.classList.remove('open');
  });

  const options = document.querySelectorAll('.date-option');
  options.forEach(opt => {
    opt.addEventListener('click', (e) => {
      e.stopPropagation();
      options.forEach(o => o.classList.remove('active'));
      opt.classList.add('active');
      label.textContent = opt.textContent;
      dropdown.classList.remove('open');
    });
  });
}

/* --- Sales Chart (Canvas-based) --- */
function initSalesChart() {
  const canvas = document.getElementById('salesChart');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  const container = canvas.parentElement;

  function resize() {
    const dpr = window.devicePixelRatio || 1;
    const rect = container.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    canvas.style.width = rect.width + 'px';
    canvas.style.height = rect.height + 'px';
    ctx.scale(dpr, dpr);
    draw(rect.width, rect.height);
  }

  // Generate sample hourly data
  const todayData = [
    45, 20, 10, 8, 5, 12, 30, 85, 150, 220, 310, 380,
    520, 680, 750, 620, 850, 940, 780, 420, 280, 180
  ];

  const lastSundayData = [
    60, 25, 15, 10, 8, 18, 45, 110, 180, 260, 350, 420,
    580, 720, 800, 710, 890, 920, 680, 380, 240, 160
  ];

  const labels = ['10p', '11p', '12a', '1a', '2a', '3a', '4a', '5a', '6a', '7a', '8a', '9a',
                  '10a', '11a', '12p', '1p', '2p', '3p', '4p', '5p', '6p', '7p'];

  function draw(w, h) {
    ctx.clearRect(0, 0, w, h);

    const padLeft = 40;
    const padRight = 20;
    const padTop = 20;
    const padBottom = 30;
    const chartW = w - padLeft - padRight;
    const chartH = h - padTop - padBottom;

    const maxVal = 1000;
    const yTicks = [0, 250, 500, 750, 1000];
    const yLabels = ['$0', '$250', '$500', '$750', '$1k'];

    // Grid lines and Y-axis labels
    ctx.strokeStyle = '#e8e8e8';
    ctx.lineWidth = 1;
    ctx.font = '11px Inter, sans-serif';
    ctx.fillStyle = '#9aa0a6';
    ctx.textAlign = 'right';

    yTicks.forEach((val, i) => {
      const y = padTop + chartH - (val / maxVal) * chartH;
      ctx.beginPath();
      ctx.setLineDash([4, 4]);
      ctx.moveTo(padLeft, y);
      ctx.lineTo(padLeft + chartW, y);
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.fillText(yLabels[i], padLeft - 8, y + 4);
    });

    // X-axis labels (show every 3rd)
    ctx.textAlign = 'center';
    const barCount = todayData.length;
    const groupWidth = chartW / barCount;
    const barWidth = groupWidth * 0.3;
    const barGap = 2;

    for (let i = 0; i < barCount; i += 3) {
      const x = padLeft + i * groupWidth + groupWidth / 2;
      ctx.fillStyle = '#9aa0a6';
      ctx.fillText(labels[i], x, h - 8);
    }

    // "Now" indicator line
    const nowIndex = 19; // ~7p
    const nowX = padLeft + nowIndex * groupWidth + groupWidth / 2;
    ctx.strokeStyle = '#bbb';
    ctx.lineWidth = 1;
    ctx.setLineDash([]);
    ctx.beginPath();
    ctx.moveTo(nowX, padTop);
    ctx.lineTo(nowX, padTop + chartH);
    ctx.stroke();
    ctx.fillStyle = '#9aa0a6';
    ctx.font = '11px Inter, sans-serif';
    ctx.fillText('Now', nowX, padTop - 6);

    // Draw bars with animation
    for (let i = 0; i < barCount; i++) {
      const x = padLeft + i * groupWidth + groupWidth * 0.15;

      // Last Sunday bar (lighter)
      const lsH = (lastSundayData[i] / maxVal) * chartH;
      const lsY = padTop + chartH - lsH;
      ctx.fillStyle = '#90caf9';
      ctx.fillRect(x, lsY, barWidth, lsH);

      // Today bar (darker)
      const tH = (todayData[i] / maxVal) * chartH;
      const tY = padTop + chartH - tH;

      // Only draw today bars up to "now"
      if (i <= nowIndex) {
        ctx.fillStyle = '#1565c0';
        ctx.fillRect(x + barWidth + barGap, tY, barWidth, tH);
      }
    }
  }

  resize();
  window.addEventListener('resize', resize);
}

/* --- Utility: format currency --- */
function formatCurrency(amount) {
  return '$' + amount.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

/* --- Utility: format number --- */
function formatNumber(n) {
  return n.toLocaleString();
}
