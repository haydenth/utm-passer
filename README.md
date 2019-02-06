UTM PASSER
============

If you're a google analytics user, there are times when you end up in the following situation:

```
Site A.com ---> Site B.com ---> conversion on B
```

The problem is that if you want to track conversion by source, site B has no idea about the origin of the traffic to site A unless you pass it a `utm_source` code. Once you do that, Google Analytics should take it from there. This library when installed on all pages on site A will enforce that the following three variables: `utm_source`, `utm_medium`, and `utm_campaign` get passed to any other link on that page. This way, if you link to B from site A, the right parameters will be passed over.

This only works for `GET` requests. 

It should respect url in most common formats, although if you use this and find something broken submit an issue on here so I can take a look.


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
