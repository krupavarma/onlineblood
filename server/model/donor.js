var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var DonorSchema   = new Schema(
      {
          email:{type:String ,default: ''},
          firstname: { type: String, default: '' },
          lastname: { type: String, default: '' },
          age: { type:Number, default: '' },
          gender:{ type:String, default: '' },
          isdonor:{type:Boolean,default:false},
          bloodgroup: { type: String, default: '' },
          contactnumber: { type: Number ,default: '' },
          createdOn: { type: Date,   default: Date.now}
      });
module.exports = mongoose.model('Donor', DonorSchema);