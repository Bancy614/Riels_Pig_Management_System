// ==================== DASHBOARD LOGIC ====================
document.addEventListener('DOMContentLoaded', () => {
  const pigs = getData('pigs');
  const finance = getData('finance');

  // 1️⃣ Pig summaries
  const total = pigs.length;
  const alive = pigs.filter(p => p.status === 'Alive').length;
  const dead = pigs.filter(p => p.status === 'Dead').length;
  const sold = pigs.filter(p => p.status === 'Sold').length;

  document.getElementById('totalPigs').textContent = total;
  document.getElementById('aliveCount').textContent = alive;
  document.getElementById('deadCount').textContent = dead;
  document.getElementById('soldCount').textContent = sold;

  // 2️⃣ Finance summaries
  const income = finance.filter(f => f.type === 'Income').reduce((sum, f) => sum + f.amount, 0);
  const expenses = finance.filter(f => f.type === 'Expense').reduce((sum, f) => sum + f.amount, 0);
  const profit = income - expenses;

  document.getElementById('totalIncome').textContent = income.toLocaleString();
  document.getElementById('totalExpenses').textContent = expenses.toLocaleString();
  document.getElementById('profit').textContent = profit.toLocaleString();

  // 3️⃣ Mother–Piglet Relationships
  loadMotherRelationships(pigs);

  // 4️⃣ Upcoming Schedules (next 14 days)
  loadUpcomingSchedules(pigs);
});

// ==================== MOTHER–PIGLET RELATIONSHIPS ====================
function loadMotherRelationships(pigs) {
  const table = document.getElementById('motherTable');
  const mothers = {};

  pigs.forEach(p => {
    if (p.motherId) {
      if (!mothers[p.motherId]) mothers[p.motherId] = [];
      mothers[p.motherId].push(p.id);
    }
  });

  table.innerHTML = '';

  const motherIds = Object.keys(mothers);
  if (motherIds.length === 0) {
    table.innerHTML = `<tr><td colspan="3" class="text-center text-muted">No relationships yet</td></tr>`;
    return;
  }

  motherIds.forEach(motherId => {
    table.innerHTML += `
      <tr>
        <td>${motherId}</td>
        <td>${mothers[motherId].length}</td>
        <td>${mothers[motherId].join(', ')}</td>
      </tr>`;
  });
}

// ==================== UPCOMING SCHEDULES ====================
function loadUpcomingSchedules(pigs) {
  const table = document.getElementById('scheduleTable');
  const today = new Date();
  const twoWeeks = new Date();
  twoWeeks.setDate(today.getDate() + 14);

  let allSchedules = [];

  pigs.forEach(p => {
    const all = [
      ...(p.feedingSchedule || []),
      ...(p.vaccinationSchedule || []),
      ...(p.reproductionSchedule || [])
    ];

    all.forEach(item => {
      const scheduleDate = new Date(item.date);
      if (scheduleDate >= today && scheduleDate <= twoWeeks) {
        allSchedules.push({
          type: item.type || item.stage,
          pigId: p.id,
          date: item.date,
          remarks: p.remarks || ''
        });
      }
    });
  });

  table.innerHTML = '';
  if (allSchedules.length === 0) {
    table.innerHTML = `<tr><td colspan="4" class="text-center text-muted">No schedules available</td></tr>`;
    return;
  }

  allSchedules.sort((a, b) => new Date(a.date) - new Date(b.date));
  allSchedules.forEach(s => {
    table.innerHTML += `
      <tr>
        <td>${s.type}</td>
        <td>${s.pigId}</td>
        <td>${s.date}</td>
        <td>${s.remarks}</td>
      </tr>`;
  });
}


// Load pigs and finance data from localStorage
    const pigs = JSON.parse(localStorage.getItem('pigs')) || [];
    const finances = JSON.parse(localStorage.getItem('financeRecords')) || [];

    // --- Summary Cards ---
    const totalPigs = pigs.length;
    const malePigs = pigs.filter(p => p.gender === 'Male').length;
    const femalePigs = pigs.filter(p => p.gender === 'Female').length;

    document.getElementById('totalPigs').textContent = totalPigs;
    document.getElementById('malePigs').textContent = malePigs;
    document.getElementById('femalePigs').textContent = femalePigs;

    // Profit calculation (Sales - Expenses)
    const totalSales = finances.filter(f => f.type === 'Sale').reduce((sum, f) => sum + Number(f.amount), 0);
    const totalExpenses = finances.filter(f => f.type === 'Expense' || f.type === 'Professional Fee').reduce((sum, f) => sum + Number(f.amount), 0);
    const profit = totalSales - totalExpenses;

    document.getElementById('totalProfit').textContent = `Ksh ${profit.toLocaleString()}`;

    // --- Charts ---
    const ctx1 = document.getElementById('populationChart').getContext('2d');
    const ctx2 = document.getElementById('genderChart').getContext('2d');
    const ctx3 = document.getElementById('profitChart').getContext('2d');

    // Population trend (dummy monthly data)
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
    const pigCounts = [10, 15, 22, 30, 45, totalPigs];

    new Chart(ctx1, {
      type: 'line',
      data: {
        labels: months,
        datasets: [{
          label: 'Total Pigs Over Time',
          data: pigCounts,
          borderColor: 'green',
          borderWidth: 2,
          fill: false,
        }]
      },
      options: { responsive: true, scales: { y: { beginAtZero: true } } }
    });

    // Gender ratio chart
    new Chart(ctx2, {
      type: 'doughnut',
      data: {
        labels: ['Male', 'Female'],
        datasets: [{
          data: [malePigs, femalePigs],
          backgroundColor: ['#007bff', '#dc3545']
        }]
      },
      options: { responsive: true, plugins: { legend: { position: 'bottom' } } }
    });

    // Profit analysis chart
    const profitMonths = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
    const monthlyProfit = [1000, 1500, 1200, 1800, 2500, profit];

    new Chart(ctx3, {
      type: 'bar',
      data: {
        labels: profitMonths,
        datasets: [{
          label: 'Monthly Profit (Ksh)',
          data: monthlyProfit,
          backgroundColor: '#28a745'
        }]
      },
      options: {
        responsive: true,
        scales: { y: { beginAtZero: true } }
      }
    });

    // When adding piglets:
const mother = pigs.find(p => p.id === motherId);
if (mother) {
  mother.piglets = mother.piglets || [];
  mother.piglets.push(newPig.id);
}
localStorage.setItem('pigs', JSON.stringify(pigs));


/*alerts*/
function daysBetween(d1, d2) {
  const diff = new Date(d2) - new Date(d1);
  return Math.floor(diff / (1000 * 60 * 60 * 24));
}

// Generate Vaccination & Feeding Alerts
const today = new Date();
const alertList = document.getElementById('alertList');
alertList.innerHTML = '';

pigs.forEach(pig => {
  const ageDays = daysBetween(pig.dob, today);

  // Feeding changes (sample schedule)
  if (ageDays === 30) alertList.innerHTML += `<li>${pig.name} should move to grower feed today.</li>`;
  if (ageDays === 90) alertList.innerHTML += `<li>${pig.name} should switch to finisher feed.</li>`;

  // Vaccination timeline (example schedule)
  if (ageDays === 7) alertList.innerHTML += `<li>${pig.name}: Deworming due today.</li>`;
  if (ageDays === 21) alertList.innerHTML += `<li>${pig.name}: Iron injection and castration recommended.</li>`;
  if (ageDays === 60) alertList.innerHTML += `<li>${pig.name}: Second vaccination due today.</li>`;
});

if (alertList.innerHTML.trim() === '') {
  document.getElementById('reminderAlerts').innerHTML = `<div class="alert alert-success">🎉 All vaccinations and feed schedules are up-to-date!</div>`;
}

/*Monthly filter*/
let filtered = [];

    function generateFilteredReport() {
      const month = document.getElementById('monthFilter').value;
      const type = document.getElementById('reportType').value;
      const finances = JSON.parse(localStorage.getItem('financeRecords')) || [];

      filtered = finances;

      if (month) filtered = filtered.filter(f => f.date && f.date.startsWith(month));
      if (type !== 'all') filtered = filtered.filter(f => f.type.toLowerCase().includes(type));

      const total = filtered.reduce((sum, f) => sum + Number(f.amount), 0);
      document.getElementById('reportResults').innerHTML = `
        <h5 class="fw-bold text-success">Report Summary (${filtered.length} records)</h5>
        <p><strong>Total Amount:</strong> Ksh ${total.toLocaleString()}</p>
        <table id="reportTable" class="table table-striped">
          <thead><tr><th>Date</th><th>Type</th><th>Description</th><th>Amount (Ksh)</th></tr></thead>
          <tbody>
            ${filtered.map(f => `<tr><td>${f.date}</td><td>${f.type}</td><td>${f.description}</td><td>${f.amount}</td></tr>`).join('')}
          </tbody>
        </table>
      `;
    }

    // --- Export to PDF ---
    function exportToPDF() {
      if (filtered.length === 0) {
        alert("Please generate a report first!");
        return;
      }

      const { jsPDF } = window.jspdf;
      const doc = new jsPDF();
      doc.text("Pig Farm Financial Report", 14, 15);
      let y = 30;
      filtered.forEach((r, i) => {
        doc.text(`${i+1}. ${r.date} | ${r.type} | ${r.description} | Ksh ${r.amount}`, 14, y);
        y += 8;
      });
      doc.save("Pig_Farm_Report.pdf");
    }

    // --- Export to Excel ---
    function exportToExcel() {
      if (filtered.length === 0) {
        alert("Please generate a report first!");
        return;
      }

      const worksheet = XLSX.utils.json_to_sheet(filtered);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Report");
      XLSX.writeFile(workbook, "Pig_Farm_Report.xlsx");
    }

    /* Notification */
if (Notification.permission !== "granted") {
  Notification.requestPermission();
}

function daysBetween(d1, d2) {
  const diff = new Date(d2) - new Date(d1);
  return Math.floor(diff / (1000 * 60 * 60 * 24));
}

function sendNotification(title, body) {
  if (Notification.permission === "granted") {
    new Notification(title, { body });
  }
}

function checkReminders() {
  const pigs = JSON.parse(localStorage.getItem('pigs')) || [];
  const today = new Date();

  pigs.forEach(pig => {
    const ageDays = daysBetween(pig.dob, today);

    if (ageDays === 7) sendNotification("Vaccination Due", `${pig.name} needs Deworming today.`);
    if (ageDays === 21) sendNotification("Health Reminder", `${pig.name}: Iron injection & castration due today.`);
    if (ageDays === 60) sendNotification("Vaccination Reminder", `${pig.name}: Second vaccination due.`);
    if (ageDays === 30) sendNotification("Feeding Alert", `${pig.name}: Switch to grower feed.`);
    if (ageDays === 90) sendNotification("Feeding Alert", `${pig.name}: Switch to finisher feed.`);
  });
}

// Check reminders every hour
checkReminders();
setInterval(checkReminders, 3600000);


/* Sound alerts */
// --- Sound + Browser Notifications + Daily Summary ---
if (Notification.permission !== "granted") {
  Notification.requestPermission();
}

const alertSound = document.getElementById("alertSound");

function daysBetween(d1, d2) {
  const diff = new Date(d2) - new Date(d1);
  return Math.floor(diff / (1000 * 60 * 60 * 24));
}

function playAlertSound() {
  alertSound.currentTime = 0;
  alertSound.play().catch(() => {});
}

function sendNotification(title, body, sound = true) {
  if (Notification.permission === "granted") {
    new Notification(title, { body });
  }
  if (sound) playAlertSound();
}

function checkReminders() {
  const pigs = JSON.parse(localStorage.getItem('pigs')) || [];
  const today = new Date();
  let dueToday = [];

  pigs.forEach(pig => {
    const ageDays = daysBetween(pig.dob, today);

    if (ageDays === 7) {
      sendNotification("🐖 Vaccination Due", `${pig.name} needs Deworming today.`);
      dueToday.push(`${pig.name}: Deworming`);
    }
    if (ageDays === 21) {
      sendNotification("💉 Health Reminder", `${pig.name}: Iron injection & castration due today.`);
      dueToday.push(`${pig.name}: Castration & Iron Injection`);
    }
    if (ageDays === 60) {
      sendNotification("💉 Vaccination Reminder", `${pig.name}: Second vaccination due today.`);
      dueToday.push(`${pig.name}: Second Vaccination`);
    }
    if (ageDays === 30) {
      sendNotification("🥕 Feeding Alert", `${pig.name}: Switch to grower feed.`);
      dueToday.push(`${pig.name}: Switch to grower feed`);
    }
    if (ageDays === 90) {
      sendNotification("🌾 Feeding Alert", `${pig.name}: Switch to finisher feed.`);
      dueToday.push(`${pig.name}: Switch to finisher feed`);
    }
  });

  // Daily summary (at 8 AM)
  const now = new Date();
  if (now.getHours() === 8 && dueToday.length > 0) {
    sendNotification("🐷 Daily Farm Summary", `Today's tasks: ${dueToday.length} pigs due for vaccination/feeding.`, false);
  }
}

// Run at startup + every hour
checkReminders();
setInterval(checkReminders, 3600000);

if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('service-worker.js')
        .then(() => console.log("✅ Service Worker Registered"))
        .catch(err => console.error("SW registration failed:", err));
    });
  }

  let deferredPrompt;

  // Listen for the install prompt event
  window.addEventListener('beforeinstallprompt', (e) => {
    // Prevent the mini-infobar from appearing
    e.preventDefault();
    deferredPrompt = e;
    // Show our custom install banner
    document.getElementById('installBanner').classList.remove('d-none');
  });

  // When user clicks "Install App"
  document.getElementById('installBtn').addEventListener('click', async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        console.log('✅ User accepted the A2HS prompt');
      } else {
        console.log('❌ User dismissed the A2HS prompt');
      }
      deferredPrompt = null;
    }
    document.getElementById('installBanner').classList.add('d-none');
  });

  // Allow user to close banner manually
  document.getElementById('closeBanner').addEventListener('click', () => {
    document.getElementById('installBanner').classList.add('d-none');
  });

  /*charts auto update */
  window.addEventListener('storage', (event) => {
  if (event.key === 'financeData' || event.key === 'financeData_updated') {
    refreshDashboardCharts(); // a function that reloads the charts
  }
});

// Edit Pig
function editPig(index) {
  const pig = pigs[index];
  const newStatus = prompt("Update status (Alive/Sold/Dead):", pig.status);
  const newRemarks = prompt("Remarks:", pig.remarks || "");
  if (newStatus) pigs[index].status = newStatus;
  pigs[index].remarks = newRemarks;
  savePigs();
}

// Delete Pig
function deletePig(index) {
  if (confirm("Are you sure you want to delete this record?")) {
    pigs.splice(index, 1);
    savePigs();
  }
}

// Save
function savePigs() {
  localStorage.setItem('pigsData', JSON.stringify(pigs));
  localStorage.setItem('pigsData_updated', Date.now());
  renderPigs();
  // Optional: call backupPigRecords(pigs);
}

renderPigs();


/*Add and Delete functions finance*/
let financeData = JSON.parse(localStorage.getItem('financeData')) || [];

function renderFinance() {
  const tbody = document.querySelector("#financeTable tbody");
  tbody.innerHTML = "";
  financeData.forEach((entry, i) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${i + 1}</td>
      <td>${entry.description}</td>
      <td>${entry.type}</td>
      <td>${entry.amount}</td>
      <td>${entry.date}</td>
      <td>
        <button class="btn btn-sm btn-warning me-2" onclick="editFinance(${i})">Edit</button>
        <button class="btn btn-sm btn-danger" onclick="deleteFinance(${i})">Delete</button>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

function editFinance(i) {
  const e = financeData[i];
  const desc = prompt("Edit Description:", e.description);
  const type = prompt("Edit Type (Revenue/Expense):", e.type);
  const amt = prompt("Edit Amount:", e.amount);
  const date = prompt("Edit Date:", e.date);
  if (desc && type && amt) {
    financeData[i] = { description: desc, type, amount: Number(amt), date };
    saveFinance();
  }
}

function deleteFinance(i) {
  if (confirm("Delete this transaction?")) {
    financeData.splice(i, 1);
    saveFinance();
  }
}

function saveFinance() {
  localStorage.setItem('financeData', JSON.stringify(financeData));
  localStorage.setItem('financeData_updated', Date.now());
  renderFinance();
  // Optional: backupFinanceData(financeData);
}

renderFinance();


/* edit delete functions Feeds, Vaccination, Feeding, Reproduction Pages */
let feeds = JSON.parse(localStorage.getItem('feedsData')) || [];

function renderFeeds() {
  const tbody = document.querySelector("#feedsTable tbody");
  tbody.innerHTML = "";
  feeds.forEach((f, i) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${i + 1}</td>
      <td>${f.type}</td>
      <td>${f.qty}</td>
      <td>${f.cost}</td>
      <td>${f.date}</td>
      <td>
        <button class="btn btn-sm btn-warning me-2" onclick="editFeed(${i})">Edit</button>
        <button class="btn btn-sm btn-danger" onclick="deleteFeed(${i})">Delete</button>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

function editFeed(i) {
  const f = feeds[i];
  const type = prompt("Feed Type:", f.type);
  const qty = prompt("Quantity (kg):", f.qty);
  const cost = prompt("Cost:", f.cost);
  const date = prompt("Date:", f.date);
  if (type && qty && cost) {
    feeds[i] = { type, qty: Number(qty), cost: Number(cost), date };
    saveFeeds();
  }
}

function deleteFeed(i) {
  if (confirm("Delete this feed record?")) {
    feeds.splice(i, 1);
    saveFeeds();
  }
}

function saveFeeds() {
  localStorage.setItem('feedsData', JSON.stringify(feeds));
  renderFeeds();
}
renderFeeds();




// js/common.js

export function getData(key) {
  return JSON.parse(localStorage.getItem(key)) || [];
}

export function setData(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
  window.dispatchEvent(new Event('storage')); // triggers update on all pages
}

export function calculateFinanceSummary() {
  const finances = getData('financeRecords');
  const totalSales = finances.filter(f => f.type === 'Sale')
    .reduce((sum, f) => sum + Number(f.amount || 0), 0);
  const totalExpenses = finances.filter(f => f.type === 'Expense' || f.type === 'Professional Fee')
    .reduce((sum, f) => sum + Number(f.amount || 0), 0);
  return {
    totalSales,
    totalExpenses,
    profit: totalSales - totalExpenses
  };
}



/*dashboard js */
import { getData, calculateFinanceSummary } from './common.js';

let populationChart, genderChart, profitChart;

function renderDashboard() {
  const pigs = getData('pigs');
  const { totalSales, totalExpenses, profit } = calculateFinanceSummary();

  const maleCount = pigs.filter(p => p.gender === 'Male').length;
  const femaleCount = pigs.filter(p => p.gender === 'Female').length;
  const totalPigs = pigs.length;

  // Render summary cards
  const summary = `
    <div class="col-md-3"><div class="card border-success shadow-sm"><div class="card-body">
      <h6>Total Pigs</h6><h3>${totalPigs}</h3></div></div></div>
    <div class="col-md-3"><div class="card border-success shadow-sm"><div class="card-body">
      <h6>Male Pigs</h6><h3>${maleCount}</h3></div></div></div>
    <div class="col-md-3"><div class="card border-success shadow-sm"><div class="card-body">
      <h6>Female Pigs</h6><h3>${femaleCount}</h3></div></div></div>
    <div class="col-md-3"><div class="card border-success shadow-sm"><div class="card-body">
      <h6>Profit</h6><h3>Ksh ${profit.toLocaleString()}</h3></div></div></div>
  `;
  document.getElementById('summaryCards').innerHTML = summary;

  // Destroy old charts if exist
  if (populationChart) populationChart.destroy();
  if (genderChart) genderChart.destroy();
  if (profitChart) profitChart.destroy();

  const ctx1 = document.getElementById('populationChart').getContext('2d');
  const ctx2 = document.getElementById('genderChart').getContext('2d');
  const ctx3 = document.getElementById('profitChart').getContext('2d');

  populationChart = new Chart(ctx1, {
    type: 'line',
    data: {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
      datasets: [{ label: 'Pig Population', data: [10, 14, 22, 30, 40, totalPigs], borderColor: 'green' }]
    }
  });

  genderChart = new Chart(ctx2, {
    type: 'doughnut',
    data: {
      labels: ['Male', 'Female'],
      datasets: [{ data: [maleCount, femaleCount], backgroundColor: ['#007bff', '#dc3545'] }]
    }
  });

  profitChart = new Chart(ctx3, {
    type: 'bar',
    data: {
      labels: ['Sales', 'Expenses', 'Profit'],
      datasets: [{ data: [totalSales, totalExpenses, profit], backgroundColor: ['#198754', '#dc3545', '#0d6efd'] }]
    }
  });
}

// Re-render on data changes
window.addEventListener('storage', renderDashboard);
window.addEventListener('DOMContentLoaded', renderDashboard);


/*Service-worker js*/
const CACHE_NAME = "pig-farm-cache-v1";
const urlsToCache = [
  "index.html",
  "pigs.html",
  "feeds.html",
  "finance.html",
  "reports.html",
  "lineage.html",
  "manifest.json",
  "https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css",
  "https://cdn.jsdelivr.net/npm/chart.js",
];

self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      console.log("Caching app files...");
      return cache.addAll(urlsToCache);
    })
  );
});

self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    })
  );
});

self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    )
  );
});





  






    
  


