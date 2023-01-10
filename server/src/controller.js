const provider = require("./provider");
const service = require("./service");

exports.getUpload = async function (req, res) {
    
    if (!req.session.name)
        return res.redirect("/");
    const userData = { 'name': req.session.name, 'profile': req.session.profile, 'point': req.session.point };

    const course = await provider.retrieveCourse();

    return res.render("upload/main.ejs", { 'course': course, 'user': userData });
}

exports.getNote = async function (req, res) {
    const noteId = req.params.noteId;
    
    if (!req.session.name)
        return res.redirect("/");
    const userData = { 'name': req.session.name, 'profile': req.session.profile, 'point': req.session.point };

    const noteByNoteId = await provider.retrieveNote(noteId);               // 좌측
    if (!noteByNoteId)
        return res.redirect("/main");

    const reviewByNoteId = await provider.retrieveReview(noteId);           // 우측
    const hits = await service.updateHits(noteId);                      // 조회수 증가

    return res.render("notes/main.ejs", { 'note': noteByNoteId, 'review': reviewByNoteId, 'user': userData });
}

exports.getMain = async function (req, res) {
    if (!req.session.name)
        return res.redirect("/");

    const userData = { 'name': req.session.name, 'profile': req.session.profile, 'point': req.session.point };

    const newNote = await provider.retrieveNewNote(req.session.userId);             // 내 과목 새 필드
    const popularNote = await provider.retrievepopularNote();                       // 인기 필드

    return res.render("memberMain/main.ejs", { 'user': userData, 'newNote': newNote, 'popularNote': popularNote });
}

exports.getMyField = async function (req, res) {
    if (!req.session.name)
        return res.redirect("/");
    const userData = { 'name': req.session.name, 'profile': req.session.profile, 'point': req.session.point };
    
    const myNote = await provider.retrieveMyNote(req.session.userId);       // 내 필기 가져오기

    return res.render("myField/main.ejs", { 'user': userData, 'myNote': myNote });
}

exports.getSearch = async function (req, res) {

    const { key } = req.query;

    if(!req.session.name){
        if(key == "") 
            return res.render("search/main.ejs", { 'result': null, keyword : "" });
        
        const searchResult = await provider.retrieveSearch(key);

        if(!searchResult)
            return res.render("search/main.ejs", { 'result': null, keyword : "" });

        return res.render("search/main.ejs", { 'result': searchResult, keyword : key });
    }
    else{
        const userData = { 'name': req.session.name, 'profile': req.session.profile, 'point': req.session.point };
        if(key == "") {
            return res.render("search/memberMain.ejs", { 'user': userData, 'result': null, keyword : "" });
        }
        const searchResult = await provider.retrieveSearch(key);
        if(!searchResult)
            return res.render("search/memberMain.ejs", { 'user': userData, 'result': null, keyword : key });

        return res.render("search/memberMain.ejs", { 'user': userData, 'result': searchResult, keyword : key });
    }
}

exports.keyWord = async function (req, res) {

    if(!req.body)
        return res.redirect("/search?key=" +"");

    const { keyword } = req.body;
    if(keyword == undefined)
        return res.redirect("/search?key=" + "");

    return res.redirect("/search?key=" + keyword);
}

exports.getChangeInfo = async function (req, res) {      
    if (!req.session.name)
        return res.redirect("/");

    if(!req.query.name){
        const email = await provider.retrieveEmail(req.session.userId);
        const userData = { 'name': req.session.name, 'profile': req.session.profile, 'point': req.session.point, 'id': req.session.userId, 'email': email };
    
        return res.render("changeInfo/main.ejs", { 'user': userData });
    }
    else {
        const { name, email } = req.query;

        const updateInfo = await service.updateInfo(req.session.userId, name, email);

        req.session.name = name;
        return res.redirect("/main");
    }
}

exports.getMyInfo = async function (req, res) {                                             ///// 마이페이지 수정 필요
    if (!req.session.name)
        return res.redirect("/");
    const userData = { 'name': req.session.name, 'profile': req.session.profile, 'point': req.session.point };
    
    const myNoteReview = await provider.retrieveMyReview(req.session.userId);   // 내 필드 리뷰
    const myNoteRating = await provider.retrieveRating(req.session.userId);     // 내 필드 평점 평균
    const myNoteCount = await provider.retrieveMyNote(req.session.userId);      // 내가 작성한 필드
    const likeNote = await provider.retrieveLikeNote(req.session.userId);       //좋아요 표시한 필드 

    return res.render("myPage/main.ejs", { 'user': userData, 'review': myNoteReview, 'rating': myNoteRating, 
        'count':myNoteCount.length, 'like':likeNote });
}

exports.getSignIn = async function (req, res) {

    if (!req.session.name)
        return res.render("sign/signIn.ejs");
    else
        return res.redirect("/main");
}

exports.signIn = async function (req, res) {

    const { id, pw } = req.body;

    if (!id || !pw)
        return res.redirect("/signIn");

    const signInService = await service.postSignIn(id, pw);

    if (!signInService || !signInService[0])            // 로그인 실패
        return res.redirect("/signIn");
    if (signInService[0].id == id) {     // 로그인 성공
        req.session.userId = signInService[0].id;
        req.session.name = signInService[0].name;
        req.session.profile = signInService[0].profile;
        req.session.point = signInService[0].point;

        return res.redirect("/main");
    }
}

exports.signUp = async function (req, res) {

    const { id, pw, email, name, dept } = req.body;           // Body: id, pw, email, name, dept

    if (!id || !pw || !email || !name || !dept) {
        return res.redirect("/signUp");
    }

    const signUpService = await service.createUser(
        id, pw, email, name, dept
    );
    if (!signUpService)
        return res.redirect("/signUp");

    return res.redirect("/");
};

exports.uploadNote = async function (req, res) {
    let file_name;
    if (!req.file)                                          // 한글 깨짐 수정
        return res.redirect("/field");
    else
        file_name = req.file.filename;

    const { lecture, year, semester, instructor, dept, type, explanation, point } = req.body;
    if (!lecture || !year || !semester || !instructor || !dept || !type || !explanation || !point) {
        return res.redirect("/field");
    }

    const course_id = await provider.retrieveCourseID(lecture);

    if(!course_id)
        return res.redirect("/field");           // course_detail로 과목 코드 가져오기
 
    const member_id = req.session.userId;

    const today = new Date();
    const y = today.getFullYear();
    const m = ('0' + (today.getMonth() + 1)).slice(-2);
    const d = ('0' + today.getDate()).slice(-2);
    const hours = ('0' + today.getHours()).slice(-2); 
    const minutes = ('0' + today.getMinutes()).slice(-2);
    const seconds = ('0' + today.getSeconds()).slice(-2); 
    const dateString = y + '-' + m  + '-' + d;
    const timeString = hours + ':' + minutes  + ':' + seconds;
    const upload_time = dateString + " " + timeString;

    const id = y * 100000000 + m * 1000000 + d * 10000 + Math.floor((Math.random(Date.now()) * 1000));
    
    const uploadService = await service.createNote(
        id, course_id, year, semester, instructor, member_id, upload_time, file_name, point, explanation
    );

    if (!uploadService)
        return res.redirect("/field");

    return res.redirect("/main");
}

exports.logout = async function (req, res) {

    if (!req.session.name)          // 세션 정보가 존재하는 경우
        return res.redirect("/");
    else {
        await req.session.destroy(function (err) {
            return res.redirect("/");
        })
    }
}