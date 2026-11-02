// CloudFront Function (viewer-request, runtime cloudfront-js-2.0). Reference implementation of
// the hosting contract in docs/deploy.md; the real one lives in the infrastructure repo.
//
//   /about/      → 301 /about           (one canonical form, no trailing slash)
//   /about       → /about/index.html    (clean URLs over the prerendered files)
//   /about.data  → unchanged            (route data for client-side navigation)
//   /assets/x.js → unchanged            (anything with an extension)
//
// Pair it with a custom error response: 403/404 → /404/index.html, response code 404.
// eslint-disable-next-line no-unused-vars -- CloudFront invokes `handler` by name.
function handler(event) {
  var request = event.request;
  var uri = request.uri;

  if (uri.length > 1 && uri.endsWith('/')) {
    var query = Object.keys(request.querystring)
      .map(function (key) {
        return key + '=' + request.querystring[key].value;
      })
      .join('&');
    return {
      statusCode: 301,
      statusDescription: 'Moved Permanently',
      headers: { location: { value: uri.replace(/\/+$/, '') + (query ? '?' + query : '') } },
    };
  }

  var last = uri.substring(uri.lastIndexOf('/') + 1);
  if (last.indexOf('.') === -1) {
    request.uri = (uri === '/' ? '' : uri) + '/index.html';
  }
  return request;
}
