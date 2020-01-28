import * as yup from 'yup';
import Appointment from '../models/Appointment';
import User from '../models/User';

class AppointmentController {
  async store(req, res) {
    const schema = yup.object().shape({
      provider_id: yup.number().required(),
      date: yup.date().required(),
    });
    if (!(await schema.isValid(req.body))) {
      return res
        .status(400)
        .json({ error: 'Validation fails AppointmentController' });
    }
    const { provider_id, date } = req.body;

    /**
     * Verificar se e um provedor de serviço
     */
    const isProvider = await User.findOne({
      where: { id: provider_id, provider: true },
    });
    // se o provider for false informa que não e possivel realizar agendamento
    if (!isProvider) {
      return res
        .status(401)
        .json({ error: 'You can only create appointments with providers' });
    }
    /**
     * persiste os dados na tabela appointment
     */
    const appointment = await Appointment.create({
      user_id: req.userId,
      provider_id,
      date,
    });
    return res.json(appointment);
  }
}
export default new AppointmentController();
/**
 *
 *
 *
 */
