const AWS = require('aws-sdk');
const dynamodb = new AWS.DynamoDB({
    region: 'eu-west-2'
    ,apiVersion: '2012-08-10'
})

function updateRisk(event, context, callback) {
    // Only updates a single attribute!
    const eventProperties = Object.keys(event);
    const attribute = eventProperties.reduce((acc, value) => acc.toLowerCase() != 'id' ? acc : value);
    const value = event[attribute];
    const capitalize = string => string.charAt(0).toUpperCase() + string.slice(1);
    
    const params = {
        Key: {
            Id: {
                S: event.id
            }
        }
        ,TableName: 'Risks'
        ,ExpressionAttributeNames: {
            "#AT": capitalize(attribute)
        }
        ,ExpressionAttributeValues: {
            ":v": {
                S: value
            }
        }
        ,UpdateExpression: "SET #AT = :v"
    }
    
    dynamodb.updateItem(params, function(error, data) {
        if (error) {
            console.log(error);
            callback(error);
        } else {
            callback(null, data);
        }
    })
}

function createNewRisk(event, context, callback) {
    const params = {
        Item: {
            "Id": {
                "S": "Id_" + Math.random()
            }
            ,"Label": {
                "S": (event.label || "No Label")
            }
            ,"Level": {
                "S": (event.level || "High")
            }
            ,"Mitigation": {
                "S": event.mitigation
            }
            ,"Likelihood": {
                "S": event.likelihood
            },
            "Contingency": {
                "S": event.contingency
            },
            "Impact": {
                "S": event.impact
            }
        }
        ,TableName: "Risks"
    }
    
    dynamodb.putItem(params, function(error, data) {
        if (error) {
            console.log(error);
            callback(error);
        } else {
            callback(null, data)
        }
    })
}

exports.handler = (event, context, callback) => {
    
    if (event.id) {
        updateRisk(event, context, callback);
    } else {
        createNewRisk(event, context, callback);
    }
};
