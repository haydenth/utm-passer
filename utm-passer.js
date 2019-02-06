/*
  this code does a few things
    1) looks to see if there are utm params either in url OR in cookies
    2) if so, store them in cookies
    3) if so, append utm_source, utm_campaign, and utm_medium to outgoing links
*/

function getCookie(cname) {
  var name = cname + "=";
  var decodedCookie = decodeURIComponent(document.cookie);
  var ca = decodedCookie.split(';');
  for(var i = 0; i <ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}

function setCookie(cname, cvalue, exdays) {
  var d = new Date();
  d.setTime(d.getTime() + (exdays*24*60*60*1000));
  var expires = "expires="+ d.toUTCString();
  document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function getUrlParams(url) {
  let params = {}
  let url_path = url

  if (!url_path) {
    url_path = window.location.href
  } 
  const parts = url_path.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m,key,value) {
    params[key] = value;
  })
  return params;
}

function getUrlParam(p) {
  const param_dict = getUrlParams()
  if (param_dict && param_dict[p]) {
    return param_dict[p]
  }
  return null
}

/* this function overwrites all outgoing links on the site
   AND internal links on the site to pass the same utm 
   codes around */
function overwriteOutgoingLinks(utm_s, utm_m, utm_c) {
  const links = document.getElementsByTagName('a')
  for(let i in links) {
    let hrefpath = links[i].href
    let params = getUrlParams(hrefpath)
    if (utm_s) { params['utm_source'] = utm_s }
    if (utm_m) { params['utm_medium'] = utm_m }
    if (utm_c) { params['utm_campaign'] = utm_c }

    if (hrefpath) {
      let path = hrefpath.substring(hrefpath.indexOf('?')+1)
      if (hrefpath.indexOf('?') > 0) {
        path = hrefpath.substring(0, hrefpath.indexOf('?'))
      }
      // encode the params as data and then url encode them 
      let data = Object.entries(params)
      data = data.map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v)}`)
      let query = data.join('&');
      links[i].href = path + "?" + query
    }
  }
}

async function utmOverwrite() {
  const utm_ps = getUrlParam('utm_source')
  const utm_pm = getUrlParam('utm_medium')
  const utm_pc = getUrlParam('utm_campaign')
  if (utm_ps || utm_pm || utm_pc) {
    console.log('utm-passer: overwriting outbound links...')
    overwriteOutgoingLinks(utm_ps, utm_pm, utm_pc)
  }
};


utmOverwrite()
