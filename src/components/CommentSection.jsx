import IconPlus from "../assets/images/icon-plus.svg"
import IconMinus from "../assets/images/icon-minus.svg"
import { useEffect, useState } from "react";
import LoadingGIF from "../assets/loading-gif.gif"
import Reply from "../assets/images/icon-reply.svg"

function CommentSection() {

  const [ Api, setApi ] = useState([]) // FETCH PARA DADOS
  
  useEffect(() => {
    fetch(`/data.json`)
        .then((response) => response.json())
        .then((data) => {
            console.log(data)
            setApi(data.comments)
        })
        .catch((err) => {
            console.log(err)
        })
  }, [])

  if ( !Api ) {
    return (
      <div>
        <img src={LoadingGIF} alt="#" />
      </div>
    )
  }

  return (
  <>
    <div className="flex flex-col p-[50px] pb-[25%]">
      {Api.map((comment) => {
        return (
          <div className="mt-4 rounded-sm" key={comment.id}> {/* FUNCTION COMENTÁRIO */}
            <div className="bg-white flex"> {/* POST */}
              <div className="flex flex-col bg-[#eaecf1] m-5 min-w-[30px] max-h-[88px] py-[9px] items-center rounded-md">
                <img src={IconPlus} alt="plus icon" className="m-auto"/>
                <h3 className="py-2">{comment.score}</h3>
                <img src={IconMinus} alt="minus icon" className="m-auto"/>
              </div>

              <div className="p-4">
                <div className="flex justify-between items-center"> {/* AVATAR / DIAS POSTADOS / REPLY */}
                  <div className="flex text-center items-center">
                    <img src={`../src/assets/images/avatars/image-${comment.user.username}.png`} className="w-6" alt="avatar" />
                    <p className="ml-2 font-medium text-[0.9rem] text-[#0e1541]">{comment.user.username}</p>
                    <p className="ml-2 font-medium text-[0.9rem] text-[#0e1541]">{comment.createdAt}</p>
                  </div>

                  <div className="flex cursor-pointer">
                    <img src={Reply} className="h-[10px] my-auto mr-1" alt="reply icon" />
                    <h4 className="text-[0.8rem] text-[#482c96]">Reply</h4>
                  </div>
                </div>

                <div>
                  <p className="text-[0.85rem] text-gray-700 mt-3">{comment.content}</p>
                </div>
              </div>
            </div>

            {/* COMMENT BELOW */}
            <div className="grid grid-cols-1">
              {comment.replies && comment.replies.length > 0 && (
                comment.replies.map((reply) => {
                  return (
                    <div key={reply.id} className="bg-white mt-4 rounded-sm flex max-w-[500px] ml-[100px]">
                      <div className="flex flex-col bg-[#eaecf1] m-5 min-w-[30px] max-h-[88px] py-[9px] items-center rounded-md">
                        <img src={IconPlus} alt="plus icon" className="m-auto"/>
                        <h3 className="py-2">{reply.id}</h3>
                        <img src={IconMinus} alt="minus icon" className="m-auto"/>
                      </div>

                      <div className="p-4">
                        <div className="flex justify-between items-center"> {/* AVATAR / DIAS POSTADOS / REPLY */}
                          <div className="flex text-center items-center">
                            <img src={`../src/assets/images/avatars/image-${reply.user.username}.png`} className="w-6" alt="avatar" />
                            <p className="ml-2 font-medium text-[0.9rem] text-[#0e1541]">{reply.user.username}</p>
                            <p className="ml-2 font-medium text-[0.9rem] text-[#0e1541]">{reply.createdAt}</p>
                          </div>

                          <div className="flex">
                            <img src={Reply} className="h-[10px] my-auto mr-1" alt="reply icon" />
                            <h4 className="text-[0.8rem] text-[#482c96]">Reply</h4>
                          </div>
                        </div>

                        <div>
                          <p className="text-[0.85rem] text-gray-700 mt-3">{reply.content}</p>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        );
      })}
    </div>
  </>
);
}

export default CommentSection;