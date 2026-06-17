const search = document.querySelector("#globalSearch");
const cards = Array.from(document.querySelectorAll(".opportunity-card"));
const filters = Array.from(document.querySelectorAll("[data-filter]"));
const runAgent = document.querySelector("#runAgent");
const reviewStack = document.querySelector("#reviewStack");

let activeFilter = "all";

function applyFilters() {
  const term = search.value.trim().toLowerCase();

  cards.forEach((card) => {
    const kind = card.dataset.kind;
    const title = card.dataset.title;
    const matchesFilter = activeFilter === "all" || kind === activeFilter;
    const matchesSearch = !term || title.includes(term);
    card.classList.toggle("is-hidden", !(matchesFilter && matchesSearch));
  });
}

filters.forEach((button) => {
  button.addEventListener("click", () => {
    activeFilter = button.dataset.filter;
    filters.forEach((item) => item.classList.toggle("is-active", item === button));
    applyFilters();
  });
});

search.addEventListener("input", applyFilters);

runAgent.addEventListener("click", () => {
  const card = document.createElement("article");
  card.className = "review-card is-highlighted";
  card.innerHTML = `
    <div class="review-topline">
      <span>Chief of Staff Agent</span>
      <strong>Queued now</strong>
    </div>
    <p>Workflow queued. Tasks will route to Capital Desk, Claims Review, and Collateral Factory before approval.</p>
    <div class="review-actions">
      <button type="button">Open task</button>
      <button type="button">Assign</button>
    </div>
  `;
  reviewStack.prepend(card);
});
