#!/bin/bash

BACKUP_DIR=/home/admin/backup

mkdir -p $BACKUP_DIR
cd $BACKUP_DIR
rm -r dump
mongodump --db wtfapp
tar czvf `date -I`-wtfdump.tar.gz dump
