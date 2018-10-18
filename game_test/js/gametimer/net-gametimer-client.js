'use strict';
const net = require('net').connect({port: 60001});
const client = require('./lib/ldj-client.js').connect(net);
const delay = process.argv[2];

if (isNaN(delay)) {
	throw Error('Error: No number was specified.');
}

// net.write(JSON.stringify(`{ "clock":${delay} }`));
net.write(delay);

client.on('message', message => {
	if (message.value === 'done') {
		console.log(`Counter is done!`);
		net.end();
	} else {
		console.log(`Unrecognized message type: ${message}`);
	}
});

client.on('close', () => {
	console.log('Client disconnected from server.');
});

// Error Handler
client.on('error', (err) => {
	console.log("Caught some type of socket error: ");
	console.log(err.stack);
	});