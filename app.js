const express = require('express');
const app = express();
const eCommerceRoute = require('./routes/e-commerce');

app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use('/', eCommerceRoute);

app.all('*', (req, res) => {
    res.status(404).json({success: false, message: 'Resource not found'});
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
});