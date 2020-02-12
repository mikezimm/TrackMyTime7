## track-my-time-7

This package produces the following:

* lib/* - intermediate-stage commonjs build artifacts
* dist/* - the bundled script, along with other resources
* deploy/* - all resources which should be uploaded to a CDN.

### npm installations
npm installs
```bash
npm install @pnp/sp @pnp/graph --save
npm install @pnp/spfx-controls-react --save --save-exact
npm install --save @pnp/polyfill-ie11
npm install @pnp/spfx-property-controls
npm install --save office-ui-fabric-react
npm install webpack-bundle-analyzer --save-dev  (2020-02-04:  To analyze web pack size)

```


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
```