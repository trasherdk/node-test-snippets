-- SQL dump generated using DBML (dbml-lang.org)
-- Database: MySQL
-- Generated at: 2022-08-24T07:19:43.035Z

CREATE TABLE `assets_available` (
  `asset` varchar(255) NOT NULL,
  `class` varchar(255) NOT NULL,
  `altname` varchar(255) DEFAULT NULL,
  `decimals` int(10) NOT NULL,
  `display_decimals` int(10) NOT NULL,
  `active` tinyint(1) NOT NULL DEFAULT "0",
  `created_at` timestamp NOT NULL DEFAULT (CURRENT_TIMESTAMP)
);

CREATE UNIQUE INDEX `assets_available_asset_unique` ON `assets_available` (`asset`);
