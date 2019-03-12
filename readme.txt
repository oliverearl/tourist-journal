"I'm a Tourist!" Hybrid Mobile Application - Mobile Solutions CSM2220
***********************
Oliver Earl
ole4@aber.ac.uk

A GitHub repository for this application is available:
https://www.github.com/oliverearl/tourist-webapp

***********************
General information
***********************
Simple mobile application written using Cordova/PhoneGap, jQuery Mobile, HTML5/CSS3, JavaScript ES6.
It makes specific usage of the deprecated WebSQL functionality for local data storage.

It was originally planned to use the more widely accepted IndexDB functionality, with WebSQL as a fallback
technology that could be used if (in the unlikely event) the former was unsupported.

It uses the Google Maps Static API for generating the Maps tab. It also makes use of the jQuery Mobile
Validation library for form validation, alongside the functionality built into HTML5.
***********************
How can I run it?
***********************
The application can run natively in a web browser, with some small quirks pertaining to geolocation
services and the Maps tab. However, everything else works fine as long as WebSQL is supported, which is all
modern browsers except Mozilla Firefox and its derivatives.

As a PhoneGap project, you can compile it using that (or with Cordova) for use as a native Android application.
There's an APK file included in the repository that you can download and install, should you choose.
***********************
What isn't working?
***********************
- Map tokens due to values being returned as null. Explained in JSDoc documentation and write-up.
- Cordova version of application does not use camera, but rather photo gallery. When run in a mobile web browser
such as Chrome mobile, it works fine.
***********************
Generating documentation
***********************
The application has JSDoc comments. You can install JSDOc by running 'npm install' in this directory, provided you
have both Node.js and NPM installed.
***********************
How much is this assignment worth?
***********************
20% of a 20 credit module. More information here: https://www.aber.ac.uk/en/modules/deptfuture/CSM2220/AB0/
