# Searchspring Snapfu Extension (beta)
This extension allows us to inject our script on to a clients site if they don't have our script. Or if they do we can remove their current script and add a script in any configuration we want. You can also redirect the script on a live client site to run off your local bundle.js.

## Installing in Chrome

Clone this repository

```
git clone git@github.com:searchspring/snapfu-extension.git
```

Navigate to: chrome://extensions/ in your chrome browser.

Toggle **ON** 'Developer Mode'.

Press the button that says 'Load unpacked'.

That will open up your local file directory; navigate to where the extension is located and select the `release` directory.

The Searchspring Snap Extension should now be available within Chrome.

## How to use the extension

When you click on the Searchspring Extension this should pop up:

![Chrome Extension](/img/readmePic.png?raw=true)

You can enable the extension by clicking the toggle in the header. 

## Injecting bundle script

A local URL is set by default in the `Bundle URL` and will inject a script with the src of `https://localhost:3333/bundle.js` onto the page.
### Local script
To inject a script that is running locally, modify the `Bundle URL` - clicking the `local` button will autofill with the default development bundle that Snap implementations use. 


### CDN hosted script

To inject a script hosted by Searchspring's CDN, click the **CDN** button; by default, the button will set the `Bundle URL` to `https://snapui.searchspring.io/siteid/branch/bundle.js`. Modify the default URL by entering a valid siteId and branch path.

This requires that the Snap Github Action `@searchspring/snap-action` has successfully completed on the desired branch. 


## Intercepts

While the extension is enabled, any network request attempting to reach a url found in the intercepts list will be blocked. This is useful for working on a site that is already live with v3 or snap. You can however add any url to this list that you may want to block. 

To view or edit the list of intercept urls. First go to the **Settings** page by clicking the settings ***Cog*** in the header. 

By default, the extension will have the 3 standard urls blocked that you would normally want to block when working with Snap. Each url is seperated by a new line in the text box. 

```
*://snapui.searchspring.io/*/bundle.js*
*://cdn.searchspring.net/search/v3/js/searchspring.catalog.js*
*://cdn.searchspring.net/search/v3/lts/searchspring.catalog.js*
```

## Editing the extension

First you must install 
```
npm install
```

Then you can run build in order to compile
```
npm run build
```

Then you can run dev for hot-reloads (of vue changes only)
```
npm run dev
```

Keep in mind if you make changes to something other than a vue component, such as background.js or assets directory, you will need to refresh the extension in the extensions tab. Sometimes removing and re-loading is the only way to see certain changes. 


