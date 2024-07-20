import CommentSection from "./CommentSection";
import PostSection from "./PostSection";
import LoadingGIF from "../assets/loading-gif.gif"
import { useEffect, useState } from "react";

function CommentComponent() {
  
  const [ Loading, setLoading ] = useState(false)
  
  useEffect(() => {
    setLoading(true)
  }, [])
  
  return (
      <>
        { Loading ? ( 
          <section className="flex flex-col max-w-[700px] relative">
            <CommentSection></CommentSection>
            <PostSection></PostSection>
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