var GID = 'Iv23ct6WFJWQorNkIday';
var GSEC = '843380...6dde';

export default {
  async fetch(request) {
    var url = new URL(request.url);
    if (url.pathname === '/auth') {
      var s = encodeURIComponent('repo user');
      var r = encodeURIComponent('https://' + url.hostname + '/callback');
      return Response.redirect('https://github.com/login/oauth/authorize?client_id=' + GID + '&redirect_uri=' + r + '&scope=' + s + '&state=xyz', 302);
    }
    if (url.pathname === '/callback') {
      var code = url.searchParams.get('code');
      var r = await fetch('https://github.com/login/oauth/access_token', { method: 'POST', headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' }, body: JSON.stringify({ client_id: GID, client_secret: GSEC, code: code, redirect_uri: 'https://' + url.hostname + '/callback' }) });
      var d = await r.json();
      return new Response('<html><script>' +
        'var w=window;w.opener.postMessage("authorization:github:success:"+JSON.stringify({token:"' + d.access_token + '"}),w.opener.location.origin);w.close();' +
        '</script></html>', { headers: { 'Content-Type': 'text/html' } });
    }
    return new Response('ok', { status: 200 });
  }
};
