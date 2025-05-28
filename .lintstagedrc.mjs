const lintStagedConfig = {
  'src/**/*.{ts,tsx}': [() => 'tsc --noEmit'],
  'src/*': ['eslint --cache --fix ./src', 'prettier --write --ignore-unknown ./src'],
};

export default lintStagedConfig;