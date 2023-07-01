// go to index.js

const fs = require('fs');
const rfs = require('rotating-file-stream');
const path = require('path');

//this is the variable where the log will store
//E:/CODETALK/config/environment/
//E:/CODETALK/production_log.js
const logDirectory = path.join(__dirname, '../production_logs')
//i have to find is production_log exist or not,not then create it
fs.existsSync(logDirectory) || fs.mkdirSync(logDirectory);

const accessLogStream = rfs.createStream('access.log', {
    interval: '1d', // rotate daily
    path: logDirectory
});

const development = {
    name: 'development',
    asset_path: '/assets',
    session_cookie_key: "blahSomething",
    db: 'Manual_Authenction',
    smtp: {
        service: 'gmail',
        host: 'smtp.gmail.com',
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
            user: "rpande400@gmail.com", // your gmail username
            pass: 'hvcicyolqjgqpudq',  // your gmail password
        },
        tls: {
            rejectUnauthorized: false,
          },
    },
    google_client_id: "364941021041-q175n3cofq9bhr78audcrnhp3vn5oekl.apps.googleusercontent.com",
    google_client_secret: "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",
    google_call_back_URL: "http://localhost:8000/user/auth/google/callback",
    jwt_secret_key: 'codeial',
    morgan: {
        mode: 'dev',
        options: { stream: accessLogStream }
    }
}

const production = {
    name: 'production',
    asset_path: process.env.ASSET_PATH,
    session_cookie_key: process.env.SESSION_COOKIE_KEY,
    db: process.env.DB,
    smtp: {
        service: 'gmail',
        host: 'smtp.gmail.com',
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
            user: process.env.EMAIL_USERNAME, // generated username
            pass: process.env.EMAIL_PASSWORD, // generated password
        },
        tls: {
            rejectUnauthorized: false,
          },
    },
    google_client_id: process.env.GOOGLE_CLIENT_ID,
    google_client_secret: process.env.GOOGLE_CLIENT_SECRET,
    google_call_back_URL: process.env.GOOGLE_CALLBACK_URL,
    jwt_secret_key: process.env.JWT_SECRET,
    morgan: {
        mode: 'combined',
        options: { stream: accessLogStream }
    }

}

// module.exports=development;
// module.exports = eval(process.env.NODE_ENV) == undefined ? development : eval(process.env.NODE_ENV);

        if (process.env.NODE_ENV == "production") {
            	module.exports = production;
            } else {
            	module.exports = development;
            }