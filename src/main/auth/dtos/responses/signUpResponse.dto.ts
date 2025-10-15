import { ObjectType } from '@nestjs/graphql';
import { UserResponse } from '../../../../common/dtos/responses/userResponse.dto';

@ObjectType()
export class SignUpResponse extends UserResponse {}
