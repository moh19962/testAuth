const express      = require('express');
require('dotenv').config(); 
const app          = express();
const cors         = require("cors");
const bodyparser   = require("body-parser");
const port         = process.env.PORT || 3015;

//Je kunt hier passport-jwt gebruiken om de jwt uit te lezen
//voor de api-key

app.use(bodyparser.json());


//Een post aanmaken
app.post('/posts',(req,res)=>{
 //De api-key moet worden uitgelezen om er zeker van te zijn dat de request van 
 //de api gtw afkomstig is.
})

app.listen(port, () => {
    console.log('Server is up on port ' + port);
})
    


