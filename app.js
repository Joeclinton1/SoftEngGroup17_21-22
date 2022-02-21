const path = require('path');
const express = require('express');
const app = express();
const publicPath = path.join(__dirname, 'build');

app.use(express.static(publicPath));

//Initialize Watson instance
const DiscoveryV1 = require('ibm-watson/discovery/v1');
const { IamAuthenticator } = require('ibm-watson/auth');

const discovery = new DiscoveryV1({
version: '2019-04-30',
authenticator: new IamAuthenticator({
    apikey: '__Kp8R3pLrESr2vmVT4vRjsgBEo5ZKkWHPPar0pOOti2',
}),
serviceUrl: 'https://api.eu-gb.discovery.watson.cloud.ibm.com/instances/d874b546-9b02-4c6a-bc6c-3042fedb37be',
});


app.get('/queryWD', (req, res) => {

    var text = String(req.query.qtext)

    //initialize query parameters
    const queryParams = {
        environmentId: '8b58da18-58c8-49eb-b5d4-4cbc7d7f58fa',
        collectionId: '2e651944-431c-4dbc-b407-716036caea75',
        configurationId: '90941570-b5c8-4d55-b39a-cd9b26cdf9a8',
        naturalLanguageQuery: text,
        passagesFields: 'text, subtitles, titles'
    };

    discovery.query(queryParams)
        .then(queryResponse => {

            res.setHeader("Access-Control-Allow-Origin", "*");
            res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
            res.setHeader("Content-Type", "application/json");
            res.json(queryResponse)

        })
        .catch(err => {
            //Handle errors
            console.log("WD ERROR")
            res.setHeader("Access-Control-Allow-Origin", "*");
            res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
            res.setHeader("Content-Type", "application/json");
            res.json({result: {matching_results: 0}})
        });
});

app.listen(9000, () => {
  console.log('Express server is active');
});