async function newPostHandler(event) {
  event.preventDefault();

  const id = window.location.toString().split('/')[
  window.location.toString().split('/').length - 1 ];
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
    } else {
        alert('Failed to add post');
    }
  }
    
document
  .querySelector("#new_post_form")
  .addEventListener("submit", newPostHandler);