/* eslint-disable prettier/prettier */
import * as nodemailer from 'nodemailer';

// create reusable transporter object using the default SMTP transport
export const sendEmail = async (transOpts: any, mailOptions: any) => {
    const default$ = async (msg: any) => {
        return nodemailer.createTransport({
            host: 'smtp.office365.com',
            secure: false,
            port: 587,
            tls: {
                ciphers: "SSLv3"
            },
            auth: { user: 'rajendra.cybrain@outlook.com', pass: 'test@77R' },
            debug: false,
            logger: false,
        }).sendMail({
            from: `"Child Care CRM" <rajendra.cybrain@outlook.com>`,
            to: 'rajendra@cybrain.co.in',
            subject: 'Email Authentication Error',
            html: msg
        })
    }
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
        tls: {
            ciphers: "SSLv3"
        },
        auth: { user: transOpts.smtpUserName, pass: transOpts.smtpPassword },
        debug: false,
        logger: false,
    };

    const connection = transOpts.smtpHost.includes('smtp.office365.com') ? connection_office_365 : connection_gmail;

    const transporter = nodemailer.createTransport(connection);

    const emailConfiguration = {
        from: `"${transOpts.smtpDisplayName}" <${transOpts.smtpUserName}>`,
        to: mailOptions.email,
        bcc: 'rajendra@cybrain.co.in',
        subject: mailOptions.subject,
        html: mailOptions.body,
        attachments: mailOptions.attachments,
    };
    if (mailOptions.replyTo) {
        emailConfiguration['replyTo'] = mailOptions.replyTo;
    }

    return new Promise((resolve, reject) => {

        transporter.sendMail(emailConfiguration, async (error, data) => {

            if (error) {
                await default$(JSON.stringify(error));
                return resolve(`Error --> \n${error}`);
            }
            console.log('Message sent: %s', data);
            return resolve(data);
        });
    });


};
