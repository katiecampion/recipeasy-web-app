document.addEventListener('DOMContentLoaded', () => {
  const form = document.querySelector('form');
  if (!form) return;
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const username = document.getElementById('regUsername').value.trim();
    const email = document.getElementById('regEmail').value.trim();
    const password = document.getElementById('regPassword').value.trim();
    const r = await fetch('/api/auth/register', {
      method:'POST', headers:{'Content-Type':'application/json'}, credentials:'include',
      body: JSON.stringify({ username, email, password })
    });
    const j = await r.json().catch(()=>({ok:false}));
    if (j.ok) { window.location = 'login.html'; } else { alert('Register failed'); }
  });
});