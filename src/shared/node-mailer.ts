/* eslint-disable prettier/prettier */
import * as nodemailer from 'nodemailer';

// create reusable transporter object using the default SMTP transport
export const sendEmail = async (transOpts: any, mailOptions: any) => {

    const transporter = nodemailer.createTransport({
        host: 'smtp.zoho.in',//transOpts.smtpHost,
        port: 587,//transOpts.smtpPort,
        //secure: true,//config.mailSecure, // lack of ssl commented this. You can uncomment it.
        auth: {
            user: 'info@ulyanaeducation.com',
            pass: 'ir9N1mMPx5bY'//transOpts.smtpPassword
        }
    });
    const info = await transporter.sendMail({
        from:'"Childcare CRM" <info@ulyanaeducation.com>',
        to: mailOptions.email,
        subject: mailOptions.subject,
        html: mailOptions.body,
        attachments:mailOptions.attachments,
    });

    console.log('Message sent: %s', info.messageId);
};