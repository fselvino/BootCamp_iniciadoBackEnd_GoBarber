import * as yup from 'yup';
import { startOfHour, parseISO, isBefore, format, subHours } from 'date-fns';
import pt from 'date-fns/locale/pt';
import Appointment from '../models/Appointment';
import Notification from '../schemas/Notification';
import User from '../models/User';
import File from '../models/File';

import CancellationMail from '../jobs/CancellationMail';
import Queue from '../../lib/Queue';

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
     * Realiza teste para verificar se o usuario é provedor
     * se for retorna erro o funcionario nao pode agendar um serviço com ele mesmo
     */
    if (req.userId === provider_id) {
      return res
        .status(401)
        .json({ error: 'supplier cannot schedule service to' });
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
     * persiste os dados na tabela appointment - ou seja cria um agendamento
     */
    const appointment = await Appointment.create({
      user_id: req.userId,
      provider_id,
      date: hourStart,
    });

    /**
     * Notify appointment provider
     * Notifica o prestador de serviço
     */

    // retorna os dados do usuario logado
    const user = await User.findByPk(req.userId);

    // formata o estilo da data que sera pesistida no mongo com locale pt
    const formatteDate = format(hourStart, "dd 'de' MMMM', às' H:mm'h'", {
      locale: pt,
    });

    // cria a notificaçao no banco mongodb
    await Notification.create({
      content: `Novo agendamento de ${user.name} para dia ${formatteDate} `,
      user: provider_id,
    });

    // console.log(hourStart);
    return res.json(appointment);
  }

  async index(req, res) {
    const { page = 1 } = req.query;

    /**
     * realiza um consulta dos agendamentos realizados pelo usuario logado
     * e que os seviços não foram cancelados
     * ordenando por data
     * retornando somento os atributos id e date
     */
    const appointments = await Appointment.findAll({
      where: { user_id: req.userId, canceled_at: null },
      order: ['date'],
      attributes: ['id', 'date'],
      // limite de registros por pagina
      limit: 20,
      // quantos registros serão pulados para compor a proxima pagina
      offset: (page - 1) * 20,

      /**
       * realiza a inclusão do model User apelidado por provider
       * relacionamento com model User
       * retorna os atributos do provider sendo id e name
       */
      include: [
        {
          model: User,
          as: 'provider',
          attributes: ['id', 'name'],
          /**
           * realiza a inclusão do model File apelidado por avatar
           * retorna os atributos do avatar do provider sendo path e url
           * obs o atributo path é obrigatorio para formaçao correta da url
           */
          include: [
            {
              model: File,
              as: 'avatar',
              attributes: ['path', 'url'],
            },
          ],
        },
      ],
    });
    return res.json(appointments);
  }

  async delete(req, res) {
    // busca os dados do agendamento no banco
    const appointment = await Appointment.findByPk(req.params.id, {
      // inclue a tablela user com o relacionamento provider
      // retornando somente o nome e email
      include: [
        {
          model: User,
          as: 'provider',
          attributes: ['name', 'email'],
        },
        { model: User, as: 'user', attributes: ['name'] },
      ],
    });

    /**
     * verifica se o Id do usuario que realizou o agendamento e o mesmo
     * que o Id do usuario logado, caso contrario retorna erro informando
     * que não tem permissa de cancelamento
     */
    if (appointment.user_id !== req.userId) {
      return res.status(401).json({
        error: "You don't have permission to cancel this appointment.",
      });
    }

    if (appointment.canceled_at !== null) {
      return res.status(401).json({
        error: 'The appointment has been canceled',
      });
    }

    // realiza a diminuiçao de duas horas utilizando o metodo subHours
    const dateWithSub = subHours(appointment.date, 2);
    /**
     * Verifica se o agendamento que se quer cancelar esta com antencedencia de duas horas
     */
    if (isBefore(dateWithSub, new Date())) {
      return res.status(401).json({
        error: 'You can only cancel appointments 2 hours in advance.',
      });
    }
    // correndo tudo bem seto canceled_at com a data atual
    appointment.canceled_at = new Date();
    // salva no banco
    await appointment.save();

    await Queue.add(CancellationMail.key, { appointment });

    return res.json(appointment);
  }
}
export default new AppointmentController();
