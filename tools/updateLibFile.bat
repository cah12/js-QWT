@echo off
set /p fileName="Enter the name of the file you wish to update: "
cd C:\Users\anthony\Google Drive\MyGames\Projects\create-template\tools
node updateLibFile.js %fileName%
pause