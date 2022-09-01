const redButton = document.getElementById('red-button');
const greenButton = document.getElementById('green-button');
const metamaskButton = document.getElementById('metamask-button');
const placeBetButton = document.getElementById('bet-button');
const betValueInput = document.getElementById('bet-value');

var betChoice = null;

function isNumeric(str) {
    if (typeof str != "string") return false 
    return !isNaN(str) 
  }

betValueInput.onkeyup = () => {
    if(!isNumeric(betValueInput.value)){
        alert("BET VALUE CAN ONLY BE DIGITS !!!");
        betValueInput.value = "";
    }
    console.log(betValueInput.value)
}

redButton.onclick = () =>{
    document.body.style.backgroundColor = "red";
    betChoice = false;
};


greenButton.onclick = () =>{
    document.body.style.backgroundColor = "green";
    betChoice = true;
};


var contracts = {};
var web3;
var web3Provider;

metamaskButton.onclick = async () => {
    console.log("ss")
    if (window.ethereum) {
        web3Provider = window.ethereum;
        try {
            await window.ethereum.enable();
        } catch (error) {
            console.error("User denied account access")
        }
        console.log("window.ethereum")
    }
    else if (window.web3) {
        web3Provider = window.web3.currentProvider;
        console.log("window.web3")
    }
    else {
        web3Provider = new Web3.providers.HttpProvider('http://localhost:7545');
        console.log("window.localhost")
    }
    web3 = new Web3(web3Provider);

    initContract();
}

console.log(1)

const initContract = () => {
    $.getJSON('Betting.json', function(data) {
        var BettingArtifact = data;
        contracts.Betting = TruffleContract(BettingArtifact);
        contracts.Betting.setProvider(web3Provider);
    });
    console.log("initContract");
    console.log(contracts);
    getPlayerInfo();
}

placeBetButton.onclick  = () => {
    console.log(betChoice);
    var betInstance;
    if(betChoice == null){
        alert("Please Choose a color.")
        return;
    }
    web3.eth.getAccounts(function(error, accounts) {
        if (error) {
        console.log(error);
        }
        console.log(accounts)
        var account = accounts[0];
  
        contracts.Betting.deployed().then(function(instance) {
        betInstance = instance;    
        return betInstance.bet(betChoice, {from: account, value: parseInt(betValueInput.value+"000000000000000000")});
        }).then(function(result) {
            console.log("res")
            console.log(result);
            getPlayerInfo();
        }).catch(function(err) {
        console.log(err);
        });
  });

}

const updatePlayerInfo = (info) => {
    document.getElementById('win-count').innerHTML = info[0].c[0];
    document.getElementById('loss-count').innerHTML = info[1].c[0];
    document.getElementById('win-amount').innerHTML = info[2].c[0]/10000;
    document.getElementById('loss-amount').innerHTML = info[3].c[0]/10000;
}

const getPlayerInfo = () =>{ 
    web3.eth.getAccounts(function(error, accounts) {
        if (error) {
        console.log(error);
        }
        console.log(accounts)
        var account = accounts[0];
  
        contracts.Betting.deployed().then(function(instance) {
        betInstance = instance;    
        return betInstance.getPlayerInfo({from: account});
        }).then(function(result) {
            console.log("res")
            console.log(result);
            updatePlayerInfo(result);
        }).catch(function(err) {
        console.log(err);
        });
    });

}