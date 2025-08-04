import { GoogleLogin } from '@react-oauth/google';

const GoogleLoginButton = () => {
  const handleLoginSuccess = (credentialResponse: any) => {
    // const decoded = jwt_decode(credentialResponse.credential);
    console.log("User info:", credentialResponse);
  };

  return (
    <div>
      <GoogleLogin
        onSuccess={handleLoginSuccess}
        onError={() => {
          console.log('Login Failed');
        }}
      />
    </div>
  );
}

export default GoogleLoginButton;
