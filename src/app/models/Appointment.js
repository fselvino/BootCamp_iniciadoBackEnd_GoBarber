import Sequelize, { Model } from 'sequelize';
import { isBefore, subHours } from 'date-fns';

class Appointment extends Model {
  static init(sequelize) {
    super.init(
      {
        date: Sequelize.DATE,
        canceled_at: Sequelize.DATE,
        past: {
          type: Sequelize.VIRTUAL,
          // retorna se a data e pois de agora(data atual)
          get() {
            return isBefore(this.date, new Date());
          },
        },

        cancelable: {
          type: Sequelize.VIRTUAL,
          // retorna se o agendamento e cancelavel
          get() {
            return isBefore(new Date(), subHours(this.date, 2));
          },
        },
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
