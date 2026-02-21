let carCount = 0;
let allProductsData = [];

const loadCategories = async () => {
  const res = await fetch("https://fakestoreapi.com/products/categories");
  const categories = await res.json();
  const container = document.getElementById("cat-container");

  categories.forEach((cat) => {
    const btn = document.createElement("button");
    btn.className =
      "btn btn-sm btn-outline btn-primary category-btn capitalize";
    btn.innerText = cat;
    btn.onclick = (e) => {
      handleCategoryActive(e.currentTarget);
      loadProducts(cat);
    };
    container.appendChild(btn);
  });
};

const loadProducts = async (category = "", limit = null) => {
  const targetId = limit ? "trending-grid" : "product-grid";
  toggleLoader(true, targetId);
  const url = category
    ? `https://fakestoreapi.com/products/category/${category}`
    : `https://fakestoreapi.com/products`;

  const res = await fetch(url);
  allProductsData = await res.json();
  const displayData = limit ? allProductsData.slice(0, limit) : allProductsData;

  displayProducts(displayData, targetId);
  toggleLoader(false, targetId);
};

const displayProducts = (products, targetId = "product-grid") => {
  const grid = document.getElementById(targetId);
  grid.innerHTML = "";
  products.forEach((p) => {
    const card = document.createElement("div");
    card.className =
      "card bg-base-100 shadow-sm border border-gray-100 p-4 hover:shadow-md transition";
    card.innerHTML = `<figure class="h-48">
        <img src="${p.image}" class="h-full object-contain" alt="${p.title}" />
      </figure>
      <div class="mt-4">
        <div class="flex justify-between items-start mb-2">
          <span class="badge badge-ghost text-indigo-600 font-bold bg-indigo-100 text-xs">${p.category}</span>
          <span class="text-orange-400 text-sm font-bold"
            ><i class="fa-solid fa-star"></i> ${p.rating.rate}</span
          >
        </div>
        <h2 class="font-bold text-sm h-10 overflow-hidden">${p.title}</h2>
        <p class="text-primary font-bold mt-2">$${p.price}</p>
        <div class="flex gap-2 mt-4">
                            <button onclick="showDetails(${p.id})" class="btn btn-sm btn-outline flex-1">Details</button>
                            <button onclick="addToCart()" class="btn btn-sm btn-primary flex-1">Add to Cart</button>
                        </div>
      </div>`;
    grid.appendChild(card);
  });
};

function showAllProducts() {
  const homeView = document.querySelector(".home-view");
  const productsView = document.getElementById("products-view");
  const viewAllBtn = document.getElementById("view-all");
  const catContainer = document.getElementById("cat-container");

  if (homeView) homeView.classList.add("hidden");
  if (productsView) productsView.classList.remove("hidden");
  if (viewAllBtn) viewAllBtn.classList.add("hidden");
  if (catContainer) catContainer.classList.remove("hidden");

  loadProducts();
  window.scrollTo({ top: 0, behavior: "smooth" });
}
function showHome() {
  const homeView = document.querySelector(".home-view");
  const productsView = document.getElementById("products-view");
  const viewAllBtn = document.getElementById("view-all");
  const catContainer = document.getElementById("cat-container");
  if (homeView) homeView.classList.remove("hidden");
  if (productsView) productsView.classList.add("hidden");
  if (viewAllBtn) viewAllBtn.classList.remove("hidden");
  if (catContainer) catContainer.classList.add("hidden");

  loadProducts("", 3);
  window.scrollTo(0, 0);
}

const showDetails = async (id) => {
  const res = await fetch(`https://fakestoreapi.com/products/${id}`);
  const p = await res.json();
  const content = document.getElementById("modal-content");
  content.innerHTML = `<img src="${p.image}" class="h-40 mx-auto mb-4" alt=${p.title}>
    <h3 class="font-bold text-lg">${p.title}</h3>
    <p class="py-4 text-gray-600 text-sm">${p.description}</p>
    <div class="flex justify-between font-bold">
        <span>Price: $${p.price}</span>
        <span>Rating: ${p.rating.rate}</span>
    </div>`;
  details_modal.showModal();
};

function toggleLoader(show, gridId) {
  const loaderId = gridId === "trending-grid" ? "loader" : "loader-products";
  const loader = document.getElementById(loaderId);
  const grid = document.getElementById(gridId);

  if (loader) loader.classList.toggle("hidden", !show);
  if (grid) grid.classList.toggle("hidden", show);
}

function handleCategoryActive(activeBtn) {
  if (!activeBtn) {
    activeBtn = document.querySelector(".category-btn");
  }
  const allBtns = document.querySelectorAll(".category-btn");
  allBtns.forEach((btn) => {
    btn.classList.remove("btn-primary");
    btn.classList.add("btn-outline");
  });
  activeBtn.classList.remove("btn-outline");
  activeBtn.classList.add("btn-primary");
}
function addToCart() {
  carCount++;
  document.getElementById("cart-count").innerText = carCount;
  details_modal.close();
}

loadCategories();
showHome();
