/* eslint-disable prettier/prettier */
/* eslint-disable no-var */
export var mailer = {

    "mailerhtml": (responseForEmail) => {

        var Html =

            `<!doctype html>` +
            `<html xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml"` +
            `	xmlns:o="urn:schemas-microsoft-com:office:office">` +
            `<head>` +
            `<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">` +
            `</head>` +
            `<body>` +
            `<table style="background-color: #f3f4f4;" cellspacing="0" cellpadding="0" width="100%"` +
            `  align="center" bgcolor="#F3F4F4">` +
            `  <tbody>` +
            `    <tr>` +
            `      <td><br />` +
            `      <table style="background-color: #d9dadb;" cellspacing="0" cellpadding="1" align="center"` +
            `        bgcolor="#D9DADB">` +
            `        <tbody>` +
            `          <tr>` +
            `            <td>` +
            `            <table` +
            `              style="font-family: arial, helvetica, sans-serif; font-size: 14px; line-height: 20px; background-color: #ffffff; font-color: black;"` +
            `              cellspacing="0" cellpadding="0" width="600" align="center" bgcolor="#ffffff">` +
            `              <tbody>` +
            `                <tr>` +
            `                  <td width="30"><img style="display: block;"` +
            `                    src="http://d36cz9buwru1tt.cloudfront.net/blank.gif" border="0" alt="" width="1"` +
            `                    height="1" /></td>` +
            `                  <td` +
            `                    style="font-family: arial, helvetica, sans-serif; font-size: 14px; line-height: 20px;">` +
            `                  <p>` +
            `                  <br /> <br />` +
            `				  <b>Welcome to Childcare CRM,</b><br />` +
            `                  <br />` +
            `				  Your account has been created successfully. To visit Childcare CRM, please find the new login credentials.` +
            `				  <br />` +
            `				  <br />` +
            `				  <br />` +
            `				  Admin Panel Login Details:<br />` +
            `				  =================================<br />` +
            `				  Email :  ${responseForEmail.emailId} <br />` +
            `				  Password :  ${responseForEmail.password} <br />` +
            `				  =================================<br />` +
            `                  <br />` +
            `                  Please do not disclose your username and password to anyone for security reasons.` +
            `				  ` +
            `				  <br />` +
            `                  <br />` +
            `				  ` +
            `				  ` +
            `                  Thank you for joining Childcare CRM.<br />` +
            `                  <br />` +
            `				  <br />` +
            `				  <br />` +
            `                  Warm Regards,</p>` +
            `                  <p>Childcare CRM Team<br />` +
            `` +
            `                  <br />` +
            `                  </p>` +
            `                  </td>` +
            `                  <td width="30"><img style="display: block;"` +
            `                    src="http://d36cz9buwru1tt.cloudfront.net/blank.gif" border="0" alt="" width="1"` +
            `                    height="1" /></td>` +
            `                </tr>` +
            `              </tbody>` +
            `            </table>` +
            `            </td>` +
            `          </tr>` +
            `        </tbody>` +
            `      </table>` +
            `      <br />` +
            `      </td>` +
            `    </tr>` +
            `  </tbody>` +
            `</table>` +
            `</body>` +
            `</html>`;
        return Html;
    }
}