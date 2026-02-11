document.addEventListener("DOMContentLoaded", () => {
  if (typeof loadPopular === "function") {
    loadPopular();
  } else {
    console.error("loadPopular is not defined");
  }
});
