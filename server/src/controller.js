// 받은 데이터가 유효한지 확인
const provider = require("./provider");
const service = require("./service");

exports.getUpload = async function (req, res) {

    const userData = { 'name': req.session.name, 'profile': req.session.profile, 'point': req.session.point };
    if (!req.session.name)
        return res.redirect("/");

    const course = await provider.retrieveCourse();

    return res.render("upload/main.ejs", { 'course': course, 'user': userData });
}

exports.getNote = async function (req, res) {
    const noteId = req.params.noteId;

    const userData = { 'name': req.session.name, 'profile': req.session.profile, 'point': req.session.point };
    if (!req.session.name)
        return res.redirect("/");

    const noteByNoteId = await provider.retrieveNote(noteId);               // 좌측
    if (!noteByNoteId)
        return res.redirect("/test");

    const reviewByNoteId = await provider.retrieveReview(noteId);           // 우측
    const hits = await service.updateHits(noteId);                      // 조회수 증가

    return res.render("notes/main.ejs", { 'note': noteByNoteId, 'review': reviewByNoteId, 'user': userData });
}

exports.getMain = async function (req, res) {

    const userData = { 'name': req.session.name, 'profile': req.session.profile, 'point': req.session.point };
    if (!req.session.name)
        return res.redirect("/");

    const newNote = await provider.retrieveNewNote(req.session.userId);             // 내 과목 새 필드
    const popularNote = await provider.retrievepopularNote();     // 인기 필드

    return res.render("member_main/main.ejs", { 'user': userData, 'newNote': newNote, 'popularNote': popularNote });
}

exports.getSignIn = async function (req, res) {

    if (!req.session.name)
        return res.render("sign/signIn.ejs");
    else
        return res.redirect("/test");
}

exports.signIn = async function (req, res) {

    const { id, pw } = req.body;

    if (!id || !pw)
        return res.redirect("/signIn");

    const signInService = await service.postSignIn(id, pw);

    if (!signInService)            // 로그인 실패
        return res.redirect("/signIn");
    if (signInService[0].id == id) {     // 로그인 성공
        req.session.userId = signInService[0].id;
        req.session.name = signInService[0].name;
        req.session.profile = signInService[0].profile;
        req.session.point = signInService[0].point;

        return res.redirect("/test");
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

    return res.redirect("/test");
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




/*
'cau2023', 'password456', 'cau2023@cau.ac.kr', '김1', '전자전기공학부', '15'
'comp1234', 'helloworld12', 'comp1234@cau.ac.kr', '고', '경제학부', '30'
'gominzip', 'mypw789', 'gominzip@cau.ac.kr', '김2', '경영학부', '25'
'hnnynh', 'pwpw2023', 'hnnynh@cau.ac.kr', '한', '소프트웨어학부', '35'
'puang2', 'abcd1234', 'puang2@cau.ac.kr', '콤', '간호학과', '10'
*/