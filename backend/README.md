# backend

## API

### Base URL

***http://matting.zsyhh.com:4800/***

* note: status is boolean

### sample status false response
```JSON
{
    "status": false,
    "msg": ""
}
```

### upload:

upload a file, matting and return result img download url

***url: /api/v1/upload***

**request: multipart/form-data**
```
POST /api/v1/upload HTTP/1.1
Host: matting.zsyhh.com:4800
Content-Type: multipart/form-data; boundary=----WebKitFormBoundary7MA4YWxkTrZu0gW
Cache-Control: no-cache
Postman-Token: e13af909-95f6-410b-94f2-37461629f6bb

------WebKitFormBoundary7MA4YWxkTrZu0gW
Content-Disposition: form-data; name="file"; filename="test.png"
Content-Type: image/png


------WebKitFormBoundary7MA4YWxkTrZu0gW--
```

**return**

```JSON
{
  "status": true, 
  "data": "http://matting.zsyhh.com:4800/download/7pG7qdfUpvcKN2i0YpuzIUVk9sGURtDu.png"
}
```

### image synthesis:

upload a background image and synthesis it with an alpha image

***url: /api/v1/synthesis***

**request: multipart/form-data**
```
file (background image)
fg_path (an url that already exists at server. For example http://matting.zsyhh.com:4800/download/7pG7qdfUpvcKN2i0YpuzIUVk9sGURtDu.png)
```
raw
```
POST /api/v1/synthesis HTTP/1.1
Host: matting.zsyhh.com:4800
Cache-Control: no-cache
Postman-Token: 874546e2-d496-4462-a789-910601a931a8
Content-Type: multipart/form-data; boundary=----WebKitFormBoundary7MA4YWxkTrZu0gW

------WebKitFormBoundary7MA4YWxkTrZu0gW
Content-Disposition: form-data; name="file"; filename=""
Content-Type: 


------WebKitFormBoundary7MA4YWxkTrZu0gW
Content-Disposition: form-data; name="fg_path"

http://matting.zsyhh.com:4800/download/7pG7qdfUpvcKN2i0YpuzIUVk9sGURtDu.png
------WebKitFormBoundary7MA4YWxkTrZu0gW--
```

**return**

```JSON
{
  "status": true, 
  "data": "http://matting.zsyhh.com:4800/download/sc8jdxdQ1gdyME1BVkj9B9HqHGo_Cih_.png"
}
```

## Appendix
* note: all status false msg is following:(String)
```
invalid_file
invalid_params
```


