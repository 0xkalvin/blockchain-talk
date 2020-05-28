'use strict';

const { Contract } = require('fabric-contract-api');
const Property = require('../models/Property');
const Offer = require('../models/Offer');

const iteratorToArray = require('../utils/iterator-to-array');
const buildKey = require('../utils/build-key');
const buildSignature = require('../utils/build-signature');


class RealStateContract extends Contract {
    async createProperty(ctx, payloadAsString) {
        const parsedPayload = JSON.parse(payloadAsString);

        const property = new Property(parsedPayload);
        const properyInformation = property.getInformation();

        const buffer = Buffer.from(JSON.stringify(properyInformation));
        const key = buildKey('PROPERTY', properyInformation.id);

        await ctx.stub.putState(key, buffer);

        return properyInformation;
    }

    async getAllProperties(ctx) {
        const query = {
            selector: {
                what: 'PROPERTY',
            },
        };

        const iterator = await ctx.stub.getQueryResult(JSON.stringify(query));
        const properties = await iteratorToArray(iterator, false);

        return properties;
    }

    async createOffer(ctx, payloadAsString) {
        const parsedPayload = JSON.parse(payloadAsString);

        const { property_id } = parsedPayload;
        const propertyKey = buildKey('PROPERTY', property_id);
        const propertyAsBuffer = await ctx.stub.getState(propertyKey);

        if (!propertyAsBuffer || propertyAsBuffer.length <= 0) {
            throw new Error('Property does not exist');
        }

        const offer = new Offer(parsedPayload);
        const offerInformation = offer.getInformation();

        const property = JSON.parse(propertyAsBuffer.toString());
        property.offers.push(offerInformation.id);

        const offerAsBuffer = Buffer.from(JSON.stringify(offerInformation));
        const offerKey = buildKey('OFFER', offerInformation.id);

        await ctx.stub.putState(offerKey, offerAsBuffer),
        await ctx.stub.putState(propertyKey, Buffer.from(JSON.stringify(property)));

        await ctx.stub.setEvent('new-offer', offerAsBuffer);

        return offerInformation;
    }

    async getHistory(ctx, what, id) {
        const key = buildKey(what, id);
        const iterator = await ctx.stub.getHistoryForKey(key);
        const result = await iteratorToArray(iterator, true);
        return result;
    }

    async addSellerSignature(ctx, offerId) {
        const key = buildKey('OFFER', offerId);
        const offerAsBuffer = await ctx.stub.getState(key);

        if (!offerAsBuffer || offerAsBuffer.length <= 0) {
            throw new Error('Offer does not exist');
        }

        const offer = JSON.parse(offerAsBuffer.toString());

        const signaturePayload = Object.assign({}, offer, { now: Date.now() });
        const signature = buildSignature(signaturePayload);

        offer.status = 'WAITING_BUYER_SIGNATURE';
        offer.seller_signature = signature;

        await ctx.stub.putState(key, Buffer.from(JSON.stringify(offer)));

        return offer;
    }

    async addBuyerSignature(ctx, offerId) {
        const key = buildKey('OFFER', offerId);
        console.log(key);
        const offerAsBuffer = await ctx.stub.getState(key);
        console.log(offerAsBuffer);

        if (!offerAsBuffer || offerAsBuffer.length <= 0) {
            throw new Error('Offer does not exist');
        }

        const offer = JSON.parse(offerAsBuffer.toString());

        const signaturePayload = Object.assign({}, offer, { now: Date.now() });
        const signature = buildSignature(signaturePayload);

        offer.status = 'WAITING_PAYMENT';
        offer.buyer_signature = signature;

        await ctx.stub.putState(key, Buffer.from(JSON.stringify(offer)));

        return offer;
    }

    async payOffer(ctx, offerId) {
        const offerKey = buildKey('OFFER', offerId);
        const offerAsBuffer = await ctx.stub.getState(offerKey);

        if (!offerAsBuffer || offerAsBuffer.length <= 0) {
            throw new Error('Offer does not exist');
        }

        const offer = JSON.parse(offerAsBuffer.toString());
        offer.status = 'FINALIZED';

        const propertyKey = buildKey('PROPERTY', offer.property_id);
        const propertyAsBuffer = await ctx.stub.getState(propertyKey);

        if (!propertyAsBuffer || propertyAsBuffer.length <= 0) {
            throw new Error('Property does not exist'); // should not happen
        }

        const property = JSON.parse(propertyAsBuffer.toString());
        property.status = 'SOLD';

        await ctx.stub.putState(offerKey, Buffer.from(JSON.stringify(offer))),
        await ctx.stub.putState(propertyKey, Buffer.from(JSON.stringify(property)));

        return offer;
    }
}

module.exports = RealStateContract;
