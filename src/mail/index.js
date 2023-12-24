const mailgun = require("mailgun-js");
const DOMAIN = process.env.MAILGUN_DOMAIN;
const mg = mailgun({apiKey: '82ac3b1f9818970d7609cf7e070b2a52-ef80054a-ee772020', domain: DOMAIN});
const data = {
	from: 'postmaster@sandbox079611ddfde94d77bc2d16b368d1b40d.mailgun.org',
	to: 'jindal1808@gmail.com',
	subject: 'Hello',
	text: 'Testing some Mailgun awesomness!'
};
mg.messages().send(data, function (error, body) {
	console.log(body);
	console.log(error);
});