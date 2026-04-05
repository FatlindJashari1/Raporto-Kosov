const filterMunicipality = document.getElementById("filterMunicipality");
const filterCategory = document.getElementById("filterCategory");
const filterStatus = document.getElementById("filterStatus");
const searchInput = document.getElementById("searchInput");
const reportsContainer = document.getElementById("reportsContainer");
const clearAllReports = document.getElementById("clearAllReports");
const allCount = document.getElementById("allCount");
const pendingCount = document.getElementById("pendingCount");
const reviewCount = document.getElementById("reviewCount");
const resolvedCount = document.getElementById("resolvedCount");

function fillFilter(select, values, label) {
  select.innerHTML = [`<option value="all">${label}</option>`]
    .concat(values.map((value) => `<option value="${value}">${value}</option>`))
    .join("");
}

function updateMetrics(reports) {
  allCount.textContent = reports.length;
  pendingCount.textContent = reports.filter((report) => report.status === "Pending").length;
  reviewCount.textContent = reports.filter((report) => report.status === "In Review").length;
  resolvedCount.textContent = reports.filter((report) => report.status === "Resolved").length;
}

function getFilteredReports() {
  const municipalityValue = filterMunicipality.value;
  const categoryValue = filterCategory.value;
  const statusValue = filterStatus.value;
  const searchValue = searchInput.value.trim().toLowerCase();

  return getReports().filter((report) => {
    const matchMunicipality = municipalityValue === "all" || report.municipality === municipalityValue;
    const matchCategory = categoryValue === "all" || report.category === categoryValue;
    const matchStatus = statusValue === "all" || report.status === statusValue;
    const haystack = `${report.title} ${report.location} ${report.reportId || ""}`.toLowerCase();
    const matchSearch = !searchValue || haystack.includes(searchValue);
    return matchMunicipality && matchCategory && matchStatus && matchSearch;
  });
}

function getStatusClass(status) {
  if (status === "Resolved") return "chip-success";
  if (status === "In Review") return "chip-warning";
  return "chip-danger";
}

function renderReports() {
  const allReports = getReports();
  const filteredReports = getFilteredReports();
  updateMetrics(allReports);

  if (!filteredReports.length) {
    reportsContainer.innerHTML = '<div class="empty-state">Nuk u gjet asnje raport sipas filtrave aktuale.</div>';
    return;
  }

  reportsContainer.innerHTML = filteredReports
    .map((report) => `
      <article class="report-card-item">
        <div class="report-main">
          <div class="report-topline">
            <span class="chip ${getStatusClass(report.status)}">${report.status}</span>
            <span class="chip chip-muted">${report.priority}</span>
            <span class="chip chip-outline">${report.municipality}</span>
          </div>
          <p class="report-id">ID: ${report.reportId || formatReportId(report.id)}</p>
          <h3>${report.title}</h3>
          <p class="section-copy">${report.description}</p>
          <div class="report-meta">
            <span><strong>Kategoria:</strong> ${report.category}</span>
            <span><strong>Lokacioni:</strong> ${report.location}</span>
            <span><strong>Lloji:</strong> ${report.locationType || "-"}</span>
            <span><strong>Raportuar nga:</strong> ${report.fullName}</span>
            <span><strong>Kontakti:</strong> ${report.phone || "-"}</span>
            <span><strong>Data:</strong> ${formatDate(report.createdAt)}</span>
          </div>
          ${report.image ? `<div class="report-image-wrap"><img class="report-image" src="${report.image}" alt="Foto e raportimit ${report.title}"></div>` : ""}
        </div>
        <div class="report-actions">
          <label>
            Statusi
            <select onchange="changeStatus(${report.id}, this.value)">
              ${appData.statuses.map((status) => `<option value="${status}" ${status === report.status ? "selected" : ""}>${status}</option>`).join("")}
            </select>
          </label>
          <button class="btn btn-secondary btn-danger-lite" type="button" onclick="deleteReport(${report.id})">Fshij</button>
        </div>
      </article>
    `)
    .join("");
}

function changeStatus(id, value) {
  const reports = getReports().map((report) => report.id === id ? { ...report, status: value } : report);
  saveReports(reports);
  renderReports();
}

function deleteReport(id) {
  const reports = getReports().filter((report) => report.id !== id);
  saveReports(reports);
  renderReports();
}

window.changeStatus = changeStatus;
window.deleteReport = deleteReport;

fillFilter(filterMunicipality, appData.municipalities, "Te gjitha komunat");
fillFilter(filterCategory, appData.categories, "Te gjitha kategorite");
fillFilter(filterStatus, appData.statuses, "Te gjitha statuset");

[filterMunicipality, filterCategory, filterStatus].forEach((element) => element.addEventListener("change", renderReports));
searchInput.addEventListener("input", renderReports);
clearAllReports.addEventListener("click", () => {
  saveReports([]);
  renderReports();
});

renderReports();
