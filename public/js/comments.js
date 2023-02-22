async function commentFormHandler(event) {
  event.preventDefault();

  const commentBody = document.querySelector('#comment').value.trim();

  const postId = window.location.href.toString().split('/post/')[1];

  if (commentBody && postId) {

      const response = await fetch('/api/comment', {
        method: 'POST',
        body: JSON.stringify({
          postId,
          commentBody
        }),
        headers: {
          'Content-Type': 'application/json'
        }
      });
    
      if (response.ok) {
        document.location.reload()
    } else {
        alert('Failed to create comment');
      }
}
  };


document.querySelector('.comment-form').addEventListener('submit', commentFormHandler);
