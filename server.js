const express = require('express')
const app = express()
const router = express.Router()
const expHbs = require('express-handlebars');
const bcrypt = require('bcrypt')
const mongoose = require('mongoose')
const { exec } = require('child_process');//for bash script run

require('dotenv').config();
const urlsModel = require('./model/urlModel')
const connectionString = process.env.CONNECTION_STRING
app.use(express.static('public'));
app.use(express.urlencoded({extended:true}));
app.use(express.json());
app.engine('handlebars', expHbs.engine());
app.set('view engine', 'handlebars');
app.set('views', './views');
app.set('view options', { layout: 'main' });

app.get('/',(req,res) => {
    res.render('index')
})

app.post('/shortThis',async(req,res) => {

    const letters = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h',
     'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's',
      't', 'u', 'v', 'w', 'x', 'y', 'z','A', 'B', 'C', 'D', 'E',
       'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q',
        'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z']

    const numbers = ['1','2','3','4','5','6','7','8','9','0']
    let urlID = ""
    for(let i = 0; i<5; i++){
        //0 and 51 
        let randomNumber = Math.floor((Math.random() * 51 ))
        urlID += letters[randomNumber]
    }
    for(let k = 0; k<2;k++){
        let randomNumber = Math.floor((Math.random() * 10 ))
        urlID += numbers[randomNumber]
    }
    console.log(urlID)
    const final = {
        originalURL : req.body.originalURL,
        urlID,
        clickCount : 0 
    }    
    console.log(final)
    try{
        const model =new urlsModel(final)
        await model.save()
    }
    catch(error){
        console.error(error)
    }
    res.send({shortURl : urlID})
})

app.get('/:urlid',async (req,res)=>{
    console.log(req.params)
    const urlid = req.params.urlid
    try {
        const findURL = await urlsModel.find({urlID : urlid})
        console.log(findURL[0].originalURL)
        findURL[0].clickCount += 1
        await findURL[0].save()
        res.redirect(findURL[0].originalURL)
    
        
    } catch (error) {
        console.log(error)
    }

    
})

app.post('/github',async (req,res) => {

    const bashScriptPath = '/home/gavin/urls/urlShorter/updateProjectDirectoryOnPushEvent.sh';
    const afterUpdateBashScript = "/home/gavin/urls/urlShorter/afterUpdate.sh"
  // Bash betiğini çalıştır
  exec(`bash ${bashScriptPath}`, (error, stdout, stderr) => {
    if (error) {
      console.error(`Hata oluştu: ${error.message}`);
      return;
    }
    if (stderr) {
      console.error(`stderr: ${stderr}`);
      return;
    }
    console.log(`stdout: ${stdout}`);
  });

  exec(`bash ${afterUpdateBashScript}`, (error, stdout, stderr) => {
    if (error) {
      console.error(`Hata oluştu: ${error.message}`);
      return;
    }
    if (stderr) {
      console.error(`stderr: ${stderr}`);
      return;
    }
    console.log(`stdout: ${stdout}`);
  });



    res.send()
})


  mongoose.connect(connectionString).then(console.log('connection is success')).catch(e => console.log(e));
app.listen('3000' ,_ => {
    console.log("server listen on 3000 port")
})