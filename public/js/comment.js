const commentFormHandler = async (event) => {
    event.preventDefault();
  
    const comment_body = document.querySelector('#comment').value.trim();
  
    const post_id = window.location.toString().split('/')[
      window.location.toString().split('/').length - 1
  ]
  
    if (comment_body) {
        const response = await fetch('/api/comments', {
          method: 'POST',
          body: JSON.stringify({
            post_id,
            comment_body
          }),
          headers: {
            'Content-Type': 'application/json'
          }
        });
      
        if (response.ok) {
          document.location.reload();
          console.log(comment_body);
        } else {
            console.log("Error posting comment")
          alert(response.statusText);
        }
      }
  }
  
  document.querySelector('.comment-form').addEventListener('submit', commentFormHandler);