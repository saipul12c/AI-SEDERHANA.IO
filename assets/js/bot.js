// Fungsi untuk mengambil data dari file JSON berdasarkan bahasa
async function loadResponses(language) {
  const response = await fetch(`assets/data/${language}.json`);
  return response.json();
}

// Fungsi untuk menampilkan pesan di chat box
function displayMessage(message, sender) {
  const chatBox = document.getElementById('chat-box');
  const messageElement = document.createElement('div');
  messageElement.classList.add('message', sender === 'user' ? 'user-message' : 'bot-message');
  messageElement.textContent = message;
  chatBox.appendChild(messageElement);
  chatBox.scrollTop = chatBox.scrollHeight;
}

// Fungsi untuk beralih antara mode siang dan malam
function toggleTheme() {
  const body = document.getElementById('body');
  body.classList.toggle('dark-mode');

  const themeIcon = document.getElementById('theme-icon');
  if (body.classList.contains('dark-mode')) {
    themeIcon.innerHTML = '<path d="M12 2a10 10 0 0 0 0 20 10 10 0 0 0 0-20zm0 18a8 8 0 1 1 0-16 8 8 0 0 1 0 16z"></path>';
  } else {
    themeIcon.innerHTML = '<path d="M12 3a1 1 0 100-2 1 1 0 000 2zm6.364.636a1 1 0 011.414 1.414l-1.828 1.828a1 1 0 11-1.414-1.414zM21 12a1 1 0 100-2 1 1 0 000 2zm-3.636 6.364a1 1 0 011.414 1.414l-1.828 1.828a1 1 0 11-1.414-1.414zm-6.364 1.636a1 1 0 100-2 1 1 0 000 2zM3.636 17.778a1 1 0 111.414-1.414l1.828 1.828a1 1 0 11-1.414 1.414zm-1.636-5.778a1 1 0 110-2 1 1 0 010 2zM5.364 4.05a1 1 0 111.414 1.414L4.95 7.292a1 1 0 11-1.414-1.414zM12 15a3 3 0 110-6 3 3 0 010 6z"></path>';
  }
}

// Fungsi untuk mendeteksi bahasa dan mencari respons
async function detectLanguageAndRespond(userMessage) {
  const responsesEn = await loadResponses('en');
  const responsesId = await loadResponses('id');

  const matchEn = findBestMatch(userMessage, responsesEn);
  const matchId = findBestMatch(userMessage, responsesId);

  // Pilih respons berdasarkan bahasa dengan tingkat kesamaan tertinggi
  let response;
  if (matchEn.similarity > matchId.similarity && matchEn.similarity > 0.3) {
    response = getRandomResponse(matchEn.response);
  } else if (matchId.similarity > 0.3) {
    response = getRandomResponse(matchId.response);
  } else {
    response = "I'm sorry, I didn't quite get that. Could you rephrase?";
  }

  return response;
}

// Fungsi untuk memilih respons secara acak jika ada beberapa opsi
function getRandomResponse(responses) {
  if (Array.isArray(responses)) {
    return responses[Math.floor(Math.random() * responses.length)];
  }
  return responses;
}

// Fungsi untuk mencocokkan pesan pengguna dengan respons yang sesuai
function findBestMatch(message, responses) {
  message = message.toLowerCase();
  let bestMatch = { response: "", similarity: 0 };

  for (const [key, response] of Object.entries(responses)) {
    const similarity = calculateSimilarity(message, key.toLowerCase());
    if (similarity > bestMatch.similarity) {
      bestMatch = { response, similarity };
    }
  }
  return bestMatch;
}

// Fungsi sederhana untuk menghitung kesamaan antara dua string
function calculateSimilarity(input, pattern) {
  const words = pattern.split(" ");
  let matches = 0;

  for (const word of words) {
    if (input.includes(word)) {
      matches++;
    }
  }
  return matches / words.length;
}

// Fungsi untuk mengirim pesan pengguna dan mendapatkan respons AI
async function sendMessage() {
  const userInput = document.getElementById('user-input');
  const userMessage = userInput.value.trim();
  if (userMessage === '') return;

  displayMessage(userMessage, 'user');
  userInput.value = '';

  const response = await detectLanguageAndRespond(userMessage);
  displayMessage(response, 'bot');
}
