export async function verifyProof(proof: string) {
  "use server"
  // TODO: actually verify the proof
  await new Promise(resolve => setTimeout(resolve, 1000))
  return true
}
