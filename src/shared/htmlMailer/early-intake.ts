/* eslint-disable prettier/prettier */
/* eslint-disable no-var */
export var mailer = {

    "mailerhtml": (responseForEmail) => {

        var Html_earlyStartIntake =

        `<!doctype html>` +
        `<html xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml"` +
        `	xmlns:o="urn:schemas-microsoft-com:office:office">` +
        `<head>` +
        `	<meta charset="UTF-8">` +
        `	<meta http-equiv="X-UA-Compatible" content="IE=edge">` +
        `	<meta name="viewport" content="width=device-width, initial-scale=1">` +
        `	<title>Early Start Intake</title>` +
        `<style type="text/css">` +
        `.early-start-bhawan {` +
        `  width: 700px;` +
        `}` +
        `.end-sat li {` +
        `  list-style: none;` +
        `  width: 25%;` +
        `  margin-left: 0px!important;` +
        `}` +
        `.end-sat li img {` +
        `  height: 9px;` +
        `  margin-right:10px;` +
        `}` +
        `.end-star-early {` +
        `  width: 100%;` +
        `}` +
        `.end-early {` +
        `  width: 100%;` +
        `}` +
        `ul.end-sat {` +
        `  display: flex;` +
        `  width: 100%;` +
        `  align-items: center;` +
        `  margin-bottom: 0px;` +
        `}` +
        `ul.list-mid-early {` +
        `  margin-bottom: 0px;` +
        `}` +
        `.start-early {` +
        `  border: 1px solid #e2e2e2;` +
        `  padding: 40px;` +
        `  width: 94%;` +
        `  margin: 0 auto;` +
        `}` +
        `.two-pik {` +
        `  text-align: center;` +
        `}` +
        `.two-pik img {` +
        `  height: auto;` +
        `}` +
        `.one-pik img {` +
        `  height: 107px;` +
        `}` +
        `.one-pik {` +
        `  text-align: right;` +
        `}` +
        `.early-log {` +
        `  margin: 0 auto;` +
        `}` +
        `.inner-mid-early {` +
        `  padding: 25px 37px 37px 37px;` +
        `}` +
        `.inner-mid-early p {` +
        `  text-align: justify;` +
        `}` +
        `.early-start-bhawan {` +
        `  border-bottom: 2px solid #6ca9cd;` +
        `}` +
        `.inner-mid-early h5 {` +
        `  text-align: center;` +
        `  font-size: 18px;` +
        `  color: #0094df;` +
        `  margin-bottom: 15px;` +
        `}` +
        `</style>` +
        `</head>` +
        `<body>` +
        `<div class="section-full p-t120  p-b90 site-bg-white about-section-one-wrap">` +
        `                <div class="about-section-one">` +
        `                    <div class="container">` +
        `                        <div class="section-content">` +
        `                            <div class="start-early">` +
        `                                <div calss="col-md-12 col-lg-12">` +
        `                                    <div class="row">` +
        `                                        <div class="early-start-bhawan">` +
        `                                            <div class="col-md-10 col-lg-10 early-log">` +
        `                                                <div class="col-md-12 col-lg-12 two-pik">` +
        `                                                    <img src="http://testwebsites.cybraintech.com/Bhavanchd/Senior/images/logo-earlysat.png" alt="logo-early">` +
        `                                                </div>` +
        `                                            </div>` +
        `                                        </div>` +
        `                                        <div calss="mid-start-bhawan">` +
        `                                            <div class="col-md-12">` +
        `                                                <div class="inner-mid-early">` +
        `                                                    <h5>Welcome to EFC Early Start Family Resource Center<br/>Exceptional Family Center</h5>` +
        `                                                    <p>${responseForEmail.timestamp} <br /><br />` +
        `                                                        Dear ${responseForEmail.parentsName},<br/><br/>` +
        `                                                        Welcome to EFC’s Early Start Resource Center, Kern Regional` +
        `                                                        Center has referred your child ${responseForEmail.childName}.<br /><br />` +
        `                                                        When a family has a typical child, we have a natural support` +
        `                                                        system, we have family and friends that have the experience of` +
        `                                                        raising a child, and when something comes up you have somebody` +
        `                                                        to call. When a family has a child with disability or special` +
        `                                                        needs those supports aren’t always adequate and so we became a` +
        `                                                        little more isolated and we need somebody who understands,` +
        `                                                        somebody that has been there. Our goal is to give you the` +
        `                                                        support and understanding you need. Our team, Grace, Maria,` +
        `                                                        Albeza and I are parents or grandparents of a child who has been` +
        `                                                        in Early Start /has a Developmental Disability. We also have the` +
        `                                                        experience and knowledge of navigating Kern Regional Center’s` +
        `                                                        System. <br /><br />` +
        `                                                        We believe that family is the single most important influence on` +
        `                                                        the growth and development of a young child. Early childhood` +
        `                                                        intervention and family supports systems help in the building` +
        `                                                        resilience in the family. <br /><br />` +
        `                                                        Our Early Start Family Resource Center provides a variety of` +
        `                                                        family support services.` +
        `                                                    <ul class="list-mid-early">` +
        `                                                        <li>Parent to parent support services </li>` +
        `                                                        <li>Training and conferences</li>` +
        `                                                        <li>Resources and information</li>` +
        `                                                        <li>Referral services</li>` +
        `                                                        <li>Assistance at transition at age three</li>` +
        `                                                    </ul><br />` +
        `                                                    One of our Early Start team members will be calling you to discuss` +
        `                                                    in further our services. If you would like to meet with us` +
        `                                                    immediately or have any questions, please don’t hesitate to give me` +
        `                                                    a call at (661) 873-4973.<br /><br />` +
        `                                                    Warm Regards,` +
        `                                                    </p>` +
        `                                                    <h4>Virginia Gantong</h4>` +
        `                                                    <p>Executive Director<br />Exceptional Family Center/Early Start` +
        `                                                        Family Resource Center</p><br />` +
        `                                                    <h6>Kindness is the language where the deaf can hear and the blind` +
        `                                                        can see...<strong> Mark Twain</strong></h6>` +
        `                                                </div>` +
        `                                            </div>` +
        `                                        </div>` +
        `                                        <div class="end-star-early">` +
        `                                            <div class="col-md-12">` +
        `                                                <div class="end-early">` +
        `                                                    <ul class="end-sat">` +
        `                                                        <li><img src="http://testwebsites.cybraintech.com/Bhavanchd/Senior/images/Screenshot_3.png">3121 N. Sillect Avenue,` +
        `                                                            Suite 303</li>` +
        `                                                        <li><img src="http://testwebsites.cybraintech.com/Bhavanchd/Senior/images/Screenshot_3.png">Bakersfield, CA, 93308` +
        `                                                        </li>` +
        `                                                        <li><img src="http://testwebsites.cybraintech.com/Bhavanchd/Senior/images/Screenshot_3.png">Office: 661-873-4973</li>` +
        `                                                        <li><img src="http://testwebsites.cybraintech.com/Bhavanchd/Senior/images/Screenshot_3.png">www.kernefc.org</li>` +
        `                                                    </ul>` +
        `                                                </div>` +
        `                                            </div>` +
        `                                        </div>` +
        `                                    </div>` +
        `                                </div>` +
        `                            </div>` +
        `                        </div>` +
        `                    </div>` +
        `                </div>` +
        `            </div>` +
        `</body>` +
        `</html>`;
        return Html_earlyStartIntake;
    }
}