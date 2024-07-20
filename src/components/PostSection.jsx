import { useState } from "react";
import Avatar from "../assets/images/avatars/image-juliusomo.png"
import { postComment } from "../requests/request";

function PostSection() {
  
  const [content, setContent] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault()
    const newComment = {
      content,
      createdAt: "a few moments ago",
      score: 0,
      user: {
        image: { 
          png: "./assets/images/avatars/image-juliusomo.png",
          webp: "./images/avatars/image-juliusomo.webp"
        },
        username: "juliusomo"
      },
      replies: []
    }
    postComment(newComment)
    setContent("")
  }

  return (
    <form onSubmit={handleSubmit} className="flex fixed bottom-0 px-[50px] min-w-[700px] min-h-[130px] mb-3 rounded-lg">
      <div className="bg-white w-full grid grid-cols-[auto,1fr,auto] gap-4">
        <div className="m-5">
          <img src={Avatar} alt="#" className="w-10"/>
        </div>
        <div className="flex justify-center max-h-[130px] mt-5">
          <textarea
            className="peer max-h-[100px] w-full resize-none border-[2px] rounded-[7px] bg-transparent px-3 py-2.5 font-sans text-sm font-normal text-blue-gray-700 outline outline-0 transition-all placeholder-shown:border placeholder-shown:border-blue-gray-200 placeholder-shown:border-t-blue-gray-200 focus:border-2 focus:border-gray-900 focus:border-t-transparent focus:outline-0 disabled:resize-none disabled:border-0 disabled:bg-blue-gray-50"
            placeholder="Add a comment..."
            onChange={(e) => setContent(e.target.value)}>  
          </textarea>
        </div>
        <div className="m-5">
          <button type="submit" className="p-3 px-5 bg-[#5457b6] text-white rounded-lg text-[0.9rem]">SEND</button>
        </div>
      </div>
    </form>
  );
}

export default PostSection;