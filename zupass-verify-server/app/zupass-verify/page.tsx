import { redirect } from "next/navigation"

export default async function Page({ searchParams: { final_redirect_uri, proof, finished } }) {
  // TODO: verify proof, then redirect to final_redirect_uri

  const isVerified = finished === "true" && proof && (await verifyProof(proof))

  if (isVerified && final_redirect_uri) {
    // redirect immediately
    redirect(final_redirect_uri)
  }

  return <div>ERROR</div>
}

async function verifyProof(proof: string) {
  "use server"
  // TODO: actually verify the proof
  await new Promise(resolve => setTimeout(resolve, 1000))
  return true
}
