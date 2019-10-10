# Collaboration-data-warehouse

To start, I'm going to add scripts which capture basic information about contributors and their activities. Initially I will focus on capturing data from Jive software. However I will try to make the data types and schemas generic enough so that eventually other platforms can also be merged into such a data warehouse. This cross-platform compatibility will enable the reporting of collaboration and digital transformation project ROIs, and enable community managers and collaboration architects alike to gather data and generate meaningful insights for reporting on their value propositions.

## Requirements
- Node.js
- MySQL Database

## How to run the script
- Clone this repository on your local or server
- Create Database structure using the collab_users.sql from this repository
- Rename the file config.example.js to config.js and make appropriate changes 
- After updating the config.js, you are good to execute the script
- Execute the following node command
  node index.js

## How to run the script for multiple instances
To use this script for multiple jive instances and the same database table:
 - Make a copy of the script folder
 - Change the config.js file for your other jive instance
 - Execute the following node command 
   node index.js
    
To run the script on an interval/schedule such as daily/weekly, the script can be executed from crontab
