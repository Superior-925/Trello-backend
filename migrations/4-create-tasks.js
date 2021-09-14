module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('tasks', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      // listName: {
      //   allowNull: false,
      //   unique: false,
      //   type: Sequelize.STRING,
      // },
      taskTitle: {
        allowNull: false,
        unique: false,
        type: Sequelize.STRING,
      },
      taskText: {
        allowNull: true,
        unique: false,
        type: Sequelize.STRING,
      },
      archived: {
        allowNull: true,
        unique: false,
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      order: {
        allowNull: true,
        unique: false,
        type: Sequelize.INTEGER,
      },
      listId: {
        allowNull: false,
        type: Sequelize.INTEGER,
        onDelete: 'CASCADE',
        references: {
          model: 'lists',
          key: 'id',
        },
      },
      // boardId: {
      //   allowNull: false,
      //   type: Sequelize.INTEGER,
      //   onDelete: 'CASCADE',
      //   references: {
      //     model: 'boards',
      //     key: 'id',
      //   },
      // },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  down: async (queryInterface) => {
    await queryInterface.dropTable('tasks');
  },
};
