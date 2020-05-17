'use strict';

const crypto = require('crypto');


const secret = 'super_secret_key';

module.exports = (payload) => {

    if(typeof payload !== 'string'){
        payload = JSON.stringify(payload);
    }

    const hash = crypto.createHmac('sha256', secret)
        .update(payload)
        .digest('hex');


    return hash;
};