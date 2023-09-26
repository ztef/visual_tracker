/*
Visual Interaction Systems Corp.


Proyecto VISUAL TRACKER SERVER 



*/



const express = require('express')

const cors = require('cors');
//const fs = require('fs');
//const { rawListeners } = require('process');





const app = express();
var router = express.Router();


app.use(cors());
app.options('*', cors());
router.use(cors());
app.use("/",router);


app.use(express.static('front'));

router.get('/getMenu',(_req, res) => {
  if(_req.query.usr == 'visualcemex'){
    res.sendFile(__dirname + "/public/customers/cemex/menucemex.html");
  } else {
     res.sendFile(__dirname + "/public/customers/general/menu.html");
  }
});






const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log(`Visual TRACKER Server , corriendo escuchando en puerto : ${port}!`);
});
