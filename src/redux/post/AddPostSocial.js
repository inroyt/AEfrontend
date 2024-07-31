import React, { useState, useEffect, useRef } from 'react';
import { useSelector,shallowEqual } from 'react-redux';
import { useParams } from 'react-router-dom';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import DOMPurify from 'dompurify';
import api from '../../api/data';
import PostModal from './PostModal';
import { FaUpload} from 'react-icons/fa';
const AddSocialPost = () => {
const {linkname}=useParams();
const profile = useSelector((state) => state.user, shallowEqual).user;
const name=profile?.name;
const [title,setTitle] = useState('');
const [isValidTitle,setIsValidTitle] = useState(true);
const [link,setLink] = useState('');
const [isValidLink,setIsValidLink] = useState(true);
const [content, setContent] = useState('');
const [imageFile, setImageFile] = useState(null); 
const [fileName, setFileName] = useState('');
const [imageUrl, setImageUrl] = useState('');
const [isValidImageUrl,setIsValidImageUrl] = useState(true);
const quillRef = useRef();
const canSubmit=Boolean(isValidTitle&&isValidLink&&isValidImageUrl&&title.length > 0 && isValidLink);
                
useEffect(() => {
  if (quillRef.current) {
    let editor = quillRef.current.getEditor();

    editor.format('size', 'normal');
    editor.format('align', 'left');
  }
}, []);

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
const sanitizedContent = DOMPurify.sanitize(content);


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
  setTitle('');
  setLink('');
  setImageUrl('')
  setContent('');
  setModal(false);
}
const handleSubmit=async ()=>{
  const serializedContent = JSON.stringify(sanitizedContent);
  const data={
      postedById:linkname,
      postedByName:name,
      title:title,
      link:link,
      imageUrl:imageUrl,
      isSocial:true,
      details: serializedContent, // Using the sanitized content
      timestamp: Date.now(),
      
      }
      const formData = new FormData();
      formData.append('data', JSON.stringify(data));
      if (imageFile) {
        formData.append('image', imageFile);
      }
      try{
        const response=await api.post('/api/addPost',formData,{withCredentials:true}); 
        if(response.status===200){
         setServerEcho(response.data.message);
         setModal(true);
        }else{
          setServerEcho(response.data.error);
          setModal(true);
        }
      }catch (err) {
        console.error(err);
        setServerEcho(err.response.data.message);
      }

}


  return (
    <div className="w-full min-h-screen bg-white dark:bg-slate-800  text-blue-700 dark:text-gray-300 px-4 lg:px-5 py-10 ">
    <div className="w-full h-full py-10 flex flex-col flex-grow gap-5   ">
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
                     
                  <div className="flex items-center justify-center my-6">
                      <button
                      className="px-4 py-2 mb-4 shadow-lg bg-white hover:bg-blue-50 text-blue-700 hover:text-blue-900 rounded-lg transition-opacity" 
                      onClick={handleSubmit}
                      disabled={!canSubmit}
                      >
                      <p>Post</p>
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

export default AddSocialPost;
