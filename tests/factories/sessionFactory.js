const buffer = require('safe-buffer').Buffer;
const Keygrip = require('keygrip');
const keys = require('../../config/keys');
const keysig = new Keygrip([keys.cookieKey]);

module.exports = (user) => {
    const sessionObj = {
        passport: {
            user: user._id.toString()
        }
    }
    const session = buffer.from(JSON.stringify(sessionObj)).toString('base64');
    const sig = keysig.sign('session=' + session);

    return {
        session,
        sig
    }
}