import Avatar from "../assets/images/avatars/image-juliusomo.png"

function PostSection() {
  return (
    <div className="flex fixed bottom-0 px-[50px] pt-[100px] min-w-[700px] min-h-[250px] rounded-lg">
      <div className="bg-white w-full grid grid-cols-[auto,1fr,auto] gap-4">
        <div className="m-5">
          <img src={Avatar} alt="#" className="w-10"/>
        </div>
        <div className="flex justify-center max-h-[130px]">
          <textarea className="w-full mt-5 border-[2px]"></textarea>
        </div>
        <div className="m-5">
          <button className="p-3 px-5 bg-[#6c36eb] text-white rounded-lg text-[0.9rem]">SEND</button>
        </div>
      </div>
    </div>
  );
}

export default PostSection;