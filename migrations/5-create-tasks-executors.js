module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('taskexecutors', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      executor: {
        allowNull: false,
        unique: false,
        type: Sequelize.BOOLEAN,
      },
      taskId: {
        type: Sequelize.INTEGER,
        onDelete: 'CASCADE',
        references: {
          model: 'tasks',
          key: 'id',
        },
      },
      userId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'users',
          key: 'id',
        },
      },
    },
    {
      timestamps: false,
      createdAt: false,
      updatedAt: false,
    });
  },
  down: async (queryInterface) => {
    await queryInterface.dropTable('taskexecutors');
  },
};
