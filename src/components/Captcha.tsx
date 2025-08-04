// const captchaId = 'CROPPED_87c2df8_1a3102b589634004a7a4dbd3fc7b4401'; 
// const containerId = 'lemin-cropped-captcha';

// src/App.jsx
import React from 'react';
import { leminCroppedCaptcha } from '@leminnow/react-lemin-cropped-captcha';

function Captcha() {
  // const [captchaToken, setCaptchaToken] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    const token = leminCroppedCaptcha.getCaptcha('CROPPED_87c2df8_1a3102b589634004a7a4dbd3fc7b4401').getCaptchaValue();
    if (!token) {
      alert('لطفاً کپچا را تکمیل کنید.');
      return;
    }
    // setCaptchaToken(token.answer);
    // http://localhost:8080/api/v1/verify-captcha
    const response = await fetch('https://ariansj.ir/api/v1/verify-captcha', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ captchaToken: token }),
    });

    const result = await response.json();
    if (result.success) {
      alert('کپچا با موفقیت تأیید شد.');
    } else {
      alert('تأیید کپچا ناموفق بود.');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      
      <button type="submit">ارسال</button>
    </form>
  );
}

export default Captcha;
