const User = require('../models/User.model');
const Artist = require('../models/Artist.model');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');


const generateAccessToken = (payload) => {
    return jwt.sign(payload, 'tfygy^&%^$tfgu786ug^&55ui' , {expiresIn: '60m'})   
}
let Refresh_Token = []
const generateRefreshToken = (payload) => {
    let token = jwt.sign(payload, 'uyte$#%^&DF' , {expiresIn:'30m'})   
    Refresh_Token.push(token)
    return token;
}

const login = async (req, res) => {
    const { email, password , role } = req.body;

    if (role === 'artist'){
        const artist = await Artist.findOne({ where: { email : email , role : 'artist' } });
        if (!artist){
            return res.status(401).json({ message: 'Invalid email or password' });
        }
        await bcrypt.compare(password, artist.password , (error , valid) => {
            if (error) {
                return res.status(500).json({ message: 'Internal server error' });
            }
            if (!valid){
                return res.status(401).json({ message: 'Invalid email or password' });
            }
            let access = generateAccessToken({email:artist.email})
            let refresh = generateRefreshToken({email:artist.email})
            return res.status(200).json({ message: 'Login successful' , AccessToken : access , RefreshToken : refresh });
        });
    }else{
        const user = await User.findOne({ where: { email : email } });
        if (!user){
            return res.status(401).json({ message: 'Invalid email or password1' });
        }
        await bcrypt.compare(password, user.password , (error , valid) => {
            if (error) {
                return res.status(500).json({ message: 'Internal server error2' });
            }
            if (!valid){
                return res.status(401).json({ message: 'Invalid email or password3' });
            }
            let access = generateAccessToken({email:user.email})
            let refresh = generateRefreshToken({email:user.email})
            return res.status(200).json({ message: 'Login successful' , AccessToken : access , RefreshToken : refresh });
        });
    }

}


const VerifyToken = async (req,res) => {
    const { Token } = req.body;

    if (!Token){
        return res.status(401).json({ message: 'Unauthorized' });
    }
    jwt.sign(Token , 'tfygy^&%^$tfgu786ug^&55ui' , (error , decode) => {
        if(error){
            throw error 
        }
        let token = generateAccessToken({email:decode.email})
        return res.status(200).json({ message: 'Token verified' , token : token });
    })
}

module.exports = { login , VerifyToken }