var restify = require('restify');
var builder = require('botbuilder');
//var apiaiRecognizer = require('./apiai_recognizer');

var apiairecognizer = require('botbuilder-apiai');
var recognizer = new apiairecognizer('15327aa0af6d4404843372d9b09aa2ed');

// Create chat connector for communicating with the Bot Framework Service
var connector = new builder.ChatConnector({appId: process.env.MICROSOFT_APP_ID, appPassword: process.env.MICROSOFT_APP_PASSWORD});

// Receive messages from the user and respond by echoing each message back (prefixed with 'You said:')
var bot = new builder.UniversalBot(connector, {persistConversationData: true});

var intents = new builder.IntentDialog({recognizers: [recognizer], intentThreshold: 0.2, recognizeOrder: builder.RecognizeOrder.series});

intents.matches('Payment Status', '/payment.status');
intents.matches('Default Welcome Intent', '/default.welcome');
intents.matches('Default Fallback Intent', '/default.fallback');

bot.dialog('/', intents);

bot.dialog('/default.welcome', [function(session, args, next) {
    console.log(args);
    var fulfillment = builder.EntityRecognizer.findEntity(args.entities, 'fulfillment');
    if (fulfillment) {
      var speech = fulfillment.entity;
      session.endDialog(speech);
    }
  }
]);
bot.dialog('/default.fallback', [function(session, args, next) {
    console.log(args);
    var fulfillment = builder.EntityRecognizer.findEntity(args.entities, 'fulfillment');
    if (fulfillment) {
      var speech = fulfillment.entity;
      session.endDialog(speech);
    }
  }
]);
bot.dialog('/payment.status', [function(session, args, next) {
    console.log(args);
    var vendor = builder.EntityRecognizer.findEntity(args.entities, 'vendor');
    console.log(vendor);
    session.endDialog('Thank you for enquiring about your payment status.');
  }
]);

// Setup Restify Server
var server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3978, function() {
  console.log('%s listening to %s', server.name, server.url);
});

// Listen for messages from users
server.post('/api/messages', connector.listen());
