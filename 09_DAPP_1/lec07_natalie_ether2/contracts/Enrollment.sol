pragma solidity ^0.5.4;

contract Enrollment{
    // The Admissions can be either Open or Closed
    enum State {OPEN, CLOSED}
    State public currentState;

    mapping (address => string) public enrolled;
    address public owner;
    
    modifier onlyOwner{
        // Verification Pattern
        require(msg.sender == owner,"Only the onwer can call this !!!");
        _;
    }
    
    modifier isAdmissionOpen{
        require(currentState == State.OPEN,"The Admissions are not Open currently. Please try later !");
        _;
    }
    
    constructor() public{
        owner = msg.sender;
    }
    
    function setStateOpen() public onlyOwner{
        currentState = State.OPEN;
    }
    
    function setStateClosed() public onlyOwner{
        currentState = State.CLOSED;
    }
    
    function enroll(string memory _name) public payable isAdmissionOpen{
        require(msg.value == 1000, "Enrollment Fee is 1000 Wei");
        enrolled[msg.sender] = _name;
    }

    function getEnrollmentName() public view returns(string memory){
        return enrolled[msg.sender];
    }

    function cancelEnrollment() public{
        require(keccak256(abi.encodePacked(enrolled[msg.sender])) != keccak256(abi.encodePacked("")),"You are not enrolled, cannot get refund");
        
        // Withdrawal pattern
        enrolled[msg.sender] = "";
        msg.sender.transfer(500);
    }
}