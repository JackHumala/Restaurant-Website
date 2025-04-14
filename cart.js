
  // Cart data
  let cart = [];
  let currentItem = null;

  // Hies or Shows the cart
  function toggleCart() {
    const modal = document.getElementById('cart-modal');
    const cartPanel = modal.querySelector('div');
    
    if (modal.classList.contains('hidden')) {
      modal.classList.remove('hidden');
      setTimeout(() => {
        cartPanel.classList.remove('translate-x-full');
      }, 10);
    } else {
      cartPanel.classList.add('translate-x-full');
      setTimeout(() => {
        modal.classList.add('hidden');
      }, 300);
    }
    
    renderCart();
  }

  // Open item modal for selecting options
  function openItemModal(item) {
    currentItem = item;
    const modal = document.getElementById('item-modal');
    const title = document.getElementById('item-modal-title');
    const content = document.getElementById('item-modal-content');
    
    title.textContent = item.name;
    
    // HMTL for item modal
     let html = `
       <div class="mb-1">
       </div>
     `;
    
    //Size options for nuggets and fries
    if (item.hasSizes) {
      html += `
        <div class="mb-6">
          <h3 class="font-medium mb-3">Select Size</h3>
          <div class="grid grid-cols-3 gap-2">
            <button onclick="selectSize(this, 'small')" 
              class="size-btn py-2 px-3 rounded-lg border ${item.sizePrices.small === item.price ? 'bg-yellow-400 border-yellow-400 text-red-700' : 'bg-white border-gray-300'}">
              <div class="font-medium">Small</div>
              <div class="text-sm">$${item.sizePrices.small.toFixed(2)}</div>
            </button>
            <button onclick="selectSize(this, 'medium')" 
              class="size-btn py-2 px-3 rounded-lg border ${item.sizePrices.medium === item.price ? 'bg-yellow-400 border-yellow-400 text-red-700' : 'bg-white border-gray-300'}">
              <div class="font-medium">Medium</div>
              <div class="text-sm">$${item.sizePrices.medium.toFixed(2)}</div>
            </button>
            <button onclick="selectSize(this, 'large')" 
              class="size-btn py-2 px-3 rounded-lg border ${item.sizePrices.large === item.price ? 'bg-yellow-400 border-yellow-400 text-red-700' : 'bg-white border-gray-300'}">
              <div class="font-medium">Large</div>
              <div class="text-sm">$${item.sizePrices.large.toFixed(2)}</div>
            </button>
          </div>
          <input type="hidden" id="selected-size" value="medium">
        </div>
      `;
    }
    
    // Add quantity selector
    html += `
      <div>
        <h3 class="font-medium mb-3">Quantity</h3>
        <div class="flex items-center justify-between bg-gray-100 rounded-lg p-1">
          <button onclick="changeQuantity(-1)" class="w-10 h-10 flex items-center justify-center rounded-lg bg-white text-xl font-bold">-</button>
          <input type="number" id="item-quantity" value="1" min="1" 
            class="flex-1 mx-2 text-center border-0 bg-transparent" onchange="updateItemTotal()">
          <button onclick="changeQuantity(1)" class="w-10 h-10 flex items-center justify-center rounded-lg bg-white text-xl font-bold">+</button>
        </div>
      </div>
    `;
    
    content.innerHTML = html;
    modal.classList.remove('hidden');
    updateItemTotal();
  }

  // adds hidden to close
  function closeItemModal() {
    document.getElementById('item-modal').classList.add('hidden');
  }

  // Update all size buttons when selecting
  function selectSize(button, size) {
    document.querySelectorAll('.size-btn').forEach(btn => {
      btn.classList.remove('bg-yellow-400', 'border-yellow-400', 'text-red-700');
      btn.classList.add('bg-white', 'border-gray-300');
    });
    
    // Highlight the selected button
    button.classList.remove('bg-white', 'border-gray-300');
    button.classList.add('bg-yellow-400', 'border-yellow-400', 'text-red-700');
    
    // updates the size chosen and new price
    document.getElementById('selected-size').value = size;
    currentItem.price = currentItem.sizePrices[size];
    updateItemTotal();
  }


  // function that updates quantity and calls updateItemTotal
  function changeQuantity(change) {
    const input = document.getElementById('item-quantity');
    let value = parseInt(input.value) + change;
    if (value < 1) value = 1;
    input.value = value;
    updateItemTotal();
  }

  // function that updates the total baased on number of items & size
  function updateItemTotal() {
    const quantity = parseInt(document.getElementById('item-quantity').value) || 1;
    const total = (currentItem.price * quantity).toFixed(2);
    document.getElementById('item-total-price').textContent = `$${total}`;
  }

  // Add item to cart
  function addToCart() {
    const quantity = parseInt(document.getElementById('item-quantity').value) || 1;
    let size = currentItem.hasSizes ? document.getElementById('selected-size').value : '';
    
    // Checks if item already exists in cart
    const existingItemIndex = cart.findIndex(item => 
      item.id === currentItem.id && 
      (!currentItem.hasSizes || item.size === size)
    );
    
    if (existingItemIndex > 0) {
      // Only adds quantity if item already in cart
      cart[existingItemIndex].quantity += quantity;
    } else {
      // Add new item to cart
      cart.push({
        ...currentItem,
        quantity,
        size,
        displayPrice: currentItem.price.toFixed(2)
      });
    }
    
    // Update cart count and closes modal
    updateCartCount();
    closeItemModal();
    renderCart();
    
   }

  // Removes item from cart
  function removeFromCart(index) {
    cart.splice(index, 1);
    updateCartCount();
    renderCart();
  }

  // Updates quantity of item in cart
  function updateCartItem(index, change) {
    cart[index].quantity += change;
    if (cart[index].quantity < 1) {
      cart.splice(index, 1);
    }
    updateCartCount();
    renderCart();
  }

  // Clears the entire cart
  function clearCart() {
    cart = [];
    updateCartCount();
    renderCart();
  }

  // Checkout function. Alert message when checking out. Clears and closes cart
  function checkout() {
    if (cart.length === 0) {
      alert('Your cart is empty');
      return;
    }
    
    //
   else{
    alert(`Thank you for your order :)`);
    clearCart();
    toggleCart();
   }
    

  }

  // Calculatea cart total
  function calculateTotal() {
    return cart.reduce((total, item) => total + (parseFloat(item.displayPrice) * item.quantity), 0);
  }

  // Update cart count in the menu screem
  function updateCartCount() {
    const count = cart.reduce((total, item) => total + item.quantity, 0);
    document.getElementById('cart-count').textContent = count;
  }

  // Renders the cart items
  function renderCart() {
    const container = document.getElementById('cart-items');
    
    if (cart.length === 0) {
      container.innerHTML = '<p class="text-gray-500 text-center py-8">Your cart is empty</p>';
      document.getElementById('cart-total').textContent = '$0.00';
      return;
    }
    
    let html = '';
    
    cart.forEach((item, index) => {
      const itemTotal = (parseFloat(item.displayPrice) * item.quantity);
      
      html += `
        <div class="border-b border-gray-200 pb-4 mb-4">
          <div class="flex justify-between items-start">
            <div class="flex-1">
              <h3 class="font-bold">${item.name}</h3>
              ${item.size ? `<p class="text-sm text-gray-600">${item.size}</p>` : ''}
              <p class="text-sm text-gray-600">$${item.displayPrice} each</p>
            </div>
            <p class="font-bold">$${itemTotal.toFixed(2)}</p>
          </div>
          <div class="flex justify-between items-center mt-2">
            <div class="flex items-center border border-gray-300 rounded-lg overflow-hidden">
              <button onclick="updateCartItem(${index}, -1)" class="px-3 py-1 bg-gray-100 hover:bg-gray-200">-</button>
              <span class="px-3">${item.quantity}</span>
              <button onclick="updateCartItem(${index}, 1)" class="px-3 py-1 bg-gray-100 hover:bg-gray-200">+</button>
            </div>
            <button onclick="removeFromCart(${index})" class="text-red-500 hover:text-red-700 p-1">
              <ion-icon name="close" class="text-lg"></ion-icon>
            </button>
          </div>
        </div>
      `;
    });
    
    container.innerHTML = html;
    document.getElementById('cart-total').textContent = `$${calculateTotal().toFixed(2)}`;
  }

  // Initialize menu items with event listener
  document.addEventListener('DOMContentLoaded', function() {
    // Defining my menu items data with their sizes and prices
    const itemsData = [
      { 
        id: 1, 
        name: "Big Mac®", 
        price: 5.20, 
        calories: "580 cal.", 
        hasSizes: false 
      },
      { 
        id: 2, 
        name: "Quarter Pounder®", 
        price: 4.60, 
        calories: "520 cal.", 
        hasSizes: false 
      },
      { 
        id: 3, 
        name: "McChicken®", 
        price: 2.99, 
        calories: "390 cal.", 
        hasSizes: false 
      },
      { 
        id: 4, 
        name: "Filet-O-Fish®", 
        price: 4.59, 
        calories: "380 cal.", 
        hasSizes: false 
      },
      { 
        id: 5, 
        name: "Chicken McNuggets®", 
        price: 3.99, 
        sizePrices: {small: 1.59, medium: 3.99, large: 7.39},
        calories: "", 
        hasSizes: true 
      },
      { 
        id: 6, 
        name: "World Famous Fries®", 
        price: 2.49, 
        sizePrices: {small: 2.99, medium: 3.79, large: 4.59},
        calories: "", 
        hasSizes: true 
      },
      { 
        id: 7, 
        name: "Hamburger Happy Meal®", 
        price: 4.59, 
        calories: "475 cal.", 
        hasSizes: false 
      },
      { 
        id: 8, 
        name: "Chocolate Chip Cookie", 
        price: 0.59, 
        calories: "170 cal.", 
        hasSizes: false 
      },
      { 
        id: 9, 
        name: "Hotcakes", 
        price: 5.69, 
        calories: "580 cal.", 
        hasSizes: false 
      },
      { 
        id: 10, 
        name: "Hash Brown", 
        price: 3.49, 
        calories: "140 cal.", 
        hasSizes: false 
      }
    ];
    
    // Adds click handlers to each menu item
    document.querySelectorAll('.grid > div').forEach((item, index) => {
      item.addEventListener('click', () => {
        openItemModal(itemsData[index]);
      });
      
      // Add hover effect
      item.classList.add(
        'cursor-pointer', 
        'transition-transform', 
        'duration-200',
        'hover:-translate-y-1',
        'hover:shadow-md'
      );
    });
  });
