// all this code runs on the server, we never distribute any of code to the client
// https://nextjs.org/docs/app/building-your-application/rendering/composition-patterns#keeping-server-only-code-out-of-the-client-environment
import "server-only"

export type SerializedPCD = { type: string; pcd: string }

import { verifyGroupSignal, verifyGroupSignalType } from "./verifyGroupSignal"

export async function verifyProof(proof: string) {
  console.debug("verifyProof", proof)
  const pcd = JSON.parse(proof) as SerializedPCD
  if (!isSupportedProofType(pcd.type)) throw new Error(`Unsupported proof type: ${pcd.type}`)
  const verifier = pcdTypes[pcd.type]
  return await verifier(pcd)

  // TODO: add an external nullifier verification (similar to nonce) to prevent against replay attacks
}

function isSupportedProofType(type: string): type is keyof typeof pcdTypes {
  return type in pcdTypes
}

const pcdTypes = {
  [verifyGroupSignalType]: verifyGroupSignal,
  // TODO: add more proof types and verifiers
} as const
