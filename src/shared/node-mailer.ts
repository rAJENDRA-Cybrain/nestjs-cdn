/* eslint-disable prettier/prettier */
import * as nodemailer from 'nodemailer';

// create reusable transporter object using the default SMTP transport
export const sendEmail = async (transOpts: any, mailOptions: any) => {

    const connection_gmail = {
        host: transOpts.smtpHost,
        port: transOpts.smtpPort,
        auth: {
            user: transOpts.smtpUserName,
            pass: transOpts.smtpPassword
        }
    };

    const connection_office_365 = {
        host: transOpts.smtpHost,
        secure: false,
        port: transOpts.smtpPort,
        tls:{
            ciphers: "SSLv3"
         },
        auth: { user: transOpts.smtpUserName, pass: transOpts.smtpPassword },
        debug: true,
        logger: true, 
    };

    const connection = transOpts.smtpHost.includes('smtp.office365.com') ? connection_office_365 : connection_gmail;

    const transporter = nodemailer.createTransport(connection);

    const emailConfiguration = {
        from:`"${transOpts.smtpDisplayName}" <${transOpts.smtpUserName}>`,
        bcc:'rajendra@cybrain.co.in',
        subject: mailOptions.subject,
        html: mailOptions.body,
        attachments:mailOptions.attachments,
    };
    if (mailOptions.replyTo) {
        emailConfiguration['replyTo'] = mailOptions.replyTo;
    }

    const info = await transporter.sendMail(emailConfiguration);

    console.log('Message sent: %s', info.messageId);
};