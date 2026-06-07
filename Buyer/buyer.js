const CART_KEY = "buyerCart";
const buyButtons = document.querySelectorAll("[data-cart-button]");
const clearCartButton = document.querySelector("[data-clear-cart]");
const cartList = document.querySelector("#cart-list");
const checkoutList = document.querySelector("#checkout-list");
const checkoutTotal = document.querySelector("#checkout-total");

buyButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const item = {
      name: button.dataset.name,
      price: Number(button.dataset.price)
    };

    const cart = getCart();
    cart.push(item);
    saveCart(cart);
    button.textContent = "Added";
    renderCart();
    renderCheckout();
  });
});

if (clearCartButton) {
  clearCartButton.addEventListener("click", () => {
    saveCart([]);
    renderCart();
    renderCheckout();
  });
}

renderCart();
renderCheckout();

function getCart() {
  try {
    return JSON.parse(localStorage.getItem(CART_KEY)) || [];
  } catch {
    return [];
  }
}

function saveCart(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
}

function renderCart() {
  if (!cartList) return;

  renderItems(cartList, getCart(), "Your cart is empty.");
}

function renderCheckout() {
  if (!checkoutList || !checkoutTotal) return;

  const cart = getCart();
  renderItems(checkoutList, cart, "No items to checkout.");
  checkoutTotal.textContent = formatPrice(sumCart(cart));
}

function renderItems(container, cart, emptyText) {
  container.textContent = "";

  if (cart.length === 0) {
    const emptyMessage = document.createElement("p");
    emptyMessage.className = "empty-message";
    emptyMessage.textContent = emptyText;
    container.appendChild(emptyMessage);
    return;
  }

  cart.forEach((item) => {
    const row = document.createElement("div");
    const name = document.createElement("span");
    const price = document.createElement("strong");

    row.className = "cart-line";
    name.textContent = item.name;
    price.textContent = formatPrice(item.price);

    row.append(name, price);
    container.appendChild(row);
  });
}

function sumCart(cart) {
  return cart.reduce((total, item) => total + item.price, 0);
}

function formatPrice(value) {
  return `$${Number(value).toFixed(2).replace(/\.00$/, "")}`;
}
