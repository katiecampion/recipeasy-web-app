/* ============================================================
   FETCH DEFAULTS
============================================================ */
(function () {
  const f = window.fetch;
  window.fetch = (input, init = {}) =>
    f(input, { credentials: "same-origin", ...init });
})();

/* ============================================================
   AUTH
============================================================ */
async function loginUser(event) {
  if (event) event.preventDefault();

  const email = document.getElementById("loginEmail")?.value || "";
  const password = document.getElementById("loginPassword")?.value || "";

  const res = await fetch("/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
    credentials: "include"
  });

  const data = await res.json().catch(() => ({ ok: false }));

  if (data.ok) {
    const next =
      new URLSearchParams(location.search).get("next") || "index.html";
    location.href = next;
  } else {
    alert("Incorrect email or password.");
  }
}

async function logoutUser() {
  await fetch("/api/auth/logout", { method: "POST", credentials: "include" });
  location.href = "index.html";
}

async function getAuthState() {
  try {
    const r = await fetch("/api/auth/me", { credentials: "include" });
    if (!r.ok) return { authenticated: false };
    const u = await r.json();
    return { authenticated: !!u.authenticated, user: u };
  } catch {
    return { authenticated: false };
  }
}

/* ============================================================
   NAVBAR
============================================================ */
async function updateNavbar() {
  const auth = await getAuthState();

  const show = id =>
    document.getElementById(id)?.classList.remove("hidden");
  const hide = id =>
    document.getElementById(id)?.classList.add("hidden");

  [
    "nav-myrecipes","nav-saved","nav-addrecipe","nav-pantry","nav-shopping",
    "m-myrecipes","m-saved","m-addrecipe","m-pantry","m-shopping"
  ].forEach(show);

  if (auth.authenticated) {
    show("nav-account"); show("m-account");
    hide("nav-login"); hide("nav-register"); show("nav-logout");
    hide("m-login"); hide("m-register"); show("m-logout");
  } else {
    hide("nav-account"); hide("m-account");
    show("nav-login"); show("nav-register"); hide("nav-logout");
    show("m-login"); show("m-register"); hide("m-logout");
  }
}

/* ============================================================
   HOME / DISCOVER DISPLAY
============================================================ */
function displayCards(arr, containerId) {
  const box = document.getElementById(containerId);
  if (!box) return;

  box.innerHTML = "";

  if (!Array.isArray(arr) || !arr.length) {
    box.innerHTML = "<p>No recipes found.</p>";
    return;
  }

  arr.forEach(r => {
    const card = document.createElement("div");
    card.className = "recipe-card";

    card.innerHTML = `
      ${r.image ? `<img src="${r.image}" alt="">` : ""}
      <div class="recipe-meta">
        <div class="recipe-title">${r.title}</div>
        <div class="recipe-actions">
          <button class="btn btn-outline view-btn">View</button>
          <button class="btn save-btn">Save</button>
        </div>
      </div>
    `;

    card.querySelector(".view-btn").addEventListener("click", () => {
      location.href = `recipe.html?api=${r.id}`;
    });

    card.querySelector(".save-btn").addEventListener("click", () => {
      saveFavorite(
        String(r.id),
        r.title || "Untitled Recipe",
        r.image || null
      );
    });

    box.appendChild(card);
  });
}

/* ============================================================
   HOME (POPULAR)
============================================================ */
async function loadPopular() {
  try {
    const res = await fetch("/api/search/popular");
    const data = await res.json();

    const arr = Array.isArray(data)
      ? data
      : Array.isArray(data.recipes)
      ? data.recipes
      : [];

    displayCards(arr, "popularBox");
  } catch {
    displayCards([], "popularBox");
  }
}

/* ============================================================
   DISCOVER SEARCH
============================================================ */
async function searchByTitle() {
  const q = document.getElementById("searchInput")?.value.trim();
  if (!q) return alert("Enter a search term.");

  const res = await fetch(`/api/search?q=${encodeURIComponent(q)}`);
  const data = await res.json();

  displayCards(
    Array.isArray(data.results) ? data.results : data,
    "results"
  );
}

async function searchByIngredient() {
  const ing = document.getElementById("searchInput")?.value.trim();
  if (!ing) return alert("Enter an ingredient.");

  const res = await fetch(
    `/api/search/ingredients?i=${encodeURIComponent(ing)}`
  );
  const data = await res.json();

  displayCards(Array.isArray(data) ? data : [], "results");
}

async function searchByPantry() {
  const res = await fetch("/api/search/pantry", { credentials: "include" });

  if (res.status === 401) {
    alert("Please log in to use pantry search.");
    location.href = "login.html?next=discover.html";
    return;
  }

  const data = await res.json();
  displayCards(Array.isArray(data) ? data : [], "results");
}

/* ============================================================
   SAVED (ADD / VIEW / REMOVE)
============================================================ */
async function saveFavorite(id, title, image) {
  const res = await fetch("/api/saved/add", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ recipe_id: id, title, image })
  });

  if (!res.ok) {
    alert("Please log in to save.");
    location.href =
      "login.html?next=" +
      encodeURIComponent(location.pathname + location.search);
    return;
  }

  alert("Recipe saved!");
}

async function renderSaved() {
  const container = document.getElementById("savedBox");
  if (!container) return;

  const sortSelect = document.getElementById("savedSort");
  const sort = sortSelect ? sortSelect.value : "";

  const res = await fetch(`/api/saved?sort=${encodeURIComponent(sort)}`, {
    credentials: "include"
  });

  if (!res.ok) {
    container.innerHTML = "<p>Please log in to view saved recipes.</p>";
    return;
  }

  const data = await res.json();
  container.innerHTML = "";

  if (!Array.isArray(data) || !data.length) {
    container.innerHTML = "<p>No saved recipes yet.</p>";
    return;
  }

  data.forEach(r => {
    const card = document.createElement("div");
    card.className = "recipe-card";

    card.innerHTML = `
      ${r.image_url ? `<img src="${r.image_url}" alt="">` : ""}
      <h3>${r.title}</h3>
      <div class="recipe-actions">
        <button class="btn btn-outline">View</button>
        <button class="danger">Remove</button>
      </div>
    `;

    card.querySelector(".btn-outline").addEventListener("click", () => {
      if (r.api_recipe_id) {
        location.href = `recipe.html?api=${r.api_recipe_id}`;
      }
    });

    card.querySelector(".danger").addEventListener("click", async () => {
      await fetch(`/api/saved/${r.id}/delete`, {
        method: "DELETE",
        credentials: "include"
      });
      renderSaved();
    });

    container.appendChild(card);
  });
}

/* ============================================================
   DISCOVER + SAVED BINDINGS
============================================================ */
document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("btnTitle")?.addEventListener("click", searchByTitle);
  document.getElementById("btnIngredient")?.addEventListener("click", searchByIngredient);
  document.getElementById("btnPantry")?.addEventListener("click", searchByPantry);

  document.getElementById("savedSort")?.addEventListener("change", renderSaved);
});

/* ============================================================
   GLOBAL EXPORTS
============================================================ */
window.loginUser = loginUser;
window.logoutUser = logoutUser;
window.updateNavbar = updateNavbar;
window.loadPopular = loadPopular;
window.saveFavorite = saveFavorite;
window.renderSaved = renderSaved;
