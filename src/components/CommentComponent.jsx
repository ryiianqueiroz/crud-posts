import CommentSection from "./CommentSection";
import PostSection from "./PostSection";
import LoadingGIF from "../assets/loading-gif.gif"
import { useEffect, useState } from "react";

function CommentComponent() {
  
  const [ Loading, setLoading ] = useState(false)
  const [ comments, setComments ] = useState([])

  useEffect(() => {
    fetch("http://localhost:5000/api/comments")
      .then(response => response.json())
      .then(data => setComments(data))
      .catch(error => {
        console.error('There was a problem with the fetch operation:', error);
      });
  }, [])

  const addComment = ( comment ) => {
    fetch('http://localhost:5000/api/comments', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(comment)
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(newComment => {
        setComments([...comments, newComment]);
      })
      .catch(error => {
        console.error('There was a problem with the fetch operation:', error);
      });
  }

  useEffect(() => {
    setLoading(true)
  }, [])
  
  return (
      <>
        { Loading ? ( 
          <section className="flex flex-col max-w-[700px] relative">
            <CommentSection comments={comments}></CommentSection>
            <PostSection addComment={addComment}></PostSection>
          </section> 
        ) : (
          <div>
            <img src={LoadingGIF} alt="#" />
          </div>
        ) }
      </>
    );
  }
  
  export default CommentComponent;