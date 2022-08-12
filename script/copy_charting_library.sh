#!/bin/bash

set -ex

rm -rf public/charting_library
rm -rf public/datafeeds

if [[ -z "${CHARTING_LIBRARY_PATH}" ]]; then
  echo 'skip copy trading view charting library because $CHARTING_LIBRARY_PATH env var not exist'
else
  cp -r $CHARTING_LIBRARY_PATH/charting_library public/charting_library
  cp -r $CHARTING_LIBRARY_PATH/datafeeds public/datafeeds
fi
