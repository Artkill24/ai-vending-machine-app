// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

contract RewardsDistributor is Ownable, ReentrancyGuard {
    IERC20 public usdc;
    
    mapping(address => uint256) public pendingRewards;
    mapping(address => uint256) public totalEarned;
    mapping(address => uint256) public totalClaimed;
    
    mapping(address => string) public userReferralCode;
    mapping(string => address) public referralCodeToAddress;
    mapping(address => address) public referrer;
    mapping(address => uint256) public referralCount;
    
    event RewardEarned(address indexed user, uint256 amount, string reason);
    event RewardClaimed(address indexed user, uint256 amount);
    event ReferralRegistered(address indexed user, address indexed referrer, string code);
    event ReferralReward(address indexed referrer, address indexed referred, uint256 amount);
    
    constructor(address _usdc) Ownable(msg.sender) {
        usdc = IERC20(_usdc);
    }
    
    function registerReferralCode(string memory code) external {
        require(bytes(userReferralCode[msg.sender]).length == 0, "Code already set");
        require(referralCodeToAddress[code] == address(0), "Code taken");
        
        userReferralCode[msg.sender] = code;
        referralCodeToAddress[code] = msg.sender;
    }
    
    function setReferrer(string memory code) external {
        require(referrer[msg.sender] == address(0), "Referrer already set");
        address referrerAddress = referralCodeToAddress[code];
        require(referrerAddress != address(0), "Invalid code");
        require(referrerAddress != msg.sender, "Cannot refer yourself");
        
        referrer[msg.sender] = referrerAddress;
        referralCount[referrerAddress]++;
        
        emit ReferralRegistered(msg.sender, referrerAddress, code);
    }
    
    function addReward(address user, uint256 amount, string memory reason) external onlyOwner {
        pendingRewards[user] += amount;
        totalEarned[user] += amount;
        
        emit RewardEarned(user, amount, reason);
        
        address userReferrer = referrer[user];
        if (userReferrer != address(0)) {
            uint256 referralReward = (amount * 10) / 100;
            pendingRewards[userReferrer] += referralReward;
            totalEarned[userReferrer] += referralReward;
            
            emit ReferralReward(userReferrer, user, referralReward);
        }
    }
    
    function claimRewards() external nonReentrant {
        uint256 amount = pendingRewards[msg.sender];
        require(amount > 0, "No rewards to claim");
        require(usdc.balanceOf(address(this)) >= amount, "Insufficient contract balance");
        
        pendingRewards[msg.sender] = 0;
        totalClaimed[msg.sender] += amount;
        
        require(usdc.transfer(msg.sender, amount), "Transfer failed");
        
        emit RewardClaimed(msg.sender, amount);
    }
    
    function getUserRewards(address user) external view returns (
        uint256 pending,
        uint256 earned,
        uint256 claimed,
        string memory refCode,
        address userReferrer,
        uint256 refCount
    ) {
        return (
            pendingRewards[user],
            totalEarned[user],
            totalClaimed[user],
            userReferralCode[user],
            referrer[user],
            referralCount[user]
        );
    }
    
    function withdrawUSDC(uint256 amount) external onlyOwner {
        require(usdc.transfer(owner(), amount), "Transfer failed");
    }
    
    function fundContract(uint256 amount) external {
        require(usdc.transferFrom(msg.sender, address(this), amount), "Transfer failed");
    }
}
