let cart = [];
 
// Estado inicial do stock em memória (Limite de 50 unidades para cada produto)
const productsStock = {
    'pizza': 50,
    'macarrao': 50,
    'lasanha': 50
};
 
function toggleCart() {
    const sidebar = document.getElementById('cart-sidebar');
    const overlay = document.getElementById('cart-overlay');
    if (!sidebar || !overlay) return;
    sidebar.classList.toggle('open');
    overlay.style.display = sidebar.classList.contains('open') ? 'block' : 'none';
}
 
function addToCart(id, name, price, img, maxStock) {
    const currentStock = productsStock[id] !== undefined ? productsStock[id] : maxStock;
    const existingItem = cart.find(item => item.id === id);
    const currentQtyInCart = existingItem ? existingItem.qty : 0;
 
    if (currentQtyInCart >= currentStock) {
        alert(`Não é possível adicionar mais unidades. Stock disponível: ${currentStock}`);
        return;
    }
 
    if (existingItem) {
        existingItem.qty += 1;
    } else {
        cart.push({ id, name, price, img, qty: 1, maxStock: currentStock });
    }
    updateCartUI();
    toggleCart();
}
 
function changeQty(id, delta) {
    const item = cart.find(item => item.id === id);
    if (item) {
        const currentStock = productsStock[id];
        if (delta > 0 && item.qty >= currentStock) {
            alert(`Atingiu o limite do stock disponível (${currentStock} un.).`);
            return;
        }
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
 
    // Abater itens encomendados ao stock em memória
    cart.forEach(item => {
        if (productsStock[item.id] !== undefined) {
            productsStock[item.id] -= item.qty;
            updateStockDisplay(item.id);
        }
    });
 
    alert('Grazie mille! O seu pedido foi registado e o stock foi atualizado.');
    cart = [];
    updateCartUI();
    toggleCart();
}
 
function updateStockDisplay(id) {
    const stockElement = document.getElementById(`stock-${id}`);
    const btnElement = document.getElementById(`btn-${id}`);
    const remaining = productsStock[id];
 
    if (stockElement) {
        if (remaining > 0) {
            stockElement.innerText = `Em stock: ${remaining} un.`;
            stockElement.className = 'stock-tag in-stock';
        } else {
            stockElement.innerText = 'Esgotado';
            stockElement.className = 'stock-tag out-of-stock';
        }
    }
 
    if (btnElement && remaining <= 0) {
        btnElement.disabled = true;
        btnElement.classList.add('disabled');
        btnElement.innerText = 'Esgotado';
    }
}
