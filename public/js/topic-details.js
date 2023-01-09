'use strict';

const buyDropDown = document.getElementById('ipo-buy-dropdown');
const buyDropDownBtn = document.getElementById('ipo-buy-dropdown-btn');
const ipoConfirmBtn = document.getElementById('ipo-confirm-btn');
const ipoCostLabel = document.getElementById('ipo-total-price');
const ipoShareQuantity = document.getElementById('ipo-share-quantity'); // Input field
const ipoConfirmationMessage = document.getElementById('IPO-notification');

// Post - features
const upvoteButtons = document.querySelectorAll('.upvote-btn');
const downvoteButtons = document.querySelectorAll('.downvote-btn');
const upvoteCounts = document.querySelectorAll('.upvote-count');
const downvoteCounts = document.querySelectorAll('.downvote-count');

console.log(upvoteButtons);
console.log(upvoteCounts);

const upvotePost = async function (event) {
    console.log('button clicked');
    const button = event.currentTarget;
    const post_id = button.getAttribute('data-postid');

    const response = await fetch('/api/post/upvote', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            id: post_id,
        }),
    });

    const upvoteCount = upvoteCounts.filter(
        (label) => label.getAttribute('data-postid') === post_id
    );
    const downvoteCount = downvoteCounts.filter(
        (label) => label.getAttribute('data-postid') === post_id
    );

    const newVotes = await response.json();
    if (response.ok) {
        upvoteCount.textContent = newVotes.upvotes;
        downvoteCount.textContent = newVotes.downvotes;
    }
};

upvoteButtons.forEach((button) => button.addEventListener('click', upvotePost));

buyDropDownBtn.addEventListener('click', function (event) {
    event.preventDefault();
    buyDropDown.classList.toggle('is-active');
});

document.addEventListener('click', function (event) {
    if (buyDropDown.classList.contains('is-active')) {
        // If the click was outside the dropdown menu
        if (!event.target.closest('.dropdown')) {
            // Close the dropdown menu
            buyDropDown.classList.remove('is-active');
        }
    }
});

ipoShareQuantity.addEventListener('input', function () {
    const cost = ipoCostLabel.getAttribute('data-price');
    ipoCostLabel.textContent = `$${ipoShareQuantity.value * cost}`;
});

ipoConfirmBtn.addEventListener('click', async function (event) {
    event.preventDefault();
    const topic_id = ipoConfirmBtn.getAttribute('data-topic_id');
    console.log(topic_id);

    const response = await fetch('/api/topic/buyIPO', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            topic_id: topic_id,
            quantity: ipoShareQuantity.value,
        }),
    });

    buyDropDown.classList.toggle('is-active');

    const shares = await response.json();
    if (response.ok) {
        ipoConfirmationMessage.className = 'notification';
        ipoConfirmationMessage.classList.remove('is-hidden');
        ipoConfirmationMessage.classList.add('is-success');
        ipoConfirmationMessage.textContent =
            "Hooray! You've just made the greatest investment of your life. No, seriously. This topic is going to change everything. You're going to be the envy of all your friends. You'll be more popular than the person who brought the good snacks to the party. Trust us, you made the right choice. (Now go ahead and pat yourself on the back. You deserve it.)";
    } else {
        ipoConfirmationMessage.className = 'notification';
        ipoConfirmationMessage.classList.remove('is-hidden');
        ipoConfirmationMessage.classList.add('is-danger');
        ipoConfirmationMessage.textContent =
            shares.message || `${response.status}: Unexpected Error Occured`;
    }

    setTimeout(() => {
        ipoConfirmationMessage.classList.add('fade-out');
    }, 2000);

    ipoConfirmationMessage.addEventListener('transitionend', function () {
        ipoConfirmationMessage.classList.add('is-hidden');
    });
    console.log(shares);
});
