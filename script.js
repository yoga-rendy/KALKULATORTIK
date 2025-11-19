// Tema toggle (dark / light)
const themeBtn = document.getElementById('themeBtn');
themeBtn.addEventListener('click', () => {
  document.body.classList.toggle('dark-mode');
  themeBtn.textContent =
    document.body.classList.contains('dark-mode') ? '☀ Light Mode' : '🌙 Dark Mode';

  localStorage.setItem(
    'theme',
    document.body.classList.contains('dark-mode') ? 'dark' : 'light'
  );
});

// Inisialisasi tema sesuai preferensi atau sistem
(function initTheme() {
  const saved = localStorage.getItem('theme');
  if (
    saved === 'dark' ||
    (!saved && window.matchMedia('(prefers-color-scheme: dark)').matches)
  ) {
    document.body.classList.add('dark-mode');
    themeBtn.textContent = '☀ Light Mode';
  } else {
    themeBtn.textContent = '🌙 Dark Mode';
  }
})();


// =======================
// SUBNET CALCULATOR
// =======================
document.getElementById('calcBtn').addEventListener('click', () => {
  const ip = document.getElementById('ipInput').value.trim();
  const mask = parseInt(document.getElementById('maskInput').value, 10);
  const resultDiv = document.getElementById('calcResult');
  const stepsContainer = document.getElementById('stepByStepContainer');
  const stepsList = document.getElementById('stepsList');

  stepsList.innerHTML = '';
  stepsContainer.style.display = 'none';

  if (!ip || isNaN(mask) || mask < 0 || mask > 32) {
    resultDiv.innerHTML = `<p style="color:red;">Masukkan IP & subnet mask valid!</p>`;
    return;
  }

  const octets = ip.split('.');
  if (
    octets.length !== 4 ||
    octets.some(o => {
      const n = parseInt(o, 10);
      return isNaN(n) || n < 0 || n > 255;
    })
  ) {
    resultDiv.innerHTML = `<p style="color:red;">Format IP tidak valid!</p>`;
    return;
  }

  const ipNum =
    (octets[0] << 24) | (octets[1] << 16) | (octets[2] << 8) | octets[3];
  const maskBits = mask;
  const maskNum =
    maskBits === 0 ? 0 : (0xffffffff << (32 - maskBits)) >>> 0;
  const netAddrNum = ipNum & maskNum;
  const broadAddrNum = netAddrNum | (~maskNum >>> 0);

  const net = [
    (netAddrNum >>> 24) & 255,
    (netAddrNum >>> 16) & 255,
    (netAddrNum >>> 8) & 255,
    netAddrNum & 255,
  ].join('.');

  const broad = [
    (broadAddrNum >>> 24) & 255,
    (broadAddrNum >>> 16) & 255,
    (broadAddrNum >>> 8) & 255,
    broadAddrNum & 255,
  ].join('.');

  const totalHosts =
    maskBits >= 31 ? (maskBits === 31 ? 2 : 1) : Math.pow(2, 32 - maskBits) - 2;

  resultDiv.innerHTML = `
    <div class="result-box">
      <h3>Hasil Perhitungan</h3>
      <p><b>Network Address:</b> ${net}</p>
      <p><b>Broadcast Address:</b> ${broad}</p>
      <p><b>Jumlah Host:</b> ${totalHosts.toLocaleString()}</p>
    </div>
  `;

  stepsContainer.style.display = 'block';
  stepsList.innerHTML = `
    <li>Alamat IP dalam decimal: ${ip}</li>
    <li>Alamat IP dalam biner: ${octets
      .map(o => ('00000000' + parseInt(o, 10).toString(2)).slice(-8))
      .join('.')}</li>
    <li>Prefix / mask: /${maskBits}</li>
    <li>Mask dalam biner: ${(
      '00000000000000000000000000000000' + maskNum.toString(2)
    )
      .slice(-32)
      .match(/.{8}/g)
      .join('.')}</li>
    <li>Network address (IP AND mask): ${net}</li>
    <li>Broadcast address (network OR ~mask): ${broad}</li>
    <li>Jumlah host valid dalam subnet: ${totalHosts.toLocaleString()}</li>
  `;
});

document.getElementById('resetBtn').addEventListener('click', () => {
  document.getElementById('ipInput').value = '';
  document.getElementById('maskInput').value = '';
  document.getElementById('calcResult').innerHTML = '';
  document.getElementById('stepByStepContainer').style.display = 'none';
});


// =======================
// QUIZ (PILIHAN GANDA)
// =======================

const quizLevels = {
  easy: [
    {
      q: "Apa kepanjangan dari IP?",
      choices: ["Internal Process", "Internet Program", "Internet Protocol", "Intranet Packet"],
      a: "Internet Protocol"
    },
    {
      q: "Berapa bit yang terdapat pada satu alamat IPv4?",
      choices: ["32 bit", "16 bit", "64 bit", "128 bit"],
      a: "32 bit"
    },
    {
      q: "Berapa banyak oktet pada alamat IPv4?",
      choices: ["8 oktet", "4 oktet", "2 oktet", "6 oktet"],
      a: "4 oktet"
    },
    {
      q: "Contoh IP Address kelas A adalah?",
      choices: ["172.16.0.1", "10.0.0.1", "192.168.1.1", "255.0.0.1"],
      a: "10.0.0.1"
    },
    {
      q: "Contoh IP Address kelas B adalah?",
      choices: ["172.16.0.1", "192.168.1.1", "10.0.0.1", "255.255.0.1"],
      a: "172.16.0.1"
    },
    {
      q: "Contoh IP Address kelas C adalah?",
      choices: ["192.168.1.1", "172.16.0.1", "255.255.255.255", "10.0.0.1"],
      a: "192.168.1.1"
    },
    {
      q: "Berapa rentang IP kelas A?",
      choices: ["128.0.0.0 – 191.255.255.255", "1.0.0.0 – 126.255.255.255", "224.0.0.0 – 239.255.255.255", "192.168.0.0 – 192.168.255.255"],
      a: "1.0.0.0 – 126.255.255.255"
    },
    {
      q: "Berapa subnet mask default untuk kelas B?",
      choices: ["255.255.0.0", "255.0.0.0", "255.255.255.128", "255.255.255.0"],
      a: "255.255.0.0"
    },
    {
      q: "IP 127.0.0.1 biasa digunakan untuk apa?",
      choices: ["Loopback atau localhost", "Broadcast", "Multicast", "Default Gateway"],
      a: "Loopback atau localhost"
    },
    {
      q: "Berapa subnet mask default untuk kelas C?",
      choices: ["255.255.255.0", "255.255.0.0", "255.0.0.0", "255.255.255.128"],
      a: "255.255.255.0"
    }
  ],

  medium: [
    {
      q: "Berapa jumlah host yang bisa digunakan pada subnet dengan prefix /24?",
      choices: ["254 host", "128 host", "256 host", "512 host"],
      a: "254 host"
    },
    {
      q: "Jika subnet mask 255.255.255.0, berapa prefix-nya?",
      choices: ["/24", "/25", "/26", "/23"],
      a: "/24"
    },
    {
      q: "IP 192.168.10.1/24 memiliki network address apa?",
      choices: ["192.168.10.0", "192.168.10.255", "192.168.10.1", "192.168.10.128"],
      a: "192.168.10.0"
    },
    {
      q: "IP 192.168.10.1/24 memiliki broadcast address apa?",
      choices: ["192.168.10.255", "192.168.10.128", "192.168.10.0", "192.168.10.1"],
      a: "192.168.10.255"
    },
    {
      q: "Jika subnet mask 255.255.255.128, berapa prefix-nya?",
      choices: ["/25", "/26", "/24", "/23"],
      a: "/25"
    },
    {
      q: "Dengan subnet mask /25, berapa host yang bisa digunakan?",
      choices: ["126 host", "128 host", "64 host", "254 host"],
      a: "126 host"
    },
    {
      q: "IP 192.168.1.130/25 berada di network berapa?",
      choices: ["192.168.1.128/25", "192.168.1.192/25", "192.168.1.64/25", "192.168.1.0/25"],
      a: "192.168.1.128/25"
    },
    {
      q: "Berapa broadcast address dari 192.168.1.128/25?",
      choices: ["192.168.1.255", "192.168.1.254", "192.168.1.128", "192.168.1.129"],
      a: "192.168.1.255"
    },
    {
      q: "Jika IP 10.0.0.1/8, berapa jumlah host yang bisa digunakan?",
      choices: ["16.777.214 host", "254 host", "65.534 host", "16.777.216 host"],
      a: "16.777.214 host"
    },
    {
      q: "Subnet mask 255.255.255.192 memiliki prefix apa?",
      choices: ["/26", "/24", "/25", "/22"],
      a: "/26"
    }
  ],

  hard: [
    {
      q: "Diketahui IP 192.168.10.33/27, network address-nya adalah …",
      choices: ["192.168.10.32", "192.168.10.0", "192.168.10.64", "192.168.10.33"],
      a: "192.168.10.32"
    },
    {
      q: "Broadcast address dari 192.168.10.33/27 adalah …",
      choices: ["192.168.10.63", "192.168.10.34", "192.168.10.32", "192.168.10.95"],
      a: "192.168.10.63"
    },
    {
      q: "Berapa host valid untuk subnet /27?",
      choices: ["30", "28", "32", "29"],
      a: "30"
    },
    {
      q: "IP 192.168.5.77/26 berada di network …",
      choices: ["192.168.5.64/26", "192.168.5.0/26", "192.168.5.128/26", "192.168.5.192/26"],
      a: "192.168.5.64/26"
    },
    {
      q: "Broadcast address dari 192.168.5.64/26 adalah …",
      choices: ["192.168.5.127", "192.168.5.64", "192.168.5.126", "192.168.5.255"],
      a: "192.168.5.127"
    },
    {
      q: "IP 172.16.4.130/20 memiliki network address apa?",
      choices: ["172.16.0.0", "172.16.4.0", "172.16.8.0", "172.16.15.0"],
      a: "172.16.0.0"
    },
    {
      q: "IP 172.16.4.130/20 memiliki broadcast address apa?",
      choices: ["172.16.15.255", "172.16.4.255", "172.16.31.255", "172.16.0.255"],
      a: "172.16.15.255"
    },
    {
      q: "Jika prefix /30, berapa host valid maksimal?",
      choices: ["2", "4", "1", "8"],
      a: "2"
    },
    {
      q: "Subnet mask dari prefix /30 adalah …",
      choices: ["255.255.255.252", "255.255.255.248", "255.255.255.240", "255.255.255.224"],
      a: "255.255.255.252"
    },
    {
      q: "Network address dari IP 10.10.8.1/21 adalah …",
      choices: ["10.10.8.0", "10.10.0.0", "10.10.16.0", "10.10.8.1"],
      a: "10.10.8.0"
    }
  ]
};

// =======================
// QUIZ RENDER LOGIC
// =======================

let quizLevel = "easy";
let quizIndex = 0;
let score = 0;

const levelSelect = document.getElementById("quizLevelSelect");
const startBtn = document.getElementById("startQuizBtn");
const nextBtn = document.getElementById("nextQuizBtn");
const quizContainer = document.getElementById("quizContainer");
const quizStats = document.getElementById("quizStats");

startBtn.addEventListener("click", () => {
  quizLevel = levelSelect.value;
  quizIndex = 0;
  score = 0;
  nextBtn.style.display = "none";
  quizStats.textContent = `Skor: 0 / ${quizLevels[quizLevel].length}`;
  renderQuestion();
});

nextBtn.addEventListener("click", () => {
  quizIndex++;
  if (quizIndex >= quizLevels[quizLevel].length) {
    quizContainer.innerHTML = `<p>Selesai level <b>${quizLevel}</b>! Skor kamu: ${score}/${quizLevels[quizLevel].length}</p>`;
    quizStats.textContent = `Skor: ${score} / ${quizLevels[quizLevel].length}`;
    nextBtn.style.display = "none";
  } else {
    renderQuestion();
  }
});

function renderQuestion() {
  const current = quizLevels[quizLevel][quizIndex];
  quizContainer.innerHTML = `
    <p><b>Pertanyaan ${quizIndex + 1} dari ${
    quizLevels[quizLevel].length
  }</b></p>
    <p>${current.q}</p>
    ${current.choices
      .map(
        (c, i) => `
      <div class="choice-container">
        <input type="radio" name="quizChoice" id="choice${i}" value="${c}">
        <label for="choice${i}">${String.fromCharCode(65 + i)}. ${c}</label>
      </div>`
      )
      .join("")}
    <button id="checkBtn">Periksa Jawaban</button>
    <div id="quizFeedback"></div>
  `;

  document.getElementById("checkBtn").onclick = () => {
    const selected = document.querySelector(
      'input[name="quizChoice"]:checked'
    );
    const feedback = document.getElementById("quizFeedback");

    if (!selected) {
      feedback.textContent = "Pilih salah satu jawaban!";
      return;
    }

    if (selected.value === current.a) {
      feedback.textContent = "✅ Benar!";
      score++;
    } else {
      feedback.textContent = `❌ Salah! Jawaban benar: ${current.a}`;
    }

    quizStats.textContent = `Skor: ${score} / ${
      quizLevels[quizLevel].length
    }`;
    nextBtn.style.display = "inline-block";
  };
}


// =======================
// AI MENTOR
// =======================
document.getElementById("mentorSendBtn").addEventListener("click", () => {
  const input = document.getElementById("mentorInput").value.trim().toLowerCase();
  const bubble = document.getElementById("mentorResponse");
  if (!input) return;

  bubble.textContent = "…sedang berpikir…";

  setTimeout(() => {
    let response = "";

    if (input.includes("subnet mask")) {
      response = "Subnet mask adalah pembagi antara bagian network dan host pada IP.";
    } else if (input.includes("ip address")) {
      response = "IP address adalah alamat unik untuk tiap perangkat di jaringan.";
    } else if (input.includes("host")) {
      response = "Host adalah perangkat akhir seperti PC, laptop, ponsel, atau printer.";
    } else {
      response = "Pertanyaan menarik! Coba lebih spesifik ya, misalnya 'cara hitung host?' atau 'apa itu broadcast?'.";
    }

    bubble.textContent = response;
  }, 800);
});
