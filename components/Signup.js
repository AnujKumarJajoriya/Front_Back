import { View, Text, TouchableOpacity, Image, TextInput, Alert } from 'react-native'
import React, { useState } from 'react'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';





const Signup = () => {

    const navigation = useNavigation()

    const [email, setemail] = useState("")
    const [Password, setpassword] = useState("")
    const [UserName, setusername] = useState("")

    const handlesignup = async () => {
        if (!UserName || !email || !Password) {
            Alert.alert("Error", "Please fill all fields");
            return;
        }

        const response = await fetch("http://10.0.2.2:5000/signup", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username: UserName, email: email, password: Password })
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

    return (
        <View style={{ backgroundColor: "white", flex: 1 }}>



            <View style={{ justifyContent: "center", alignItems: "center", margin: hp(3) }}>
                <Image source={require("./assets/mainimage.jpg")} style={{ height: hp(23), width: wp(52), borderRadius: hp(80), margin: hp(4), marginBottom: hp(1.8) }}></Image>

            </View>



            <View style={{ flex: 1, backgroundColor: "white", borderTopLeftRadius: hp(3), borderTopRightRadius: hp(3), padding: hp(3) }}

            >

                <View>



                    <Text style={{ fontSize: hp(2), fontWeight: "bold", color: "Black", marginLeft: hp(1.8) }}>UserName</Text>

                    <TextInput
                        value={UserName}
                        onChangeText={(text) => setusername(text)}
                        placeholder='Enter Your UserName'
                        style={{ height: hp(5), width: wp("88%"), borderBottomWidth: hp(0.2), borderColor: "black", backgroundColor: "#ffffffff", borderRadius: hp(3), paddingLeft: hp(1.8), marginBottom: hp(1.7) }}
                    >

                    </TextInput>

                </View>

                <View>



                    <Text style={{ fontSize: hp(2), fontWeight: "bold", color: "Black", marginLeft: hp(1.8) }}>Email</Text>

                    <TextInput
                        value={email}
                        onChangeText={(text) => setemail(text)}
                        placeholder='Enter Your Email'
                        style={{ height: hp(5), width: wp("88%"), borderBottomWidth: hp(0.2), borderColor: "black", backgroundColor: "#ffffffff", borderRadius: hp(3), paddingLeft: hp(1.8), marginBottom: hp(1.7) }}
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
                        style={{ height: hp(5), width: wp("88%"), borderBottomWidth: hp(0.2), borderColor: "black", backgroundColor: "#ffffffff", borderRadius: hp(3), paddingLeft: hp(1.8), marginBottom: hp(0.7) }}
                    >

                    </TextInput>


                </View>

                <View style={{ marginTop: hp(5) }}>

                    <TouchableOpacity onPress={() => handlesignup()}>
                        <View style={{ justifyContent: "center", alignItems: "center", backgroundColor: "#37353E", height: hp(5), width: wp("88%"), borderTopLeftRadius: hp(15), borderBottomRightRadius: hp(15),elevation: 5 }}>


                            <Text style={{ fontSize: hp(2.5), fontWeight: "bold", color: "white" }}>Sign Up</Text>


                        </View>
                    </TouchableOpacity>

                    <View style={{ flexDirection: "row", justifyContent: "center", alignItems: "center", margin: hp(1.4) }}>

                        <Text style={{ fontSize: hp(1.5), fontWeight: "bold", color: "black" }}> Already have a Account ?</Text>

                        <TouchableOpacity onPress={() => navigation.navigate("Login")}>
                            <Text style={{ fontSize: hp(1.9), fontWeight: "bold", color: "#00809D", marginLeft: hp(1) }}>Login</Text>
                        </TouchableOpacity>
                    </View>

                </View>



            </View>

        </View>
    )
}

export default Signup