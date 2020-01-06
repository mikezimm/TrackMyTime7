## track-my-time-7

This is where you include your WebPart documentation.

### Building the code

```bash
git clone the repo
npm i
npm i -g gulp
gulp
```

This package produces the following:

* lib/* - intermediate-stage commonjs build artifacts
* dist/* - the bundled script, along with other resources
* deploy/* - all resources which should be uploaded to a CDN.

### Build options

gulp clean - TODO
gulp test - TODO
gulp serve - TODO
gulp bundle - TODO
gulp package-solution - TODO

### Build Steps history
```bash
yo @microsoft/sharepoint 
--solution-name "TrackMyTimeV7" 
--framework "react" 
--component-type "webpart" 
--component-name "TrackMyTimeV7" 
--component-description "TrackMyTime web part v7" 
--environment "spo" 
--skip-install

gulp build
gulp bundle --ship
gulp package-solution --ship

Works to this point!

```