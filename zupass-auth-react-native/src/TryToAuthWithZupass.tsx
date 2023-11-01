import * as React from 'react'
import { Pressable, SafeAreaView, ScrollView, Text, View } from 'react-native'
import * as AuthSession from 'expo-auth-session'
import * as WebBrowser from 'expo-web-browser'
import { useAuthRequestResult, useLoadedAuthRequest } from 'expo-auth-session/build/AuthRequestHooks'

WebBrowser.maybeCompleteAuthSession()

const redirectUri = AuthSession.makeRedirectUri({ scheme: 'zupass-auth-demo' })
const ZuzaluParticipants = 'https://api.pcd-passport.com/semaphore/1'

export function TryToAuthWithZupass() {
  const [request, result, promptAsync] = useZupassAuthRequest(
    {
      clientId: 'native.code',
      redirectUri,
      // usePKCE: false,
      // clientSecret: 'secret',
      // codeChallenge: 'code-challenge',
      // prompt: 'login' as any,
      // extraParams: {
      //   isOriginalRequestParams: 'true',
      // },
      // responseType: 'code',
    },
    {
      authorizationEndpoint: 'NOT USED',
    }
  )
  const zupassUrl = genZupassUrl({
    title: 'Zupass Auth Demo',
    remoteUrl: ZuzaluParticipants,
    returnUrl: `http://localhost:3000/zupass-verify?final_redirect_uri=${encodeURIComponent(
      `${redirectUri}?state=${request?.state}`
    )}`,
  })

  return (
    <SafeAreaView>
      <>
        <Pressable disabled={!request} onPress={() => promptAsync({ url: zupassUrl })}>
          <Text>Login!</Text>
        </Pressable>

        <ScrollView className="w-screen">
          {/* <Text>Redirect URI: {redirectUri}</Text> */}
          {/* <Text>Zupass URL: {zupassUrl}</Text> */}
          <Text>Request:</Text>
          {request && <Text>{JSON.stringify(request, null, 2)}</Text>}
          <Text>Result:</Text>
          {result && <Text>{JSON.stringify(result, null, 2)}</Text>}
        </ScrollView>
      </>
    </SafeAreaView>
  )
}

function genZupassUrl({
  returnUrl,
  remoteUrl,
  title,
  description = '',
}: {
  /**
   * The URL that Zupass will redirect to after the user has completed the proof.
   */
  returnUrl: string
  /**
   * The URL of the remote server that will be used to fetch the group information.
   */
  remoteUrl: string
  /**
   * The title show to the user during the proof request.
   */
  title: string
  /**
   * Doesn't seem to be used anywhere.
   */
  description?: string
}) {
  const requestParamValue = {
    type: 'Get',
    returnUrl,
    args: {
      externalNullifier: {
        argumentType: 'BigInt',
        userProvided: false,
        value: '0',
      },
      group: {
        argumentType: 'Object',
        userProvided: false,
        remoteUrl,
      },
      identity: {
        argumentType: 'PCD',
        pcdType: 'semaphore-identity-pcd',
        userProvided: true,
      },
      signal: {
        argumentType: 'BigInt',
        userProvided: false,
        value: '0',
      },
    },
    pcdType: 'semaphore-group-signal',
    options: {
      title,
      description,
    },
  }

  const search = `request=${encodeURIComponent(JSON.stringify(requestParamValue))}`
  return `https://zupass.org/#/prove?${search}`
}

class ZupassAuthRequest extends AuthSession.AuthRequest {}

export function useZupassAuthRequest(
  config: AuthSession.AuthRequestConfig,
  discovery: AuthSession.DiscoveryDocument | null
): [
  AuthSession.AuthRequest | null,
  AuthSession.AuthSessionResult | null,
  (options?: AuthSession.AuthRequestPromptOptions) => Promise<AuthSession.AuthSessionResult>
] {
  const request = useLoadedAuthRequest(config, discovery, ZupassAuthRequest)
  const [result, promptAsync] = useAuthRequestResult(request, discovery)
  return [request, result, promptAsync]
}
