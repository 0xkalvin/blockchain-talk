'use strict';

const cuid = require('cuid');

module.exports = (what, id = null) => {
    if(id){
        return `${what}_${id}`;
    }

    return `${what}_${cuid()}`;
};
