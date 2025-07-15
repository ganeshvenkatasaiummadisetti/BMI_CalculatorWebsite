// --- Personalized Guidance for Special Cases ---
const GUIDANCE = {
  underweight: [
    ["Diet (Calories)", "Gradually add 300–500 kcal/day; eat 5–6 times; choose calorie‑dense whole foods; avoid sugary empty calories."],
    ["Diet (Nutrients)", "Prioritize protein, healthy fats, complex carbs; avoid high-fiber before meals."],
    ["Exercise", "Strength training 3–4x/week; light cardio; yoga for posture."],
    ["Lifestyle", "Stay hydrated; sleep 7–9 hrs; manage stress; consult a professional."]
  ],
  obese: [
    ["Diet (Calories)", "500–750 kcal/day deficit; avoid sugary & processed foods."],
    ["Diet (Nutrients)", "High fiber, lean proteins, moderate healthy fats; stay hydrated."],
    ["Exercise", "Cardio 150–300 min/week + strength 2–3x/week; increase daily movement."],
    ["Lifestyle", "Sleep 7–9 hrs; meal prep; stress management; set realistic goals."]
  ]
};

// --- Badge Generator ---
function getBadge(bmi) {
  if (bmi < 18.5) return `<div class="badge">Health Booster 🧃</div>`;
  if (bmi < 25) return `<div class="badge">Wellness Warrior 💪</div>`;
  if (bmi < 30) return `<div class="badge">On The Move 🚶‍♂️</div>`;
  return `<div class="badge">Health Rebuilder 🛠️</div>`;
}

// --- Table Builder for Advice ---
function makeTable(title, rows) {
  let html = `<h3>${title}</h3><table class="bmi-table"><thead><tr><th>Category</th><th>Recommendations</th></tr></thead><tbody>`;
  rows.forEach(([cat, rec]) => {
    html += `<tr><td><strong>${cat}</strong></td><td>${rec}</td></tr>`;
  });
  html += `</tbody></table>`;
  return html;
}

// --- Main BMI Function ---
function calculateBMI() {
  const height = parseFloat(document.getElementById("height").value) / 100;
  const weight = parseFloat(document.getElementById("weight").value);
  const age = parseInt(document.getElementById("age").value);
  const resultDiv = document.getElementById("result");
  const exportBtn = document.getElementById("exportBtn");

  exportBtn.style.display = "none"; // hide until needed

  if (!height || !weight || !age || height <= 0 || weight <= 0 || age <= 0) {
    resultDiv.innerHTML = "❗ Please enter valid height, weight, and age.";
    return;
  }

  const bmi = +(weight / (height * height)).toFixed(2);
  let category = "", explanation = "", guidance = "", ageAdvice = "";

  // --- Determine category & explanation ---
  if (bmi < 18.5) {
    category = "Underweight";
    explanation = "You may be at risk of fatigue, nutrient deficiencies, and weakened immunity.";
    guidance = makeTable("Underweight (BMI < 18.5)", GUIDANCE.underweight);
    exportBtn.style.display = "block";
  } else if (bmi < 25) {
    category = "Normal weight";
    explanation = "You are in a healthy range. Keep up your balanced lifestyle!";
  } else if (bmi < 30) {
    category = "Overweight";
    explanation = "You may face higher risks of heart issues and type 2 diabetes.";
  } else {
    category = "Obesity";
    explanation = "Obesity increases risk of heart disease, stroke, and metabolic disorders.";
    guidance = makeTable("Obese (BMI > 30)", GUIDANCE.obese);
    exportBtn.style.display = "block";
  }

  // --- Add age-specific advice ---
  if (age >= 50) {
    ageAdvice = `<p><em>🧓 At age ${age}, consider bone health, muscle maintenance, and regular health checkups.</em></p>`;
  } else if (age <= 18) {
    ageAdvice = `<p><em>👶 BMI interpretations vary for growing children/teens. Please consult a pediatrician.</em></p>`;
  }

  // --- Final output HTML ---
  let html = `
    <p><strong>Your BMI:</strong> ${bmi} (<strong>${category}</strong>)</p>
    <p><strong>Age:</strong> ${age} years</p>
    <p><em>${explanation}</em></p>
    ${ageAdvice}
    ${guidance}
    ${getBadge(bmi)}
    <p class="disclaimer">🔍 This is general advice for healthy adults. Always consult a healthcare provider for personalized recommendations.</p>
  `;

  resultDiv.innerHTML = html;
}

// --- Export Result to PDF ---
function exportPdf() {
  if (typeof jspdf === "undefined") {
    alert("jsPDF not loaded.");
    return;
  }
  const doc = new jspdf.jsPDF({ orientation: "portrait", unit: "pt", format: "a4" });
  doc.html(document.getElementById("result"), {
    callback: () => doc.save("BMI_Report.pdf"),
    margin: [20, 20, 20, 20],
    autoPaging: "text",
    x: 0,
    y: 0
  });
}
