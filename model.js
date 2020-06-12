const Sequelize = require('sequelize');
const Model = Sequelize.Model;

class Book extends Model { }

function init(sequelize) {
  return Book.init({
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
}

module.exports = {
  init
};