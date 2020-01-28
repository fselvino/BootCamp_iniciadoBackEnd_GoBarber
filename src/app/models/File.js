import Sequelize, { Model } from 'sequelize';

class File extends Model {
  static init(sequelize) {
    super.init(
      {
        name: Sequelize.STRING,
        path: Sequelize.STRING,
        // campo virtual para possibilitar o acesso a imagem no servidor
        url: {
          type: Sequelize.VIRTUAL,
          // meto get retorno o caminho da imagem no servidor
          get() {
            return `http://localhost:3333/files/${this.path}`;
          },
        },
      },
      { sequelize }
    );
    return this;
  }
}
export default File;
