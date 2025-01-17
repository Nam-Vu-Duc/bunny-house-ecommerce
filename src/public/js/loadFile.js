function loadFile(file) {
  const loadScript = (src) => {
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = src;
      script.onload = resolve;
      script.onerror = reject;
      document.head.appendChild(script);
    });
  };

  // Load scripts in sequence
  loadScript('/js/utils.js')
    .then(() => {
      console.log('Utils.js loaded');
      return loadScript(file);
    })
    .then(() => {
      console.log('Profile.js loaded');
    })
    .catch((err) => {
      console.error('Failed to load a script:', err);
    });
}