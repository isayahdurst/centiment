'use strict';

const buyDropDown = document.getElementById('ipo-buy-dropdown');
const buyDropDownBtn = document.getElementById('ipo-buy-dropdown-btn');
const ipoConfirmBtn = document.getElementById('ipo-confirm-btn');
const ipoCostLabel = document.getElementById('ipo-total-price');
const ipoShareQuantity = document.getElementById('ipo-share-quantity'); // Input field

buyDropDownBtn.addEventListener('click', function (event) {
    event.preventDefault();
    buyDropDown.classList.toggle('is-active');
});

ipoShareQuantity.addEventListener('input', function () {
    const cost = ipoCostLabel.getAttribute('data-price');
    ipoCostLabel.textContent = `$${ipoShareQuantity.value * cost}`;
});

ipoConfirmBtn.addEventListener('click', function(event) {
    event.preventDefault();
    const response = await fetch('/topic/buyIPO', 
    {
        method: 'POST',
        headers: {
            'Content-Type':'application/json',
        },
        body: JSON.stringify({
            topic_id: topic_id,
            quantity: ipoQuantity.value
        })
    })
})

// When the user clicks on the buy button, they should be prompted to enter a quantity. If the IPO shares available are greater than or equal to the shares that the user is requesting, then deduct the appropriate amount of funds from the user's account and credit them with the corresponding number of shares. Deduct those shares from the topic's initial shares.
