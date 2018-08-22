const path = require('path');
const os = require('os');
const fs = require('fs');
const uuid = require('uuid');
const opn = require('opn');
const nodemailer = require('nodemailer');
const moment = require('moment');
const pug = require('pug');
const Promise = require('bluebird');

const writeFile = Promise.promisify(fs.writeFile);

const transport = nodemailer.createTransport({
  jsonTransport: true
});

const templateFilePath = path.join(__dirname, '..', 'template.pug');

const renderFilePromise = Promise.promisify(pug.renderFile);

const previewEmail = async (message, id, open = true) => {
  if (typeof message !== 'object')
    throw new Error('Message argument is required');

  if (!id) id = uuid.v4();

  const res = await transport.sendMail(message);

  res.message = JSON.parse(res.message);

  const html = await renderFilePromise(
    templateFilePath,
    Object.assign(res.message, {
      cache: true,
      pretty: true,
      moment
    })
  );

  const filePath = `${os.tmpdir()}/${id}.html`;
  await writeFile(filePath, html);

  if (open) await opn(filePath, { wait: false });

  return `file://${filePath}`;
};

module.exports = previewEmail;
