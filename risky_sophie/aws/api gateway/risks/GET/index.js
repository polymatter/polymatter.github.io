const AWS = require('aws-sdk');
const dynamodb = new AWS.DynamoDB({region: 'eu-west-2', apiVersion: '2012-08-10'});

exports.handler = (event, context, callback) => {
    const params = {
        TableName: 'Risks' 
    }
    
    dynamodb.scan(params, function(error, data) {
        if (error) {
            console.log(error);
            callback(error);
        } else {
            let normalData = data.Items.map(i => { 
                return { 
                    id: i.Id.S
                    ,level: i.Level.S 
                    ,label: i.Label.S
                    ,mitigation: i.Mitigation.S
                    ,contingency: i.Contingency.S
                    ,impact: i.Impact.S
                    ,likelihood: i.Likelihood.S
                }});
            callback(null, normalData);
        }
    });
};
