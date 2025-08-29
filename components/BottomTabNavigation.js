import { View, Text } from 'react-native'
import React from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import Home from "./Home"
import Profile from "./Profile"
import Ionicons from '@react-native-vector-icons/ionicons' 

const BottomTab = createBottomTabNavigator()

const BottomTabNavigation = () => {
    return (
        <BottomTab.Navigator screenOptions={{
            tabBarActiveTintColor:"black",
            tabBarInactiveTintColor:"grey", 
            tabBarStyle: {
                backgroundColor: "#ffffffff",
            }
        }}>
            <BottomTab.Screen name='Home' component={Home} options={{ headerShown: false,
                tabBarIcon : ({size ,color})=>(
                    <Ionicons name='home' size={size} color={color} />
                )
             }}></BottomTab.Screen>
            <BottomTab.Screen name='Profile' component={Profile} options={{ headerShown: false ,
                  tabBarIcon : ({size ,color})=>(
                    <Ionicons name='person' size={size} color={color} />
                  )
            }}></BottomTab.Screen>
        </BottomTab.Navigator>
    )
}

export default BottomTabNavigation