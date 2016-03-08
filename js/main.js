var messages = [];
var users = [];
var messageCount = 0;

var name = prompt("What is your name?");
if(name == "null" || name == ""){
	name = "Anon";
}

// Submit name to data server
$.ajax({url:'https://polar-mesa-45755.herokuapp.com/api/users',
		type: 'POST',
		data: {
			name: name
		},
		crossDomain: true,
		success: function(){
		}
	});

document.getElementById('submit_text').focus();

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
	var timestamp = new Date();
	timestamp = timestamp.toDateString() + " - " + timestamp.toTimeString() + " -- ";
	$.ajax({url:'https://polar-mesa-45755.herokuapp.com/api/messages',
			type: 'POST',
			data: {
				message: timestamp + name + " ~> " + document.getElementById('submit_text').value
			},
			crossDomain: true,
			success: function(){
			}
		});
	document.getElementById('submit_text').value = "";
}

function loopCheck(){
	$.ajax({url:'https://polar-mesa-45755.herokuapp.com/api/messages',
			type: 'GET',
			crossDomain: true,
			success: function(result){
				if(messages.toString() == result.toString()){
					return;
				}
				$('#content_window').empty();
				messages = result;
				for (var i in messages){
					$('#content_window').prepend("<div class='message'>" + messages[i] + "</div>")
				}
			}
		});
	setTimeout(function(){
		loopCheck();
	}, 1000)
}

loopCheck();

function pollForUsers(){
	$.ajax({url:'https://polar-mesa-45755.herokuapp.com/api/users',
			type: 'GET',
			crossDomain: true,
			success: function(result){
				if(users.toString() == result.toString()){
					return;
				}
				users = result;
				$('#user-list').empty();
				for(var i in users){
					$('#user-list').append("<p>" + users[i] + "</p>")
				}
			}
		})
	setTimeout(function(){
		pollForUsers();
	}, 30000);
}

pollForUsers();

$('#logOut')[0].onclick = function(){ removeName();}
$('#reset')[0].onclick = function(){ serverReset();}

function removeName(){
	$.ajax({url:'https://polar-mesa-45755.herokuapp.com/api/users',
			type: 'DELETE',
			crossDomain: true,
			data: {
				name: name
			},
			success: function(result){
				name = "";
			}
		})
}

function serverReset(){
	$.ajax({url:'https://polar-mesa-45755.herokuapp.com/api/refresh',
			type: 'POST',
			crossDomain: true,
			success: function(result){
				$.ajax({url:'https://polar-mesa-45755.herokuapp.com/api/users',
						type: 'POST',
						data: {
							name: name
						},
						crossDomain: true,
						success: function(){
						}
					});
			}
		})
}


window.onbeforeunload = function() {
	if (name != ""){
		return 'You need to log out first please or this app will show you as online until the next server refresh.';	
	} else {
		return null;
	}
};
