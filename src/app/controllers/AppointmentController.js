import * as yup from 'yup';
import { startOfHour, parseISO, isBefore } from 'date-fns';
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
     * parseISO transforma a string date em um objeto javascript e
     * esse objeto sera utilizado dentro de strartOfHour
     * startOfHour vai pegar somento a parte da hora despresando o restante
     * minutos e segundos
     */
    const hourStart = startOfHour(parseISO(date));

    /**
     * verificar se hourStarte esta antes da hora atual
     * se retornar verdadeiro quer dizer que a data em que o usuario quer
     * cadastrar ja passou, dai retornamos erro
     */
    if (isBefore(hourStart, new Date())) {
      return res.status(400).json({ error: 'Past dates are not permitted' });
    }

    /**
     * Verificar se o provider tem seu horario disponivel ou se ja esta agendado
     * se a consulta retornar valor entra no if e retorna o erro
     */
    const checkAvailability = await Appointment.findOne({
      where: {
        provider_id,
        canceled_at: null,
        date: hourStart,
      },
    });
    if (checkAvailability) {
      return res
        .status(400)
        .json({ error: 'Appointment date is not available' });
    }
    /**
     * persiste os dados na tabela appointment
     */
    const appointment = await Appointment.create({
      user_id: req.userId,
      provider_id,
      date: hourStart,
    });
    return res.json(appointment);
  }
}
export default new AppointmentController();
