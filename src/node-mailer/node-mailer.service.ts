import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';

@Injectable()
export class NodeMailerService {
  constructor(private readonly mailService: MailerService) {}

  sendForgotPasswordOtp(email, otp) {
    try {
      return this.mailService.sendMail({
        to: email,
        subject: 'reset pasword',
        html: `<!DOCTYPE html>
                <html lang="en">
                <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Reset password otp</title>
  
</head>
<body>
    <h1>${otp}</h1>
</body>
</html>`,
      });
    } catch (error) {
      console.log(error);
    }
  }
}
