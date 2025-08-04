const { Resend } = require('resend');

const resend = new Resend('re_F49vnbw9_88hFBsCoJT5HW4v2t5pcTRaN');

const sendVerificationCode = async (email, code) => {
    try {
        const { data, error } = await resend.emails.send({
            from: 'onboarding@resend.dev',
            to: email,
            subject: 'Email Verification Code',
            html: `
                <h1>Email Verification</h1>
                <p>Your verification code is: <strong>${code}</strong></p>
                <p>This code will expire in 10 minutes.</p>
            `
        });

        if (error) {
            console.error('Error sending email:', error);
            return false;
        }

        return true;
    } catch (error) {
        console.error('Error sending email:', error);
        return false;
    }
};

module.exports = {
    sendVerificationCode
}; 