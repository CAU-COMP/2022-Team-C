// DB 직접 접근

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


// 내 과목 새 필드 
async function selectNewNote(connection, userId){
    const selectNewNoteQuery = `
        SELECT M2.name, C.course_name as course, N.explanation, N.id
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
        SELECT M.name, C.course_name as course, N.explanation, N.id
        FROM note N, member M, course_detail C
        WHERE N.member_id = M.id and N.course_id = C.course_id
        ORDER BY hits desc;
    `;
    const [popularNoteRows] = await connection.query(selectPopularNoteQuery);
    return popularNoteRows;
}

// 필기 정보 조회
async function selectNote(connection, noteId) {      // 필기 쓴 유저 이름, 과목명, 업로드 일자, 포인트, 설명
    const noteInfoQuery = `
                  SELECT N.course_id, N.year, N.semester, N.instructor_name, N.upload_time, N.file, N.point, N.explanation, N.hits, 
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
    const courseIdListQuery = `
                  SELECT course_id as id
                  FROM course_detail
                  WHERE course_name = '${course_name}';
                  `;
    const [courseIdInfo] = await connection.query(courseIdListQuery);
    return courseIdInfo;
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




module.exports = {
    insertUserInfo,
    insertNoteInfo,
    selectUserInfo,
    selectUserId,
    selectNewNote,
    selectPopularNote,
    selectCourse,
    selectCourseID,

    selectNote,
    selectReview,
    updateNoteHits,
};
