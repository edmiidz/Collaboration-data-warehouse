-- ----------------------------
-- Table structure for activity
-- ----------------------------
DROP TABLE IF EXISTS `activity`;
CREATE TABLE `activity` (
  `activity_actionobject_name` varchar(125) NOT NULL,
  `actionobjectid` int(15) DEFAULT NULL,
  `activitytime` bigint(25) NOT NULL,
  `activity_actionobject_author_status` varchar(125) DEFAULT NULL,
  `activity_actor_creationDate` bigint(20) DEFAULT NULL,
  `activity_actor_email` varchar(125) DEFAULT NULL,
  `activity_actor_firstname` varchar(55) DEFAULT NULL,
  `activity_actor_lastname` varchar(55) DEFAULT NULL,
  `activity_actor_name` varchar(55) DEFAULT NULL,
  `activity_actor_objecttype` varchar(55) DEFAULT NULL,
  `activity_actor_username` varchar(125) NOT NULL,
  `activity_actor_profile_department` varchar(55) DEFAULT NULL,
  `activity_actor_profile_location` varchar(55) DEFAULT NULL,
  `activity_actionobject_creationDate` bigint(30) DEFAULT NULL,
  `activity_actionobject_url` varchar(1000) DEFAULT NULL,
  `activity_actionobject_objecttype` varchar(55) DEFAULT NULL,
  `activity_actionobject_containerid` int(11) DEFAULT NULL,
  `activity_actionobject_status` varchar(125) DEFAULT NULL,
  `activity_actionobject_containertype` varchar(55) DEFAULT NULL,
  `activity_actionobject_subject` varchar(255) DEFAULT NULL,
  `activity_destination_status` varchar(55) DEFAULT NULL,
  `activity_destination_creationDate` bigint(20) DEFAULT NULL,
  `activity_destination_objecttype` varchar(55) DEFAULT NULL,
  `activity_destination_displayname` varchar(55) DEFAULT NULL,
  `activity_destination_url` varchar(255) DEFAULT NULL,
  `activity_destination_name` varchar(500) DEFAULT NULL,
  `context_web_userAgent` varchar(255) DEFAULT NULL,
  `instance` int(11) DEFAULT NULL,
  `upserted` datetime DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

