const commentFormHandler = async (event) => {
    event.preventDefault();
  
    const body = document.querySelector('#comment').value.trim();
  
    if (body) {
      const response = await fetch(`/api/comments`, {
        method: 'POST',
        body: JSON.stringify({ body }),
        headers: {
          'Content-Type': 'application/json',
        },
      })
    }
    if (response.ok) {
        document.location.reload();
    } else {
        alert(response.statusText);
    }
}

document.querySelector('.comment-form').addEventListener('submit', commentFormHandler)

