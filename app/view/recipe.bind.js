document.addEventListener("DOMContentLoaded", async () => {
  const params = new URLSearchParams(location.search);
  const internalId = params.get("id");
  const apiId = params.get("api");
  const box = document.getElementById("recipeContainer");
  if (!box) return;

  // Internal (user) recipe
  if (internalId) {
    try {
      const res = await fetch(`/api/recipes/${internalId}`, { credentials: "include" });
      if (res.status === 401) {
        location.href =
          "login.html?next=" + encodeURIComponent(location.pathname + location.search);
        return;
      }
      if (!res.ok) throw new Error("Not found");

      const data = await res.json();
      const r = data.recipe;
      const ing = data.ingredients || [];

      box.innerHTML = templateInternal(r, ing);

      // ✅ DELETE HANDLER (INTERNAL RECIPES ONLY)
      const deleteBtn = document.getElementById("deleteRecipeBtn");
      if (deleteBtn) {
        deleteBtn.addEventListener("click", async () => {
          const ok = confirm("Delete this recipe?");
          if (!ok) return;

          const del = await fetch(`/api/recipes/${internalId}`, {
            method: "DELETE",
            credentials: "include"
          });

          if (!del.ok) {
            alert("Failed to delete recipe.");
            return;
          }

          alert("Recipe deleted.");
          window.location.href = "my_recipes.html";
        });
      }

      return;
    } catch {
      box.innerHTML = "<p>Failed to load recipe.</p>";
      return;
    }
  }

  // External API recipe
  if (apiId) {
    try {
      const res = await fetch(`/api/search/recipe/${apiId}`);
      if (!res.ok) throw new Error();
      const data = await res.json();
      box.innerHTML = templateExternal(data);
      return;
    } catch {
      box.innerHTML = `
        <div class="card">
          <h2>Recipe</h2>
          <p>Full details unavailable (API quota or network).</p>
          <p>ID: ${apiId}</p>
          <a class="btn btn-outline" href="discover.html">Back</a>
        </div>
      `;
    }
  } else {
    box.innerHTML = "<p>No recipe id provided.</p>";
  }
});

function templateInternal(r, ing) {
  const steps = splitInstructions(r.instructions);
  return `
    <div class="recipe-detail recipe-detail--enhanced">
      <div class="recipe-left">
        <h2 class="recipe-title-main">${escapeHtml(r.recipe_name)}</h2>
        ${r.image_url ? `<img class="recipe-image" src="${escapeAttr(r.image_url)}" alt="">` : ''}
        <div class="recipe-description card">
          <h3>Description</h3>
          <p>${escapeHtml(r.description || 'No description provided.')}</p>
        </div>
      </div>

      <div class="recipe-right">
        <div class="card ingredients-card">
          <h3>Ingredients</h3>
          <ul class="ingredients-list">
            ${ing.map(i=>`
              <li class="ingredient-item">
                <span class="ingredient-name">${escapeHtml(i.name)}</span>
                ${i.quantity ? `<span class="ingredient-qty">${escapeHtml(i.quantity)}</span>` : ''}
              </li>
            `).join('')}
          </ul>
        </div>

        <div class="card instructions-card">
          <h3>Instructions</h3>
          <ol class="instruction-steps">
            ${steps.map(s=>`<li>${escapeHtml(s)}</li>`).join('')}
          </ol>
        </div>

        <!-- ✅ EDIT + DELETE -->
        <div class="recipe-actions" style="margin-top:16px;">
          <a class="btn btn-outline" href="edit_recipe.html?id=${r.recipe_id}">Edit</a>
          <button type="button" class="danger" id="deleteRecipeBtn">Delete</button>
          <a class="btn" href="my_recipes.html">Back</a>
        </div>
      </div>
    </div>
  `;
}

function templateExternal(d) {
  const ing = d.extendedIngredients || [];
  const steps = splitInstructions(d.instructions || d.summary);
  return `
    <div class="recipe-detail recipe-detail--enhanced">
      <div class="recipe-left">
        <h2 class="recipe-title-main">${escapeHtml(d.title)}</h2>
        ${d.image ? `<img class="recipe-image" src="${escapeAttr(d.image)}" alt="">` : ''}
        <div class="recipe-description card">
          <h3>Description</h3>
          <p>${escapeHtml(stripHtml(d.summary || d.instructions || 'No description available.'))}</p>
        </div>
      </div>

      <div class="recipe-right">
        <div class="card ingredients-card">
          <h3>Ingredients</h3>
          <ul class="ingredients-list">
            ${ing.map(i=>`
              <li class="ingredient-item">
                <span class="ingredient-name">${escapeHtml(i.original || i.name || '')}</span>
              </li>
            `).join('')}
          </ul>
        </div>

        <div class="card instructions-card">
          <h3>Instructions</h3>
          ${
            steps.length
              ? `<ol class="instruction-steps">${steps.map(s=>`<li>${escapeHtml(s)}</li>`).join('')}</ol>`
              : `<p>No detailed instructions available.</p>`
          }
        </div>

        <div class="recipe-actions" style="margin-top:16px;">
          <a class="btn btn-outline" href="discover.html">Back</a>
        </div>
      </div>
    </div>
  `;
}

/* ======================
   HELPERS
====================== */
function splitInstructions(text) {
  if (!text) return [];
  const cleaned = stripHtml(text);
  return cleaned
    .split(/\r?\n|\.\s+/)
    .map(s => s.trim())
    .filter(Boolean);
}

function stripHtml(str) {
  return String(str).replace(/<[^>]*>/g, "");
}

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function escapeAttr(str) {
  return escapeHtml(str).replace(/'/g, "&#39;");
}
