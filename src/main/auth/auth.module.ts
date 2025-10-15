import { Module } from '@nestjs/common';
import { AuthResolver } from './auth.resolver';
import { TestQueuePublisher } from '../sqsWorkers/processors/testProcessor/publisher';
import { SignInUseCase } from '../../useCases/auth/signIn/usecase';
import { SignUpUseCase } from '../../useCases/auth/signUp/usecase';
import { GetMeUseCase } from '../../useCases/auth/getMe/usecase';
import { SignInInputValidator } from '../../useCases/auth/signIn/validators/inputValidator';

@Module({
  providers: [AuthResolver, TestQueuePublisher, SignInUseCase, SignUpUseCase, GetMeUseCase, SignInInputValidator],
})
export class AuthModule {}
