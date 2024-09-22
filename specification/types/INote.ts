import { z } from 'zod';
import { addressValidation, hashValidation, milligonsValidation } from './index';

export const SendNote = z.object({
  action: z.literal('send'),
  to: z.array(addressValidation).max(10).optional().nullish(),
});

export const ClaimFromMainchainNote = z.object({
  action: z.literal('claimFromMainchain'),
  transferId: z
    .number()
    .int()
    .nonnegative()
    .describe('The id of this transfer to localchain'),
});
export const ChannelHoldNote = z.object({
  action: z.literal('channelHold'),
  recipient: addressValidation,
  domainHash: hashValidation.optional().nullish(),
  delegatedSigner: addressValidation.optional().nullish(),
});

function createActionLiteral<T extends string>(
  action: T,
): z.ZodObject<{ action: z.ZodLiteral<T> }> {
  return z.object({
    action: z.literal(action),
  });
}

export const LeaseDomain = createActionLiteral('LeaseDomain');

export const NoteSchema = z.object({
  milligons: milligonsValidation,
  noteType: z.discriminatedUnion('action', [
    createActionLiteral('sendToMainchain'),
    ClaimFromMainchainNote,
    createActionLiteral('claim'),
    SendNote,
    createActionLiteral('leaseDomain'),
    createActionLiteral('fee'),
    createActionLiteral('tax'),
    createActionLiteral('sendToVote'),
    ChannelHoldNote,
    createActionLiteral('channelHoldSettle'),
    createActionLiteral('channelHoldClaim'),
  ]),
});

type INote = z.infer<typeof NoteSchema>;
export default INote;
