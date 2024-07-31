import { Link } from "react-router-dom";

const Tooltip = ({profile,profileToolTip,setProfileTooltip,logOut}) => {
  return (
    <div>
      {profileToolTip&& <div  className="absolute w-48 h-56 lg:right-[22%] right-[310px] top-16 bg-white  dark:bg-slate-700 rounded-lg ">
      <div
    className="absolute w-5 h-5 bg-inherit transform rotate-45 -top-1 left-1/2"
    style={{ marginLeft: '-1px' }} // Corrected to use an object for inline styles
  ></div>
       <div className=" flex flex-col justify-between items-center gap-4 my-6">
        <Link to={`/profile/${profile.linkname}`}  onClick={()=>setProfileTooltip(!profileToolTip)}
          className=" w-32 h-8 text-center rounded-lg py-[2px] hover:bg-blue-100  hover:text-blue-700 flex gap-2 mx-auto justify-center dark:text-white dark:hover:text-gray-900">
          <div className="h-5 w-5 my-auto">
          <svg aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" stroke-linecap="round" stroke-linejoin="round"></path>
          <path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" stroke-linecap="round" stroke-linejoin="round"></path>
          </svg>
          </div>
          <p> View Profile</p>
        </Link>

        <Link to={`/profile/${profile.linkname}/addPostMenu`}  className=" w-32 h-8 text-center rounded-lg py-[2px] hover:bg-blue-100  hover:text-blue-700 flex gap-2 mx-auto justify-center dark:text-white dark:hover:text-gray-900">  
              <div className="w-5 h-5 my-auto">  
                <svg data-slot="icon" aria-hidden="true" fill="none" strokeWidth="1.5" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 4.5v15m7.5-7.5h-15" strokeLinecap="round" strokeLinejoin="round"></path>
                </svg>
              </div>
          <p>Add a Post</p>
          </Link>

        <Link to={`/profile/${profile.linkname}/edit`}  onClick={()=>setProfileTooltip(!profileToolTip)}
          className=" w-32 h-8 text-center rounded-lg py-[2px] hover:bg-blue-100  hover:text-blue-700 flex gap-2 mx-auto justify-center dark:text-white dark:hover:text-gray-900">
          <div className="h-5 w-5 my-auto">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
          </svg>
          </div>
          <p>Edit Profile</p>
        </Link>
       
      
        <button onClick={logOut}
        className=" w-28 h-8 text-center rounded-lg py-[2px] hover:bg-blue-100  hover:text-blue-700 flex gap-2 mx-auto justify-center  dark:text-white dark:hover:text-gray-900">    
        <div className="h-5 w-5 my-auto">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
         </svg>
        </div>
        <p>Logout</p></button>
    </div>
    </div>}
    </div>
  )
}

export default Tooltip;
