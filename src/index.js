const fs = require('fs');
const os = require('os');
const path = require('path');
const debug = require('debug')('preview-email');
const dayjs = require('dayjs');
const nodemailer = require('nodemailer');
const open = require('open');
const pify = require('pify');
const pug = require('pug');
const uuid = require('uuid');

const writeFile = pify(fs.writeFile);

const transport = nodemailer.createTransport({
  jsonTransport: true
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

  res.message = JSON.parse(res.message);

  const html = await renderFilePromise(
    options.template,
    Object.assign(res.message, {
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
