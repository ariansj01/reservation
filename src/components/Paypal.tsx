// import React from 'react';
import api from '../API/Interceptore.ts';
const PaymentButton = () => {
  const handlePayment = async () => {
    const response = await api.get('/payment');
    console.log(response);
  };

  return (
    <>
        <button className='bg-blue-500 text-white px-4 py-2 rounded-md' onClick={handlePayment}>پرداخت</button>
    </>
  )
};

export default PaymentButton;
