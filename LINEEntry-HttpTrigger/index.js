var EventGridClient = require("azure-eventgrid");
var msRestAzure = require('ms-rest-azure');
var uuid = require('uuid').v4;
var url = require('url');

module.exports = async function (context, req) {
    context.log('JavaScript HTTP trigger function processed a request.');
    context.log(JSON.stringify(req.body));

    context.res = {
        status: 200, /* Defaults to 200 */
        body: "Hello " + (req.body.events[0].message.text)
    };

    // see also this sample code: https://azure.microsoft.com/ja-jp/resources/samples/event-grid-node-publish-consume-events/
    let events = [
        {
            id: uuid(),
            subject: 'TestSubject',
            dataVersion: '1.0',
            eventType: 'Microsoft.MockPublisher.TestEvent',
            data: {
                events: req.body.events,
                destination: req.body.destination
            },
            eventTime: new Date()
        }
    ];

    let topicCreds = new msRestAzure.TopicCredentials(process.env['EVENTGRID_KEY']);
    let EGClient = new EventGridClient(topicCreds);
    let topicEndPoint = process.env['EVENTGRID_TOPICENDPOINT'];
    let topicUrl = url.parse(topicEndPoint, true);
    let topicHostName = topicUrl.host;

    EGClient.publishEvents(topicHostName, events).then((result) => {
        return Promise.resolve(context.log('Published events successfully. result:' + result));
    }).catch((err) => {
        context.log('An error ocurred: ' + err);
    });
};