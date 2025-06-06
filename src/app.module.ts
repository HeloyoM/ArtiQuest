import { Module } from '@nestjs/common'
import { ArtiQuestModule } from './artiQuest/artiQuest.module'
import { AuthModule } from './auth/auth.module'
import { AboutModule } from './about/about.module'
import { CacheModule } from '@nestjs/cache-manager'
import { MailerModule } from '@nestjs-modules/mailer'
import { ConfigModule } from '@nestjs/config'
import { MailModule } from './email/email.module'

@Module({
  imports: [
    ArtiQuestModule,

    ConfigModule.forRoot({ envFilePath: '.env', isGlobal: true }),
    
    AuthModule,

    AboutModule,

    MailModule,
    
    MailerModule.forRoot({
      transport: {
        host: process.env.EMAIL_HOST,
        auth: {
          user: process.env.EMAIL_USERNAME,
          pass: process.env.EMAIL_PASSWORD
        }
      }
    }),

    CacheModule.register({
      isGlobal: true
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule { }
