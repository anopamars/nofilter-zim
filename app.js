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
  localStorage.removeItem('nfz_expires_at');
  localStorage.removeItem('nfz_views');
  localStorage.removeItem('nfz_roast_score');
  localStorage.removeItem('nfz_leaderboard');
  localStorage.removeItem('nfz_current_battle');
}