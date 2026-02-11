document.addEventListener("DOMContentLoaded", async () => {
  const box = document.getElementById("myRecipes");
  if (!box) return;

  const res = await fetch("/api/recipes", { credentials: "include" });

  if (res.status === 401) {
    box.innerHTML = "<p>Please log in to view your recipes.</p>";
    return;
  }

  const data = await res.json();
  box.innerHTML = "";

  if (!Array.isArray(data) || !data.length) {
    box.innerHTML = "<p>No recipes yet.</p>";
    return;
  }

  data.forEach(r => {
    const card = document.createElement("div");
    card.className = "recipe-card";

    card.innerHTML = `
      ${r.image_url ? `<img src="${r.image_url}" alt="${r.recipe_name}">` : ""}
      <h3>${r.recipe_name}</h3>
      <button class="btn btn-outline">View</button>
    `;

    card.querySelector("button").addEventListener("click", () => {
      location.href = `recipe.html?id=${r.recipe_id}`;
    });

    box.appendChild(card);
  });
});
