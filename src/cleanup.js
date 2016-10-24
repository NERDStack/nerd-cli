module.exports = (() => {
  function cleanup() {
    console.log('running cleanup...');
  }

  return {
    cleanup
  };
})();

