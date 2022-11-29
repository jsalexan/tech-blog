async function commentFormHandler(event) {
  event.preventDefault();
  
  const commentBody = document.querySelector('#comment').value.trim();

  if (commentBody) {
      const response = await fetch('/api/comments', {
        method: 'POST',
        body: JSON.stringify({

          commentBody
        }),
        headers: {
          'Content-Type': 'application/json'
        }
      });

    if (response.ok) {
        document.location.reload();
    } else {
        console.log("Error creating comment!")
        alert(response.statusText);
    }
}};

document.querySelector('.comment-form').addEventListener('submit', commentFormHandler)

