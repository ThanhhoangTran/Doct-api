import { PaginationResponse } from '@/common/response';
import { User } from '@/db/entities/user.entity';
import { ObjectType } from '@nestjs/graphql';

@ObjectType()
export class UserPaginationResponse extends PaginationResponse<User>(User) {}
