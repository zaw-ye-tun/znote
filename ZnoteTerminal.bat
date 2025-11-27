@echo off
cd client
start cmd /k "npm run dev"
cd ..
cd server
start cmd /k "npm run dev"
