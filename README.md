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

### Next adding PnpJS:
REF:  https://pnp.github.io/pnpjs/getting-started/
Needed for: Fetching list data

```bash
npm install @pnp/sp @pnp/graph --save
```

```typescript

import { sp } from "@pnp/sp/presets/all";

// https://pnp.github.io/pnpjs/getting-started/

protected onInit(): Promise<void> {

  return super.onInit().then(_ => {

    // other init code may be present

    sp.setup({
      spfxContext: this.context
    });
  });
}

import { Web } from "@pnp/sp/presets/all";

const web = Web("{Absolute SharePoint Web URL}");
const w = await web.get();

```




### Next adding React Controls:
REF:  https://sharepoint.github.io/sp-dev-fx-controls-react/
Needed for: ProjectList and ListView of history items

```bash
npm install @pnp/spfx-controls-react --save --save-exact
```

### Next install polyfill-ie11:

```bash
npm install --save @pnp/polyfill-ie11
```

### Next install Property Controls:

```bash
npm install @pnp/spfx-property-controls
```
Deployment works at this stage!


### Next install FabricReact for PIVOT:
https://github.com/SharePoint/office-ui-fabric-react/tree/master/packages/office-ui-fabric-react

```bash
npm install --save office-ui-fabric-react
```

### DID NOT DO THIS ONE:
npm install @microsoft/sp-page-context

### Copied all original code and updated for new "7" name
Successfully Gulp Served

Testing:
gulp clean
gulp build
gulp bundle --debug (No errors at this point)
gulp package-solution --ship (No errors at this point)

Error when
```bash

Additional Installs
```bash
npm install webpack-bundle-analyzer --save-dev  (2020-02-04:  To analyze web pack size)

```

Move web part
Something went wrong
If the problem persists, contact the site administrator and give them the information in Technical Details.
TECHNICAL DETAILS
ERROR:
Cannot read property 'style' of null

CALL STACK:
TypeError: Cannot read property 'style' of null
    at https://mcclickster.sharepoint.com/sites/Apps/ClientSideAssets/d2b78ee9-71d1-4588-b4f4-4c88f4fdd936/track-my-time-7-web-part_cdad9e7290798fc76640f5dc297b8ec1.js:67:279240

```