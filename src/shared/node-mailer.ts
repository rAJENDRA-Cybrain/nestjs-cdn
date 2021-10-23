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