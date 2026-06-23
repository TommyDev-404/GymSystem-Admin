import nodemailer from "nodemailer";

export const transporter = nodemailer.createTransport({
	host: "smtp.gmail.com",      // your SMTP server
	port: 587,                     // port
	secure: false,                 // true for 465, false for other ports
	auth: {
			user: process.env.SMTP_USER,
			pass: process.env.SMTP_PASS,
	},
});

type SendActivationEmailParams = {
	to: string;
	name: string;
	code: string;
};

export const sendActivationEmail = async ({
	to,
	name,
	code,
}: SendActivationEmailParams) => {
	try {
	

	return true;
} catch (error) {
	console.error("Email sending failed:", error);
	return false;
}
};

