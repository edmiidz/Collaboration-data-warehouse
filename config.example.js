

// Jive APIs
var config = {
    username         : 'superdmin',
    password         : 'superdminpassword',
    basicUrl         : 'yourinstance.jiveon.com',
    peopleApiUrl     : '/api/core/v3/people',
};


// Jive Analytics APIs
var jaconfig = {
    ja_client_id     : '',
    ja_client_secret : '',
    ja_basic_url     : 'https://api-aws.jivesoftware.com'
};

config.database = {
    host     : 'localhost',
    user     : 'root',
    password : 'root',
    database : 'collab_dw',
    port     : '3306'

};

config.basicAuth = 'Basic ' + new Buffer(config.username + ':' + config.password).toString('base64');
config.tables = {
    collab_users            : 'collab_users',
    activity                : 'activity',
    scriptHealthDashboard   : 'scriptHealthDashboard'
};

config.instance = 1;
module.exports = config;

