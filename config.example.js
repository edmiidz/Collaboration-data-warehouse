

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

config.connection = {
    host     : 'localhost',
    user     : 'root',
    password : 'root',
    database : 'collab_dw',
    port     : '3306'

};


config.tables = {
    collab_users            : 'collab_users',
    activity                : 'activity',
    scriptHealthDashboard   : 'scriptHealthDashboard'
};

module.exports = config;

