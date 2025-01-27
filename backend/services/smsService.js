const twilio = require('twilio')


const accountSid = process.env.TWILIO_ACC_SID
const authToken = process.env.TWILIO_AUTH_TOKEN
const phoneNo = process.env.TWILIO_VIRTUAL_PHONE


const client = twilio(accountSid, authToken)


async function createMessage(body, to){
    const message = await client.messages.create({
        body:body,
        from:phoneNo,
        to: to,
    })
    console.log(message);
}

module.exports = {
    createMessage,
};
