import { View, Text, Image } from 'react-native'
import React, { useEffect, useState } from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import AsyncStorage from '@react-native-async-storage/async-storage'

import Welcome from "./Welcome";
import Signup from "./Signup";
import Login from "./Login";
import BottomTabNavigation from "./BottomTabNavigation"

const Stack = createNativeStackNavigator()

const StackNavigation = () => {
  const [loading, setLoading] = useState(true)
  const [loggedin, setLoggedin] = useState(false)

  const checkLoggedIn = async () => {
    const token = await AsyncStorage.getItem("token")
    setLoggedin(!!token)   // true if token exists
    setLoading(false)
  }

  useEffect(() => {
    checkLoggedIn()
  }, [])

  if (loading) {
    return (
      <View style={{ flex: 1, backgroundColor: "#BBDCE5" }}>
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
          <Image source={require("./assets/ghost.jpg")}
            style={{ height: 200, width: 200, borderRadius: 100, marginBottom: 30 }}
          />
          <Text style={{ fontSize: 20, fontWeight: "bold", color: "black", fontStyle: "italic" }}>
            Welcome to MyApp
          </Text>
        </View>
      </View>
    )
  }

  return (
      <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName={loggedin ? "BottomTabNavigation" : "Welcome"}>
        <Stack.Screen name="Welcome" component={Welcome} />
        <Stack.Screen name="Signup" component={Signup} />
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="BottomTabNavigation" component={BottomTabNavigation} />
      </Stack.Navigator>
  )
}

export default StackNavigation
