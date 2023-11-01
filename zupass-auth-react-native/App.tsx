import './global.css'
import { StatusBar } from 'expo-status-bar'
import { Text, View } from 'react-native'

export default function App() {
  return (
    <View className="flex-1 bg-white items-center justify-center">
      <Text>Open up App.tsx to start working on your app!</Text>
      <StatusBar style="auto" />
      <View className="w-10 h-10 bg-blue-500" />
    </View>
  )
}
