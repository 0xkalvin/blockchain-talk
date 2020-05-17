'use strict';

module.exports = async function extractIterator(iterator, isHistory) {
    let allResults = [];
    // eslint-disable-next-line no-constant-condition
    while (true) {
        let res = await iterator.next();
        if (res.value && res.value.value.toString()) {
            let jsonRes = {};
            let value;
            if (isHistory && isHistory === true) {
                jsonRes.TxId = res.value.tx_id;
                jsonRes.Timestamp = res.value.timestamp;
                jsonRes.IsDelete = res.value.is_delete.toString();
                try {
                    value = JSON.parse(res.value.value.toString('utf8'));
                } catch (err) {
                    value = res.value.value.toString('utf8');
                }
            } else {
                jsonRes.key = res.value.key;
                try {
                    value = JSON.parse(res.value.value.toString('utf8'));
                } catch (err) {
                    value = res.value.value.toString('utf8');
                }
            }
            allResults.push(Object.assign({}, jsonRes, value));
        }
        if (res.done) {
            await iterator.close();
            return allResults;
        }
    }
};