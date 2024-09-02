import GoogleStrategy from 'passport-google-oauth20';

const googleStrategy = new GoogleStrategy({
    clientId: process.env.GOOGLE_ID,
    secretId: process.env.SECRET_ID,
    callbackId: `${process.env.GOOGLE_CALLBACK}`,

    function (accessToken, refreshToken, profile, passportNext ) {
        console.log(profile)
    }
})

export default googleStrategy