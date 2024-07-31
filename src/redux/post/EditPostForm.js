import React, { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch, shallowEqual } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import ReactQuill from 'react-quill';
import DOMPurify from 'dompurify';
import api from '../../api/data';
import PostModal from './PostModal';
import { FaCamera} from 'react-icons/fa';

const convertDate = (inputDate) => {
  if(!inputDate===undefined) return '';
  const [day, month, year] = inputDate.split('-'); // Assuming the date is in DD-MM-YYYY format
  return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`; // Convert to YYYY-MM-DD format
  };
const EditPostForm = () => {
    const history = useNavigate();
  const dispatch = useDispatch();
  const { postId } = useParams();
  const profile = useSelector((state) => state.user, shallowEqual).user;
  const linkname=profile.linkname;
  const postSelected = useSelector((state) => state.post.postSelected);//console.log(postSelected)
  // Initialize form state with postSelected data
  const [title, setTitle] = useState(postSelected.title || '');
  const [isValidTitle,setIsValidTitle] = useState(true);
  const [organization, setOrganization] = useState(postSelected.organization || '');
  const [isValidOrg,setIsValidOrg] = useState(true);
  const [qualification, setQualification] = useState(postSelected.qualification || '');
  const [isValidQual,setIsValidQual] = useState(true);
  const [vacancy, setVacancy] = useState(postSelected.vacancy||''); // Assuming vacancy is stored in a specific format
  const [isValidVacancy,setIsValidVacancy]=useState(true);
  const [content, setContent] = useState(postSelected?.details?.replace(/^"|"$/g, '') || '');
  const [selectOption, setSelectOption] = useState(postSelected.category || ''); 
  const [date, setDate] = useState('');
  const [imageFile, setImageFile] = useState(null);  
  const [fileName, setFileName] = useState('');             
  const quillRef = useRef();
  const [modal,setModal]=useState(false);
  const [serverEcho,setServerEcho]=useState('');
  const canSubmit=Boolean(isValidTitle&&isValidOrg&&isValidVacancy&&isValidQual)
  &&Boolean(title.length > 0 && organization.length > 0&&selectOption.length > 0)
 console.log(profile.linkname,postSelected.postedByName);
  // Convert the date from postSelected to the correct format for the input field
  useEffect(() => {
    if (quillRef.current) {
      let editor = quillRef.current.getEditor();
      editor.format('size', 'normal');
      editor.format('align', 'left');
    }
  }, []);
  
  useEffect(() => {
    if (postSelected && postSelected.date) {
      setDate(convertDate(postSelected.date));
    }
  }, [postSelected]);//we do this in useEffect or there will be invalid date error
  const modules = {
    toolbar: {
      container: [
        [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
        ['bold', 'italic', 'underline', 'strike'],  
        [{ 'color': [] }, { 'background': [] }], // text and background colors
        [{ 'font': [] }], // font family
        [{ 'align': [] }], // text alignment
        ['blockquote', 'code-block'],
        [{ 'list': 'ordered'}, { 'list': 'bullet' }], // ordered and unordered lists
        [{ 'indent': '-1'}, { 'indent': '+1' }], // indentation
        ['link', 'image', 'video'],
        ['clean'] // remove formatting
      ],
      handlers: {
        // Define custom handlers if needed
      }
    }
  };
  const formats = [
    'header',
    'bold', 'italic', 'underline', 'strike', 
    'color', 'background',
    'font',
    'align',
    'blockquote', 'code-block',
    'list', 'indent',
    'link', 'image', 'video'
  ];
  const handleChange = (value) => {
    setContent(value);
  };
  const options=[
    'Government job',
    'Private job',
    'Entrance Examination',
    'Result',
    'Admit Card',
    'Notification'
  ]

  // Regex for the text pattern and a separate one for numeric values

  const numericRegex = /^\d+$/;

  
  // Handle onChange functions:
  const handleSelectChange = (event) => {
    setSelectOption(event.target.value);
  };
  const handleTitleChange = (event) => {
    const value=event.target.value
    setTitle(value);
    if(value?.length<10){
       setIsValidTitle(false);
    }else{
      setIsValidTitle(true);
    }
  };
  const handleOrganization = (event) => {
    const value=event.target.value
    setOrganization(value);
    if(value?.length<10){
       setIsValidOrg(false);
    }else{
      setIsValidOrg(true);
    }
  };
  const handleDateChange = (event) => {
    setDate(event.target.value);
  };
  
  const handleQualification = (event) => {
    const value=event.target.value
    setQualification(event.target.value);
    if(value?.length>=8){
       setIsValidQual(true);
    }else{
       setIsValidQual(false);
      if(value?.length===0){
        setIsValidQual(true);
      }
    }
  };
  const handleVacancy = (event) => {
    const value = event.target.value;
    setVacancy(value);
    setIsValidVacancy(numericRegex.test(value));
  };
  const handleImageChange = (event) => {
    const file=event.target.files[0]
    setImageFile(file);
    setFileName(file.name);
  };
  const closeModal=()=>{
    setModal(false);
    return history(`/profile/${linkname}`);
  }
  const handleSubmit = async () => {
    // You need to adjust the API endpoint and HTTP method as per your backend setup for updating a post
    const serializedContent = JSON.stringify(DOMPurify.sanitize(content));
    const modifiedDate = date.split('-');
    const formattedDate = `${modifiedDate[2]}-${modifiedDate[1]}-${modifiedDate[0]}`;
    let data;
    if(profile.linkname===postSelected.postedByName){
      data = {
        postedById: profile?.linkname,
        postedByName: profile?.name,
        title: title,
        organization: organization,
        date: formattedDate,
        qualification: qualification,
        vacancy: vacancy, // Make sure to adjust according to your data format
        details: serializedContent,
        category: selectOption,
        timestamp: Date.now(),
      
    };
    }else{
      data = {
        postedById: postSelected.postedById,
        postedByName:postSelected.postedByName,
        title: title,
        organization: organization,
        date: formattedDate,
        qualification: qualification,
        vacancy: vacancy, // Make sure to adjust according to your data format
        details: serializedContent,
        category: selectOption,
        timestamp: Date.now(),
      
    };
    }
    
    const formData = new FormData();
    formData.append('data', JSON.stringify(data));
    
    if (imageFile) {
      formData.append('image', imageFile);
    }
    try {
      const response = await api.put(`/api/editPost/${postId}`, formData, { withCredentials: true });
      if (response.status === 200) {
        // Handle successful update
        setModal(true);
        setServerEcho(response.data.message);
      } else {
        // Handle failure
        setModal(true);
        setServerEcho(response.data.message);
      }
    } catch (err) {
      console.error(err);
      setServerEcho('Unable to save');//console.log(err.response.data.message)
      setModal(true);
    }
  };
  const handleDelete= async ()=>{
    try{
       const response=await api.delete(`/api/deletePost/${postId}`,{ withCredentials: true });
       if (response.status === 200) {
        // Handle successful update
        setModal(true);
        setServerEcho(response.data.message);
        
      } else {
        // Handle failure
        setModal(true);
        setServerEcho(response.data.message);
        
      }
    } catch (err) {
      console.error(err);
      setServerEcho('Unable to delete');
      setModal(true);
    }
  };
    return (
      <div className="w-full min-h-screen bg-white dark:bg-slate-800  text-blue-700 dark:text-gray-300 px-4 lg:px-5 py-10 ">
      <div className="w-full h-full py-10 flex flex-col flex-grow gap-4 lg:gap-3  items-center ">
      
        <div className="flex w-full h-full flex-col flex-grow lg:flex-row justify-center lg:py-2 gap-4">
            <div className='flex flex-col w-full h-full  justify-center gap-2 flex-grow'>
              <label className="font-semibold">Title:</label>
              <input 
                type='text' 
                value={title} 
                onChange={handleTitleChange} 
                className={`${isValidTitle ? 'border-2 border-blue-700' : 'border-2 border-red-500'} focus:outline-none flex-grow p-2 outline-none text-gray-700 rounded-lg mr-2 h-full`} 
                placeholder='Title of the Post'
              />
            </div>
            <div className='flex flex-col w-full h-full  justify-center gap-2'>
              <label className="font-semibold">Organization:</label>
              <input 
                type='text' 
                value={organization} 
                onChange={handleOrganization} 
                className={`${isValidOrg ? 'border-2 border-blue-700' : 'border-2 border-red-500'} focus:outline-none flex-grow p-2 outline-none text-gray-700 rounded-lg mr-2 h-full`} 
                placeholder='Name of the Organization/Institution'
              />
            </div>
            <div className='flex flex-col w-full  h-full  justify-start gap-2'>
              <label className="font-semibold">Last Date:</label>
              <input 
                type='date' 
                value={date} 
                onChange={handleDateChange} 
                className="border-2  rounded-lg mr-2  border-blue-700 h-10 lg:h-11"
                placeholder='select date'
                style={{ backgroundColor:'white',borderColor:'blue'}}
              />
            </div>
          </div>
          
          <div className="w-full h-full flex items-center lg:py-4">
          <div className="w-full h-full flex flex-col lg:flex-row justify-center lg:py-4 gap-2">
            <div className='flex flex-col w-full h-full  justify-center gap-2'>
              <label className="font-semibold">Qualification:</label>
              <input 
                type="text" 
                value={qualification} 
                onChange={handleQualification} 
                className={`${isValidQual ? 'border-2 border-blue-700' : 'border-2 border-red-500'}  focus:outline-none flex-grow p-2 outline-none text-gray-700 rounded-lg mr-2 `} 
                placeholder="Enter Qualification"
              />
            </div>
            <div className='flex flex-col w-full h-full  justify-center gap-2'>
              <label className="font-semibold">Vacancy:</label>
              <input 
                type='text' 
                value={vacancy} 
                onChange={handleVacancy} 
                className={`${isValidVacancy ? 'border-2 border-blue-700' : 'border-2 border-red-500'} focus:outline-none flex-grow p-2 outline-none text-gray-700 rounded-lg mr-2 `} 
                placeholder='Enter the number of Vacancies'
              />
            </div>
            <div className='flex flex-col w-full h-full  justify-start gap-2'>
              <label className="font-semibold">Category:</label>
              <select
                className="focus:outline-none border-2 h-10 lg:h-11 border-blue-700 flex px-2 outline-none text-gray-700 bg-white rounded-lg mr-2 "
                name="Select Category"
                value={selectOption}
                onChange={handleSelectChange}
                
              >
               
                {options.map((option, index) => (
                  <option key={index} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
             <div className="w-full h-[20%] lg:h-[8%] flex items-center lg:py-4   ">
             <div className="w-full h-full flex items-center gap-2">
                <div className="text-blue-700 dark:text-gray-300 font-semibold">Upload Organization Logo: </div>
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
                    onChange={handleImageChange} 
                    className="hidden"
                      />
                  {fileName? (
                      <div className="text-sm text-gray-600 dark:text-gray-100">
                        Selected file: {fileName}
                      </div>
                    ):(
                      <div className="text-sm text-gray-600 dark:text-gray-100">
                        No file selected
                      </div>
                    )}

          </div>
              </div>
             <div className='w-full h-full lg:h-[76%] flex flex-col flex-grow lg:py-4 gap-2  mb-0'>
                    <h1 className="font-semibold">Add description:</h1>
                    <div  className="w-full h-full flex flex-grow  inset-0">
                    <ReactQuill 
                        ref={quillRef} 
                        theme="snow" 
                        value={content}
                        onChange={handleChange} 
                        modules={modules}
                        formats={formats}
                        className="w-full h-full flex flex-col overflow-y-auto bg-white text-gray-700 rounded-lg p-1 flex-grow border-2 border-blue-700"
                      />
                    </div>
                     
                  <div className="flex items-center gap-2 justify-center ">
                      <button
                      className="px-4 py-2 mt-2 shadow-lg bg-white hover:bg-blue-50 text-blue-700 hover:text-blue-900 rounded-lg transition-opacity" 
                      onClick={handleSubmit}
                      disabled={!canSubmit}
                      >
                      <p>Save</p>
                      </button>
                      <button
                      className="px-4 py-2 mt-2 shadow-lg bg-white hover:bg-blue-50 text-blue-700 hover:text-blue-900 rounded-lg transition-opacity" 
                      onClick={handleDelete}
                      
                      >
                      <p>Delete</p>
                      </button>
                      <button
                      className="px-4 py-2 mt-2 shadow-lg bg-white hover:bg-blue-50 text-blue-700 hover:text-blue-900 rounded-lg transition-opacity" 
                      onClick={() => history(-1)}
                      
                      >
                      <p>Cancel</p>
                      </button>
                      <PostModal
                        isOpen={modal}
                        message={serverEcho}
                        closeModal={closeModal}
                      />
                  </div>
         </div>
           </div>
           

    </div>
    )
}

export default EditPostForm
