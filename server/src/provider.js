const { pool } = require("../config/database");
const dao = require("./dao");

exports.retrieveCourse = async function (){
    const connection = await pool.getConnection(async (conn) => conn);
    const course = await dao.selectCourse(connection);
  
    connection.release();
  
    return course;
}

exports.retrieveCourseID = async function (course_name){
    const connection = await pool.getConnection(async (conn) => conn);
    const course_id = await dao.selectCourseID(connection, course_name);
  
    connection.release();
  
    return course_id[0].id;
}

exports.retrieveNote = async function(noteId){
    const connection = await pool.getConnection(async (conn) => conn);
    const noteInfo = await dao.selectNote(connection, noteId);

    connection.release();

    return noteInfo;
}

exports.retrieveNewNote = async function(userId){
    const connection = await pool.getConnection(async (conn) => conn);
    const newNoteInfo = await dao.selectNewNote(connection, userId);

    connection.release();

    return newNoteInfo;
}

exports.retrievepopularNote = async function(){
    const connection = await pool.getConnection(async (conn) => conn);
    const popularNoteInfo = await dao.selectPopularNote(connection);
    
    connection.release();

    return popularNoteInfo;
}

exports.retrieveMyNote = async function(userId){
    const connection = await pool.getConnection(async (conn) => conn);
    const myNoteInfo = await dao.selectMyNote(connection, userId);
    
    connection.release();

    return myNoteInfo;
}

exports.retrieveLikeNote = async function(userId){
    const connection = await pool.getConnection(async (conn) => conn);
    const likeNote = await dao.selectLikeNote(connection, userId);
    
    connection.release();

    return likeNote;
}

exports.retrieveReview = async function(noteId){
    const connection = await pool.getConnection(async (conn) => conn);
    const reviewInfo = await dao.selectReview(connection, noteId);

    connection.release();

    return reviewInfo;
}

exports.retrieveSearch = async function (keyword) {
    const connection = await pool.getConnection(async (conn) => conn);
    const searchResult = await dao.selectSearch(connection, keyword);
    connection.release();
  
    return searchResult;
};

exports.retrieveEmail = async function (userId) {
    const connection = await pool.getConnection(async (conn) => conn);
    const emailResult = await dao.selectUserEmail(connection, userId);
    connection.release();
    
    return emailResult[0].email;
};

exports.retrieveMyReview = async function(userId){
    const connection = await pool.getConnection(async (conn) => conn);
    const myReviewResult = await dao.selectMyNoteReview(connection, userId);
    connection.release();
    
    return myReviewResult;
};

exports.retrieveRating = async function(userId){
    const connection = await pool.getConnection(async (conn) => conn);
    const ratingResult = await dao.selectMyNoteRating(connection, userId);
    connection.release();

    return ratingResult[0].avg;
};

  
exports.idCheck = async function (userId) {
    const connection = await pool.getConnection(async (conn) => conn);
    const idCheckResult = await dao.selectUserId(connection, userId);
    connection.release();
  
    return idCheckResult;
};
  