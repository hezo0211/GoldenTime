import { MailerModule } from '@nestjs-modules/mailer';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './api/auth/auth.module';
import { AppController } from './app.controller';
import { EjsAdapter } from '@nestjs-modules/mailer/dist/adapters/ejs.adapter';
import { Env } from './shared/enums/Env.enum';
import { ScheduleModule } from '@nestjs/schedule';
import { UserModule } from './api/user/user.module';
import { CategoryModule } from './api/category/category.module';
import { BrandModule } from './api/brand/brand.module';
import { WatchModule } from './api/watch/watch.module';
import { ImportOrderModule } from './api/import-order/importOrder.module';
import { OrderModule } from './api/order/order.module';
import './shared/decorators/virtualColumn/polifill';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

@Module({
  imports: [
    ConfigModule.forRoot(),
    ThrottlerModule.forRoot({
      ttl: 60,
      limit: 10,
    }),
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        return {
          transport: {
            host: 'smtp.gmail.com',
            port: 465,
            secure: true,
            auth: {
              type: 'OAuth2',
              user: configService.get(Env.EMAIL_USER),
              clientId: configService.get(Env.EMAIL_CLIENT_ID),
              clientSecret: configService.get(Env.EMAIL_CLIENT_SECRET),
              refreshToken: configService.get(Env.EMAIL_REFRESH_TOKEN),
            },
          },
          defaults: {
            from: 'ShoesMark <shoesmark@email.com>',
          },
          template: {
            dir: __dirname + '/templates/',
            adapter: new EjsAdapter(),
            options: {
              strict: true,
            },
          },
        };
      },
      inject: [ConfigService],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        return {
          type: 'postgres',
          host: 'localhost',
          username: configService.get(Env.DB_USERNAME),
          password: configService.get(Env.DB_PASSWORD),
          database: 'goldentime',
          synchronize: true,
          autoLoadEntities: true,
        };
      },
      inject: [ConfigService],
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'uploads'),
      serveRoot: '/uploads',
    }),
    ScheduleModule.forRoot(),
    AuthModule,
    UserModule,
    CategoryModule,
    BrandModule,
    WatchModule,
    ImportOrderModule,
    OrderModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
