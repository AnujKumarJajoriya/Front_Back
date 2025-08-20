import { View, Text, StatusBar } from 'react-native'
import React from 'react'
import { NavigationContainer } from "@react-navigation/native";
import StackNavigation from "./components/StackNavigation";

const App = () => {
  return (

    <NavigationContainer>
      <StatusBar
    barStyle="dark-content"
    backgroundColor="#BBDCE5"
    ></StatusBar>
      <StackNavigation />
    </NavigationContainer>

  )
}

export default App


// npm install @react-navigation/native
// npm install react-native-screens react-native-safe-area-context
// npm install @react-navigation/native-stack
// npm install @react-navigation/bottom-tabs
// npm install @react-navigation/material-top-tabs
// npm install react-native-pager-view

// Drawer 
// npm install @react-navigation/drawer
// npm install react-native-gesture-handler react-native-reanimated
//  plugins: [
//
//      'react-native-reanimated/plugin',
//    ],                                       add in bable.config.js

// npm i react-native-heroicons
// npm i react-native-responsive-screen
// npm i react-native-masonry-list

// npm i react-native-vector-icons