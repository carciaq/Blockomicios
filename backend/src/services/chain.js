const ganache = require('ganache');
const { ethers } = require('ethers');
const fs = require('fs');
const path = require('path');

let provider;
let signer;
let contract;
let contractAddress = null;
let ganacheServer = null;

const contractSource = `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Voting {
    struct Vote {
        address voter;
        uint256 eventId;
        uint256 candidateId;
        uint256 timestamp;
    }

    mapping(bytes32 => bool) public hasVoted;
    Vote[] public votes;

    event VoteCast(address indexed voter, uint256 indexed eventId, uint256 indexed candidateId, bytes32 voterKey, string encryptedData);

    function castVote(string calldata voterId, uint256 eventId, uint256 candidateId, string calldata encryptedData) external {
        bytes32 voterKey = keccak256(abi.encodePacked(voterId, eventId));
        require(!hasVoted[voterKey], "Already voted for this event");
        hasVoted[voterKey] = true;
        votes.push(Vote(msg.sender, eventId, candidateId, block.timestamp));
        emit VoteCast(msg.sender, eventId, candidateId, voterKey, encryptedData);
    }

    function voteCount() external view returns (uint256) {
        return votes.length;
    }

    function voteAt(uint256 index) external view returns (address voter, uint256 eventId, uint256 candidateId, uint256 timestamp) {
        Vote storage v = votes[index];
        return (v.voter, v.eventId, v.candidateId, v.timestamp);
    }

    function hasAlreadyVoted(string calldata voterId, uint256 eventId) external view returns (bool) {
        return hasVoted[keccak256(abi.encodePacked(voterId, eventId))];
    }
}
`;

const abi = [
  'function castVote(string calldata voterId, uint256 eventId, uint256 candidateId, string calldata encryptedData) external',
  'function voteCount() external view returns (uint256)',
  'function voteAt(uint256 index) external view returns (address,uint256,uint256,uint256)',
  'function hasAlreadyVoted(string calldata voterId, uint256 eventId) external view returns (bool)',
];

async function initChain() {
  if (ganacheServer) {
    await ganacheServer.close();
    ganacheServer = null;
  }

  const server = ganache.server({ logging: { quiet: true } });
  try {
    await server.listen(0);
  } catch (err) {
    if (server) {
      try {
        await server.close();
      } catch (_) {
        // ignore
      }
    }
    throw new Error(`Failed to start Ganache server: ${err.message}`);
  }

  ganacheServer = server;
  const address = server.address && server.address();
  const port = address && address.port ? address.port : 8545;
  const endpoint = `http://127.0.0.1:${port}`;

  provider = new ethers.JsonRpcProvider(endpoint);
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
  console.log('Ganache started and contract deployed at', contractAddress, 'via', endpoint);
}

async function castVote(voterId, eventId, candidateId, encryptedData) {
  if (!contract) throw new Error('Chain is not initialized');
  const tx = await contract.castVote(voterId, eventId, candidateId, encryptedData);
  await tx.wait();
  return tx;
}

async function isVoted(voterId, eventId) {
  if (!contract) throw new Error('Chain is not initialized');
  return contract.hasAlreadyVoted(voterId, eventId);
}

async function getResults() {
  if (!contract) throw new Error('Chain is not initialized');
  const count = await contract.voteCount();
  const votes = [];
  for (let i = 0; i < Number(count); i += 1) {
    const [voter, eventId, candidateId, timestamp] = await contract.voteAt(i);
    votes.push({
      voter,
      eventId: Number(eventId),
      candidateId: Number(candidateId),
      timestamp: Number(timestamp),
    });
  }
  return votes;
}

async function stopChain() {
  if (ganacheServer) {
    await ganacheServer.close();
    ganacheServer = null;
  }
}

function getContractAddress() {
  return contractAddress;
}

module.exports = { initChain, stopChain, castVote, isVoted, getResults, getContractAddress };
