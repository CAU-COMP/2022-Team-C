// 외부 요청을 받아서 컨트롤러로 연결 (API 선언)

module.exports = function (app) {
    const user = require("./controller");
    const multer = require("multer");
    const path = require('path');
    let storage = multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, "./views/file/");
        },
        filename: function (req, file, cb) {
            let name = Date.now() + path.extname(file.originalname);
            cb(null, name);
        }
    });
    const upload = multer({ storage: storage });

    app.get("/", function (req, res) {
        res.render("main/main.ejs");
    });


    app.get("/test", user.getMain);  


    app.get("/signUp", function (req, res) {
        res.render("sign/signUp.ejs");
    });
    app.post("/signUp", user.signUp);

    app.get("/signIn", user.getSignIn);
    app.post("/signIn", user.signIn);

    app.get("/logout", user.logout);

    app.get("/field", user.getUpload);
    app.post("/field", upload.single('file'), user.uploadNote);

    app.get("/notes/:noteId", user.getNote); 
    app.get("/myField", user.getMyField);

    app.get("/search", user.getSearch);
    app.post("/search", user.keyWord);

    app.get("/changeInfo", user.getChangeInfo);
    //app.patch("/changeInfo", user.patchInfo);



    app.get("/myInfo", user.getMyInfo);                 // 수정 필요

    



    
    



}