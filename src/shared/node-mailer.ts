/* eslint-disable prettier/prettier */
import * as nodemailer from 'nodemailer';

// create reusable transporter object using the default SMTP transport
export const sendEmail = async (transOpts: any, mailOptions: any) => {

    const transporter = nodemailer.createTransport({
        host: transOpts.maillHost,
        port: transOpts.mailPortNo,
        //secure: config.mailSecure, // lack of ssl commented this. You can uncomment it.
        auth: {
            user: transOpts.mailFrom,
            pass: transOpts.mailPassword
        }
    });
    const info = await transporter.sendMail({
        from: 'Childcare CRM',
        to: mailOptions.email,
        subject: mailOptions.subject,
        html: mailOptions.body,
    });

    console.log('Message sent: %s', info.messageId);
};