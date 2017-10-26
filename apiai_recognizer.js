var apiai = require('apiai');

var app = apiai('15327aa0af6d4404843372d9b09aa2ed');

module.exports = {
  recognize: function(context, callback) {
    var request = app.textRequest(context.message.text, {sessionId:context.message.address.conversation.id});

    request.on('response', function(response) {
      var result = response.result;
      callback(null, {
        intent: result.metadata.intentName,
        score: result.score,
        entities: Object.keys(result.parameters)
                    .filter(key => !!result.parameters[key])
                    .map(key => ({
                        entity: result.parameters[key],
                        type: key,
                        score: 1
                    }))
      });
    });

    request.on('error', function(error) {
      callback(error);
    });

    request.end();
  }
};
