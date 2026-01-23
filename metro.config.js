const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require("nativewind/metro");

// 1. Get the default config once
const config = getDefaultConfig(__dirname);

// 2. Apply your custom Metro settings (adding 'cjs')
config.resolver.sourceExts.push('cjs');

// 3. Wrap the config with NativeWind and export it ONCE
module.exports = withNativeWind(config, { input: "./global.css" });