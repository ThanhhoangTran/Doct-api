import { Injectable } from '@nestjs/common';
import { UseCaseAbstraction } from '../../../common/abstractions/usecase.abstraction';
import { GetMeOutput } from './types/output';
import { GetMeInput } from './types/input';
import { UserRepository } from '../../../repositories/user.repository';

@Injectable()
export class GetMeUseCase extends UseCaseAbstraction<GetMeInput, GetMeOutput> {
  constructor(private readonly userRepository: UserRepository) {
    super();
  }

  protected executeLogic(input: GetMeInput): Promise<GetMeOutput> {
    return this.userRepository.getOneByCondition({
      throwErrorIfNotExisted: true,
      relations: ['role'],
      condition: { id: input.userId },
    });
  }
}
