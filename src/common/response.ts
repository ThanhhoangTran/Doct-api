import { Field, Int, ObjectType } from '@nestjs/graphql';

@ObjectType({ isAbstract: true })
export class CustomResponseFields {
  @Field(() => Date)
  createdAt: Date;

  @Field(() => Date)
  updatedAt: Date;
}

@ObjectType({ isAbstract: true })
export class MetaPaginationInterface {
  @Field(_type => Int)
  totalItems: number;

  @Field(_type => Int)
  itemCount: number;

  @Field(_type => Int)
  itemsPerPage: number;

  @Field(_type => Int)
  totalPages: number;

  @Field(_type => Int)
  currentPage: number;
}

export function PaginationResponse<T>(item: any) {
  @ObjectType({ isAbstract: true })
  class PaginationResponse {
    @Field(_type => [item])
    items: T[];

    @Field(_type => MetaPaginationInterface)
    meta: MetaPaginationInterface;
  }
  return PaginationResponse;
}
