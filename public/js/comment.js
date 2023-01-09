const loadCommentsButtons = document.querySelectorAll('.comment-btn');
const postCommentButtons = document.querySelectorAll('.post-comment-button');
const numCommentsFigures = document.querySelectorAll('.num-comments');
const commentFields = document.querySelectorAll('.comment-field');


// Load the next X number of comments in a post
const loadNextComments = async function(event) {
    const button = event.currentTarget;

    // Pull next 5 comments and then track that 5 comments have been pulled
    const res = await fetch(`/api/comment/post/next5/${parseInt(button.dataset.commentspulled)}/${button.dataset.postid}`);
    const commentData = await res.json();
    button.dataset.commentspulled = parseInt(button.dataset.commentspulled) + 5;

    const allCommentContainer = button.parentNode.parentNode.parentNode.parentNode.children[1];

    // Update DOM with all new comments that were pulled
    commentData.forEach(async (comment) => {
        // Create DOM elements for comments
        const newCommentContainer = document.createElement('div');
        newCommentContainer.classList.add('message', 'is-small');
        allCommentContainer.insertBefore(newCommentContainer,allCommentContainer.children[allCommentContainer.children.length - 3]);

        const newCommentBody = document.createElement('div');
        newCommentBody.classList.add('message-body');
        newCommentContainer.append(newCommentBody);

        const newCommentUser = document.createElement('a');
        newCommentUser.classList.add('has-text-weight-bold');
        newCommentUser.innerHTML = `@${comment.user.username}<br>`;
        newCommentUser.href = `/user/${comment.user.username}`
        newCommentBody.append(newCommentUser);

        const newCommentContent = document.createElement('p');
        newCommentContent.innerHTML = `${comment.content}<br><br>`;
        newCommentBody.append(newCommentContent);

        const smallDate = document.createElement('small');
        newCommentBody.append(smallDate);

        const newCommentDate = document.createElement('p');
        newCommentDate.innerHTML = new Date(comment.date_created).toLocaleDateString();
        smallDate.append(newCommentDate);    
    });
};

// Post comment to topic
const postComment = async function(event) {
    event.preventDefault();
    const currentTopic = event.currentTarget.parentNode.parentNode.parentNode;
    const button = event.currentTarget;
    const textbox = currentTopic.children[1].children[0].children[1];
    const content = textbox.value;
    
    // Exit the function if comment box is blank
    if (!content){
        return;
    };

    
    const res = await fetch(`/api/comment/${button.dataset.postid}`, {
        method: 'POST',
        body: JSON.stringify({
            content,
        }),
        headers: {
          'Content-Type': 'application/json',
        },
    });

    if (!res.ok) {
        alert('Failed to add comment.');
        return;
    };

    // Get data from the new comment to update DOM
    const newCommentId = await res.json();
    const newCommentRes = await fetch(`/api/comment/${newCommentId.id}`);
    const newCommentData = await newCommentRes.json();
   
    // Update DOM with new comment
    textbox.value = '';

    const newCommentContainer = document.createElement('div');
    newCommentContainer.classList.add('message', 'is-small');
    currentTopic.children[currentTopic.children.length - 3].append(newCommentContainer);

    const newCommentBody = document.createElement('div');
    newCommentBody.classList.add('message-body');
    newCommentContainer.append(newCommentBody);

    const newCommentUser = document.createElement('a');
    newCommentUser.classList.add('has-text-weight-bold');
    newCommentUser.innerHTML = `@${newCommentData.user.username}<br>`;
    newCommentUser.href = `/user/${newCommentData.user.username}`
    newCommentBody.append(newCommentUser);

    const newCommentContent = document.createElement('p');
    newCommentContent.innerHTML = `${content}<br><br>`;
    newCommentBody.append(newCommentContent);

    const smallDate = document.createElement('small');
    newCommentBody.append(smallDate);

    const newCommentDate = document.createElement('p');
    newCommentDate.innerHTML = new Date(newCommentData.date_created).toLocaleDateString();
    smallDate.append(newCommentDate);     

    refreshData();
};

// Get a count of all comments for a given post_id
const getCommentCount = async function(post_id) {
    const res = await fetch(`/api/comment/post/countof/${post_id}`);
    const count = await res.json();
    const parsed = parseInt(count);

    if(isNaN(parsed)){
        parsed = 0;
    }

    return parsed;
};




// Assign each post a comment button that you can click to see more comments
[...loadCommentsButtons].forEach((button) => {
    button.addEventListener("click", loadNextComments);
});


// Assign each post a button you can use to post comments
[...postCommentButtons].forEach((button) => {
    button.addEventListener("click", postComment)
});

// Assign each post a button you can use to post comments
[...commentFields].forEach((button) => {
    button.addEventListener("click", postComment)
});

// Assign each post a button you can use to post comments
[...numCommentsFigures].forEach(async (figure) => {
    figure.innerHTML = await getCommentCount(figure.dataset.postid);
});


const refreshData = async function() {
    // Assign each post a button you can use to post comments
    [...numCommentsFigures].forEach(async (figure) => {
        figure.innerHTML = await getCommentCount(figure.dataset.postid);
    });
};



