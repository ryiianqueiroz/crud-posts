export const fetchComments = async () => {
    const response = await fetch("http://localhost:5000/api/comments");
    if (!response.ok) {
        throw new Error('Network response was not ok');
    }
    return response.json();
    };

export const postComment = async (comment) => {
    const response = await fetch("http://localhost:5000/api/comments", {
        method: 'POST',
        headers: {
        'Content-Type': 'application/json',
        },
        body: JSON.stringify(comment),
    });
    if (!response.ok) {
        throw new Error('Network response was not ok');
    }
    return response.json();
};

export const deletarComentario = async (id, type, idReply) => {
    try {
      const response = await fetch(`http://localhost:5000/api/comments/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          "type": type,
          "id-reply": idReply
        }
      });
      return response;
    } catch (error) {
      console.error('There was a problem with the fetch operation:', error);
      throw error;
    }
  };