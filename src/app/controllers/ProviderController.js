import User from '../models/User';
import File from '../models/File';

class ProviderController {
  async index(req, res) {
    const providers = await User.findAll({
      // retorna somente os usuarios provider
      where: { provider: false },
      // retorna somente os atributos relacionados
      attributes: ['id', 'name', 'email', 'avatar_id'],
      // inclue atributos do model File referenciando pelo apelido avatar
      // avatar foi registrado no model User no relacionamento com model File
      include: [
        {
          model: File,
          as: 'avatar',
          // retorna somente os atributos listados
          attributes: ['name', 'path', 'url'],
        },
      ],
    });
    return res.json(providers);
  }
}
export default new ProviderController();
