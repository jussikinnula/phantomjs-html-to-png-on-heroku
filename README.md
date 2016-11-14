# phantomjs-html-to-png-on-heroku

Run PhantomJS powered rendering server on Heroku, which produces PNG out of HTML

## Run locally

```
git clone git@github.com:jussikinnula/phantomjs-html-to-png-on-heroku.git
brew install phantomjs
npm install
npm start
```

## Deploy to Heroku

```
heroku create --region eu
heroku buildpacks:add https://github.com/stomita/heroku-buildpack-phantomjs
heroku buildpacks:add https://github.com/heroku/heroku-buildpack-nodejs
git push heroku master
```