const express = require('express')
const app = express()
var request = require("request");
var cors = require('cors');
var bodyParser = require('body-parser');
const mailjet = require('node-mailjet').connect('d7e11cd5c62ce4e65b7c322c1c997231', '174ee7708b1b239765b877b50c99dc90');

app.use(bodyParser.json());
app.use(cors());

app.use(function(req, res, next) {
  res.setHeader('Content-Type', 'application/json');
  next();
});

app.post('/',
	function(req, res)
	{
		console.log(req.body)
		console.log(req.head)
		var request = mailjet
			.post("send", {'version': 'v3.1'})
			.request({
				"Messages":[
					{
						"From": {
							"Email": "info@sandhooraholdings.lk",
							"Name": "Sandhoora Holdings Private Limited"
						},
						"To": [
							{
								"Email": req.body['email'],
								"Name": req.body['name']
							}

						],
						"TemplateID": 287422,
						"TemplateLanguage": true,
						"Subject": "Greetings From Sandhoora Holdings",
						"Variables": {
					      "name": req.body['name'],
					      "surname": req.body['surname'],
					      "message": req.body['message']
					    }
					},
					{
						"From": {
							"Email": "info@sandhooraholdings.lk",
							"Name": "sandhooraholdings.lk"
						},
						"To": [
							{
								"Email": "info@sandhooraholdings.lk",
								"Name": "Sandhoora"
							}
						],
						"TemplateID": 287911,
						"TemplateLanguage": true,
						"Subject": "sandhooraholdings.lk Contact Form",
						"Variables": {
						      "name": req.body['name'],
						      "surname": req.body['surname'],
						      "email": req.body['email'],
						      "message": req.body['message']
						    }
					}
				]
			})

		request
			.then((result) => {
				 mailjet.post('contact')
			     .request({email: req.body['email'],
			 			name: req.body['name'],
			 			surname: req.body['surname'],
			 			message: req.body['message']})
			     .catch((err) => {
					});
			     res.status(200).send(JSON.stringify({ success: true }));
				console.log(JSON.stringify(result.body))
			})
			.catch((err) => {
				res.status(400).send(JSON.stringify({ success: false }))
				console.log(err.statusCode)
			})
	})

app.listen(3000, () => console.log('Mailjet wrapper listening on port 3000'))
