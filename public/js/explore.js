const searchTopicButton = document.getElementById("search-topics");
const suggestionsDropdownEl = document.getElementById("suggestions");
const topicsSection = document.getElementById("topics-section");
const addTopicBtn = document.getElementById("add-topic-button");
const addTopicModal = document.getElementById("add-topic-modal");
const researchSection = document.getElementById("research-section");
const cardsSection = document.getElementById("cards-section");
const searchKeywordEl = document.getElementById("search-topic-keyword");
//modal fields
const addTopicModalOverlay = document.querySelector(".modal-background");
const closeAddTopicBtn = document.querySelector(".delete");
const topicNameEl = document.getElementById("topic_name");
const priceEl = document.getElementById("price");
const descriptionEl = document.getElementById("description");
const descriptionCount = document.getElementById("description-character-count");
// Create Topic Button (in modal)
const submitButton = document.getElementById("create-topic-button");

const searchTopic = async () => {
  let searchVal = searchKeywordEl.value;
  let result = await fetch("/api/topic/search/?q=" + searchVal);
  let foundTopics = await result.json();

  try {
    suggestionsDropdownEl.innerHTML = "";
    foundTopics.forEach((topic) => {
      let newTopic = document.createElement("a");
      newTopic.classList.add("dropdown-item");
      newTopic.href = "/topic/" + topic.id;
      newTopic.text = topic.topic_name;
      suggestionsDropdownEl.appendChild(newTopic);
    });
  } catch (error) {
    console.log(error);
  }
};

function filterTopic() {
  // Locate the card elements
  let cards = document.querySelectorAll('.card')  
  // Locate the search input
  let search_query = document.getElementById("filter-topic-keyword").value;
  // Loop through the cards
  for (var i = 0; i < cards.length; i++) {
    // If the text is within the card...
    if(cards[i].innerText.toLowerCase()
      // ...and the text matches the search query...
      .includes(search_query.toLowerCase())) {
        // ...remove the `.is-hidden` class.
        cards[i].classList.remove("is-hidden");
    } else {
      // Otherwise, add the class.
      cards[i].classList.add("is-hidden");
    }
  }
}

//function called to clear search results
function hideSearchDropDown() {
  searchKeywordEl.value = "";
  suggestionsDropdownEl.innerHTML = "";
}

const updateCharacterCount = function () {
  const descriptionLength = descriptionEl.value.length;
  descriptionCount.textContent = `${descriptionLength}/5000`;

  if (descriptionEl.value) {
    descriptionEl.classList.add("is-success");
  } else {
    descriptionEl.classList.remove("is-success");
  }

  if (descriptionLength < 200) {
    descriptionCount.classList.remove("is-success", "is-warning");
    descriptionCount.classList.add("is-warning");
  } else if (descriptionLength > 5000) {
    descriptionCount.classList.remove("is-success", "is-danger");
    descriptionCount.classList.add("is-danger");
  } else {
    descriptionCount.classList.remove("is-danger", "is-warning");
    descriptionCount.classList.add("is-success");
  }
};

const createTopic = async function (event) {
  event.preventDefault();

  const topic_name = topicNameEl.value;
  const description = descriptionEl.value;
  const price = priceEl.value;
  if (!topic_name) {
    document.getElementById("check-name").textContent =
      "This field is required";
    topicNameEl.classList.add("is-danger");
  } else {
    document.getElementById("check-name").textContent = "";
    topicNameEl.classList.remove("is-danger");
  }

  if (!description) {
    document.getElementById("check-desc").textContent =
      "This field is required";
    descriptionEl.classList.add("is-danger");
  } else {
    document.getElementById("check-desc").textContent = "";
    descriptionEl.classList.remove("is-danger");
  }

  if (!price) {
    document.getElementById("check-price").textContent =
      "This field is required";
    priceEl.classList.add("is-danger");
  } else {
    document.getElementById("check-price").textContent = "";
    priceEl.classList.remove("is-danger");
  }

  if (topic_name && description && price) {
    try {
      const response = await fetch("/api/topic", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          topic_name,
          price,
          description,
        }),
      });

      const { message } = await response.json();

      if (!response.ok) {
        throw new Error(`(${response.status}): ${message}`);
      }
      // refresh page with new record
      window.location.reload();
    } catch (error) {
      console.log(error);
    }
  }
};

const toggleAddTopicModal = function () {
  addTopicModal.classList.toggle("is-active");
};

[addTopicBtn, closeAddTopicBtn, addTopicModalOverlay].forEach((item) =>
  item.addEventListener("click", toggleAddTopicModal)
);

descriptionEl.addEventListener("input", updateCharacterCount);
submitButton.addEventListener("click", createTopic);
researchSection.addEventListener("click", hideSearchDropDown);
cardsSection.addEventListener("click", hideSearchDropDown);
