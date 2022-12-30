const express = require("express");
const methodOverride = require("method-override");
const bodyParser = require("body-parser");
var cors = require('cors');
module.exports = function () {
    const app = express();
    app.use(express.json());
    app.use(express.urlencoded({extended: true}));
    app.use(methodOverride());

    app.use(express.urlencoded({extended: true}))

    app.use(cors());
    app.use(express.static(process.cwd() + '/views'));

    app.set('views', __dirname + '/../../views');  // views 폴더 지정
    app.engine('html', require('ejs').renderFile);  
    app.set('view engine', 'html');

    require('../src/router')(app);

    return app;
};