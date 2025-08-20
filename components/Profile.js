import { View, Text, TouchableOpacity, Alert } from "react-native";
import React, { useEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Profile = () => {

    const [user, setUser] = useState(null);

    const userinfo = async () => {
        const storedUser = await AsyncStorage.getItem("user");
        setUser(JSON.parse(storedUser));
    }

    useEffect(() => {
        userinfo()
    }, [])

    const navigation = useNavigation();

    const handleLogout = () => {
        Alert.alert(
            "Logout",
            "Are you sure you want to logout?",
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Logout",
                    onPress: async () => {
                        await AsyncStorage.removeItem("token");
                        await AsyncStorage.removeItem("user");
                        navigation.reset({
                            index: 0,
                            routes: [{ name: "Welcome" }]
                        });
                    }
                }
            ]
        );
    };

    return (
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
            <Text>Profile</Text>
            {user ? (
                <>
                    <Text style={{ fontSize: 20, fontWeight: "bold", marginBottom: 10 }}>
                        Welcome, {user.username} 👋
                    </Text>
                    <Text style={{ fontSize: 16, marginBottom: 5 }}>Email: {user.email}</Text>

                </>
            ) : (
                <Text style={{ fontSize: 18 }}>Guest</Text>
            )}
            <TouchableOpacity
                style={{ marginTop: 20, backgroundColor: "red", padding: 10, borderRadius: 8 }}
                onPress={handleLogout}
            >
                <Text style={{ color: "white", fontWeight: "bold" }}>Logout</Text>
            </TouchableOpacity>
        </View>
    );
};

export default Profile;
