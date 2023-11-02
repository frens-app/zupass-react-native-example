import * as AuthSession from 'expo-auth-session'
import * as WebBrowser from 'expo-web-browser'
import { genZupassUrl } from './genZupassUrl'

// TODO: move this to an environment variable
const VERIFY_SERVICE_URL = `http://localhost:3000/zupass-verify`
const SCHEME = require('../app.json').expo.scheme

/**
 * The URLs of the semaphore groups that we support.
 * One of these will be passed to Zupass.org to determine if the user is a member of that group.
 */
const semaphoreGroupUrls = {
  ZuzaluParticipants: 'https://api.pcd-passport.com/semaphore/1',
  ZuzaluResidents: 'https://api.pcd-passport.com/semaphore/2',
  ZuzaluVisitors: 'https://api.pcd-passport.com/semaphore/3',
  ZuzaluOrganizers: 'https://api.pcd-passport.com/semaphore/4',

  // TODO: add support for Devconnect and other groups
} as const

type KnownGroupName = keyof typeof semaphoreGroupUrls

type SerializedPCD = { type: string; pcd: string }

type DemoServerVerification = {
  verified: boolean
  pcd: SerializedPCD | null
  error?: string
  debug?: any
}

/**
 * URI that the Zupass Auth server will redirect to after the user signs in.
 * This is handled by the Expo AuthSession module.
 * @internal
 */
let redirectUri = null as string | null

/**
 * This function must be called before any other Zupass Auth functions.
 */
export function maybeCompleteZupassAuthSession() {
  WebBrowser.maybeCompleteAuthSession()
  redirectUri = AuthSession.makeRedirectUri({ scheme: SCHEME })
}

/**
 * This hook is used to verify that the user is a member of a Zupass group.
 *
 * It opens a WebBrowser to the Zupass Auth server,
 * which will redirect back to our demo server with a proof.
 * Then our demo server will verify the proof and return a verification object.
 */
export function useZupassGroupMembershipVerification({
  title,
  groupName,
}: {
  /** The title shown to the user in the Zupass.org UI */
  title: string
  /** The name of the supported semaphore Group */
  groupName: KnownGroupName
}) {
  if (redirectUri == null) throw new Error('maybeCompleteZupassAuthSession must be called first')
  // Using useAuthRequest for a lot of the heavy lifting
  const [request, result, promptAsyncWithUrl] = AuthSession.useAuthRequest(
    {
      redirectUri,
      // TODO: figure out how to use PKCE
      usePKCE: false,
      // This is not used because Zupass is not an OAuth server, but it's required by the type
      clientId: 'NOT USED',
    },
    {
      // This is not used because Zupass is not an OAuth server. It's not required by the type, but it's here for clarity.
      // instead, we're passing in the real authorizationEndpoint url inside our own promptAsync function
      authorizationEndpoint: 'NOT USED',
    }
  )

  // URL that the user will be redirected to after our demo server verifies the proof
  // the state is used to prevent CSRF attacks
  const redirectUriWithState = `${redirectUri}?state=${encodeURIComponent(request?.state!)}`

  // Zupass.org URL to open in the WebBrowser
  const zupassUrl = genZupassUrl({
    title,
    remoteUrl: semaphoreGroupUrls[groupName],
    // verification service URL
    returnUrl:
      VERIFY_SERVICE_URL +
      `?final_redirect_uri=${encodeURIComponent(redirectUriWithState)}` +
      // this isn't currently being used by the demo server, but maybe it will be in the future?
      `&groupName=${encodeURIComponent(groupName)}`,
  })

  type PromptOptions = Omit<Parameters<typeof promptAsyncWithUrl>[0], 'url'>
  const promptAsync = (options: PromptOptions = {}) => promptAsyncWithUrl({ ...options, url: zupassUrl })

  return { promptAsync, request, result, verification: parseVerification(result) }
}

/**
 * Parse the verification object from the demo server.
 * @internal
 */
function parseVerification(result: AuthSession.AuthSessionResult | null) {
  if (result == null) return null
  let verification: DemoServerVerification = { verified: false, pcd: null, error: 'unknown error' }
  if (result.type === 'success' && 'verification' in result.params) {
    try {
      verification = JSON.parse(result.params.verification) as DemoServerVerification

      if (!('verified' in verification && typeof verification.verified === 'boolean')) {
        throw new Error('missing verified property')
      } else if (
        !(
          'pcd' in verification &&
          verification.pcd &&
          typeof verification.pcd === 'object' &&
          'type' in verification.pcd &&
          typeof verification.pcd.type === 'string' &&
          'pcd' in verification.pcd &&
          typeof verification.pcd.pcd === 'string'
        )
      ) {
        throw new Error('missing or invalid pcd')
      }
    } catch (parseError) {
      verification = { verified: false, pcd: null, error: String(parseError), debug: result.params.verification }
    }
  }
  return verification
}
