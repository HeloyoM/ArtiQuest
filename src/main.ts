import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)

  const cors = {
    origin: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  }

  app.enableCors(cors)
  const PORT = 3001

  app.setGlobalPrefix('api')
  await app.listen(PORT, () => console.log(`app is listening on port: ${PORT}`))
}
bootstrap()
