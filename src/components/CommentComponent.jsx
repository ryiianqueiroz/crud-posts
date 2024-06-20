import CommentSection from "./CommentSection";
import PostSection from "./PostSection";

function CommentComponent() {
    return (
      <section className="flex flex-col max-w-[700px]">
        <CommentSection></CommentSection>
        <PostSection></PostSection>
      </section>
    );
  }
  
  export default CommentComponent;