#!/bin/bash

error () {
  echo >&2 "$@"
  exit 1
}

[ "$#" -ne 0 ] || error '
Usage:
download_xsounds <dropbox_token>
'

DROPBOX_TOKEN=$1
CURRENT_DATE=$(date '+%Y-%m-%d')
ZIP_FILENAME="xsounds_$CURRENT_DATE.zip"
DIR_PATH="$HOME/Documents/LebkuchenFM Backups/xsounds"

curl -X POST https://content.dropboxapi.com/2/files/download_zip \
  --header "Authorization: Bearer $DROPBOX_TOKEN" \
  --header "Dropbox-API-Arg: {\"path\": \"/xsounds\"}" \
  --output $ZIP_FILENAME

mkdir -p "$DIR_PATH"
mv $ZIP_FILENAME "$DIR_PATH/$ZIP_FILENAME"
