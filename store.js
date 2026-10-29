
const CART_KEY = "bookStoreCart";

// Cart se books read karo
function getCart() {
  try {
    return JSON.parse(localStorage.getItem(CART_KEY)) || [];
  } catch (error) {
    return [];
  }
}

// Cart save karo
function saveCart(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
}

// Book cart mein add karo
function addToCart(title, author, publisher, price, cover) {
  const cart = getCart();
  const existingBook = cart.find(book => book.title === title);

  if (existingBook) {
    existingBook.quantity += 1;
  } else {
    cart.push({
      title: title,
      author: author,
      publisher: publisher,
      price: Number(price),
      cover: cover,
      quantity: 1
    });
  }

  saveCart(cart);
  alert(title + " added to cart!");

  // Agar current page cart hai, turant update karo
  if (typeof renderCart === "function") {
    renderCart();
  }
}

// Cart display karo
function renderCart() {
  const cartRows = document.getElementById("cartRows");
  const cartTotal = document.getElementById("cartTotal");

  if (!cartRows) return;

  const cart = getCart();
  cartRows.innerHTML = "";

  let total = 0;

  if (cart.length === 0) {
    cartRows.innerHTML = `
      <tr>
        <td colspan="5" style="text-align:center">
          Your cart is empty.
        </td>
      </tr>`;
  }

  cart.forEach((book, index) => {
    const amount = Number(book.price) * Number(book.quantity);
    total += amount;

    const row = document.createElement("tr");

    const titleCell = document.createElement("td");
    titleCell.textContent = book.title;

    const priceCell = document.createElement("td");
    priceCell.textContent = "Rs. " + Number(book.price).toFixed(2);

    const quantityCell = document.createElement("td");

    const minus = document.createElement("button");
    minus.type = "button";
    minus.textContent = "−";
    minus.onclick = () => changeQuantity(index, -1);

    const quantity = document.createElement("span");
    quantity.textContent = " " + book.quantity + " ";

    const plus = document.createElement("button");
    plus.type = "button";
    plus.textContent = "+";
    plus.onclick = () => changeQuantity(index, 1);

    quantityCell.append(minus, quantity, plus);

    const amountCell = document.createElement("td");
    amountCell.textContent = "Rs. " + amount.toFixed(2);

    const actionCell = document.createElement("td");
    const remove = document.createElement("button");
    remove.type = "button";
    remove.textContent = "Remove";
    remove.onclick = () => removeFromCart(index);
    actionCell.appendChild(remove);

    row.append(
      titleCell,
      priceCell,
      quantityCell,
      amountCell,
      actionCell
    );

    cartRows.appendChild(row);
  });

  if (cartTotal) {
    cartTotal.textContent = "Rs. " + total.toFixed(2);
  }
}

// Quantity change karo
function changeQuantity(index, change) {
  const cart = getCart();

  if (!cart[index]) return;

  cart[index].quantity += change;

  if (cart[index].quantity <= 0) {
    cart.splice(index, 1);
  }

  saveCart(cart);
  renderCart();
}

// Book remove karo
function removeFromCart(index) {
  const cart = getCart();
  cart.splice(index, 1);
  saveCart(cart);
  renderCart();
}

// Pura cart empty karo
function clearCart() {
  saveCart([]);
  renderCart();
}

// Page load hone par cart render karo
document.addEventListener("DOMContentLoaded", renderCart);
