import { View, Text, TouchableOpacity, Image, TextInput, Alert } from 'react-native'
import React, { useState } from 'react'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';





const Login = () => {
    const navigation = useNavigation()


    const [email, setemail] = useState("")
    const [Password, setpassword] = useState("")

    const handleLogin = async () => {
        if (!email || !Password) {
            Alert.alert("Error", "Please enter email and password");
            return;
        }


        const response = await fetch("http://10.0.2.2:5000/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email: email, password: Password })
        })

        const data = await response.json()

        if (response.ok) {
            await AsyncStorage.setItem("token", data.token)
            await AsyncStorage.setItem("user", JSON.stringify(data.user)); // save whole user object

            navigation.reset({
                index: 0,
                routes: [{ name: "BottomTabNavigation" }]
            });
        } else {
            Alert.alert("Error", data.message);
        }


    }

    const handleForgetPassword = async () => {


    }
    return (
        <View style={{ backgroundColor: "#BBDCE5", flex: 1 }}>



            <View style={{ justifyContent: "center", alignItems: "center", margin: hp(3) }}>
                <Image source={require("./assets/ghost.jpg")} style={{ height: hp(23), width: wp(52), borderRadius: hp(80), margin: hp(4), marginBottom: hp(1.8) }}></Image>

            </View>


            <View style={{ flex: 1, backgroundColor: "white", borderTopLeftRadius: hp(3), borderTopRightRadius: hp(3), padding: hp(3) }}

            >



                <View>



                    <Text style={{ fontSize: hp(2), fontWeight: "bold", color: "Black", marginLeft: hp(1.8) }}>Email</Text>

                    <TextInput
                        value={email}
                        onChangeText={(text) => setemail(text)}
                        placeholder='Enter Your Email'
                        style={{ height: hp(5), width: wp("80%"), borderWidth: hp(0.2), borderColor: "black", backgroundColor: "#EAEFEF", borderRadius: hp(3), paddingLeft: hp(1.8), marginBottom: hp(1) }}
                    >

                    </TextInput>

                </View>

                <View>



                    <Text style={{ fontSize: hp(2), fontWeight: "bold", color: "Black", marginLeft: hp(1.8) }}>Password</Text>

                    <TextInput
                        value={Password}
                        onChangeText={(text) => setpassword(text)}
                        placeholder='Enter Your Password'
                        secureTextEntry
                        style={{ height: hp(5), width: wp("80%"), borderWidth: hp(0.2), borderColor: "black", backgroundColor: "#EAEFEF", borderRadius: hp(3), paddingLeft: hp(1.8), marginBottom: hp(0.7) }}
                    >

                    </TextInput>
                    <TouchableOpacity onPress={handleForgetPassword}>


                        <Text style={{ fontSize: hp(1.8), fontWeight: "bold", color: "Black", marginLeft: hp(1.8), marginTop: hp(1) }}>Forgot Password ?</Text>

                    </TouchableOpacity>

                </View>

                <View style={{ marginTop: hp(5) }}>

                    <TouchableOpacity onPress={() => handleLogin()}>
                        <View style={{ justifyContent: "center", alignItems: "center", backgroundColor: "#3674B5", height: hp(5), width: wp("85%"), borderRadius: hp(15), elevation: 5 }}>


                            <Text style={{ fontSize: hp(2.5), fontWeight: "bold", color: "white" }}>Login</Text>


                        </View>
                    </TouchableOpacity>

                    <View style={{ flexDirection: "row", justifyContent: "center", alignItems: "center", margin: hp(1.4) }}>

                        <Text style={{ fontSize: hp(1.5), fontWeight: "bold", color: "black" }}> Create an Account.</Text>

                        <TouchableOpacity onPress={() => navigation.navigate("Signup")}>
                            <Text style={{ fontSize: hp(1.9), fontWeight: "bold", color: "#3674B5", marginLeft: hp(1) }}>Signup</Text>
                        </TouchableOpacity>
                    </View>

                </View>



            </View>

        </View>
    )
}

export default Login