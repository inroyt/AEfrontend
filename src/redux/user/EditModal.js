import React from 'react';
import Modal from 'react-modal';

const EditModal = ({ isOpen, message, closeModal }) => {
  return (
<Modal
  isOpen={isOpen}
  contentLabel="Modal"
  className="fixed inset-0 flex items-center justify-center"
>
<div className="fixed inset-0 min-h-screen bg-black opacity-30  transition-opacity z-[-10]" ></div>
  <div className="bg-white p-4 rounded shadow-lg w-80 ">
    <p>{message}</p>
    <div className="mt-4 flex justify-end">
      <button onClick={closeModal} className="px-4 py-2 bg-blue-500 text-white hover:bg-blue-600 rounded">OK</button>
    </div>
  </div>
</Modal>

  );
};

export default EditModal;