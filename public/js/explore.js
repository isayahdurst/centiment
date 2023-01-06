const searchTopicButton = document.getElementById('search-topics');
const clearResultsButton = document.getElementById('clear-results');
const suggestionsDropdownEl = document.getElementById('suggestions');
const topicsSection = document.getElementById('topics-section');

function filterTopic() {
  // Locate the card elements
  let cards = document.querySelectorAll('.card')  
  // Locate the search input
  let search_query = document.getElementById("searchbox").value;
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

const searchTopic = async () => {
  let searchVal = document.getElementById("searchTopicKeyword").value;
  let result = await fetch('/api/topic/search/?q='+searchVal);
  let foundTopics = await result.json();
  
    try {
      suggestionsDropdownEl.innerHTML="";
      foundTopics.forEach((topic) => {
        let newTopic = document.createElement("a");
        newTopic.classList.add("dropdown-item");
        newTopic.href = "/topic/"+topic.id;
        newTopic.text = topic.topic_name;
        suggestionsDropdownEl.appendChild(newTopic);
      });
    } catch(error) {
      console.log(error);
    }
}

// TODO(Olga in progress): render page with cards based on search results
const showResults = async() => {
  suggestionsDropdownEl.innerHTML="";
  let searchVal = document.getElementById("searchTopicKeyword").value;
  // let result = await fetch('/api/topic/search/?q='+searchVal);
  // window.location.replace('/explore/?q='+searchVal);
}

function showLastestTopics() {
  window.location.replace('/explore');
}

function clearSearchInput() {
  document.getElementById("searchTopicKeyword").value="";
}

searchTopicButton.addEventListener('click', showResults);
clearResultsButton.addEventListener('click',showLastestTopics);