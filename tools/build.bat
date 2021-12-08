@ECHO OFF
ECHO Build in progress...
node "%~dp0r.js" -o "%~dp0build.js"
ECHO uglifyjs in progress... Output file: "%~dp0..\www-built\app.js"
uglifyjs "%~dp0..\www-built\app.js" -c -m -o "%~dp0..\www-built\app.js"


