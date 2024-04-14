import React from 'react';

interface SuccessMessageProps {
  success: boolean;
  message: string; // Add a prop for the message
}

const SuccessMessage: React.FC<SuccessMessageProps> = ({ success, message }) => {
  return (
    success && (
      <div className='text-green font-bold text-center'> {message} </div>
    )
  );
};

export default SuccessMessage;
