/**     DB services OSI Pysical  L1   performs the low loevel actions of conversion between dynamo syntax and class and direct interface to dynamo */
/**     DB services OSI DataLink L2   performs the building of the dynamo key setup for the needed query  */
/**     DB services OSI Network  L3   these are calls for specific actions ie. get all the users interested in a package return class in res */

/**     Remember, in AWS SDK v2.463.0, all you need to do is to set the environment variableAWS_NODEJS_CONNECTION_REUSE_ENABLED to 1. */
/**     usefull dynamo performance experiments https://mojitocoder.medium.com/how-to-quickly-load-a-large-amount-of-records-to-aws-dynamodb-94524ea249dc */

/** KeyConditions:: EQ | LE | LT | GE | GT | BEGINS_WITH | BETWEEN
 *  FilterExpression:: EQ | NE | LE | LT | GE | GT | NOT_NULL | NULL | CONTAINS | NOT_CONTAINS | BEGINS_WITH | IN | BETWEEN
 * 
 *  aws dynamodb list-tables
 *  aws dynamodb describe-table --table-name Galata_T
 *  aws dynamodb query --table-name Galata_T --key-condition-expression "CatName=:name and Age= :age" --expression-attribute-values file://expression_attributes.json 
 * 
 *  param options:
 *  var params = { TableName: tableName,  ExpressionAttributeValues: { ':pk': {S: compKey} }, //,    ':sk' : {S: compKey} 
 *                 KeyConditionExpression: 'pk = :pk',
 *                 ProjectionExpression: 'pk'
 *                 FilterExpression: 'contains (Subtitle, :topic)',
 *  };
 **/


const AWS                 = require("aws-sdk");
//var mongo               = require('mongodb');
const moment              = require("moment");
//const {CustomError}     = require("../helpers/error");

AWS.config.update({ region: "us-east-2" });
const dynamoDB = new AWS.DynamoDB();
////////// return values for dynamoDB
if (dynamoDB == undefined) console.log("!!! connect failed !!!")

/*var dynamoDB = new AWS.DynamoDB({
  accessKeyId: config.ACCESS_KEY,
  secretAccessKey: config.ACCESS_SECRET,
  region: config.REGION
});*/

const allTableNames = [ "Galata_T" ];
const tableAttributeMapping = {
  "Galata_T":   [ { "AttributeName":"pk",   "KeyType":"HASH",  "AttributeType":"S" },
                  { "AttributeName":"sk",   "KeyType":"RANGE",  "AttributeType":"S" },
                  { "GAname":"g1pk",   "GSI":"HASH",  "AttributeType":"S" },
                  { "GAname":"g1sk",   "GSI":"RANGE", "AttributeType":"S" } ,
                  { "IndexName":"gltGSI-1"}
                ]
  };

let dbReturned = [];

/**  test routines this should be a postman 
const theTable = "Buyers";
const theEmail = "Aliens2@Xgmail.com";
getUpdateBuyersAll();

async function getUpdateBuyersAll() {
var params = { TableName: theTable
      FilterExpression : "begins_with (#holder, :hname)",
      ExpressionAttributeNames: { "#holder": "holder" },    ExpressionAttributeValues: { ':hname': {S: "Albert"} }
};
var res = await dynamoScanAllTables(params) ;
params = { TableName: theTable
 //,  ExpressionAttributeValues: { ':pk': {S: "BYR#"+theEmail} },    KeyConditionExpression: 'pk = :pk' 
  ,  ExpressionAttributeValues: { ':pk': {S: "BYR#"+theEmail}, ':sk' : {S: 'PA'} },    KeyConditionExpression: 'pk = :pk  and   begins_with ( sk , :sk )' 
};
 // var res = await dynamoQueryTable(params);   console.log(dbReturned); console.log(dbReturned.buyer); console.log(dbReturned.orders[0]);
}
**/

const theTable = "Galata_T";
const theEmail = "OpAlien@Xgmail.com";
let dtodaye =  new Date();
let dtoday =  moment(dtodaye).format("YYYY-MM-DDTHH:MM:SS");

createAllTables() ;


                                      /** L5 functions */ /** These should be the calls made by the developer. so they should be just an example or used for testing only */


// *** query O-perator[M]/pack_id[1] or ManyPack_id[M] or A-ll[M] or acti-V-ity or D-ateRange or P-riceRange or T-itle or by W: JCKFN or Janra or CityCountry ***   // or G-roupings: F-avorite or N-ew  are also in JCK
// always bring back results with d_start >= today
///
//packageFindO(theEmail);

async function packageFindOO(ope, skv) {let req = {type:"OO", tableName:"theTable", pk:"BYR#"+ope, skv:"ORD#"}; return await packageFind(req)}     // returns many if pr_no is not defined
async function packageFindOOI(ope, skv) {let req = {type:"OOI1", tableName:"theTable", pk:"B#Ahmet Byr Ertuğrul#", skv:""}; return await packageFind(req)}     // returns many if pr_no is not defined
async function packageFindOP(ope, pid, rno) {let req = {type:"O", tableName:"theTable", pk:"BYR#"+ope, pid:pid, pr_No:rno, dfrom:dtoday}; return await packageFind(req)}     // returns many if pr_no is not defined

async function packageFindO(ope) {let req = {type:"O", tableName:"theTable", pk:"OPTR#"+ope, dfrom:dtoday}; return await packageFind(req)} 
async function packageFindOP(ope, pid, rno) {let req = {type:"O", tableName:"theTable", pk:"OPTR#"+ope, pid:pid, pr_No:rno, dfrom:dtoday}; return await packageFind(req)}     // returns many if pr_no is not defined
async function packageFindOD(ope, dfrom, dend) {let req = {type:"OD", tableName:"theTable", pk:"OPTR#"+ope, dend:"2023.01.15", dfrom:dtoday}; return await packageFind(req)} 
async function packageFindOW(ope, sword) {let req = {type:"OW", tableName:"theTable", pk:"OPTR#"+ope, sword:"disney", dfrom:dtoday}; return await packageFind(req)}    // this covers JCK
async function packageFindOJ(ope, sword) {let req = {type:"OJ", tableName:"theTable", pk:"OPTR#"+ope, sword:"Food", dfrom:dtoday}; return await packageFind(req)} 
async function packageFindOC(ope, sword) {let req = {type:"OC", tableName:"theTable", pk:"OPTR#"+ope, sword:"paris", dfrom:dtoday}; return await packageFind(req)} 
async function packageFindOT(ope, title) {let req = {type:"OT", tableName:"theTable", pk:"OPTR#"+ope, title:"4 day paris", dfrom:dtoday}; return await packageFind(req)} 
async function packageFindOM(ope, pfrom, pend) {let req = {type:"OM", tableName:"theTable", pk:"OPTR#"+ope, pfrom:"9000", pend:"20000", dfrom:dtoday}; return await packageFind(req)} 
async function packageFindOX(ope, pidList) {let req = {type:"OX", tableName:"theTable", pk:"OPTR#"+ope, pidList:pidList, dfrom:dtoday}; return await packageFind(req)}     // returns many if pr_no is not defined
async function packageFindOO(ope, skv) {let req = {type:"OO", tableName:"theTable", pk:"OPTR#"+ope, skv:skv}; return await packageFind(req)}     // returns many if pr_no is not defined

async function packageFindOV(ope, aword) {let resAW = await packageFindOAW(ope, "ski");/*
    let resAT = await packageFindOAT(ope, "ski");  
    pidList = fetch pid list ; 
    then get all pid[]s.  */
    let req = {type:"OX", tableName:"theTable", pk:"OPTR#"+ope, pidList:pidList}; return await packageFind(req)} 
async function packageFindOAW(ope, sword) {let req = {type:"OAW", tableName:"theTable", pk:"OPTR#"+ope, pid:pid, title:"4 day paris"}; return await packageFind(req)} 


/*
Ordr.add(package_m, package_m._id); }        // router.get(   '/add-to-cart/:pid', )
{new Ordr({  user: req.user,  cart: cart,  address: req.body.address,  name: req.body.name,  paymentId: "xx"});        
 Ordr.save( ,);}         // router.post(   '/checkout', isLoggedIn, ) 
*/


                                      /** L4 functions */


/** following are form index.js **      '<<<     // filter for type T-itile of JCKFN+T..  **/

async function packageFind(req) {
  try {
    var res = {};
    let skv = "PACK#";
    switch (req.type) {
      case  "OO":
        skv = req.skv;
          params = { TableName: req.tableName
          ,  ExpressionAttributeValues: { ':pk': {S: req.pk}, ':sk': {S: skv} },    KeyConditionExpression: 'pk = :pk   and   begins_with ( sk , :sk )'
        };
        break;
      case  "OOI1":
        skv = req.skv;
          params = { TableName: req.tableName, IndexName: "operatorG-1" 
          ,  ExpressionAttributeValues: { ':pk': {S: req.g1pk}, ':sk': {S: req.g1sk}, ':dfrom':  {S: req.dfrom} }
          ,   KeyConditionExpression: 'g1pk = :pk   and   begins_with ( g1sk , :sk )',     FilterExpression: 'd_start >= :dfrom'
        };
          break;
      case  "OP":
        skv = "PACK#"+req.pid;
        if (req.optrEmail != undefined) skv = skv+"#"+req.pr_No;
        params = { TableName: req.tableName
          ,  ExpressionAttributeValues: { ':pk': {S: req.pk}, ':sk': {S: skv} },    KeyConditionExpression: 'pk = :pk   and   begins_with ( sk , :sk )'
           };
        break;
      case  "O":
          params = { TableName: req.tableName
          ,  ExpressionAttributeValues: { ':pk': {S: req.pk}, ':sk': {S: skv}, ':dfrom':  {S: req.dfrom} }
          ,  KeyConditionExpression: 'pk = :pk   and   begins_with ( sk , :sk )',     FilterExpression: 'd_start >= :dfrom'
        };
        break;
        case  "OI1":
          params = { TableName: req.tableName, IndexName: "operatorG-1" 
          ,  ExpressionAttributeValues: { ':pk': {S: req.g1pk}, ':sk': {S: req.g1sk}, ':dfrom':  {S: req.dfrom} }
          ,  KeyConditionExpression: 'g1pk = :pk   and   begins_with ( g1sk , :sk )',     FilterExpression: 'd_start >= :dfrom'
       };
          break;
        case  "OX":
        params = { TableName: req.tableName
          ,  ExpressionAttributeValues: { ':pk': {S: req.pk}, ':sk': {S: skv}, ':pidList': {S: req.pidList}, ':dfrom':  {S: req.dfrom} }
          ,  KeyConditionExpression: 'pk = :pk   and   begins_with ( sk , :sk )',     FilterExpression: 'pack_id in :pidList  and  d_start >= :dfrom'
        };
        break;
      case  "OD":
        params = { TableName: req.tableName
          ,  ExpressionAttributeValues: { ':pk': {S: req.pk}, ':sk': {S: skv}, ':dend': {S: req.dend}, ':dfrom':  {S: req.dfrom} }
          ,  KeyConditionExpression: 'pk = :pk   and   begins_with ( sk , :sk )',     FilterExpression: 'd_start between :dfrom and :dend'
        };
        break;
      case  "OAW":
        skv = "ACTV#";
      case  "OW":
        params = { TableName: req.tableName
          ,  ExpressionAttributeValues: { ':pk': {S: req.pk}, ':sk': {S: skv}, ':sword': {S: req.sword}, ':dfrom':  {S: req.dfrom} }
          ,  KeyConditionExpression: 'pk = :pk   and   begins_with ( sk , :sk )',     FilterExpression: ' contains (sKeyWords, :sword)  and  d_start >= :dfrom'       // sKeyWords has all: JCKFN
        };
        break;
      case  "OTI1":
      case  "OWI1":
        params = { TableName: req.tableName, IndexName: "operatorG-1" 
          ,  ExpressionAttributeValues: { ':pk': {S: req.g1pk}, ':sk': {S: skv}, ':sword': {S: req.sword}, ':dfrom':  {S: req.dfrom} }
          ,  KeyConditionExpression: 'g1pk = :pk   and   begins_with ( g1sk , :sk )',     FilterExpression: ' contains (sKeyWords, :sword)  and  d_start >= :dfrom'       // sKeyWords has all: JCKFN
        };
        break;
      case  "OAJ":
        skv = "ACTV#";
      case  "OJ":
        params = { TableName: req.tableName
          ,  ExpressionAttributeValues: { ':pk': {S: req.pk}, ':sk': {S: skv}, ':sword': {S: req.sword}, ':dfrom':  {S: req.dfrom} }
          ,  KeyConditionExpression: 'pk = :pk   and   begins_with ( sk , :sk )',     FilterExpression: 'contains (janra, :sword)  and  d_start >= :dfrom'       // janra is limited to only J
        };
        break;
      case  "OJI1":
        params = { TableName: req.tableName, IndexName: "operatorG-1" 
          ,  ExpressionAttributeValues: { ':pk': {S: req.g1pk}, ':sk': {S: skv}, ':sword': {S: req.sword}, ':dfrom':  {S: req.dfrom} }
          ,  KeyConditionExpression: 'g1pk = :pk   and   begins_with ( g1sk , :sk )',     FilterExpression: ' contains (janras, :sword)  and  d_start >= :dfrom'       // sKeyWords has all: JCKFN
        };
        break;
      case  "OC":
        params = { TableName: req.tableName
          ,  ExpressionAttributeValues: { ':pk': {S: req.pk}, ':sk': {S: skv}, ':sword': {S: req.sword}, ':dfrom':  {S: req.dfrom} }              // cityC is limited to only City & Country
          ,  KeyConditionExpression: 'pk = :pk   and   begins_with ( sk , :sk )',     FilterExpression: 'contains (cityC, :sword)  and  d_start >= :dfrom'
        };
        break;
      case  "OJI1":
        params = { TableName: req.tableName, IndexName: "operatorG-1" 
          ,  ExpressionAttributeValues: { ':pk': {S: req.g1pk}, ':sk': {S: skv}, ':sword': {S: req.sword}, ':dfrom':  {S: req.dfrom} }
          ,  KeyConditionExpression: 'g1pk = :pk   and   begins_with ( g1sk , :sk )',     FilterExpression: ' contains (cityC, :sword)  and  d_start >= :dfrom'       // sKeyWords has all: JCKFN
        };
        break;
      case  "OAT":
        skv = "ACTV#";
      case  "OT":
        params = { TableName: req.tableName
          ,  ExpressionAttributeValues: { ':pk': {S: req.pk}, ':sk': {S: skv}, ':title': {S: req.title}, ':dfrom':  {S: req.dfrom} }
          ,  KeyConditionExpression: 'pk = :pk   and   begins_with ( sk , :sk )',     FilterExpression: 'contains (title, :title)  and  d_start >= :dfrom'
        };
        break;
      case  "OM":
        if (req.type === "OM") 
        params = { TableName: req.tableName
          ,  ExpressionAttributeValues: { ':pk': {S: req.pk}, ':sk': {S: skv}, ':pfrom': {S: req.dfrom}, ':pend': {S: req.dend}, ':dfrom':  {S: req.dfrom} }
          ,  KeyConditionExpression: 'pk = :pk   and   begins_with ( sk , :sk )',     FilterExpression: 'totPrice between :pfrom and :pend  and  d_start >= :dfrom'
        };
        break;
    }
    res = await dynamoQueryTable(params);    console.log("pl: %d", res.pack.length); //console.log(JSON.stringify(res)); 
    //* do foreach of results */  console.log(`packageFind...title:${res.pack[1].title}, optr:${res.pack.optrEmail}, pack_id:${res.pack.pack_id}, pr_No:${res.pack.pr_No}`);
    let arr = res.pack;
    arr.forEach(function(obj) {
      console.log('title: ' + JSON.stringify(obj.title));
      console.log('optrEmail: ' + obj.optrEmail);
      console.log('pack_id: ' + obj.pack_id);
      console.log('pr_No: ' + obj.pr_No);
      console.log("\n\n done");
    })
    return res;
  } catch (error) {
      console.log(error);
  }
};


                                                /** L2 functions */


async function createAllTables() {
  try {
    const dbTableData = await  dynamoDB.listTables({}).promise();
    const existingTableNames = dbTableData.TableNames;
    const unAvailableTableNames = allTableNames.filter(name => !(existingTableNames.includes(name)));			// WOW
    const results = [];

    unAvailableTableNames.forEach (uaTableName => {
      let PKSchema = [];
      let GSISchema = [];
      let KeySchema = [];
      let AttributeDefinitions = [];
      let GlobalSecondaryIndexes = [];
      let Projection = {};
      let ProvisionedThroughput = {};

      console.log("Missing table:", uaTableName);
      tableAttributeMapping[uaTableName].forEach(ele => {
        if (ele.AttributeName != undefined) { PKSchema.push({AttributeName: ele.AttributeName, KeyType: ele.KeyType});
            AttributeDefinitions.push({AttributeName: ele.AttributeName, AttributeType: ele.AttributeType}); }
        if (ele.GAname != undefined) { GSISchema.push({AttributeName: ele.GAname, KeyType: ele.GSI});
            AttributeDefinitions.push({AttributeName: ele.GAname, AttributeType: ele.AttributeType}); }

        KeySchema = GSISchema;
        if (ele.IndexName != undefined) {
          Projection["ProjectionType"] = "ALL";
          ProvisionedThroughput = {ReadCapacityUnits: 1, WriteCapacityUnits: 1};
          GlobalSecondaryIndexes.push({IndexName: ele.IndexName, KeySchema, Projection, ProvisionedThroughput});
          GSISchema = [];
        }
      })
      KeySchema = PKSchema;
      //*  https://docs.aws.amazon.com/amazondynamodb/latest/APIReference/API_CreateTable.html
      let params= { TableName : uaTableName,  KeySchema,  AttributeDefinitions,
        GlobalSecondaryIndexes,
        ProvisionedThroughput: { ReadCapacityUnits: 1, WriteCapacityUnits: 1 }
      };
      if (GlobalSecondaryIndexes.length == 0)   params= { TableName : uaTableName,  KeySchema,  AttributeDefinitions,
        ProvisionedThroughput: { ReadCapacityUnits: 1, WriteCapacityUnits: 1 }
      };

      //console.log("Params for create tables:"); console.log(params);
      //console.log("GlobalSecondaryIndex[0].KeySchema:"); console.log(params.GlobalSecondaryIndexes[0].KeySchema);
      //console.log("Projection:"); console.log(params.GlobalSecondaryIndexes[0].Projection);
      let result = dynamoDB.createTable(params).promise();
      results.push(result);
    })
    await Promise.all(results);
  } catch (error) {
    console.log(error);
  }
}

async function dynamoPutItem(params){
  try {
    console.log("Adding ", params.TableName, " sk: ", params.Item.sk);
    await dynamoDB.putItem(params, function(err) {
      if (err) {
        console.error("Unable to add Item into: ", params.TableName, " sk: ", params.Item.sk, "  ERR:", err);
      } else {
        console.log("Added ", params.TableName, " sk: ", params.Item.sk);
      }
    }).promise();
  } catch(err) { console.log(err) }
}

async function bulkInsertToDatabase(TableName, data) {
  try {
    const payloadFormat = data.map((ele) => {
      return { PutRequest: { Item: ele } };
    });
    let params = {
      RequestItems: {
        [TableName]: payloadFormat,
      },
    };
    return await dynamo_Doc.batchWrite(params).promise();
  } catch (error) {
    //throw new CustomError(400, error.message);
    console.log(err) 
  }
}


async function dynamoQueryTable(params) {            // query all/single item(s) for a buyer        // need wait to get results 
  try {
    var res = {};
    await dynamoDB.query (params, function(err, data) {
      if (err) {
        console.error("Unable to find buyer item", err);
      } else {
        console.log(`Table ${params.TableName} found ${data.Items.length} items:`  );
        console.log("Table ", params.TableName, " found ", data.Items.length, " items: " );
        // console.log(JSON.stringify(data.Items));
        data.Items.forEach(function(element, index, array)  { 
          console.log("pk:", element.pk.S, "sk:", element.sk.S); 
        })
        res = mapModels(data);
      }
    }).promise();
    return res;
  } catch (error) {
    console.log(error);
  }
}

async function dynamoScanAllTables(params) {            // scan everything/filtered item(s) for a table        // need wait to get results 
  try {
    await dynamoDB.scan(params, function(err, data) {     // scan returns the entire table
      if (err) { console.error("Unable to find any Buyers", err); }
      else { var res = mapModels(data);  return res;
      }
    }).promise();
  } catch (error) {
    console.log(error);
  }
};

function mapModels(data) {
  var res= {};
  //data.Items.forEach(function(element, index, array)  { console.log(JSON.stringify(element)); });
  if (params.TableName === "theTable") {
    const buyer = data.Items.filter((rec) => rec.byNameNameLast);
    const orders = data.Items.filter((rec) => rec.order_id);
    const family = data.Items.filter((rec) => rec.fmName);
    const payMethod = data.Items.filter((rec) => rec.holder);
    /**
    console.log(`Found ${data.Count} buyer Items:`);
    console.log('The buyer:');   console.log( JSON.stringify(buyer));
    console.log('The orders:');   console.log( JSON.stringify(orders));
    console.log('The family:');   console.log( JSON.stringify(family));
    console.log('The payMethod:');   console.log( JSON.stringify(payMethod));
    **/
    res = {Count: data.Count, buyer, orders, family, payMethod}; 
  }
  if (params.TableName === "theTable") {
    const operators = data.Items.filter((rec) => rec.opNameNameLast);
    const pack = data.Items.filter((rec) => rec.pack_id);
    const activity = data.Items.filter((rec) => rec.acty_id);
    const invited = data.Items.filter((rec) => rec.inv_id_invited);
    const pictures = data.Items.filter((rec) => rec.picspath);
    const blogs = data.Items.filter((rec) => rec.posts);
    const invitables = data.Items.filter((rec) => rec.isRegistered);
    const invTexts = data.Items.filter((rec) => rec.iMessage);
    const invitedBuyers = data.Items.filter((rec) => rec.buyStatus);
    const address = data.Items.filter((rec) => rec.city);
    const recieveMethod = data.Items.filter((rec) => rec.opHolder);
    /**
    console.log(`Found ${data.Count} buyer Items:`);
    console.log('The buyer:');   console.log( JSON.stringify(operators));
    console.log('The orders:');   console.log( JSON.stringify(pack));
    console.log('The activity:');   console.log( JSON.stringify(activity));
    console.log('The invited:');   console.log( JSON.stringify(invited));
    console.log('The pictures:');   console.log( JSON.stringify(pictures));
    console.log('The blogs:');   console.log( JSON.stringify(blogs));
    console.log('The invitables:');   console.log( JSON.stringify(invitables));
    console.log('The invTexts:');   console.log( JSON.stringify(invTexts));
    console.log('The invitedBuyers:');   console.log( JSON.stringify(invitedBuyers));
    console.log('The address:');   console.log( JSON.stringify(address));
    console.log('The recieveMethod:');   console.log( JSON.stringify(recieveMethod));
    **/
    res = {Count: data.Count, operators, pack, activity, invited, pictures, blogs, invitables, invTexts, address, recieveMethod}; 
  }
  return res;
}

module.exports = {
  packageFindO,
  packageFind,

  createAllTables,
  dynamoPutItem,
  dynamoQueryTable,         //fetchDatafromDatabase,
  bulkInsertToDatabase,
  //dynamoFetchCount,       //fetchCountfromDatabase,
  dynamoScanAllTables
};
