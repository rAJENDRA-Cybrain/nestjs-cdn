/* eslint-disable prettier/prettier */
/* eslint-disable no-var */
export var mailer = {

    english: (content: any) => {

        const Html =
            `<!doctype html>` +
            `<html xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml"` +
            `    xmlns:o="urn:schemas-microsoft-com:office:office">` +
            `<head>` +
            `    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">` +
            `</head>` +
            `<body>` +
            `    <div style="max-width: 1000px;margin: 0 auto; padding: 20px;">` +
            `        <div class="" style="display: inline-block;width: 100%;border-bottom: 2px solid #0094df;padding-bottom: 20px;">` +
            `            <div style="float: left;width: 270px;">` +
            `                <img src="https://childcarecrm.cyberschoolmanager.com/assets/images/logo_family.png">` +
            `            </div>` +
            `            <div style="float: right; width: 68%;text-align: right;margin-top: 25px;">` +
            `                <h3 style="color: #0094df;font-size: 28px;margin: 0;">Exceptional Family Resource Center</h3>` +
            `                <p style="color: #0094df;line-height: 29px;font-size: 18px;margin-top: 0;">` +
            `                    <i>A Center for Families of Children with Developmental Disabilities<br>` +
            `                        A 501 © 3 Not-for-Profit Public Charitable Organization</i>` +
            `                </p>` +
            `            </div>` +
            `        </div>` +
            `        <div>` +
            `            <h5 style="text-align: center;font-size: 24px;margin: 20px 0;">` +
            `                Welcome to EFC Early Start Family Resource Center<br>Exceptional Family Center</h5>` +
            `             ${content} ` +
            `            <p>Warm Regards,</p>` +
            `            <p><img src="http://testwebsites.cybraintech.com/Childcare-CRM/assets/images/v-sign.jpg"></p>` +
            `            <p>Executive Director<br>Exceptional Family Center/Early Start Family Resource Center</p>` +
            `            <p style="color: #0094df;">` +
            `                Kindness is the language where the deaf can hear and the blind can see...<strong> Mark Twain</strong>` +
            `            </p>` +
            `        </div>` +
            `        <div>` +
            `            <ul class="end-sat"` +
            `                style="margin: 0;background: #0094df; padding: 20px;display: inline-block;width: 100%;font-size: 16px;">` +
            `                <li style="color: #fff;list-style: square;float: left;margin-left: 20px;">` +
            `                    3121 N. Sillect Avenue, Suite 303</li>` +
            `                <li style="color: #fff;float: left;margin-left: 35px;list-style: square;">` +
            `                    Bakersfield, CA, 93308` +
            `                </li>` +
            `                <li style="color: #fff;float: left;margin-left: 35px;list-style: square;">` +
            `                    Office: 661-873-4973` +
            `                </li>` +
            `                <li style="color: #fff;float: left;margin-left: 35px;list-style: square;">www.kernefc.org</li>` +
            `            </ul>` +
            `        </div>` +
            `    </div>` +
            `</body>` +
            `</html>`;

        return Html;
    },
    spanish: (content) => {

        const Html =
            `<!doctype html>` +
            `<html xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml"` +
            `    xmlns:o="urn:schemas-microsoft-com:office:office">` +
            `<head>` +
            `    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">` +
            `</head>` +
            `<body>` +
            `    <div style="max-width: 1000px;margin: 0 auto; padding: 20px;">` +
            `        <div class="" style="display: inline-block;width: 100%;border-bottom: 2px solid #0094df;padding-bottom: 20px;">` +
            `            <div style="float: left;width: 270px;">` +
            `                <img src="https://childcarecrm.cyberschoolmanager.com/assets/images/logo_family.png">` +
            `            </div>` +
            `            <div style="float: right;width: 68%;text-align: right;margin-top: 25px;">` +
            `                <h3 style="color: #0094df;font-size: 28px;margin: 0;">Exceptional Family Resource Center</h3>` +
            `                <p style=" color: #0094df;line-height: 29px;font-size: 18px;margin-top: 0;"><i>A Center for Families of` +
            `                        Children with Developmental Disabilities<br>` +
            `                        A 501 © 3 Not-for-Profit Public Charitable Organization</i></p>` +
            `            </div>` +
            `        </div>` +
            `        <div>` +
            `            <h5 style="text-align: center;font-size: 24px;margin: 20px 0;">` +
            `                Bienvenido al Centro de Recursos Familiares Early Start` +
            `                <br>ExceptionalFamily Center` +
            `            </h5>` +
            `             ${content} ` +
            `            <p>Saludos Cordiales</p>` +
            `            <p><img src="http://testwebsites.cybraintech.com/Childcare-CRM/assets/images/v-sign.jpg"></p>` +
            `            <p>Executive Director<br>Exceptional Family Center/Early Start Family Resource Center</p>` +
            `            <p style="color: #0094df;">Kindness is the language where the deaf can hear and the blind can see...<strong>` +
            `                    Mark Twain</strong>` +
            `            </p>` +
            `        </div>` +
            `        <div>` +
            `            <ul class="end-sat"` +
            `                style="margin: 0;background: #0094df;padding: 20px;display: inline-block;width: 100%;font-size: 16px;">` +
            `                <li style="color: #fff;list-style: square;float: left;margin-left: 20px;">3121 N. Sillect Avenue, Suite` +
            `                    303</li>` +
            `                <li style="color: #fff;float: left;margin-left: 35px;list-style: square;">Bakersfield, CA, 93308 </li>` +
            `                <li style="color: #fff;float: left;margin-left: 35px;list-style: square;">Office: 661-873-4973</li>` +
            `                <li style="color: #fff;float: left;margin-left: 35px;list-style: square;">www.kernefc.org</li>` +
            `            </ul>` +
            `        </div>` +
            `    </div>` +
            `</body>` +
            `</html>`;

        return Html;
    },
    serviceCoRef: (content) => {

        const Html =
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
        `				  <b>Greetings from ${content.smtpDisplayName},</b><br />` +
        `                  <br />` +
        `				   A new referral is now assigned with you. To complete the early start process, Please click on the below link. <br/>` +
        `                  ${content.redirect}`+
        `				  <br />` +
        `				  <br />` +
        `				  Children Details:<br />` +
        `				  =================================<br />` +
        `				  Name :  ${content.childName}  ${content.childMiddleName}  ${content.childLastName}   <br />` +
        `				  Parent :  ${content.parentName}  ${content.parentLastName}  <br />` +
        `				  Relationship :  ${content.relationshipToChild} <br />` +
        `				  =================================<br />` +
        `                 <br />` +
        `				  <br />` +
        `                  Warm Regards,</p>` +
        `                  <p>${content.smtpDisplayName} Team<br />` +
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
};




// <p style="font-size: 16px;line-height: 30px;margin: 0;"><strong>Dear Parent</strong></p>`+
//         `            <p style="line-height: 24px;">`+
//         `                Welcome to EFC’s Early Start Resource Center, Kern Regional Center or another community agency has referred your child.`+
//         `            </p>`+
//         `            <p style="line-height: 24px;">`+
//         `                When a family has a typical child, we have a natural support system, we have family and friends that`+
//         `                have the`+
//         `                experience of raising a child, and when something comes up you have somebody to call. When a family has`+
//         `                a child with disability or special needs those supports aren’t always adequate and so we became a little`+
//         `                more isolated and we need somebody who understands, somebody that has been there. Our goal is to give`+
//         `                you the support and understanding you need. Our team, Grace, Maria, Albeza and I are parents or`+
//         `                grandparents of a child who has been in Early Start /has a Developmental Disability. We also have the`+
//         `                experience and knowledge of navigating Kern Regional Center’s System.</p>`+
//         `            <p style="line-height: 24px;">`+
//         `                We believe that family is the single most important influence on the growth and development of a young`+
//         `                child. Early`+
//         `                childhood intervention and family supports systems help in the building resilience in the family.</p>`+
//         `            <p style="line-height: 24px;">`+
//         `                Our Early Start Family Resource Center provides a variety of family support services.</p>`+
//         `            <ul style="line-height: 24px;">`+
//         `                <li>Parent to parent support services </li>`+
//         `                <li>Training and conferences</li>`+
//         `                <li>Resources and information</li>`+
//         `                <li>Referral services</li>`+
//         `                <li>Assistance at transition at age three</li>`+
//         `            </ul>`+
//         `            <p style="line-height: 24px;">One of our Early Start team members will be calling you to discuss in further`+
//         `                our services. If you would like to meet`+
//         `                with us immediately or have any questions, please don’t hesitate to give me`+
//         `                a call at <a href="tel:(661) 873-4973">(661) 873-4973.</a>`+
//         `            </p>`+





// `            <p style="font-size: 16px;line-height: 30px; margin: 0;"><strong>Queridos</strong></p>`+
// `            <p style="line-height: 24px;">El Centro Regional de Kern ha referido a su hijo a nuestro Centro de`+
// `                Recursos.En este tiempo de crisis de salud pública sin precedentes, esperamos que usted y su familia`+
// `                estén bien. El Centro de Recursos Familiares de Early Start / Exceptional Family Center (EFC) continúa`+
// `                abierto de lunes a viernes de 9 am a 5 pm durante el brote de virus COVID-19. Sin embargo, la oficina de`+
// `                EFC permanecerá cerrada al público hasta nuevo aviso.</p>`+
// `            <p style="line-height: 24px;">Cuando una familia tiene un hijo típico, tenemos un sistema de apoyo natural,`+
// `                tenemos familiares y amigos que tienen la experiencia de criar a un niño, y cuando surge algo tienes a`+
// `                alguien a quien llamar. Cuando una familia tiene un hijo con discapacidad o necesidades especiales esos`+
// `                apoyos no siempre son adecuados y por eso nos quedamos un poco más aislados y necesitamos a alguien que`+
// `                entienda, alguien que este allí. Nuestro objetivo es brindarle el apoyo y la comprensión que Usted`+
// `                necesita. Nuestro equipo, Grace, María, Alicia, Vicky, Marcella y yo somos padres o abuelos de un niño`+
// `                que ha estado en Early Start / tiene una discapacidad del desarrollo. También tenemos la experiencia y`+
// `                el conocimiento de navegar por el Sistema del Centro Regional de Kern. </p>`+
// `            <p style="line-height: 24px;">Creemos que la familia es la influencia más importante en el crecimiento y`+
// `                desarrollo de un niño pequeño. La intervención en la primera infancia y los sistemas de apoyo familiar`+
// `                ayudan a desarrollar la resiliencia en la familia.</p>`+
// `            <p style="line-height: 24px;">Nuestro Centro de Recursos de EarlyStart o Comienzo Temprano provee una`+
// `                variedad de servicios de apoyo familiar:</p>`+
// `            <ul style="line-height: 24px;">`+
// `                <li>Apoyo de Padre a Padre</li>`+
// `                <li>Entrenamientos y Conferencias</li>`+
// `                <li>Recursos e Información</li>`+
// `                <li>Referencias</li>`+
// `                <li>Asistencia en la Transición a los 3 años</li>`+
// `            </ul>`+
// `            <p style="line-height: 24px;">Uno de los miembros de nuestro equipo de Early Start se pondrá en contacto con`+
// `                usted vía telefónica para hablar sobre nuestros servicios.</p>`+
// `            <p> Si tiene alguna pregunta, no dude en comunicarse conmigo al<a href="tel:(661) 873-4973">(661)`+
// `                    873-4973.</a></p>`+