import { Inject, Injectable, forwardRef } from "@nestjs/common"
import { MailerService } from '@nestjs-modules/mailer'
import { ContactMsgDto } from "src/auth/dto/contectMsg.dto";
import { ArtiQuestService } from "src/artiQuest/artiQuest.service";
import { EmailMsg } from "./enum/EmailMsg.enum"

@Injectable()
export class MailService {
    constructor(
        @Inject(forwardRef(() => ArtiQuestService))
        private artiQuestSerivce: ArtiQuestService,
        private readonly mailService: MailerService
    ) { }

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

    async updateAuthorAboutArticle(id: string, msg: EmailMsg) {
        const art = await this.artiQuestSerivce.getArticleById(id)

        if (!art)
            throw Error('unable to find article')

        const praperMessage = this.praperFinalMessage(msg)
    }

    praperFinalMessage(msg: EmailMsg) {
        
    }
}