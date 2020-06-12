const http = require('http');
const unzip = require('unzip-stream').Parse();
const untar = require('tar-stream').extract();
const Sequelize = require('sequelize');
const Model = Sequelize.Model;
const utils = require('./utils');
const { db, dataUrl } = require('./config');

const sequelize = new Sequelize(db.name, db.user, db.password, {
  host: db.host,
  dialect: db.dialect,
  logging: false
});

class Book extends Model { }
Book.init({
  id: {
    type: Sequelize.INTEGER,
    allowNull: false,
    primaryKey: true
  },
  title: {
    type: Sequelize.TEXT
  },
  authors: {
    type: Sequelize.TEXT
  },
  publisher: {
    type: Sequelize.STRING
  },
  publicationDate: {
    type: Sequelize.DATEONLY
  },
  language: {
    type: Sequelize.STRING
  },
  subjects: {
    type: Sequelize.TEXT
  },
  license: {
    type: Sequelize.STRING
  }
}, {
  sequelize,
  modelName: 'book'
});

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
