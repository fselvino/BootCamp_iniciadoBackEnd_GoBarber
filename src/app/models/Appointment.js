import Sequelize, { Model } from 'sequelize';

class Appointment extends Model {
  static init(sequelize) {
    super.init(
      {
        date: Sequelize.DATE,
        canceled_at: Sequelize.DATE,
        // campo virtual para possibilitar o acesso a imagem no servidor
      },
      { sequelize }
    );
    return this;
  }

  // metodo que realiza o relacionamento com a tabela users
  static associate(models) {
    // quando uma tabela tem relacionamento com mais de uma tabela sou obrigado a dar um apelido
    // caso de as: 'user' e as: 'provider'
    this.belongsTo(models.User, { foreignKey: 'user_id', as: 'user' });
    this.belongsTo(models.User, { foreignKey: 'provider_id', as: 'provider' });
  }
}
export default Appointment;
