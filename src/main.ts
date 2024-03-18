import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { json } from 'body-parser'
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger'

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { bodyParser: false })

  const config = new DocumentBuilder()
    .setTitle('ArtiQuest service')
    .setDescription('ArtiQuest service API')
    .setVersion('1.0')
    //.addTag('')
    .build()

  const document = SwaggerModule.createDocument(app, config)
  SwaggerModule.setup('api', app, document)

  const cors = {
    origin: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  }
  app.use(json({ limit: '5mb' }))

  app.enableCors(cors)
  const PORT = 3001

  app.setGlobalPrefix('api')
  await app.listen(PORT, () => console.log(`app is listening on port: ${PORT}`))
}
bootstrap()
