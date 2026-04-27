// No Filter Zim — app.js
// Shared utilities

function getProfile() {
  return JSON.parse(localStorage.getItem('nfz_profile') || '{}');
}

function getAnswers() {
  return JSON.parse(localStorage.getItem('nfz_answers') || '[]');
}

function clearData() {
  localStorage.removeItem('nfz_profile');
  localStorage.removeItem('nfz_answers');
  localStorage.removeItem('nfz_response_count');
}