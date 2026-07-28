const ganache = require('ganache');
const { ethers } = require('ethers');
const solc = require('solc');
const source = `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
contract Voting {
    struct Vote { address voter; uint256 eventId; uint256 candidateId; uint256 timestamp; string encryptedData; }
    mapping(bytes32 => bool) public hasVoted;
    Vote[] public votes;
    event VoteCast(address indexed voter, uint256 indexed eventId, uint256 indexed candidateId, bytes32 voterKey, string encryptedData);
    function castVote(string calldata voterId, uint256 eventId, uint256 candidateId, string calldata encryptedData) external {
        bytes32 voterKey = keccak256(abi.encodePacked(voterId, eventId));
        require(!hasVoted[voterKey], 'Already voted for this event');
        hasVoted[voterKey] = true;
        votes.push(Vote(msg.sender, eventId, candidateId, block.timestamp, encryptedData));
        emit VoteCast(msg.sender, eventId, candidateId, voterKey, encryptedData);
    }
    function voteCount() external view returns (uint256) {
        return votes.length;
    }
    function voteAt(uint256 index) external view returns (address voter, uint256 eventId, uint256 candidateId, uint256 timestamp, string memory encryptedData) {
        Vote storage v = votes[index];
        return (v.voter, v.eventId, v.candidateId, v.timestamp, v.encryptedData);
    }
    function hasAlreadyVoted(string calldata voterId, uint256 eventId) external view returns (bool) {
        return hasVoted[keccak256(abi.encodePacked(voterId, eventId))];
    }
}
`;
(async() => {
  const input = { language: 'Solidity', sources: { 'Voting.sol': { content: source } }, settings: { outputSelection: { '*': { '*': ['abi','evm.bytecode'] } } } };
  const output = JSON.parse(solc.compile(JSON.stringify(input)));
  const contractData = output.contracts['Voting.sol'].Voting;
  const server = ganache.server({ logging: { quiet: true } });
  await server.listen(8546);
  const provider = new ethers.JsonRpcProvider('http://127.0.0.1:8546');
  const signer = await provider.getSigner(0);
  const factory = new ethers.ContractFactory(contractData.abi, contractData.evm.bytecode.object, signer);
  const contract = await factory.deploy();
  await contract.waitForDeployment();
  console.log('deployed', contract.target);
  const code = await provider.getCode(contract.target);
  console.log('code length', code.length);
  const tx = await contract.castVote('12345678', 1, 101, 'encrypted');
  await tx.wait();
  const count = await contract.voteCount();
  console.log('count', count.toString());
  const data = contract.interface.encodeFunctionData('voteAt', [0]);
  console.log('voteAt data', data);
  try {
    const callResult = await provider.call({ to: contract.target, data });
    console.log('raw call result', callResult);
  } catch (e) {
    console.error('raw provider.call error', e);
  }
  try {
    const res = await contract.voteAt(0);
    console.log('contract.voteAt', res);
  } catch (e) {
    console.error('contract.voteAt error', e);
  }
  await server.close();
})();
