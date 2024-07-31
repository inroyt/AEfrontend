// RichTextEditor.js
import React, { useState, useRef, useEffect } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const RichText = () => {
  const [content, setContent] = useState('');
  const quillRef = useRef();

  useEffect(() => {
    if (quillRef.current) {
      let editor = quillRef.current.getEditor();

      editor.format('size', 'normal');
      editor.format('align', 'left');
    }
  }, []);

  const formats = [
    'bold', 'italic', 'underline', 'list', 'bullet'
  ];

  const modules = {
    toolbar: [
      [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'list': 'ordered' }, { 'list': 'bullet' }],
      ['link', 'image'],
      ['clean']
    ],
  };

  const handleChange = (value) => {
    setContent(value);
  };

  return (
    <div className="bg-white">
     
      <ReactQuill
        ref={quillRef}
        theme="snow"
        value={content}
        onChange={handleChange}
        modules={modules}
        
      />
    </div>
  );
};

export default RichText;
