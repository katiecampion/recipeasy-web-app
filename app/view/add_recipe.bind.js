document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("addRecipeForm");
  const list = document.getElementById("ingredientsList");
  const ingName = document.getElementById("ingName");
  const ingQty = document.getElementById("ingQty");
  const addBtn = document.getElementById("addIngBtn");

  if (!form || !list || !ingName || !addBtn) return;

  const ingredients = [];

  /* ------------------------------
     INGREDIENT LIST RENDER
  ------------------------------ */
  function renderIngredients() {
    if (!ingredients.length) {
      list.innerHTML = "<p>No ingredients added yet.</p>";
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

  /* ------------------------------
     ADD INGREDIENT
  ------------------------------ */
  addBtn.addEventListener("click", () => {
    const name = ingName.value.trim();
    const quantity = ingQty.value.trim();

    if (!name) return;

    ingredients.push({ name, quantity });
    ingName.value = "";
    ingQty.value = "";
    renderIngredients();
  });

  /* ------------------------------
     SUBMIT RECIPE
  ------------------------------ */
  form.addEventListener("submit", async e => {
    e.preventDefault();

    const body = {
      recipe_name: document.getElementById("rName").value.trim(),
      description: document.getElementById("rDesc").value.trim(),
      instructions: document.getElementById("rInst").value.trim(),
      image_url: document.getElementById("rImg").value.trim(),
      ingredients
    };

    if (!body.recipe_name || !body.description || !body.instructions) {
      alert("Please fill in all required fields.");
      return;
    }

    const res = await fetch("/api/recipes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(body)
    });

    if (res.status === 401) {
      alert("Please log in to add a recipe.");
      window.location.href =
        "login.html?next=" + encodeURIComponent(location.pathname);
      return;
    }

    if (!res.ok) {
      const msg = await res.text().catch(() => "Failed to add recipe.");
      alert(msg);
      return;
    }

    alert("Recipe added!");
    window.location.href = "my_recipes.html";
  });

  renderIngredients();
});
