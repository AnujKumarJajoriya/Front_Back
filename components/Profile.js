import { View, Text, TouchableOpacity, Alert, Image, Modal, StyleSheet, FlatList, ScrollView, TextInput, BackHandler } from "react-native";
import React, { useEffect, useState } from "react";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import ImagePicker from 'react-native-image-crop-picker';
import moment from 'moment';
import Ionicons from '@react-native-vector-icons/ionicons' 




const Profile = () => {

    const [user, setUser] = useState(null);

    const userinfo = async () => {
        const storedUser = await AsyncStorage.getItem("user");
        setUser(JSON.parse(storedUser));
    }

    useEffect(() => {

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


    const [image, setImage] = useState(null);
    const [editpromodal, seteditpromodal] = useState(false)


    const saveimage = async (imagepath) => {
        await AsyncStorage.setItem(`${user.id}_profileimage`, imagepath)
    }
    const opencamera = () => {
        ImagePicker.openCamera({
            height: 300,
            width: 300,
            cropping: true
        }).then(image => {
            setImage(image.path)
            saveimage(image.path)
            seteditpromodal(false)
        }).catch(error => {
            if (error.code !== 'E_PICKER_CANCELLED') {
                console.error("Camera Error:", error);
            }
            seteditpromodal(false)
        });


    }

    const opengallery = () => {
        ImagePicker.openPicker({
            height: 300,
            width: 300,
            cropping: true
        }).then(image => {
            setImage(image.path)
            saveimage(image.path)
            seteditpromodal(false)
        }).catch(error => {
            if (error.code !== 'E_PICKER_CANCELLED') {
                console.error("Gallery Error:", error);
            }
            seteditpromodal(false)
        });


    }

    const removeimage = async () => {
        if (image) {
            setImage(null)
            await AsyncStorage.removeItem(`${user.id}_profileimage`)

        }
        seteditpromodal(false)
    }


    const loadimage = async () => {
        const savedimage = await AsyncStorage.getItem(`${user.id}_profileimage`)
        if (savedimage) {
            setImage(savedimage)
        }
    }


    const [myposts, setmyPosts] = useState([]);

    const fetchmyposts = async () => {

        const token = await AsyncStorage.getItem("token");
        const res = await fetch("http://10.0.2.2:5000/myposts", {
            headers: { Authorization: `Bearer ${token}` }
        });
        const data = await res.json();
        setmyPosts(data)

    }


    const handleLike = async (postid) => {
        const token = await AsyncStorage.getItem("token");
        const res = await fetch(`http://10.0.2.2:5000/posts/${postid}/like`, {
            method: "Post",
            headers: { Authorization: `Bearer ${token}` }
        });
        const data = await res.json();
        fetchmyposts()

    }

    const [showCommentModal, setShowCommentModal] = useState(false);
    const [selectedPost, setSelectedPost] = useState(null);
    const [commentText, setCommentText] = useState("");


    const handleComment = async (postid) => {
        if (!commentText.trim()) return;

        const token = await AsyncStorage.getItem("token");
        const res = await fetch(`http://10.0.2.2:5000/posts/${postid}/comment`, {
            method: "Post",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ text: commentText })
        });
        const data = await res.json();
        setCommentText("");
        fetchmyposts();
        setSelectedPost(data.post);
    }


    const [createpostmodal, setcreatepostmodal] = useState(false)

    const [createpostimage, setcreatepostimage] = useState(null);
    const [caption, setCaption] = useState("");




    const opengalleryforcreatepost = () => {
        ImagePicker.openPicker({
            cropping: true,
            height: 300,
            width: 300
        }).then((image) => {
            setcreatepostimage(image.path);
        });
    };

    const handlepost = async () => {
        try {
            const token = await AsyncStorage.getItem("token");
            if (!token) return Alert.alert("Please login first.");
            if (!createpostimage) return Alert.alert("Please select an image");

            const formData = new FormData();
            formData.append("image", {
                uri: createpostimage,
                type: "image/jpeg",
                name: "photo.jpg"
            });
            formData.append("caption", caption);

            const res = await fetch("http://10.0.2.2:5000/posts", {
                method: "POST",
                headers: { Authorization: `Bearer ${token}` },
                body: formData
            });

            const data = await res.json();
            console.log("Response:", data);

            if (res.ok) {
                Alert.alert("Post uploaded ✅");
                setCaption("");
                setcreatepostimage(null);
                fetchmyposts()
                setcreatepostmodal(false)
            } else {
                Alert.alert(data.message || "Something went wrong ❌");
            }
        } catch (error) {
            console.error("Error uploading post:", error);
            Alert.alert("Network error ❌");
        }
    };


    const [bio, setBio] = useState("");
    const [biomodal, setBiomodal] = useState(false);


    const savebio = async () => {
        await AsyncStorage.setItem(`${user.id}_Bio`, bio)
        setBiomodal(false)
        seteditpromodal(false)
    }

    const loadbio = async () => {
        const savedbio = await AsyncStorage.getItem(`${user.id}_Bio`)
        if (savedbio) {
            setBio(savedbio)
        }
    }

    const removebio = async () => {
        if (bio) {
            await AsyncStorage.removeItem(`${user.id}_Bio`)
            setBio("")

        }
        seteditpromodal(false)
    }



    useEffect(() => {
        userinfo();
    }, []);

    useEffect(() => {
        if (user) {
            loadimage();
            loadbio()
            fetchmyposts()
        }
    }, [user]);


    useFocusEffect(
        React.useCallback(() => {
            fetchmyposts();
        }, [])
    );

    // 🏠 Refresh when Home tab is pressed
    useEffect(() => {
        const unsubscribe = navigation.addListener("tabPress", () => {
            fetchmyposts();
        });
        return unsubscribe;
    }, [navigation]);


    return (
        <View style={{ flex: 1, justifyContent: "flex-start", backgroundColor: "white" }}>


            <View style={{ flexDirection: "row", justifyContent: "flex-start", alignItems: "center" }}>

                <View style={{
                    width: 110,
                    height: 110,
                    borderRadius: 55,
                    backgroundColor: "#00809D",
                    justifyContent: "center",
                    alignItems: "center",
                    margin: 12,


                }}>

                    {image ? (
                        <Image source={{ uri: image }} style={{
                            width: 103,
                            height: 103,
                            borderRadius: 51.5,
                            backgroundColor: "#00809D",
                            justifyContent: "center",
                            alignItems: "center"
                        }} />
                    ) : (

                        <Text style={{ color: "#fdfdfdff", fontWeight: "bold", fontSize: 55, textAlign: "center", textAlignVertical: "center" }}>
                            {user?.username ? user?.username[0] : "?"}
                        </Text>

                    )}
                </View>

                <View style={{ flexDirection: "column", justifyContent: "center", alignItems: "flex-start" }}>

                    {user ? (
                        <>
                            <Text style={{ fontSize: 20, fontWeight: "bold", marginBottom: 1 }}>{user.username}
                            </Text>
                            <Text style={{ fontSize: 16, marginBottom: 5, color: "grey" }}>Email: {user.email}</Text>


                            <View style={{ justifyContent: "center", alignItems: "center", flexDirection: "row" }}>
                                <TouchableOpacity
                                    onPress={() => seteditpromodal(true)}
                                    style={{ backgroundColor: "#00809D", padding: 10, borderRadius: 8, width: wp(30), height: hp(4.5), marginRight: 5 }}

                                >
                                    <Text style={{ color: "white", fontWeight: "bold", textAlign: "center", textAlignVertical: "center", fontSize: 17 }} >Edit Profile</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={{ backgroundColor: "red", padding: 10, borderRadius: 8, width: wp(30), height: hp(4.5) }}
                                    onPress={handleLogout}
                                >
                                    <Text style={{ color: "white", fontWeight: "bold", textAlign: "center", textAlignVertical: "center", }}>Logout</Text>
                                </TouchableOpacity>

                            </View>


                        </>
                    ) : (
                        <Text style={{ fontSize: 18 }}>Guest</Text>
                    )}
                </View>

            </View>


            <Modal
                visible={editpromodal}
                transparent={true}
                animationType="slide"
            >
                <View style={styles.modalOverlay}>
                    <View
                        style={styles.modalContainer}

                    >
                        <View style={styles.modalContent}>
                            <Text style={styles.modalTitle}>Edit Profile</Text>

                            <TouchableOpacity style={styles.modalButton} onPress={opencamera}>
                                <Text style={styles.modalButtonText}>Open Camera</Text>
                            </TouchableOpacity>

                            <TouchableOpacity style={styles.modalButton} onPress={opengallery}>
                                <Text style={styles.modalButtonText}>Choose from Gallery</Text>
                            </TouchableOpacity>


                            <TouchableOpacity style={[styles.modalButton, { opacity: !image ? 0.5 : 1 }]}
                                onPress={removeimage}
                                disabled={!image}
                            >
                                <Text style={styles.modalButtonText}>Remove Profile Image</Text>
                            </TouchableOpacity>

                            {bio ? (
                                <TouchableOpacity
                                    style={[styles.modalButton]}
                                    onPress={removebio}
                                >
                                    <Text style={styles.modalButtonText}>Remove Bio from Your Profile</Text>
                                </TouchableOpacity>)
                                : (
                                    <TouchableOpacity
                                        style={[styles.modalButton]}
                                        onPress={() => setBiomodal(true)}
                                    >
                                        <Text style={styles.modalButtonText}>Add Bio in Your Profile</Text>
                                    </TouchableOpacity>)
                            }


                            <TouchableOpacity
                                style={[styles.modalButton]}
                                onPress={() => seteditpromodal(false)}
                            >
                                <Text style={styles.modalButtonText}>Cancel</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>

            <View style={{ justifyContent: "flex-start", alignItems: "flex-start", marginRight: 130 }}>

                <Text style={{ fontSize: 15, color: "#636262ff", marginBottom: 13, marginLeft: 19, fontWeight: "bold" }}>
                    {bio ? bio : "No bio yet..."}
                </Text>

            </View>

            <View style={{ justifyContent: "center", alignItems: "center" }}>
                <TouchableOpacity
                    onPress={() => setcreatepostmodal(true)}
                    style={{ backgroundColor: "#00809D", borderRadius: 28, padding: 10, width: wp("80%"), height: hp(4.5), marginTop: 5, marginBottom: 9, justifyContent: "center" }}

                >

                    <View style={{flexDirection:"row" , justifyContent:"center" , alignItems:"center"}}>
 <Text style={{ color: "white", fontWeight: "bold", textAlign: "center", textAlignVertical: "center", fontSize: 17 , marginRight:5 }} >Create Post </Text>
                                        <Ionicons name='add' size={24} color="white" />
                    
                    </View>
                   
                </TouchableOpacity>
            </View>
            <View style={styles.separator} />


            <View style={styles.postActions}>
                <TouchableOpacity ><Text style={styles.actionText}>Posts  📷</Text></TouchableOpacity>
                <TouchableOpacity onPress={() => navigation.navigate("LikedPosts")}><Text style={styles.actionText}>Liked ❤️</Text></TouchableOpacity>
                <TouchableOpacity onPress={() => navigation.navigate("CommentedPosts")}><Text style={styles.actionText}>Comment 💬</Text></TouchableOpacity>
            </View>

            <View style={styles.separator} />





            <FlatList
                data={myposts}
                keyExtractor={(item) => item._id}
                renderItem={({ item }) => (
                    <View style={{
                        margin: 10,
                        backgroundColor: "white",
                        padding: 15,
                        shadowColor: "#000",
                        shadowOpacity: 0.08,
                        shadowRadius: 6,
                        elevation: 3,
                        marginBottom: 7,
                        borderRadius: 10

                    }}>
                        <Image
                            source={{ uri: `http://10.0.2.2:5000${item.imageurl}` }}
                            style={{ width: "100%", height: 200, borderRadius: 10 }}
                            resizeMode="cover"
                        />
                        <Text style={{ marginTop: 5, fontWeight: "bold", marginBottom: 5, marginLeft:4 }}>{item.caption}</Text>

                        <View style={styles.separator} />

                        <View style={styles.postActions}>
                            <TouchableOpacity onPress={() => handleLike(item._id)}><Text style={styles.actionText}> {item.likes?.includes(user?.id) ? "💔 Unlike" : "❤️ Like"} {item.likes?.length || 0}</Text></TouchableOpacity>
                            <TouchableOpacity onPress={() => {
                                setSelectedPost(item);
                                setShowCommentModal(true);
                            }}><Text style={styles.actionText}>💬 {item.comments?.length || 0} Comments</Text></TouchableOpacity>
                        </View>
                    </View>
                )}
            />


            {showCommentModal && selectedPost && (
                <Modal
                    visible={showCommentModal}
                    animationType="slide"
                    onRequestClose={() => setShowCommentModal(false)}
                >
                    <View style={{ flex: 1, backgroundColor: "#fff" }}>
                        {/* Header */}
                        <View style={{ flexDirection: "row", justifyContent: "space-between", padding: 15, borderBottomWidth: 1, borderColor: "#ccc" }}>
                            <Text style={{ fontSize: 18, fontWeight: "bold" }}>Comments</Text>
                            <TouchableOpacity onPress={() => setShowCommentModal(false)}>
                                <Text style={{ fontSize: 16, color: "red" }}>Close ✖</Text>
                            </TouchableOpacity>
                        </View>


                        <ScrollView style={{ flex: 1, padding: 15 }}>
                            {selectedPost.comments?.length > 0 ? (
                                selectedPost.comments.map((comment, index) => (
                                    <View key={index} style={{ marginBottom: 20 }}>
                                        <View style={{ flexDirection: "row", alignItems: "flex-start" }}>
                                            <View style={{
                                                width: 42,
                                                height: 42,
                                                borderRadius: 21,
                                                backgroundColor: "#00809D",
                                                justifyContent: "center",
                                                alignItems: "center",
                                            }}>
                                                <Text style={{ color: "#fff", fontWeight: "bold", fontSize: 15, }}>
                                                    {comment.user?.username ? comment.user.username[0] : "?"}
                                                </Text>

                                            </View>
                                            <View>
                                                <Text style={{ fontWeight: "bold", marginLeft: 7, fontSize: 15 }}>{comment.user?.username || "User"}</Text>

                                                <Text style={{ marginLeft: 7, }}>{comment.text}</Text>
                                                <Text style={{ fontSize: 12, color: "gray", marginLeft: 7 }}>
                                                    {moment(comment.createdAt).fromNow()}
                                                </Text>
                                            </View>

                                        </View>

                                    </View>
                                ))
                            ) : (
                                <Text style={{ color: "#555" }}>No comments yet.</Text>
                            )}
                        </ScrollView>

                        <View style={{ flexDirection: "row", padding: 10, borderTopWidth: 1, borderColor: "#ccc" }}>
                            <TextInput
                                style={{ flex: 1, borderWidth: 1, borderColor: "#ccc", borderRadius: 8, paddingHorizontal: 10 }}
                                placeholder="Write a comment..."
                                value={commentText}
                                onChangeText={setCommentText}
                            />

                            <TouchableOpacity
                                style={{ backgroundColor: "#00809D", paddingHorizontal: 15, justifyContent: "center", marginLeft: 8, borderRadius: 8 }}
                                onPress={() => handleComment(selectedPost._id)}
                            >

                                <Text style={{ color: "#fff", fontWeight: "bold" }}>Post</Text>
                            </TouchableOpacity>
                        </View>

                    </View>

                </Modal>
            )}


            <Modal
                visible={createpostmodal}
                animationType="slide"
                onRequestClose={() => setcreatepostmodal(false)}
            >
                <View style={{ flex: 1, backgroundColor: "#fff" }}>
                    {/* Header */}
                    <View style={{ flexDirection: "row", justifyContent: "space-between", padding: 15, borderBottomWidth: 1, borderColor: "#ccc" }}>
                        <Text style={{ fontSize: 18, fontWeight: "bold" }}>Create Post</Text>
                        <TouchableOpacity onPress={() => setcreatepostmodal(false)}>
                            <Text style={{ fontSize: 16, color: "red" }}>Close ✖</Text>
                        </TouchableOpacity>
                    </View>

                    <View style={styles.card}>

                        <TouchableOpacity style={styles.imageBox} onPress={opengalleryforcreatepost}>
                            {createpostimage ? (
                                <Image source={{ uri: createpostimage }} style={styles.preview} />
                            ) : (
                                <View style={{ alignItems: "center" }}>
                                    <Text style={{ fontSize: 28 }}>📷</Text>
                                    <Text style={styles.imageText}>Tap to Select Image</Text>
                                </View>
                            )}
                        </TouchableOpacity>

                        <TextInput
                            style={styles.captionInput}
                            placeholder="Write a caption..."
                            value={caption}
                            onChangeText={setCaption}
                            multiline
                        />

                        <TouchableOpacity style={styles.postButton} onPress={handlepost}>
                            <Text style={styles.postText}>Post</Text>
                        </TouchableOpacity>
                    </View>

                </View>
            </Modal>

            <Modal
                visible={biomodal}
                animationType="slide"
                onRequestClose={() => setBiomodal(false)}
            >
                <View style={{ flex: 1, backgroundColor: "#fff", }}>
                    {/* Header */}
                    <View style={{ flexDirection: "row", justifyContent: "space-between", padding: 15, borderBottomWidth: 1, borderColor: "#ccc" }}>
                        <Text style={{ fontSize: 18, fontWeight: "bold" }}>Add Bio in Your Profile</Text>
                        <TouchableOpacity onPress={() => { setBiomodal(false); seteditpromodal(false) }}>
                            <Text style={{ fontSize: 16, color: "red" }}>Close ✖</Text>
                        </TouchableOpacity>
                    </View>

                    <View style={styles.card}>


                        <TextInput
                            style={styles.captionInput}
                            placeholder="Write a caption..."
                            value={bio}
                            onChangeText={setBio}
                            multiline
                        />

                        <TouchableOpacity style={styles.postButton} onPress={savebio}>
                            <Text style={styles.postText}>Save Bio</Text>
                        </TouchableOpacity>
                    </View>

                </View>
            </Modal>

        </View>
    );
};

export default Profile;

const styles = StyleSheet.create({

    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.4)',
        justifyContent: "flex-end",
        alignItems: "flex-end",
    },
    modalContainer: {
        width: wp("100%"),
        backgroundColor: '#fff',
        padding: hp(3),
        elevation: 10,
    },
    modalContent: {
        alignItems: 'center',
    },
    modalTitle: {
        fontSize: hp(2.8),
        fontWeight: 'bold',
        color: '#333',
        marginBottom: hp(2),
    },
    modalButton: {

        width: wp("100%"),
        paddingVertical: hp(0.5),

        marginTop: hp(1.2),
        alignItems: 'center',

    },
    modalButtonText: {
        color: 'black',
        fontSize: hp(2),
        fontWeight: '600',
    },
    postActions: { flexDirection: "row", justifyContent: "space-around", margin: 10 },
    actionText: { fontSize: 16, color: "#00809D", fontWeight: "500", fontWeight: "bold" },
    separator: {
        height: 0.8,
        backgroundColor: "#dddadaff",
        marginBottom: 3
        , marginTop: 3
    },
    card: {
        paddingBottom: 20,
        backgroundColor: "#fff",
        padding: 16,
        borderBottomLeftRadius: 25,
        borderBottomRightRadius: 25,
        shadowColor: "#000",
        shadowOpacity: 0.08,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 5,
        elevation: 3,
    },
    imageBox: {
        height: 200,
        backgroundColor: "#f2f2f2",
        borderRadius: 12,
        alignItems: "center",
        justifyContent: "center"
    },
    imageText: {
        color: "#555",
        fontSize: 16,
    },
    preview: {
        width: "100%",
        height: "100%",
        borderRadius: 12,
    },
    captionInput: {
        borderWidth: 1,
        borderColor: "#ddd",
        borderRadius: 12,
        padding: 12,
        minHeight: 60,
        textAlignVertical: "top",
        marginTop: 12,
        fontSize: 15,
    },
    postButton: {
        backgroundColor: "#00809D",
        paddingVertical: 12,
        borderRadius: 10,
        alignItems: "center",
        marginTop: 12,
    },
    postText: {
        color: "white",
        fontSize: 16,
        fontWeight: "600",
    },

});