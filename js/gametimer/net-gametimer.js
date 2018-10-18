'use strict';

const net = require('net');

net.createServer(connection => {

	// Reporting.
	console.log('Client connected.');
	let interval = 0;

	// Process Connection request
	// const server = require('./lib/ldj-client.js').connect(net);

	connection.on('data', data => {
		var message = JSON.parse(data);

		if (message > 0) {
			console.log(`Now counting: ${message} seconds at ${Date()}`);
			interval = message * 1000;
		} else {
			console.log(`Unrecognized message: ${message}`);
		}

		// Write response after clock expires.
		setTimeout(() => {
			connection.write(JSON.stringify({value: 'done'}) + '\n');
			console.log(`Sent ${message} seconds response at: ${Date()}`);
		}, interval);

	});
	
	// Cleanup
	connection.on('close', () => {
		console.log('Client disconnected.');
		});

	// Error Handler
	connection.on('error', (err) => {
		console.log("Caught some type of socket error: ");
		console.log(err.stack);
		});

}).listen(60001, () => console.log('Listening for client...'));