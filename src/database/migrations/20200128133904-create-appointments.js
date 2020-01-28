module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('appointments', {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      date: {
        type: Sequelize.DATE,
        allowNull: false,
      },

      // relacionamento vai registrar qual usuario esta realizando o agendameto
      user_id: {
        type: Sequelize.INTEGER,
        // cria um relacionamento por chave estrageira na tabela users pela coluna id
        // obs não é o nome do Model User e sim da tabela users
        references: { model: 'users', key: 'id' },
        // se  for alterado users as alteraçoes irão refletir na tabela de usuario
        ondUpdate: 'CASCADE',
        // ex se for deletado o usuario todos agendamentos do usuario seão mantidos
        onDelete: 'SET NULL',
        allowNull: true,
      },

      // este relacionamento vai registrar qual provider vai atender esse cliente
      provider_id: {
        type: Sequelize.INTEGER,
        // cria um relacionamento por chave estrageira na tabela users pela coluna id
        references: { model: 'users', key: 'id' },
        // se  for alterado users as alteraçoes irão refletir na tabela de usuario
        ondUpdate: 'CASCADE',
        // ex se for deletado o usuario todos agendamentos do usuario seão mantidos
        onDelete: 'SET NULL',
        allowNull: true,
      },
      // se nao for declarado allowNull será por default true
      canceled_at: {
        type: Sequelize.DATE,
        allowNull: true,
      },

      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },

      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
    });
  },

  down: queryInterface => {
    return queryInterface.dropTable('appointments');
  },
};
