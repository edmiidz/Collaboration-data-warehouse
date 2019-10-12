//Load the request module
var config  = require('./config');
var q       = require('q');
var https   = require('https');
var async   = require('async');
var mysql   = require('mysql');
var count	= 100;
var allUsers = [];
var fullUserData = [];
var newTableCreated = false;


config.basicAuth = 'Basic ' + new Buffer(config.username + ':' + config.password).toString('base64');

var connection = mysql.createConnection({
    host     : config.connection.host,
    user     : config.connection.user,
    password : config.connection.password,
    database : config.connection.database,
    port     : config.connection.port,
    multipleStatements: true,
    charset : 'utf8'
});

sync_users();

function getUserDbObject(person){
        //console.log(person);
    var person_obj = {};
        person_obj.user_id = person.id;
        person_obj.user_name = person.jive.username;
        //person_obj.user_name = person.jive.user_name;
        person_obj.account_enabled =  (person.jive.enabled)? "TRUE": "FALSE";
        //person_obj.account_type =  person.type;
        person_obj.account_type =  (person.jive.externalContributor) ?'External Contributor':'Standard';
        person_obj.name =  person.displayName;
        person_obj.first_name =  person.name.givenName;
        person_obj.last_name =  person.name.familyName;
        //Work Email        
        person_obj.email = null;
        if (typeof person.emails != 'undefined'){
            for(var j=0; j<person.emails.length; j++){                      
                if (person.emails[j].type == 'work'){
                    person_obj.email =  person.emails[j].value;
                }   
            }            
        }
        person_obj.member_since = null;
        if (typeof person.initialLogin != "undefined"){
			person_obj.member_since = person.initialLogin;
        }        
        person_obj.avatar = person.resources.avatar.ref;
        person_obj.profile_image = person.resources.avatar.ref;
        
        //Porfile Fields 
        person_obj.title = person_obj.department = person_obj.expertise = person_obj.biography = person_obj.availability = person_obj.company = person_obj.office = person_obj.twitter = person_obj.linkedIn = person_obj.facebook = null;
        if (typeof person.jive.profile != "undefined") {
            for (var i=0; i<person.jive.profile.length; i++){
                var label = person.jive.profile[i].jive_label;
                var value = person.jive.profile[i].value;
                switch (label.toLowerCase()){
                    case "title":
                        person_obj.title = value;
                    break;
                    case "department":
                        person_obj.department = value;
                    break;
                    case "expertise":
                        person_obj.expertise = value;
                    break;
                    case "biography":
                        person_obj.biography = value;
                    break;
                    case "availability":
                        person_obj.availability = value;
                    break;
                    case "company":
                        person_obj.company = value;
                    break;
                    case "office":
                        person_obj.office = value;
                    break;
                    case "twitter":
                        person_obj.twitter = value;
                    break;
                    case "linkedIn":
                        person_obj.linkedIn = value;
                    break;
                    case "facebook":
                        person_obj.facebook = value;
                    break;
                }

            }
        }
        //Phone Numbers
        person_obj.phone_number = person_obj.mobile_phone_number = null;
        if (typeof person.phoneNumbers != "undefined"){
            for (var i =0; i<person.phoneNumbers.length; i++){
                var label = person.phoneNumbers[i].jive_label;
                var value = person.phoneNumbers[i].value;
                switch (label.toLowerCase()){
                    case "phone number":
                        person_obj.phone_number = value;
                    break;
                    case "mobile phone number":
                        person_obj.mobile_phone_number = value;
                    break;
                }
            }
        }
        // Location
        person_obj.location = null;
        if (typeof person.location != "undefined"){
            person_obj.location = person.location;
        }
        // federated
            person_obj.jive_federated = "FALSE";
        if (typeof person.jive.federated != "undefined"){
            person_obj.jive_federated = (person.jive.federated) ? "TRUE" : "FALSE";
        }
        
        //externalIdentities
            person_obj.jive_externalIdentities = null;
        if (typeof person.jive.externalIdentities != "undefined"){
            person_obj.jive_externalIdentities = JSON.stringify(person.jive.externalIdentities);
        }

        person_obj.jive_instance = config.basicUrl;

        return person_obj;
}


function sync_users(){
	var dt = new Date();
	console.log('Cron Run at : ', dt);
	var next_page = 'https://'+config.basicUrl + config.peopleApiUrl  + '?fields=name,emails,phoneNumbers,jive,location,initialLogin,profile,displayName&filter=include-disabled(true)&filter=include-external(true)&count='+count;
	async.doWhilst(function (callback) {		
		console.log('next_page = ', next_page)
        requestData(next_page).then(function(people) {        	
            async.eachSeries(people.list, function(person, callback_loop){
            	if (!userExist(person.id)){
                    var dbObj = getUserDbObject(person);
                    fullUserData.push(person.id);                    
                    insert_update_user(dbObj).then(function(result){
						callback_loop(null, result);
					});
                }
            }, 
            function done(){
            	if(typeof people.links.next == 'undefined') {
	            	next_page = false;
		        } else {
		            next_page = people.links.next;
		        }
		        if (people.list.length < count){
		        	next_page = false;
		        }
		        callback(null, 'next_page');
            })
        }, function (error) {
        	console.log('Error getting user data');
        });   
    }, function () {
        return next_page !== false;
    }, function done() {	    
    	console.log('All users data received and saved');
    	remove_jive_deleted_users_from_db();
    });
}


function insert_update_user(user){
		var d = q.defer();
        var fields = arrayKeys(user).join();
        var sql = "";
        sql += "INSERT INTO "+config.connection.table+" ("+fields+") VALUES ";
        var values = [];
            values.push("("+arrayValues(user).join()+")");
	        sql += values.join();
        
        var duplicateStr = [];
        fields = arrayKeys(user);
        for (var i=0; i<fields.length; i++){
            duplicateStr.push(fields[i]+"=VALUES("+fields[i]+")");
        }
        sql += " ON DUPLICATE KEY UPDATE "+duplicateStr.join();
		connection.query(sql, function(err, result) {
	      if (err) throw err;
	      	console.log('user '+ user.email +' added to DB');
	      	console.log('=================================');
	      d.resolve(result);
	    });
    	return d.promise;
};

function remove_jive_deleted_users_from_db(){
		var sql = 'DELETE FROM '+config.connection.table+ ' WHERE jive_instance = "'+config.basicUrl+'" AND user_id NOT IN('+fullUserData.join()+');';
		connection.query(sql, function(err, result) {
	      if (err) throw err;
	      console.log('Removed the users those were removed from the Jive instance');
	      process.exit();
	    });
}

function requestData(url, callback){
    var deferred = q.defer();
    var data = {
            host:    config.basicUrl,
            port:    443,
            path:    url,
            method:  'GET',
            headers: {
                'Authorization': config.basicAuth,
                'Content-Type': 'application/json'
            }
    };
    var req = https.request(data, function(res) {
            res.setEncoding('utf8');
            var str = '';
            res.on('data', function (chunk) {
                str += chunk;
            });
            res.on('end', function () {
                str = JSON.parse(str);
                deferred.resolve(str);
            }, function (error) {
                console.log('Error defer reject at sendData');
                deferred.reject(new Error(error));
            });
        });

    req.end();
    req.on('error', function(e) {
        console.log('Error!!');
        console.log(e);
    });
    return deferred.promise;
}


//Utility functions
function arrayKeys(input) {
    var output = new Array();
    var counter = 0;
    for (i in input) {
        output[counter++] = i;
    } 
    return output; 
}

function arrayValues(input) {
    var output = new Array();
    var counter = 0;
    for (i in input) {
        output[counter++] = mysql.escape(input[i]);
    } 
    return output; 
}

function userExist(id){ 
	return (fullUserData.indexOf(id) != -1)   
}

