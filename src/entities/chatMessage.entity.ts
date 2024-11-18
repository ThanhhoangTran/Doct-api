// import { Field, ID, ObjectType } from '@nestjs/graphql';
// import { CustomBaseEntity } from '../common/baseEntity';
// import { Column, Entity, ObjectIdColumn } from 'typeorm';

// @ObjectType()
// @Entity({ name: 'chat_message' })
// export class ChatMessage extends CustomBaseEntity {
//   @Field(_type => ID)
//   @ObjectIdColumn()
//   id: string;

//   @Field(_type => String)
//   @Column('string')
//   message: string;

//   @Field(_type => ID, { nullable: true })
//   @Column('string')
//   conversationId: string;

//   @Field(_type => ID)
//   @Column('string')
//   senderId: string;

//   @Field(_type => ID, { nullable: true })
//   @Column('string')
//   replyMessageId: string;
// }
