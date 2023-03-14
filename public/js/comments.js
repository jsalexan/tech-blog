async function commentFormHandler(event) {
  event.preventDefault();

  const commentBody = document.querySelector('#comment').value.trim();

  const post_id = document.querySelector('input[name="post_id"]').value;

  if (commentBody) {
    const response = await fetch('/api/comments', {
      method: 'POST',
      body: JSON.stringify({ comment_body, post_id }),
      headers: { 'Content-Type': 'application/json' },
    });

    try {
      if (response.ok) {
        document.location.reload();
      } else {
        alert('Failed to add comment');
      }
    } catch (err) {
      console.log(err.message);
    }
  }
};
document.querySelector('.comment-form').addEventListener('submit', commentFormHandler);