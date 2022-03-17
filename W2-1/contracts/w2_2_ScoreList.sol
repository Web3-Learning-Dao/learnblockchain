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

    struct StudentDetails{
        string studentFirstName;
        string studentLastName;
        uint256 id; 
    }

    struct Score{
        uint256 studentId;
        uint256 englishMarks;
        uint256 mathsMarks;
        uint256 sciencemarks; 
    }

    mapping(uint => StudentDetails) students;

    mapping(uint => Score) scores;

    event studentAdded (string _studentFirstName, string _studentLastName, uint256 _studentId);

    event studentScoresRecorded(uint256 _studentId, uint256 _englishMarks, uint256 _mathsMarks, uint _sciencemarks);

    function addStudentDetails (string memory _studentFirstName, string memory _studentLastName) public onlyClassTeacher(msg.sender){
        StudentDetails storage studentObj = students[studentCount];
        studentObj.studentFirstName = _studentFirstName;
        studentObj.studentLastName = _studentLastName;
        studentObj.id = studentCount;
        emit studentAdded(_studentFirstName, _studentLastName, studentCount);
        studentCount++;
    } 

    function addStudentScores (uint256 _studentId, 
                                uint256 _englishMarks, 
                                uint256 _mathsMarks, 
                                uint256 _sciencemarks ) public onlyClassTeacher(msg.sender){
        Score storage scoreObject = scores[_studentId];

        scoreObject.englishMarks = _englishMarks;
        scoreObject.mathsMarks = _mathsMarks;
        scoreObject.sciencemarks = _sciencemarks;
        scoreObject.studentId = _studentId;
        emit studentScoresRecorded(_studentId, _englishMarks, _mathsMarks, _sciencemarks);
    } 
}