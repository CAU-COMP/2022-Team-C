// 받은 데이터가 유효한지 확인
const provider = require("./provider");
const service = require("./service");

exports.uploadNote = async function(req, res){

    const userData = {'name':req.session.name, 'profile':req.session.profile, 'point':req.session.point};
    if(!req.session.name)
        return res.redirect("/");
    
    const course = await provider.retrieveCourse();
    
    return res.render("upload/main.ejs", {'course': course, 'user': userData});
}

exports.getNote = async function(req, res){
    const noteId = req.params.noteId;

    const userData = {'name':req.session.name, 'profile':req.session.profile, 'point':req.session.point};
    if(!req.session.name)
        return res.redirect("/");

    const noteByNoteId = await provider.retrieveNote(noteId);               // 좌측
    if(!noteByNoteId)
        return res.redirect("/test");

    const reviewByNoteId = await provider.retrieveReview(noteId);           // 우측
    const hits = await service.updateHits(noteId);                      // 조회수 증가

    return res.render("notes/main.ejs", {'note': noteByNoteId, 'review': reviewByNoteId, 'user': userData});
}

exports.getMain = async function(req, res){
    
    const userData = {'name':req.session.name, 'profile':req.session.profile, 'point':req.session.point};
    if(!req.session.name)
        return res.redirect("/");

    const newNote = await provider.retrieveNewNote(req.session.userId);             // 내 과목 새 필드
    const popularNote = await provider.retrievepopularNote();     // 인기 필드

    return res.render("member_main/main.ejs", {'user': userData, 'newNote': newNote, 'popularNote': popularNote});
}

exports.signUp = async function (req, res) {

    const {id, pw, email, name, dept} = req.body;           // Body: id, pw, email, name, dept

    if(!id || !pw || !email || !name || !dept){
        return res.redirect("/signUp");
    }
    
    const signUpService = await service.createUser(
        id, pw, email, name, dept
    );
    if(!signUpService)
        return res.redirect("/signUp");

    return res.redirect("/");
};

exports.getSignIn = async function(req, res){

    if(!req.session.name)
        return res.render("sign/signIn.ejs");
    else
        return res.redirect("/test"); 
}

exports.signIn = async function(req, res){

    const {id, pw} = req.body; 

    if(!id || !pw)
        return res.redirect("/signIn");
    
    const signInService = await service.postSignIn(id, pw);

    if(!signInService[0])            // 로그인 실패
        return res.redirect("/signIn");
    if(signInService[0].id == id) {     // 로그인 성공
        req.session.userId = signInService[0].id;
        req.session.name = signInService[0].name;
        req.session.profile = signInService[0].profile;
        req.session.point = signInService[0].point;

        return res.redirect("/test");
    }
}

exports.logout = async function(req, res){

    if (!req.session.name)          // 세션 정보가 존재하는 경우
        return res.redirect("/"); 
    else{
        await req.session.destroy(function (err) {
            return res.redirect("/");
        })
    }       
}

/*
'cau2023', 'password456', 'cau2023@cau.ac.kr', '김1', '전자전기공학부', '15'
'comp1234', 'helloworld12', 'comp1234@cau.ac.kr', '고', '경제학부', '30'
'gominzip', 'mypw789', 'gominzip@cau.ac.kr', '김2', '경영학부', '25'
'hnnynh', 'pwpw2023', 'hnnynh@cau.ac.kr', '한', '소프트웨어학부', '35'
'puang2', 'abcd1234', 'puang2@cau.ac.kr', '콤', '간호학과', '10'
*/