// DB read 로직 처리
const { pool } = require("../config/database");
const dao = require("./dao");


exports.retrieveMain = async function (userId){
    const connection = await pool.getConnection(async (conn) => conn);
    const userMain = await dao.selectMain(connection, userId);
  
    connection.release();
  
    return userMain;
}

exports.retrieveNote = async function(noteId){
    const connection = await pool.getConnection(async (conn) => conn);
    const noteInfo = await dao.selectNote(connection, noteId);

    connection.release();

    return noteInfo;
}

exports.retrieveReview = async function(noteId){
    const connection = await pool.getConnection(async (conn) => conn);
    const reviewInfo = await dao.selectReview(connection, noteId);

    connection.release();

    return reviewInfo;
}