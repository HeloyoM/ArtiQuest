import { Injectable } from "@nestjs/common"
import { MailerService } from '@nestjs-modules/mailer'

@Injectable()
export class MailSerivce {
    constructor(private readonly mailService: MailerService) { }

    sendMail() {
        const message = `Forgot your password? If you didn't forget your password, please ignore this email!`;

        try {
            this.mailService.sendMail({
                from: 'ArtiQuest system <system@arti-quest.com>',
                to: 'mybs2323@gmail.com',
                subject: `How to Send Emails with Nodemailer`,
                html: `<h1>Hello world</h1>`
            })
        } catch (error) {
        }
    }

}