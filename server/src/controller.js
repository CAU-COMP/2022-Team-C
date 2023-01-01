// 받은 데이터가 유효한지 확인
const provider = require("./provider");
const service = require("./service");

exports.getNote = async function(req, res){
    const noteId = req.params.noteId;

    const noteByNoteId = await provider.retrieveNote(noteId);               // 좌측
    const reviewByNoteId = await provider.retrieveReview(noteId);           // 우측

    console.log(noteByNoteId);
    console.log(reviewByNoteId);

    return res.render("notes/main.html");
    // return res.render("notes/main.html", {'result': mainByUserId});      // ejs로 바꾸기 
}

exports.hitsUp = async function(req, res){
    const noteId = req.params.noteId;
    await service.updateHits(noteId);
}

exports.getMain = async function(req, res){
    const userId = req.params.userId;

    // if(!id) return res.send(errResponse(baseResponse.USER_USERID_EMPTY));

    const mainByUserId = await provider.retrieveMain(userId);
    console.log(mainByUserId);
    // res.render("member_main/main.html", {'result': mainByUserId});       // ejs로 바꾸기 
}

exports.signUp = async function (req, res) {

    // Body: id, pw, email, name, dept
     
    const {id, pw, email, name, dept} = req.body;

    if(!id || !pw || !email || !name || !dept){
        return res.redirect("/signUp");
    }
    
    const signUpService = await service.createUser(
        id, pw, email, name, dept
    );

    return res.redirect("/main");
    //res.redirect("/main", {result : signUpService});
};

exports.signIn = async function(req, res){
    const {id, pw} = req.body;                    // id pwd 대신 id name으로 사용자 식별

    if(!id || !pw){
        return res.redirect("/signIn");
    }
    
    const signInService = await service.postSignIn(id, pw);
    if(!signInService[0])           // 로그인 실패
        return res.redirect("/signIn"); 
    if(signInService[0].id == id)      // 로그인 성공
        return res.redirect("/main");

    //res.redirect("/main", {result : signInService});
}

/*
'cau2023', 'password456', 'cau2023@cau.ac.kr', '김1', '전자전기공학부', '15'
'comp1234', 'helloworld12', 'comp1234@cau.ac.kr', '고', '경제학부', '30'
'gominzip', 'mypw789', 'gominzip@cau.ac.kr', '김2', '경영학부', '25'
'hnnynh', 'pwpw2023', 'hnnynh@cau.ac.kr', '한', '소프트웨어학부', '35'
'puang2', 'abcd1234', 'puang2@cau.ac.kr', '콤', '간호학과', '10'
*/