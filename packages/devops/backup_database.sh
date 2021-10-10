#!/bin/bash

error () {
  echo >&2 "$@"
  exit 1
}

[ "$#" -ne 0 ] || error '
Usage:
backup_database <mongodb_uri>
'

MONGO_URI=$1
CURRENT_DATE=$(date '+%Y-%m-%d')
ZIP_FILENAME="mongo_dump_$CURRENT_DATE.zip"

mongodump --uri="$MONGO_URI"
zip -r $ZIP_FILENAME dump
rm -rf dump
mkdir -p ./backups/database
mv $ZIP_FILENAME "./backups/database/$ZIP_FILENAME"
