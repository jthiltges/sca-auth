
//node
var fs = require('fs');

//contrib
var winston = require('winston');

exports.auth = {
    //mongodb: "mongodb://localhost/auth",
    
    //following are used by IU CAS authentication.
    //normally, these url should be configured on UI (which they are..)
    //but since I have to jump browser to api endpoint (so that it can validate the token),
    //I have to store these urls here. 
    //I think I can somehow proxy validation from the brower so that I can do everything on browser
    
    //user scopes to give to all new users when registered
    default_scopes: {
        sca: ["user"],
        mca: ["user"], //needed by mca
        dicom: ["user"], //needed by dicom
    },

    //isser to use for generated jwt token
    iss: "https://yourdomain.com/auth",
    //ttl for jwt
    ttl: 24*3600*1000, //1 day
    
    public_key: fs.readFileSync(__dirname+'/auth.pub'),
    private_key: fs.readFileSync(__dirname+'/auth.key'),
    //option for jwt.sign
    sign_opt: {algorithm: 'RS256'},

    //allow_signup: false, //prevent user from signing in
};
    
//comment this out if you don't want to confirm email
exports.email_confirmation = {
    //url: 'https://soichi7.ppa.iu.edu/auth/#/confirm_email', //TODO I should be able to construct this myself
    subject: 'SCA Account Confirmation',
    from: 'your@email.com',  //iu mail server will reject if this is non-repliable address/
};

//for user/pass login
exports.local = {
};

//for x509
exports.x509 = {
    //http header to look for x509 DN 
    //for nginx set proxy_set_header DN $ssl_client_s_dn
    //for apache, SSLOptions +StdEnvVars will set it to SSL_CLIENT_S_DN
    dn_header: 'dn',
    allow_origin: '*', 
};

/*
//for google saml2
exports.google = {
};

exports.git = {
}

*/

exports.db = {
    "dialect": "sqlite", 
    "storage": "/tmp/auth.sqlite",
    "logging": false
}

//for iucas login
exports.iucas = {
    //url to redirect after successful iucas login (with ?jwt=<jwt>)
    //you should take jwt, store it on localstorage, and redirect to wherever you want to go
    //this is not the same thing as the ui/config.js -- default_redirect_url !!

    //used for casurl, and also used to return to the auth page to display login error messages
    //home_url: 'https://soichi7.ppa.iu.edu/auth',
};

exports.express = {
    //web server port
    port: 12000,
};

/* moved to model.json
exports.sequelize = {
    //for sqlite (if you use it)
    dialect: 'sqlite', 
    storage: '/usr/local/tmp/auth.sqlite'
};
*/

exports.logger = {
    winston: {
        transports: [
            //display all logs to console
            new winston.transports.Console({
                timestamp: function() {
                    return Date.now(); //show time in unix timestamp
                },
                level: 'debug',
                colorize: true
            }),

            /*
            //store all warnings / errors in error.log
            new (winston.transports.File)({
                filename: 'error.log',
                level: 'warn'
            })
            */
        ]
    },

    //logfile to store all requests (and its results) in json
    request: {
        transports: [
            /*
            new (winston.transports.File)({
                filename: 'request.log',
                json: true
            })
            */
            /* (not sure how to get this working)
            new (winston.transports.Logstash)({
                port: 28777,
                node_name: 'isdp-soichi-dev',
                host: 'soichi7.ppa.iu.edu'
            })
            */
        ]
    }
}

