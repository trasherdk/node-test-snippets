CREATE TABLE `assets_available` (
  `asset` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `class` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `altname` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `decimals` int(10) unsigned NOT NULL,
  `display_decimals` int(10) unsigned NOT NULL,
  `active` tinyint(1) NOT NULL DEFAULT '0',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY `assets_available_asset_unique` (`asset`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
