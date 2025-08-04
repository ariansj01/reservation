const axios = require('axios');

const verifyCaptcha = async (req, res) => {
  const secret = 'b71f3fdf-865b-45d9-bd12-5c2976be2500';
  const { captchaToken } = req.body;
  if (!captchaToken) {
    return res.status(400).json({ success: false, message: 'توکن کپچا یافت نشد.' });
  }

  try {
    const response = await axios.post('https://api.leminnow.com/captcha/v2/verify', {
      captchaId: 'CROPPED_87c2df8_1a3102b589634004a7a4dbd3fc7b4401',
      answer: captchaToken,
    }, {
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': secret
      },
    });

    if (response.data && response.data.success) {
      res.json({ success: true });
    } else {
      res.status(400).json({ success: false, message: 'تأیید کپچا ناموفق بود.' });
    }
  } catch (error) {
    console.error('خطا در تأیید کپچا:', error);
    res.status(500).json({ success: false, message: 'خطای سرور در تأیید کپچا.' });
  }
};

module.exports = {verifyCaptcha}
