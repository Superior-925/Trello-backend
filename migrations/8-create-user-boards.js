const User = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('userboards', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
      },
      owner: {
        type: Sequelize.BOOLEAN,
        allowNull: false
      },
      userId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'users',
          key: 'id',
        },
      },
      boardId: {
        type: Sequelize.INTEGER,
        onDelete: 'CASCADE',
        references: {
          model: 'boards',
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
    await queryInterface.dropTable('userboards');
  },
};

module.exports = User;
