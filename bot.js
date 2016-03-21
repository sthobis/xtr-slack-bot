// Requiring our module
var slackAPI = require('slackbotapi');
var request = require('request');

// Starting
var slack = new slackAPI({
	'token': 'xoxb-28096954355-jGXTQKppgwV0WjIoMpzqV2pB',
	'logging': true
});

// Slack on EVENT message, send data.
slack.on('message', function(data) {

	// If no text, return.
	if(typeof data.text == 'undefined') return;

	// If the first character starts with /, you can change this to your own prefix of course.
	if(data.text.charAt(0) === '%') {
		// Split the command and it's arguments into an array
		var command = data.text.substring(1).split('_');

		// Switch to check which command has been requested.
		switch (command[0].toLowerCase()) {

			case 'todo' :
				request.post(
					'',
					{ form : {
							'name' : command[1],
							'project_id' : data.channel,
							'project_name' : slack.getChannel(data.channel).name,
							'assignee' : command[2]
						}
					},
					function (error, response, body) {
						if (!error && response.statusCode == 200) {
							slack.sendMsg(data.channel, 'Task created!\nGood luck ' + data.user + ' :kiss:');
						}
					}
				);
				break;

			case 'list' :
				request.get(
					'',
					function (error, response, body) {

						if (!error && response.statusCode == 200) {
							body = JSON.parse(body);
							var msg = 'Here\'s your todo list :joy:';

							for (var i = 0; i < body.data.length; i++) {
								msg += '\n' + body.data[i].todo_id + ' - ' + body.data[i].name + ' | ' + body.data[i].assignee;
							}
							slack.sendMsg(data.channel, msg);
						}
					}
				);
				break;

			case 'done' :
				request.put(
					'' + command[1],
					{ form : {
							'type' : 'done'
						}
					},
					function (error, response, body) {

						if (!error && response.statusCode == 200) {
							slack.sendMsg(data.channel, 'Good job ' + data.user + '! :100:');
						}
					}
				);
				break;

			case 'debug':
				console.log(data);
				break;
		}
	}
});