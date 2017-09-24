const path = require('path');
const test = require('ava');

const previewEmail = require('../');

test('returns function', t => {
  t.true(typeof previewEmail === 'function');
});

test('opens a preview email', async t => {
  const message = {
    from: 'niftylettuce <niftylettuce+from@gmail.com>',
    to: 'niftylettuce+to@gmail.com, niftylettuce <niftylettuce+test@gmail.com>',
    subject: 'Hello world',
    html: `<p>Hello world</p>`,
    text: 'Hello world',
    attachments: [
      { filename: 'hello-world.txt', content: 'Hello world' },
      { path: path.join(__dirname, '..', '.editorconfig') }
    ],
    headers: {
      'X-Some-Custom-Header': 'Some Custom Value'
    },
    list: {
      unsubscribe: 'https://niftylettuce.com/unsubscribe'
    }
  };

  const url = await previewEmail(message);
  t.true(typeof url === 'string');
});

test('does not open', async t => {
  const url = await previewEmail({});
  t.true(typeof url === 'string');
});

test('invalid message', async t => {
  const error = await t.throws(previewEmail(false));
  t.is(error.message, 'Message argument is required');
});

test('custom id', async t => {
  const id = new Date().getTime().toString();
  const url = await previewEmail({}, id);
  t.is(path.basename(url).replace('.html', ''), id);
});

test('does not open in browser', async t => {
  const url = await previewEmail({}, null, false);
  t.true(typeof url === 'string');
});
