const nodemailer = require('nodemailer');
const fs = require('fs');
const path = require('path');

async function main() {
  console.log('Creating Ethereal test account...');
  const testAccount = await nodemailer.createTestAccount();

  const transporter = nodemailer.createTransport({
    host: testAccount.smtp.host,
    port: testAccount.smtp.port,
    secure: testAccount.smtp.secure,
    auth: { user: testAccount.user, pass: testAccount.pass },
  });

  console.log('Sending sample email to verify setup...');
  const info = await transporter.sendMail({
    from: 'no-reply@minha-loja.test',
    to: testAccount.user,
    subject: 'Ethereal test - Minha Loja',
    text: 'Este é um e-mail de teste gerado automaticamente para validar o SMTP de desenvolvimento.',
  });

  const previewUrl = nodemailer.getTestMessageUrl(info);

  const envContent = [];
  envContent.push('DATABASE_URL=file:./dev.db');
  envContent.push('ADMIN_USER=admin');
  envContent.push('ADMIN_PASS=admin');
  envContent.push(`SMTP_HOST=${testAccount.smtp.host}`);
  envContent.push(`SMTP_PORT=${testAccount.smtp.port}`);
  envContent.push(`SMTP_USER=${testAccount.user}`);
  envContent.push(`SMTP_PASS=${testAccount.pass}`);
  envContent.push(`SMTP_SECURE=${testAccount.smtp.secure}`);
  envContent.push('EMAIL_FROM=no-reply@minha-loja.test');

  const outPath = path.resolve(process.cwd(), '.env.local');
  fs.writeFileSync(outPath, envContent.join('\n'));

  console.log('Wrote .env.local with Ethereal SMTP credentials at', outPath);
  console.log('Preview URL for the sent sample email:', previewUrl);
  console.log('You can now run `npm run dev` and test checkout flows using the credentials in .env.local');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
