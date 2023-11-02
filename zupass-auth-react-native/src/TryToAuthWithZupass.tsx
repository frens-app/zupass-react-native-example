import * as React from 'react'
import { Pressable, PressableProps, SafeAreaView, ScrollView, Text, View } from 'react-native'
import {
  maybeCompleteZupassAuthSession,
  useZupassGroupMembershipVerification,
} from './useZupassGroupMembershipVerification'

maybeCompleteZupassAuthSession()

export function TryToAuthWithZupass() {
  const { promptAsync, request, result, verification } = useZupassGroupMembershipVerification({
    title: 'Zupass Auth Demo',
    groupName: 'ZuzaluParticipants',
  })

  const { pcd, verified, error, debug } = verification || {}

  if (error) console.warn('verification error', error)
  if (debug) console.log('verification debug', debug)

  return (
    <View className="flex-1 w-screen max-h-screen">
      <SafeAreaView style={{ flex: 1 }}>
        <View className="flex-1 p-4">
          <Text className="self-center text-xl">Verify ZuConnect residency with Zupass</Text>
          <Text className="self-center mb-4 text-lg">Anonymous verification</Text>

          <ScrollView className="flex-1">
            {verification && (
              <>
                {verified && <Text className="self-center text-5xl">Verified!</Text>}
                {!verified && <Text className="self-center text-5xl text-red-900">Not verified!</Text>}
                {error && <Text className="text-red-900">error: {error}</Text>}
                {/* {pcd && <Text className="text-xs">{pcd.type}</Text>} */}
              </>
            )}

            {/* {request && (
              <View className="p-4 mb-4 bg-neutral-100">
                <Text className="text-lg">Request:</Text>
                <Text className="text-xs">{JSON.stringify(request, null, 2)}</Text>
              </View>
            )} */}

            {/* {result && (
              <View className="p-4 bg-neutral-100">
                <Text className="text-lg">Result:</Text>
                <Text className="text-xs">{JSON.stringify(result, null, 2)}</Text>
              </View>
            )} */}
          </ScrollView>

          {!verified && (
            <Button disabled={!request} onPress={() => promptAsync({})} title="Verify ZuConnect Residency" />
          )}
          {verified && (
            <View className="bg-[#ffe5a4] rounded flex items-center justify-center p-3 w-4/5 self-center my-4">
              <Text className="text-[#206b5e] font-bold">ZuConnect Residency Verified!</Text>
            </View>
          )}
        </View>
      </SafeAreaView>
    </View>
  )
}

function Button({ title, ...props }: PressableProps & { title: string }) {
  return (
    <Pressable {...props} className="bg-[#206b5e] rounded flex items-center justify-center p-3 w-4/5 self-center my-4">
      <Text className="text-[#fcd270] font-bold">{title}</Text>
    </Pressable>
  )
}
