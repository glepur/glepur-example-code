const http = require('http');
const unzip = require('unzip-stream').Parse();
const untar = require('tar-stream').extract();
const Sequelize = require('sequelize');
const { parseXML } = require('./utils');
const { db, dataUrl } = require('./config');

const sequelize = new Sequelize(db.name, db.user, db.password, {
  host: db.host,
  dialect: db.dialect,
  logging: false
});

const Book = require('./model').init(sequelize);

sequelize
  .authenticate()
  .then(() => {
    console.log('Connection has been established successfully.');

  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });

http.get(dataUrl, { encoding: null }, async res => {
  await Book.sync({ force: true });
  res
    .pipe(unzip)
    .on('entry', tarFile => tarFile
      .pipe(untar)
      .on('entry', (header, stream, next) => {
        const chunks = [];
        stream.on('data', data => chunks.push(data));
        stream.on('end', async () => {
          const entry = Buffer.concat(chunks).toString('utf8');
          try {
            const payload = await utils.parseXML(entry);
            const [, created] = await Book.findOrCreate({
              where: {
                id: payload.id
              },
              defaults: payload
            });
            if (!created) {
              console.log('Book already exists');
            } else {
              console.log(`Created book: ${payload.id}`);
            }
          } catch (e) {
            console.error(e);
          }
          next();
        });
      })
    );
}).on('error', console.error);
