export default {
  host: 'smtp.mailtrap.io',
  port: 2525,
  secure: false,
  auth: {
    user: '6b176c17e77eef',
    pass: 'e43a3d295adbdb',
  },
  default: {
    from: 'Equipe Gobarber <noreply@gobarber.com>',
  },
};

/**
 * Alguns serviços de envio de email
 * Amazon SES
 * Mailgun
 * Sparkpost
 * Mandril (Mailchimp)
 * não usar Gmail
 *
 * iremos usar Mailtrap(DEV) esse só funciona em desenvolvimento
 */
