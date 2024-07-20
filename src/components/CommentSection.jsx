/* eslint-disable react/prop-types */
//import IconPlus from "../assets/images/icon-plus.svg"
//import IconMinus from "../assets/images/icon-minus.svg"
import LoadingGIF from "../assets/loading-gif.gif"
import Edit from "../assets/images/icon-edit.svg"
import Reply from "../assets/images/icon-reply.svg"
import DeleteIcon from "../assets/images/icon-delete.svg"
import Avatar from "../assets/images/avatars/image-juliusomo.png"
import { useEffect, useState } from "react"
import { postReply, deletarComentario, score, fetchComments, updateContent } from "../requests/request"

function CommentSection() {

  const [ comments, setComments ] = useState([]); // FETCH DO JSON
  const [ replyInterface, setReplyInterface ] = useState(-1) // MOSTRAR A DIV QUE TEM O CAMPO PRO USUÁRIO RESPONDER
  const [ updateInterface, setUpdateInterface ] = useState(-1)
  const [ isComment, setIsComment ] = useState(-1)
  const [ isReply, setIsReply ] = useState(-1)
  const [ textAreaValue, setTextArea ] = useState("") 

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
  })

  const deleteComment = async ( id, type = "comment", idReply = "default" ) => {
    console.log(id)
    try {
      await deletarComentario(id, type, idReply)
      await getComments()
    } catch ( error ) {
      console.log("Erro ao tentar deletar comentário: ", error)
    }
  }

  const replyShow = ( idComment = -1, idReply = -1, replyUser ) => {
    if ( idComment != -1 ) {
      setIsComment(1)

      if ( replyInterface !== idComment ) {
        setReplyInterface(idComment)
        setTextArea(`@${replyUser} `)
      } else {
        setReplyInterface(-1)
        setIsComment(-1)
      }
    } else {
      setIsReply(1)

      if ( replyInterface !== idReply ) {
        setReplyInterface(idReply)
        setTextArea(`@${replyUser} `)
      } else {
        setReplyInterface(-1)
        setIsReply(-1)
      }
    }
  }

  const editShow = ( idComment = -1, idReply = -1, comment ) => {
    if ( idComment != -1 ) {
      setIsComment(1)

      if ( updateInterface !== idComment ) {
        setUpdateInterface(idComment)
        setTextArea(comment)
      } else {
        setUpdateInterface(-1)
        setTextArea("")
        setIsComment(-1)
      }
    } else {
      setIsReply(1)

      if ( updateInterface !== idReply ) {
        setUpdateInterface(idReply)
        setTextArea(comment)
      } else {
        setUpdateInterface(-1)
        setTextArea("")
        setIsReply(-1)
      }
    }
  }

  const replyingTo = async ( idComment, replyUser ) => {
    const newComment = {
      content: textAreaValue,
      createdAt: "a few moments ago",
      score: 0,
      user: {
        image: { 
          png: "./assets/images/avatars/image-juliusomo.png",
          webp: "./images/avatars/image-juliusomo.webp"
        },
        username: "juliusomo"
      },
      replyingTo: replyUser,
    }

    postReply( idComment, newComment )
    setTextArea("")
  }

  const handleChangeReplying = (e) => {
    setTextArea(e.target.value);
  };

  const scoreUpdate = ( idComment, scoreComment, method, idReply = -1 ) => {
    const checkboxPlus = document.getElementById(`commentPlus-${idComment}`)
    const checkboxMinus = document.getElementById(`commentMinus-${idComment}`)
    const replyCheckboxPlus = document.getElementById(`replyPlus-${idReply}`)
    const replyCheckboxMinus = document.getElementById(`replyMinus-${idReply}`)    
    let gain = parseInt(scoreComment)

    if ( idReply === -1 ) {
      console.log("IDREPLY É IGUAL -1")
      if ( method === "add" ) {
        if ( checkboxMinus.checked ) {
          checkboxMinus.checked = false
          
          gain = gain + 2
          return score( idComment, gain, -1 )
        } else {
          if ( checkboxPlus.checked ) {
            gain = gain + 1
            return score( idComment, gain, -1 )
          } else {
            gain = gain - 1
            return score( idComment, gain, -1 )
          }
        }
      } else { 
        if ( checkboxPlus.checked ) {
          checkboxPlus.checked = false
    
          gain = gain - 2
          return score( idComment, gain, -1 )
        } else {
          if ( checkboxMinus.checked ) {
            gain = gain - 1          
            return score( idComment, gain, -1 )
          } else {
            gain = gain + 1
            return score( idComment, gain, -1 )
          }
        }
      }
    } else { // IF IDREPLY != -1  !!!!!!
      console.log("IDREPLY É DIFERENTE -1")
      if ( method === "add" ) {
        if ( replyCheckboxMinus.checked ) {
          replyCheckboxMinus.checked = false
          
          gain = gain + 2
          return score( idComment, gain, idReply )
        } else {
          if ( replyCheckboxPlus.checked ) {
            gain = gain + 1
            return score( idComment, gain, idReply )
          } else {
            gain = gain - 1
            return score( idComment, gain, idReply )
          }
        }
      } else {
        if ( replyCheckboxPlus.checked ) {
          replyCheckboxPlus.checked = false
    
          gain = gain - 2
          return score( idComment, gain, idReply )
        } else {
          if ( replyCheckboxMinus.checked ) {
            gain = gain - 1          
            return score( idComment, gain, idReply )
          } else {
            gain = gain + 1
            return score( idComment, gain, idReply )
          }
        }
      }
    }
  }

  const editContent = ( commentID = -1, replyID = -1, content ) => {    
    return updateContent( commentID, replyID, content)
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
          <div className="mt-4 rounded-sm" key={comment.id} id={comment.id}> {/* FUNCTION COMENTÁRIO */}
            <div className="bg-white flex min-h-[120px]"> {/* POST */}
              <div className="flex flex-col w-[15%]">
                <div className="bg-[#eaecf1] m-auto min-w-[30px] max-h-[95px] items-center rounded-md text-center">
                  <input type="checkbox" id={`commentPlus-${comment.id}`} className="m-auto" onClick={() => scoreUpdate(comment.id, comment.score, "add", -1)} />
                  <label htmlFor={`commentPlus-${comment.id}`}></label>
                  <h3 className="py-2 text-[#4d319c] font-medium">{comment.score}</h3>
                  <input type="checkbox" id={`commentMinus-${comment.id}`} className="m-auto" onClick={() => scoreUpdate(comment.id, comment.score, "subtract", -1)}/>
                  <label className="minus" htmlFor={`commentMinus-${comment.id}`}></label>
                </div>
              </div>

              <div className="p-4 w-[85%]">
                <div className="flex justify-between items-center"> {/* AVATAR / DIAS POSTADOS / REPLY */}
                  <div className="flex text-center items-center">
                    <img src={`../src/assets/images/avatars/image-${comment.user.username}.png`} className="w-6" alt="avatar" />
                    <p className="ml-2 font-medium text-[0.9rem] text-[#0e1541]">{comment.user.username}</p>
                    
                    { comment.user.username == "juliusomo" ? (
                      <p className="px-1 py-[2px] text-center mx-1 bg-[#6a41da] text-white text-[0.6rem]">you</p>
                    ) : (
                      <></>
                    ) }

                    <p className="ml-2 font-normal text-[0.8rem] text-[gray]">{comment.createdAt}</p>
                  </div>

                  <div className="flex items-center">
                    { comment.user.username == "juliusomo" ? (
                      <div className="flex cursor-pointer hover:opacity-30" onClick={() => deleteComment(comment.id)}>
                        <img src={DeleteIcon} className="w-2 h-3 my-[3px] mx-1" alt="delete-icon" />
                        <p className="text-[#ce1c1c] mr-2 text-[0.8rem]">Delete</p>
                      </div>
                    ) : (
                      <></>
                    ) }
                    { comment.user.username == "juliusomo" ? (
                      <div className="flex cursor-pointer hover:opacity-30" onClick={() => editShow(comment.id, -1, comment.content)}>
                        <img src={Edit} className="h-[10px] my-auto mr-1" alt="reply icon" />
                        <h4 className="text-[0.8rem] text-[#482c96]">Edit</h4>
                      </div>
                    ) : (
                      <div className="flex cursor-pointer hover:opacity-30" onClick={() => replyShow(comment.id, -1, comment.user.username)}>
                        <img src={Reply} className="h-[10px] my-auto mr-1" alt="reply icon" />
                        <h4 className="text-[0.8rem] text-[#482c96]">Reply</h4>
                      </div>
                    ) }
                  </div>
                </div>

                <div>
                  <p className="text-[0.85rem] text-gray-700 mt-3">{comment.content}</p>
                </div>
              </div>
            </div>

            { ( ( replyInterface === comment.id && isComment === 1 ) || ( updateInterface === comment.id && isComment === 1 ) ) && (              
              <form className="flex bg-white mt-4 pb-6 w-full rounded-lg">
                <div className="bg-white w-full grid grid-cols-[auto,1fr,auto] gap-4">
                  <div className="m-5">
                    <img src={Avatar} alt="#" className="w-10"/>
                  </div>
                  <div className="flex justify-center max-h-[130px] mt-5">
                    <textarea
                      className="peer max-h-[100px] w-full resize-none border-[2px] rounded-[7px] bg-transparent px-3 py-2.5 font-sans text-sm font-normal text-blue-gray-700 outline outline-0 transition-all placeholder-shown:border placeholder-shown:border-blue-gray-200 placeholder-shown:border-t-blue-gray-200 focus:border-2 focus:border-gray-900 focus:border-t-transparent focus:outline-0 disabled:resize-none disabled:border-0 disabled:bg-blue-gray-50"
                      placeholder="Add a comment..."
                      id="text-area"
                      value={textAreaValue}
                      onChange={handleChangeReplying}> 
                    </textarea>
                  </div>
                  <div className="m-5 cursor-pointer" onClick={() => setReplyInterface(-1)}>
                  { replyInterface != -1 ? (
                    <button type="submit" onClick={() => replyingTo(comment.id, comment.user.username)} className="p-3 px-5 bg-[#5457b6] text-white rounded-lg text-[0.9rem]">SEND</button>
                  ) : (
                    <button type="submit" onClick={() => editContent(comment.id, -1, textAreaValue)} className="p-3 px-5 bg-[#5457b6] text-white rounded-lg text-[0.9rem]">SEND</button>
                  )}
                  </div>
                </div>
              </form>
            )}

            {/* COMMENT BELOW */}
            <div className="grid grid-cols-1">
              {comment.replies && comment.replies.length > 0 && (
                comment.replies.map((reply) => {
                  return (
                    <div key={reply.id} id={reply.id}>
                      <div className="bg-white mt-4 rounded-sm flex max-w-[500px] ml-[100px]">
                        <div className="flex flex-col bg-[#eaecf1] m-5 min-w-[30px] max-h-[88px] items-center rounded-md">
                          <input type="checkbox" id={`replyPlus-${reply.id}`} onClick={() => scoreUpdate(comment.id, reply.score, "add", reply.id)} />
                          <label htmlFor={`replyPlus-${reply.id}`}></label>
                          <h3 className="py-2 text-[#4d319c] font-medium">{reply.score}</h3>
                          <input type="checkbox" id={`replyMinus-${reply.id}`} onClick={() => scoreUpdate(comment.id, reply.score, "subtract", reply.id)}/>
                          <label htmlFor={`replyMinus-${reply.id}`} className="minus"></label>
                        </div>

                        <div className="p-4 w-[85%]">
                          <div className="flex justify-between items-center"> {/* AVATAR / DIAS POSTADOS / REPLY */}
                            <div className="flex text-center items-center">
                              <img src={`../src/assets/images/avatars/image-${reply.user.username}.png`} className="w-6" alt="avatar" />
                              <p className="ml-2 font-medium text-[0.9rem] text-[#0e1541]">{reply.user.username}</p>
                              { reply.user.username == "juliusomo" ? (
                                <p className="px-1 py-[2px] text-center mx-1 bg-[#5457b6] text-white text-[0.6rem]">you</p>
                              ) : (
                                <></>
                              ) }
                              <p className="ml-2 font-normal text-[0.8rem] text-[gray]">{reply.createdAt}</p>
                            </div>

                            <div className="flex items-center">
                              { reply.user.username == "juliusomo" ? (
                                <div className="flex cursor-pointer hover:opacity-30" onClick={() => deleteComment(comment.id, "reply", reply.id)}>
                                  <img src={DeleteIcon} className="w-2 h-3 my-[3px] mx-1" alt="delete-icon" />
                                  <p className="text-[#ce1c1c] mr-2 text-[0.8rem]">Delete</p>
                                </div>
                              ) : (
                                <></>
                              ) }

                              { reply.user.username == "juliusomo" ? (
                                <div className="flex cursor-pointer hover:opacity-30" onClick={() => editShow(-1, reply.id, reply.content)}>
                                  <img src={Edit} className="h-[10px] my-auto mr-1" alt="reply icon" />
                                  <h4 className="text-[0.8rem] text-[#482c96]">Edit</h4>
                                </div>
                              ) : (
                                <div className="flex cursor-pointer hover:opacity-30" onClick={() => replyShow(-1, reply.id, reply.user.username)}>
                                  <img src={Reply} className="h-[10px] my-auto mr-1" alt="reply icon" />
                                  <h4 className="text-[0.8rem] text-[#482c96]">Reply</h4>
                                </div>
                              ) }
                            </div>
                          </div>

                          <div className="flex">
                            { reply.content.includes(`@${reply.replyingTo}`) ? (
                              <p className="mt-3 text-[0.85rem] mr-1 font-bold text-[#5457b6]">{`@${reply.replyingTo}`}</p>
                            ) : ( 
                              <></>
                            )}
                            <p className="text-[0.85rem] text-gray-700 mt-3">{reply.content.replace(/@\S+\s?/, "")}</p>
                          </div>
                        </div>
                      </div>

                      { ( ( replyInterface === reply.id && isReply === 1 ) || ( updateInterface === reply.id && isReply === 1 ) ) && (
                        <form className="flex bg-white mt-4 pb-6 max-w-[500px] ml-[100px] rounded-lg">
                          <div className="bg-white w-full grid grid-cols-[auto,1fr,auto] gap-4">
                            <div className="m-5">
                              <img src={Avatar} alt="#" className="w-10"/>
                            </div>
                            <div className="flex justify-center max-h-[130px] mt-5">
                              <textarea
                                className="peer max-h-[100px] w-full resize-none border-[2px] rounded-[7px] bg-transparent px-3 py-2.5 font-sans text-sm font-normal text-blue-gray-700 outline outline-0 transition-all placeholder-shown:border placeholder-shown:border-blue-gray-200 placeholder-shown:border-t-blue-gray-200 focus:border-2 focus:border-gray-900 focus:border-t-transparent focus:outline-0 disabled:resize-none disabled:border-0 disabled:bg-blue-gray-50"
                                placeholder="Add a comment..."
                                id="text-area"
                                value={textAreaValue}
                                onChange={handleChangeReplying}> 
                              </textarea>
                            </div>
                            <div className="m-5 cursor-pointer" onClick={() => (setReplyInterface(-1), setUpdateInterface(-1))}>
                              { replyInterface != -1 ? (
                                <button type="submit" onClick={() => replyingTo(comment.id, reply.user.username)} className="p-3 px-5 bg-[#5457b6] text-white rounded-lg text-[0.9rem]">SEND</button>
                              ) : (
                                <button type="submit" onClick={() => editContent(comment.id, reply.id, textAreaValue)} className="p-3 px-5 bg-[#5457b6] text-white rounded-lg text-[0.9rem]">SEND</button>
                              )}
                            </div>
                          </div>
                        </form>
                      )}
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