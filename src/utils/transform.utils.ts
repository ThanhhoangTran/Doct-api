import { v4 as generateV4 } from 'uuid';

export const transformBinaryData = (strategyType: 'uuid' | 'timestamp', generated = false) => {
  switch (strategyType) {
    case 'uuid':
      return {
        to: (value: string) => {
          if (generated) {
            return Buffer.from(generateV4().replace(/-/gi, ''), 'hex');
          }
          return value ? Buffer.from(value.replace(/-/gi, ''), 'hex') : null;
        },
        from: (bin: Buffer) =>
          bin ? `${bin.toString('hex', 0, 4)}-${bin.toString('hex', 4, 6)}-${bin.toString('hex', 6, 8)}-${bin.toString('hex', 8, 10)}-${bin.toString('hex', 10, 16)}` : null,
      };
    case 'timestamp':
      return {
        to: (value: string) => {
          const currentTimestamp = generated ? Math.floor(Date.now() / 1000) : value;
          const hexValue = currentTimestamp.toString(16); //convert unix timestamp to hexadecimal
          return Buffer.from(hexValue, 'hex');
        },
        from: (bin: Buffer) => parseInt(bin.toString('hex'), 16),
      };
  }
};
