// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Voting {
    mapping(address => bool) public voted;
    mapping(uint256 => uint256) public votes;

    event Voted(address indexed voter, uint256 indexed candidateId);

    function vote(uint256 candidateId) public {
        require(!voted[msg.sender], "Already voted");
        voted[msg.sender] = true;
        votes[candidateId] += 1;
        emit Voted(msg.sender, candidateId);
    }

    function getVotes(uint256 candidateId) public view returns (uint256) {
        return votes[candidateId];
    }
}
