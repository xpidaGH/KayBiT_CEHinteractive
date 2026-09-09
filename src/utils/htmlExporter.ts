import { CEHDomain, QuizQuestion } from '../types';

export function exportSingleFileHtmlApp(
  domains: CEHDomain[],
  questions: QuizQuestion[],
  studentNotes: string
): string {
  const serializedDomains = JSON.stringify(domains);
  const serializedQuestions = JSON.stringify(questions);
  const escapedNotes = JSON.stringify(studentNotes);

  return `<!doctype html>
<html lang="en" data-bs-theme="dark">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>KayBiT_CEHinteractive — Standalone Single-File Edition</title>
  <!-- Bootstrap 5.3.3 CSS -->
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css">
  <style>
    :root {
      --cyber-bg: #0d1117;
      --cyber-surface: #161b22;
      --cyber-border: #30363d;
      --cyber-blue: #58a6ff;
      --cyber-green: #3fb950;
      --cyber-yellow: #d29922;
      --cyber-red: #f85149;
    }
    body {
      background-color: var(--cyber-bg);
      color: #e6edf3;
      font-family: system-ui, -apple-system, sans-serif;
      padding-bottom: 60px;
    }
    .mono { font-family: 'Courier New', Courier, monospace; }
    .card {
      background-color: var(--cyber-surface);
      border-color: var(--cyber-border);
    }
    .badge-mastered { background-color: #238636; }
    .badge-progress { background-color: #9e6a03; }
    .badge-notstarted { background-color: #21262d; }
  </style>
</head>
<body>
  <div class="container py-4">
    <!-- Header -->
    <header class="d-flex flex-wrap justify-content-between align-items-center pb-3 mb-4 border-bottom border-secondary">
      <div>
        <h1 class="h3 text-info fw-bold mb-1">KayBiT_CEHinteractive <span class="badge bg-success fs-6">Single-File Edition</span></h1>
        <p class="text-secondary small mb-0">100% Offline Standalone CEH v13 Study Suite • LocalStorage Persistent</p>
      </div>
      <div>
        <button class="btn btn-outline-info btn-sm me-2" onclick="saveToLocalStorage()">💾 Save All Changes</button>
        <button class="btn btn-outline-danger btn-sm" onclick="resetAllState()">🔄 Reset Progress</button>
      </div>
    </header>

    <!-- Nav Tabs -->
    <ul class="nav nav-pills mb-4" id="pills-tab" role="tablist">
      <li class="nav-item" role="presentation">
        <button class="nav-link active" id="tab-domains" data-bs-toggle="pill" data-bs-target="#content-domains" type="button">1. Domain Tracker (20 Modules)</button>
      </li>
      <li class="nav-item" role="presentation">
        <button class="nav-link" id="tab-quiz" data-bs-toggle="pill" data-bs-target="#content-quiz" type="button">2. Mock Quiz Engine</button>
      </li>
      <li class="nav-item" role="presentation">
        <button class="nav-link" id="tab-nmap" data-bs-toggle="pill" data-bs-target="#content-nmap" type="button">3. Nmap Command Builder</button>
      </li>
      <li class="nav-item" role="presentation">
        <button class="nav-link" id="tab-notes" data-bs-toggle="pill" data-bs-target="#content-notes" type="button">4. Offline Notes</button>
      </li>
    </ul>

    <!-- Tab Contents -->
    <div class="tab-content" id="pills-tabContent">
      <!-- 1. Domains -->
      <div class="tab-pane fade show active" id="content-domains" role="tabpanel">
        <div class="row row-cols-1 row-cols-md-2 g-3" id="domainsList"></div>
      </div>

      <!-- 2. Quiz -->
      <div class="tab-pane fade" id="content-quiz" role="tabpanel">
        <div class="card p-4">
          <div class="d-flex justify-content-between align-items-center mb-3">
            <h4 class="card-title text-info" id="quizQuestionTitle">CEH v13 Mock Question</h4>
            <span class="badge bg-secondary" id="quizDifficulty">Difficulty</span>
          </div>
          <p class="lead" id="quizQuestionText">Loading quiz question...</p>
          <div class="d-grid gap-2 mb-3" id="quizOptionsContainer"></div>
          <div id="quizFeedback" class="alert d-none mt-2"></div>
          <div class="d-flex justify-content-between align-items-center mt-3">
            <button class="btn btn-secondary btn-sm" onclick="prevQuizQuestion()">Previous</button>
            <span class="text-secondary small" id="quizProgressTracker">Question 1 of 15</span>
            <button class="btn btn-primary btn-sm" onclick="nextQuizQuestion()">Next Question</button>
          </div>
        </div>
      </div>

      <!-- 3. Nmap Builder -->
      <div class="tab-pane fade" id="content-nmap" role="tabpanel">
        <div class="card p-4">
          <h4 class="text-info mb-3">Interactive Nmap Command Generator</h4>
          <div class="row g-3 mb-3">
            <div class="col-md-6">
              <label class="form-label text-secondary small">Target Specification</label>
              <input type="text" id="nmapTarget" class="form-control mono" value="192.168.1.100" oninput="updateNmapCommand()">
            </div>
            <div class="col-md-6">
              <label class="form-label text-secondary small">Ports Specification</label>
              <input type="text" id="nmapPorts" class="form-control mono" value="21,22,80,443,445" oninput="updateNmapCommand()">
            </div>
          </div>
          <div class="row g-2 mb-3">
            <div class="col-md-3">
              <div class="form-check">
                <input class="form-check-input" type="checkbox" id="flagSYN" checked onchange="updateNmapCommand()">
                <label class="form-check-label mono">-sS (SYN Stealth)</label>
              </div>
            </div>
            <div class="col-md-3">
              <div class="form-check">
                <input class="form-check-input" type="checkbox" id="flagUDP" onchange="updateNmapCommand()">
                <label class="form-check-label mono">-sU (UDP Scan)</label>
              </div>
            </div>
            <div class="col-md-3">
              <div class="form-check">
                <input class="form-check-input" type="checkbox" id="flagOS" checked onchange="updateNmapCommand()">
                <label class="form-check-label mono">-O (OS Detection)</label>
              </div>
            </div>
            <div class="col-md-3">
              <div class="form-check">
                <input class="form-check-input" type="checkbox" id="flagVuln" onchange="updateNmapCommand()">
                <label class="form-check-label mono">--script=vuln</label>
              </div>
            </div>
          </div>
          <div class="p-3 bg-black rounded border border-secondary mb-3">
            <span class="text-secondary small d-block mb-1">Generated Shell Command:</span>
            <code class="text-success fs-5 fw-bold mono" id="nmapOutputCommand">nmap -sS -O -p 21,22,80,443,445 192.168.1.100</code>
          </div>
          <button class="btn btn-outline-light btn-sm" onclick="copyNmapCommand()">📋 Copy Command to Clipboard</button>
        </div>
      </div>

      <!-- 4. Notes -->
      <div class="tab-pane fade" id="content-notes" role="tabpanel">
        <div class="card p-4">
          <h4 class="text-info mb-2">Offline Student Notes & Cheat Sheet</h4>
          <p class="text-secondary small">Changes are automatically mirrored in your browser's local storage.</p>
          <textarea id="standaloneNotesArea" class="form-control mono bg-dark text-light border-secondary" rows="14" oninput="saveNotes()"></textarea>
        </div>
      </div>
    </div>
  </div>

  <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>
  <script>
    let appDomains = JSON.parse(localStorage.getItem('kaybit_ceh_standalone_domains') || '${serializedDomains.replace(/\\/g, '\\\\').replace(/'/g, "\\'")}');
    let appQuestions = JSON.parse(localStorage.getItem('kaybit_ceh_standalone_questions') || '${serializedQuestions.replace(/\\/g, '\\\\').replace(/'/g, "\\'")}');
    let currentQuizIndex = 0;

    function renderDomains() {
      const container = document.getElementById('domainsList');
      container.innerHTML = '';
      appDomains.forEach((d, idx) => {
        const col = document.createElement('div');
        col.className = 'col';
        col.innerHTML = \`
          <div class="card h-100 p-3">
            <div class="d-flex justify-content-between align-items-start mb-2">
              <span class="badge bg-secondary mono">\${d.code}</span>
              <select class="form-select form-select-sm w-auto" onchange="updateDomainStatus(\${idx}, this.value)">
                <option value="not_started" \${d.status==='not_started'?'selected':''}>Not Started</option>
                <option value="in_progress" \${d.status==='in_progress'?'selected':''}>In Progress</option>
                <option value="mastered" \${d.status==='mastered'?'selected':''}>Mastered</option>
              </select>
            </div>
            <h5 class="card-title text-light">\${d.title}</h5>
            <p class="text-secondary small mb-2">\${d.description}</p>
            <div class="mt-auto">
              <span class="badge bg-dark border border-secondary text-info">\${d.keyTools ? d.keyTools.join(', ') : ''}</span>
            </div>
          </div>
        \`;
        container.appendChild(col);
      });
    }

    function updateDomainStatus(index, status) {
      appDomains[index].status = status;
      localStorage.setItem('kaybit_ceh_standalone_domains', JSON.stringify(appDomains));
    }

    function renderCurrentQuiz() {
      const q = appQuestions[currentQuizIndex];
      if (!q) return;
      document.getElementById('quizQuestionTitle').innerText = q.domainName + ' (' + (q.cveOrTool || 'Concept') + ')';
      document.getElementById('quizDifficulty').innerText = q.difficulty;
      document.getElementById('quizQuestionText').innerText = q.question;
      document.getElementById('quizProgressTracker').innerText = \`Question \${currentQuizIndex + 1} of \${appQuestions.length}\`;
      
      const optContainer = document.getElementById('quizOptionsContainer');
      optContainer.innerHTML = '';
      document.getElementById('quizFeedback').className = 'alert d-none mt-2';

      q.options.forEach((opt, idx) => {
        const btn = document.createElement('button');
        btn.className = 'btn btn-outline-light text-start p-3';
        btn.innerText = String.fromCharCode(65 + idx) + '. ' + opt;
        btn.onclick = () => selectQuizOption(idx);
        optContainer.appendChild(btn);
      });
    }

    function selectQuizOption(idx) {
      const q = appQuestions[currentQuizIndex];
      const feedback = document.getElementById('quizFeedback');
      feedback.classList.remove('d-none', 'alert-success', 'alert-danger');
      if (idx === q.correctIndex) {
        feedback.classList.add('alert-success');
        feedback.innerHTML = '<strong>Correct!</strong> ' + q.explanation;
      } else {
        feedback.classList.add('alert-danger');
        feedback.innerHTML = '<strong>Incorrect.</strong> ' + q.explanation;
      }
    }

    function nextQuizQuestion() {
      if (currentQuizIndex < appQuestions.length - 1) {
        currentQuizIndex++;
        renderCurrentQuiz();
      }
    }

    function prevQuizQuestion() {
      if (currentQuizIndex > 0) {
        currentQuizIndex--;
        renderCurrentQuiz();
      }
    }

    function updateNmapCommand() {
      const target = document.getElementById('nmapTarget').value || '127.0.0.1';
      const ports = document.getElementById('nmapPorts').value;
      const syn = document.getElementById('flagSYN').checked ? '-sS ' : '';
      const udp = document.getElementById('flagUDP').checked ? '-sU ' : '';
      const os = document.getElementById('flagOS').checked ? '-O ' : '';
      const vuln = document.getElementById('flagVuln').checked ? '--script=vuln ' : '';
      const portSwitch = ports ? '-p ' + ports + ' ' : '';
      
      const cmd = \`nmap \${syn}\${udp}\${os}\${vuln}\${portSwitch}\${target}\`.replace(/\\s+/g, ' ').trim();
      document.getElementById('nmapOutputCommand').innerText = cmd;
    }

    function copyNmapCommand() {
      const text = document.getElementById('nmapOutputCommand').innerText;
      navigator.clipboard.writeText(text);
      alert('Copied Nmap command to clipboard: ' + text);
    }

    function saveNotes() {
      const text = document.getElementById('standaloneNotesArea').value;
      localStorage.setItem('kaybit_ceh_standalone_notes', text);
    }

    function saveToLocalStorage() {
      localStorage.setItem('kaybit_ceh_standalone_domains', JSON.stringify(appDomains));
      alert('All progress, domains, and quiz states saved in localStorage!');
    }

    function resetAllState() {
      if (confirm('Reset all domain progress and return to default?')) {
        localStorage.removeItem('kaybit_ceh_standalone_domains');
        localStorage.removeItem('kaybit_ceh_standalone_notes');
        location.reload();
      }
    }

    window.onload = function() {
      renderDomains();
      renderCurrentQuiz();
      updateNmapCommand();
      const savedNotes = localStorage.getItem('kaybit_ceh_standalone_notes') || ${escapedNotes};
      document.getElementById('standaloneNotesArea').value = savedNotes;
    };
  </script>
</body>
</html>`;
}
