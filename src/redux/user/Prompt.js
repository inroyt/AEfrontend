import React from 'react';
import Modal from 'react-modal';

const Prompt = ({ isOpen, message, closeModal,cancelModal }) => {
  return (
<Modal
  isOpen={isOpen}
  onRequestClose={closeModal}
  contentLabel="Modal"
  className="fixed inset-0 flex items-center justify-center"
>
<div className="fixed inset-0 min-h-screen bg-black opacity-30  transition-opacity z-[-10]" ></div>
  <div className="bg-white p-4 rounded shadow-lg w-80 ">
    <p>{message}</p>
    <div className="mt-4 flex justify-end">
      <button onClick={cancelModal} className="px-4 py-2 rounded-md mr-2 bg-gradient-to-r from-slate-500 to-slate-700 hover:from-slate-600 hover:to-slate-700 dark:from-slate-600 dark:to-slate-700 text-gray-100 hover:text-white">Cancel</button>
      <button onClick={closeModal} className="px-4 py-2 bg-blue-500 text-white hover:bg-blue-600 rounded">OK</button>
    </div>
  </div>
</Modal>

  );
};

export default Prompt;
