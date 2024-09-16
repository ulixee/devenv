export default function serdeJson(toSerialize: any): string {
  return JSON.stringify(toSerialize, (_name: string, value: unknown) => {
    if (value instanceof Uint8Array) {
      return `0x${Buffer.from(value).toString('hex')}`;
    }
    if (Buffer.isBuffer(value)) {
      return `0x${value.toString('hex')}`;
    }
    // translate the pre-parsed Buffer to a hex string
    if (value && typeof value === 'object' && 'type' in value && 'data' in value) {
      const bufferLike = value as { type: string; data: unknown };
      if (bufferLike.type === 'Buffer') {
        return `0x${Buffer.from(bufferLike.data as any).toString('hex')}`;
      }
    }
    if (typeof value === 'bigint') {
      if (value > Number.MAX_SAFE_INTEGER) {
        return value.toString();
      }
      return Number(value);
    }
    return value;
  });
}
