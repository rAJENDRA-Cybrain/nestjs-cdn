/* eslint-disable prettier/prettier */
import * as nodemailer from 'nodemailer';

// create reusable transporter object using the default SMTP transport
export const sendEmail = async (transOpts: any, mailOptions: any) => {

    const transporter = nodemailer.createTransport({
        host: transOpts.smtpHost,
        port: transOpts.smtpPort,
        //secure: true,//config.mailSecure, // lack of ssl commented this. You can uncomment it.
        auth: {
            user: transOpts.smtpUserName,
            pass: transOpts.smtpPassword
        }
    });
    const info = await transporter.sendMail({
        from:`"${transOpts.smtpDisplayName}" <${transOpts.smtpUserName}>`,
        to: mailOptions.email,
        subject: mailOptions.subject,
        html: mailOptions.body,
        attachments:mailOptions.attachments,
    });

    console.log('Message sent: %s', info.messageId);
};