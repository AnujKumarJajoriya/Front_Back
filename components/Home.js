import {
  View,
  Text,
  ImageBackground,
  StyleSheet,
  TouchableOpacity,
  Image,
  TextInput,
  ScrollView,
  Modal,
  BackHandler,
  FlatList
} from 'react-native';
import React, { useEffect, useState } from 'react';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ImagePicker from 'react-native-image-crop-picker';
import moment from 'moment';
import { useFocusEffect, useNavigation } from '@react-navigation/native';

const Home = ({ navigation }) => {

  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);

  const userinfo = async () => {
    const storedUser = await AsyncStorage.getItem("user");
    setUser(JSON.parse(storedUser));
  };



  const fetchPosts = async () => {
    const token = await AsyncStorage.getItem("token");
    const res = await fetch("http://10.0.2.2:5000/posts", {
      headers: { Authorization: `Bearer ${token}` }
    });
    const data = await res.json();
    setPosts(data);
  };



  const handleLike = async (postid) => {
    const token = await AsyncStorage.getItem("token");
    const res = await fetch(`http://10.0.2.2:5000/posts/${postid}/like`, {
      method: "Post",
      headers: { Authorization: `Bearer ${token}` }
    });
    const data = await res.json();
    fetchPosts()

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
    fetchPosts();
    setSelectedPost(data.post);
  }


  const [allusers, setallusers] = useState([])
  const fetchusers = async () => {
    const token = await AsyncStorage.getItem("token");
    const res = await fetch("http://10.0.2.2:5000/allusers", {
      headers: { Authorization: `Bearer ${token}` }
    });
    const data = await res.json();

    if (user) {
      const sorted = data.sort((a, b) =>
        a._id === user.id ? -1 : b._id === user.id ? 1 : 0
      );
      setallusers(sorted);
    } else {
      setallusers(data);
    }
  };


  useEffect(() => {
    const loadingallparts = async () => {

      await userinfo();
      await fetchPosts();
    
    }

    loadingallparts()

  }, []);


  useEffect(()=>{
    if (user) {
        fetchusers()
    }
  },[user])

  useFocusEffect(
    React.useCallback(() => {
      fetchPosts();   // 🔄 refresh posts every time Home is focused
    }, [])
  );

  // 🏠 Refresh when Home tab is pressed
  useEffect(() => {
    const unsubscribe = navigation.addListener("tabPress", () => {
      fetchPosts();
    });
    return unsubscribe;
  }, [navigation]);

  return (
    <View style={{ flex: 1, backgroundColor: "white" }}>
      <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>

        <View style={{ justifyContent: "flex-start", alignItems: "flex-start", marginLeft: 5, marginTop: 15 }}>


          <FlatList
            data={allusers}
            keyExtractor={(item) => item._id}   // ✅ unique id from MongoDB
            horizontal
            showsHorizontalScrollIndicator={false}
            ListEmptyComponent={
              <Text style={{ marginLeft: 20, color: "#666" }}></Text>
            }
            renderItem={({ item }) => {
              const isCurrentUser = item._id === user?.id;
              return (
                <View style={{ alignItems: "center", marginHorizontal: 10 }}>

                  {/* Avatar */}
                  <View style={[{
                    width: 70,
                    height: 70,
                    borderRadius: 35,
                    justifyContent: "center",
                    alignItems: "center",
                  }, isCurrentUser
                    ? { borderWidth: 7, borderColor: "#FF5733" } // 🔥 Highlight border
                    : { borderWidth: 2.5, borderColor: "#00809D" }]}>
                    <View style={{
                      width: 62,
                      height: 62,
                      borderRadius: 40,
                      backgroundColor: "#230909ff",
                      justifyContent: "center",
                      alignItems: "center",
                    }}>
                      <Text style={{ color: "#fff", fontWeight: "bold", fontSize: 26 }}>
                        {item.username ? item.username[0].toUpperCase() : "?"}
                      </Text>
                    </View>
                  </View>

                  {/* Username */}
                  <Text style={{ fontSize: 14, fontWeight: "600", color: "#333", marginTop: 5 }}>
                    {item.username}
                  </Text>
                </View>
              )
            }}
          />
        </View>


        <Text style={{ fontSize: hp(2), fontWeight: 'bold', color: '#000000ff', marginTop: 25, marginLeft: 15 }}>Here is a collection of Posts</Text>
        {/* Posts Feed */}
        {posts.map((item) => (
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
              source={{ uri: `http://10.0.2.2:5000${item.imageurl}` }}
              style={{ width: "100%", height: 200, borderRadius: 10 }}
              resizeMode="cover"
            />
            <Text style={{ marginTop: 5, fontWeight: "bold", marginBottom: 5, marginLeft: 3 }}>{item.caption}</Text>

            <View style={style.separator} />

            <View style={style.postActions}>
              <TouchableOpacity onPress={() => handleLike(item._id)}><Text style={style.actionText}> {item.likes?.includes(user?.id) ? "💔 Unlike" : "❤️ Like"} {item.likes?.length || 0}</Text></TouchableOpacity>
              <TouchableOpacity onPress={() => {
                setSelectedPost(item);
                setShowCommentModal(true);
              }}><Text style={style.actionText}>💬 {item.comments?.length || 0} Comments</Text></TouchableOpacity>
            </View>



          </View>
        ))}
      </ScrollView>


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
    </View>
  );
};

export default Home;

const style = StyleSheet.create({
  imageBanner: {
    width: wp('100%'),
    height: wp(28),
    justifyContent: "flex-start",
    alignItems: "flex-start",
    overflow: "hidden",
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.70)',
    justifyContent: 'center',
    padding: 20,
  },
  welcome: { fontSize: hp(2.2), fontWeight: 'bold', color: '#fff' },
  email: { fontSize: hp(1.5), color: '#eee', marginTop: 5 },
  tagline: { fontSize: hp(1.5), color: '#ddd', marginTop: 12 },
  createPost: { fontSize: hp(2), fontWeight: 'bold', color: '#fff', marginTop: 5 },

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
  postActions: { flexDirection: "row", justifyContent: "space-around", marginTop: 10 },
  actionText: { fontSize: 15, color: "#00809D", fontWeight: "500", fontWeight: "bold" },

  separator: {
    height: 1,
    backgroundColor: "#c2bebeff",
    marginBottom: 3
  },
});
