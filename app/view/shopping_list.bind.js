document.addEventListener("DOMContentLoaded", async ()=> {
  document.getElementById("shopForm")?.addEventListener("submit", addShopping);
  const items = await loadShopping();
  const box = document.getElementById("shopBox");
  if (!box) return;
  box.innerHTML = (items||[]).map(i=>`
    <div class="item">
      <span>${i.name} ${i.quantity||''}</span>
      <button class="danger" data-id="${i.id}" type="button">Delete</button>
    </div>
  `).join("");
  box.querySelectorAll("button[data-id]").forEach(btn=>{
    btn.addEventListener("click", async ()=>{
      const id = btn.getAttribute("data-id");
      await fetch(`/api/shopping/${id}`, { method:"DELETE", credentials:"include" });
      location.reload();
    });
  });
});