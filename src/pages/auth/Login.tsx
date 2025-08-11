import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import api from '../../API/Interceptore.ts'
import Notification from '../../components/Notification'
// import Captcha from '../../components/Captcha'
// import GoogleLoginButton from '../../components/GoogleLoginButton'
import { GoogleLogin } from '@react-oauth/google'
import { GoogleOAuthProvider } from '@react-oauth/google'
import { jwtDecode } from 'jwt-decode'
import { leminCroppedCaptcha, LeminCroppedCaptchaContainer } from '@leminnow/react-lemin-cropped-captcha';

interface GoogleJwtPayload {
  email: string;
  name: string;
  picture: string;
  sub: string;
  email_verified: boolean;
  family_name: string;
  given_name: string;
  aud: string;
  azp: string;
  exp: number;
  iat: number;
  iss: string;
  jti: string;
  nbf: number;
}

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    role: 'user',
    password: ''
  })
  const [showNotification, setShowNotification] = useState(false)
  const [notificationMessage, setNotificationMessage] = useState('')
  const [notificationType, setNotificationType] = useState<'success' | 'error'>('success')
  // const [captchaVerified, setCaptchaVerified] = useState(true)
  // const [captchaToken, setCaptchaToken] = useState('');
  const captchaVerified = true
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const navigate = useNavigate()

  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const token = leminCroppedCaptcha.getCaptcha('CROPPED_87c2df8_1a3102b589634004a7a4dbd3fc7b4401').getCaptchaValue();
    if (!token) {
      alert('لطفاً کپچا را تکمیل کنید.');
      return;
    }
    // setCaptchaToken(token.answer);

    // const response = await api.post('/verify-captcha', {
    //   captchaToken : token.answer 
    //   // answer: token.answer,
    //   // challenge_id: token.challenge_id
    // });
    // console.log(response)
    // if (response.status === 200) {
    //   setNotificationMessage('کپچا با موفقیت تأیید شد.');
    //   setNotificationType('success');
    //   setShowNotification(true);
    // } else {
      // setNotificationMessage('تأیید کپچا ناموفق بود.');
      // setNotificationType('error');
      // setShowNotification(true);
    // }


    if (!captchaVerified) {
      setNotificationMessage('Please complete the captcha verification');
      setNotificationType('error');
      setShowNotification(true);
      return;
    }
    let users = await api.get('/users')
    let artists = await api.get('/artists')
    let user = users.data.data.filter((user:any) => user.email === formData.email)
    localStorage.setItem('user' , JSON.stringify(user))
    formData.role = 'user'
    console.log(user)
    if(user.length === 0){
      let artist = artists.data.data.filter((artist:any) => artist.email === formData.email)
      formData.role = 'artist'
      console.log(artist[0])
      localStorage.setItem('user' , JSON.stringify(artist))
      if(artist.length === 0){
        setNotificationMessage('User not found');
        setNotificationType('error');
        setShowNotification(true);
        return;
      }
    }
    try {
      let login = await api.post('/login', {email: formData.email, password: formData.password, role: formData.role})
      
      if (login.status === 200) {
        localStorage.setItem('email', formData.email);
        localStorage.setItem('AccessToken', login.data.AccessToken);
        localStorage.setItem('RefreshToken', login.data.RefreshToken);
        setNotificationMessage('Login successful!');
        setNotificationType('success');
        setShowNotification(true);
        const response = await api.post('/send-verification-email', { email: formData.email })
        console.log(response)
        setTimeout(() => {
          // navigate('/verify-email');
          navigate('/Landing')
        }, 2000);
      }
    } catch (err) {
      console.log(err);
      setNotificationMessage('Login failed. Please check your credentials.');
      setNotificationType('error');
      setShowNotification(true);
    }
  }
  const handleSuccess = async (credentialResponse: any) => {
    const decoded = jwtDecode<GoogleJwtPayload>(credentialResponse.credential);
    console.log('Login Success:', decoded);
    const response = await api.get(`/users`);
    console.log('Users response:', response); // Debug log
    const users = Array.isArray(response.data) ? response.data : [];
    const findUser = users.find((user: any) => user.email === decoded.email);
    
    if(!findUser){
      let register = await api.post('/users', {
        name: decoded.given_name,
        email: decoded.email,
        phone: '',
        password: decoded.sub,
        role: 'user'
      })
      if(register.status === 201){
        localStorage.setItem('email', decoded.email);
        localStorage.setItem('AccessToken', register.data.AccessToken);
        localStorage.setItem('RefreshToken', register.data.RefreshToken);
        setNotificationMessage('Login successful!');
        setNotificationType('success');
        setShowNotification(true);
        const response = await api.post('/send-verification-email',decoded.email)
        console.log(response)
        setTimeout(() => {
          // navigate('/verify-email');
          navigate('/Landing')
        }, 2000);
      }
      console.log(register)
    }else{
      let login = await api.post('/login', {
        email: decoded.email,
        password: decoded.sub,
      })
      if(login.status === 200){
        localStorage.setItem('email', decoded.email);
        localStorage.setItem('AccessToken', login.data.AccessToken);
        localStorage.setItem('RefreshToken', login.data.RefreshToken);
        setNotificationMessage('Login successful! Please verify your email.');
        setNotificationType('success');
        setShowNotification(true);
        setTimeout(() => {
          navigate('/Landing');
          // navigate('/verify-email');
        }, 2000);
      } else {
        setNotificationMessage('Login failed. Please check your credentials.');
        setNotificationType('error');
        setShowNotification(true);
      }
      console.log(login)
    }
  }
  const handleError = () => {
    setNotificationMessage('Google login failed. Please try again.');
    setNotificationType('error');
    setShowNotification(true);
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full animate-spin-slow"></div>
        <div className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full animate-spin-slow-reverse"></div>
      </div>

      <div className="relative max-w-md w-full space-y-8 transform transition-all duration-500 hover:scale-105">
        <div className="backdrop-blur-lg bg-white/10 p-8 rounded-2xl shadow-2xl border border-white/20">
          <div className="text-center">
            <h2 className="mt-6 text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
              Welcome Back
            </h2>
            <p className="mt-2 text-sm text-gray-300">
              Please sign in to your account
            </p>
          </div>
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div className="rounded-md shadow-sm -space-y-px">
              <div className="mb-4">
                <label htmlFor="email" className="sr-only">Email address</label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  className="appearance-none rounded-none relative block w-full px-3 py-3 border border-white/20 bg-white/5 text-white placeholder-gray-400 rounded-t-md focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-transparent transition-all duration-300 backdrop-blur-sm"
                  placeholder="Email address"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>
              
              <label htmlFor="password" className="sr-only">Password</label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-3 border border-white/20 bg-white/5 text-white placeholder-gray-400 rounded-b-md focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-transparent transition-all duration-300 backdrop-blur-sm"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
              />
            </div>

            <div className="my-4">
              <LeminCroppedCaptchaContainer
                    containerId="lemin-cropped-captcha"
                    captchaId="CROPPED_87c2df8_1a3102b589634004a7a4dbd3fc7b4401"
                  />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-purple-500 focus:ring-purple-500 border-white/20 rounded bg-white/5"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-300">
                  Remember me
                </label>
              </div>

              <div className="text-sm">
                <a href="#" className="font-medium text-purple-400 hover:text-purple-300 transition-colors duration-300">
                  Forgot your password?
                </a>
              </div>
            </div>

            <button
              type="submit"
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500/50 transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-purple-500/20"
            >
              <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                <svg className="h-5 w-5 text-purple-300 group-hover:text-purple-200 transition-colors duration-300" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                </svg>
              </span>
              Sign in
            </button>

            <div className="text-center">
              <p className="text-sm text-gray-300">
                Don't have an account?{' '}
                <Link to="/register" className="font-medium text-purple-400 hover:text-purple-300 transition-colors duration-300">
                  Register here
                </Link>
              </p>
              <br />
              {/* <Captcha /> */}
              <GoogleOAuthProvider clientId="1004266058067-c1tm5h8u2f1lhg9hl9agua28o9h64fg4.apps.googleusercontent.com">
                <div className='text-center'>
                  <h4>OR</h4>
                  <GoogleLogin
                    onSuccess={handleSuccess}
                    onError={handleError}
                  />
                </div>
                {/* <Captcha /> */}
              </GoogleOAuthProvider>
            </div>
          </form>
        </div>
      </div>

      {showNotification && (
        <Notification
          message={notificationMessage}
          type={notificationType}
          duration={2000}
          onClose={() => {
            setShowNotification(false);
            if (notificationType === 'success') {
              navigate('/user-dashboard');
            }
          }}
        />
      )}
    </div>
  )
}

export default Login