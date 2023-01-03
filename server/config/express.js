const express = require("express");
const methodOverride = require("method-override");
const secret = require("./secret")
let session = require("express-session");
var cors = require('cors');

module.exports = function () {
    const app = express();
    app.use(express.json());
    app.use(express.urlencoded({extended: true}));
    app.use(methodOverride());

    app.use(express.urlencoded({extended: true}))

    app.use(cors());
    app.use(express.static(process.cwd() + '/views'));

    app.use(session({
        secret: secret.key,
        resave: false,
        saveUninitialized: false
    }));

    app.set('views', __dirname + '/../../views');  // views 폴더 지정
    app.engine('ejs', require('ejs').renderFile);  
    app.set('view engine', 'ejs');

    require('../src/router')(app);

    return app;
};