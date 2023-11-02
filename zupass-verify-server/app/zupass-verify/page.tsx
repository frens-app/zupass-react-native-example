import { redirect } from "next/navigation"
import { verifyProof } from "./verifyProof"

export default async function Page({
  searchParams: { final_redirect_uri, proof },
}: {
  searchParams: Record<string, string>
}) {
  // TODO: more error handling and edge cases

  const verification = proof && (await verifyProof(proof))

  if (verification && final_redirect_uri) {
    const url = new URL(final_redirect_uri)
    url.searchParams.set("verification", JSON.stringify(verification))
    redirect(url.href)
  }

  return <div>ERROR</div>
}
