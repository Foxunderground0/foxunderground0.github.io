document.addEventListener("DOMContentLoaded", () => {
  const container = document.querySelector("#featured-projects");
  const featured = window.PROJECTS.filter((project) => project.featured).slice(0, 6);
  container.innerHTML = featured.map(window.projectCard).join("");

  const year = document.querySelector("#year");
  year.textContent = new Date().getFullYear();

  window.revealElements();
});
