import fs from 'node:fs';

const spa404Html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>8Func</title>
  <script type="text/javascript">
    // Single Page Apps for GitHub Pages
    // MIT License - https://github.com/rafgraph/spa-github-pages
    var pathSegmentsToKeep = 1;
    var l = window.location;
    l.replace(
      l.protocol + '//' + l.hostname + (l.port ? ':' + l.port : '') +
      l.pathname.split('/').slice(0, 1 + pathSegmentsToKeep).join('/') + '/?/' +
      l.pathname.slice(1).split('/').slice(pathSegmentsToKeep).join('/').replace(/&/g, '~and~') +
      (l.search ? '&' + l.search.slice(1).replace(/&/g, '~and~') : '') +
      l.hash
    );
  </script>
</head>
<body>
</body>
</html>
`;

if (fs.existsSync('dist')) {
  fs.writeFileSync('dist/404.html', spa404Html, 'utf8');
  console.log('✓ Successfully created dist/404.html with GitHub Pages SPA redirect script');
} else {
  console.error('✗ dist directory not found');
  process.exit(1);
}
