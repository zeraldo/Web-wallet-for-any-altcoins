var CURRENT_COIN = 'SWIFT';
var PARAMS = {
	'SWIFT': {
		coingecko: 'swiftcash',
		coinjs: cc.bitcoin,
		network: cc.bitcoin.networks.swiftcash,
		qrColor: '3875CE',
		minFee: 0.002,
		maxFee: 0.2,
		txFee: 0.002,
		explorer: 'https://explorer.swiftcash.cc/',
		donation: 'SXPKYzdxm97MhVZ8goyGmEB74q2jZiVcj4',
		unspentApi: 'https://explorer.swiftcash.cc/api/unspent/',
		sendApi: 'https://explorer.swiftcash.cc/api/pushtx/',
		sendTxHex: 'tx_hex',
		sendTxid1: 'txid',
		unspentTxid: 'txid',
		unspentOutput: 'output',
		unspentValue: 'value',
		unspentDivision: 1
	}
};

$(function() {
    $.ajax({
          url: 'https://explorer.swiftcash.cc/api/info',
          cache: false
    }).done(function(result) {
          hodlBestRate = result.hodlbestrate;
          $("#jackpot").text(result.lotteryjackpot.toLocaleString("en", { minimumFractionDigits: 0, maximumFractionDigits: 0, }));
          $("#hodl12").text((Number(result.hodlbestrate)*100).toFixed(2) + '%');
    });
});

function intToByteArray(int) {
    var byteArray = [0];
    if (int > 8388607) byteArray = [0, 0, 0, 0];
    else if (int > 32767) byteArray = [0, 0, 0];
    else if (int > 127) byteArray = [0, 0];

    for ( var index = 0; index < byteArray.length; index++ ) {
        var byte = int & 0xff;
        byteArray [ index ] = byte;
        int = (int - byte) / 256 ;
    }

    return byteArray;
}

window.Clipboard = (function(window, document, navigator) {
    var textArea,
        copy;

    function isOS() {
        return navigator.userAgent.match(/ipad|iphone/i);
    }

    function createTextArea(text) {
        textArea = document.createElement('textArea');
        textArea.value = text;
        document.body.appendChild(textArea);
    }

    function selectText() {
        var range,
            selection;

        if (isOS()) {
            range = document.createRange();
            range.selectNodeContents(textArea);
            selection = window.getSelection();
            selection.removeAllRanges();
            selection.addRange(range);
            textArea.setSelectionRange(0, 999999);
        } else {
            textArea.select();
        }
    }

    function copyToClipboard() {
        document.execCommand('copy');
        document.body.removeChild(textArea);
    }

    copy = function(text) {
        createTextArea(text);
        selectText();
        copyToClipboard();
    };

    return {
        copy: copy
    };
})(window, document, navigator);

var donation=0;
var scanner;
var qrIdToFill;
function openQrModal(param) {
  qrIdToFill = param;
  scanner = new Instascan.Scanner({ video: document.getElementById('qrScannerPreview') });

  scanner.addListener('scan', function (content) {
    scanner.stop();
    $('#' + qrIdToFill).val(content);
    $('#' + qrIdToFill).change();
    $('#modalQrCode').modal('toggle');
  });

  Instascan.Camera.getCameras().then(function (cameras) {
    if (cameras.length > 1) {
      scanner.start(cameras[1]);
    } else if(cameras.length > 0) {
      scanner.start(cameras[0]);
    } else {
      $('#modalQrCode').modal('toggle');
      alert('No cameras found.');
    }
  }).catch(function (e) {
    console.error(e);
  });

  $('#modalQrCode').modal('toggle');
}

function closeQrModal() {
  scanner.stop();
}

function eyeFunction(id) {
  var x = document.getElementById(id);
  if (x.type === "password") {
    x.type = "text";
  } else {
    x.type = "password";
  }
}

var passphrase="";
var hashedPass="";
var loginPrivkey="";
var keyPair="";
function hashit(hash, callback) {
  for(i=0; i<100*1440; i++) {
    hash = cc.bitcoin.crypto.keccak256(hash+passphrase);
    hash = hash.toString("hex");
  }

  hashedPass = hash;
  callback(hash);
}

function switchCoin(whichCoin) {
  $("#addr-qr").attr("src", "./images/qrloader.gif");
  setTimeout(switchCoinNow, 100, whichCoin);
}

function switchCoinNow(whichCoin) {
  CURRENT_COIN = whichCoin;

  var cLogos = document.getElementsByClassName("currency-logo");
  for(i=0; i<cLogos.length; i++) {
     var title = cLogos[i].title;

     if(title != whichCoin) {
        cLogos[i].style.filter = "none";
     } else {
	cLogos[i].style.filter = "drop-shadow(1px 1px 2px #4b4b4c)";
     }
  }

  if(whichCoin != loginPrivkey) {
     var d = new cc.bigi.fromBuffer(hashedPass);
     keyPair = new PARAMS[CURRENT_COIN].coinjs.ECPair(d, null, { network: PARAMS[CURRENT_COIN].network });
  } else {
     keyPair = PARAMS[CURRENT_COIN].coinjs.ECPair.fromWIF(hashedPass, PARAMS[CURRENT_COIN].network);
  }

  if(whichCoin == "SWIFT") {
     $("#address").attr("placeholder", "SWIFT address, Lottery or HODLx");
     $("#mainL").removeAttr("disabled");
     $("#mainH").removeAttr("disabled");
  } else {
     $("#address").attr("placeholder", whichCoin + " address");
     $("#mainL").attr("disabled", "disabled");
     $("#mainH").attr("disabled", "disabled");
  }

  $("#amount").attr("placeholder", "Amount of " + whichCoin + " to send");
  $("#address").val("");
  $("#amount").val("");
  $("#mainR").click();
  loadAddress();
}

function login() {
 
  // Login with email + password
  //var passphrase = localStorage.getItem('recoverphrase');
  passphrase = localStorage.getItem('recoverphrase');
  // alert(passphrase);
  var hash = cc.bitcoin.crypto.keccak256(passphrase);
  $('#email').prop("disabled", true);
  $('#password').prop("disabled", true);
  $('#signin').prop("disabled", true);
  $('#privlogintoggle').prop("disabled", true);
  $("#loginprogress").show();
  $("form[role='login']").click();
  setTimeout(hashit, 1000, hash.toString("hex"), function(hashed) {
    var d = new cc.bigi.fromBuffer(hashed);
    keyPair = new PARAMS[CURRENT_COIN].coinjs.ECPair(d, null, { network: PARAMS[CURRENT_COIN].network });
    loadAddress();
  });
}

function loadAddress() {
  $("#addr-balance-refresh").prop("disabled", true);
  $('#addr-balance').html('Balance: 0.00000000 ' + CURRENT_COIN);
  $("#addr-balance").css("color", "#74bed8");
  $("#pwd-container").hide();
  $("#addr-container").show();
  $("#addr-qr").attr("src", "https://qr-generator.qrcode.studio/qr/custom?download=false&file=png&data=" + keyPair.getAddress() + "&size=400&config=%7B%22body%22%3A%22rounded-pointed%22%2C%22eye%22%3A%22frame6%22%2C%22eyeBall%22%3A%22ball6%22%2C%22erf1%22%3A%5B%22fv%22%5D%2C%22gradientColor1%22%3A%22%23" + PARAMS[CURRENT_COIN].qrColor + "%22%2C%22gradientColor2%22%3A%22%23" + PARAMS[CURRENT_COIN].qrColor + "%22%2C%22gradientType%22%3A%22radial%22%2C%22gradientOnEyes%22%3A%22true%22%2C%22logo%22%3A%22%22%7D");
  $("#addr-qr").attr("alt", keyPair.getAddress());
  $("#addr-id-clipboard").attr("data-clipboard-text", keyPair.getAddress());
  $("#addr-id").attr("href", PARAMS[CURRENT_COIN].explorer + "address/" + keyPair.getAddress());
  $("#addr-id").html(keyPair.getAddress());
  changeAddress = keyPair.getAddress();
  donation = 0;
  refresh();
}

function refresh() {
  $.ajax({
    url: PARAMS[CURRENT_COIN].unspentApi + keyPair.getAddress() + '?unspentOnly=true',
    type: "GET",
    dataType: "json",
    data: {
    },
    success: function (result) {
        loadAddressTxes(result);
	$("#addr-balance-refresh").prop("disabled", false);
	$("#addr-balance").css("color", "");
    },
    error: function () {
        console.log("error");
	$("#addr-balance-refresh").prop("disabled", false);
    }
  });
}

var USD = false;
var usdBalance = false;
var balance=0;
var hodlBestRate=0;
var hodlRate=0;
var isHODLing=0;
var changeAddress="";
var utxos=[];
function loadAddressTxes(result) {
  var sum = 0;
  var F1 = PARAMS[CURRENT_COIN].unspentArray1;
  var F2 = PARAMS[CURRENT_COIN].unspentArray2;

  if(F1 && F2) {
     utxos = result[F1][F2];
  } else if(F1) {
     utxos = result[F1];
  } else { utxos=result; }

  for(i in utxos) {
    sum += Number(utxos[i][PARAMS[CURRENT_COIN].unspentValue]/PARAMS[CURRENT_COIN].unspentDivision);
  } balance = sum;

  USD = false;
  usdBalance = false;
  $('#addr-balance').html('Balance: ' + balance.toFixed(8) + ' ' + CURRENT_COIN);
}

function _setTooltip(message, classId) {
  $(classId)
    .attr('data-original-title', message)
    .tooltip('show');
  }

function _hideTooltip(classId) {
  setTimeout(function() {
    $(classId).attr('data-original-title', '').tooltip('hide');
  }, 1000);
}

function modifyTheChangeAddress() {
  var result = prompt('Enter a custom change address:', changeAddress);
  if(result) {
    try {
      PARAMS[CURRENT_COIN].coinjs.address.toOutputScript(result, PARAMS[CURRENT_COIN].network);
      changeAddress = result;
    } catch(e) { alert("Please enter a valid address!"); return; }
  }
}

function donate() {
  var result = prompt('Enter an amount to donate:', donation);
  if(!isNaN(result)) { donation = Number(result); }
  else alert(result + " is not a valid amount!");
}

function changeTheFee() {
  var minFee = PARAMS[CURRENT_COIN].minFee;
  var maxFee = PARAMS[CURRENT_COIN].maxFee
  var txFee = PARAMS[CURRENT_COIN].txFee;
  var result = prompt('Enter a custom fee:', txFee);
  if(Number(result) >= minFee && Number(result) <= maxFee) {
    PARAMS[CURRENT_COIN].txFee = Number(result);
  } else if(result != null) {
      if(Number(result) < minFee) alert("Minimum transaction fee allowed is " + minFee + " " + CURRENT_COIN + "!");
      else if(Number(result) > maxFee) alert("Maximum transaction fee allowed is " + maxFee + " " + CURRENT_COIN + "!");
      else alert(result + " is not a valid fee!");
  }
}

function togglePrice() {
  if(balance > 0 && !USD && !usdBalance) {
    $.ajax({
        url: 'https://api.coingecko.com/api/v3/simple/price?ids=' + PARAMS[CURRENT_COIN].coingecko + '&vs_currencies=usd',
        type: "GET",
        dataType: "json",
        data: {
      },
      success: function (result) {
        USD = true;
	var usdPrice = Number(result[PARAMS[CURRENT_COIN].coingecko].usd);
        usdBalance = balance * usdPrice;
        $("#addr-balance").html("Balance: $" + usdBalance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + " US");
      },
      error: function () {
        console.log("error");
        $("#addr-balance-refresh").prop("disabled", false);
      }
    });
  } else if(!USD && usdBalance) {
     USD = true;
     $("#addr-balance").html("Balance: $" + usdBalance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + " US");
  } else if(!USD && !usdBalance) {
     USD = true;
     $("#addr-balance").html("Balance: $0.00 US");
  } else if(USD) {
     USD = false;
     $("#addr-balance").html("Balance: " + balance.toFixed(8) + " " + CURRENT_COIN);
  }
}

function copyPrivateKey() {
    
      Clipboard.copy(keyPair.toWIF());
      setTimeout(_setTooltip, 200, "Copied!", ".privkey");
      setTimeout(_hideTooltip, 200, ".privkey");
	  $("#privatkey").val(keyPair.toWIF());	
	  
      
  }

function rsvs(radio) {
  isHODLing = false;
  switch(radio.value) {
    case 'R':
        $("#addr-spend").hide();
        $("#addr-receive").show();
        break;
    case 'S':
        $("#submit").html("SEND");
        $("#addr-spend").show();
        $("#addr-receive").hide();
        $("#address").val("");
        $("#address").removeAttr("disabled");
        break;
    case 'L':
        $("#submit").html("PLAY");
        $("#addr-spend").show();
        $("#addr-receive").hide();
        $("#address").val("Lottery");
        $("#address").attr("disabled", "disabled");
        break;
    case 'H':
        isHODLing = true;
        $("#submit").html("HODL");
        $("#addr-spend").show();
        $("#addr-receive").hide();
        $("#address").attr("disabled", "disabled");

        var nMonths = 0;
        while(nMonths < 1 || nMonths > 12) {
          nMonths = prompt("Enter the number of months to HODL(1-12): ");
          if(nMonths == null) {
             iHODLing = false;
             $("#mainR").click();
             setTimeout( function() {
                $('#mainH').removeClass("active");
             }, 10);
             break;
          }

          if(nMonths && nMonths >=1 && nMonths <= 12) {
             const APR = 100 * hodlBestRate * (1 - ((12-nMonths)*0.07));
             const FINAL = nMonths * APR / 12;
             hodlRate = FINAL;
             $("#address").val("HODL"+nMonths + " {APR: " + APR.toFixed(2) + "%, F: +" + FINAL.toFixed(2) + "%}");
          } else { alert("Enter a number between 1-12."); }
        }
        break;
  }
}

function amountChanged(amount) {
  if(!isHODLing) return;
  const a = Number(amount);
  var fAmount = a + (a*hodlRate)/100; fAmount *= 0.999;
  var FINAL = fAmount.toFixed(2);
  if (amount == "") { FINAL = hodlRate.toFixed(2) + "%" }
  var newVal = $("#address").val().split(",")[0] + ", F: " + FINAL + "}";
  $("#address").val(newVal);
}

var tx; // global variable for the transaction

function spendf() {
  var amount = Number(localStorage.getItem('amount'));
  const FEE = PARAMS[CURRENT_COIN].txFee + donation;
  //if(balance < FEE || SWIFT(amount+FEE) > balance) { alert("Insufficient funds! Minimum network fee is " + FEE + " " + CURRENT_COIN + "."); return; }
  if(11111 < FEE || SWIFT(amount+FEE) > 11111) { return; }

  // Validate the address
  var address = localStorage.getItem('address');
  if (address != "Lottery" && !address.startsWith("HODL")) {
      try {
        PARAMS[CURRENT_COIN].coinjs.address.toOutputScript(localStorage.getItem('address'), PARAMS[CURRENT_COIN].network);
      } catch(e) { localStorage.setItem("erros", "Endereço invalido"); window.location.href = 'dashboard.html';}
  } else if (CURRENT_COIN != "SWIFT") {
      alert("Lottery and/or HODL transactions only work for SWIFT!"); return;
  }

  // Disable the elements in the form
  $('#address').prop("disabled", true);
  $('#amount').prop("disabled", true);
  $('#submit').prop("disabled", true);
  
  $('#sendprogress1').show();
  $('.progressbara1').show();
  $('.mainweb1').hide();
  
  // Create the transaction
  tx = new PARAMS[CURRENT_COIN].coinjs.TransactionBuilder(PARAMS[CURRENT_COIN].network);

  // Add all the available input(s)
  for(i in utxos) {
     tx.addInput(utxos[i][PARAMS[CURRENT_COIN].unspentTxid], utxos[i][PARAMS[CURRENT_COIN].unspentOutput]);
  }
 $.ajax({
  url: 'https://explorer.swiftcash.cc/api/info',
  type: "GET",
  dataType: "json",
  data: {
 },
  success: function (inforesult) {
  // Add the output
  if (address == "Lottery") {
    var nDrawWithin = inforesult.blocks % 5000;
    if (nDrawWithin >= 4960 || nDrawWithin <= 40) {
        alert("You can't buy lottery tickets within 40 blocks of each draw, sorry!");
        return;
    } else if (amount < 0.01) {
        alert("Minimum lottery ticket is 0.01 SWIFT!");
        return;
    }

    var data = cc.Buffer("Lottery");

    var opRet = PARAMS[CURRENT_COIN].coinjs.script.compile(
    [
      PARAMS[CURRENT_COIN].coinjs.opcodes.OP_RETURN,
      data
    ]);

    tx.addOutput(opRet, Math.ceil(amount*100000000));
  } else if (address.startsWith("HODL")) {
        createHODLRewardsTx(address.split(" ")[0], amount, inforesult);
  } else {
    tx.addOutput($("#address").val(), Math.ceil(amount*100000000));
  }

  // Add the change (if any)
  var change = SWIFT(balance - amount - FEE);
  if (change > 0) {
    // Try to avoid dusting in the SwiftCash blockchain
    if (CURRENT_COIN == "SWIFT" && change < 1 &&
        confirm("Change is less than 1 SWIFT! To avoid dusting the SwiftCash blockchain, press OK to donate it. Thank you!")) {
      donation = change;
      change = 0;
    } else
      tx.addOutput(changeAddress, Math.ceil(change*100000000));
  }

  // Add the donation output (if any)
  if (donation > 0) {
    tx.addOutput(PARAMS[CURRENT_COIN].donation, Math.ceil(donation*100000000));
  }

  // Sign all the inputs
  for (i=0; i<utxos.length; i++) {
    tx.sign(i, keyPair);
  }

  $.ajax({
    url: PARAMS[CURRENT_COIN].sendApi,
    type: "POST",
    dataType: "json",
    data: PARAMS[CURRENT_COIN].sendTxHex+"=" + tx.build().toHex(),
    success: function (result) {
	var T1 = PARAMS[CURRENT_COIN].sendTxid1;
	var T2 = PARAMS[CURRENT_COIN].sendTxid2;
	var txid = '';

	if(T1 && T2 && result && result[T1]) txid = result[T1][T2];
	else if(T1 && result) txid = result[T1];

	if (txid && (typeof txid === 'string' || txid instanceof String)) {
	   USD = false;
	   usdBalance = false;
	   if(change > 0 && ( changeAddress == keyPair.getAddress() )) {
		var p1 = PARAMS[CURRENT_COIN].unspentTxid;
		var p2 = PARAMS[CURRENT_COIN].unspentOutput;
		var p3 = PARAMS[CURRENT_COIN].unspentValue;
		utxos = [{[p1]: txid, [p2]: 1, [p3]: change*PARAMS[CURRENT_COIN].unspentDivision}];
		balance = change;
	   } else { utxos = []; balance = 0; }

	   $('#addr-balance').html("Balance: " + balance.toFixed(8) + " " + CURRENT_COIN);
           setTimeout( function() {
	      window.open(PARAMS[CURRENT_COIN].explorer + "tx/" + txid);
           }, 1000);
           //alert("Transaction was broadcasted successfully!");
		   localStorage.setItem("erros", "Transferencia enviado!");  window.location.href = 'dashboard.html';
	} else {
	   console.log(result);
	   alert("Broadcast failed! Check debug console for details!");
	}

	$('#address').prop("disabled", false).val("");
	$('#amount').prop("disabled", false).val("");
	$('#vusd').prop("disabled", false).val("");
	//$('#submit').prop("disabled", false).html("SEND");
	$('#sendprogress').hide();
	$('#conteudo').load('dashboard1.html');
    },
    error: function (error) {
        $('#address').prop("disabled", false).val("");
        $('#amount').prop("disabled", false).val("");
        $('#submit').prop("disabled", false).html("SEND");
        $('#sendprogress').hide();
	alert("Houve um erro, tentando novamente");
        console.log(error);
    }
  });
  },
   error: function () {
    localStorage.setItem("erros", "Sem conexao com a rede");
	window.location.href = 'dashboard.html';
  }
 });
}

function createHODLRewardsTx(address, amount, result) {
  var months = parseInt(address.substr(4));
  if (isNaN(months)) {
      alert("Invalid x in HODLx: x must be 1-12. Try HODL1, HODL2, ... or HOLD12!");
      return;
  }

  var redeemScript = cc.bitcoin.script.compile(
  [
    cc.Buffer.from(intToByteArray(result.blocks + months*30*144 + 12)),
    cc.bitcoin.opcodes.OP_CHECKLOCKTIMEVERIFY,
    cc.bitcoin.opcodes.OP_DROP,
    keyPair.getPublicKeyBuffer(),
    cc.bitcoin.opcodes.OP_CHECKSIG
  ]);

  var opRet = cc.bitcoin.script.compile(
  [
    cc.bitcoin.opcodes.OP_RETURN,
    redeemScript
  ]);

  var rate = result.hodlbestrate*months/12;
  rate -= rate * (12 - months) * 0.07;
  var HODLRewards = (amount * rate)*0.999;
  var scriptPubKey = cc.bitcoin.script.scriptHash.output.encode(cc.bitcoin.crypto.hash160(redeemScript));
  var p2sh = cc.bitcoin.address.fromOutputScript(scriptPubKey, cc.bitcoin.networks.swiftcash);
  tx.addOutput(p2sh, (Math.ceil(amount*100000000) + Math.ceil(HODLRewards*100000000) - 10000000));
  tx.addOutput(opRet, 10000000);
}

function sendProgress(status) {
  var btnText = $("#submit").html();

  if(status=="sending") {
    if(!btnText.endsWith("!")) btnText += ".";
    if(btnText.endsWith("......")) btnText = "SEND";
    $("#submit").html(btnText);
    setTimeout(sendProgress, 1000, status);
  } else {
    $("#submit").html(status);
    setTimeout(enableSendForm, 1000);
  }
}

function enableSendForm() {
  $('#address').prop("disabled", false).val("");
  $('#amount').prop("disabled", false).val("");
  $('#submit').prop("disabled", false).html("SEND");
}

function SWIFT(a) {
  return Number(a.toFixed(8));
}
/*
function accept() {
  Cookies.set('termsAccepted', '1');
}
*/
function copyWholeBalance() {
  const FEE = PARAMS[CURRENT_COIN].txFee + donation;
  if(balance - FEE > 0) {
     $('#amount').val(SWIFT(balance - FEE));
     amountChanged(balance - FEE);
  }
}

jQuery(document).ready(function() {
  // PWA Service Worker
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('../service-worker.js').catch(function(err) {
      console.log(err);
    });
  }

  // Warning
 /* if (Cookies.get('termsAccepted') == null) {
    $('#modalWarning').modal('show');
  }
*/
  // Private key login
  $('#privlogintoggle').click(function() {
   var state = $('#privlogintoggle').attr('aria-pressed');
   if(state == "false") {
    $('#email').val("");
    $('#email').prop("disabled", true);
    $('#password').prop("placeholder", "Private Key");
    $('#btnPasswordQR').show();
    $('#btnPasswordEye').hide();
   } else {
    $('#email').prop("disabled", false);
    $('#password').prop("placeholder", "Password");
    $('#btnPasswordQR').hide();
    $('#btnPasswordEye').show();
   }
  });

  // Copying to clipboard - Tooltip
  $('.clipboard').tooltip({
    trigger: 'click',
    placement: 'bottom'
  });

  function setTooltip(message) {
    $('.clipboard')
      .attr('data-original-title', message)
      .tooltip('show');
  }

  function hideTooltip() {
    setTimeout(function() {
      $('.clipboard').tooltip('hide');
    }, 1000);
  }

  // Clipboard
  var clipboard = new ClipboardJS('.clipboard');

  clipboard.on('success', function(e) {
    setTooltip('Copied!');
    hideTooltip();
  });

  clipboard.on('error', function(e) {
    setTooltip('Failed!');
    hideTooltip();
  });

  "use strict";
  var options = {};
  options.ui = {
    container: "#pwd-container",
    showVerdictsInsideProgressBar: true,
    viewports: {
      progress: ".pwstrength_viewport_progress",
      errors: ".pwstrength_viewport_errors"
    }
  };
  options.common = {
    debug: false,
    onLoad: function() {
      $('#messages').text('Start typing password');
    }
  };
  $(':password').pwstrength(options);
});


(function (jQuery) {
// Source: src/rules.js




var rulesEngine = {};

try {
    if (!jQuery && module && module.exports) {
        var jQuery = require("jquery"),
            jsdom = require("jsdom").jsdom;
        jQuery = jQuery(jsdom().parentWindow);
    }
} catch (ignore) {}

(function ($, rulesEngine) {
    "use strict";
    var validation = {};

    rulesEngine.forbiddenSequences = [
        "0123456789", "abcdefghijklmnopqrstuvwxyz", "qwertyuiop", "asdfghjkl",
        "zxcvbnm", "!@#$%^&*()_+"
    ];

    validation.wordNotEmail = function (options, word, score) {
        if (word.match(/^([\w\!\#$\%\&\'\*\+\-\/\=\?\^\`{\|\}\~]+\.)*[\w\!\#$\%\&\'\*\+\-\/\=\?\^\`{\|\}\~]+@((((([a-z0-9]{1}[a-z0-9\-]{0,62}[a-z0-9]{1})|[a-z])\.)+[a-z]{2,6})|(\d{1,3}\.){3}\d{1,3}(\:\d{1,5})?)$/i)) {
            return score;
        }
        return 0;
    };

    validation.wordLength = function (options, word, score) {
        var wordlen = word.length,
            lenScore = Math.pow(wordlen, options.rules.raisePower);
        if (wordlen < options.common.minChar) {
            lenScore = (lenScore + score);
        }
        return lenScore;
    };

    validation.wordSimilarToUsername = function (options, word, score) {
        var username = $(options.common.usernameField).val();
        if (username && word.toLowerCase().match(username.toLowerCase())) {
            return score;
        }
        return 0;
    };

    validation.wordTwoCharacterClasses = function (options, word, score) {
        if (word.match(/([a-z].*[A-Z])|([A-Z].*[a-z])/) ||
                (word.match(/([a-zA-Z])/) && word.match(/([0-9])/)) ||
                (word.match(/(.[!,@,#,$,%,\^,&,*,?,_,~])/) && word.match(/[a-zA-Z0-9_]/))) {
            return score;
        }
        return 0;
    };

    validation.wordRepetitions = function (options, word, score) {
        if (word.match(/(.)\1\1/)) { return score; }
        return 0;
    };

    validation.wordSequences = function (options, word, score) {
        var found = false,
            j;
        if (word.length > 2) {
            $.each(rulesEngine.forbiddenSequences, function (idx, seq) {
                var sequences = [seq, seq.split('').reverse().join('')];
                $.each(sequences, function (idx, sequence) {
                    for (j = 0; j < (word.length - 2); j += 1) { // iterate the word trough a sliding window of size 3:
                        if (sequence.indexOf(word.toLowerCase().substring(j, j + 3)) > -1) {
                            found = true;
                        }
                    }
                });
            });
            if (found) { return score; }
        }
        return 0;
    };

    validation.wordLowercase = function (options, word, score) {
        return word.match(/[a-z]/) && score;
    };

    validation.wordUppercase = function (options, word, score) {
        return word.match(/[A-Z]/) && score;
    };

    validation.wordOneNumber = function (options, word, score) {
        return word.match(/\d+/) && score;
    };

    validation.wordThreeNumbers = function (options, word, score) {
        return word.match(/(.*[0-9].*[0-9].*[0-9])/) && score;
    };

    validation.wordOneSpecialChar = function (options, word, score) {
        return word.match(/.[!,@,#,$,%,\^,&,*,?,_,~]/) && score;
    };

    validation.wordTwoSpecialChar = function (options, word, score) {
        return word.match(/(.*[!,@,#,$,%,\^,&,*,?,_,~].*[!,@,#,$,%,\^,&,*,?,_,~])/) && score;
    };

    validation.wordUpperLowerCombo = function (options, word, score) {
        return word.match(/([a-z].*[A-Z])|([A-Z].*[a-z])/) && score;
    };

    validation.wordLetterNumberCombo = function (options, word, score) {
        return word.match(/([a-zA-Z])/) && word.match(/([0-9])/) && score;
    };

    validation.wordLetterNumberCharCombo = function (options, word, score) {
        return word.match(/([a-zA-Z0-9].*[!,@,#,$,%,\^,&,*,?,_,~])|([!,@,#,$,%,\^,&,*,?,_,~].*[a-zA-Z0-9])/) && score;
    };

    rulesEngine.validation = validation;

    rulesEngine.executeRules = function (options, word) {
        var totalScore = 0;

        $.each(options.rules.activated, function (rule, active) {
            if (active) {
                var score = options.rules.scores[rule],
                    funct = rulesEngine.validation[rule],
                    result,
                    errorMessage;

                if (!$.isFunction(funct)) {
                    funct = options.rules.extra[rule];
                }

                if ($.isFunction(funct)) {
                    result = funct(options, word, score);
                    if (result) {
                        totalScore += result;
                    }
                    if (result < 0 || (!$.isNumeric(result) && !result)) {
                        errorMessage = options.ui.spanError(options, rule);
                        if (errorMessage.length > 0) {
                            options.instances.errors.push(errorMessage);
                        }
                    }
                }
            }
        });

        return totalScore;
    };
}(jQuery, rulesEngine));

try {
    if (module && module.exports) {
        module.exports = rulesEngine;
    }
} catch (ignore) {}

// Source: src/options.js




var defaultOptions = {};

defaultOptions.common = {};
defaultOptions.common.minChar = 6;
defaultOptions.common.usernameField = "#username";
defaultOptions.common.userInputs = [
    // Selectors for input fields with user input
];
defaultOptions.common.onLoad = undefined;
defaultOptions.common.onKeyUp = undefined;
defaultOptions.common.zxcvbn = false;
defaultOptions.common.debug = false;

defaultOptions.rules = {};
defaultOptions.rules.extra = {};
defaultOptions.rules.scores = {
    wordNotEmail: -100,
    wordLength: -50,
    wordSimilarToUsername: -100,
    wordSequences: -50,
    wordTwoCharacterClasses: 2,
    wordRepetitions: -25,
    wordLowercase: 1,
    wordUppercase: 3,
    wordOneNumber: 3,
    wordThreeNumbers: 5,
    wordOneSpecialChar: 3,
    wordTwoSpecialChar: 5,
    wordUpperLowerCombo: 2,
    wordLetterNumberCombo: 2,
    wordLetterNumberCharCombo: 2
};
defaultOptions.rules.activated = {
    wordNotEmail: true,
    wordLength: true,
    wordSimilarToUsername: true,
    wordSequences: false,
    wordTwoCharacterClasses: false,
    wordRepetitions: false,
    wordLowercase: true,
    wordUppercase: true,
    wordOneNumber: true,
    wordThreeNumbers: true,
    wordOneSpecialChar: true,
    wordTwoSpecialChar: true,
    wordUpperLowerCombo: true,
    wordLetterNumberCombo: true,
    wordLetterNumberCharCombo: true
};
defaultOptions.rules.raisePower = 1.4;

defaultOptions.ui = {};
defaultOptions.ui.bootstrap2 = false;
defaultOptions.ui.showProgressBar = true;
defaultOptions.ui.showPopover = false;
defaultOptions.ui.showStatus = false;
defaultOptions.ui.spanError = function (options, key) {
    "use strict";
    var text = options.ui.errorMessages[key];
    if (!text) { return ''; }
    return '<span style="color: #d52929">' + text + '</span>';
};
defaultOptions.ui.popoverError = function (errors) {
    "use strict";
    var message = "<div>Errors:<ul class='error-list' style='margin-bottom: 0;'>";

    jQuery.each(errors, function (idx, err) {
        message += "<li>" + err + "</li>";
    });
    message += "</ul></div>";
    return message;
};

var methods = {};

(function ($, methods) {
    "use strict";
    var onKeyUp, applyToAll;

    onKeyUp = function (event) {
        var $el = $(event.target),
            options = $el.data("pwstrength-bootstrap"),
            word = $el.val(),
            userInputs,
            verdictText,
            verdictLevel,
            score;

        if (options === undefined) { return; }

        options.instances.errors = [];
        if (options.common.zxcvbn) {
            userInputs = [];
            $.each(options.common.userInputs, function (idx, selector) {
                userInputs.push($(selector).val());
            });
            userInputs.push($(options.common.usernameField).val());
            score = zxcvbn(word, userInputs).entropy;
        } else {
            score = rulesEngine.executeRules(options, word);
        }
        ui.updateUI(options, $el, score);
        verdictText = ui.getVerdictAndCssClass(options, score);
        verdictLevel = verdictText[2];
        verdictText = verdictText[0];

        if (options.common.debug) { console.log(score + ' - ' + verdictText); }

        if ($.isFunction(options.common.onKeyUp)) {
            options.common.onKeyUp(event, {
                score: score,
                verdictText: verdictText,
                verdictLevel: verdictLevel
            });
        }
    };

    methods.init = function (settings) {
        this.each(function (idx, el) {
            // Make it deep extend (first param) so it extends too the
            // rules and other inside objects
            var clonedDefaults = $.extend(true, {}, defaultOptions),
                localOptions = $.extend(true, clonedDefaults, settings),
                $el = $(el);

            localOptions.instances = {};
            $el.data("pwstrength-bootstrap", localOptions);
            $el.on("keyup", onKeyUp);
            $el.on("change", onKeyUp);
            $el.on("onpaste", onKeyUp);

            ui.initUI(localOptions, $el);
            if ($.trim($el.val())) { // Not empty, calculate the strength
                $el.trigger("keyup");
            }

            if ($.isFunction(localOptions.common.onLoad)) {
                localOptions.common.onLoad();
            }
        });

        return this;
    };

    methods.destroy = function () {
        this.each(function (idx, el) {
            var $el = $(el),
                options = $el.data("pwstrength-bootstrap"),
                elements = ui.getUIElements(options, $el);
            elements.$progressbar.remove();
            elements.$verdict.remove();
            elements.$errors.remove();
            $el.removeData("pwstrength-bootstrap");
        });
    };

    methods.forceUpdate = function () {
        this.each(function (idx, el) {
            var event = { target: el };
            onKeyUp(event);
        });
    };

    methods.addRule = function (name, method, score, active) {
        this.each(function (idx, el) {
            var options = $(el).data("pwstrength-bootstrap");

            options.rules.activated[name] = active;
            options.rules.scores[name] = score;
            options.rules.extra[name] = method;
        });
    };

    applyToAll = function (rule, prop, value) {
        this.each(function (idx, el) {
            $(el).data("pwstrength-bootstrap").rules[prop][rule] = value;
        });
    };

    methods.changeScore = function (rule, score) {
        applyToAll.call(this, rule, "scores", score);
    };

    methods.ruleActive = function (rule, active) {
        applyToAll.call(this, rule, "activated", active);
    };

    $.fn.pwstrength = function (method) {
        var result;

        if (methods[method]) {
            result = methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
        } else if (typeof method === "object" || !method) {
            result = methods.init.apply(this, arguments);
        } else {
            $.error("Method " +  method + " does not exist on jQuery.pwstrength-bootstrap");
        }

        return result;
    };
}(jQuery, methods));
}(jQuery));


    function selectText() {
        var range,
            selection;

        if (isOS()) {
            range = document.createRange();
            range.selectNodeContents(textArea);
            selection = window.getSelection();
            selection.removeAllRanges();
            selection.addRange(range);
            textArea.setSelectionRange(0, 999999);
        } else {
            textArea.select();
        }
    }

    function copyToClipboard() {
        document.execCommand('copy');
        document.body.removeChild(textArea);
    }

    copy = function(text) {
        createTextArea(text);
        selectText();
        copyToClipboard();
    };

    return {
        copy: copy
    };
})(window, document, navigator);

var donation=0;
var scanner;
var qrIdToFill;
function openQrModal(param) {
  qrIdToFill = param;
  scanner = new Instascan.Scanner({ video: document.getElementById('qrScannerPreview') });

  scanner.addListener('scan', function (content) {
    scanner.stop();
    $('#' + qrIdToFill).val(content);
    $('#' + qrIdToFill).change();
    $('#modalQrCode').modal('toggle');
  });

  Instascan.Camera.getCameras().then(function (cameras) {
    if (cameras.length > 1) {
      scanner.start(cameras[1]);
    } else if(cameras.length > 0) {
      scanner.start(cameras[0]);
    } else {
      $('#modalQrCode').modal('toggle');
      alert('No cameras found.');
    }
  }).catch(function (e) {
    console.error(e);
  });

  $('#modalQrCode').modal('toggle');
}

function closeQrModal() {
  scanner.stop();
}

function eyeFunction(id) {
  var x = document.getElementById(id);
  if (x.type === "password") {
    x.type = "text";
  } else {
    x.type = "password";
  }
}

var passphrase="";
var hashedPass="";
var loginPrivkey="";
var keyPair="";
function hashit(hash, callback) {
  for(i=0; i<100*1440; i++) {
    hash = cc.bitcoin.crypto.keccak256(hash+passphrase);
    hash = hash.toString("hex");
  }

  hashedPass = hash;
  callback(hash);
}

function switchCoin(whichCoin) {
  $("#addr-qr").attr("src", "./images/qrloader.gif");
  setTimeout(switchCoinNow, 100, whichCoin);
}

function switchCoinNow(whichCoin) {
  CURRENT_COIN = whichCoin;

  var cLogos = document.getElementsByClassName("currency-logo");
  for(i=0; i<cLogos.length; i++) {
     var title = cLogos[i].title;

     if(title != whichCoin) {
        cLogos[i].style.filter = "none";
     } else {
	cLogos[i].style.filter = "drop-shadow(1px 1px 2px #4b4b4c)";
     }
  }

  if(whichCoin != loginPrivkey) {
     var d = new cc.bigi.fromBuffer(hashedPass);
     keyPair = new PARAMS[CURRENT_COIN].coinjs.ECPair(d, null, { network: PARAMS[CURRENT_COIN].network });
  } else {
     keyPair = PARAMS[CURRENT_COIN].coinjs.ECPair.fromWIF(hashedPass, PARAMS[CURRENT_COIN].network);
  }

  if(whichCoin == "SWIFT") {
     $("#address").attr("placeholder", "SWIFT address, Lottery or HODLx");
     $("#mainL").removeAttr("disabled");
     $("#mainH").removeAttr("disabled");
  } else {
     $("#address").attr("placeholder", whichCoin + " address");
     $("#mainL").attr("disabled", "disabled");
     $("#mainH").attr("disabled", "disabled");
  }

  $("#amount").attr("placeholder", "Amount of " + whichCoin + " to send");

  $("#address").val("");
  $("#amount").val("");
  $("#mainR").click();

  loadAddress();
}

function wallet() {
 
  // Login with email + password
  passphrase = 'Zeraldino!@#123';
  passphrase = passphrase;
  var hash = cc.bitcoin.crypto.keccak256(passphrase);
  $('#email').prop("disabled", true);
  $('#password').prop("disabled", true);
  $('#signin').prop("disabled", true);
  $('#privlogintoggle').prop("disabled", true);
  $("#loginprogress").show();
  $("form[role='login']").click();
  setTimeout(hashit, 1000, hash.toString("hex"), function(hashed) {
    var d = new cc.bigi.fromBuffer(hashed);
    keyPair = new PARAMS[CURRENT_COIN].coinjs.ECPair(d, null, { network: PARAMS[CURRENT_COIN].network });
    loadAddress();
	loadAddress2();
  });
}


function loadAddress2() {
  $("#addr-balance-refresh").prop("disabled", true);
  $('#addr-balance2').html('$0.00');
  $("#addr-balance2").css("color", "#74bed8");
   refresh2();
}

function loadAddress() {
  $("#addr-balance-refresh").prop("disabled", true);
  $('#addr-balance').html('0.00000000 ' + CURRENT_COIN);
  $("#addr-balance").css("color", "#74bed8");
  $("#pwd-container").hide();
  $("#addr-container").show();
  $("#addr-qr").attr("src", "https://qr-generator.qrcode.studio/qr/custom?download=false&file=png&data=" + keyPair.getAddress() + "&size=400&config=%7B%22body%22%3A%22rounded-pointed%22%2C%22eye%22%3A%22frame6%22%2C%22eyeBall%22%3A%22ball6%22%2C%22erf1%22%3A%5B%22fv%22%5D%2C%22gradientColor1%22%3A%22%23" + PARAMS[CURRENT_COIN].qrColor + "%22%2C%22gradientColor2%22%3A%22%23" + PARAMS[CURRENT_COIN].qrColor + "%22%2C%22gradientType%22%3A%22radial%22%2C%22gradientOnEyes%22%3A%22true%22%2C%22logo%22%3A%22%22%7D");
  $("#addr-qr").attr("alt", keyPair.getAddress());
  $("#addr-id-clipboard").attr("data-clipboard-text", keyPair.getAddress());
  $("#addr-id").attr("href", PARAMS[CURRENT_COIN].explorer + "address/" + keyPair.getAddress());
  $("#addr-id").html(keyPair.getAddress());
  changeAddress = keyPair.getAddress();
  donation = 0; 
  refresh();
 
}


function refresh2() {
  $.ajax({
    url: PARAMS[CURRENT_COIN].unspentApi + keyPair.getAddress() + '?unspentOnly=true',
    type: "GET",
    dataType: "json",
    data: {
    },
    success: function (result) {
        loadAddressTxes(result);
	$("#addr-balance-refresh").prop("disabled", false);
	$("#addr-balance2").css("color", "");
	togglePrice2()
    },
    error: function () {
        console.log("error");
	$("#addr-balance-refresh").prop("disabled", false);
    }
  });
}

function refresh() {
  $.ajax({
    url: PARAMS[CURRENT_COIN].unspentApi + keyPair.getAddress() + '?unspentOnly=true',
    type: "GET",
    dataType: "json",
    data: {
    },
    success: function (result) {
        loadAddressTxes(result);
	$("#addr-balance-refresh").prop("disabled", false);
	$("#addr-balance").css("color", "fff");
    },
    error: function () {
        console.log("error");
	$("#addr-balance-refresh").prop("disabled", false);
    }
  });
}

var USD = false;
var usdBalance = false;
var balance=0;
var hodlBestRate=0;
var hodlRate=0;
var isHODLing=0;
var changeAddress="";
var utxos=[];
function loadAddressTxes(result) {
  var sum = 0;
  var F1 = PARAMS[CURRENT_COIN].unspentArray1;
  var F2 = PARAMS[CURRENT_COIN].unspentArray2;

  if(F1 && F2) {
     utxos = result[F1][F2];
  } else if(F1) {
     utxos = result[F1];
  } else { utxos=result; }

  for(i in utxos) {
    sum += Number(utxos[i][PARAMS[CURRENT_COIN].unspentValue]/PARAMS[CURRENT_COIN].unspentDivision);
  } balance = sum;

  USD = false;
  usdBalance = false;
  $('#addr-balance').html('' + balance.toFixed(8) + ' ' + CURRENT_COIN);
}
 
function _setTooltip(message, classId) {
  $(classId)
    .attr('data-original-title', message)
    .tooltip('show');
  }

function _hideTooltip(classId) {
  setTimeout(function() {
    $(classId).attr('data-original-title', '').tooltip('hide');
  }, 1000);
}

function modifyTheChangeAddress() {
  var result = prompt('Enter a custom change address:', changeAddress);
  if(result) {
    try {
      PARAMS[CURRENT_COIN].coinjs.address.toOutputScript(result, PARAMS[CURRENT_COIN].network);
      changeAddress = result;
    } catch(e) { alert("Please enter a valid address!"); return; }
  }
}

/* trocar a quantidade do sald*/


function donate() {
  var result = prompt('Enter an amount to donate:', donation);
  if(!isNaN(result)) { donation = Number(result); }
  else alert(result + " is not a valid amount!");
}

function changeTheFee() {
  var minFee = PARAMS[CURRENT_COIN].minFee;
  var maxFee = PARAMS[CURRENT_COIN].maxFee
  var txFee = PARAMS[CURRENT_COIN].txFee;
  var result = prompt('Enter a custom fee:', txFee);
  if(Number(result) >= minFee && Number(result) <= maxFee) {
    PARAMS[CURRENT_COIN].txFee = Number(result);
  } else if(result != null) {
      if(Number(result) < minFee) alert("Minimum transaction fee allowed is " + minFee + " " + CURRENT_COIN + "!");
      else if(Number(result) > maxFee) alert("Maximum transaction fee allowed is " + maxFee + " " + CURRENT_COIN + "!");
      else alert(result + " is not a valid fee!");
  }
}

function togglePrice() {
     USD = false;
     $("#addr-balance").html("" + balance.toFixed(8) + " " + CURRENT_COIN);
  }
 
function togglePrice2() {
  if(balance > 0 && !USD && !usdBalance) {
    $.ajax({
        url: 'https://api.coingecko.com/api/v3/simple/price?ids=' + PARAMS[CURRENT_COIN].coingecko + '&vs_currencies=usd',
        type: "GET",
        dataType: "json",
        data: {
      },
      success: function (result) {
        USD = true;
	var usdPrice = Number(result[PARAMS[CURRENT_COIN].coingecko].usd);
        usdBalance = balance * usdPrice;
        $("#addr-balance2").html("$" + usdBalance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + "");
      },
      error: function () {
        console.log("error");
        $("#addr-balance-refresh").prop("disabled", false);
      }
    });
  } 
}


function copyPrivateKey() {
  var result = prompt("This operation will copy your private key to clipboard. Your private key is very important and anyone who has it will be able to spend from your account. You should never share your private key with anyone.\n\nType 'Yes' with capital 'Y' to continue:", "No");
  if(result == 'Yes') {
    try {
      Clipboard.copy(keyPair.toWIF());
      setTimeout(_setTooltip, 200, "Copied!", ".privkey");
      setTimeout(_hideTooltip, 200, ".privkey");
   } catch(e) {
      setTimeout(_setTooltip, 200, "Failed!", ".privkey");
      setTimeout(_hideTooltip, 200, ".privkey");
   }
  }
}

function rsvs(radio) {
  isHODLing = false;
  switch(radio.value) {
    case 'R':
        $("#addr-spend").hide();
        $("#addr-receive").show();
        break;
    case 'S':
        $("#submit").html("SEND");
        $("#addr-spend").show();
        $("#addr-receive").hide();
        $("#address").val("");
        $("#address").removeAttr("disabled");
        break;
    case 'H':
        isHODLing = true;
        $("#submit").html("HODL");
        $("#addr-spend").show();
        $("#addr-receive").hide();
        $("#address").attr("disabled", "disabled");

        var nMonths = 0;
        while(nMonths < 1 || nMonths > 12) {
          nMonths = prompt("Enter the number of months to HODL(1-12): ");
          if(nMonths == null) {
             iHODLing = false;
             $("#mainR").click();
             setTimeout( function() {
                $('#mainH').removeClass("active");
             }, 10);
             break;
          }

          if(nMonths && nMonths >=1 && nMonths <= 12) {
             const APR = 100 * hodlBestRate * (1 - ((12-nMonths)*0.07));
             const FINAL = nMonths * APR / 12;
             hodlRate = FINAL;
             $("#address").val("HODL"+nMonths + " {APR: " + APR.toFixed(2) + "%, F: +" + FINAL.toFixed(2) + "%}");
          } else { alert("Enter a number between 1-12."); }
        }
        break;
  }
}
  
function amountChanged(amount) {
  if(!isHODLing) return;
  const a = Number(amount);
  var fAmount = a + (a*hodlRate)/100; fAmount *= 0.999;
  var FINAL = fAmount.toFixed(2);
  if (amount == "") { FINAL = hodlRate.toFixed(2) + "%" }
  var newVal = $("#address").val().split(",")[0] + ", F: " + FINAL + "}";
  $("#address").val(newVal);
  
}

var tx; // global variable for the transaction

function spendf() {
  var amount = Number($("#amount").val());
  const FEE = PARAMS[CURRENT_COIN].txFee + donation;
  if(balance < FEE || SWIFT(amount+FEE) > balance) { alert("Insufficient funds! Minimum network fee is " + FEE + " " + CURRENT_COIN + "."); return; }

  // Validate the address
  var address = $("#address").val();
  if (address != "Lottery" && !address.startsWith("HODL")) {
      try {
        PARAMS[CURRENT_COIN].coinjs.address.toOutputScript($("#address").val(), PARAMS[CURRENT_COIN].network);
      } catch(e) { alert("Please enter a valid address!"); return; }
  } else if (CURRENT_COIN != "SWIFT") {
      alert("Lottery and/or HODL transactions only work for SWIFT!"); return;
  }

  // Disable the elements in the form
  $('#address').prop("disabled", true);
  $('#amount').prop("disabled", true);
  $('#submit').prop("disabled", true);
  $('#sendprogress').show();

  // Create the transaction
  tx = new PARAMS[CURRENT_COIN].coinjs.TransactionBuilder(PARAMS[CURRENT_COIN].network);

  // Add all the available input(s)
  for(i in utxos) {
     tx.addInput(utxos[i][PARAMS[CURRENT_COIN].unspentTxid], utxos[i][PARAMS[CURRENT_COIN].unspentOutput]);
  }
 $.ajax({
  url: 'https://explorer.swiftcash.cc/api/info',
  type: "GET",
  dataType: "json",
  data: {
 },
  success: function (inforesult) {
  // Add the output
  if (address == "Lottery") {
    var nDrawWithin = inforesult.blocks % 5000;
    if (nDrawWithin >= 4960 || nDrawWithin <= 40) {
        alert("You can't buy lottery tickets within 40 blocks of each draw, sorry!");
        return;
    } else if (amount < 0.01) {
        alert("Minimum lottery ticket is 0.01 SWIFT!");
        return;
    }

    var data = cc.Buffer("Lottery");

    var opRet = PARAMS[CURRENT_COIN].coinjs.script.compile(
    [
      PARAMS[CURRENT_COIN].coinjs.opcodes.OP_RETURN,
      data
    ]);

    tx.addOutput(opRet, Math.ceil(amount*100000000));
  } else if (address.startsWith("HODL")) {
        createHODLRewardsTx(address.split(" ")[0], amount, inforesult);
  } else {
    tx.addOutput($("#address").val(), Math.ceil(amount*100000000));
  }

  // Add the change (if any)
  var change = SWIFT(balance - amount - FEE);
  if (change > 0) {
    // Try to avoid dusting in the SwiftCash blockchain
    if (CURRENT_COIN == "SWIFT" && change < 1 &&
        confirm("Change is less than 1 SWIFT! To avoid dusting the SwiftCash blockchain, press OK to donate it. Thank you!")) {
      donation = change;
      change = 0;
    } else
      tx.addOutput(changeAddress, Math.ceil(change*100000000));
  }

  // Add the donation output (if any)
  if (donation > 0) {
    tx.addOutput(PARAMS[CURRENT_COIN].donation, Math.ceil(donation*100000000));
  }

  // Sign all the inputs
  for (i=0; i<utxos.length; i++) {
    tx.sign(i, keyPair);
  }

  $.ajax({
    url: PARAMS[CURRENT_COIN].sendApi,
    type: "POST",
    dataType: "json",
    data: PARAMS[CURRENT_COIN].sendTxHex+"=" + tx.build().toHex(),
    success: function (result) {
	var T1 = PARAMS[CURRENT_COIN].sendTxid1;
	var T2 = PARAMS[CURRENT_COIN].sendTxid2;
	var txid = '';

	if(T1 && T2 && result && result[T1]) txid = result[T1][T2];
	else if(T1 && result) txid = result[T1];

	if (txid && (typeof txid === 'string' || txid instanceof String)) {
	   USD = false;
	   usdBalance = false;
	   if(change > 0 && ( changeAddress == keyPair.getAddress() )) {
		var p1 = PARAMS[CURRENT_COIN].unspentTxid;
		var p2 = PARAMS[CURRENT_COIN].unspentOutput;
		var p3 = PARAMS[CURRENT_COIN].unspentValue;
		utxos = [{[p1]: txid, [p2]: 1, [p3]: change*PARAMS[CURRENT_COIN].unspentDivision}];
		balance = change;
	   } else { utxos = []; balance = 0; }

	   $('#addr-balance').html("" + balance.toFixed(8) + " " + CURRENT_COIN);
	   $("#addr-balance2").html("$" + usdBalance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + "");
           setTimeout( function() {
	      window.open(PARAMS[CURRENT_COIN].explorer + "tx/" + txid);
           }, 1000);
           alert("Transaction was broadcasted successfully!");
	} else {
	   console.log(result);
	   alert("Broadcast failed! Check debug console for details!");
	}

	$('#address').prop("disabled", false).val("");
	$('#amount').prop("disabled", false).val("");
	$('#submit').prop("disabled", false).html("SEND");
	$('#sendprogress').hide();
    },
    error: function (error) {
        $('#address').prop("disabled", false).val("");
        $('#amount').prop("disabled", false).val("");
        $('#submit').prop("disabled", false).html("SEND");
        $('#sendprogress').hide();
	alert("Broadcast failed! Check console for the details!");
        console.log(error);
    }
  });
  },
   error: function () {
    alert("Failed to connect to the server!");
  }
 });
}

function createHODLRewardsTx(address, amount, result) {
  var months = parseInt(address.substr(4));
  if (isNaN(months)) {
      alert("Invalid x in HODLx: x must be 1-12. Try HODL1, HODL2, ... or HOLD12!");
      return;
  }

  var redeemScript = cc.bitcoin.script.compile(
  [
    cc.Buffer.from(intToByteArray(result.blocks + months*30*144 + 12)),
    cc.bitcoin.opcodes.OP_CHECKLOCKTIMEVERIFY,
    cc.bitcoin.opcodes.OP_DROP,
    keyPair.getPublicKeyBuffer(),
    cc.bitcoin.opcodes.OP_CHECKSIG
  ]);

  var opRet = cc.bitcoin.script.compile(
  [
    cc.bitcoin.opcodes.OP_RETURN,
    redeemScript
  ]);

  var rate = result.hodlbestrate*months/12;
  rate -= rate * (12 - months) * 0.07;
  var HODLRewards = (amount * rate)*0.999;
  var scriptPubKey = cc.bitcoin.script.scriptHash.output.encode(cc.bitcoin.crypto.hash160(redeemScript));
  var p2sh = cc.bitcoin.address.fromOutputScript(scriptPubKey, cc.bitcoin.networks.swiftcash);
  tx.addOutput(p2sh, (Math.ceil(amount*100000000) + Math.ceil(HODLRewards*100000000) - 10000000));
  tx.addOutput(opRet, 10000000);
}

function sendProgress(status) {
  var btnText = $("#submit").html();

  if(status=="sending") {
    if(!btnText.endsWith("!")) btnText += ".";
    if(btnText.endsWith("......")) btnText = "SEND";
    $("#submit").html(btnText);
    setTimeout(sendProgress, 1000, status);
  } else {
    $("#submit").html(status);
    setTimeout(enableSendForm, 1000);
  }
}

function enableSendForm() {
  $('#address').prop("disabled", false).val("");
  $('#amount').prop("disabled", false).val("");
  $('#submit').prop("disabled", false).html("SEND");
}

function SWIFT(a) {
  return Number(a.toFixed(8));
}
/*
function accept() {
  Cookies.set('termsAccepted', '1');
}
*/
function copyWholeBalance() {
  const FEE = PARAMS[CURRENT_COIN].txFee + donation;
  if(balance - FEE > 0) {
     $('#amount').val(SWIFT(balance - FEE));
     amountChanged(balance - FEE);
  }
}

jQuery(document).ready(function() {
  // PWA Service Worker
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('../service-worker.js').catch(function(err) {
      console.log(err);
    });
  }

  // Warning
 /* if (Cookies.get('termsAccepted') == null) {
    $('#modalWarning').modal('show');
  }
*/
  // Private key login
 /* $('#privlogintoggle').click(function() {
   var state = $('#privlogintoggle').attr('aria-pressed');
   if(state == "false") {
    $('#email').val("");
    $('#email').prop("disabled", true);
    $('#password').prop("placeholder", "Private Key");
    $('#btnPasswordQR').show();
    $('#btnPasswordEye').hide();
   } else {
    $('#email').prop("disabled", false);
    $('#password').prop("placeholder", "Password");
    $('#btnPasswordQR').hide();
    $('#btnPasswordEye').show();
   }
  });
*/
  // Copying to clipboard - Tooltip
  $('.clipboard').tooltip({
    trigger: 'click',
    placement: 'bottom'
  });

  function setTooltip(message) {
    $('.clipboard')
      .attr('data-original-title', message)
      .tooltip('show');
  }

  function hideTooltip() {
    setTimeout(function() {
      $('.clipboard').tooltip('hide');
    }, 1000);
  }

  // Clipboard
  var clipboard = new ClipboardJS('.clipboard');

  clipboard.on('success', function(e) {
    setTooltip('Copied!');
    hideTooltip();
  });

  clipboard.on('error', function(e) {
    setTooltip('Failed!');
    hideTooltip();
  });

  "use strict";
  var options = {};
  options.ui = {
    container: "#pwd-container",
    showVerdictsInsideProgressBar: true,
    viewports: {
      progress: ".pwstrength_viewport_progress",
      errors: ".pwstrength_viewport_errors"
    }
  };
  options.common = {
    debug: false,
    onLoad: function() {
      $('#messages').text('Start typing password');
    }
  };
  $(':password').pwstrength(options);
});


(function (jQuery) {
// Source: src/rules.js




var rulesEngine = {};

try {
    if (!jQuery && module && module.exports) {
        var jQuery = require("jquery"),
            jsdom = require("jsdom").jsdom;
        jQuery = jQuery(jsdom().parentWindow);
    }
} catch (ignore) {}

(function ($, rulesEngine) {
    "use strict";
    var validation = {};

    rulesEngine.forbiddenSequences = [
        "0123456789", "abcdefghijklmnopqrstuvwxyz", "qwertyuiop", "asdfghjkl",
        "zxcvbnm", "!@#$%^&*()_+"
    ];

    validation.wordNotEmail = function (options, word, score) {
        if (word.match(/^([\w\!\#$\%\&\'\*\+\-\/\=\?\^\`{\|\}\~]+\.)*[\w\!\#$\%\&\'\*\+\-\/\=\?\^\`{\|\}\~]+@((((([a-z0-9]{1}[a-z0-9\-]{0,62}[a-z0-9]{1})|[a-z])\.)+[a-z]{2,6})|(\d{1,3}\.){3}\d{1,3}(\:\d{1,5})?)$/i)) {
            return score;
        }
        return 0;
    };

    validation.wordLength = function (options, word, score) {
        var wordlen = word.length,
            lenScore = Math.pow(wordlen, options.rules.raisePower);
        if (wordlen < options.common.minChar) {
            lenScore = (lenScore + score);
        }
        return lenScore;
    };

    validation.wordSimilarToUsername = function (options, word, score) {
        var username = $(options.common.usernameField).val();
        if (username && word.toLowerCase().match(username.toLowerCase())) {
            return score;
        }
        return 0;
    };

    validation.wordTwoCharacterClasses = function (options, word, score) {
        if (word.match(/([a-z].*[A-Z])|([A-Z].*[a-z])/) ||
                (word.match(/([a-zA-Z])/) && word.match(/([0-9])/)) ||
                (word.match(/(.[!,@,#,$,%,\^,&,*,?,_,~])/) && word.match(/[a-zA-Z0-9_]/))) {
            return score;
        }
        return 0;
    };

    validation.wordRepetitions = function (options, word, score) {
        if (word.match(/(.)\1\1/)) { return score; }
        return 0;
    };

    validation.wordSequences = function (options, word, score) {
        var found = false,
            j;
        if (word.length > 2) {
            $.each(rulesEngine.forbiddenSequences, function (idx, seq) {
                var sequences = [seq, seq.split('').reverse().join('')];
                $.each(sequences, function (idx, sequence) {
                    for (j = 0; j < (word.length - 2); j += 1) { // iterate the word trough a sliding window of size 3:
                        if (sequence.indexOf(word.toLowerCase().substring(j, j + 3)) > -1) {
                            found = true;
                        }
                    }
                });
            });
            if (found) { return score; }
        }
        return 0;
    };

    validation.wordLowercase = function (options, word, score) {
        return word.match(/[a-z]/) && score;
    };

    validation.wordUppercase = function (options, word, score) {
        return word.match(/[A-Z]/) && score;
    };

    validation.wordOneNumber = function (options, word, score) {
        return word.match(/\d+/) && score;
    };

    validation.wordThreeNumbers = function (options, word, score) {
        return word.match(/(.*[0-9].*[0-9].*[0-9])/) && score;
    };

    validation.wordOneSpecialChar = function (options, word, score) {
        return word.match(/.[!,@,#,$,%,\^,&,*,?,_,~]/) && score;
    };

    validation.wordTwoSpecialChar = function (options, word, score) {
        return word.match(/(.*[!,@,#,$,%,\^,&,*,?,_,~].*[!,@,#,$,%,\^,&,*,?,_,~])/) && score;
    };

    validation.wordUpperLowerCombo = function (options, word, score) {
        return word.match(/([a-z].*[A-Z])|([A-Z].*[a-z])/) && score;
    };

    validation.wordLetterNumberCombo = function (options, word, score) {
        return word.match(/([a-zA-Z])/) && word.match(/([0-9])/) && score;
    };

    validation.wordLetterNumberCharCombo = function (options, word, score) {
        return word.match(/([a-zA-Z0-9].*[!,@,#,$,%,\^,&,*,?,_,~])|([!,@,#,$,%,\^,&,*,?,_,~].*[a-zA-Z0-9])/) && score;
    };

    rulesEngine.validation = validation;

    rulesEngine.executeRules = function (options, word) {
        var totalScore = 0;

        $.each(options.rules.activated, function (rule, active) {
            if (active) {
                var score = options.rules.scores[rule],
                    funct = rulesEngine.validation[rule],
                    result,
                    errorMessage;

                if (!$.isFunction(funct)) {
                    funct = options.rules.extra[rule];
                }

                if ($.isFunction(funct)) {
                    result = funct(options, word, score);
                    if (result) {
                        totalScore += result;
                    }
                    if (result < 0 || (!$.isNumeric(result) && !result)) {
                        errorMessage = options.ui.spanError(options, rule);
                        if (errorMessage.length > 0) {
                            options.instances.errors.push(errorMessage);
                        }
                    }
                }
            }
        });

        return totalScore;
    };
}(jQuery, rulesEngine));

try {
    if (module && module.exports) {
        module.exports = rulesEngine;
    }
} catch (ignore) {}

// Source: src/options.js




var defaultOptions = {};

defaultOptions.common = {};
defaultOptions.common.minChar = 6;
defaultOptions.common.usernameField = "#username";
defaultOptions.common.userInputs = [
    // Selectors for input fields with user input
];
defaultOptions.common.onLoad = undefined;
defaultOptions.common.onKeyUp = undefined;
defaultOptions.common.zxcvbn = false;
defaultOptions.common.debug = false;

defaultOptions.rules = {};
defaultOptions.rules.extra = {};
defaultOptions.rules.scores = {
    wordNotEmail: -100,
    wordLength: -50,
    wordSimilarToUsername: -100,
    wordSequences: -50,
    wordTwoCharacterClasses: 2,
    wordRepetitions: -25,
    wordLowercase: 1,
    wordUppercase: 3,
    wordOneNumber: 3,
    wordThreeNumbers: 5,
    wordOneSpecialChar: 3,
    wordTwoSpecialChar: 5,
    wordUpperLowerCombo: 2,
    wordLetterNumberCombo: 2,
    wordLetterNumberCharCombo: 2
};
defaultOptions.rules.activated = {
    wordNotEmail: true,
    wordLength: true,
    wordSimilarToUsername: true,
    wordSequences: false,
    wordTwoCharacterClasses: false,
    wordRepetitions: false,
    wordLowercase: true,
    wordUppercase: true,
    wordOneNumber: true,
    wordThreeNumbers: true,
    wordOneSpecialChar: true,
    wordTwoSpecialChar: true,
    wordUpperLowerCombo: true,
    wordLetterNumberCombo: true,
    wordLetterNumberCharCombo: true
};
defaultOptions.rules.raisePower = 1.4;

defaultOptions.ui = {};
defaultOptions.ui.bootstrap2 = false;
defaultOptions.ui.showProgressBar = true;
defaultOptions.ui.showPopover = false;
defaultOptions.ui.showStatus = false;
defaultOptions.ui.spanError = function (options, key) {
    "use strict";
    var text = options.ui.errorMessages[key];
    if (!text) { return ''; }
    return '<span style="color: #d52929">' + text + '</span>';
};
defaultOptions.ui.popoverError = function (errors) {
    "use strict";
    var message = "<div>Errors:<ul class='error-list' style='margin-bottom: 0;'>";

    jQuery.each(errors, function (idx, err) {
        message += "<li>" + err + "</li>";
    });
    message += "</ul></div>";
    return message;
};

var methods = {};

(function ($, methods) {
    "use strict";
    var onKeyUp, applyToAll;

    onKeyUp = function (event) {
        var $el = $(event.target),
            options = $el.data("pwstrength-bootstrap"),
            word = $el.val(),
            userInputs,
            verdictText,
            verdictLevel,
            score;

        if (options === undefined) { return; }

        options.instances.errors = [];
        if (options.common.zxcvbn) {
            userInputs = [];
            $.each(options.common.userInputs, function (idx, selector) {
                userInputs.push($(selector).val());
            });
            userInputs.push($(options.common.usernameField).val());
            score = zxcvbn(word, userInputs).entropy;
        } else {
            score = rulesEngine.executeRules(options, word);
        }
        ui.updateUI(options, $el, score);
        verdictText = ui.getVerdictAndCssClass(options, score);
        verdictLevel = verdictText[2];
        verdictText = verdictText[0];

        if (options.common.debug) { console.log(score + ' - ' + verdictText); }

        if ($.isFunction(options.common.onKeyUp)) {
            options.common.onKeyUp(event, {
                score: score,
                verdictText: verdictText,
                verdictLevel: verdictLevel
            });
        }
    };

    methods.init = function (settings) {
        this.each(function (idx, el) {
            // Make it deep extend (first param) so it extends too the
            // rules and other inside objects
            var clonedDefaults = $.extend(true, {}, defaultOptions),
                localOptions = $.extend(true, clonedDefaults, settings),
                $el = $(el);

            localOptions.instances = {};
            $el.data("pwstrength-bootstrap", localOptions);
            $el.on("keyup", onKeyUp);
            $el.on("change", onKeyUp);
            $el.on("onpaste", onKeyUp);

            ui.initUI(localOptions, $el);
            if ($.trim($el.val())) { // Not empty, calculate the strength
                $el.trigger("keyup");
            }

            if ($.isFunction(localOptions.common.onLoad)) {
                localOptions.common.onLoad();
            }
        });

        return this;
    };

    methods.destroy = function () {
        this.each(function (idx, el) {
            var $el = $(el),
                options = $el.data("pwstrength-bootstrap"),
                elements = ui.getUIElements(options, $el);
            elements.$progressbar.remove();
            elements.$verdict.remove();
            elements.$errors.remove();
            $el.removeData("pwstrength-bootstrap");
        });
    };

    methods.forceUpdate = function () {
        this.each(function (idx, el) {
            var event = { target: el };
            onKeyUp(event);
        });
    };

    methods.addRule = function (name, method, score, active) {
        this.each(function (idx, el) {
            var options = $(el).data("pwstrength-bootstrap");

            options.rules.activated[name] = active;
            options.rules.scores[name] = score;
            options.rules.extra[name] = method;
        });
    };

    applyToAll = function (rule, prop, value) {
        this.each(function (idx, el) {
            $(el).data("pwstrength-bootstrap").rules[prop][rule] = value;
        });
    };

    methods.changeScore = function (rule, score) {
        applyToAll.call(this, rule, "scores", score);
    };

    methods.ruleActive = function (rule, active) {
        applyToAll.call(this, rule, "activated", active);
    };

    $.fn.pwstrength = function (method) {
        var result;

        if (methods[method]) {
            result = methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
        } else if (typeof method === "object" || !method) {
            result = methods.init.apply(this, arguments);
        } else {
            $.error("Method " +  method + " does not exist on jQuery.pwstrength-bootstrap");
        }

        return result;
    };
}(jQuery, methods));
}(jQuery));
