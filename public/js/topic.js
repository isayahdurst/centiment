async function newTopicHandler(event) {
  event.preventDefault();

  const name = document.getElementById("topic_name").value;
  const description = document.getElementById("topic_description").value;
  let price = document.getElementById("topic_price").value;
  price = parseInt(price);

  const res = await fetch('/api/topic', {
    method: 'POST',       
    body: JSON.stringify({
        name,
        description,
        price,
    }),
    headers: {
      'Content-Type': 'application/json',
    },  
    });
    if (res.ok) {
      window.location.reload();
    } else {
      alert('Failed to add topic');
  }
}

document
  .querySelector("#topic_form")
  .addEventListener("submit", newTopicHandler);
