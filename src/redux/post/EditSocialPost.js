import React, { useState, useEffect,useRef } from 'react';
import { useSelector, shallowEqual } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import ReactQuill from 'react-quill';
import DOMPurify from 'dompurify';
import api from '../../api/data';
import PostModal from './PostModal';
import { FaUpload} from 'react-icons/fa';

const EditPostForm = () => {
  const history = useNavigate();
  const { postId } = useParams();
  const profile = useSelector((state) => state.user, shallowEqual).user;
  const postSelected = useSelector((state) => state.post.postSelected);
  // Initialize form state with postSelected data
  const [title, setTitle] = useState(postSelected.title || '');
  const [isValidTitle,setIsValidTitle] = useState(true);
  const [link,setLink] = useState(postSelected.link || '');
  const [isValidLink,setIsValidLink] = useState(true);
  const [content, setContent] = useState(postSelected?.details?.replace(/^"|"$/g, '') || '');
  const [imageFile, setImageFile] = useState(null); 
  const [fileName, setFileName] = useState('');
  const [imageUrl, setImageUrl] = useState(postSelected.imageUrl || '');
  const [isValidImageUrl,setIsValidImageUrl] = useState(true);
  const canSubmit=Boolean(isValidTitle&&isValidLink&&isValidImageUrl&&title.length > 0 && isValidLink);
  const convertDate = (inputDate) => {
    const [day, month, year] = inputDate.split('-'); // Assuming the date is in DD-MM-YYYY format
    return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`; // Convert to YYYY-MM-DD format
    };
            
  const quillRef = useRef();

  useEffect(() => {
    if (quillRef.current) {
      let editor = quillRef.current.getEditor();
      editor.format('size', 'normal');
      editor.format('align', 'left');
    }
  }, []);
  

  const handleLink = (event) => {
    const value=event.target.value;
    setLink(value);
    if(linkRegex.test(value)){
      setIsValidLink(true);
    }else{
      setIsValidLink(false);
      if(value?.length===0)
       setIsValidLink(true);
    }
};
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


  // Regex for the text pattern and a separate one for numeric values

  const linkRegex=/^(https?|ftp):\/\/[^\s\/$.?#].[^\s]*$/;
  

  const handleTitleChange = (event) => {
    const value=event.target.value
    setTitle(value);
    if(value?.length<10){
       setIsValidTitle(false);
    }else{
      setIsValidTitle(true);
    }
  };

  const handleImageLink = (event) => {
    const value=event.target.value;
    setImageUrl(value);
    if(linkRegex.test(value)){
      setIsValidImageUrl(true);
      setImageFile(null);// remove the image file if there is a valid image link
    }else{
      setIsValidImageUrl(false);
      if(value?.length===0)
       setIsValidImageUrl(true);
    }
  };
  const handleImageChange = (event) => {
    const file=event.target.files[0]
    setImageFile(file);
    setFileName(file.name);
  };

  
  const [modal,setModal]=useState(false);
  const [serverEcho,setServerEcho]=useState('');
  const closeModal=()=>{
    setModal(false);
    return history(-1);
  }
  const handleSubmit = async () => {
    // You need to adjust the API endpoint and HTTP method as per your backend setup for updating a post
    const serializedContent = JSON.stringify(DOMPurify.sanitize(content));
    let data;
    if(profile.linkname===postSelected.postedByName){
       data = {
        postedById: profile?.linkname,
        postedByName: profile?.name,
        title:title,
        link:link,
        imageUrl:imageUrl,
        isSocial:true,
        details: serializedContent, // Using the sanitized content
        timestamp: Date.now(),
    };
    }else{
      data = {
        postedById: postSelected.postedById,
        postedByName:postSelected.postedByName,
        title:title,
        link:link,
        imageUrl:imageUrl,
        isSocial:true,
        details: serializedContent, // Using the sanitized content
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
    }catch (err) {
      console.error(err);
      setServerEcho("unable to save");
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
    }catch (err) {
      console.error(err);
      setServerEcho("unable to delete");
      setModal(true);
    }
  }
    return (
      <div className="w-full min-h-screen bg-white dark:bg-slate-800  text-blue-700 dark:text-gray-300 px-4 lg:px-5 py-10 ">
      <div className="w-full h-full py-10 flex flex-col flex-grow gap-5  items-center ">
        <div className="flex w-full h-full flex-col flex-grow lg:flex-row gap-8  ">
          <div className="flex w-full h-full flex-col flex-grow lg:flex-row justify-center lg:py-2 gap-4">
            <div className='flex flex-col w-full h-full  justify-center gap-2 flex-grow'>
                  <h className="font-semibold">Title:</h>
                  <input type='text' value={title} onChange={handleTitleChange} className={`${isValidTitle?`border-2 border-blue-700`:`border-2 border-red-500`} focus:outline-none flex-grow p-2 outline-none text-gray-700 rounded-lg mr-2 `} placeholder='Title of the Article'/>
                </div>
                <div className='flex flex-col w-full h-full  justify-center gap-2 flex-grow'>
                  <h className="font-semibold">Link:</h>
                  <input type='text' value={link} onChange={handleLink} className={`${isValidLink?`border-2 border-blue-700`:`border-2 border-red-500`} focus:outline-none flex-grow p-2 outline-none text-gray-700 rounded-lg mr-2 `} placeholder='Link for the article(if any)'/>
                </div>
             </div>
            
         
            </div>
            
            <div className="flex w-full h-full flex-col flex-grow lg:flex-row justify-center lg:py-2 gap-4">
          <div className='flex flex-col w-full h-full  justify-center gap-2 flex-grow'>
                <h className="font-semibold">Image Link:</h>
                <input type='text' value={imageUrl} onChange={handleImageLink} className={`${isValidImageUrl?`border-2 border-blue-700`:`border-2 border-red-500`} focus:outline-none flex-grow p-2 outline-none text-gray-700 rounded-lg mr-2 `} placeholder='Image Link for the article(if any)'/>
              </div>
            
          
           <div className="w-full h-full flex items-center gap-2 lg:mt-10">
                <div className="text-blue-700 dark:text-gray-300 font-semibold">Upload Image: </div>
                  <label 
                    title='Upload Profile Photo'
                    htmlFor="file-input" 
                    className="cursor-pointer flex items-center justify-center text-blue-400 hover:text-blue-500 rounded-md transition"
                  >
                  <FaUpload size='20'/>
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
               <div className='w-full h-full  flex flex-col flex-grow lg:py-4 gap-2  mb-0'>
                      <h1 className="font-semibold">Add description:</h1>
                      <div  className="w-full h-full overflow-y-auto inset-0">
                      <ReactQuill 
                          ref={quillRef} 
                          theme="snow" 
                          value={content}
                          onChange={handleChange} 
                          modules={modules}
                          formats={formats}
                          className="w-full  h-[324px] lg:h-[424px] flex flex-col rounded-lg p-1 text-gray-700 bg-white flex-grow border-2 border-blue-700"
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