// 외부 요청을 받아서 컨트롤러로 연결 (API 선언)

module.exports = function(app){
    const user = require("./controller");

    app.get("/", function(req, res){
        res.render("main/main.ejs");
    });

    app.get("/signUp", function(req, res){
        res.render("sign/signUp.ejs");
    });
    app.get("/signIn", user.getSignIn);
    app.get("/logout", user.logout);

    app.post("/signUp", user.signUp);
    app.post("/signIn", user.signIn);



    app.get("/test", user.getMain);             // 네모에 필기 미리보기 추가
    app.get("/notes/:noteId", user.getNote);         // 네모에 필기 내용 추가
    app.get("/field", user.uploadNote);             // 필기 업로드 추가 -> post
    
}