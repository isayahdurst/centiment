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

submitButton.addEventListener('click', updateProfile);

// TEST ROUTE
buyButton.addEventListener('click', async function () {
    // Post Route
    console.log('/api/bid');
    const response = await fetch('/api/bid', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            price: 100,
            shares_requested: 1,
            topic_id: 1,
        }),
    });

    // TODO: return updated user balance to refresh balance info without reloading the entire page.

    const bid = await response.json();
    console.log(bid);
});

// TEST ROUTE
sellButton.addEventListener('click', async function () {
    console.log('/api/ask');
    const response = await fetch('/api/ask', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            price: 90,
            shares: 100,
            topic_id: 1,
        }),
    });

    const ask = await response.json();
    console.log(ask);
});

// function to preview uploaded avatar image
let loadFile = function (event) {
    var image = document.getElementById('preview');
    image.src = URL.createObjectURL(event.target.files[0]);
};
