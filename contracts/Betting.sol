pragma solidity ^0.5.0;

contract Betting {

  struct Player{
    uint playerWinCount;
    uint playerWinAmount;
    uint playerLossCount;
    uint playerLossAmount;
  }
  
  mapping (address => Player) players;



    function greenOrRed() private view returns (bool) {
        uint result = uint(blockhash(block.number-1))%2;
        if(result == 1){
          return true;
        } else{
          return false;
        }
    }
      function winOrLose(bool color, bool result) public pure returns (bool) {
          if(color == result){
            return true;
          }
          else {
            return false;
          }
      }

      function bet(bool color) external payable returns (bool) {
        require(msg.sender.balance > msg.value, "Insufficient funds");
        bool result = greenOrRed();

        bool win = winOrLose(color, result);
        if (win) {
            // Player won 
            msg.sender.transfer(msg.value * 2); 
            players[msg.sender].playerWinCount++;
            players[msg.sender].playerWinAmount+=msg.value;
            //emit playerWon(players[msg.sender].wins,players[msg.sender].losses);
            return (true);
        } else {
            players[msg.sender].playerLossCount++;
            players[msg.sender].playerLossAmount+=msg.value;
            //emit playerLost(players[msg.sender].wins,players[msg.sender].losses);
            return (false);
        }
    }

    function getPlayerInfo() external view returns(uint[4] memory) {
        Player memory player_info = players[msg.sender];
        uint[4] memory result = [player_info.playerWinCount,player_info.playerLossCount,player_info.playerWinAmount,player_info.playerLossAmount];
        return result;
    }
}


