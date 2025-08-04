const { Resend } = require('resend');
const resend = new Resend('re_M4WDUmNj_99mFaAuDaW53bPVkhQA73uJk');

const SaveCode = []
const sendVerificationEmail = async (req, res) => {
    let {email} = req.body
    try {
        const code = Math.floor(100000 + Math.random() * 900000).toString();
        SaveCode.push(code)
        const emailUser = 'ariansayadi247@gmail.com';
        const { data, error } = await resend.emails.send({
            from: 'onboarding@resend.dev',
            to: emailUser,
            subject: 'Your Verification Code',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2 style="color: #333;">Email Verification</h2>
                    <p>Your verification code is:</p>
                    <div style="background-color: #f4f4f4; padding: 15px; border-radius: 5px; text-align: center; margin: 20px 0;">
                        <h1 style="color: #007bff; margin: 0; font-size: 32px;">${code}</h1>
                    </div>
                </div>
            `
        });
        
        if (error) {
            console.error('Resend API Error:', error);
            return res.status(500).json({ 
                success: false, 
                error: 'Failed to send verification email',
                details: error.message 
            });
        }

        console.log('Email sent successfully:', data);
        return res.status(200).json({ 
            success: true, 
            message: 'Verification email sent successfully',
            data 
        });
    } catch (error) {
        console.error('Error in sendVerificationEmail:', error);
        return res.status(500).json({ 
            success: false, 
            error: 'Internal server error',
            details: error.message 
        });
    }
};

const VerificationCode = (req, res) => {
    let {veryCode} = req.body
    if(veryCode === SaveCode){
        res.status(200).json({msg : 'success!'})
    }else{
        res.status(401).json({msg : 'error!'})
    }
};

module.exports = {
    VerificationCode,
    sendVerificationEmail
};
