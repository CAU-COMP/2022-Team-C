// DB read 이외 나머지 로직 처리
const { pool } = require("../config/database");
const provider = require("./provider");
const dao = require("./dao");

const crypto = require("crypto");
const {connect} = require("http2");


exports.createUser = async function (id, pw, email, name, dept) {
    try {
        // 아이디 중복 확인 
        const idRows = await provider.idCheck(id);
        if(idRows.length > 0)
            return;
        
        // 비밀번호 암호화
        const hashedPassword = await crypto
            .createHash("sha512")
            .update(pw)
            .digest("hex");

        const insertUserInfoParams = [id, hashedPassword, email, name, dept, 0];
        const connection = await pool.getConnection(async (conn) => conn);
        const userIdResult = await dao.insertUserInfo(connection, insertUserInfoParams);

        connection.release();
        return userIdResult;

    } catch (err) {
        console.log(err);
    }
};


exports.postSignIn = async function (id, pw) {
    try {
        // 아이디 중복 확인 
        const idRows = await provider.idCheck(id);
        if(idRows.length < 1)
            return;
        
        // 비밀번호 확인
        const hashedPassword = await crypto
            .createHash("sha512")
            .update(pw)
            .digest("hex");

        const selectUserParams = [id, hashedPassword];
        const connection = await pool.getConnection(async (conn) => conn);
        const userInfoResult = await dao.selectUserInfo(connection, selectUserParams);

        if(!userInfoResult[0])
            return;

        return userInfoResult[0];
            
    } catch (err) {
        console.log(err);
    }
};

exports.updateHits = async function(noteId){
    try{
        const connection = await pool.getConnection(async (conn) => conn);
        const updateHitsResult = await dao.updateNoteHits(connection, noteId);
        connection.release();

        return updateHitsResult;
        
    } catch(err){
        console.log(err.massage);
    }
}
