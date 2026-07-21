const ganache = require('ganache');
const { ethers } = require('ethers');
const fs = require('fs');
const path = require('path');

let provider;
let signer;
let contract;
let contractAddress = null;

const contractSource = `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Voting {
    struct Vote {
        address voter;
        uint256 candidateId;
        uint256 timestamp;
        string encryptedData;
    }

    mapping(bytes32 => bool) public hasVoted;
    Vote[] public votes;

    event VoteCast(address indexed voter, uint256 indexed candidateId, bytes32 indexed voterKey, string encryptedData);

    function castVote(string calldata voterId, uint256 candidateId, string calldata encryptedData) external {
        bytes32 voterKey = keccak256(abi.encodePacked(voterId));
        require(!hasVoted[voterKey], "Already voted");
        hasVoted[voterKey] = true;
        votes.push(Vote(msg.sender, candidateId, block.timestamp, encryptedData));
        emit VoteCast(msg.sender, candidateId, voterKey, encryptedData);
    }

    function voteCount() external view returns (uint256) {
        return votes.length;
    }

    function voteAt(uint256 index) external view returns (address voter, uint256 candidateId, uint256 timestamp, string memory encryptedData) {
        Vote storage v = votes[index];
        return (v.voter, v.candidateId, v.timestamp, v.encryptedData);
    }

    function hasAlreadyVoted(string calldata voterId) external view returns (bool) {
        return hasVoted[keccak256(abi.encodePacked(voterId))];
    }
}
`;

const abi = [
  'function castVote(string calldata voterId, uint256 candidateId, string calldata encryptedData) external',
  'function voteCount() external view returns (uint256)',
  'function voteAt(uint256 index) external view returns (address,uint256,uint256,string)',
  'function hasAlreadyVoted(string calldata voterId) external view returns (bool)',
];

async function initChain() {
  const server = ganache.server({ logging: { quiet: true } });
  await server.listen(8545);
  provider = new ethers.JsonRpcProvider('http://127.0.0.1:8545');
  signer = await provider.getSigner(0);

  const solc = require('solc');
  const input = {
    language: 'Solidity',
    sources: { 'Voting.sol': { content: contractSource } },
    settings: { outputSelection: { '*': { '*': ['abi', 'evm.bytecode'] } } },
  };
  const output = JSON.parse(solc.compile(JSON.stringify(input)));
  const contractData = output.contracts['Voting.sol'].Voting;
  const factory = new ethers.ContractFactory(contractData.abi, contractData.evm.bytecode.object, signer);
  contract = await factory.deploy();
  await contract.waitForDeployment();
  contractAddress = contract.target;
  console.log('Ganache started and contract deployed at', contractAddress);
}

async function castVote(voterId, candidateId, encryptedData) {
  if (!contract) throw new Error('Chain is not initialized');
  const tx = await contract.castVote(voterId, candidateId, encryptedData);
  await tx.wait();
  return tx;
}

async function isVoted(voterId) {
  if (!contract) throw new Error('Chain is not initialized');
  return contract.hasAlreadyVoted(voterId);
}

async function getResults() {
  if (!contract) throw new Error('Chain is not initialized');
  const count = await contract.voteCount();
  const votes = [];
  for (let i = 0; i < Number(count); i += 1) {
    const [voter, candidateId, timestamp, encryptedData] = await contract.voteAt(i);
    votes.push({ voter, candidateId: Number(candidateId), timestamp: Number(timestamp), encryptedData });
  }
  return votes;
}

module.exports = { initChain, castVote, isVoted, getResults, contractAddress };
