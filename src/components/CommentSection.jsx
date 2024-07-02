/* eslint-disable react/prop-types */
import IconPlus from "../assets/images/icon-plus.svg"
import IconMinus from "../assets/images/icon-minus.svg"
import LoadingGIF from "../assets/loading-gif.gif"
import Reply from "../assets/images/icon-reply.svg"
import DeleteIcon from "../assets/images/icon-delete.svg"
import { useEffect, useState } from "react"
import { fetchComments } from "../requests/request"
import { deletarComentario } from "../requests/request"

function CommentSection() {

  const [comments, setComments] = useState([]);

  const getComments = async () => {
    try {
      const data = await fetchComments();
      setComments(data);
    } catch (error) {
      console.error('Failed to fetch comments:', error);
    }
  };


  useEffect(() => {
    getComments();
  }, [])

  const deleteComment = async ( id, type = "comment", idReply = "default" ) => {
    console.log(id)
    try {
      await deletarComentario(id, type, idReply)
      await getComments()
    } catch ( error ) {
      console.log("Erro ao tentar deletar comentário: ", error)
    }
  }

  if ( !comments ) {
    return (
      <div>
        <img src={LoadingGIF} alt="#" />
      </div>
    )
  }

  return (
  <>
    <div className="flex flex-col p-[50px] pb-[25%]">
      {comments.map((comment) => {
        return (
          <div className="mt-4 rounded-sm" key={comment.id}> {/* FUNCTION COMENTÁRIO */}
            <div className="bg-white flex"> {/* POST */}
              <div className="flex flex-col bg-[#eaecf1] m-5 min-w-[30px] max-h-[88px] py-[9px] items-center rounded-md">
                <img src={IconPlus} alt="plus icon" className="m-auto"/>
                <h3 className="py-2 text-[#4d319c] font-medium">{comment.score}</h3>
                <img src={IconMinus} alt="minus icon" className="m-auto"/>
              </div>

              <div className="p-4 w-full">
                <div className="flex justify-between items-center"> {/* AVATAR / DIAS POSTADOS / REPLY */}
                  <div className="flex text-center items-center">
                    <img src={`../src/assets/images/avatars/image-${comment.user.username}.png`} className="w-6" alt="avatar" />
                    <p className="ml-2 font-medium text-[0.9rem] text-[#0e1541]">{comment.user.username}</p>
                    
                    { comment.user.username == "juliusomo" ? (
                      <p className="px-1 py-[2px] text-center mx-1 bg-[#6a41da] text-white text-[0.6rem]">you</p>
                    ) : (
                      <></>
                    ) }

                    <p className="ml-2 font-medium text-[0.9rem] text-[#0e1541]">{comment.createdAt}</p>
                  </div>

                  <div className="flex items-center">
                    { comment.user.username == "juliusomo" ? (
                      <div className="flex cursor-pointer" onClick={() => deleteComment(comment.id)}>
                        <img src={DeleteIcon} className="w-2 h-3 my-[3px] mx-1" alt="delete-icon" />
                        <p className="text-[#ce1c1c] mr-2 text-[0.8rem]">Delete</p>
                      </div>
                    ) : (
                      <></>
                    ) }
                    <div className="flex cursor-pointer">
                      <img src={Reply} className="h-[10px] my-auto mr-1" alt="reply icon" />
                      <h4 className="text-[0.8rem] text-[#482c96]">Reply</h4>
                    </div>
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
                        <h3 className="py-2 text-[#4d319c] font-medium">{reply.score}</h3>
                        <img src={IconMinus} alt="minus icon" className="m-auto"/>
                      </div>

                      <div className="p-4">
                        <div className="flex justify-between items-center"> {/* AVATAR / DIAS POSTADOS / REPLY */}
                          <div className="flex text-center items-center">
                            <img src={`../src/assets/images/avatars/image-${reply.user.username}.png`} className="w-6" alt="avatar" />
                            <p className="ml-2 font-medium text-[0.9rem] text-[#0e1541]">{reply.user.username}</p>
                            { reply.user.username == "juliusomo" ? (
                              <p className="px-1 py-[2px] text-center mx-1 bg-[#6a41da] text-white text-[0.6rem]">you</p>
                            ) : (
                              <></>
                            ) }
                            <p className="ml-2 font-medium text-[0.9rem] text-[#0e1541]">{reply.createdAt}</p>
                          </div>

                          <div className="flex items-center">
                            { reply.user.username == "juliusomo" ? (
                              <div className="flex cursor-pointer" onClick={() => deleteComment(comment.id, "reply", reply.id)}>
                                <img src={DeleteIcon} className="w-2 h-3 my-[3px] mx-1" alt="delete-icon" />
                                <p className="text-[#ce1c1c] mr-2 text-[0.8rem]">Delete</p>
                              </div>
                            ) : (
                              <></>
                            ) }
                            <div className="flex cursor-pointer">
                              <img src={Reply} className="h-[10px] my-auto mr-1" alt="reply icon" />
                              <h4 className="text-[0.8rem] text-[#482c96]">Reply</h4>
                            </div>
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