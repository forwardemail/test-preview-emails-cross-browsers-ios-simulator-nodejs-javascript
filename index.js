const path = require('path');
const os = require('os');
const fs = require('fs-extra');
const uuid = require('uuid');
const opn = require('opn');
const nodemailer = require('nodemailer');
const moment = require('moment');
const pug = require('pug');

const transport = nodemailer.createTransport({
  jsonTransport: true
});

const templateFilePath = path.join(__dirname, 'template.pug');

const renderFilePromise = (view, locals) => {
  return new Promise((resolve, reject) => {
    pug.renderFile(view, locals, (err, html) => {
      if (err) return reject(err);
      resolve(html);
    });
  });
};

const previewEmail = (message, id, open = true) => {
  return new Promise(async (resolve, reject) => {
    try {
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
      await fs.writeFile(filePath, html);

      if (open) await opn(filePath, { wait: false });

      resolve(`file://${filePath}`);
    } catch (err) {
      reject(err);
    }
  });
};

module.exports = previewEmail;
