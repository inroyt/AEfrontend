import React, { useState, useEffect, useRef } from 'react';
import { useSelector,  shallowEqual } from 'react-redux';
import { useParams } from 'react-router-dom';
import ReactQuill from 'react-quill';
import DOMPurify from 'dompurify';
import api from '../../api/data';
import PostModal from './PostModal';
import { FaCamera} from 'react-icons/fa';
const AddPost = () => {

  const { linkname } = useParams();
  const profile = useSelector((state) => state.user, shallowEqual).user;
  const name = profile?.name;
  const [selectOption, setSelectOption] = useState('Government job');
  const [title, setTitle] = useState('');
  const [isValidTitle, setIsValidTitle] = useState(true);
  const [organization, setOrganization] = useState('');
  const [isValidOrg, setIsValidOrg] = useState(true);
  const [date, setDate] = useState('');
  const [qualification, setQualification] = useState('');
  const [isValidQual, setIsValidQual] = useState(true);
  const [vacancy, setVacancy] = useState(null);
  const [isValidVacancy, setIsValidVacancy] = useState(true);
  const [content, setContent] = useState('');
  const [imageFile, setImageFile] = useState(null); // Add state for the image file
  const [fileName, setFileName] = useState('');
  const quillRef = useRef();
  
  const canSubmit = Boolean(isValidTitle && isValidOrg && isValidVacancy && isValidQual &&  selectOption.length>0)
                   // && Boolean(title.length > 0 && organization.length > 0 ); //console.log(canSubmit)
  
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
        [{ 'color': [] }, { 'background': [] }],
        [{ 'font': [] }],
        [{ 'align': [] }],
        ['blockquote', 'code-block'],
        [{ 'list': 'ordered'}, { 'list': 'bullet' }],
        [{ 'indent': '-1'}, { 'indent': '+1' }],
        ['link', 'image', 'video'],
        ['clean']
      ],
    }
  };
  
  const formats = [
    'header', 'bold', 'italic', 'underline', 'strike', 
    'color', 'background', 'font', 'align', 'blockquote', 'code-block', 
    'list', 'indent', 'link', 'image', 'video'
  ];
  
  const handleChange = (value) => {
    setContent(value);
  };
  
  const sanitizedContent = DOMPurify.sanitize(content);
  
  const options = [
    'Government job', 'Private job', 'Entrance Examination', 
    'Result', 'Admit Card', 'Notification'
  ];
  
  const regex = /^[a-z\/\-\(\)]+:\d+(,[a-z\/\-\(\)]+:\d+)*$/i;
  const numericRegex = /^\d+$/;
  
  const handleSelectChange = (event) => {
    setSelectOption(event.target.value);
  };
  
  const handleTitleChange = (event) => {
    const value = event.target.value;
    setTitle(value);
    setIsValidTitle(value.length >= 10);
  };
  
  const handleOrganizationChange = (event) => {
    const value = event.target.value;
    setOrganization(value);
    setIsValidOrg(value.length >= 3);
  };
  
  const handleDateChange = (event) => {
    setDate(event.target.value);
  };
  
  const handleQualificationChange = (event) => {
    const value = event.target.value;
    setQualification(value);
    setIsValidQual(value.length >= 8 || value.length === 0);
  };
  
  const handleVacancyChange = (event) => {
    const value = event.target.value;
    setVacancy(value);
    setIsValidVacancy(numericRegex.test(value));
  };

  const handleImageChange = (event) => {
    const file=event.target.files[0]
    setImageFile(file);
    setFileName(file.name);
  };

  const [modal, setModal] = useState(false);
  const [serverEcho, setServerEcho] = useState('');
  
  const closeModal = () => {
    setTitle('');
    setOrganization('');
    setDate('');
    setVacancy('');
    setContent('');
    setQualification('');
    setSelectOption('Government job');
    setModal(false);
  };
  
  const handleSubmit = async () => {
    const serializedContent = JSON.stringify(sanitizedContent);
    const modifiedDate = date.split('-');
    const formattedDate = `${modifiedDate[2]}-${modifiedDate[1]}-${modifiedDate[0]}`;
  
    const data = {
      postedById: linkname,
      postedByName: name,
      title: title,
      organization: organization,
      date: formattedDate,
      qualification: qualification,
      vacancy: vacancy,
      details: serializedContent,
      category: selectOption,
      timestamp: Date.now(),
    };
  
    const formData = new FormData();
    formData.append('data', JSON.stringify(data));
    if (imageFile) {
      formData.append('image', imageFile);
    }
  
    try {
      const response = await api.post('/api/addPost', formData, {
        withCredentials: true,
      });
      if (response.status === 200) {
        setServerEcho(response.data.message);
        setModal(true);
      } else {
        setServerEcho(response.data.message);
        setModal(true);
      }
      
    } catch (err) {
      console.error(err);
      setServerEcho(err.response.data.message);
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
                onChange={handleOrganizationChange} 
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
                onChange={handleQualificationChange} 
                className={`${isValidQual ? 'border-2 border-blue-700' : 'border-2 border-red-500'}  focus:outline-none flex-grow p-2 outline-none text-gray-700 rounded-lg mr-2 `} 
                placeholder="Enter Qualification"
              />
            </div>
            <div className='flex flex-col w-full h-full  justify-center gap-2'>
              <label className="font-semibold">Vacancy:</label>
              <input 
                type='text' 
                value={vacancy} 
                onChange={handleVacancyChange} 
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
        <div className="w-full h-full flex items-center lg:py-4">
          <div className="w-full h-full flex items-center gap-2">
                <div className="text-blue-700 dark:text-gray-300 font-semibold">Uplaod Organization Logo: </div>
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
                      <div className="text-sm text-gray-600">
                        Selected file: {fileName}
                      </div>
                    ):(
                      <div className="text-sm text-gray-600">
                        No file selected
                      </div>
                    )}

          </div>
        </div>
        <div className='w-full h-full lg:h-[76%] flex flex-col flex-grow  gap-2'>
          <label className="font-semibold">Add description:</label>
          <div className="w-full h-full flex flex-grow inset-0">
            <ReactQuill 
              ref={quillRef} 
              theme="snow" 
              value={content}
              onChange={handleChange} 
              modules={modules}
              formats={formats}
              className="w-full h-[324px] lg:h-[424px] flex flex-col overflow-y-auto bg-white text-gray-700 rounded-lg p-1 flex-grow border-2 border-blue-700"
            />
          </div>
          <div className="flex items-center justify-center">
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
  );
};

export default AddPost;
