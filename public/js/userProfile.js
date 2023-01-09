'use strict';

const editProfileBtn = document.querySelector('.edit-profile-button');
const closeEditProfileBtn = document.querySelector('.delete');
const editModalOverlay = document.querySelector('.modal-background');
const editProfileModal = document.getElementById('edit-profile-modal');

// Modal Fields
const bioCount = document.getElementById('bio-character-count');
const firstName = document.getElementById('edit-profile-first-name');
const lastName = document.getElementById('edit-profile-last-name');
const username = document.getElementById('edit-profile-username');
const bio = document.getElementById('edit-profile-bio');
const email = document.getElementById('edit-profile-email');
const password = document.getElementById('edit-profile-password');

// Submit Button
const submitButton = document.getElementById('edit-profile-submit');

// Test Stuff
const buyButton = document.getElementById('buyBtnTest');
const sellButton = document.getElementById('sellBtnTest');

// Bid and Ask Modal
const orderModal = document.getElementById('place-order-modal');
const orderModalOverlay = document.getElementById('overlay-order-modal');
const bidTab = document.getElementById('order-modal-tab_bid');
const askTab = document.getElementById('order-modal-tab_ask');
const orderPrice = document.getElementById('order-modal-price');
const orderQuantity = document.getElementById('order-modal-quantity');
const orderNotification = document.getElementById('order-modal-notification');
const submitOrder = document.getElementById('order-modal-submit');
const cancelOrder = document.getElementById('order-modal-cancel');
const bidContent = document.getElementById('bid-content');
const askContent = document.getElementById('ask-content');
const priceHelp = document.getElementById('price-help');
const quantityHelp = document.getElementById('quantity-help');
const orderTotal = document.getElementById('order-total');
const orderForm = document.getElementById('order-form');

const buyButtons = document.querySelectorAll('.main-buy-button');
const sellButtons = document.querySelectorAll('.main-sell-button');

const modalCloseBtns = document.querySelectorAll('.delete');

console.log(buyButtons);

const openOrderModal = function (event) {
    orderModal.classList.toggle('is-active');
    const button = event.currentTarget;
    const topic_id = button.getAttribute('data-topicid');
    if (button.classList.contains('main-sell-button')) {
        askTab.classList.add('is-active');
        bidTab.classList.remove('is-active');
    } else {
        bidTab.classList.add('is-active');
        askTab.classList.remove('is-active');
    }
    orderModal.setAttribute('data-topicid', topic_id);
};

const closeOrderModal = function () {
    orderModal.classList.remove('is-active');
    orderPrice.value = '';
    orderQuantity.value = '';
    orderTotal.value = '';
};

const placeBid = async function (price, shares_requested, topic_id) {
    const response = await fetch('/api/bid', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            price,
            shares_requested,
            topic_id,
        }),
    });

    // TODO: return updated user balance to refresh balance info without reloading the entire page.

    const bid = await response.json();

    if (!response.ok) {
        orderNotification.textContent = bid?.message;
        orderNotification.classList.remove('is-hidden');
    } else {
        orderNotification.classList.remove('is-hidden');
        orderNotification.textContent = 'Bid Placed Successfully';
    }

    setTimeout(() => {
        orderNotification.classList.add('fade-out');
    }, 2000);

    orderNotification.addEventListener('transitionend', function () {
        orderNotification.classList.add('is-hidden');
    });

    return bid;
};

const placeAsk = async function (price, shares_requested, topic_id) {
    const response = await fetch('/api/ask', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            price,
            shares_requested,
            topic_id,
        }),
    });

    const ask = await response.json();

    if (!response.ok) {
        orderNotification.textContent = ask?.message;
    } else {
        orderNotification.textContent = 'Ask place successfully!';
    }
    return ask;
};

const placeOrder = async function () {
    try {
        const price = orderPrice.value;
        const shares_requested = orderQuantity.value;
        const topic_id = orderModal.getAttribute('data-topicid');

        if (bidTab.classList.contains('is-active')) {
            await placeBid(price, shares_requested, topic_id);
        } else if (askTab.classList.contains('is-active')) {
            await placeAsk(price, shares_requested, topic_id);
        }
    } catch (error) {
        console.log(error);
        if (error.message === 'Price Validation') {
            priceHelp.classList.remove('is-hidden');
            priceHelp.textContent = `Price must be in currency, decimal, or integer format only.`;
        } else if (error.message === 'Quantity Validation') {
            quantityHelp.classList.remove('is-hidden');
            quantityHelp.textContent = 'Quantity must be an integer.';
        }
    }
};

const toggleProfileModal = function () {
    editProfileModal.classList.toggle('is-active');
};

const updateProfile = async function (event) {
    event.preventDefault();

    const updateFormData = new FormData();
    updateFormData.append('firstName', firstName.value);
    updateFormData.append('lastName', lastName.value);
    updateFormData.append('bio', bio.value);
    updateFormData.append('email', email.value);
    updateFormData.append('password', password.value);

    let imageEl = document.getElementById('edit-profile-avatar');

    if (imageEl.value) {
        const imageObj = imageEl.files[0];
        updateFormData.append('avatar', imageObj, 'customProfileImage');
    }

    await fetch('/api/user', {
        method: 'PUT',
        body: updateFormData,
    });

    window.location.reload();
};

const updateCharacterCount = function () {
    const bioLength = bio.value.length;
    bioCount.textContent = `${bioLength}/140`;

    if (bio.value) {
        bio.classList.add('is-success');
    } else {
        bio.classList.remove('is-success');
    }

    if (bioLength <= 79) {
        bioCount.classList.remove('is-danger', 'is-warning');
        bioCount.classList.add('is-success');
    } else if (bioLength <= 139) {
        bioCount.classList.remove('is-success', 'is-danger');
        bioCount.classList.add('is-warning');
    } else {
        bioCount.classList.remove('is-success', 'is-warning');
        bioCount.classList.add('is-danger');
    }
};

bio.addEventListener('input', updateCharacterCount);

[editProfileBtn, closeEditProfileBtn, editModalOverlay].forEach((item) =>
    item.addEventListener('click', toggleProfileModal)
);

[...buyButtons, ...sellButtons].forEach((button) =>
    button.addEventListener('click', openOrderModal)
);

[...modalCloseBtns].forEach((button) =>
    button.addEventListener('click', function () {
        if (editProfileModal.classList.contains('is-active')) {
            editProfileModal.classList.remove('is-active');
        } else if (orderModal.classList.contains('is-active')) {
            orderModal.classList.remove('is-active');
        }
    })
);

orderForm.addEventListener('input', function () {
    if (orderPrice.value && orderQuantity.value) {
        orderTotal.textContent = orderPrice.value * orderQuantity || '';
    }
});

submitButton.addEventListener('click', updateProfile);

submitOrder.addEventListener('click', async function (event) {
    event.preventDefault();
    const button = event.currentTarget;
    console.log(button);
    const topic_id = button.getAttribute('data-topicid');
    await placeOrder(topic_id);
});

askTab.addEventListener('click', function () {
    bidTab.classList.toggle('is-active');
    askTab.classList.toggle('is-active');
});

bidTab.addEventListener('click', function () {
    askTab.classList.toggle('is-active');
    bidTab.classList.toggle('is-active');
});

orderModalOverlay.addEventListener('click', function () {
    orderModal.classList.toggle('is-active');
});

// function to preview uploaded avatar image
let loadFile = function (event) {
    var image = document.getElementById('preview');
    image.src = URL.createObjectURL(event.target.files[0]);
};

const openTab = (event, tabName) => {
    let i, x, tablinks;
    x = document.getElementsByClassName("content-tab");
    for (i = 0; i < x.length; i++) {
        x[i].style.display = "none";
    }
    tablinks = document.getElementsByClassName("tab");
    for (i = 0; i < x.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" is-active", "");
    }
    document.getElementById(tabName).style.display = "block";
    event.currentTarget.className += " is-active ";
  }