const ChangesStream = require('changes-stream');
const Request = require('request');
const Normalize = require('normalize-registry-metadata');

const db = 'http://172.17.0.1:5984/registry';

var changes = new ChangesStream({
  db: db,
  include_docs: true
});

changes.on('data', function(change) {
  if (change.doc.name && happenedRecently(change.doc)) {
    postToSlack(change.doc);
  }
});

function happenedRecently(doc) {
  var timeStamp = new Date(doc.time['modified']);
  var diff = new Date() - timeStamp;
  return diff < 6000;
}

function postToSlack(doc) {
    console.log('time to post', doc.name);
    Request({
      method: 'POST',
      url: 'https://hooks.slack.com/services/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',
      headers: {
        'Content-Type': 'application/json'
      },
      body: {
        "text": `${doc.name} updated to ${doc['dist-tags']['latest']}`
      },
      json: true
    }, function (error, response, body) {

    });
}
