const { isProfane } = require('no-profanity');

const checkProfanity = (text) => {
    if (!text) {
        return false;
    }
    
    const result = isProfane(text);
    return result;
};

module.exports = {
    isProfane: checkProfanity
};