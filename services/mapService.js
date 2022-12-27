/***
 ***	This is the mapService call containing REST requests to the CRUD-API gateway
 ***
 ***	These calls should be login/session checked 
 ***/
/**     DB services OSI Pysical  L1   performs the low loevel actions of conversion between dynamo syntax and class and direct interface to dynamo */
/**     DB services OSI DataLink L2   performs the building of the dynamo key setup for the needed query  */
/**     DB services OSI Network  L3   these are calls for specific actions ie. get all the users interested in a package return class in res */

/**     Remember, in AWS SDK v2.463.0, all you need to do is to set the environment variableAWS_NODEJS_CONNECTION_REUSE_ENABLED to 1. */
/**     usefull dynamo performance experiments https://mojitocoder.medium.com/how-to-quickly-load-a-large-amount-of-records-to-aws-dynamodb-94524ea249dc */

/** KeyConditions:: EQ | LE | LT | GE | GT | BEGINS_WITH | BETWEEN
 *  FilterExpression:: EQ | NE | LE | LT | GE | GT | NOT_NULL | NULL | CONTAINS | NOT_CONTAINS | BEGINS_WITH | IN | BETWEEN
 * 
 *  aws dynamodb list-tables
 *  aws dynamodb describe-table --table-name Avocado10_T
 *  aws dynamodb query --table-name "Avocado10_T" --index-name "Avocado10_TGSI-1" --key-condition-expression "g1pk=:g1pk and  begins_with ( g1sk , :g1sk )"  --expression-attribute-values file://../dynamoCLI/expression_attributes.json 
 * 
 *  param options:
 *  var params = { TableName: tableName,  ExpressionAttributeValues: { ':pk': {S: compKey} }, //,    ':sk' : {S: compKey} 
 *                 KeyConditionExpression: 'pk = :pk',
 *                 ProjectionExpression: 'pk'
 *                 FilterExpression: 'contains (Subtitle, :topic)',
 *  };
 * 
 * DynamoDB types :
 * Java type	            DynamoDB type
 * All number types       N (number type)
 * Strings                S (string type)
 * Boolean	              BOOL (Boolean type), 0 or 1.
 * ByteBuffer	            B (binary type)
 * Date	                  S (string type). The Date values are stored as ISO-8601 formatted strings.
 * Set collection types	  SS (string set) type, NS (number set) type, or BS (binary set) type.

 **/


const AWS                 = require("aws-sdk");
const axios               = require('axios');
const moment              = require("moment");
//const {CustomError}     = require("../helpers/error");

// ******** Modify these 4 lines to match your values ********* //
AWS.config.update({ region: "us-east-2" });
const tableName = 'Avocado10_T'
const url = `https://31dh86gvx9.execute-api.eu-central-1.amazonaws.com/dev/tbl`;   // ?query=${req.query.queryStr}
//const url = `http://localhost:3000/dev/tbl`;   // ?query=${req.query.queryStr}


const dynamoDB = new AWS.DynamoDB();
////////// return values for dynamoDB
if (dynamoDB == undefined) console.log("!!! connect failed !!!")


/************
////const express			  = require('express');
const app = express();

app.get('/login', (req, res) => {
  res.cookie('session', 'session_value', {
    maxAge: 30 * 60 * 1000, // 30 minutes
    httpOnly: true,
    secure: true,
  });
  res.send('Cookie set');
});
***************/


/*var dynamoDB = new AWS.DynamoDB({
  accessKeyId: config.ACCESS_KEY,
  secretAccessKey: config.ACCESS_SECRET,
  region: config.REGION
});*/

								// Create, Query, ScanEntireTable, Update, UpdateItem, DeleteRecords
/* mBody = {
		type  :"Create", 		
		tableName  :'theTable'
}*/
/* mBody = {
		type  :"Query", 	
		tableName  :'theTable',
		[ IndexName: 'Avocado10_TGSI-1' ]
		ExpressionAttributeValues: { ':hname': {'S': 'Pend'} },
		KeyConditionExpression: 'g1pk = :g1pk  and   begins_with ( g1sk , :g1sk )'
}*/
/* mBody = {
		type  :"ScanEntireTable", 	
		tableName  :'theTable',
		ExpressionAttributeValues: { ':hname': {'S': 'Pend'} },
		FilterExpression : 'begins_with (city, :hname)'
}*/
/* mBody = {
		type  :"Update", 	
		tableName  :'theTable',
		Item: {	pk  :"OPTR#", sk :"KD#VL#", ... }
		if (conditionExpression != '') params.ConditionExpression = conditionExpression;
}*/
/* mBody = {
		type  :"UpdateItem", 	
		TableName  :'theTable',
		Expression_attribute_values = { ':new_sk': {'S': 'NEW#SK#value'} }
	    Key : { 'pk': {'S': 'ABC'}, 'sk': {'S': 'DEF'} },
		Update_expression = 'SET sk = :new_sk'
}*/
/* mBody = {
		type  :"UpdateWriteBatch", 	
		TableName  :'theTable',
		Request = "DeleteRequest",
	    KKey : [Key:{ 'pk': {'S': ':pk'}, 'sk': {'S': ':sk'} },]
}*/
/* mBody = {
		type  :"Delete", 	
		tableName  :'theTable',
		key: { pk :"OPTR#", sk :"KD#VL#" }
}*/
/* additional parameter for all of the above
		[ ConditionExpression = .... ] are:
								Comparison operators: =, <, <=, >, >=, BETWEEN, IN
								Logical operators: AND, OR, NOT
								Functions: attribute_exists, attribute_not_exists, attribute_type, begins_with, contains, size
		[ ReturnValues = ... ] are:
								NONE: No information is returned in the response.
								ALL_OLD: Returns the item as it was before the update operation.
								UPDATED_OLD: Returns only the attributes that were updated and their old values.
								ALL_NEW: Returns the item as it is after the update operation.
								UPDATED_NEW: Returns only the attributes that were updated and their new values.
*/

/* a Query call example
const resp = await mapService.tRead('Query', {':g1pk': {S: "KRM"}, ':g1sk' : {S: 'K'}}, 'g1pk = :g1pk  and   begins_with ( g1sk , :g1sk )', 'indexName');
  console.log(resp);
*/

/***		Callback logic
function asyncOperation ( a, b, c, callback ) {
  // ... lots of hard work ...
  if ( / * an error occurs * / ) {
    return callback(new Error("An error has occurred"));
  }
  // ... more work ...
  callback(null, d, e, f);
}

asyncOperation ( params.., function ( err, returnValues.. ) {
  //This code gets run after the async operation gets run
});
***/



               /** **** L4 functions **** **/

//
async function tCreate(type='Create') {
  try {
    let res = '';
	const resp = await axios({ method: 'GET', url: url+'Create', headers:{ Accept: 'application/json' }, params: { TableName: tableName } });
				 return resp.data;
  } catch(err) { console.log(err.message); return err.message;}
}

async function tRead(type='Query', ExpressionAttributeValues, findExpression, indexName=null) {
	try {
		var params = {};
		if (type === 'ScanEntireTable') {
			params = { TableName: tableName, FilterExpression : findExpression, ExpressionAttributeValues: ExpressionAttributeValues };
		}
		else {
			params = { TableName: tableName, KeyConditionExpression : findExpression, ExpressionAttributeValues: ExpressionAttributeValues };
			if (indexName != null) params.IndexName = indexName;
		}
		let res = '';
		const resp = await axios({ method: 'POST', url: url+'Read', headers:{ Accept: 'application/json' }, data:JSON.stringify(params), params: { type: type } });
						//console.log(resp.data);
						let xxx = mapModels(resp.data);  //console.log(xxx);//.sysCntr[0]);
						return xxx;
	} catch(err) { console.log(err.message); return err.message;}
}

async function tUpdate(type='Update', Item=null, ExpressionAttributeValues=null, findExpression=null, key=null, conditionExpression=null) {
  try {
	var params = {};
	if (type === 'UpdateWriteBatch') {
		params = { RequestItems: { tableName : [ {DeleteRequest: {Key: kkey[0]}}, {DeleteRequest: {Key: kkey[1]}}, {DeleteRequest: {Key: kkey[2]}} ] } };
		console.log(params);
		return("error function not aviialable yet");
		if (conditionExpression != null) params.ConditionExpression = conditionExpression;
	}
	else if (type === 'UpdateItem') {
		params = { TableName: tableName, Key: key, UpdateExpression : findExpression, ExpressionAttributeValues: ExpressionAttributeValues, ReturnValues: "UPDATED_NEW" };
		if (conditionExpression != null) params.ConditionExpression = conditionExpression;
	}
	else {
		params = { TableName: tableName, Item : Item };
		if (conditionExpression != null) params.ConditionExpression = conditionExpression;
		else params.ConditionExpression = "attribute_not_exists(pk)";
	}
	let res = '';
	const resp = await axios({ method: 'POST', url: url+'Update', headers:{ Accept: 'application/json' }, data:JSON.stringify(params), params: { type: type } })
				 if (JSON.stringify(resp.data) === '{}') return "OK";
				 else return resp.data;
  } catch(err) { console.log(err.message); return err.message;}
}

async function tDelete(type='DeleteRecords', key) {
  try {
	params = { TableName: tableName, Key : key };
	//console.log(params);
    let res = '';
	const resp = await axios({ method: 'POST', url: url+'xDelete', headers:{ Accept: 'application/json' }, data:JSON.stringify(params) });
				 if (JSON.stringify(resp.data) === '{}') return "OK";
				 else return resp.data;
  } catch(err) { console.log(err.message); return err.message;}
}



function mapModels(dataStr) {
	//console.log(dataStr);
	let data = {};
	if (typeof dataStr === 'object') data = dataStr;
	else	try {	data = JSON.parse(dataStr); } catch(err) { return dataStr}; 
	//console.log(data.Items);
	var res= {};
//  data.Items.forEach(function(element, index, array)  { //console.log(JSON.stringify(element)); });
    const kurum = data.Items.filter((rec) => rec.krmRootName);
    const employee = data.Items.filter((rec) => rec.role);
    const olumsuz = data.Items.filter((rec) => rec.neg_No);
    const paket = data.Items.filter((rec) => rec.listPrice);
    const broker = data.Items.filter((rec) => rec.D_bkrSince);
    const brkr2krm = data.Items.filter((rec) => rec.map_b2k);
    const sysCntr = data.Items.filter((rec) => rec.countUp);
    const galaxy = data.Items.filter((rec) => rec.D_gxSince);
    const gxProf = data.Items.filter((rec) => rec.gxNameNameLast);
//  }
  res = {Count: data.Count}
  if (kurum.length > 0)res.kurum = kurum;
  if (employee.length > 0)res.employee = employee;
  if (olumsuz.length > 0)res.olumsuz = olumsuz;
  if (paket.length > 0)res.paket = paket;
  if (broker.length > 0)res.broker = broker;
  if (brkr2krm.length > 0)res.brkr2krm = brkr2krm;
  if (sysCntr.length > 0)res.sysCntr = sysCntr;
  if (galaxy.length > 0)res.galaxy = galaxy;
  if (gxProf.length > 0)res.gxProf = gxProf;
  //console.log(res);
  return res;
}

module.exports = {
    // ISO OSI Level 4
  mapModels,
  tCreate,
  tRead,
  tUpdate,
  tDelete
};
