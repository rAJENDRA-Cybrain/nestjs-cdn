/* eslint-disable prettier/prettier */
/* eslint-disable no-var */
export var fp_mailer = {

    "mailerhtml": (responseForEmail) => {

        var Html =

            `<!doctype html>` +
            `<html xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml"` +
            `	xmlns:o="urn:schemas-microsoft-com:office:office">` +
            `<body>Greetings from ${responseForEmail.smtpDisplayName},` +
            `<br>` +
            `<br>` +
            `We received a request to reset the password for the ${responseForEmail.smtpDisplayName} account ` +
            `associated with this e-mail address. Click the link below to reset your password.` +
            `<br>` +
            `<br>` +
            `${responseForEmail.request_link}` +
            `<br>` +
            `<br>` +
            `If clicking the link doesn't work, you can copy and paste the link into your web ` +
            `browser's address bar. You will be able to create a new password for your ${responseForEmail.smtpDisplayName}` +
            `account after clicking the link above.` +
            `<br><br>` +
            `If you did not request to have your password reset, you can safely ignore this email. Rest assured your ${responseForEmail.smtpDisplayName} account is safe.` +
            `<br><br>Thank you for using ${responseForEmail.smtpDisplayName}.<br><br>Sincerely,<br>${responseForEmail.smtpDisplayName} Team` +
            `</body>` +
            `</html>`;
        return Html;
    },
    "resetPasswordThankYouHtml": (responseForEmail) => {
        var Html =

            `<!doctype html>` +
            `<html xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml"` +
            `	xmlns:o="urn:schemas-microsoft-com:office:office">` +
            `<body>` +
            `Greetings from ${responseForEmail.smtpDisplayName},` +
            `<br><br>As you requested, your ${responseForEmail.smtpDisplayName} account password has been updated.` +
            `<br><br>To view or edit your account settings, please visit` +
            `<br><br>https://childcarecrm.cyberschoolmanager.com/auth/signin.` +
            `<br><br>` +
            `Thank you for using ${responseForEmail.smtpDisplayName}.<br><br>Sincerely,<br>` +
            `${responseForEmail.smtpDisplayName} Team` +
            `</body>` +
            `</html>`;
        return Html;
    }
}