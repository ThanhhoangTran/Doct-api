import { ExecutionContext, createParamDecorator } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';

export const UserContext = createParamDecorator((data: unknown, ctx: ExecutionContext) => GqlExecutionContext.create(ctx).getContext().req.user);
