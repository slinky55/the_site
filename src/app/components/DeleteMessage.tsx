import React from 'react';

interface DeleteMessageProps {
  deleteMsg: boolean;
  message: string; // Add a prop for the message
}

const DeleteMessage: React.FC<DeleteMessageProps> = ({ deleteMsg, message }) => {
  return (
    deleteMsg && (
      <div className='text-red-600 font-bold text-center'> {message} </div>
    )
  );
};

export default DeleteMessage;
