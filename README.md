# WhatTheFood Ionic Application

When getting the source code from Git, you can compile from Android doing the following :

$ ionic platform add android
$ ionic run android

If you have some issues, try the following :

$ ionic platform remove android
$ ionic platform add android
$ ionic state restore
$ ionic run android

To build a release APK, you need the 'my-release-key.keystore' file. If you got it, just do the following :

$ cordova build --release android
$ jarsigner -verbose -sigalg SHA1withRSA -digestalg SHA1 -keystore my-release-key.keystore platforms\android\ant-build\CordovaApp-release-unsigned.apk alias_name
$ zipalign -v 4 platforms\android\ant-build\CordovaApp-release-unsigned.apk WTF.apk
adb install WTF.apk
