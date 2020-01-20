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
    ...options
  };
  debug('message', message, 'options', options);

  if (typeof message !== 'object')
    throw new Error('Message argument is required');

  const res = await transport.sendMail(message);

  const parsed = await simpleParser(res.message);

  console.log('parsed', parsed);
  console.log('parsed.attachments', parsed.attachments);

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

  if (options.open) await open(filePath, options.open);

  return `file://${filePath}`;
};

module.exports = previewEmail;
