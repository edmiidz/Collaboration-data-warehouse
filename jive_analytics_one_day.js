var q       = require('q');
var https   = require('https');
var request = require('request');
var util    = require('util');

var fs      = require('fs');
var async   = require('async');
var url     = require('url');
var path    = require('path');
const mysql = require('mysql');
var os = require('os');


if(os.type() != "Linux"){
     config  = require('./config_test');
} else {
    config  = require('./config');
}

console.log(os.type());

const connection = mysql.createConnection({
    host     : config.database.host,
    user     : config.database.user,
    password : config.database.password,
    database : config.database.database,
    port     : config.database.port,
    multipleStatements: true,
    charset : 'utf8'
});

var queryday  = '';

if(typeof process.argv.slice(2)[0] !== 'undefined') {
    queryday = process.argv.slice(2)[0];
    jiveActivity();
        console.log('queryday: ' + queryday);


} else {
    console.log("no parameter");

}



function jiveActivity()
{
                
    var querydayvalue = new Date(queryday); 
    var nextdayvalue = new Date(queryday); 

    var after_date = querydayvalue.toISOString().substr(0,10);
    nextdayvalue.setDate(querydayvalue.getDate() + 1); // Next Day!
    var before_date = nextdayvalue.toISOString().substr(0,10);

    var next_page = config.ja_basic_url + "/analytics/v2/export/activity?after=" + after_date + "&before=" + before_date + "&filter=place(Information+Technology)&count=300";            
    
    console.log('Step 1 -> CHECK - next_page = ' + next_page);
    async.doWhilst(function (callback1) {
        auth().then(function(token) {
            var data = {
                method:  "GET",
                host:    url.parse(next_page).hostname,
                port:    443,
                path:    url.parse(next_page).path,
                headers: {
                    'Authorization': token,
                }
            };
//console.log(data);
            var req = https.request(data, function(res) {
                res.setEncoding('utf8');
                var jive_ans = '';

                res.on('data', function (chunk) {
                    jive_ans += chunk;
                });
                res.on('end', function() {
                    
//console.log('jive_ans:' + jive_ans);
                    jive_ans = JSON.parse(jive_ans);

                    if (String(jive_ans.code) == '401'){
                        console.log('script stopping here, returning to getnerate token');
                        callback1(null, '');
                        
                    } else {
                        console.log('jive_ans.list ' + jive_ans.list.length + ' records');
                        var queries = '';
                        async.eachSeries(jive_ans.list, function iterator(rows_1, callback2) {
                            prepareJson(rows_1).then(function(row) {
                             //   console.log(row);   
                                //process.exit();
                                formatInsert(config.database.table, row).then(function (qry) {
                                    queries += qry;
                                    //console.log(qry);
                                 //   console.log('=====================')
                                    callback2(null, queries);
                                });
                            }, function (error) {
                                console.error('Handle error: ' + error);
                                throw error;
                            });
                        }, function done() {
                            //process.exit();
                            insertMultipleRows(queries).then(function(res1) {
                                console.log("maximum_rows: " + maximum_rows);
                                maximum_rows += 300;
                                if(typeof jive_ans.paging.next == 'undefined' || maximum_rows >= 27000) {
                                    next_page = false;
                                } else {
                                    next_page = jive_ans.paging.next;
                                }
                                callback1(null, next_page);
                            });
                        });
                    }

                }, function (error) {
                    console.log('Error defer reject at sendData');
                    deferred.reject(new Error(error));
                });
            });

            req.end();
            req.on('error', function(e) {
                console.log('Ce eroare!!');
            });
        }, function (error) {
            console.error('Handle error: ' + error);
            throw error;
        }); 

        }, function () {
            console.log('Step 2 -> CHECK - next_page = ' + next_page);
            return next_page !== false;
        }, function done() {
            console.log('All the records has been done');
    process.exit();
        });
    

}



function prepareJson(data, callback)
{
    var deferred = q.defer();
    var newData = new Object();

    if(typeof data['actionObjectId'] !== 'undefined')
    {
        newData.actionobjectid = data['actionObjectId'];
    }

    if(typeof data['activity']['actionObject'] !== 'undefined')
    {
        
        if(typeof data['activity']['actionObject']['containerId'] !== 'undefined')
        {
            newData.activity_actionobject_containerid = data['activity']['actionObject']['containerId'];   
        }
        if(typeof data['activity']['actionObject']['containerType'] !== 'undefined')
        {
            newData.activity_actionobject_containertype = data['activity']['actionObject']['containerType'];   
        }
        if(typeof data['activity']['actionObject']['objectType'] !== 'undefined')
        {
            newData.activity_actionobject_objecttype = data['activity']['actionObject']['objectType'];   
        }
        if(typeof data['activity']['actionObject']['status'] !== 'undefined')
        {
            newData.activity_actionobject_status = data['activity']['actionObject']['status'];   
        }
        if(typeof data['name'] !== 'undefined')
        {
            newData.activity_actionobject_name = data['name'];   
        }
        if(typeof data['activity']['actionObject']['url'] !== 'undefined')
        {
            newData.activity_actionobject_url = data['activity']['actionObject']['url'];   
        }
        if(typeof data['activity']['actionObject']['creationDate'] !== 'undefined')
        {  
            newData.activity_actionobject_creationDate = data['activity']['actionObject']['creationDate'];

        }
        if(typeof data['activity']['actionObject']['subject'] !== 'undefined')
        {
            newData.activity_actionobject_subject = data['activity']['actionObject']['subject'];   
        }
        //end new fields
    }

    if(typeof data['activity']['actor'] !== 'undefined')
    {   
        if (typeof data['activity']['actor']['profile'] !== 'undefined'){
            if( typeof data['activity']['actor']['profile']['department'] !== 'undefined'){
                newData.activity_actor_profile_department = data['activity']['actor']['profile']['department'];
            }
           if( typeof data['activity']['actor']['profile']['location'] !== 'undefined'){
                newData.activity_actor_profile_location = data['activity']['actor']['profile']['location'];
            }
        }
        if(typeof data['activity']['actor']['email'] !== 'undefined')
        {
            newData.activity_actor_email = data['activity']['actor']['email'];
        }
        if(typeof data['activity']['actor']['firstName'] !== 'undefined')
        {
            newData.activity_actor_firstname =  data['activity']['actor']['firstName'];
        }
        if(typeof data['activity']['actor']['lastName'] !== 'undefined')
        {
            newData.activity_actor_lastname = data['activity']['actor']['lastName'];
        }
        if(typeof data['activity']['actor']['name'] !== 'undefined')
        {
            newData.activity_actor_name = data['activity']['actor']['name'];
        }
        if(typeof data['activity']['actor']['creationDate'] !== 'undefined')
        {
            newData.activity_actor_creationDate = data['activity']['actor']['creationDate'];
        }
        if(typeof data['activity']['actor']['objectType'] !== 'undefined')
        {
            newData.activity_actor_objecttype = data['activity']['actor']['objectType'];
        }

        if(typeof data['activity']['actor']['username'] !== 'undefined')
        {
            newData.activity_actor_username = data['activity']['actor']['username'];
        }
    }

    if(typeof data['activity']['destination'] !== 'undefined')
    {
        if(typeof data['activity']['destination']['name'] !== 'undefined')
        {
            newData.activity_destination_name = data['activity']['destination']['name'];   
        }
        if(typeof data['activity']['destination']['objectType'] !== 'undefined')
        {
            newData.activity_destination_objecttype = data['activity']['destination']['objectType'];   
        }
        if(typeof data['activity']['destination']['status'] !== 'undefined')
        {
            newData.activity_destination_status = data['activity']['destination']['status'];   
        }
        if(typeof data['activity']['destination']['creationDate'] !== 'undefined')
        {
            newData.activity_destination_creationDate = data['activity']['destination']['creationDate'];   
        }
        if(typeof data['activity']['destination']['url'] !== 'undefined')
        {
            newData.activity_destination_url = data['activity']['destination']['url'];   
        }
    }

    if(typeof data['activity']['activityTime'] !== 'undefined')
    {
        newData.activitytime = data['activity']['activityTime'];
    }

    if(typeof data['context'] !== 'undefined')
    {
        if(typeof data['context']['web'] !== 'undefined')
        {

            if(typeof data['context']['web']['userAgent'] !== 'undefined')
            {
                newData.context_web_userAgent = data['context']['web']['userAgent'];   
            }
        }
    }


    deferred.resolve(newData);
    return deferred.promise;
}

function formatInsert(table, data, callback)
{
    var deferred = q.defer();
    
    var query = "INSERT INTO " + table + " (";
    for( var key in data) {
        query += key +" ,";
    }
    query = query.substr(0, query.length - 1) + ") VALUES (";

    for(var key1 in data) {
        var value = data[key1];
        if(isNaN(value)) {
            //if(value.indexOf("'") !== -1) {
                //value = value.replace(/'/g, "\\'");
        value = mysql.escape(value);
            //}
        }
        //query += "'" + value + "',";
        query += value + ' ,';

    }
    query = query.substr(0, query.length - 1) + ");";
    deferred.resolve(query);
    return deferred.promise;
}
function insertMultipleRows(queries, callback)
{
    var deferred = q.defer();
    //console.log(queries);
    //var queries = connection.escape(queries)
    connection.query(queries, function(err, result) {
            if (err) {
                console.log(err);
            } else {
                deferred.resolve(result);
            }
            deferred.resolve(result);
        });
    deferred.promise.nodeify(callback);
    return deferred.promise;
}


function auth(callback)
{
    var deferred = q.defer();
    var ja_auth_url = config.ja_basic_url + "/analytics/v1/auth/login?clientId=" + config.ja_client_id + "&clientSecret=" + config.ja_client_secret;
    request.post({ url: ja_auth_url }, function (error, message, res) {
        deferred.resolve(res);
    });
    return deferred.promise;
}
