// DB read 로직 처리
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
  
exports.idCheck = async function (userId) {
    const connection = await pool.getConnection(async (conn) => conn);
    const idCheckResult = await dao.selectUserId(connection, userId);
    connection.release();
  
    return idCheckResult;
};
  