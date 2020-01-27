module.exports = {
  up: (queryInterface, Sequelize) => {
    // adiciona uma coluna na tabela users de nome avatar_id
    return queryInterface.addColumn('users', 'avatar_id', {
      type: Sequelize.INTEGER,
      // cria um relacionamento por chave estrageira na tabela files pela coluna id
      references: { model: 'files', key: 'id' },
      // se ele for alterado as alteraçoes iram refletir na tabela de usuario
      ondUpdate: 'CASCADE',
      // se o registro for deletado da tabela files o campo avatar_id sera setado com NULL
      onDelete: 'SET NULL',
      allowNull: true,
    });
  },

  down: queryInterface => {
    return queryInterface.removeColumn('users', 'avatar_id');
  },
};
