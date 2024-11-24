import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { AttendeeDto } from '../common/dtos/responses/attendeesResponse.dto';

@Schema({ strict: false })
@ObjectType({ isAbstract: true })
export class Conversation {
  @Field(_type => ID)
  _id: string;

  @Field(_type => String)
  @Prop()
  name: string;

  @Field(_type => [AttendeeDto], { nullable: true })
  @Prop({
    type: [AttendeeDto],
  })
  attendees: AttendeeDto[];

  @Field(_type => ID)
  @Prop()
  createdById: string;
}

export const ConversationSchema = SchemaFactory.createForClass(Conversation);
