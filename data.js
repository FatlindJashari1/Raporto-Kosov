const appData = {
  storageKey: "raportoKosovaReports",
  municipalities: [
    "Deqan", "Dragash", "Drenas", "Ferizaj", "Fushe Kosove", "Gjakove", "Gjilan", "Graqanice",
    "Hani i Elezit", "Istog", "Junik", "Kacanik", "Kamenice", "Kline", "Kllokot", "Leposaviq",
    "Lipjan", "Malisheve", "Mamush", "Mitrovice e Jugut", "Mitrovice e Veriut", "Novoberde",
    "Obiliq", "Partesh", "Peje", "Podujeve", "Prishtine", "Prizren", "Rahovec", "Ranillugu",
    "Shterpce", "Shtime", "Skenderaj", "Suhareke", "Viti", "Vushtrri", "Zubin Potok", "Zveqan"
  ],
  categories: [
    "Rruge te demtuara",
    "Ndricim publik",
    "Mbeturina",
    "Uje dhe kanalizim",
    "Parke dhe hapesira publike",
    "Parking ilegal",
    "Siguri publike",
    "Sinjalizim rrugor"
  ],
  priorities: ["E ulet", "Mesatare", "E larte", "Urgjente"],
  statuses: ["Pending", "In Review", "Resolved"],
  locationTypes: ["Rruge", "Lagje", "Park", "Shkolle", "Spital", "Hapesire publike", "Objekt komunal"],
  emergencyContacts: [
    { name: "Policia e Kosoves", number: "192", note: "Raste urgjente, siguri publike dhe aksidente." },
    { name: "Zjarrfikesit", number: "193", note: "Zjarre, tym, shpetim dhe emergjenca teknike." },
    { name: "Ndihma e Shpejte", number: "194", note: "Emergjenca mjekesore dhe transport urgjent." },
    { name: "Qendra Emergjente", number: "112", note: "Numri unik emergjent per koordinim te shpejte." },
    { name: "KEDS Defektet", number: "0800 791 00", note: "Probleme me energji elektrike dhe defekte." },
    { name: "Ujesjellesi Rajonal", number: "0800 44 800", note: "Probleme me ujin ose rrjetin e furnizimit." }
  ]
};

function getReports() {
  return JSON.parse(localStorage.getItem(appData.storageKey) || "[]");
}

function saveReports(reports) {
  localStorage.setItem(appData.storageKey, JSON.stringify(reports));
}

function formatDate(dateString) {
  return new Date(dateString).toLocaleDateString("sq-AL", {
    day: "2-digit",
    month: "short",
    year: "numeric"
  });
}

function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function formatReportId(id) {
  return `RK-${new Date().getFullYear()}-${String(id).slice(-5)}`;
}
