// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import "@openzeppelin/contracts/utils/cryptography/MerkleProof.sol";

interface IMintableToken {
    function mint(address to, uint256 amount) external;
}

contract MerkleAirdropUpgradeable is 
    Initializable,
    AccessControlUpgradeable,
    UUPSUpgradeable
{
    bytes32 public constant ADMIN_ROLE = DEFAULT_ADMIN_ROLE;

    bytes32 public merkleRoot;
    mapping(address => bool) public hasClaimed;

    IMintableToken public token;

    event MerkleRootUpdated(bytes32 newMerkleRoot);
    event AirdropClaimed(address indexed user, uint256 amount);

    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor() {
        _disableInitializers();
    }

    function initialize(address tokenAddress, address admin) public initializer {
        __AccessControl_init();
        __UUPSUpgradeable_init();

        token = IMintableToken(tokenAddress);
        _grantRole(ADMIN_ROLE, admin);
    }

    function _authorizeUpgrade(address newImplementation) internal override onlyRole(ADMIN_ROLE) {}

    function setMerkleRoot(bytes32 _root) external onlyRole(ADMIN_ROLE) {
        merkleRoot = _root;
        emit MerkleRootUpdated(_root);
    }

    function claim(uint256 amount, bytes32[] calldata proof) external {
        require(!hasClaimed[msg.sender], "Already claimed");

        bytes32 leaf = keccak256(abi.encodePacked(msg.sender, amount));
        require(MerkleProof.verify(proof, merkleRoot, leaf), "Invalid proof");

        hasClaimed[msg.sender] = true;
        token.mint(msg.sender, amount);

        emit AirdropClaimed(msg.sender, amount);
    }
}
