const line = require('@line/bot-sdk');

module.exports = async function(context, mySbMsg) {
    context.log('JavaScript ServiceBus queue trigger function processed message', mySbMsg);
    context.log('mySbMsg:' + JSON.stringify(mySbMsg));
    context.log('message.text:' + mySbMsg.data.events[0].message.text);
    context.log('replyToken:' + mySbMsg.data.events[0].replyToken);

    const client = new line.Client({
        channelAccessToken: process.env['LINE_CHANNEL_ACCESS_TOKEN']
    });

    const message = {
        type: 'text',
        text: 'Service Bus reply: ' + mySbMsg.data.events[0].message.text
    };

    client.replyMessage(mySbMsg.data.events[0].replyToken, message)
        .then(() => {
            // ...
            context.log('reply success');
        })
        .catch((err) => {
            // error handling
            context.log('reply error: ' + err);
        });
};