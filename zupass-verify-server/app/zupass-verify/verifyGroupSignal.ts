// all this code runs on the server, we never distribute any of code to the client
// https://nextjs.org/docs/app/building-your-application/rendering/composition-patterns#keeping-server-only-code-out-of-the-client-environment
import "server-only"

import { SerializedPCD } from "./verifyProof"
import JSONBig from "json-bigint"

/* Type error: Could not find a declaration file for module '@semaphore-protocol/group'. '/Users/tom/Projects/zupass-react-native-example/zupass-verify-server/node_modules/@semaphore-protocol/group/dist/index.mjs' implicitly has an 'any' type.
  There are types at '/Users/tom/Projects/zupass-react-native-example/zupass-verify-server/node_modules/@semaphore-protocol/group/dist/types/index.d.ts', but this result could not be resolved when respecting package.json "exports". The '@semaphore-protocol/group' library may need to update its package.json or typings. */
// @ts-expect-error
import { Group } from "@semaphore-protocol/group"
// See node_modules/@semaphore-protocol/group/src/group.ts

export const verifyGroupSignalType = "semaphore-group-signal"

export async function verifyGroupSignal(rawPCD: SerializedPCD) {
  console.debug("verifyGroupSignal", rawPCD)
  if (rawPCD.type !== verifyGroupSignalType) throw new Error(`Unsupported proof type: ${rawPCD.type}`)
  const pcd = await JSONBig().parse(rawPCD.pcd)

  // verify that the PCD belongs to a known group
  const knownGroup = await fetchSemaphoreGroup(pcd.claim.merkleRoot)
  const knownGroupSemaphore = new Group(1, 16, knownGroup.members)
  const merkleRootMatches = BigInt(pcd.claim.merkleRoot) === BigInt(knownGroupSemaphore.root)
  if (!merkleRootMatches) {
    console.debug({
      pcdMerkleRoot: BigInt(pcd.claim.merkleRoot),
      knownGroupMerkleRoot: BigInt(knownGroupSemaphore.root),
    })
    // throw new Error("Merkle root of this proof does not match Zuzalu's group")
    console.warn("Merkle root of this proof does not match Zuzalu's group")
    return { verified: false, pcd: rawPCD, error: "Merkle root of this proof does not match Zuzalu's group" }
  }
  return { verified: true, pcd: rawPCD }
}

async function fetchSemaphoreGroup(claimMerkleRoot: string) {
  const semaphoreGroupUrl = `https://api.pcd-passport.com/semaphore/historic/1/${encodeURIComponent(claimMerkleRoot)}`
  const res = await fetch(semaphoreGroupUrl)
  if (!res.ok) {
    // TODO: user friendly error messages?
    throw new Error(`Failed to get group at ${semaphoreGroupUrl}: ${res.status}`)
  }
  const raw = await res.text()
  return await JSONBig().parse(raw)
}
