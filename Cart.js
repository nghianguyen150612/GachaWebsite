function initializeCart(config = {}) {
  const settings = {
    emptyCartMessage: "Giỏ hàng trống.",
    emptyCheckoutMessage: "Không có sản phẩm nào.",
    addedLabel: (quantity) => `Đã thêm (${quantity})`,
    ...config,
  };

  let cartItems = [];
  const buyButtons = document.querySelectorAll("[data-cart-button]");
  const clearCartButton = document.querySelector("[data-clear-cart]");
  const cartList = document.querySelector("#cart-list");
  const checkoutList = document.querySelector("#checkout-list");
  const checkoutTotal = document.querySelector("#checkout-total");
  const placeOrderButton = document.querySelector("[data-place-order]");
  const orderMessage = document.querySelector("#orderSuccessMessage");
  const originalLabels = new Map();

  buyButtons.forEach((button) => {
    originalLabels.set(button, button.textContent.trim());
    button.addEventListener("click", () => {
      cartItems.push({
        name: button.dataset.name,
        price: Number(button.dataset.price),
      });
      renderCartState();
    });
  });

  clearCartButton?.addEventListener("click", () => {
    cartItems = [];
    renderCartState();
  });

  placeOrderButton?.addEventListener("click", () => {
    if (!orderMessage) return;

    if (cartItems.length === 0) {
      showOrderMessage(
        orderMessage,
        "Giỏ hàng trống, vui lòng thêm sản phẩm trước khi đặt hàng.",
        true
      );
      return;
    }

    showOrderMessage(orderMessage, "Đặt hàng thành công, cảm ơn bạn đã mua hàng.");
    cartItems = [];
    renderCartState();
  });

  function renderCartState() {
    if (cartList) renderItemList(cartList, cartItems, settings.emptyCartMessage);
    if (checkoutList) renderItemList(checkoutList, cartItems, settings.emptyCheckoutMessage);
    if (checkoutTotal) checkoutTotal.textContent = formatMoney(calculateTotal(cartItems));

    const counts = countItemsByName(cartItems);
    buyButtons.forEach((button) => {
      const quantity = counts.get(button.dataset.name) || 0;
      button.textContent =
        quantity > 0 ? settings.addedLabel(quantity) : originalLabels.get(button);
    });
  }

  renderCartState();
}

function renderItemList(container, items, emptyText) {
  container.replaceChildren();

  if (items.length === 0) {
    const emptyMessage = document.createElement("p");
    emptyMessage.className = "empty-message";
    emptyMessage.textContent = emptyText;
    container.appendChild(emptyMessage);
    return;
  }

  items.forEach((item) => {
    const row = document.createElement("div");
    const name = document.createElement("span");
    const price = document.createElement("strong");

    row.className = "cart-line";
    name.textContent = item.name;
    price.textContent = formatMoney(item.price);

    row.append(name, price);
    container.appendChild(row);
  });
}

function countItemsByName(items) {
  return items.reduce((counts, item) => {
    counts.set(item.name, (counts.get(item.name) || 0) + 1);
    return counts;
  }, new Map());
}

function calculateTotal(items) {
  return items.reduce((total, item) => total + item.price, 0);
}

function formatMoney(amount) {
  if (amount === 0) return "Miễn phí";
  return `$${Number(amount).toFixed(2).replace(/\.00$/, "")}`;
}

function showOrderMessage(element, message, isError = false) {
  element.textContent = message;
  element.classList.toggle("error", isError);
  element.classList.add("show");

  clearTimeout(element.hideTimeout);
  element.hideTimeout = setTimeout(() => {
    element.classList.remove("show");
  }, 4000);
}
