// DB read 이외 나머지 로직 처리
const { pool } = require("../config/database");
const provider = require("./provider");
const dao = require("./dao");

const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const {connect} = require("http2");


exports.createUser = async function (id, pw, email, name, dept) {
    try {
        /*              // 아이디 중복 확인 
        const idRows = await userProvider.idCheck(ID);
        if(idRows.length > 0)
            return;
        */
        
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
        /* 
        // 이메일 여부 확인
        const idRows = await userProvider.idCheck(ID);
        if (idRows.length < 1) return errResponse(baseResponse.SIGNIN_ID_WRONG);

        // const selectId = idRows[0].ID;
        */

        // 비밀번호 확인
        const hashedPassword = await crypto
            .createHash("sha512")
            .update(pw)
            .digest("hex");

        const selectUserParams = [id, hashedPassword];
        const connection = await pool.getConnection(async (conn) => conn);
        const userInfoResult = await dao.selectUserInfo(connection, selectUserParams);

        return userInfoResult[0];
            
        /*
        const passwordRows = await userProvider.passwordCheck(selectUserPasswordParams);

        if (passwordRows[0].password !== hashedPassword) {
            return errResponse(baseResponse.SIGNIN_PASSWORD_WRONG);
        }
        // 계정 상태 확인
        const userInfoRows = await userProvider.accountCheck(ID);

        if(!userInfoRows[0])
            return errResponse(baseResponse.SIGNIN_NO_ACCOUNT);
        

        //토큰 생성 Service
        let token = await jwt.sign(
            {
                userId: id,
            }, // 토큰의 내용(payload)
            secret_config.jwtsecret, // 비밀키
            {
                expiresIn: "365d",
                subject: "userInfo",
            } // 유효 기간 365일
        );
        */
    } catch (err) {
        console.log(err);
    }
};

exports.updateHits = async function(noteId){
    try{
        // + note 존재 여부 확인
        const connection = await pool.getConnection(async (conn) => conn);
        await dao.updateNoteHits(connection, noteId);
        connection.release();

    } catch(err){
        console.log(err.massage);
    }
}
