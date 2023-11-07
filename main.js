/*
Visual Interaction Systems Corp.


Proyecto VISUAL TRACKER SERVER 



*/



const express = require('express')

const cors = require('cors');
//const fs = require('fs');
//const { rawListeners } = require('process');

const sheets = require('google-spreadsheet');


const fs = require('fs');

try {
  // Read the JSON file
  const rawData = fs.readFileSync('./key.json');
  var creds = JSON.parse(rawData);
  
  // Use the `creds` object
  console.log(creds);
} catch (error) {
  console.error('Error reading JSON file:', error);
}


const app = express();
var router = express.Router();


app.use(cors());
app.options('*', cors());
router.use(cors());
app.use("/",router);


app.use(express.static('front'));


async function getFromSheet(data){

  console.log("Leyendo google sheet");
  
  
  //var SPREADSHEET_ID = '1jcCmQGVd8e0iWGSKs9koz2wNKjgDQAdV4KRbL90eCyI';
  
  var SPREADSHEET_ID = data.sheet;

  
  const doc = new sheets.GoogleSpreadsheet(SPREADSHEET_ID);
  await doc.useServiceAccountAuth(creds);
  
  
  await doc.loadInfo();
  const sheet = doc.sheetsByIndex[0];

  var out = {};


        var rows =  await sheet.getRows();
        var headers = rows[0]._sheet.headerValues;
  
        headers.forEach((h,i,a)=>{
          console.log(h.toString());
        });

        rows.forEach((value,i,a)=>{
           
          var r = {};
           headers.forEach((h,j,a)=>{  
            r[headers[j]] = value[headers[j]];
            console.log(value[headers[j]]);
          });

          out[i] = r;

        })

        return out;
  }

  router.get('/getFromSheet',async (req, res) => {

    console.log("Recibiendo Info : ");
    //console.log(req.query.name);
  
       
           var out = await getFromSheet(req.query);
           res.write(JSON.stringify(out));
           res.end('');
  
  
  
  });




const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log(`Visual TRACKER Server , corriendo escuchando en puerto : ${port}!`);
});
