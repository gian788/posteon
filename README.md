
#Posteon
[![NPM version](http://img.shields.io/npm/v/posteon.svg)](https://www.npmjs.org/package/posteon)

** Pre-alpha version **

Description

A provider indipendent email module, based on mongoDB.

This software is released under the MIT license. See `LICENSE` for more details

## Supported providers
* [Mandrill](https://mandrillapp.com/api/docs/)
* [Sendgrid](https://sendgrid.com/docs/API_Reference/index.html)
* [PostMark](http://developer.postmarkapp.com/)
* [Mailgun](https://documentation.mailgun.com/api_reference.html)
* [MailJet](http://dev.mailjet.com/guides/#about-the-mailjet-restful-api)
* [SMTP]() 

## Download and Installation

From the command line

	$ npm install posteon

package.json

	dependencies: {
      ...
      "": "*$version*",
      ...
    }
    ...

## Example use

```javascript
var posteon = require('posteon');

posteon.init({
	dbs: {
		mongoDB: {
			uri: 'mongodb://localhost/mailer-dev',
			debug: false,
			options: {},
		},
	},
	lockTime: 60 * 1000,
});

var options = {
	provider: {
		name: 'sendgrid',
		apiKey: YOUR_APIKEY
	},
	options: {
		to: {

		}
	}
};

posteon.send(options, function (err, message) {
	...
});
```


## Send options

```javascript

var options = {
  provider: {
    name: 'sendgrid',
    apiKey: 'YOUR_APIKEY'
  },
  to: [{
    email: 'to@email.com',
    name: 'Jack Smith',
    data: {
      name: 'Jack Smith'
    }
    metadata: {
      userId: '1345698abcd'
    }
  }],
  from: {
    name: 'Mailer',
    email: 'from@email.com'
  }
  subject: 'Email subject',
  html: '<h1>Html body</h1>',
  text: 'text body',
  attachments: [
    {
      name: 'file.txt',
      content: Buffer,
      contentType: 'text/plain',//MIME Type
    }
  ],
  images: [
    {
      name: 'picture.png',
      content: Buffer,      
    }
  ],
  tags: ['tag_1', 'tag_2'],
  headers: {
    'X-Replay-To': 'replay@email.com',
  },
  metadata: {
    appId: 'x895r5t',
  },

  //other provider specific options
}
```
