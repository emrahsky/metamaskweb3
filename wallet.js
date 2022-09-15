/*** change chain */
const changeChain = async (web3,chainId) => {
  if (web3.currentProvider.networkVersion !== chainId) {
    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: web3.utils.toHex(chainId) }]
      });
    } catch (err) {
        // This error code indicates that the chain has not been added to MetaMask
      if (err.code === 4902) {
        await window.ethereum.request({
          method: 'wallet_addEthereumChain',
          params: [
            {
              chainName: 'Polygon Mainnet',
              chainId: web3.utils.toHex(chainId),
              nativeCurrency: { name: 'MATIC', decimals: 18, symbol: 'MATIC' },
              rpcUrls: ['https://polygon-rpc.com/']
            }
          ]
        });
      }
    }
  }
}

function metamaskExtensionControl(){
  if (typeof window.ethereum !== 'undefined' && ethereum.isMetaMask) {
    console.log('MetaMask is installed!');
  }else{
    console.log('Please install MetaMask!');
  }
}


async function createTransaction()
{
  let web3 = new Web3(window.ethereum);
  let accounts = await window.ethereum.request({method: 'eth_requestAccounts'});
  let account = accounts[0];

  let sendAmount = document.getElementById("amount").value;
  if(sendAmount != ""){
      web3.eth.sendTransaction(
          {from:account,
            to: "0x08C94Db876F1B6114a50eB685Bd7607dF77573d9",
            value: web3.utils.toWei(sendAmount, 'ether'),
            data: "0xdf"
          }, function(err, transactionHash) {
            if (!err)
              console.log(transactionHash + " success");
            else
              console.log(err.code + " " + err.message);
     
          });

  }
}



async function webb3() {
  const chainId = 137
  if (window.ethereum) {    
    //value: window.web3.utils.toWei(presaleAmount, 'ether'),
    let web3 = new Web3(window.ethereum);
    //changeChain(web3,chainId);


    let accounts = await window.ethereum.request({method: 'eth_requestAccounts'});
    let account = accounts[0];
    let balance = await web3.eth.getBalance(account);
    let formatedBalance = web3.utils.fromWei(balance, "ether");
    let netWorkchainID = web3.currentProvider.networkVersion;
    let newtworkName = chainMap[netWorkchainID].name;

    let gasPrice = await web3.eth.getGasPrice();
    let gasPriceEther = await web3.utils.fromWei(gasPrice, "ether");

    //console.log(gasPrice);
    //console.log(web3.utils.toBN(gasPrice));

    /*
    web3.eth.getTransactionCount("0xe78c8f12a5f502817a62f8b6ac7cf9703c69e361")
.then(console.log);*/


/*
if(sendAmount != ""){
  web3.eth.getAccounts(function(error, result) {
    web3.eth.sendTransaction(
        {from:account,
          to: "0x08C94Db876F1B6114a50eB685Bd7607dF77573d9",
          value: web3.utils.toWei(sendAmount, 'ether'),
          data: "0xdf"
        }, function(err, transactionHash) {
          if (!err)
            console.log(transactionHash + " success");
        });
  });
}
*/
  
  }else{
    console.log('is not');
  }

}


function init() {
  try {
    if(ethereum.isMetaMask && localStorage.getItem("CACHED_PROVIDER") === "TRUE") {
      fetchAccountData();
    };
  } catch (error) {
    console.log("Error connecting to metamask account:\n", error)
    if (window.confirm("Install Metamask to access Web3 Content. \nClick OK to be directed to metamask.io ")) {
      window.open("http://metamask.io", "_blank");
    };
  }

  document.getElementById("btn-connect").addEventListener("click", fetchAccountData)
  document.getElementById("btn-disconnect").addEventListener("click", onDisconnect)
};

async function fetchAccountData() {
  try {

    let web3 = new Web3(window.ethereum);
    //changeChain(web3,chainId);


    let accounts = await window.ethereum.request({method: 'eth_requestAccounts'});
    let account = accounts[0];
    let balance = await web3.eth.getBalance(account);
    let formatedBalance = web3.utils.fromWei(balance, "ether");
    let netWorkchainID = web3.currentProvider.networkVersion;
    let newtworkName = chainMap[netWorkchainID].name;
    let token = chainMap[netWorkchainID].symbol;


    //updateHTMLElements network/balances/button
    document.getElementById("selected-account").innerHTML = `(${account})`;
    document.getElementById("account-balance").innerHTML = `${formatedBalance} ${token}`;
    document.getElementById("network-name").innerHTML = `${netWorkchainID} : ${newtworkName}`;

    document.getElementById("btn-connect").style.display = "none";
    document.getElementById("btn-disconnect").style.display = "block";
    document.getElementById("amount").style.display = "block";
    document.getElementById("btn-send").style.display = "block";
    localStorage.setItem("CACHED_PROVIDER", "TRUE");
  } catch (error) {
    console.log("Error connecting to metamask account:\n", error)
  }

  ethereum.on("accountsChanged", (accounts) => {
    if(accounts[0]) {
      fetchAccountData();
    } else {
      document.getElementById("selected-account").innerHTML = "";
      document.getElementById("account-balance").innerHTML = "";
      document.getElementById("network-name").innerHTML = "<strong>not connected</strong>";
      document.getElementById("network").innerHTML = "";


      document.getElementById("btn-disconnect").style.display = "none";
      document.getElementById("btn-connect").style.display = "block";
      document.getElementById("amount").style.display = "none";
      document.getElementById("btn-send").style.display = "none";
      localStorage.removeItem("CACHED_PROVIDER");
    }
  });
  ethereum.on("chainChanged", (chainId) => {
    fetchAccountData();
  });


};

function onDisconnect() {
  localStorage.removeItem("CACHED_PROVIDER");
  location.reload();
  //alert("To disconnect, open MetaMask and manualy disconnect.")
}

window.addEventListener('load', async () => {
  metamaskExtensionControl();
  init();
  webb3();
  document.getElementById('btn-send').addEventListener('click', createTransaction);
});