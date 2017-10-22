# preview-email

[![build status](https://img.shields.io/travis/niftylettuce/preview-email.svg)](https://travis-ci.org/niftylettuce/preview-email)
[![code coverage](https://img.shields.io/codecov/c/github/niftylettuce/preview-email.svg)](https://codecov.io/gh/niftylettuce/preview-email)
[![code style](https://img.shields.io/badge/code_style-XO-5ed9c7.svg)](https://github.com/sindresorhus/xo)
[![styled with prettier](https://img.shields.io/badge/styled_with-prettier-ff69b4.svg)](https://github.com/prettier/prettier)
[![made with lass](https://img.shields.io/badge/made_with-lass-95CC28.svg)](https://lass.js.org)
[![license](https://img.shields.io/github/license/niftylettuce/preview-email.svg)](<>)

> Automatically opens your browser to preview [Node.js][node] email messages sent with [Nodemailer][]. Made for [Lad][]!

**[VIEW THE DEMO](demo.png)**


## Table of Contents

* [Install](#install)
* [Usage](#usage)
* [Options](#options)
* [Contributors](#contributors)
* [License](#license)


## Install

[npm][]:

```sh
npm install preview-email
```

[yarn][]:

```sh
yarn add preview-email
```


## Usage

> **NOTE**: You should probably just use [email-templates][] directly instead of using this package.

The function `previewEmail` returns a `Promise` which resolves with a URL. We automatically open the browser to this URL unless you specify the third argument `open` as `false` (see [Options](#options) for more info).

```js
const previewEmail = require('preview-email');
const nodemailer = require('nodemailer');

const transport = nodemailer.createTransport({
  jsonTransport: true
});

// <https://nodemailer.com/message/>
const message = {
  from: 'niftylettuce+from@gmail.com',
  to: 'niftylettuce+to@gmail.com',
  subject: 'Hello world',
  html: '<p>Hello world</p>',
  text: 'Hello world',
  attachments: [ { filename: 'hello-world.txt', content: 'Hello world' } ]
};

// note that `attachments` will not be parsed unless you use
// `previewEmail` with the results of `transport.sendMail`
// e.g. `previewEmail(JSON.parse(res.message));` where `res`
// is `const res = await transport.sendMail(message);`
previewEmail(message).then(console.log).catch(console.error);

transport.sendMail(message).then(console.log).catch(console.error);
```


## Options

Note that you can also pass two additional arguments to `previewEmail` function.

These arguments are `id` and `open` (e.g. `previewEmail(message, id, open)`).

By default we automatically set an `id` using `uuid.v4()` (see [uuid][] for more info).

Also, `open` is set to `true` by default - this means that we automatically open the browser for you.


## Contributors

| Name           | Website                    |
| -------------- | -------------------------- |
| **Nick Baugh** | <http://niftylettuce.com/> |


## License

[MIT](LICENSE) © [Nick Baugh](http://niftylettuce.com/)


## 

[npm]: https://www.npmjs.com/

[yarn]: https://yarnpkg.com/

[email-templates]: https://github.com/niftylettuce/email-templates

[node]: https://nodejs.org/

[nodemailer]: https://nodemailer.com

[uuid]: https://github.com/kelektiv/node-uuid

[lad]: https://lad.js.org
