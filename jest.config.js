module.exports = {
  testEnvironment: 'jsdom',
  moduleNameMapper: {
    '\\.(css|less|scss|sss|styl)$': '<rootDir>/node_modules/jest-css-modules',
  },
  transform: {
    '^.+\\.(js|jsx)$': ['babel-jest', { configFile: './babel.config.js' }],
  },
	transformIgnorePatterns: [
		"node_modules/(?!(react-leaflet)/)"
	],
	moduleNameMapper: {
		"react-leaflet": "<rootDir>/app/javascript/react/src/test/mocks/reactLeafletMock.js"
	},
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js', '@testing-library/jest-dom/extend-expect'],
};
