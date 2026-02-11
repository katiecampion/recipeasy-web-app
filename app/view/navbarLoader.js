document.addEventListener("DOMContentLoaded", () => {
  fetch("navbar.html")
    .then(res => res.text())
    .then(html => {
      document.getElementById("navbar").innerHTML = html;

      // Hamburger
      const burger = document.querySelector('.hamburger');
      if (burger) burger.addEventListener('click', () => {
        const m = document.querySelector('#mobileMenu');
        if (m) m.style.display = (m.style.display === 'block' ? 'none' : 'block');
      });

      // Logout
      document.getElementById('nav-logout')?.addEventListener('click', (e) => { e.preventDefault(); logoutUser(); });
      document.getElementById('m-logout')?.addEventListener('click', (e) => { e.preventDefault(); logoutUser(); });

      updateNavbar();

      // Guard protected links only
      (async () => {
        const auth = await getAuthState();
        const protectIds = [
          'nav-myrecipes','nav-saved','nav-addrecipe','nav-pantry','nav-shopping','nav-account',
          'm-myrecipes','m-saved','m-addrecipe','m-pantry','m-shopping','m-account'
        ];
        protectIds.forEach(id => {
          const el = document.getElementById(id);
          if (!el) return;
          el.addEventListener('click', (e) => {
            if (!auth.authenticated) {
              e.preventDefault();
              const next = el.getAttribute('href') || 'index.html';
              window.location = `login.html?next=${encodeURIComponent(next)}`;
            }
          });
        });
      })();
    });
});
