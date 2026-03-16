document.addEventListener('DOMContentLoaded', () => {

    // Hamburger Menu
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('navMenu');
    hamburger.addEventListener('click', () => navMenu.classList.toggle('active'));

    // زر "تسوق الآن"
    const shopBtn = document.getElementById('shopBtn');
    shopBtn.addEventListener('click', () => document.getElementById('productList').scrollIntoView({ behavior: 'smooth' }));

    // السلة
    const cartBtn = document.querySelector('.cart-open-btn');
    const cartPopup = document.getElementById('cartWindow');
    const cartItemsContainer = document.getElementById('cartItems');
    const totalPriceEl = document.getElementById('totalPrice');
    const cartCountEl = document.getElementById('cartCount');

    let cart = [];

    // إظهار/إخفاء السلة
    cartBtn.addEventListener('click', () => cartPopup.classList.toggle('active'));

    // إضافة المنتجات للسلة
    document.getElementById('productList').addEventListener('click', e => {
        if (e.target.tagName === 'BUTTON') {
            const product = e.target.closest('.product');
            const name = product.querySelector('h3').innerText;
            const price = parseInt(product.querySelector('.price').innerText.replace(/[^0-9]/g, '')) || 0;
            const img = product.querySelector('img').src;

            const existing = cart.find(item => item.name === name);
            if (existing) existing.quantity += 1;
            else cart.push({ name, price, img, quantity: 1 });

            updateCart();
            cartPopup.classList.add('active');

            // تأثير توهج للعداد
            cartCountEl.classList.add('glow');
            setTimeout(() => cartCountEl.classList.remove('glow'), 300);
        }
    });

    // تحديث محتوى السلة
    function updateCart() {
        cartItemsContainer.innerHTML = '';
        let total = 0,
            count = 0;

        cart.forEach((item, index) => {
            total += item.price * item.quantity;
            count += item.quantity;

            const div = document.createElement('div');
            div.classList.add('cart-item');
            div.innerHTML = `
                <img src="${item.img}" alt="${item.name}">
                <div class="item-details">
                    <span class="item-name">${item.name}</span>
                    <span class="item-price">${item.price * item.quantity} جنيه</span>
                    <div class="item-qty">
                        <button class="qty-btn" data-index="${index}" data-action="dec">-</button>
                        <span>${item.quantity}</span>
                        <button class="qty-btn" data-index="${index}" data-action="inc">+</button>
                    </div>
                </div>
                <button class="remove-item" data-index="${index}">×</button>
            `;
            cartItemsContainer.appendChild(div);
        });

        totalPriceEl.innerText = `الإجمالي: ${total} جنيه`;
        cartCountEl.innerText = count;
    }

    // التحكم بالكمية والحذف باستخدام Event Delegation
    cartItemsContainer.addEventListener('click', e => {
        const index = e.target.getAttribute('data-index');
        if (index === null) return;
        const i = parseInt(index);

        if (e.target.classList.contains('qty-btn')) {
            const action = e.target.getAttribute('data-action');
            if (action === 'inc') cart[i].quantity++;
            else if (action === 'dec') {
                if (cart[i].quantity > 1) cart[i].quantity--;
                else cart.splice(i, 1);
            }
        } else if (e.target.classList.contains('remove-item')) {
            cart.splice(i, 1);
        }
        updateCart();
    });
});