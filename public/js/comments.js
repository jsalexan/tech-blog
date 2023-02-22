async function commentFormHandler(event) {
  event.preventDefault();

  const commentBody = document.querySelector('#comment').value.trim();

  const post_id = window.location.href.toString().split('/post/')[1];

  if (commentBody && post_id) {

      const response = await fetch('/api/comment', {
        method: 'POST',
        body: JSON.stringify({
          post_id,
          commentBody
        }),
        headers: {
          'Content-Type': 'application/json'
        }
      });
    
      if (response.ok) {
        document.location.reload();
      } else {
        console.log("Error posting comment")
        alert(response.statusText);
      }
    
  }
}

document.querySelector('.comment-form').addEventListener('submit', commentFormHandler);
