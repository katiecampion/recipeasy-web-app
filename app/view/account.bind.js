document.addEventListener("DOMContentLoaded", async () => {
  const res = await fetch("/api/auth/me", { credentials:"include" });
  if (res.status === 401) {
    location.href = "login.html?next=" + encodeURIComponent(location.pathname);
    return;
  }
  const u = await res.json();
  const el = document.getElementById("accEmail");
  if (el) el.textContent = u.email || "";
  document.getElementById("saveBtn")?.addEventListener("click", updateAccount);
  document.getElementById("delBtn")?.addEventListener("click", deleteAccount);
});