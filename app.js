const screens = document.querySelectorAll('.screen');

function showScreen(id) {
  screens.forEach(s => s.classList.remove('active'));
  document.getElementById(id).classList.add('active');
}

/* =======================
   BARCODE SCANNING
======================= */

Quagga.init({
  inputStream: {
    name: "Live",
    type: "LiveStream",
    target: document.querySelector("#scanner-container"),
    constraints: {
      facingMode: "environment"
    }
  },
  decoder: {
    readers: ["code_128_reader", "ean_reader", "ean_8_reader"]
  }
}, function (err) {
  if (!err) {
    Quagga.start();
  }
});

Quagga.onDetected(data => {
  const code = data.codeResult.code;
  if (!productEcoDB[code]) return;

  Quagga.stop();
  showTreeResult(productEcoDB[code]);
});

/* =======================
   TREE RESULT
======================= */

function showTreeResult(product) {
  showScreen('screen-tree');

  document.getElementById('product-name').textContent = product.name;
  document.getElementById('eco-score').textContent = `Eco Score: ${product.score}/100`;

  document.querySelector('.trunk')
    .style.setProperty('--trunk-height', product.score * 1.5 + 'px');

  document.querySelector('.leaves')
    .style.setProperty('--leaf-size', product.score + 'px');

  setTimeout(() => showScreen('screen-quiz-prompt'), 3500);
}

/* =======================
   QUIZ LOGIC
======================= */

let quizPool = [];
let quizIndex = 0;
let quizScore = 0;
let timer;

function startQuiz() {
  quizPool = shuffle([...quizQuestions]).slice(0, 5);
  quizIndex = 0;
  quizScore = 0;
  showScreen('screen-quiz');
  loadQuiz();
}

function loadQuiz() {
  if (quizIndex >= quizPool.length) {
    document.getElementById('quiz-result-text')
      .textContent = `You scored ${quizScore}/5 🌟`;
    showScreen('screen-quiz-result');
    return;
  }

  const q = quizPool[quizIndex];
  document.getElementById('quiz-question').textContent = q.q;
  const opts = document.getElementById('quiz-options');
  opts.innerHTML = '';

  ['True', 'False'].forEach(v => {
    const btn = document.createElement('button');
    btn.textContent = v;
    btn.onclick = () => {
      if ((v === 'True') === q.a) quizScore++;
      clearInterval(timer);
      quizIndex++;
      loadQuiz();
    };
    opts.appendChild(btn);
  });

  let timeLeft = 6;
  document.getElementById('timer').textContent = `⏳ ${timeLeft}`;

  timer = setInterval(() => {
    timeLeft--;
    document.getElementById('timer').textContent = `⏳ ${timeLeft}`;
    if (timeLeft <= 0) {
      clearInterval(timer);
      quizIndex++;
      loadQuiz();
    }
  }, 1000);
}

/* =======================
   RESTART / OUTRO
======================= */

function restartApp() {
  location.reload();
}

function showOutro() {
  showScreen('screen-outro');
}

function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}
