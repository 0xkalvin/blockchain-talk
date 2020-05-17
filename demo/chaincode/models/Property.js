'use strict';
const cuid = require('cuid');

function Property(payload){

    function buildInformationPayload(payload){
        return Object.assign({
            id: cuid(),
            what: 'PROPERTY',
            status: 'SELLING',
            created_at: Date.now(),
            updated_at: Date.now(),
            offers: [],
        }, payload);
    }

    this.information = buildInformationPayload(payload);
}

Property.prototype.getInformation = function getInformation(){
    return this.information;
};

module.exports = Property;