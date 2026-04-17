---
title: "CDN Setup"
description: "Domestic and overseas split CDN architecture using object storage with intelligent DNS routing for global acceleration and Rclone file sync."
icon: "network-wired"
---
Currently using's CDN Solution from:https://www.eallion.com/cdn-cname-cloudflare/

Take a look at the CDN structure diagram. Our goal is to solve the global CDN problem at a low cost.

![cdn_dns](https://cdn.bangwu.top/img/cdn_dns.png)

Previous articleBackup

### Introduction

domestic and overseas traffic splitting，not only reduces costs，but also improves website performance，optimizes TTFB。

I don't remember when I started having such thoughts, so I went to search for it.
It turns out that the tutorials online are quite old. Where most of the talk's is access to CNAME is through Cloudflare for SaaS, but it doesn't support regular domain names, and can't access R2 or Workers.

In terms of function's priority, I need the partition resolution function most, which results in the inability to transfer the domain name's NS to Cloudflare.
Cloudflare's DNS is indeed excellent, but Cloudflare doesn't support geo-based resolution, it has CNAME flattening, but it will resolve all mainland China's IPs to China Unicom.
On the contrary, domestic DNS service providers do a good job in partition resolution, maybe because domestic domain names need this function more.
Can't fully commit, but want to use Cloudflare, so have to use some tricks.

In March 2022, Cloudflare announced changes to Cloudflare for SaaS's charging strategy. Each account can have 100 free domain names, and charges $0.1/month per extra domain. We use Cloudflare for SaaS to connect domains via CNAME and enjoy Cloudflare's powerful edge calculation capabilities.

Yes for small websites, such as this blogs, the above services are free's, free quota:

- DNSPod: Use's professional version, but freeversions also has partition resolution
- Tencent Cloud COS: 50G/month; 2 million requests
- Tencent Cloud CDN: 10G/month
- Cloudflare CDN: No upper limit for normal use
- Cloudflare R2: 10G/month; 1 million/10 million requests
- Backblaze B2: 10G/month; has [Traffic Alliance] with Cloudflare(https://www.backblaze.com/cloud-storage/integrations)

I skip Tencent Cloud's Configuration and only talk about Cloudflare's part here.
The prerequisite is that you already have an available domain name in your Cloudflare account.
This domain name is used to provide `回退源` (Fallback Origin), assuming this domain name is `example.com`.

### Create R2 and bind a custom domain name

1. Log in to the control panel: https://dash.cloudflare.com/, Cloudflare supportsChinese;
2. Create R2 bucket's Method is skipped here, for example, create: `r2-blog-test`;
3. in `R2` `设置` `公开Visit` `自Definition域` `连接域` Add a custom domain name to the 's R2 you just created:

[![/assets/images/posts/2023/07/r2_custom_hostname.png](https://www.eallion.com/assets/images/posts/2023/07/r2_custom_hostname.png)](https://www.eallion.com/assets/images/posts/2023/07/r2_custom_hostname.png)

Then the domain name's DNS will automatically appear with a resolution:

[![/assets/images/posts/2023/07/custom_hostname_dns.png](https://www.eallion.com/assets/images/posts/2023/07/custom_hostname_dns.png)](https://www.eallion.com/assets/images/posts/2023/07/custom_hostname_dns.png)

### Subscribe to Cloudflare for SaaS

1. Select the domain name `example.com` in `Zones`;
2. Select `自Definition主机名` in the domain name's `SSL/TLS`;
3. Select Enable Subscription. Subscriptions can be made using Paypal.

[![/assets/images/posts/2023/07/enable_cloudflare_saas.png](https://www.eallion.com/assets/images/posts/2023/07/enable_cloudflare_saas.png)](https://www.eallion.com/assets/images/posts/2023/07/enable_cloudflare_saas.png)

### Add custom domain name

After the subscription is successful, first add `回退源`:`images.example.com`. This return-to-origin domain name is bound in R2's self-defined domain name.

[![/assets/images/posts/2023/07/cf_callback_hostname.png](https://www.eallion.com/assets/images/posts/2023/07/cf_callback_hostname.png)](https://www.eallion.com/assets/images/posts/2023/07/cf_callback_hostname.png)

Then click `添加自Definition主机名` and fill in the CDN domain name, such as `images.eallion.com`. The recommended validation method is TXT Validation.

[![/assets/images/posts/2023/07/add_custom_hostname.png](https://www.eallion.com/assets/images/posts/2023/07/add_custom_hostname.png)](https://www.eallion.com/assets/images/posts/2023/07/add_custom_hostname.png)

After adding, you need to validate the domain name. Go to your own domain name resolution console, such as DNSPod, and add 2 TXT records.
Wait for both `证书State` and `主机名State` to become `有效`.

[![/assets/images/posts/2023/07/cf_dns_txt_records.png](https://www.eallion.com/assets/images/posts/2023/07/cf_dns_txt_records.png)](https://www.eallion.com/assets/images/posts/2023/07/cf_dns_txt_records.png)

### Parse CNAME

After `回退源State` `证书State` and `主机名State` become `有效`, go to your own domain name resolution console to add CNAME resolution.
Point the production environment's `images.eallion.com` CNAME to `images.example.com`.

[![/assets/images/posts/2023/07/dns_cname_records.png](https://www.eallion.com/assets/images/posts/2023/07/dns_cname_records.png)](https://www.eallion.com/assets/images/posts/2023/07/dns_cname_records.png)

Normally's tutorial ends here.
But this way isVisit doesn't work with R2's resources.
The most important step, use Worker Proxy R2.

### Create new Worker Proxy R2

There is official documentation on how to pass Worker Visit R2:
Use R2 from Workers:https://developers.cloudflare.com/r2/api/workers/workers-api-usage/

Just follow the documentation tutorial step by step.
If you are lazy, you don’t want to authenticate. Then just use my streamlined code.
The `DELETE` and `PUT` 's codes are directly removed, leaving only `GET`.
Workers can be created manually in the background without Wrangle CLI scripts.

Switch to the `Worker 和 Pages` column on the left, `创建应用程序`, just give it a name, choose a template Deployment, and change the code later.

Click `快速edit` to copy the following code to `worker.js`, save and Deployment:

```javascript
var worker_default = {
  async fetch(request, env) {
    if (request.method !== 'GET') {
      return new Response('Only GET method allowed', { status: 405 });
    }
    const url = new URL(request.url);
    const key = url.pathname.slice(1);
    const object = await env.MY_BUCKET.get(key);
    if (!object) {
      return new Response('Object not found', { status: 404 });
    }
    const headers = new Headers();
    object.writeHttpMetadata(headers);
    headers.set('ETag', object.httpEtag);
    return new Response(object.body, {
      headers,
    });
  },
};
export { worker_default as default };
```

Returned after Deployment is successful.
In the current Worker 's settings, `Variable` `R2 存储桶绑定` add binding:

- `Variablename`：`MY_BUCKET`
- `R2 存储桶`: Select yes should's bucket

[![/assets/images/posts/2023/07/r2_binding.png](https://www.eallion.com/assets/images/posts/2023/07/r2_binding.png)](https://www.eallion.com/assets/images/posts/2023/07/r2_binding.png)

### Workers routing

Go back to Zones, select the domain name, and add Workers routing:

- `路由`: Be sure to fill in the production environment's domain name, do not fill in Cloudflare's source domain name, such as: `images.eallion.com/*`;
- `Worker`: Select the previous step to create's Worker;
- `环境`：Production.

[![/assets/images/posts/2023/07/r2_worker_router.png](https://www.eallion.com/assets/images/posts/2023/07/r2_worker_router.png)](https://www.eallion.com/assets/images/posts/2023/07/r2_worker_router.png)

At this point, you should be able to visit Cloudflare R2's content using CNAME's method.

- https://images.eallion.com/eallion.jpg

### Worker Proxy Backblaze B2

In fact, R2 is enough, but B2 may be needed for various reasons.

Actually it's pretty much the same.

Backblaze also has official documentation introducing how to visit B2 through Cloudflare Worker.
Docs: [Integrate Cloudflare Workers with Backblaze B2](https://www.backblaze.com/docs/cloud-storage-integrate-cloudflare-workers-with-backblaze-b2)

Let’s briefly introduce how to do it: (It is also recommended to read Official Docs.)

##### 1. Create a new Cloudflare Worker, `worker.js`

```javascript
(() => {
  // node_modules/aws4fetch/dist/aws4fetch.esm.mjs
  var encoder = new TextEncoder();
  var HOST_SERVICES = {
    appstream2: 'appstream',
    cloudhsmv2: 'cloudhsm',
    email: 'ses',
    marketplace: 'aws-marketplace',
    mobile: 'AWSMobileHubService',
    pinpoint: 'mobiletargeting',
    queue: 'sqs',
    'git-codecommit': 'codecommit',
    'mturk-requester-sandbox': 'mturk-requester',
    'personalize-runtime': 'personalize',
  };
  var UNSIGNABLE_HEADERS = /* @__PURE__ */ new Set([
    'authorization',
    'content-type',
    'content-length',
    'user-agent',
    'presigned-expires',
    'expect',
    'x-amzn-trace-id',
    'range',
    'connection',
  ]);
  var AwsClient = class {
    constructor({
      accessKeyId,
      secretAccessKey,
      sessionToken,
      service,
      region,
      cache,
      retries,
      initRetryMs,
    }) {
      if (accessKeyId == null)
        throw new TypeError('accessKeyId is a required option');
      if (secretAccessKey == null)
        throw new TypeError('secretAccessKey is a required option');
      this.accessKeyId = accessKeyId;
      this.secretAccessKey = secretAccessKey;
      this.sessionToken = sessionToken;
      this.service = service;
      this.region = region;
      this.cache = cache || /* @__PURE__ */ new Map();
      this.retries = retries != null ? retries : 10;
      this.initRetryMs = initRetryMs || 50;
    }
    async sign(input, init) {
      if (input instanceof Request) {
        const { method, url, headers, body } = input;
        init = Object.assign({ method, url, headers }, init);
        if (init.body == null && headers.has('Content-Type')) {
          init.body =
            body != null && headers.has('X-Amz-Content-Sha256')
              ? body
              : await input.clone().arrayBuffer();
        }
        input = url;
      }
      const signer = new AwsV4Signer(
        Object.assign({ url: input }, init, this, init && init.aws)
      );
      const signed = Object.assign({}, init, await signer.sign());
      delete signed.aws;
      try {
        return new Request(signed.url.toString(), signed);
      } catch (e) {
        if (e instanceof TypeError) {
          return new Request(
            signed.url.toString(),
            Object.assign({ duplex: 'half' }, signed)
          );
        }
        throw e;
      }
    }
    async fetch(input, init) {
      for (let i = 0; i <= this.retries; i++) {
        const fetched = fetch(await this.sign(input, init));
        if (i === this.retries) {
          return fetched;
        }
        const res = await fetched;
        if (res.status < 500 && res.status !== 429) {
          return res;
        }
        await new Promise((resolve) =>
          setTimeout(resolve, Math.random() * this.initRetryMs * Math.pow(2, i))
        );
      }
      throw new Error(
        'An unknown error occurred, ensure retries is not negative'
      );
    }
  };
  var AwsV4Signer = class {
    constructor({
      method,
      url,
      headers,
      body,
      accessKeyId,
      secretAccessKey,
      sessionToken,
      service,
      region,
      cache,
      datetime,
      signQuery,
      appendSessionToken,
      allHeaders,
      singleEncode,
    }) {
      if (url == null) throw new TypeError('url is a required option');
      if (accessKeyId == null)
        throw new TypeError('accessKeyId is a required option');
      if (secretAccessKey == null)
        throw new TypeError('secretAccessKey is a required option');
      this.method = method || (body ? 'POST' : 'GET');
      this.url = new URL(url);
      this.headers = new Headers(headers || {});
      this.body = body;
      this.accessKeyId = accessKeyId;
      this.secretAccessKey = secretAccessKey;
      this.sessionToken = sessionToken;
      let guessedService, guessedRegion;
      if (!service || !region) {
        [guessedService, guessedRegion] = guessServiceRegion(
          this.url,
          this.headers
        );
      }
      this.service = service || guessedService || '';
      this.region = region || guessedRegion || 'us-east-1';
      this.cache = cache || /* @__PURE__ */ new Map();
      this.datetime =
        datetime || new Date().toISOString().replace(/[:-]|\.\d{3}/g, '');
      this.signQuery = signQuery;
      this.appendSessionToken =
        appendSessionToken || this.service === 'iotdevicegateway';
      this.headers.delete('Host');
      if (
        this.service === 's3' &&
        !this.signQuery &&
        !this.headers.has('X-Amz-Content-Sha256')
      ) {
        this.headers.set('X-Amz-Content-Sha256', 'UNSIGNED-PAYLOAD');
      }
      const params = this.signQuery ? this.url.searchParams : this.headers;
      params.set('X-Amz-Date', this.datetime);
      if (this.sessionToken && !this.appendSessionToken) {
        params.set('X-Amz-Security-Token', this.sessionToken);
      }
      this.signableHeaders = ['host', ...this.headers.keys()]
        .filter((header) => allHeaders || !UNSIGNABLE_HEADERS.has(header))
        .sort();
      this.signedHeaders = this.signableHeaders.join(';');
      this.canonicalHeaders = this.signableHeaders
        .map(
          (header) =>
            header +
            ':' +
            (header === 'host'
              ? this.url.host
              : (this.headers.get(header) || '').replace(/\s+/g, ' '))
        )
        .join('\n');
      this.credentialString = [
        this.datetime.slice(0, 8),
        this.region,
        this.service,
        'aws4_request',
      ].join('/');
      if (this.signQuery) {
        if (this.service === 's3' && !params.has('X-Amz-Expires')) {
          params.set('X-Amz-Expires', '86400');
        }
        params.set('X-Amz-Algorithm', 'AWS4-HMAC-SHA256');
        params.set(
          'X-Amz-Credential',
          this.accessKeyId + '/' + this.credentialString
        );
        params.set('X-Amz-SignedHeaders', this.signedHeaders);
      }
      if (this.service === 's3') {
        try {
          this.encodedPath = decodeURIComponent(
            this.url.pathname.replace(/\+/g, ' ')
          );
        } catch (e) {
          this.encodedPath = this.url.pathname;
        }
      } else {
        this.encodedPath = this.url.pathname.replace(/\/+/g, '/');
      }
      if (!singleEncode) {
        this.encodedPath = encodeURIComponent(this.encodedPath).replace(
          /%2F/g,
          '/'
        );
      }
      this.encodedPath = encodeRfc3986(this.encodedPath);
      const seenKeys = /* @__PURE__ */ new Set();
      this.encodedSearch = [...this.url.searchParams]
        .filter(([k]) => {
          if (!k) return false;
          if (this.service === 's3') {
            if (seenKeys.has(k)) return false;
            seenKeys.add(k);
          }
          return true;
        })
        .map((pair) => pair.map((p) => encodeRfc3986(encodeURIComponent(p))))
        .sort(([k1, v1], [k2, v2]) =>
          k1 < k2 ? -1 : k1 > k2 ? 1 : v1 < v2 ? -1 : v1 > v2 ? 1 : 0
        )
        .map((pair) => pair.join('='))
        .join('&');
    }
    async sign() {
      if (this.signQuery) {
        this.url.searchParams.set('X-Amz-Signature', await this.signature());
        if (this.sessionToken && this.appendSessionToken) {
          this.url.searchParams.set('X-Amz-Security-Token', this.sessionToken);
        }
      } else {
        this.headers.set('Authorization', await this.authHeader());
      }
      return {
        method: this.method,
        url: this.url,
        headers: this.headers,
        body: this.body,
      };
    }
    async authHeader() {
      return [
        'AWS4-HMAC-SHA256 Credential=' +
          this.accessKeyId +
          '/' +
          this.credentialString,
        'SignedHeaders=' + this.signedHeaders,
        'Signature=' + (await this.signature()),
      ].join(', ');
    }
    async signature() {
      const date = this.datetime.slice(0, 8);
      const cacheKey = [
        this.secretAccessKey,
        date,
        this.region,
        this.service,
      ].join();
      let kCredentials = this.cache.get(cacheKey);
      if (!kCredentials) {
        const kDate = await hmac('AWS4' + this.secretAccessKey, date);
        const kRegion = await hmac(kDate, this.region);
        const kService = await hmac(kRegion, this.service);
        kCredentials = await hmac(kService, 'aws4_request');
        this.cache.set(cacheKey, kCredentials);
      }
      return buf2hex(await hmac(kCredentials, await this.stringToSign()));
    }
    async stringToSign() {
      return [
        'AWS4-HMAC-SHA256',
        this.datetime,
        this.credentialString,
        buf2hex(await hash(await this.canonicalString())),
      ].join('\n');
    }
    async canonicalString() {
      return [
        this.method.toUpperCase(),
        this.encodedPath,
        this.encodedSearch,
        this.canonicalHeaders + '\n',
        this.signedHeaders,
        await this.hexBodyHash(),
      ].join('\n');
    }
    async hexBodyHash() {
      let hashHeader =
        this.headers.get('X-Amz-Content-Sha256') ||
        (this.service === 's3' && this.signQuery ? 'UNSIGNED-PAYLOAD' : null);
      if (hashHeader == null) {
        if (
          this.body &&
          typeof this.body !== 'string' &&
          !('byteLength' in this.body)
        ) {
          throw new Error(
            'body must be a string, ArrayBuffer or ArrayBufferView, unless you include the X-Amz-Content-Sha256 header'
          );
        }
        hashHeader = buf2hex(await hash(this.body || ''));
      }
      return hashHeader;
    }
  };
  async function hmac(key, string) {
    const cryptoKey = await crypto.subtle.importKey(
      'raw',
      typeof key === 'string' ? encoder.encode(key) : key,
      { name: 'HMAC', hash: { name: 'SHA-256' } },
      false,
      ['sign']
    );
    return crypto.subtle.sign('HMAC', cryptoKey, encoder.encode(string));
  }
  async function hash(content) {
    return crypto.subtle.digest(
      'SHA-256',
      typeof content === 'string' ? encoder.encode(content) : content
    );
  }
  function buf2hex(buffer) {
    return Array.prototype.map
      .call(new Uint8Array(buffer), (x) => ('0' + x.toString(16)).slice(-2))
      .join('');
  }
  function encodeRfc3986(urlEncodedStr) {
    return urlEncodedStr.replace(
      /[!'()*]/g,
      (c) => '%' + c.charCodeAt(0).toString(16).toUpperCase()
    );
  }
  function guessServiceRegion(url, headers) {
    const { hostname, pathname } = url;
    if (hostname.endsWith('.r2.cloudflarestorage.com')) {
      return ['s3', 'auto'];
    }
    if (hostname.endsWith('.backblazeb2.com')) {
      const match2 = hostname.match(
        /^(?:[^.]+\.)?s3\.([^.]+)\.backblazeb2\.com$/
      );
      return match2 != null ? ['s3', match2[1]] : ['', ''];
    }
    const match = hostname
      .replace('dualstack.', '')
      .match(/([^.]+)\.(?:([^.]*)\.)?amazonaws\.com(?:\.cn)?$/);
    let [service, region] = (match || ['', '']).slice(1, 3);
    if (region === 'us-gov') {
      region = 'us-gov-west-1';
    } else if (region === 's3' || region === 's3-accelerate') {
      region = 'us-east-1';
      service = 's3';
    } else if (service === 'iot') {
      if (hostname.startsWith('iot.')) {
        service = 'execute-api';
      } else if (hostname.startsWith('data.jobs.iot.')) {
        service = 'iot-jobs-data';
      } else {
        service = pathname === '/mqtt' ? 'iotdevicegateway' : 'iotdata';
      }
    } else if (service === 'autoscaling') {
      const targetPrefix = (headers.get('X-Amz-Target') || '').split('.')[0];
      if (targetPrefix === 'AnyScaleFrontendService') {
        service = 'application-autoscaling';
      } else if (targetPrefix === 'AnyScaleScalingPlannerFrontendService') {
        service = 'autoscaling-plans';
      }
    } else if (region == null && service.startsWith('s3-')) {
      region = service.slice(3).replace(/^fips-|^external-1/, '');
      service = 's3';
    } else if (service.endsWith('-fips')) {
      service = service.slice(0, -5);
    } else if (region && /-\d$/.test(service) && !/-\d$/.test(region)) {
      [service, region] = [region, service];
    }
    return [HOST_SERVICES[service] || service, region];
  }

  // index.js
  var UNSIGNABLE_HEADERS2 = ['x-forwarded-proto', 'x-real-ip'];
  function filterHeaders(headers) {
    return Array.from(headers.entries()).filter(
      (pair) =>
        !UNSIGNABLE_HEADERS2.includes(pair[0]) && !pair[0].startsWith('cf-')
    );
  }
  async function handleRequest(event, client2) {
    const request = event.request;
    if (!['GET', 'HEAD'].includes(request.method)) {
      return new Response(null, {
        status: 405,
        statusText: 'Method Not Allowed',
      });
    }
    const url = new URL(request.url);
    let path = url.pathname.replace(/^\//, '');
    path = path.replace(/\/$/, '');
    const pathSegments = path.split('/');
    if (ALLOW_LIST_BUCKET !== 'true') {
      if (
        (BUCKET_NAME === '$path' && pathSegments[0].length < 2) ||
        (BUCKET_NAME !== '$path' && path.length === 0)
      ) {
        return new Response(null, {
          status: 404,
          statusText: 'Not Found',
        });
      }
    }
    switch (BUCKET_NAME) {
      case '$path':
        url.hostname = B2_ENDPOINT;
        break;
        break;
      case '$host':
        url.hostname = url.hostname.split('.')[0] + '.' + B2_ENDPOINT;
        break;
      default:
        url.hostname = BUCKET_NAME + '.' + B2_ENDPOINT;
        break;
    }
    const headers = filterHeaders(request.headers);
    const signedRequest = await client2.sign(url.toString(), {
      method: request.method,
      headers,
      body: request.body,
    });
    return fetch(signedRequest);
  }
  var endpointRegex = /^s3\.([a-zA-Z0-9-]+)\.backblazeb2\.com$/;
  var [, aws_region] = B2_ENDPOINT.match(endpointRegex);
  var client = new AwsClient({
    accessKeyId: B2_APPLICATION_KEY_ID,
    secretAccessKey: B2_APPLICATION_KEY,
    service: 's3',
    region: aws_region,
  });
  addEventListener('fetch', function (event) {
    event.respondWith(handleRequest(event, client));
  });
})();
```

##### 2. Set Worker Environment Variables

- `ALLOW_LIST_BUCKET`：true
- `B2_APPLICATION_KEY`：K004WJZP11111111111111111111Q
- `B2_APPLICATION_KEY_ID`：0042e9999999920000000001
- `B2_ENDPOINT`：s3.us-west-004.backblazeb2.com
- `BUCKET_NAME`：eallion-static

The APP KEY and ID need to be generated in the Backblaze backend, and `B2_ENDPOINT` needs to be viewed in its own B2 bucket.

##### 3. Manually add CNAME to resolve to B2

[![/assets/images/posts/2023/07/b2_cf_record.png](https://www.eallion.com/assets/images/posts/2023/07/b2_cf_record.png)](https://www.eallion.com/assets/images/posts/2023/07/b2_cf_record.png)

- `类型`: Select `CNAME`
- `name`: used for `回退源`, such as: `b2.example.com`, fill in `b2`
- `内容`: Fill in your own B2 bucket allocation's `S3 URL`, there's a tutorial here written byis `Friendly URL`, it's not necessary, there is one more step to reverse generation.

[![/assets/images/posts/2023/07/backblaze_url.png](https://www.eallion.com/assets/images/posts/2023/07/backblaze_url.png)](https://www.eallion.com/assets/images/posts/2023/07/backblaze_url.png)

##### 4. Configuration fallback source

`Zones`'s domain name is Backblaze B2. Set's CNAME name is whatever it is, then fill in whatever the fallback source is, such as: `b2.example.com`.
Just refer to the previous article.

##### 5. Configuration self-defined host name

Refer to the previous article.

##### 6. Configuration Worker routing

- `路由`: Be sure to fill in the production environment's domain name, do not fill in Cloudflare's source domain name;
- `Worker`: Select the previous step to create's Worker;
- `环境`：Production.

Adding Worker routes for Backblaze B2 is different from Cloudflare R2. You need to add 2 items:

- `b2.example.com/*` also needs to be added to the Worker route
- `images.eallion.com/*`

:::

CDN certificate automatic replacement

The above has solved the basic issue, but there is still a pain point with the SSL certificate issue. CF offers free renewal and update of never-expired certificates, but domestic CDN manufacturers generally need to manually upload their own application's certificates. . . This is really inconvenient, so I was wondering if I could find some solutions:

::: details Automatically update certificate scripts

Cause: Because Configuration domestic CDN basically requires manual uploading of certificates, but the domain name certificate I applied for basically has a three-month shelf life, so I thought of writing an automatic script to automatically update the certificate.
Environment:
1panel (domestic panel, automatic application for certificates, and other powerful functions, very convenient's)

I use Duojiyun as an example. Other manufacturers can find the corresponding SDK.
The code is as follows:

```python
from hashlib import sha1
import hmac
import requests
import json
import urllib

def dogecloud_api(api_path, data={}, json_mode=False):
    """
    调用多吉云API

    :param api_path:    调用's  API Interface地址，Package含 URL 请求parameters QueryString，for example：/console/vfetch/add.json?url=xxx&a=1&b=2
    :param data:        POST 's 数据，dictionary，for example {'a': 1, 'b': 2}，传递此parameters表示不is GET 请求而is POST 请求
    :param json_mode:   数据 data is否以 JSON 格式请求，默认为 false 则使用Form形式（a=1&b=2）

    :type api_path: string
    :type data: dict
    :type json_mode bool

    :return dict: 返回's 数据
    """

    # 这里替换为你's 多吉云永久 AccessKey 和 SecretKey，可in用户中心 - 密钥管理中View
    # 请勿in客户端暴露 AccessKey 和 SecretKey，否则恶意用户将获得账号完全控制权
    access_key = ''
    secret_key = ''

    body = ''
    mime = ''
    if json_mode:
        body = json.dumps(data)
        mime = 'application/json'
    else:
        body = urllib.parse.urlencode(data) # Python 2 可以直接用 urllib.urlencode
        mime = 'application/x-www-form-urlencoded'
    sign_str = api_path + "\n" + body
    signed_data = hmac.new(secret_key.encode('utf-8'), sign_str.encode('utf-8'), sha1)
    sign = signed_data.digest().hex()
    authorization = 'TOKEN ' + access_key + ':' + sign
    response = requests.post('https://api.dogecloud.com' + api_path, data=body, headers = {
        'Authorization': authorization,
        'Content-Type': mime
    })
    return response.json()
api = dogecloud_api('/cdn/cert/list.json')
if api['code'] == 200:
    for cert in api['data']['certs']:
        ssl_next_id = cert['id']
        delet_api = dogecloud_api('/cdn/cert/delete.json', {
    'id': cert['id']
})
else:
    print("api failed: " + api['msg']) # 失败
# 下面两个路径就is1panelauto-generated证书路径
with open('/opt/1panel/apps/openresty/openresty/www/sites/xxxx/ssl/fullchain.pem') as fullchain:
    full = fullchain.read()
with open('/opt/1panel/apps/openresty/openresty/www/sites/xxxx/ssl/privkey.pem') as privkey:
    priv = privkey.read()
api = dogecloud_api('/cdn/cert/upload.json', {
    "note": f"自动证书{ssl_next_id}",
    "cert": full,
    "private": priv
})
if api['code'] == 200:
    ssl_id = api['data']['id']
else:
    print("api failed: " + api['msg']) # 失败
api = dogecloud_api('/cdn/domain/config.json?domain=cdn.example.com', {
    'cert_id': ssl_id
}, True)

```

The basic implementation idea is to first remove the existing certificate, then add the read's certificate, then upload and activate the uploaded's certificate, so that the Implementation CDN certificate is automatically configured. You can use 1panel to automatically execute scripts every one month to update the certificate. It's really Implementation again a Qiweiwei's tips ✊✊✊

:::
