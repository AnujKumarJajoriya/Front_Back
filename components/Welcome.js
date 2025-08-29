import { View, Text, Image, TouchableOpacity } from 'react-native'
import React from 'react'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { useNavigation } from '@react-navigation/native';
const Welcome = () => {

    const navigation = useNavigation();
    return (
        <View style={{ flex: 1, backgroundColor: "white" }}>
            <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>


                <View >
                    <Image source={require("./assets/mainimage.jpg")} style={{ height: hp(29), width: wp(65), borderRadius: hp(80), margin: hp(4), marginBottom: hp(5.8) }}></Image>

                </View>

                <View>
                    <Text style={{ fontSize: hp(2.6), fontWeight: "bold", color: "black", fontStyle: "italic" }}>Welcome to Postify</Text>

                </View>
                <TouchableOpacity onPress={() => navigation.navigate("Signup")}>
                    <View style={{ justifyContent: "center", alignItems: "center", backgroundColor: "#37353E", height: hp(5), width: wp("85%"), borderRadius: hp(15), elevation: 5 }}>


                        <Text style={{ fontSize: hp(2.4), fontWeight: "bold", color: "white" }}> Sign Up</Text>


                    </View>
                </TouchableOpacity>
                                    <Text style={{ fontSize: hp(1.5), fontWeight: "bold", color: "black", margin: hp(1.2)  }}> or</Text>

                <View style={{ flexDirection: "row", justifyContent: "center", alignItems: "center",  }}>

                    <Text style={{ fontSize: hp(1.5), fontWeight: "bold", color: "black" }}> Already have a Account ?</Text>

                    <TouchableOpacity onPress={() => navigation.navigate("Login")}>
                        <Text style={{ fontSize: hp(1.9), fontWeight: "bold", color: "#00809D", marginLeft: hp(1) }}>Login</Text>
                    </TouchableOpacity>
                </View>

            </View>

        </View>
    )
}

export default Welcome