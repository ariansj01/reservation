import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';

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

const GoogleLoginButton = () => {
  const handleLoginSuccess = (credentialResponse: any) => {
    const decoded = jwtDecode<GoogleJwtPayload>(credentialResponse.credential);
    console.log("User info:", decoded);
    // Now you have access to all the user data
    // const { 
    //   email,
    //   name,
    //   picture,
    //   sub,
    //   email_verified,
    //   family_name,
    //   given_name,
    //   aud,
    //   azp,
    //   exp,
    //   iat,
    //   iss,
    //   jti,
    //   nbf
    // } = decoded;
    // Do something with the user data
  };

  return (
    <div style={{ marginTop: '100px', textAlign: 'center' }}>
      <h2>ورود با گوگل</h2>
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