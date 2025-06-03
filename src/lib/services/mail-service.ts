import { Resend, CreateEmailOptions } from 'resend';

export function mailService () {
  return {
    async send (params: CreateEmailOptions) {
      const resend = new Resend(process.env.RESEND_API_KEY);

      const { data, error } = await resend.emails.send(params);

      if (error) {
        throw new Error(`Erro ao enviar email: ${error.message}`);
      }

      return {
        success: true,
        data,
      };
    },
  };
}