import * as React from 'react'
import { Pressable, SafeAreaView, ScrollView, Text, View } from 'react-native'
import { maybeCompleteZupassAuthSession, useZupassGroupMembershipVerification } from './useFancyStuff'

maybeCompleteZupassAuthSession()

export function TryToAuthWithZupass() {
  const { promptAsync, request, result, verified, pcd, error } = useZupassGroupMembershipVerification({
    title: 'Zupass Auth Demo',
    groupName: 'ZuzaluParticipants',
  })

  return (
    <SafeAreaView>
      <>
        <Pressable disabled={!request} onPress={() => promptAsync({})}>
          <Text>Login!</Text>
        </Pressable>

        <ScrollView className="w-screen">
          <Text>Request:</Text>
          {request && <Text>{JSON.stringify(request, null, 2)}</Text>}
          <Text>Result:</Text>
          {verified && (
            <>
              <Text>verified? {JSON.stringify(verified)}</Text>
              {error && <Text>error: {error}</Text>}
              <Text>pcd: {JSON.stringify(pcd)}</Text>
            </>
          )}
          {result && <Text>{JSON.stringify(result, null, 2)}</Text>}
        </ScrollView>
      </>
    </SafeAreaView>
  )
}
