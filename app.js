//jshint esversion:10
const express=require('express');
const bodyParser = require('body-parser');

const mailchimp=require("@mailchimp/mailchimp_marketing");

mailchimp.setConfig({
  apiKey: "234d30e4325e7c00c649bdfa0643ceab-us2",
  server: "us2",
});



const app = express();
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));
app.get('/', function(req,res){
  res.sendFile(__dirname+"/signup.html");
});
app.post('/', function(req,res){
  const  firstName=req.body.firstName;
  const lastName=req.body.lastName;
  const email=req.body.email;
  console.log(firstName,lastName,email);
  const  data={
    members:[
      {
        email_address:email,
        status:"subscribed",
        merge_fields: {
          FNAME:firstName,
          LNAME:lastName
        }
      }
    ]
  };
  const jsonData=JSON.stringify(data);
  const run = async () => {

    try {
      const response = await mailchimp.lists.batchListMembers("39e9f49355", data);
      res.sendFile(__dirname+"/success.html");
    }
    catch {
      res.sendFile(__dirname+"/failure.html");
    }
  };

  run();
});
app.post("/failure",function (req,res) {
  res.redirect('/');
});
app.listen(process.env.PORT || 3000, function(req,res){
  console.log("Server listening on port 3000");
});
//api key-234d30e4325e7c00c649bdfa0643ceab-us2
//id-39e9f49355
