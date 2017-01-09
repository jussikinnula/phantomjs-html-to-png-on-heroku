# phantomjs-html-to-png-on-heroku

Run PhantomJS powered rendering server on Heroku, which produces PNG out of HTML.

This project is heavily inspired by: https://github.com/vgno/highcharts-png-renderer

## Run locally

```
git clone git@github.com:jussikinnula/phantomjs-html-to-png-on-heroku.git
brew install phantomjs
npm install
npm start
```

## Make API calls

```
curl -X POST -d '{ \
    "html":"<html><body><h1>Hello World!</h1></body></html>", \
    "width":640, \
    "height":480, \
    "format":"png", \
    "onload":false, \
    "timeout":50 \
}' http://localhost:5000
```

### Parameters

- `html` = input HTML to convert into image
- `width` = width of the PhantomJS headless browser (e.g. translates to width of rendered image)
- `height` = height of the PhantomJS headless browser (e.g. translates to height of rendered image)
- `format` = supported formats are: *png* and *jpg* (*gif* could possibly be used if running the backend on supported systems)
- `onload` = boolean *true* or *false* -- use PhantomJS capacity to detect when the page has been rendered (this doesn't work with HTML pages with SVG)
- `timeout` = if *onload* is *false*, use this timeout instead to determine when to take the screenshot from HTML (50ms works for most of the cases, you can tune it down based on the type of HTML used)

## Deploy to Heroku

```
heroku create --region eu
heroku buildpacks:add https://github.com/stomita/heroku-buildpack-phantomjs
heroku buildpacks:add https://github.com/heroku/heroku-buildpack-nodejs
git push heroku master
```

## Fonts

You should include all the fonts needed under `.fonts` directory, instead of loading web fonts. PhantomJS is not always fast enough to load web fonts. The fonts should be in TrueType format.