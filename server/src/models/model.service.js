import mongoose from "mongoose";

const servicesSchema = new mongoose.Schema({
name : {type : String , required : true},
description : {type : String , required : true},
price : {type : String  , default : false},
hour : {type : String , default : false},
actionButtonText : {type : String , default : false},
actionButtonDestinationLink : {type : String , default : false},
},{versionKey:false})


export const ServiceModel = mongoose.model('Service',servicesSchema);


// this model will used for store users services that they are provide
// in database 
// ex : one:one session , courses etc...