export default {
  host: process.env.MAIL_HOST,
  port: process.env.MAIL_PORT,
  secure: false,
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
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
