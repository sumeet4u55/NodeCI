const mongoose = require('mongoose');
const keys = require('../config/keys');
const exec = mongoose.Query.prototype.exec;
const redis = require('redis');
// const redisurl = 'redis://127.0.0.1:6379';
const client = redis.createClient(keys.redisurl);
const util = require('util');

client.hget = util.promisify(client.hget);

mongoose.Query.prototype.cache = function(options = {}){
    this._useCache = true;
    this._hashKey = JSON.stringify(options.key || 'default');
    return this;
}

mongoose.Query.prototype.exec = async function() {

    if(!this._useCache){
        return exec.apply(this, arguments);
    }
    const obj = JSON.stringify( Object.assign({}, this.getQuery(), {
        collection: this.mongooseCollection.name
    }));

    const cachedValue = await client.hget(this._hashKey, obj);
    if(cachedValue){
        const doc = JSON.parse(cachedValue);
        
        return Array.isArray(doc) 
            ? doc.map(doc => new this.model(doc))
            : new this.model(doc);
    }

    const result = await exec.apply(this, arguments);
    client.hset(this._hashKey, obj, JSON.stringify(result), 'EX', 10);
    return result;
}

module.exports = {
    clearCache: function(hashkey){
        console.log('clearing')
        client.del(JSON.stringify(hashkey));
    }}