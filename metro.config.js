const { getDefaultConfig } = require('expo/metro-config');
const { withNativeWind } = require('nativewind/metro');

const defaultConfig = getDefaultConfig(__dirname);

// Enable importing SVGs as React components:
const { resolver: defaultResolver, transformer: defaultTransformer } = defaultConfig;

defaultConfig.transformer = {
  ...defaultTransformer,
  babelTransformerPath: require.resolve('react-native-svg-transformer'),
};

defaultConfig.resolver = {
  ...defaultResolver,
  assetExts: defaultResolver.assetExts.filter((ext) => ext !== 'svg'),
  sourceExts: [...defaultResolver.sourceExts, 'svg'],
};

module.exports = withNativeWind(defaultConfig, { input: './src/global.css' });
