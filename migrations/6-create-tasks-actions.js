module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('taskactions', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      taskId: {
        allowNull: false,
        unique: false,
        type: Sequelize.INTEGER,
      },
      taskTitle: {
        allowNull: false,
        unique: false,
        type: Sequelize.STRING,
      },
      action: {
        allowNull: true,
        unique: false,
        type: Sequelize.STRING,
      },
      boardId: {
        allowNull: false,
        type: Sequelize.INTEGER,
        onDelete: 'CASCADE',
        references: {
          model: 'boards',
          key: 'id',
        },
      },
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
    await queryInterface.dropTable('taskactions');
  },
};
