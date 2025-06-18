let search = document.querySelector('.search-box');

document.querySelector('#search-icon').onclick = () => {
    search.classList.toggle('active');
}

document.querySelectorAll('.add-to-cart').forEach(button => {
  button.addEventListener('click', () => {
    const name = button.getAttribute('data-name');
    const price = parseInt(button.getAttribute('data-price'));
    const image = button.getAttribute('data-image');

    // Get current cart from localStorage or initialize
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    // Check if item already exists in cart
    const existingItem = cart.find(item => item.name === name);
    
    if (existingItem) {
      existingItem.quantity = (existingItem.quantity || 1) + 1;
    } else {
      cart.push({
        name: name,
        price: price,
        image: image,
        quantity: 1
      });
    }

    // Save updated cart back to localStorage
    localStorage.setItem('cart', JSON.stringify(cart));

    // Show success message
    alert(`${name} added to cart!`);
  });
});

document.addEventListener("DOMContentLoaded", () => {
  const cartContainer = document.getElementById("cart-items");
  const totalDisplay = document.getElementById("cart-total");
  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  function updateCart() {
    cartContainer.innerHTML = "";
    let total = 0;

    if (cart.length === 0) {
      cartContainer.innerHTML = "<p>Your cart is empty. <a href='products.html' style='color: #c17a57; text-decoration: none;'>Continue shopping</a></p>";
      totalDisplay.textContent = "Total: Rs. 0/=";
      return;
    }

    cart.forEach((item, index) => {
      const itemDiv = document.createElement("div");
      itemDiv.className = "cart-item";
      const subtotal = item.price * (item.quantity || 1);
      total += subtotal;
      
      itemDiv.innerHTML = `
        <img src="${item.image}" alt="${item.name}" class="cart-item-image">
        <div class="cart-item-details">
          <h3>${item.name}</h3>
          <p class="cart-item-price">Price: Rs. ${item.price.toLocaleString()}/=</p>
          <div class="cart-item-quantity">
            <span>Quantity:</span>
            <div class="quantity-controls">
              <button class="qty-btn" onclick="decreaseQty(${index})">-</button>
              <span class="quantity-display">${item.quantity || 1}</span>
              <button class="qty-btn" onclick="increaseQty(${index})">+</button>
            </div>
          </div>
          <p class="cart-item-subtotal">Subtotal: Rs. ${subtotal.toLocaleString()}/=</p>
        </div>
        <button class="remove-btn" onclick="removeItem(${index})">Remove</button>
      `;
      
      cartContainer.appendChild(itemDiv);
    });

    totalDisplay.textContent = `Total: Rs. ${total.toLocaleString()}/=`;
  }

  window.increaseQty = (index) => {
    cart[index].quantity = (cart[index].quantity || 1) + 1;
    localStorage.setItem("cart", JSON.stringify(cart));
    updateCart();
  };

  window.decreaseQty = (index) => {
    if (cart[index].quantity > 1) {
      cart[index].quantity--;
    } else {
      cart.splice(index, 1);
    }
    localStorage.setItem("cart", JSON.stringify(cart));
    updateCart();
  };

  window.removeItem = (index) => {
    cart.splice(index, 1);
    localStorage.setItem("cart", JSON.stringify(cart));
    updateCart();
  };

  document.getElementById("clear-cart").addEventListener("click", () => {
    if (confirm("Are you sure you want to clear your cart?")) {
      localStorage.removeItem("cart");
      cart = [];
      updateCart();
    }
  });

document.getElementById("checkout").addEventListener("click", () => {
  window.location.href = "checkout.html";
});


  updateCart();
});

if (window.location.pathname.includes("checkout.html")) {
  document.addEventListener("DOMContentLoaded", () => {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const checkoutContainer = document.getElementById("checkout-items");
    const totalDisplay = document.getElementById("checkout-total");

    if (cart.length === 0) {
      checkoutContainer.innerHTML = "<p>Your cart is empty.</p>";
      totalDisplay.textContent = "Total: Rs. 0/=";
      return;
    }

    let total = 0;
    const shippingFee = 200;
    cart.forEach(item => {
      const qty = item.qty || 1;
      const subtotal = item.price * qty;
      total += subtotal;

      const itemDiv = document.createElement("div");
      itemDiv.innerHTML = `<p><strong>${item.name}</strong> x ${qty} = Rs. ${subtotal.toLocaleString()}/=</p>`;
      checkoutContainer.appendChild(itemDiv);
    });

    total += shippingFee;
    totalDisplay.textContent = `Total: Rs. ${total.toLocaleString()}/=`;

    // Handle place order form submission
    document.getElementById("checkout-form").addEventListener("submit", (e) => {
      e.preventDefault();

      const name = document.getElementById("name").value.trim();
      const address = document.getElementById("address").value.trim();
      const note = document.getElementById("note").value.trim();

      if (!name || !address) {
        alert("Please fill in all required fields.");
        return;
      }

      // Simulate order placement
      alert(`Thank you, ${name}! Your order has been placed.`);

      // Clear cart and redirect (optional)
      localStorage.removeItem("cart");
      window.location.href = "index.html"; // or a thank-you page
    });
  });
}
