// 유저 생성
async function insertUserInfo(connection, insertUserInfoParams) {
    const insertUserInfoQuery = `
        INSERT INTO member(id, password, email, name, dept_name, point)
        VALUES (?, ?, ?, ?, ?, ?);
    `;
    const insertUserInfoRow = await connection.query(
        insertUserInfoQuery,
        insertUserInfoParams
    );
    return insertUserInfoRow;
}

// 필기 생성
async function insertNoteInfo(connection, insertNoteInfoParams) {
    const insertNoteInfoQuery = `               
        INSERT INTO note(id, course_id, year, semester, instructor_name, member_id, upload_time, file, point, explanation, hits)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
    `;
    const insertNoteInfoRow = await connection.query(
        insertNoteInfoQuery,
        insertNoteInfoParams
    );
    return insertNoteInfoRow;
}

// 로그인 : 유저 정보 조회
async function selectUserInfo(connection, selectUserParams) {
    const selectUserQuery = `
        SELECT id, name, profile_url as profile, point
        FROM member
        WHERE id = ? AND password = ?;
    `;
    const selectUserRow = await connection.query(
        selectUserQuery,
        selectUserParams
    );
    return selectUserRow;
}

// 아이디로 회원 조회
async function selectUserId(connection, userId) {
    const selectUserIdQuery = `
        SELECT id
        FROM member
        WHERE id = '${userId}';
    `;
    const [idRows] = await connection.query(selectUserIdQuery, userId);
    return idRows;
}

// 회원 이메일 조회
async function selectUserEmail(connection, userId){
    const selectUserEmailQuery = `
        SELECT email
        FROM member
        WHERE id = '${userId}';
    `;
    const [emailRows] = await connection.query(selectUserEmailQuery, userId);
    return emailRows;
}

// 내 과목 새 필드 
async function selectNewNote(connection, userId){
    const selectNewNoteQuery = `
        SELECT M2.name, C.course_name as course, N.id
        FROM member M1, member M2, note N, interest I, course_detail C
        WHERE M1.id = '${userId}' and I.member_id = M1.id and I.course_id = N.course_id and N.member_id = M2.id and I.course_id = C.course_id
        ORDER BY upload_time desc;
    `;
    const [newNoteRows] = await connection.query(selectNewNoteQuery, userId);
    return newNoteRows;
}

// 인기 필드     ->      메인화면에 추가
async function selectPopularNote(connection){
    const selectPopularNoteQuery = `
        SELECT M.name, C.course_name as course, N.id
        FROM note N, member M, course_detail C
        WHERE N.member_id = M.id and N.course_id = C.course_id
        ORDER BY hits desc;
    `;
    const [popularNoteRows] = await connection.query(selectPopularNoteQuery);
    return popularNoteRows;
}

// 내 필드 조회
async function selectMyNote(connection, userId){
    const selectMyNoteQuery = `
        SELECT course_name as course, id
        FROM note natural join course_detail
        WHERE member_id = '${userId}';
    `;
    const [myNoteRows] = await connection.query(selectMyNoteQuery);
    return myNoteRows;
}

// 내 필드 리뷰 조회
async function selectMyNoteReview(connection, userId){      // 내 필드 리뷰     [과목 이름] : [코멘트] 
    const selectMyReviewQuery = `
        SELECT course_name as course, N.id, R.comment
        FROM note N, course_detail C, review R
        WHERE N.member_id = '${userId}' and N.id = R.note_id and C.course_id = N.course_id
        order by R.upload_time desc;
    `;
    const [myReviewRows] = await connection.query(selectMyReviewQuery);
    return myReviewRows;
}

// 내 필드 평점 조회
async function selectMyNoteRating(connection, userId){      // 내 필드 평균 평점
    const selectRatingQuery = `
        SELECT avg(R.rating) as avg
        FROM note N, course_detail C, review R
        WHERE N.member_id = '${userId}' and N.id = R.note_id and C.course_id = N.course_id;
    `;
    const [ratingRows] = await connection.query(selectRatingQuery);
    return ratingRows;
}

// 좋아요한 필드 조회
async function selectLikeNote(connection, userId){
    const selectLikeNoteQuery = `
        SELECT C.course_name as course, N.id, M.name
        FROM comp.note N, comp.course_detail C, comp.like L, comp.member M
        WHERE L.member_id = '${userId}' and L.note_id = N.id and N.course_id = C.course_id and M.id = N.member_id
        ORDER BY N.upload_time desc;
    `;
    const [likeRows] = await connection.query(selectLikeNoteQuery);
    return likeRows;
}

// 필기 정보 조회
async function selectNote(connection, noteId) {      // 필기 쓴 유저 이름, 과목명, 업로드 일자, 포인트, 설명
    const noteInfoQuery = `
        SELECT N.id, N.course_id, N.year, N.semester, N.instructor_name, N.upload_time, N.file, N.point, N.explanation, N.hits, 
        M.name, C1.dept_name, C1.classification, C2.course_name
        FROM note N natural join course C1, course_detail C2, member M
        WHERE N.id = '${noteId}' and N.member_id = M.id and N.course_id = C2.course_id;
    `;
    const [noteInfo] = await connection.query(noteInfoQuery);
    return noteInfo[0];
}

// 리뷰 정보 조회
async function selectReview(connection, noteId) {
    const reviewListQuery = `
        SELECT M.name, R.rating, R.comment
        FROM note N, review R, member M
        WHERE N.id = '${noteId}' and N.id = R.note_id and R.member_id = M.id;
    `;
    const [reviewInfo] = await connection.query(reviewListQuery);
    return reviewInfo;
}

// 과목 정보 조회
async function selectCourse(connection) {
    const courseListQuery = `
        SELECT course_name as name
        FROM course_detail;
    `;
    const [courseInfo] = await connection.query(courseListQuery);
    return courseInfo;
}

// 과목 코드 조회
async function selectCourseID(connection, course_name) {
    const courseIdQuery = `
        SELECT course_id as id
        FROM course_detail
        WHERE course_name = '${course_name}';
    `;
    const [courseIdInfo] = await connection.query(courseIdQuery);
    return courseIdInfo;
}

// 검색 결과 조회
async function selectSearch(connection, keyword) {          // 사용자 이름, 과목 이름, 필기 설명
    const searchQuery = `
        SELECT M.name, C.course_name as course, N.explanation, N.id
        FROM member M, note N natural join course_detail C
        WHERE N.course_id LIKE '%${keyword}%' or N.instructor_name LIKE '%${keyword}%' or C.course_name LIKE '%${keyword}%'
        and N.member_id = M.id;
    `;
    const [searchInfo] = await connection.query(searchQuery);
    return searchInfo;
}

// 조회수 증가
async function updateNoteHits(connection, noteId) {
    const updateHitsQuery = `
        UPDATE note
        SET hits = hits + 1
        WHERE id = '${noteId}';
    `;
    const updateHits = connection.query(updateHitsQuery, [noteId]);
    return updateHits[0];
}

// 회원정보 수정
async function updateMyInfo(connection, userId, name, email){
    const updateInfoQuery = `
        UPDATE member
        SET name = '${name}', email = '${email}'
        WHERE id = '${userId}';
    `;
    const updateInfo = connection.query(updateInfoQuery, []);
    return updateInfo[0];
}


module.exports = {
    insertUserInfo,
    insertNoteInfo,
    selectUserInfo,
    selectUserId,
    selectUserEmail,
    selectNewNote,
    selectPopularNote,
    selectMyNote,
    selectMyNoteReview,
    selectMyNoteRating,
    selectLikeNote,
    selectCourse,
    selectCourseID,
    selectSearch,

    selectNote,
    selectReview,
    updateNoteHits,
    updateMyInfo,
};
