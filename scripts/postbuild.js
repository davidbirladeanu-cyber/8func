import fs from 'node:fs';

// Duplicate index.html as 404.html for GitHub Pages SPA routing
if (fs.existsSync('dist/index.html')) {
  fs.copyFileSync('dist/index.html', 'dist/404.html');
  console.log('✓ Successfully created dist/404.html for GitHub Pages SPA routing');
} else {
  console.error('✗ dist/index.html not found');
  process.exit(1);
}
