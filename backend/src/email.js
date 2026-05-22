const { Resend } = require('resend')

const resend = new Resend(process.env.RESEND_API_KEY)

const sendVerificationEmail = async (email, name, token) => {
  const verifyUrl = `${process.env.FRONTEND_URL}/verify-email?token=${token}`
  
  await resend.emails.send({
    from: 'Aperio <noreply@aperio.pp.ua>',
    to: email,
    subject: 'Підтвердь свою пошту — Aperio',
    html: `
      <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto; padding: 32px;">
        <img src="https://aperio.pp.ua/Aperio.png" width="48" style="border-radius: 12px; margin-bottom: 24px;" />
        <h1 style="font-size: 22px; color: #1a1a2e; margin-bottom: 8px;">Привіт, ${name}!</h1>
        <p style="color: #555; font-size: 15px; line-height: 1.6; margin-bottom: 24px;">
          Дякуємо за реєстрацію в Aperio. Натисни кнопку нижче щоб підтвердити свою email адресу.
        </p>
        <a href="${verifyUrl}" style="display: inline-block; padding: 14px 28px; background: linear-gradient(135deg, #7F77DD, #534AB7); color: #fff; border-radius: 8px; text-decoration: none; font-size: 15px; font-weight: 500;">
          Підтвердити email
        </a>
        <p style="color: #888; font-size: 13px; margin-top: 24px;">
          Посилання дійсне 24 години. Якщо ти не реєструвався — просто ігноруй цей лист.
        </p>
        <hr style="border: none; border-top: 1px solid #eee; margin: 24px 0;" />
        <p style="color: #aaa; font-size: 12px;">© 2026 Aperio</p>
      </div>
    `
  })
}

module.exports = { sendVerificationEmail }