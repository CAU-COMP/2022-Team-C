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

    app.get("/signUp", function (req, res) {
        res.render("sign/signUp.ejs");
    });
    app.post("/signUp", user.signUp);

    app.get("/signIn", user.getSignIn);
    app.post("/signIn", user.signIn);

    app.get("/logout", user.logout);

    app.get("/field", user.getUpload);
    app.post("/field", upload.single('file'), user.uploadNote);





    app.get("/test", user.getMain);             // 네모에 필기 미리보기 추가
    app.get("/notes/:noteId", user.getNote);         // 네모에 필기 내용 추가



}