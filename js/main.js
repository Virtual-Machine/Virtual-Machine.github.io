var messages = [];
var users = [];
var messageCount = 0;

var name = prompt("What is your name?");
if(!name){
	name = "Anon";
}

$.ajax({url:'https://polar-mesa-45755.herokuapp.com/api/users',
		type: 'GET',
		crossDomain: true,
		success: function(result){
			users = result;
			console.log(users);
		}
	})

document.getElementById('submit_text').focus();

document.getElementById('curUser').innerHTML = name;

document.getElementById('submit_text').onkeypress = function(event){
	if (event.which == 13){
		submitMessage();
	}
}

document.getElementById('submit_button').onclick = submitMessage;

function addZero(i) {
    if (i < 10) {
        i = "0" + i;
    }
    return i;
}

function submitMessage(){
	var message = {
		name: name,
		content: document.getElementById('submit_text').value
	}
	messages.push(message);
	document.getElementById('submit_text').value = "";
	console.log(messages);
}

function loopCheck(){
	while(messageCount < messages.length){
		
		var newElem = document.createElement("div");
		newElem.className = "message";
		var time = new Date();
		var timestamp = addZero(time.getHours()) + ":" + addZero(time.getMinutes()) + ":" + addZero(time.getSeconds());
		newElem.innerHTML =  timestamp + " - " + messages[messageCount].name + " ~> " + messages[messageCount].content;
		var topMessage = document.getElementById('content_window').firstChild;
		document.getElementById('content_window').insertBefore(newElem, topMessage);
		messageCount++;
	}
	setTimeout(function(){
		loopCheck();
	}, 500)
}

loopCheck();
