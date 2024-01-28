import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UserSchema } from './schemas/user.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { JwtStrategy } from './jwt.strategy';

@Module({
  imports: [MongooseModule.forFeature([{name:'User',schema:UserSchema}]),

    PassportModule.register({defaultStrategy:'jwt'}),
    JwtModule.registerAsync({
      inject:[ConfigService],
      useFactory:(config:ConfigService)=>{
        return {
          secret:config.get('JWT_SECRET'),
          signOptions:{
            expiresIn:config.get<string | number>('JWT_EXPIRES'),
          },
        };
      },
    }),
    MongooseModule.forFeature([{name:'user',schema:UserSchema}])
  ],
  controllers: [AuthController],
  providers: [AuthService,JwtStrategy],
  exports:[JwtStrategy,PassportModule],
})
export class AuthModule {}
