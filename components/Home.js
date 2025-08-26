import {
  View,
  Text,
  ImageBackground,
  StyleSheet,
  TouchableOpacity,
  Image,
  TextInput,
  ScrollView,
  Modal
} from 'react-native';
import React, { useEffect, useState } from 'react';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ImagePicker from 'react-native-image-crop-picker';

const Home = () => {
  const [user, setUser] = useState(null);
  const [image, setImage] = useState(null);
  const [caption, setCaption] = useState("");
  const [posts, setPosts] = useState([]);

  const userinfo = async () => {
    const storedUser = await AsyncStorage.getItem("user");
    setUser(JSON.parse(storedUser));
  };

  const opengallery = () => {
    ImagePicker.openPicker({
      cropping: true,
      height: 300,
      width: 300
    }).then((image) => {
      setImage(image.path);
    });
  };

  const handlepost = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) return alert("Please login first.");
      if (!image) return alert("Please select an image");

      const formData = new FormData();
      formData.append("image", {
        uri: image,
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
        alert("Post uploaded ✅");
        setCaption("");
        setImage(null);
        fetchPosts();
      } else {
        alert(data.message || "Something went wrong ❌");
      }
    } catch (error) {
      console.error("Error uploading post:", error);
      alert("Network error ❌");
    }
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

  useEffect(() => {
    userinfo();
    fetchPosts();
  }, []);

  return (
    <View style={{ flex: 1, backgroundColor: "white" }}>
      <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>

        {/* Banner Section */}
        <ImageBackground
          source={require('./assets/ghost.jpg')}
          style={style.imageBanner}
        >
          <View style={style.overlay}>
            {user ? (
              <>
                <Text style={style.welcome}>Welcome, {user.username} 👋</Text>
                <Text style={style.email}>{user.email}</Text>
              </>
            ) : (
              <Text style={style.welcome}>Guest</Text>
            )}
            <Text style={style.tagline}>Enjoy this App by interacting with people</Text>
            <Text style={style.createPost}>Create Exciting Posts 🚀</Text>
          </View>
        </ImageBackground>

        {/* Create Post Section */}
        <View style={style.card}>

          <TouchableOpacity style={style.imageBox} onPress={opengallery}>
            {image ? (
              <Image source={{ uri: image }} style={style.preview} />
            ) : (
              <View style={{ alignItems: "center" }}>
                <Text style={{ fontSize: 28 }}>📷</Text>
                <Text style={style.imageText}>Tap to Select Image</Text>
              </View>
            )}
          </TouchableOpacity>

          <TextInput
            style={style.captionInput}
            placeholder="Write a caption..."
            value={caption}
            onChangeText={setCaption}
            multiline
          />

          <TouchableOpacity style={style.postButton} onPress={handlepost}>
            <Text style={style.postText}>Post</Text>
          </TouchableOpacity>
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

            {/* Image */}
            <Image
              source={{ uri: `http://10.0.2.2:5000${item.imageurl}` }}
              style={style.postImage}
            />

            {/* Caption */}
            <Text style={style.postCaption}>{item.caption}</Text>
            <View style={style.separator} />

            {/* Actions */}
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
                  <View key={index} style={{ marginBottom: 10 }}>
                    <Text style={{ fontWeight: "bold" }}>{comment.user?.username || "User"}</Text>
                    <Text>{comment.text}</Text>
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
    height: hp(22),
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
  welcome: { fontSize: hp(3), fontWeight: 'bold', color: '#fff' },
  email: { fontSize: hp(1.8), color: '#eee', marginTop: 5 },
  tagline: { fontSize: hp(1.6), color: '#ddd', marginTop: 12 },
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
    backgroundColor: "#ece5e5ff",
    padding: 19,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
    marginBottom: 20,

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
