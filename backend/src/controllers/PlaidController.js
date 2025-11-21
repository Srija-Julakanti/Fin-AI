const { PlaidApi } = require('plaid')
const serverJs = require('../../server')

const client = new PlaidApi(serverJs.configuration);

// Endpoint to create a link token
app.post('/create_link_token', async(req,res) => {
    try {
        const response = await client.linkTokenCreate({
            user:{
                client_user_id: 'KaaranRaahul'
            },
            client_name: 'Raahul',
            products:['transactions'],
            required_if_supported_products:['auth'],
            country_codes:['us'],
            language: "en"
        });
        res.json(response.data)
    } catch (error) {
        console.error('Error', error);
        res.json({
            error: error.message
        })
    }
}); 

// Endpoint to exchange a public token for an access token
app.post('/get_access_token', async (req, res) => {
    try {
        const publicToken = req.body.publicToken;
        const response = await client.itemPublicTokenExchange({
            public_token: publicToken
        });
        // Send the access token as JSON
        res.json({ accessToken: response.data.access_token });
    } catch (error) {
        console.error('Error', error);
        // Send error message as JSON
        res.json({
            error: error.message
        });
    }
});

// Endpoint to get transactions using an access token
app.post('/get_transactions', async (req, res) => {
    try {
        const response = await client.transactionsGet({
            access_token: req.body.token,
            start_date: '2023-01-01',
            end_date: '2023-12-31',
            options: {
                offset: 0
            }
        });
        // Send the transactions data as JSON
        res.json(response.data);
    } catch (error) {
        console.error('Error', error);
        // Send error message as JSON
        res.json({
            error: error.message
        });
    }
});

// Start the server on the specified port
app.listen(process.env.PLAID_PORT);