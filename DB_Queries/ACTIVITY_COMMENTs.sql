SELECT
	`activity`.`activity_actionobject_subject` AS `object_title`,
	`activity`.`activity_actionobject_url` AS `object_url`,
	`activity`.`activity_actionobject_objecttype` AS `object_type`,
	`activity`.`activity_actor_profile_department` AS `actor_department`,
	substr(
		from_unixtime( ( `activity`.`activitytime` / 1000 ) ),
		1,
		10 
	) AS `actDay`,
	count( 0 ) AS `Num_of_Comments`,
	from_unixtime(
		( min( `activity`.`activitytime` ) / 1000 ) 
	) AS `minsactivity`,
	from_unixtime(
		( max( `activity`.`activitytime` ) / 1000 ) 
	) AS `maxactivity` 
FROM
	`v_DISTINCT_activity` `activity` 
WHERE
	( `activity`.`activity_actionobject_name` LIKE 'ACTIVITY_COMMENT%' ) 
GROUP BY
	`object_title`,
	`object_url`,
	`actor_department`,
	`actDay` 
ORDER BY
	`actDay` DESC