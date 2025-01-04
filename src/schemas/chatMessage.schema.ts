import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import _ from 'lodash';

@Schema({ strict: true })
@ObjectType({ isAbstract: true })
export class ChatMessage {
  @Field(_type => ID)
  _id: string;

  @Field(_type => String, { nullable: true })
  @Prop()
  message?: string | null;

  @Field(_type => ID, { nullable: true })
  @Prop()
  conversationId: string;

  @Field(_type => [ID], { nullable: true })
  @Prop()
  visibilityReceiverIds: string[];

  @Field(_type => ID)
  @Prop()
  senderId: string;

  @Field(_type => ID, { nullable: true })
  @Prop()
  replyMessageId?: string | null;
}

export const ChatMessageSchema = SchemaFactory.createForClass(ChatMessage);
