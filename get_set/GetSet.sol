// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract GetSet {
    uint256 private value;

    function get() public view returns (uint256) {
        return value;
    }

    function set(uint256 _value) public {
        value = _value;
    }
}