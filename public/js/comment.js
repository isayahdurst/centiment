
const loadCommentsButtons = document.querySelectorAll('.comment-btn');
const postCommentButtons = document.querySelectorAll('.post-comment-button');
const commentField = document.getElementById('comment-field');


// Load the next X number of comments in a post
const loadNextComments = async function(event) {
    const button = event.currentTarget;

    // Pull next 5 comments and then track that 5 comments have been pulled
    const res = await fetch(`/api/comment/post/next5/${parseInt(button.dataset.commentspulled)}/${button.dataset.postid}`);
    const commentData = await res.json();
    console.log(commentData);
    button.dataset.commentsPulled = parseInt(button.dataset.commentsPulled) + 5;

    const allCommentContainer = button.parentNode.parentNode.parentNode.parentNode.children[1];
    console.log(allCommentContainer);

    // Update DOM with all new comments that were pulled
    commentData.forEach(async (comment) => {
        // Create DOM elements for comments
        const newCommentContainer = document.createElement('div');
        newCommentContainer.classList.add('message', 'is-small');
        allCommentContainer.insertBefore(newCommentContainer,allCommentContainer.children[allCommentContainer.children.length - 3]);

        const newCommentBody = document.createElement('div');
        newCommentBody.classList.add('message-body');
        newCommentContainer.append(newCommentBody);

        const newCommentUser = document.createElement('p');
        newCommentUser.classList.add('has-text-weight-bold');
        newCommentUser.innerHTML = `${comment.user.username}<br>`;
        newCommentBody.append(newCommentUser);

        const newCommentContent = document.createElement('p');
        newCommentContent.innerHTML = `${comment.content}<br><br>`;
        newCommentBody.append(newCommentContent);

        const newCommentDate = document.createElement('p');
        newCommentDate.innerHTML = new Date(comment.date_created).toLocaleDateString();
        newCommentBody.append(newCommentDate);    
    });
};

// Post comment to topic
const postComment = async function(event) {
    event.preventDefault();
    const currentTopic = event.currentTarget.parentNode.parentNode.parentNode;
    const button = event.currentTarget;
    const content = document.getElementById('comment-field').value;
    
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
    document.getElementById('comment-field').value = '';

    const newCommentContainer = document.createElement('div');
    newCommentContainer.classList.add('message', 'is-small');
    currentTopic.children[currentTopic.children.length - 3].append(newCommentContainer);

    const newCommentBody = document.createElement('div');
    newCommentBody.classList.add('message-body');
    newCommentContainer.append(newCommentBody);

    const newCommentUser = document.createElement('p');
    newCommentUser.classList.add('has-text-weight-bold');
    newCommentUser.innerHTML = `${newCommentData.user.username}<br>`;
    newCommentBody.append(newCommentUser);

    const newCommentContent = document.createElement('p');
    newCommentContent.innerHTML = `${content}<br><br>`;
    newCommentBody.append(newCommentContent);

    const newCommentDate = document.createElement('p');
    newCommentDate.innerHTML = new Date(newCommentData.date_created).toLocaleDateString();
    newCommentBody.append(newCommentDate);    
};


// Assign each post a comment button that you can click to see more comments
[...loadCommentsButtons].forEach((button) => {
    button.addEventListener("click", loadNextComments);
});


// Assign each post a button you can use to post comments
[...postCommentButtons].forEach((button) => {
    button.addEventListener("click", postComment)
});



