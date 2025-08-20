import { View, Text,  Image, TouchableOpacity } from 'react-native'
import React from 'react'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { useNavigation } from '@react-navigation/native';
const Welcome = () => {

    const navigation = useNavigation();
    return (
        <View style={{ flex: 1, backgroundColor: "#BBDCE5" }}>
            <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>

                <View>
                    <Text style={{ fontSize: hp(3), fontWeight: "bold", color: "black", fontStyle:"italic" }}>Welcome to MyApp</Text>

                </View>
                <View >
                    <Image source={require("./assets/ghost.jpg")} style={{ height: hp(29), width: wp(65), borderRadius: hp(80), margin: hp(4), marginBottom: hp(5.8) }}></Image>

                </View>

                <TouchableOpacity  onPress={()=>navigation.navigate("Signup")}>
                    <View style={{ justifyContent: "center", alignItems: "center", backgroundColor: "#3674B5", height: hp(5), width: wp("85%"), borderRadius: hp(15), elevation: 5 }}>


                        <Text style={{ fontSize: hp(2.4), fontWeight: "bold", color: "white" }}> Sign Up</Text>


                    </View>
                </TouchableOpacity>
                <View style={{ flexDirection: "row", justifyContent: "center", alignItems: "center", margin: hp(1.4) }}>

                    <Text style={{ fontSize: hp(1.5), fontWeight: "bold", color: "black" }}> Already have a Account ?</Text>

                    <TouchableOpacity onPress={()=>navigation.navigate("Login")}>
                        <Text style={{ fontSize: hp(1.9), fontWeight: "bold", color: "#3674B5", marginLeft: hp(1) }}>Login</Text>
                    </TouchableOpacity>
                </View>

            </View>

        </View>
    )
}

export default Welcome