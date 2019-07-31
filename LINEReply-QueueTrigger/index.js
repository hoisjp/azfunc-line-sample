const line = require('@line/bot-sdk');

module.exports = async function (context, myQueueItem) {
    context.log('JavaScript queue trigger function processed work item', myQueueItem);
    context.log('message.text:' + myQueueItem.data.events[0].message.text);
    context.log('replyToken:' + myQueueItem.data.events[0].replyToken);

    const client = new line.Client({
        channelAccessToken: process.env['LINE_CHANNEL_ACCESS_TOKEN']
    });

    const message = {
        type: 'text',
        text: 'Queue reply: ' + myQueueItem.data.events[0].message.text
    };

    client.replyMessage(myQueueItem.data.events[0].replyToken, message)
        .then(() => {
            // ...
            context.log('reply success');
        })
        .catch((err) => {
            // error handling
            context.log('reply error: ' + err);
        });
};