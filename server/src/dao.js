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

// 로그인 : 유저 정보 조회
async function selectUserInfo(connection, selectUserParams) {
    const selectUserQuery = `
          SELECT id, password
          FROM member
          WHERE id = ? AND password = ?;`;
    const selectUserRow = await connection.query(
        selectUserQuery,
        selectUserParams
    );
    return selectUserRow;
}


// 메인화면 조회
async function selectMain(connection, userId){
    const mainListQuery = `
                  SELECT name, point
                  FROM member
                  WHERE id = '${userId}';
                  `;
    const [infoRows] = await connection.query(mainListQuery);
    return infoRows;
}

// 내 과목 새 필드      ->      메인화면에 추가
// 오늘의 인기 필드     ->      메인화면에 추가


// 필기 정보 조회
async function selectNote(connection, noteId){      // 필기 쓴 유저 이름, 과목명, 업로드 일자, 포인트, 설명
    const noteInfoQuery = `
                  SELECT N.course_id, N.year, N.semester, N.instructor_name, N.upload_time, N.file_url, N.point, N.point, N.explanation, N.hits, 
                  M.name, C1.dept_name, C1.classification, C2.course_name
                  FROM note N natural join course C1, course_detail C2, member M
                  WHERE N.id = '${noteId}' and N.member_id = M.id and N.course_id = C2.course_id;
                  `;
    const [noteInfo] = await connection.query(noteInfoQuery);
    return noteInfo;
}

// 리뷰 정보 조회
async function selectReview(connection, noteId){
    const reviewListQuery = `
                  SELECT M.name, R.rating, R.comment, avg(rating)
                  FROM note N, review R, member M
                  WHERE N.id = '${noteId}' and N.id = R.note_id and R.member_id = M.id;
                  `;
    const [reviewInfo] = await connection.query(reviewListQuery);
    return reviewInfo;
}

// 조회수 증가
async function updateNoteHits(connection, noteId){
    const updateHitsQuery = `
                  UPDATE note
                  SET hits = hits + 1
                  WHERE id = '${noteId}';
                  `;
    connection.query(updateHitsQuery, [noteId]);
}

module.exports = {
    insertUserInfo,
    selectUserInfo,
    selectMain,
    selectNote,
    selectReview,
    updateNoteHits,
};
