// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

interface IScore {

    function setStudentScores (address addr, 
                                uint256 _englishMarks, 
                                uint256 _mathsMarks, 
                                uint256 _sciencemarks ) external;
}

contract Teacher {
    //学生合约地址
    IScore public score;

    constructor(IScore _scoreAddr) {
        score = _scoreAddr;
    }

    //老师修改学生分数
    function teacherSetStudentScore(address addr,  uint256 _englishMarks,  uint256 _mathsMarks, uint256 _sciencemarks ) public {
        score.setStudentScores( addr,   _englishMarks,  _mathsMarks, _sciencemarks );
    }
}