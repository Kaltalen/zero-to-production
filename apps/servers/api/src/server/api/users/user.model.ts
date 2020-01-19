import mongoose from 'mongoose';
import { defaultSchemaOptions } from '@uqt/api/utils';
import { IUserDocument, IUserModel } from '@uqt/api/core-data';
import { IUser, AuthenticationRoles } from '@uqt/interfaces';

export const userSchema = new mongoose.Schema<IUser>(
  {
    username: {
      type: String,
      required: true,
      text: true,
      unique: true
    },
    givenName: {
      type: String,
      required: true
    },
    surname: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true,
      unique: false // UQT_UPDATE
    },
    dateOfBirth: {
      type: String,
      required: true
    },
    active: {
      type: Boolean,
      required: true,
      default: true
    },
    isVerified: {
      type: Boolean,
      required: true,
      default: false
    },
    role: {
      type: Number,
      required: true,
      default: AuthenticationRoles.User
    },
    hashedPassword: {
      type: String,
      required: true,
      select: false
    }
  },
  {
    ...defaultSchemaOptions
  }
);

/**
 * This function is only used for the auth function and hence, must return the hashed password
 *
 * @param username The username to search by.
 */
userSchema.statics.findByUsername = function(
  username: string
): Promise<IUserDocument | null> {
  return this.findOne({
    username: username
  })
    .select('+hashedPassword')
    .exec();
};

export const User = mongoose.model<IUserDocument, IUserModel>(
  'user',
  userSchema
);
