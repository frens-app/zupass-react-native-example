import { redirect } from "next/navigation"
import { verifyProof } from "./verifyProof"

export default async function Page({ searchParams: { final_redirect_uri, proof, finished } }) {
  // TODO: more error handling and edge cases

  const isVerified = finished === "true" && proof && (await verifyProof(proof))

  if (isVerified && final_redirect_uri) {
    const url = new URL(final_redirect_uri)
    url.searchParams.set("proof", proof)
    redirect(url.href)
  }

  return <div>ERROR</div>
}
