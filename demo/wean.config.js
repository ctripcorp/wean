function wean(options = {}) {
  return {
    name: 'rollup-plugin',
    transform(code, acron) {
      return {
        code: code,
        map: { mappings: '' }
      };
    }
  };
}

module.exports = {
  plugins: [wean()],
}
