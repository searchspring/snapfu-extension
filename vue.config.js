const path = require('path');
const fs = require('fs');

// Generate pages object
const pages = {};

function getEntryFile(entryPath) {
	let files = fs.readdirSync(entryPath);
	return files;
}

const chromeName = getEntryFile(path.resolve(`src/entry`));

function getFileExtension(filename) {
	return /[.]/.exec(filename) ? /[^.]+$/.exec(filename)[0] : undefined;
}
chromeName.forEach((name) => {
	const fileExtension = getFileExtension(name);
	const fileName = name.replace('.' + fileExtension, '');
	pages[fileName] = {
		entry: `src/entry/${name}`,
		template: 'public/index.html',
		filename: `${fileName}.html`,
	};
});

const isDevMode = process.env.NODE_ENV === 'development';

let buildDir = 'dist';
if (!isDevMode) buildDir = 'release';

module.exports = {
	pages,
	filenameHashing: false,
	chainWebpack: (config) => {
		config.plugin('copy').use(require('copy-webpack-plugin'), [
			{
				patterns: [
					{
						from: path.resolve(`src/manifest.json`),
						to: `${path.resolve(buildDir)}/manifest.json`,
					},
					{
						from: path.resolve(`src/assets/icons`),
						to: `${path.resolve(buildDir)}/assets/icons`,
					},
				],
			},
		]);
	},
	outputDir: buildDir,
	configureWebpack: {
		output: {
			filename: `js/[name].js`,
			chunkFilename: `[name].js`,
		},
		devtool: isDevMode ? 'inline-source-map' : false,
	},
};
