import { configuration } from '@/config';
import * as bcryptjs from 'bcryptjs';

export class PasswordUtil {
  static async generateHash(password: string): Promise<string> {
    return bcryptjs.hash(password, Number(configuration.bcrypt.salt));
  }

  static async validateHashPassword(
    password: string,
    hash: string,
    errorMessageIfNotMatched?: string,
  ): Promise<boolean> {
    const validated = await bcryptjs.compare(password, hash);
    if (!validated && errorMessageIfNotMatched) {
      throw new Error('Password not match');
    }

    return validated;
  }
}
