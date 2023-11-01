import './global.css'
import { StatusBar } from 'expo-status-bar'
import { Text, View } from 'react-native'
import { TryToAuthWithZupass } from './src/TryToAuthWithZupass'

export default function App() {
  return (
    <View className="flex-1 bg-white items-center justify-center">
      <StatusBar style="auto" />
      <TryToAuthWithZupass />
    </View>
  )
}
