document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('loginForm');
  if (form) form.addEventListener('submit', loginUser);
  updateNavbar();
});