document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("pantryForm");
  const box = document.getElementById("pantryBox");

  async function fetchItems() {
    const res = await fetch("/api/pantry", { credentials: "include" });
    if (res.status === 401) {
      alert("Please log in to view your pantry.");
      location.href = "login.html?next=" + encodeURIComponent(location.pathname);
      return [];
    }
    return res.ok ? await res.json() : [];
  }

  async function render() {
    const items = await fetchItems();
    box.innerHTML = items.length
      ? items.map(i => `
          <div class="item" style="display:flex;justify-content:space-between;align-items:center;margin:6px 0;">
            <span><strong>${i.name}</strong> <span style="color:#666;">${i.quantity || ''}</span></span>
            <button type="button" class="danger" data-id="${i.id}">Delete</button>
          </div>
        `).join("")
      : "<p>No items yet.</p>";

    box.querySelectorAll("button[data-id]").forEach(btn => {
      btn.addEventListener("click", async () => {
        const id = btn.getAttribute("data-id");
        await fetch(`/api/pantry/${id}`, { method: "DELETE", credentials: "include" });
        render();
      });
    });
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const name = document.getElementById("pantryIngredient").value.trim();
    const qty = document.getElementById("pantryQuantity").value.trim();
    if (!name) return;
    const res = await fetch("/api/pantry", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ name, quantity: qty })
    });
    if (!res.ok) {
      alert("Failed to add item.");
      return;
    }
    form.reset();
    render();
  });

  render();
});