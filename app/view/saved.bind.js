document.addEventListener("DOMContentLoaded", () => {
  const sortSelect = document.getElementById("savedSort");

  if (sortSelect) {
    sortSelect.addEventListener("change", () => {
      if (typeof renderSaved === "function") {
        renderSaved();
      }
    });
  }

  if (typeof renderSaved === "function") {
    renderSaved();
  } else {
    console.error("renderSaved is not defined");
  }
});
