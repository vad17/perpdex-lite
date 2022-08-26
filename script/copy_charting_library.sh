#!/bin/bash

set -ex

rm -rf public/charting_library
rm -rf src/charting_library
rm -rf public/datafeeds

if [[ -z "${CHARTING_LIBRARY_PATH}" ]]; then
  echo 'skip copy trading view charting library because $CHARTING_LIBRARY_PATH env var not exist'
  mkdir -p src/charting_library
  echo "export const widget = void 0" > src/charting_library/index.js
else
  cp -r $CHARTING_LIBRARY_PATH/charting_library public/charting_library
  cp -r $CHARTING_LIBRARY_PATH/charting_library src/charting_library
#  cp -r $CHARTING_LIBRARY_PATH/datafeeds public/datafeeds
fi
