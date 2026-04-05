const reportForm = document.getElementById("reportForm");
const municipalitySelect = document.getElementById("municipality");
const categorySelect = document.getElementById("category");
const prioritySelect = document.getElementById("priority");
const locationTypeSelect = document.getElementById("locationType");
const formMessage = document.getElementById("formMessage");
const reportSummary = document.getElementById("reportSummary");
const categoryPreview = document.getElementById("categoryPreview");
const imageFileInput = document.getElementById("imageFile");
const imagePreview = document.getElementById("imagePreview");
const imageMeta = document.getElementById("imageMeta");
const reportEmergencyGrid = document.getElementById("reportEmergencyGrid");

let selectedImage = "";

function fillSelect(select, values) {
  select.innerHTML = values.map((value) => `<option value="${value}">${value}</option>`).join("");
}

function updateSummary() {
  reportSummary.innerHTML = `Raporti per <strong>${municipalitySelect.value}</strong> ne kategorine <strong>${categorySelect.value}</strong> do te ruhet me prioritet <strong>${prioritySelect.value}</strong> dhe status fillestar <strong>Pending</strong>.`;
}

function setMessage(text, type) {
  formMessage.textContent = text;
  formMessage.className = `form-message ${type}`;
}

function resetImagePreview() {
  selectedImage = "";
  imagePreview.removeAttribute("src");
  imagePreview.style.display = "none";
  imageMeta.textContent = "Mund te besh foto direkt nga telefoni ose ta zgjedhesh nga files.";
}

fillSelect(municipalitySelect, appData.municipalities);
fillSelect(categorySelect, appData.categories);
fillSelect(prioritySelect, appData.priorities);
fillSelect(locationTypeSelect, appData.locationTypes);
categoryPreview.innerHTML = appData.categories.map((item) => `<div class="mini-item">${item}</div>`).join("");
reportEmergencyGrid.innerHTML = appData.emergencyContacts.map((item) => `<div class="mini-emergency-item"><strong>${item.name}</strong><a href="tel:${item.number}">${item.number}</a></div>`).join("");
updateSummary();

[municipalitySelect, categorySelect, prioritySelect].forEach((element) => {
  element.addEventListener("change", updateSummary);
});

imageFileInput.addEventListener("change", () => {
  const file = imageFileInput.files[0];
  if (!file) {
    resetImagePreview();
    return;
  }
  if (!file.type.startsWith("image/")) {
    setMessage("Lejohet vetem ngarkimi i fotove.", "error");
    imageFileInput.value = "";
    resetImagePreview();
    return;
  }
  const reader = new FileReader();
  reader.onload = () => {
    selectedImage = reader.result;
    imagePreview.src = selectedImage;
    imagePreview.style.display = "block";
    imageMeta.textContent = `${file.name} | ${(file.size / 1024).toFixed(0)} KB`;
  };
  reader.readAsDataURL(file);
});

reportForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const fullName = document.getElementById("fullName").value.trim();
  const email = document.getElementById("email").value.trim();
  const phone = document.getElementById("phone").value.trim();
  const municipality = municipalitySelect.value;
  const category = categorySelect.value;
  const location = document.getElementById("location").value.trim();
  const locationType = locationTypeSelect.value;
  const priority = prioritySelect.value;
  const title = document.getElementById("title").value.trim();
  const description = document.getElementById("description").value.trim();

  if (!fullName || !email || !phone || !municipality || !category || !location || !locationType || !priority || !title || !description) {
    setMessage("Ploteso te gjitha fushat kryesore para ruajtjes se raportit.", "error");
    return;
  }

  if (!validateEmail(email)) {
    setMessage("Email-i nuk eshte ne format te sakte.", "error");
    return;
  }

  const numericId = Date.now();
  const reports = getReports();
  reports.unshift({
    id: numericId,
    reportId: formatReportId(numericId),
    fullName,
    email,
    phone,
    municipality,
    category,
    location,
    locationType,
    priority,
    title,
    description,
    image: selectedImage,
    status: "Pending",
    createdAt: new Date().toISOString()
  });

  saveReports(reports);
  reportForm.reset();
  fillSelect(municipalitySelect, appData.municipalities);
  fillSelect(categorySelect, appData.categories);
  fillSelect(prioritySelect, appData.priorities);
  fillSelect(locationTypeSelect, appData.locationTypes);
  resetImagePreview();
  updateSummary();
  setMessage("Raporti u ruajt me sukses. Tani mund ta shohesh ne dashboard.", "success");
});
