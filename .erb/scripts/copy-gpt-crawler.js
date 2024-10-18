const fs = require('fs-extra');
const path = require('path');

module.exports = function(context) {
  const srcDir = path.join(context.appOutDir, '..', '..', '..', 'node_modules', '@builder.io', 'gpt-crawler');
  const destDir = path.join(context.appOutDir, 'node_modules', '@builder.io', 'gpt-crawler');

  fs.copySync(srcDir, destDir, { overwrite: true });
  console.log('Copied @builder.io/gpt-crawler to app bundle');
};
