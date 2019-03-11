UTM PASSER
============

If you're a google analytics user, there are times when you end up in the following situation:

```
Site A.com ---> Site B.com ---> conversion on B
```

The problem is that if you want to track conversion by source, site B has no idea about the origin of the traffic to site A unless you pass it a `utm_source` code. Once you do that, Google Analytics should take it from there. This library when installed on all pages on site A will enforce that the following three variables: `utm_source`, `utm_medium`, and `utm_campaign` get passed to any other link on that page. This way, if you link to B from site A, the right parameters will be passed over.

This only works for `GET` requests. Also this doesn't do anything sophsticated to your existing javascript, so if you're linking in any way other than a `<a href>` tag, then this won't handle that. 

It should respect url in most common formats, although if you use this and find something broken submit an issue on here so I can take a look.


URLs You Don't Want UTMs On
-------------------
Sometimes there are URLs where you don't want to append a utm value or parameter of any kind because it will screw up some existing javascript. This happens if you have ajax buttons or something. If this is the case, just add the `no-utm` attribute to the URL, like this:

```
<a href='asdf' no-utm>link with NEVER a UTM</a>
```

In this case, the library will be smart enough to not jam UTMs through.


Installation
------------

To put on a page, put this code snippet JUST BEFORE the `</body>` tag.

```
<script src="/path/to/js/utm-passer.min.js"></script>
```

I usually uglify this code too before I release it, just so all the comments and stuff don't go out
```
uglifyjs --compress --mangle -- utm-passer.js >> utm-passer.min.js
```

And then release that.

Contact
-----------

If you have questions: thayden@gmail.com
