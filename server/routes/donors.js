//Importing modules
var express = require('express');
var router = express.Router();
// Import Donor Model
var Donor=require('../model/donor');
var index=require('./index');

var nodemailer = require('nodemailer');
var transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: 'bloodbank77@gmail.com',
        pass: '***********'
    }
});

/* GET all donors. */
router.get('/', function(req, res) {
    Donor.find(function(err,donor) {
        if (err)
            res.send(err);
        res.json(donor);
    });
});

/* GET specific donor by id. */
router.get('/:donor_id', function(req, res) {
    Donor.findById(req.params.donor_id, function(err, donor) {
        if (err)
            res.send(err);
        res.json(donor);
    });
});

/*GET the profile for the given Email*/
router.get('/viewprofile/:id',function(req,res){
    var id=req.params.id;
    Donor.findOne({email:id},function(err,docfound) {
        if (err)
            res.json(err);
        var result=docfound._doc;
        res.render('profilepage.ejs',{
               firstname:result.firstname,
               lastname:result.lastname,
               age:result.age,
               gender:result.gender,
               bloodgroup:result.bloodgroup,
               contactnumber:result.contactnumber,
               emailaddress:result.email
        });
    });
});

/* POST donors */
router.post('/fillprofile', function(req, res) {
        Donor.remove({"email":req.body.email},function(err,removed){
            if(err || !removed)
            { }
            else{  }
        // create a new instance of the Donor model
        var donor = new Donor();
        // set the donor's properties (comes from the request)
        donor.email = req.body.email;
        donor.firstname = req.body.firstname;
        donor.lastname = req.body.lastname;
        donor.age = req.body.age;
        donor.gender = req.body.gender;
        donor.bloodgroup = req.body.bloodgroup;
        donor.contactnumber = req.body.contactnumber;
        // save the data received
        donor.save(function (err) {
            if (err)
                res.send(err);
         });
          res.redirect('/viewprofile/'+req.body.email);
        });
});




/* UPDATE specific donor by id. */
router.put('/:donor_id', function(req, res) {
    Donor.findById(req.params.donor_id, function(err,donor) {
        if (err)
            res.send(err);
        // set the donor's properties (comes from the request)
        donor.firstname = req.body.firstname;
        donor.lastname = req.body.lastname;
        donor.age = req.body.age;
        donor.gender = req.body.gender;
        donor.bloodgroup = req.body.bloodgroup;
        donor.contactnumber = req.body.contactnumber;
        // save the data received
        donor.save(function(err) {
            if (err)
                res.send(err);
            // give some success message
            res.json({ message: 'donor successfully updated!' });
        });
    });
});


router.get('/requestBlood/:emailid',function(req,res){
    var id=req.params.emailid;
    var bgroup;
    Donor.findOne({email:id},function(err,docfound) {
        if (err)
            res.json(err);
        var result = docfound._doc;
        bgroup = result.bloodgroup;
        Donor.find({bloodgroup: bgroup,email:{$ne:id},isdonor:true}, function (err, dcfound) {
            if (err)
                throw err;
            var data=JSON.stringify(dcfound);
            var text=JSON.parse(data);
            var messagetoBeSent="";
            if(dcfound.length>0) {
                 messagetoBeSent += "\nThe memebers with your BloodGroup are:";
                for (var i = 0; i < dcfound.length; i++) {
                    messagetoBeSent +=
                        "\nFirst Name:" + text[i].firstname +
                        "\nLastName:" + text[i].lastname +
                        "\nContact Number:" + text[i].contactnumber +
                        "\nEmail-ID:" + text[i].email +
                         "\n\n"
                }
                messagetoBeSent += "You Can Personally Request them For Blood";
            }
            else
            {
                messagetoBeSent+="\nNo Donors with this Blood Group"
            }
            var mailoptions={
                from: 'bloodbank77@gmail.com',
                to: req.params.emailid,
                subject: 'Blood Bank',
                text: messagetoBeSent
            };
            transporter.sendMail(mailoptions,function(err,info){
                if(err) {
                    console.log('in error');
                    throw (err);
                }
                console.log('Mail Sent'+info.response);
            });
            res.render('respondforrequest.ejs');
        });
    });
});


router.get('/donateBlood/:emailid',function(req,res) {
    var id = req.params.emailid;
    Donor.findOne({email: id}, function (err, docfound) {
        if (err)
            res.send(err);
        docfound.isdonor=true;
        docfound.save(function (err) {
            if (err)
                res.send(err);
            // give some success message
            res.json({message: 'donor successfully updated!'});
        });
        res.render('respondfordonate.ejs');
    });
});


/* DELETE specific donor by id. */
router.delete('/:donor_id', function(req, res) {
    Donor.remove( { _id: req.params.donor_id  }, function(err, donor) {
        if (err)
            res.send(err);
        // give some success message
        res.json({ message: 'donor successfully deleted!'});
    });
});

// Exports all the routes to router variable
module.exports = router;