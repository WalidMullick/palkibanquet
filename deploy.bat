@echo off
cd /d d:\palki-deploy
git rm -rf .
xcopy /E /I /Y "D:\Palki Website\dist\assets" "assets\"
copy /Y "D:\Palki Website\dist\index.html" index.html
copy /Y "D:\Palki Website\dist\config.json" config.json
copy /Y "D:\Palki Website\dist\favicon.svg" favicon.svg
copy /Y "D:\Palki Website\dist\icons.svg" icons.svg
copy /Y "D:\Palki Website\dist\.nojekyll" .nojekyll
git add .
git commit -m "Remove booking process and events nav tab"
git push origin gh-pages
