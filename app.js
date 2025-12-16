const screens = document.querySelectorAll('.screen');
function show(id) {
  screens.forEach(s => s.classList.remove('active'));
  document.getElementById(id).classList.add('active');
}

/* =========================
   BARCODE SCANNER (REAL)
========================= */

let ecoScore = 0;

Quagga.init({
  inputStream: {
    type: "LiveStream",
    target: document.querySelector("#scanner"),
    constraints: {
      facingMode: "environment"
    }
  },
  decoder: {
    readers: ["ean_reader", "upc_reader", "code_128_reader"]
  }
}, function(err) {
  if (!err) Quagga.start();
});

Quagga.onDetected(() => {
  Quagga.stop();
  ecoScore = Math.floor(Math.random() * 40) + 60; // exhibition-safe
  showTree();
});

function showTree() {
  show("tree");
  document.getElementById("ecoText").innerText =
    `Eco Score: ${ecoScore}/100`;
  setTimeout(() => show("quizPrompt"), 3000);
}

/* =========================
   QUIZ (50 QUESTIONS → 5)
========================= */

const questions = [
  {q:"Plastic takes hundreds of years to decompose.",a:true},
  {q:"Glass can be recycled infinitely.",a:true},
  {q:"Paper can only be recycled once.",a:false},
  {q:"Metal recycling saves resources.",a:true},
  {q:"Food waste produces methane gas.",a:true},
  {q:"Plastic bags are biodegradable.",a:false},
  {q:"E-waste contains toxic materials.",a:true},
  {q:"Composting reduces landfill waste.",a:true},
  {q:"Renewable energy comes from fossil fuels.",a:false},
  {q:"LED bulbs use less energy.",a:true},
  {q:"Saving water saves energy.",a:true},
  {q:"Single-use plastics are sustainable.",a:false},
  {q:"Planting trees fights climate change.",a:true},
  {q:"Fast fashion increases pollution.",a:true},
  {q:"Recycling saves energy.",a:true},
  {q:"Public transport reduces emissions.",a:true},
  {q:"Solar energy works at night.",a:false},
  {q:"Buying local reduces emissions.",a:true},
  {q:"Deforestation affects rainfall.",a:true},
  {q:"Eco-friendly products are always expensive.",a:false},
  {q:"Bamboo is sustainable.",a:true},
  {q:"Plastic straws harm marine life.",a:true},
  {q:"Cloth bags reduce waste.",a:true},
  {q:"Plastic recycling rate is 100%.",a:false},
  {q:"Reusable bottles reduce waste.",a:true},
  {q:"Air pollution harms health.",a:true},
  {q:"Wind energy is non-renewable.",a:false},
  {q:"Eco labels help consumers.",a:true},
  {q:"Burning waste is eco-friendly.",a:false},
  {q:"Water scarcity is global.",a:true},
  {q:"Biodegradable means instant decay.",a:false},
  {q:"Climate change affects wildlife.",a:true},
  {q:"Energy-efficient appliances save power.",a:true},
  {q:"Climate change is only future.",a:false},
  {q:"Plant-based diets reduce footprint.",a:true},
  {q:"Recycling alone solves pollution.",a:false},
  {q:"Glass recycling saves energy.",a:true},
  {q:"Organic farming reduces pollution.",a:true},
  {q:"Rainwater harvesting saves water.",a:true},
  {q:"Eco choices matter.",a:true},
  {q:"Forests protect biodiversity.",a:true},
  {q:"Reducing waste helps planet.",a:true},
  {q:"Plastic pollution harms health.",a:true},
  {q:"Using bicycles reduces emissions.",a:true},
  {q:"Sustainability is long-term.",a:true},
  {q:"Throwing waste in rivers is safe.",a:false},
  {q:"Public awareness reduces pollution.",a:true},
  {q:"Nature can recover with care.",a:true},
  {q:"Small actions make no difference.",a:false}
];

let quiz = [], index = 0, score = 0, timer;

function startQuiz() {
  quiz = [...questions].sort(() => 0.5 - Math.random()).slice(0, 5);
  index = 0;
  score = 0;
  show("quiz");
  loadQuestion();
}

function loadQuestion() {
  if (index >= quiz.length) {
    document.getElementById("scoreText").innerText =
      `Score: ${score}/5`;
    document.getElementById("feedback").innerText =
      score >= 3 ? "Great eco awareness 🌟" : "Every step counts 🌱";
    show("quizResult");
    return;
  }

  document.getElementById("question").innerText = quiz[index].q;
  const options = document.getElementById("options");
  options.innerHTML = "";

  ["True", "False"].forEach(choice => {
    const btn = document.createElement("button");
    btn.innerText = choice;
    btn.onclick = () => {
      if ((choice === "True") === quiz[index].a) score++;
      clearInterval(timer);
      index++;
      loadQuestion();
    };
    options.appendChild(btn);
  });

  let time = 6;
  document.getElementById("timer").innerText = `⏳ ${time}`;
  timer = setInterval(() => {
    time--;
    document.getElementById("timer").innerText = `⏳ ${time}`;
    if (time === 0) {
      clearInterval(timer);
      index++;
      loadQuestion();
    }
  }, 1000);
}

function restart() {
  show("scan");
  Quagga.start();
}

function showOutro() {
  show("outro");
}
