# Athos Commerce Snapfu Extension

A Chrome extension for Athos developers to inject, test, and debug Snap bundles on client sites. This tool allows you to override existing scripts, inject local development bundles, and control script loading behavior.

## Features

- 🚀 **Script Injection**: Inject custom Snap bundles onto any site
- 🔄 **Live Bundle Switching**: Toggle between local development and CDN-hosted bundles
- 🛡️ **Network Intercepts**: Block existing scripts to prevent conflicts
- 📊 **Integration Details**: View real-time information about loaded Snap controllers
- ⚙️ **Context Variables**: Inject custom context variables with bundle scripts
- 🎯 **Per-Site Configuration**: Settings are saved per hostname for easy context switching
- 🎨 **Modern UI**: Clean, dashboard-style interface with live loading states

## Installation

### Clone the Repository

```bash
git clone git@github.com:searchspring/snapfu-extension.git
cd snapfu-extension
npm install
npm run build
```

### Load in Chrome

1. Navigate to `chrome://extensions/` in your Chrome browser
2. Toggle **ON** 'Developer Mode' (top-right corner)
3. Click 'Load unpacked'
4. Navigate to the cloned repository and select the `release` directory

The Athos Commerce Snapfu Extension should now be available in Chrome.

## Using the Extension

### Getting Started

Click the Athos extension icon in your Chrome toolbar to open the popup interface.

![Chrome Extension](/img/readmePic.png?raw=true)

### Enabling the Extension

Click the toggle switch in the header to enable/disable the extension for the current site. When enabled, the extension will inject your configured bundle and block intercepted URLs. 

## Configuration

### Bundle URL

The **Bundle URL** field controls which Snap bundle script to inject onto the page.

#### Quick Actions

- **local** button: Sets URL to `https://localhost:3333/bundle.js` (default local development URL)
- **cdn** button: Sets URL to `https://snapui.athoscommerce.io/siteid/branch/bundle.js` (Athos Commerce CDN template)

For CDN URLs, replace `siteid` and `branch` with your actual site ID and branch name. This requires that the `@searchspring/snap-action` GitHub Action has successfully deployed to the specified branch.

#### Custom URLs

You can manually enter any URL in the Bundle URL field. The reset icon (↺) will restore the default value.

### Script Context

Add custom context variables to be injected with the bundle script. These variables will be available to your Snap implementation.

- Enter valid JavaScript object notation in the text area
- Enable **Merge context** to combine your context with any existing context on the page
- The reset icon (↺) will clear your custom context

### Integration Details

When a Snap bundle is loaded, the extension displays:

- **Site ID**: The Athos site identifier
- **Version**: The loaded Snap bundle version
- **Controllers**: Count and details of active Snap controllers

Click the header to expand and view detailed controller information including:
- Controller type (search, autocomplete, recommendation, finder)
- Load status
- Result count
- Plugin count
- Configuration globals and settings

## Network Intercepts

The extension can block network requests to prevent conflicts with existing scripts.

### Viewing/Editing Intercepts

1. Click the **Settings** gear icon in the header
2. Find the **Intercepts** section
3. Add one URL pattern per line

### Default Intercepts

By default, the extension blocks these common Snap and legacy script URLs:

```
*://snapui.athoscommerce.io/*/bundle.js*
*://snapui.searchspring.io/*/bundle.js*
```

URL patterns support wildcards (`*`) for flexible matching.

### Injection Target

Advanced users can customize where the script is injected in the DOM using the **Injection Target** field in Settings. This supports iframe targeting with syntax like `iframe >>> head`.

## Settings Management

### Per-Site Configuration

All configuration (Bundle URL, Context, Intercepts) is saved per hostname. This allows you to maintain different settings for different development environments and client sites.

### Reset Options

- **Reset Site**: Clear all settings for the current hostname and return to defaults
- **Reset All**: Clear all extension data across all hostnames (requires confirmation)

## Development

### Setup

```bash
npm install
```

### Build

Compile the extension for production:

```bash
npm run build
```

Output will be in the `release/` directory.

### Development Mode

Run with hot-reload for Vue components:

```bash
npm run dev
```

**Note**: Changes to non-Vue files (like `background.ts`, manifest, or assets) require manually refreshing the extension in `chrome://extensions/`. In some cases, you may need to remove and reload the extension completely.

### Project Structure

```
src/
├── components/
│   ├── popup.vue              # Main popup container
│   └── popup/
│       ├── popup-config.vue   # Configuration tab
│       ├── popup-settings.vue # Settings tab
│       ├── popup-header.vue   # Header with logo and controls
│       └── popup-controller.vue # Controller detail display
├── entry/
│   ├── background.ts          # Service worker
│   ├── inject.ts              # Content script injection
│   ├── loader.ts              # Script loader
│   ├── popup.ts               # Popup entry point
│   └── scraper.ts             # Integration detection
├── types/                     # TypeScript definitions
└── utilities/                 # Helper functions
```

### Tech Stack

- **Framework**: Vue 3 with Composition API
- **Language**: TypeScript
- **Styling**: SCSS
- **Icons**: Font Awesome
- **Build Tool**: Vue CLI / Webpack
- **Chrome APIs**: Declarative Net Request, Storage, Tabs, Scripting

## Contributing

When contributing to this extension:

1. Follow the existing code style and component patterns
2. Test thoroughly in Chrome before submitting PRs
3. Update this README if adding new features
4. Ensure the build completes without errors

## License

Internal Athos tool for development use. 


