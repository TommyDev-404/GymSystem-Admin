import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
	host: "smtp.gmail.com",      // your SMTP server
	port: 587,                     // port
	secure: false,                 // true for 465, false for other ports
	auth: {
		user: process.env.SMTP_USER,
		pass: process.env.SMTP_PASS,
	},
});

interface SendMailOptions {
	to: string;
	subject: string;
	html: string;
}
 
export const sendMail = async ({
  to,
  subject,
  html,
}: SendMailOptions) => {
  try {
    await transporter.sendMail({
      from: "JFitness Gym",
      to,
      subject,
      html,
    });

  } catch (error) {
    console.error("Email sending failed:", error);
    throw new Error("Failed to send email");
  }
};
