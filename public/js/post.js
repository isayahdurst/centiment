const postMessage = document.getElementById('post-confirmation');

async function newPostHandler(event) {
    event.preventDefault();
    postMessage.textContent = '';

    const id = window.location.toString().split('/')[
        window.location.toString().split('/').length - 1
    ];
    const post_name = document.getElementById('post_name').value;
    const contents = document.getElementById('post_contents').value;

    const res = await fetch(`/api/topic/${id}`, {
        method: 'POST',
        body: JSON.stringify({
            post_name,
            contents,
            id,
        }),
        headers: {
            'Content-Type': 'application/json',
        },
    });
    if (res.ok) {
        document.location.replace(`/topic/${id}`);
    } else if (res.status === 401) {
        const message = await res.json();
        console.log(postMessage);
        postMessage.textContent = message.message;
        setTimeout(() => {
            postMessage.textContent = '';
        }, 3000);
    } else {
        alert('Failed to add post');
    }
}

document
    .querySelector('#new_post_form')
    .addEventListener('submit', newPostHandler);
