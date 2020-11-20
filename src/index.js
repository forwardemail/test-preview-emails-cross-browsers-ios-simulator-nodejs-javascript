const fs = require('fs');
const os = require('os');
const path = require('path');

const dayjs = require('dayjs');
const debug = require('debug')('preview-email');
const nodemailer = require('nodemailer');
const open = require('open');
const pify = require('pify');
const pug = require('pug');
const uuid = require('uuid');
const { simpleParser } = require('mailparser');

const writeFile = pify(fs.writeFile);

const transport = nodemailer.createTransport({
  streamTransport: true,
  buffer: true
});

const templateFilePath = path.join(__dirname, '..', 'template.pug');

const renderFilePromise = pify(pug.renderFile);

const previewEmail = async (message, options) => {
  options = {
    dir: os.tmpdir(),
    id: uuid.v4(),
    open: { wait: false },
    template: templateFilePath,
    urlTransform: (path) => `file://${path}`,
    ...options
  };
  debug('message', message, 'options', options);

  if (typeof message !== 'object')
    throw new Error('Message argument is required');

  const result = await transport.sendMail(message);

  const parsed = await simpleParser(result.message);

  const html = await renderFilePromise(
    options.template,
    Object.assign(parsed, {
      cache: true,
      pretty: true,
      dayjs
    })
  );

  const filePath = `${options.dir}/${options.id}.html`;
  debug('filePath', filePath);
  await writeFile(filePath, html);

  const url = options.urlTransform(filePath);
  if (options.open) await open(url, options.open);

  return url;
};

module.exports = previewEmail;
