// format message as object


const moment = require("moment"); //we did npm install moment for time formats

function formatMessage(username, text){
    return {                       //return object
        username,
        text,
        time: moment().format('h:mm a')  // format as hour:minute am/pm
    };
}

module.exports = formatMessage;