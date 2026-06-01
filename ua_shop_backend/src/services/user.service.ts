import { Prisma } from "@prisma/client";

export interface CreateUserPayload {
  usernameUnicode: string;
  emailUnicode:    string;
  canonicalEmail:  string;
  aceDomain:       string;
}

export async function createUserInTransaction(
  payload: CreateUserPayload,
  tx: Prisma.TransactionClient
) {
  return tx.user.create({
    data: {
      usernameUnicode: payload.usernameUnicode,
      emailUnicode:    payload.emailUnicode,
      canonicalEmail:  payload.canonicalEmail,
      aceDomain:       payload.aceDomain
    }
  });
}
