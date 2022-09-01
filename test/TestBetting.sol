pragma solidity ^0.5.0;

import "truffle/Assert.sol";
import "truffle/DeployedAddresses.sol";
import "../contracts/Betting.sol";

contract TestBetting {
 Betting betting = Betting(DeployedAddresses.Betting());


  function testWinOrLoseTrue() public {
    bool returnedValue = betting.winOrLose(true,true);
    Assert.equal(returnedValue, true, "If guessed color is same as the random color output should be true");
  }
  function testWinOrLoseFalse() public {
    bool returnedValue = betting.winOrLose(true,false);
    Assert.equal(returnedValue, false, "If guessed color is not the same as the random color output should be true");
  }
}
