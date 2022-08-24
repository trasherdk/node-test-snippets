CREATE TABLE kraken_history.assets_available (
  asset VARCHAR(255) NOT NULL,
  class VARCHAR(255) NOT NULL,
  altname VARCHAR(255) DEFAULT NULL,
  decimals INT(10) UNSIGNED NOT NULL,
  display_decimals INT(10) UNSIGNED NOT NULL,
  active TINYINT(1) NOT NULL DEFAULT 0,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
)
ENGINE = INNODB,
CHARACTER SET utf8mb4,
COLLATE utf8mb4_unicode_ci;

ALTER TABLE kraken_history.assets_available
  ADD UNIQUE INDEX assets_available_asset_unique(asset);