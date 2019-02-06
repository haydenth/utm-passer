/*
  this code does two things and nothing else
    1) looks to see if there are utm params in url 
    2) if so, append utm_source, utm_campaign, and utm_medium to outgoing links
*/

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

    if (hrefpath && hrefpath != "") {
      let path = hrefpath.substring(hrefpath.indexOf('?')+1)
      if (hrefpath.indexOf('?') > 0) {
        path = hrefpath.substring(0, hrefpath.indexOf('?'))
      }

      // hbpath is the hashbang paths like index.php#fizzbuzz
      let hbpath = ""
      if (hrefpath.indexOf('#') > 0) {
        hbpath = hrefpath.substring(hrefpath.indexOf('#'))
      }

      // encode the params as data and then url encode them 
      let data = Object.entries(params)
      data = data.map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v)}`)
      let query = data.join('&');
      links[i].href = path + "?" + query + hbpath
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
