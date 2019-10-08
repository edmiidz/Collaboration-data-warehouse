
CREATE TABLE `collab_users` (
  `user_id` int(11) NOT NULL,
  `user_name` varchar(255) NOT NULL,
  `account_enabled` enum('FALSE','TRUE') NOT NULL DEFAULT 'TRUE',
  `account_type` enum('External Contributor','Standard') NOT NULL DEFAULT 'Standard',
  `name` varchar(128) DEFAULT NULL,
  `first_name` varchar(55) DEFAULT NULL,
  `last_name` varchar(55) DEFAULT NULL,
  `email` varchar(128) NOT NULL,
  `last_logged_in` varchar(255) DEFAULT NULL,
  `member_since` varchar(55) DEFAULT NULL,
  `avatar` varchar(255) DEFAULT NULL,
  `profile_image` varchar(255) DEFAULT NULL,
  `title` varchar(128) DEFAULT NULL,
  `department` varchar(128) DEFAULT NULL,
  `phone_number` varchar(128) DEFAULT NULL,
  `mobile_phone_number` varchar(128) DEFAULT NULL,
  `expertise` text,
  `biography` text,
  `location` varchar(128) DEFAULT NULL,
  `availability` enum('','In the office','Out of the office','Working remotely') DEFAULT NULL,
  `company` varchar(128) DEFAULT NULL,
  `office` varchar(128) DEFAULT NULL,
  `twitter` varchar(128) DEFAULT NULL,
  `linkedIn` varchar(128) DEFAULT NULL,
  `facebook` varchar(128) DEFAULT NULL,
  `jive_federated` enum('FALSE','TRUE') NOT NULL DEFAULT 'TRUE',
  `jive_externalIdentities` text,
  `jive_instance` varchar(125) NOT NULL,
  `last_fetched_from_api` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=MyISAM DEFAULT CHARSET=latin1;


ALTER TABLE `collab_users`
  ADD PRIMARY KEY (`user_id`,`jive_instance`);
