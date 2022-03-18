//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

contract ScoreList{

    uint256 studentCount = 0;
    address public classTeacher;

    constructor() {
        classTeacher = msg.sender;
    }

    modifier onlyClassTeacher(address _classTeacher) {
        require(classTeacher == _classTeacher, "Only the class teacher has access to this function");
        _;
    }

    struct Score{
        uint256 englishMarks;
        uint256 mathsMarks;
        uint256 sciencemarks; 
    }

    struct StudentDetails{
        string studentFirstName;
        string studentLastName;
        uint256 studentId; 
        Score score;
    }

    //多老师地址
    mapping(address => bool) public teacherAddr;
    //学生分数数据
    mapping(address => StudentDetails) studentsScores;

    event studentAdded (string _studentFirstName, string _studentLastName, uint256 _studentId);

    event studentScoresRecorded(uint256 _studentId, uint256 _englishMarks, uint256 _mathsMarks, uint _sciencemarks);

    function addStudentDetails (address addr, string memory _studentFirstName, string memory _studentLastName) public onlyClassTeacher(msg.sender){
        StudentDetails storage studentObj = studentsScores[addr];
        studentObj.studentFirstName = _studentFirstName;
        studentObj.studentLastName = _studentLastName;
        studentObj.studentId = studentCount;
        emit studentAdded(_studentFirstName, _studentLastName, studentCount);
        studentCount++;
    } 

    function setStudentScores (address addr, 
                                uint256 _englishMarks, 
                                uint256 _mathsMarks, 
                                uint256 _sciencemarks ) public onlyClassTeacher(msg.sender){
        Score storage scoreObject = studentsScores[addr].score;

        scoreObject.englishMarks = _englishMarks;
        scoreObject.mathsMarks = _mathsMarks;
        scoreObject.sciencemarks = _sciencemarks;

        emit studentScoresRecorded(studentsScores[addr].studentId, _englishMarks, _mathsMarks, _sciencemarks);
    } 
}