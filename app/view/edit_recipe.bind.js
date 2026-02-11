let recipeId;

document.addEventListener("DOMContentLoaded", async () => {
  const params = new URLSearchParams(location.search);
  recipeId = params.get("id");

  const form = document.getElementById("editRecipeForm");
  const list = document.getElementById("eIngredientsList");
  const ingName = document.getElementById("eIngName");
  const ingQty = document.getElementById("eIngQty");
  const addBtn = document.getElementById("eAddIngBtn");

  if (!recipeId || !form || !list) return;

  const ingredients = [];

  /* ============================
     RENDER INGREDIENTS
  ============================ */
  function renderIngredients() {
    if (!ingredients.length) {
      list.innerHTML = "<p>No ingredients yet.</p>";
      return;
    }

    list.innerHTML = ingredients
      .map(
        (i, idx) => `
          <div class="item" style="display:flex;justify-content:space-between;align-items:center;margin:6px 0;">
            <span><strong>${i.name}</strong> ${i.quantity || ""}</span>
            <button type="button" class="danger" data-del="${idx}">Remove</button>
          </div>
        `
      )
      .join("");

    list.querySelectorAll("[data-del]").forEach(btn => {
      btn.addEventListener("click", () => {
        const idx = Number(btn.dataset.del);
        ingredients.splice(idx, 1);
        renderIngredients();
      });
    });
  }

  /* ============================
     LOAD EXISTING RECIPE
  ============================ */
  const res = await fetch(`/api/recipes/${recipeId}`, {
    credentials: "include"
  });

  if (res.status === 401) {
    window.location =
      "login.html?next=" + encodeURIComponent(location.pathname + location.search);
    return;
  }

  if (!res.ok) {
    alert("Failed to load recipe.");
    return;
  }

  const data = await res.json();
  const r = data.recipe;
  const ing = data.ingredients || [];

  document.getElementById("eName").value = r.recipe_name || "";
  document.getElementById("eDesc").value = r.description || "";
  document.getElementById("eInst").value = r.instructions || "";
  document.getElementById("eImg").value = r.image_url || "";

  ing.forEach(i =>
    ingredients.push({ name: i.name, quantity: i.quantity || "" })
  );
  renderIngredients();

  /* ============================
     ADD INGREDIENT
  ============================ */
  addBtn.addEventListener("click", () => {
    const name = ingName.value.trim();
    const qty = ingQty.value.trim();
    if (!name) return;

    ingredients.push({ name, quantity: qty });
    ingName.value = "";
    ingQty.value = "";
    renderIngredients();
  });

  /* ============================
     SAVE CHANGES
  ============================ */
  form.addEventListener("submit", async e => {
    e.preventDefault();

    const recipe_name = document.getElementById("eName").value.trim();
    const description = document.getElementById("eDesc").value.trim();
    const instructions = document.getElementById("eInst").value.trim();

    if (!recipe_name || !description || !instructions) {
      alert("Please fill in all required fields.");
      return;
    }

    // Update recipe base fields
    const r1 = await fetch(`/api/recipes/${recipeId}/update`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({
        recipe_name,
        description,
        instructions
      })
    });

    if (!r1.ok) {
      alert("Failed to save recipe.");
      return;
    }

    // Replace ingredients
    const r2 = await fetch(`/api/recipes/${recipeId}/ingredients`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ ingredients })
    });

    if (!r2.ok) {
      alert("Failed to save ingredients.");
      return;
    }

    alert("Recipe updated!");
    window.location.href = `recipe.html?id=${recipeId}`;
  });
});
