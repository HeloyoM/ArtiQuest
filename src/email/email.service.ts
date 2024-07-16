import { Injectable } from "@nestjs/common"
import { MailerService } from '@nestjs-modules/mailer'
import { ContactMsgDto } from "src/auth/dto/contectMsg.dto";

@Injectable()
export class MailSerivce {
    constructor(private readonly mailService: MailerService) { }

    sendMail(payload: ContactMsgDto) {
        try {
            this.mailService.sendMail({
                from: 'ArtiQuest system <system@arti-quest.com>',
                to: 'mybs2323@gmail.com',
                subject: `How to Send Emails with Nodemailer`,
                html: payload.msg
            })
        } catch (error) {
        }
    }

}