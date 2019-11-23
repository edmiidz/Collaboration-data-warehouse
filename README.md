# Collaboration-data-warehouse

To start, we have added two scripts which capture basic information about contributors and their activities from Jive APIs and Jive Cloud Analytics APIs. Initially we will focus on capturing data from Jive software. However we will try to make the data types and schemas generic enough so that eventually other platforms can also be merged into such a data warehouse. This cross-platform compatibility will enable the reporting of collaboration and digital transformation project ROIs, and enable community managers and collaboration architects alike to gather data and generate meaningful insights for reporting on their value propositions.

## Requirements
- Node.js
- MySQL Database

## Setting up Middleware server
- Clone this repository on your local or server
- Create Database structure using the collab_users.sql and activity.sql from this repository
- Rename the file config.example.js to config.js and make appropriate change


## jive_analytics.js
jive_analytics.js uses Jive Cloud Analytics APIs to get activity data. It can take several days or weeks to get all the data for your instance. However after you've gotten all  your historic data, you can set up a cron job to refresh yestereday's data into your database. From the command line, you can run:
```
$ node jive_analytics.js
```

## jive_users_refresh.js
jive_users_refresh.js uses Jive APIs to get user data. It should only take a few minutes to get all users. From the command line, you can run:

```
$ node jive_users_refresh.js
```

    
To run the script on an interval/schedule such as daily/weekly, the script can be executed from crontab
```
5 0 * * * /usr/bin/node /path/to/Collaboration-data-warehouse/jive_users_refresh.js > /path/to/Collaboration-data-warehouse/info.log
```
