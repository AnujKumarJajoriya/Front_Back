import { View, Text } from 'react-native'
import React from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import Home from "./Home"
import Profile from "./Profile"

const BottomTab = createBottomTabNavigator()

const BottomTabNavigation = () => {
    return (
        <BottomTab.Navigator>
            <BottomTab.Screen name='Home' component={Home} options={{ headerShown: false }}></BottomTab.Screen>
            <BottomTab.Screen name='Profile' component={Profile} options={{ headerShown: false }}></BottomTab.Screen>
        </BottomTab.Navigator>
    )
}

export default BottomTabNavigation