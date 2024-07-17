export const fetchComments = async () => {
    const response = await fetch("http://localhost:5000/api/comments");
    if (!response.ok) {
        throw new Error('Resposta do servidor não foi ok');
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
        throw new Error('Resposta do servidor não foi ok');
    }
    return response.json();
};

export const postReply = async (idComment, reply) => {
  const response = await fetch(`http://localhost:5000/api/comments/${idComment}`, {
      method: 'POST',
      headers: {
      'Content-Type': 'application/json',
      },
      body: JSON.stringify(reply),
  });
  if (!response.ok) {
      throw new Error('Resposta do servidor não foi ok');
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

export const score = async ( idComment, gain, idReply = -1 ) => {
  try {
    const response = await fetch(`http://localhost:5000/api/comments/${idComment}`, {
      method: "PUT",
      headers: {
        'Content-Type': 'application/json',
        "gain": gain,
        "id-reply": idReply
      }
    })

    return response
  } catch ( error ) {
    console.error('There was a problem with the fetch operation:', error);
    throw error;
  }
}

export const updateContent = async ( idComment, idReply = -1, contentUpdated ) => {
  try {
    const response = await fetch(`http://localhost:5000/api/comments/${idComment}`, {
      method: "PUT",
      headers: {
        'Content-Type': 'application/json',
        "content": contentUpdated,
        "id-reply": idReply
      }
    })

    return response
  } catch ( error ) {
    console.error('There was a problem with the fetch operation:', error);
    throw error;
  }
}