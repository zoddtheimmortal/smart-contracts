// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract SimpleBank{
    mapping(address => uint) private balances;

    function deposit() public payable {
        require(msg.value > 0, "Deposit amount must be greater than 0");
        balances[msg.sender] += msg.value;
    }

    function withdraw(uint _amount) public {
        require(_amount > 0, "Withdraw amount must be greater than 0");
        require(balances[msg.sender] >= _amount, "Insufficient balance");
        balances[msg.sender] -= _amount;
        payable(msg.sender).transfer(_amount);
    }

    function getBalance() public view returns(uint){
        return balances[msg.sender];
    }
}