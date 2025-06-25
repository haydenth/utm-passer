/*
  this code does three things and nothing else
    1) looks to see if there are utm params in url 
    2) if so, append utm_source, utm_campaign, and utm_medium to outgoing links
    3) also append utm parameters to iframe src URLs
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
function overwriteOutgoingLinks(utm_s, utm_m, utm_c, utm_t, utm_term) {
  const links = document.getElementsByTagName('a')
  for(let i in links) {
    let hrefpath = links[i].href
    let params = getUrlParams(hrefpath)
    if (utm_s) { params['utm_source'] = utm_s }
    if (utm_m) { params['utm_medium'] = utm_m }
    if (utm_c) { params['utm_campaign'] = utm_c }
    if (utm_t) { params['utm_content'] = utm_t }
    if (utm_term) { params['utm_term'] = utm_term }

    let skipPassing = true
    if (typeof links[i].getAttribute !== "undefined") {
      skipPassing = (links[i].getAttribute('no-utm') !== null)
    } 

    if (skipPassing === false && hrefpath && hrefpath != "") {
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

/* this function overwrites all iframe src URLs on the site
   to pass the same utm codes around */
function overwriteIframeSrcs(utm_s, utm_m, utm_c, utm_t, utm_term) {
  const iframes = document.getElementsByTagName('iframe')
  for(let i = 0; i < iframes.length; i++) {
    let srcpath = iframes[i].src
    
    // Skip if no src or if it has the no-utm attribute
    let skipPassing = false
    if (typeof iframes[i].getAttribute !== "undefined") {
      skipPassing = (iframes[i].getAttribute('no-utm') !== null)
    }
    
    if (skipPassing || !srcpath || srcpath === "") {
      continue
    }
    
    // Skip data URLs, blob URLs, and relative URLs without protocols
    if (srcpath.startsWith('data:') || srcpath.startsWith('blob:') || 
        (!srcpath.includes('://') && !srcpath.startsWith('//'))) {
      continue
    }
    
    let params = getUrlParams(srcpath)
    if (utm_s) { params['utm_source'] = utm_s }
    if (utm_m) { params['utm_medium'] = utm_m }
    if (utm_c) { params['utm_campaign'] = utm_c }
    if (utm_t) { params['utm_content'] = utm_t }
    if (utm_term) { params['utm_term'] = utm_term }

    let path = srcpath
    if (srcpath.indexOf('?') > 0) {
      path = srcpath.substring(0, srcpath.indexOf('?'))
    }

    // hbpath is the hashbang paths like index.php#fizzbuzz
    let hbpath = ""
    if (srcpath.indexOf('#') > 0) {
      hbpath = srcpath.substring(srcpath.indexOf('#'))
      // Remove hash from path if it exists
      if (path.indexOf('#') > 0) {
        path = path.substring(0, path.indexOf('#'))
      }
    }

    // encode the params as data and then url encode them 
    let data = Object.entries(params)
    data = data.map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v)}`)
    let query = data.join('&')
    
    const newSrc = path + "?" + query + hbpath
    iframes[i].src = newSrc
  }
}

async function utmOverwrite() {
  const utm_ps = getUrlParam('utm_source')
  const utm_pm = getUrlParam('utm_medium')
  const utm_pc = getUrlParam('utm_campaign')
  const utm_ct = getUrlParam('utm_content')
  const utm_tt = getUrlParam('utm_term')

  if (utm_ps || utm_pm || utm_pc || utm_ct || utm_tt) {
    console.log('utm-passer: overwriting outbound links and iframes...')
    overwriteOutgoingLinks(utm_ps, utm_pm, utm_pc, utm_ct, utm_tt)
    overwriteIframeSrcs(utm_ps, utm_pm, utm_pc, utm_ct, utm_tt)
  }
}

// on document content loaded, function also attempt
// to aggressively overwrite any link on a click
document.addEventListener("DOMContentLoaded", utmOverwrite)
document.addEventListener("click", utmOverwrite)

// also do this after a few seconds just to make sure
// things dont show up on animations, delays, etc
document.addEventListener("click", function(){ 
  setTimeout(utmOverwrite, 1500) 
})
