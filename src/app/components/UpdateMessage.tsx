import React from 'react';

interface UpdateMessageProps {
  update: boolean;
  message: string; // Add a prop for the message
}

const UpdateMessage: React.FC<UpdateMessageProps> = ({ update, message }) => {
  return (
    update && (
      <div className='text-green font-bold text-center'> {message} </div>
    )
  );
};

export default UpdateMessage;
