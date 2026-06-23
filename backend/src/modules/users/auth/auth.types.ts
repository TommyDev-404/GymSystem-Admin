
export type VerifyActivationDTO = {
   activation_code: string;
 };
 
 export type CompleteRegistrationDTO = {
   memberId: number;
   password: string;
 };

 export type LoginDTO = {
   email: string;
   password: string;
 };

 export type ForgotPasswordDTO = {
   email: string;
 };

 export type VerifyOtpDTO = {
   email: string;
   code: string;
 };

 export type ResetPasswordDTO = {
   email: string;
   newPassword: string;
 };