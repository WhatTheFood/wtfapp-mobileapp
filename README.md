# WhatTheFood Ionic Application

Welcome to the repo!
We're using git flow, [so check it out](http://jeffkreeftmeijer.com/2010/why-arent-you-using-git-flow/).

_master_ is for releases tag only
_develop_ is the main branch

When you work, start a new feature with `git flow feature start <name>`.  
Commit as usual.  
When finished, `git flow feature finish <name>`.  

You can also directly commit to _develop_ for quick modifications that doesn't belong to features.

If you need to make a fix :

`git flow hotfix start <name>`.  
Commit as usual.  
Then `git flow hotfix finish <name>`.  

Please install gitflow before you start working on this repo!

Release command for repo admins:  
`git flow release start <version (ex:1.0.0)>`  
Commit LAST MINUTE FIXES.  
Bump version number.  
`git flow release finish <version>`  
Then push to the server: `git push origin --tags`

# How to compile

When getting the source code from Git, you can compile from Android doing the following :

```
$ ionic platform add android
$ ionic run android
```

If you have some issues, try the following :

```
$ ionic platform remove android
$ ionic platform add android
$ ionic state restore
$ ionic run android
```

To build a release APK, you need the 'my-release-key.keystore' file. If you got it, just do the following :

```
$ cordova build --release android
$ jarsigner -verbose -sigalg SHA1withRSA -digestalg SHA1 -keystore my-release-key.keystore platforms/android/build/outputs/apk/android-release-unsigned.apk alias_name
$ zipalign -v 4 platforms/android/build/outputs/apk/android-release-unsigned.apk WTF.apk
adb install WTF.apk
```
