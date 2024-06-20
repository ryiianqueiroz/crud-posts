import { useEffect, useState } from "react";
import Avatar from "../assets/images/avatars/image-juliusomo.png"
import LoadingGIF from "../assets/loading-gif.gif"

function PostSection() {

  const [ Loading, setLoading ] = useState(false)

  useEffect(() => {
    setLoading(true)
  }, [])

  return (
    <>
      { Loading ? (
        <div>
          <img src={Avatar} alt="#" />
          <div className="mb-3">
            <label htmlFor="" className="form-label"></label>
            <textarea className="form-control" name="" id=""></textarea>
          </div>
          <button>SEND</button>
        </div>
      ) : (
        <div>
          <img src={LoadingGIF} alt="#" />
        </div>
      ) }
    </>
  );
}

export default PostSection;