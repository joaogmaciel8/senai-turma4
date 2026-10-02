let cart = [];
 
function toggleCart() {
    const sidebar = document.getElementById('cart-sidebar');
    const overlay = document.getElementById('cart-overlay');
    if (!sidebar || !overlay) return;
    sidebar.classList.toggle('open');
    overlay.style.display = sidebar.classList.contains('open') ? 'block' : 'none';
}
 
function addToCart(id, name, price, img) {
    const existingItem = cart.find(item => item.id === id);
    if (existingItem) {
        existingItem.qty += 1;
    } else {
        cart.push({ id, name, price, img, qty: 1 });
    }
    updateCartUI();
    toggleCart();
}
 
function changeQty(id, delta) {
    const item = cart.find(item => item.id === id);
    if (item) {
        item.qty += delta;
        if (item.qty <= 0) {
            cart = cart.filter(i => i.id !== id);
        }
    }
    updateCartUI();
}
 
function updateCartUI() {
    const cartItemsContainer = document.getElementById('cart-items');
    const cartCountElement = document.getElementById('cart-count');
    const cartTotalElement = document.getElementById('cart-total-price');
 
    if (!cartItemsContainer || !cartCountElement || !cartTotalElement) return;
 
    const totalQty = cart.reduce((sum, item) => sum + item.qty, 0);
    cartCountElement.innerText = totalQty;
 
    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<p class="empty-cart-msg">O seu carrinho está vazio.</p>';
        cartTotalElement.innerText = '0,00 €';
        return;
    }
 
    let html = '';
    let total = 0;
 
    cart.forEach(item => {
        const subtotal = item.price * item.qty;
        total += subtotal;
 
        html += `
<div class="cart-item">
<img src="${item.img}" alt="${item.name}">
<div class="cart-item-details">
<div class="cart-item-title">${item.name}</div>
<div class="cart-item-price">${item.price.toFixed(2).replace('.', ',')} €</div>
<div class="cart-item-qty">
<button class="qty-btn" onclick="changeQty('${item.id}', -1)">-</button>
<span>${item.qty}</span>
<button class="qty-btn" onclick="changeQty('${item.id}', 1)">+</button>
</div>
</div>
</div>
        `;
    });
 
    cartItemsContainer.innerHTML = html;
    cartTotalElement.innerText = `${total.toFixed(2).replace('.', ',')} €`;
}
 
function checkout() {
    if (cart.length === 0) {
        alert('O seu carrinho está vazio!');
        return;
    }
    alert('Grazie mille! O seu pedido foi registado com sucesso.');
    cart = [];
    updateCartUI();
    toggleCart();
}
