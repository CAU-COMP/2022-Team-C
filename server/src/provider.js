// DB read 로직 처리
const { pool } = require("../config/database");
const dao = require("./dao");

exports.retrieveCourse = async function (){
    const connection = await pool.getConnection(async (conn) => conn);
    const course = await dao.selectCourse(connection);
  
    connection.release();
  
    return course;
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


exports.retrieveReview = async function(noteId){
    const connection = await pool.getConnection(async (conn) => conn);
    const reviewInfo = await dao.selectReview(connection, noteId);

    connection.release();

    return reviewInfo;
}

exports.idCheck = async function (userId) {
    const connection = await pool.getConnection(async (conn) => conn);
    const idCheckResult = await dao.selectUserId(connection, userId);
    connection.release();
  
    return idCheckResult;
};
  