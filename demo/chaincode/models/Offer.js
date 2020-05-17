'use strict';
const cuid = require('cuid');


function Offer(payload){

    function buildInformationPayload(payload){
        return Object.assign({
            id: cuid(),
            what: 'OFFER',
            status: 'WAITING_SELLER_SIGNATURE',
            created_at: Date.now(),
            updated_at: Date.now(),
        }, payload);
    }

    this.information = buildInformationPayload(payload);
}

Offer.prototype.getInformation = function getInformation(){
    return this.information;
};

module.exports = Offer;