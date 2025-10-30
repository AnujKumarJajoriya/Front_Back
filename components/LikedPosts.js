import { View, Text, FlatList, Image, StyleSheet } from 'react-native'
import React, { useEffect, useState } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage';

const LikedPosts = () => {

    const [likedPosts, setLikedPosts] = useState([]);

    const FetchLikedPosts = async () => {
        const token = await AsyncStorage.getItem("token");
        const res = await fetch("http://10.0.2.2:5000/likedPosts", {
            headers: { Authorization: `Bearer ${token}` }
        });
        const data = await res.json();
        setLikedPosts(data)

    }

    useEffect(() => {
        FetchLikedPosts()
    },[])
    return (
        <View style={{backgroundColor:"white", paddingBottom:50}}>

            <Text style={{ fontSize: 18, fontWeight: "bold", marginLeft: 20, marginTop: 10 }}>Liked Posts</Text>


            {likedPosts.length === 0 ? (
                <Text style={{ textAlign: "center", marginTop: 20 }}>No liked posts yet.</Text>
            ) : (
                <FlatList
                    data={likedPosts}
                    keyExtractor={(item) => item._id}
                    renderItem={({ item }) => (
                        <View key={item._id} style={style.postCard}>

                            {/* Header with Avatar */}
                            <View style={style.postHeader}>
                                <View style={style.avatar}>
                                    <Text style={style.avatarText}>
                                        {item.user?.username ? item.user.username[0] : "?"}
                                    </Text>
                                </View>
                                <Text style={style.username}>{item.user?.username || "Unknown"}</Text>
                            </View>
                            <View style={style.separator} />


                            <Image
                                source={{ uri: item.imageurl }}
                                style={{ width: "100%", height: 200, borderRadius: 10 }}
                                resizeMode="cover"
                            />
                            <Text style={{ marginTop: 5, fontWeight: "bold", marginBottom: 5, marginLeft: 3 }}>{item.caption}</Text>
                            <View style={style.separator} />

                            <Text style={{ fontWeight: "bold", color: "grey" }}> Posted by {item.user?.username}</Text>




                        </View>
                    )}
                />
            )
            }
        </View>
    )
}

export default LikedPosts

const style = StyleSheet.create({
    postCard: {
        margin: 10,
        backgroundColor: "white",
        padding: 15,
        shadowColor: "#000",
        shadowOpacity: 0.08,
        shadowRadius: 6,
        elevation: 3,
        marginBottom: 7,
        borderRadius: 10

    },
    postHeader: { flexDirection: "row", alignItems: "center", marginBottom: 8 },
    avatar: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: "#00809D",
        justifyContent: "center",
        alignItems: "center",
    },
    avatarText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
    username: { marginLeft: 10, fontWeight: "600", fontSize: 16 },
    postImage: { width: "100%", height: 220, borderRadius: 10, marginTop: 6 },
    postCaption: { marginTop: 10, marginBottom: 10, marginLeft: 10, fontSize: 15, color: "#333" },
    separator: {
        height: 0.8,
        backgroundColor: "#dddadaff",
        marginBottom: 3
        , marginTop: 3
    },
})   
