async function newPostHandler(event) {
  event.preventDefault();

  const name = document.getElementById("post_name").value;
  const content = document.getElementById("post_content").value;

  const id = window.location.toString().split('/')[
    window.location.toString().split('/').length - 1
  ];

  const response = await fetch(`/api/topic/${id}`, {
    method: 'POST',       
    body: JSON.stringify({
        name,
        content,
    }),
    headers: {
      'Content-Type': 'application/json',
    },  
    });
    if (response.ok) {
      window.location.reload();
    } else {
      alert('Failed to add topic');
  }
}

document
  .querySelector("#post_form")
  .addEventListener("submit", newPostHandler);
