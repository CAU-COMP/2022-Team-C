// 외부 요청을 받아서 컨트롤러로 연결 (API 선언)

module.exports = function(app){
    const user = require("./controller");

    app.get("/", function(req, res){
        res.render("main/main.html");
    });

    app.get("/test", function(req, res){
        res.render("member_main/main.html");
    });

      
    app.get("/signUp", function(req, res){
        res.render("sign/signUp.html");
    });
    app.post("/signUp", user.signUp);

    app.get("/signIn", function(req, res){
        res.render("sign/signIn.html");
    });
    app.post("/signIn", user.signIn);
 

    app.get("/main/:userId", user.getMain);


    app.get("/notes/:noteId", user.getNote);
    app.patch("/notes/:noteId", user.hitsUp);               // 조회수 + 1

    

    
    
    
    
    //app.get("/note/upload", user.uploadNote);
    
}