

// Jive API
var config = {
    username         : 'superdmin',
    password         : 'superdminpassword',
    basicUrl         : 'yourinstance.jiveon.com',
    peopleApiUrl     : '/api/core/v3/people',
};


config.connection = {
    host     : 'localhost',
    user     : 'root',
    password : 'root',
    database : 'collab_dw',
    port     : '3306',
    table    : 'collab_users'

};



module.exports = config;

