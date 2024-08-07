import React,{useState,useEffect} from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/data'
import { useSelector,shallowEqual } from 'react-redux';
import { useDispatch } from 'react-redux';
import BlockList from './BlockList';
import EditModal from './EditModal';
import { setUser } from './userSlice';
import { FaCamera,FaUserCog,FaUserCheck,FaUser,FaKey,FaMapMarkerAlt,FaGraduationCap,FaPhone,FaEnvelope,FaBuilding,FaImage } from 'react-icons/fa';
import Select from 'react-select';
const EditProfile = () => {
    const profile = (useSelector((state) => state.user,shallowEqual)).user;
    const [username,setUserName] = useState(profile.name||'');
    const [password,setPassword] = useState('');
    const [education,setEducation] =useState(profile.education||'');
    const [organization,setOrganization] = useState(profile.organization||'');
    const [location,setLocation] = useState(profile.location||'');
    const [email,setEmail] = useState(profile.email||'');
    const [phoneNumber,setPhoneNumber] = useState(profile.phone||'');
    const [isValidNumber,setIsValidNumber] = useState(false);
    const [errMessage, setErrMessage] = useState('');
    const [serverEcho, setServerEcho] = useState('');
    const [editModal, setEditModal] = useState(false);
    const passwordRegex=/(?=^.{8,}$)((?=.*\d)(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/;
    const [isPasswordError, setIsPasswordError] = useState(false);
    const emailRegex=/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const numberRegex = /^\d{10}$/;
    const [isEmailError, setIsEmailError]=useState(false);
    const canSave= username&&!isPasswordError&&!isEmailError&&!isValidNumber;
    const history=useNavigate();
    const dispatch=useDispatch();
    const profileId=profile._id;
    const [isModalOpen,setIsModalOpen]=useState(false);
    const [blockedUsers, setBlockedUsers] = useState([profile.blockedUsers]); 
    const [blockedUserProfiles, setBlockedUserProfiles] = useState([]);
      // State to hold the selected file name
    const [imageFile, setImageFile] = useState(null);
    const [fileName, setFileName] = useState('');
    const options = [
      { value: 'Individual', label: 'Individual' },
      { value: 'Organization', label: 'Organization' },
    ];
    const [selectedOption,setSelectOption] = useState(profile.profileType||null);


    const handleChange=(selectedOption) => {
      setSelectOption(selectedOption);
     
    }


useEffect(() => {
        if (profile && profile.blockedUsers) {
            setBlockedUsers(profile.blockedUsers);
        }
    }, []);

    useEffect(() => {
      // Fetch user profiles when the modal is opened
      if (isModalOpen) {
        fetchBlockedUserProfiles(blockedUsers);
      }
    }, [isModalOpen]);
  // Function to handle file input change
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setImageFile(file);
      setFileName(file.name); // Set the file name to state
    }

  };
    const onUsernameChange=(e)=>setUserName(e.target.value);
    const onPasswordChange=(e)=>{
        const value=e.target.value;
        setPassword(value);
        value.length>0? setIsPasswordError(!passwordRegex.test(value))
        :setIsPasswordError(false);
        }
    const onEducationChange=(e)=>setEducation(e.target.value);
    const onOrgChange=(e)=>setOrganization(e.target.value);
    const onLocationChange=(e)=>setLocation(e.target.value);
    const onEmailChange = (e)=>{
      e.preventDefault();
      const value=e.target.value;
      setEmail(value);
      value.length>0? setIsEmailError(!emailRegex.test(value)):setIsEmailError(false);
  }
    const onPhoneNumberChange=(e)=>{
      e.preventDefault();
      const value=e.target.value;
      setPhoneNumber(value);
      value.length>0? setIsValidNumber(!numberRegex.test(value)):setIsValidNumber(false);
    }
    const fetchBlockedUserProfiles = async (userIds) => {
      try {
        
        const profiles = await Promise.all(
          userIds.filter(user => user!==undefined).map(async (userId) => {
            try {//console.log("inside fetchBlockedUserProfiles",userId)
              const response = await api.get(`/api/profileById/${userId}`, { withCredentials: true });
              if (response.status !== 200) {
                throw new Error('Failed to fetch user profile');
              }
              const profileData = response.data;
              return {
                id: userId, // Make sure you set the id property correctly
                ...profileData, // You can include other profile data here
              };
            } catch (error) {
              console.error(`Error fetching profile for user ID ${userId}:`, error);
              return null;
            }
          })
        );
        setBlockedUserProfiles(profiles.filter((profile) => profile !== null));
      } catch (error) {
        console.error('Error fetching user profiles:', error);
      }
    };
    
    const handleUnblock = async (userId) => {
      // Implement unblocking logic here
      // Remove the user from the blockedUsers array and blockedUserProfiles state
    try{
       if(userId!==undefined&&profileId!==undefined){
       const response=await api.post(`/api/remove-blocked-users/${profileId}/${userId}`,{},{ withCredentials: true });
      // console.log(response.status);
       if(response.status===200){
       // console.log("unblocked user:",userId);
        const updatedBlockedUsers = blockedUsers.filter((id) => id !== userId);
      //  console.log(updatedBlockedUsers);
        setBlockedUsers(updatedBlockedUsers); 
        const updatedBlockedUserProfiles = blockedUserProfiles.filter(
          (profile) => profile._id!== userId  //this 'id' is the property of the blocked user profile data {name,id}; not to be confused with '_id'
        ); 
      //  console.log(updatedBlockedUserProfiles);

        setBlockedUserProfiles(updatedBlockedUserProfiles); 
       }
       }
    }catch(e){
        console.error(e);
        console.log(e.response.data.message)
    }
    };
    const handleSave=async ()=>{
      let data;
     switch(selectedOption.value){
      case "Individual":{data={
                            profileType:selectedOption,
                            name:username,
                            password:password,
                            education:education,
                            location:location,
                            email:email,
                            phone:phoneNumber
                            };break;}
      case "Organisation":{data={
                            profileType:selectedOption,
                            name:username,
                            password:password,
                            organization:organization,
                            location:location,
                            email:email,
                            phone:phoneNumber
                            };break;}
                  default: {data={
                            name:username,
                            password:password,
                            location:location,
                            email:email,
                            phone:phoneNumber
                            }}                    
     }
       
      const formData = new FormData();
    formData.append('data', JSON.stringify(data));
    if (imageFile) {
      formData.append('image', imageFile);
    }// console.log(selectedOption,data);
      try{
      if(profileId!==undefined){
        const response = await api.post(`/api/editProfile/${profileId}`,formData,{withCredentials:true});
        if(response.status===200){
          setEditModal(true);
          setServerEcho(response.data.message);
          setErrMessage('');
          if(response.data.profileWithoutPassword){
            dispatch(setUser(response.data.profileWithoutPassword))
          }else{
            dispatch(setUser(response.data.updataedProfile))
          }
        } 
      }

      }catch(error){
        console.error(error);
        if (error.response) {
              setEditModal(true);
              setErrMessage("Unable to edit profile");
              setServerEcho("Unable to edit profile");
      }
      }
    }
    const closeEditModal=()=>{
      setEditModal(false);
    }

  return (
    <div className="min-h-screen max-w-full lg:max-w-[65%] mx-auto  py-16">
     <div className="bg-white dark:bg-slate-600 shadow-lg rounded-lg overflow-hidden">
      <div className="flex flex-col flex-grow gap-6 justify-start p-4 " >

        <div className=" flex  p-1   w-full">
          <p className="text-blue-500 flex items-center gap-1 font-bold px-4 py-2 bg-blue-50 border-b-2 border-blue-500 rounded-md">
          <FaUserCog size='20'/>
          <span> Edit Profile</span>
          </p>
        </div>
       
        <div className="flex flex-col lg:flex-row items-center gap-6 flex-grow  justify-start p-1 " >
          <div className="text-gray-500 dark:text-gray-200 flex items-center gap-1 flex-grow w-full">
            <p ><FaUserCheck size='20'/></p>
            <p className="text-gray-500 dark:text-gray-300 font-bold"> Profile type:</p>
            <Select 
            value={selectedOption}
            onChange={handleChange}
            options={options} 
            className="text-blue-500"
            />
          </div>
          <div className="flex items-center justify-start gap-1 w-full lg:ml-16">
                <p className="text-gray-500 dark:text-gray-300"><FaImage size='20'/></p>
                <div className="text-gray-500 dark:text-gray-300 font-bold">Add a profile photo: </div>
                  <label 
                    title='Upload Profile Photo'
                    htmlFor="file-input" 
                    className="cursor-pointer flex items-center justify-center text-blue-400 hover:text-blue-500 rounded-md transition"
                  >
                  <FaCamera size='20'/>
                  </label>
                  <input 
                    type="file" 
                    id="file-input" 
                    accept="image/*" 
                    onChange={handleFileChange} 
                    className="hidden"
                      />
                    {fileName? (
                      <div className="text-sm text-gray-600">
                        Selected file: {fileName}
                      </div>
                    ):(
                      <div className="text-sm text-gray-600">
                        No file selected
                      </div>
                    )}
                  </div>
             <div>
           </div>
          </div>

     <div className="w-full  flex flex-col lg:flex-row ">
      {/*left side */}
      <div className="w-full lg:w-1/2 h-full flex flex-col p-1 gap-4">
    
      <div className="text-gray-500 dark:text-gray-300 w-full font-bold flex flex-grow gap-1 items-center">
      <div className="flex items-center w-1/3 gap-1">
      <FaUser size='20'/>
      <span>Username :</span>
      </div>
      <input type="text" 
      placeholder="Enter username"
      className="border-2 rounded w-2/3 h-10 px-2 font-semibold text-gray-500 outline-none"
      onChange={onUsernameChange}
       value={username}/>
      </div>
   
      <div className="text-gray-500 w-full dark:text-gray-300 font-bold flex flex-grow gap-1 items-center justify-between">
      <div className="flex items-center w-1/3 gap-1">
      <FaKey size='20'/>

      <span>Password :</span>
      </div>
      <input type="text" 
      className={`border-2 ${isPasswordError?`border-red-500`:``} rounded w-2/3 h-10 px-2 font-semibold text-gray-500 outline-none`}
      value={password}
      onChange={onPasswordChange}
      placeholder='Enter password'
      />
      </div>
      {isPasswordError && (
        <p className="text-red-400 text-sm">
          Password should be at least 8 characters long and include at least one special character,one lowercase letter,one uppercase letter and one digit.
        </p>
      )}

    {selectedOption?.value==='Individual'&& <div className="text-gray-500 dark:text-gray-300 font-bold flex flex-grow gap-1 items-center">
      <div className="flex items-center w-1/3 gap-1">
      <FaGraduationCap size='20'/>
        <span>Education :</span>
      </div>
      <input 
      type="text" 
      className="border-2 rounded w-2/3 h-10 px-2 font-semibold text-gray-500 outline-none" 
      onChange={onEducationChange}
      value={education}
      placeholder="Enter educational details"/>
      </div>}
      {selectedOption?.value==='Organization'&& <div className="text-gray-500 dark:text-gray-300 font-bold flex flex-grow gap-1 items-center">
      <div className="flex items-center w-full lg:w-1/3 gap-1">
      <FaBuilding size='20'/>
        <span>Orgainization :</span>
      </div>
      <input 
      type="text" 
      className="border-2 rounded w-full lg:w-2/3 h-10 px-2 font-semibold text-gray-500 outline-none" 
      onChange={onOrgChange}
      value={organization}
      placeholder="Enter organization name"/>
      </div>}


      <div className="text-gray-500 dark:text-gray-300 font-bold flex flex-grow gap-1 items-center">
       <div className="flex items-center w-1/3 gap-1">
       <FaMapMarkerAlt size='20'/>

      <span>Location :</span>
       </div>
      <input type="text" 
      className="border-2 rounded w-2/3 h-10 px-2 font-semibold text-gray-500 outline-none" 
      onChange={onLocationChange}
      value={location}
      placeholder="Enter your location"
      />
      </div>
      </div>
   {/*right side */}
      <div className=" w-full lg:w-1/2 h-full flex flex-col  justify-start py-1 px-1 lg:px-8 gap-2 top-0">
       
       
          <div className="text-gray-500 dark:text-gray-300 font-bold flex flex-grow gap-1 items-center">
              <div className="flex items-center w-1/3 gap-1">
              <FaPhone size='20'/>
                <span>Phone :</span>
              </div>
              <input 
              type="text" 
              className="border-2 rounded w-2/3 h-10 px-2 font-semibold text-gray-500 outline-none" 
              onChange={onPhoneNumberChange}
              value={phoneNumber}
              placeholder="Enter phone number"/>
              </div>
              {isValidNumber &&<p className="text-pink-500">Please enter a 10 digit phone number</p>}
              <div className="text-gray-500 dark:text-gray-300 font-bold flex flex-grow gap-1 items-center">
              <div className="flex items-center w-1/3 gap-1">
              <FaEnvelope size='20'/>
                <span>Email :</span>
              </div>
              <input 
              type="text" 
              className="border-2 rounded w-2/3 h-10 px-2 font-semibold text-gray-500 outline-none" 
              onChange={onEmailChange}
              value={email}
              placeholder="Enter email address"/>
              </div>
              {isEmailError &&<p className="text-pink-500">Please enter a valid email</p>}
            </div>
          
      
     </div>
  
      {errMessage&&<p className="text-pink-500 text-sm dark:text-gray-300">{errMessage}</p>}

    <div className="flex flex-col md:flex-row justify-between gap-2">
    <button 
    className="bg-red-50 hover:bg-red-100 text-red-500 w-32 h-10 rounded-lg mx-[30%] md:mx-5"
    onClick={() => setIsModalOpen(true)}
    >Veiw Blocklist</button>
    <BlockList
    isOpen={isModalOpen}
    onClose={() => setIsModalOpen(false)}
    blockedUsers={blockedUserProfiles}
    onUnblock={handleUnblock}
    />
    <div className="flex flex-col md:flex-row justify-between gap-2">
    <button 
    className="rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-500 font-semibold text-base w-32  h-10 mx-[30%] md:mx-5"
    onClick={handleSave}
    disabled={!canSave}
    >Save</button>
    <button 
    className="rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-500 font-semibold text-base w-32  h-10 mx-[30%] md:mx-5"
    onClick={()=>history(-1)}
    >Close</button>
     <EditModal
      isOpen={editModal}
      message={serverEcho}
      closeModal={closeEditModal}
      />
    </div>
    </div>
    
     </div>
     </div>
     </div>
  )
}

export default EditProfile;
