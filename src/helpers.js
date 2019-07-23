export function api31Call(method, path, queryParams, payload) {
  let url = '/api/internal/core/3.1' + [path, queryParams].join('?')
  let obj = { 
    method: method,
    headers: {
      "x-csrf-token": readCookie('CSRF-TOKEN')
    },
    body: JSON.stringify(payload)
  }
  return fetch(url, obj).then(
    response => response.json())
}
  
function readCookie(cookieName) {
  var re = new RegExp('[; ]'+cookieName+'=([^\\s;]*)');
  var sMatch = (' '+document.cookie).match(re);
  if (cookieName && sMatch) return unescape(sMatch[1]);
  return '';
}