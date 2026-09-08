/**
 * FITQUEST PROGRESS VISUALIZATION & VANILLA SVG CHARTS
 * Zero external chart dependencies; 100% responsive procedural SVG rendering
 */

export const ProgressCharts = {
  /**
   * Render weekly workout activity column chart
   */
  renderWeeklyChart(containerId, workoutHistory = []) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    // Count workouts in the last 7 days
    const now = new Date();
    const dayCounts = [0, 0, 0, 0, 0, 0, 0];

    const todayDayIndex = (now.getDay() + 6) % 7; // Monday = 0

    // Check last 7 days history
    workoutHistory.forEach(w => {
      if (!w.completedAt) return;
      const wDate = new Date(w.completedAt);
      const diffDays = Math.floor((now - wDate) / (1000 * 60 * 60 * 24));
      if (diffDays >= 0 && diffDays < 7) {
        const dIdx = (wDate.getDay() + 6) % 7;
        dayCounts[dIdx] += 1;
      }
    });

    const maxCount = Math.max(1, ...dayCounts);
    const svgWidth = 500;
    const svgHeight = 200;
    const barWidth = 36;
    const colSpacing = (svgWidth - 60) / 7;

    let barsHtml = '';

    days.forEach((dayLabel, i) => {
      const x = 30 + i * colSpacing + (colSpacing - barWidth) / 2;
      const count = dayCounts[i];
      const barHeight = Math.max(8, (count / maxCount) * 120);
      const y = 150 - barHeight;
      const isToday = i === todayDayIndex;

      const fill = count > 0 ? (isToday ? 'url(#grad-bar-active)' : 'url(#grad-bar-normal)') : '#E2E8F0';

      barsHtml += `
        <g class="chart-bar-group">
          <rect x="${x}" y="${y}" width="${barWidth}" height="${barHeight}" rx="6" fill="${fill}" />
          <text x="${x + barWidth / 2}" y="${y - 8}" text-anchor="middle" font-size="11" font-weight="700" fill="${count > 0 ? '#0F172A' : 'transparent'}">${count > 0 ? count : ''}</text>
          <text x="${x + barWidth / 2}" y="172" text-anchor="middle" font-size="12" font-weight="${isToday ? '800' : '600'}" fill="${isToday ? '#2563EB' : '#64748B'}">${dayLabel}</text>
        </g>
      `;
    });

    container.innerHTML = `
      <svg viewBox="0 0 ${svgWidth} ${svgHeight}" width="100%" height="100%" preserveAspectRatio="xMidYMid meet">
        <defs>
          <linearGradient id="grad-bar-normal" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="#0EA5E9" />
            <stop offset="100%" stop-color="#2563EB" />
          </linearGradient>
          <linearGradient id="grad-bar-active" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="#10B981" />
            <stop offset="100%" stop-color="#059669" />
          </linearGradient>
        </defs>
        <line x1="20" y1="150" x2="${svgWidth - 20}" y2="150" stroke="#CBD5E1" stroke-width="1.5" stroke-dasharray="4 4" />
        ${barsHtml}
      </svg>
    `;
  },

  /**
   * Render XP progression trendline chart
   */
  renderXpChart(containerId, currentXp = 0, history = []) {
    const container = document.getElementById(containerId);
    if (!container) return;

    // Synthesize points if history has few points
    const pointsCount = 6;
    const basePts = [];
    const stepXp = currentXp / (pointsCount - 1 || 1);

    for (let i = 0; i < pointsCount; i++) {
      basePts.push(Math.round(stepXp * i));
    }
    basePts[pointsCount - 1] = currentXp;

    const svgW = 500;
    const svgH = 180;
    const maxXp = Math.max(100, currentXp);
    const paddingX = 40;
    const paddingY = 30;
    const usableW = svgW - paddingX * 2;
    const usableH = svgH - paddingY * 2;

    const coords = basePts.map((val, idx) => {
      const cx = paddingX + (idx / (pointsCount - 1)) * usableW;
      const cy = svgH - paddingY - (val / maxXp) * usableH;
      return { x: cx, y: cy, val };
    });

    let pathD = `M ${coords[0].x} ${coords[0].y}`;
    for (let i = 1; i < coords.length; i++) {
      const prev = coords[i - 1];
      const cur = coords[i];
      const midX = (prev.x + cur.x) / 2;
      pathD += ` C ${midX} ${prev.y}, ${midX} ${cur.y}, ${cur.x} ${cur.y}`;
    }

    const areaD = `${pathD} L ${coords[coords.length - 1].x} ${svgH - paddingY} L ${coords[0].x} ${svgH - paddingY} Z`;

    const dotsHtml = coords.map(pt => `
      <circle cx="${pt.x}" cy="${pt.y}" r="4.5" fill="#FFFFFF" stroke="#0EA5E9" stroke-width="3" />
    `).join('');

    container.innerHTML = `
      <svg viewBox="0 0 ${svgW} ${svgH}" width="100%" height="100%" preserveAspectRatio="xMidYMid meet">
        <defs>
          <linearGradient id="grad-xp-area" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="#0EA5E9" stop-opacity="0.35" />
            <stop offset="100%" stop-color="#0EA5E9" stop-opacity="0.0" />
          </linearGradient>
        </defs>
        <path d="${areaD}" fill="url(#grad-xp-area)" />
        <path d="${pathD}" fill="none" stroke="#0EA5E9" stroke-width="3" stroke-linecap="round" />
        ${dotsHtml}
        <text x="${coords[coords.length - 1].x}" y="${coords[coords.length - 1].y - 10}" text-anchor="middle" font-size="12" font-weight="800" fill="#0F172A">${currentXp} XP</text>
      </svg>
    `;
  }
};
