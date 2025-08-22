import { View, Text, ImageBackground, StyleSheet, TouchableOpacity, Image, TextInput, FlatList, ScrollView } from 'react-native'
import React, { useEffect, useState } from 'react'
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
  }




  const opengallery = () => {
    ImagePicker.openPicker({
      cropping: true,
      height: 300,
      width: 300
    }).then((image) => {
      setImage(image.path)
    })
  }


  const handlepost = async () => {
    try {


      const token = await AsyncStorage.getItem("token");
      if (!token) return alert("Please login first.");
      if (!image) return alert("Please select an image");


      const formData = new FormData();
      formData.append("image", {
        uri: image,
        type: "image/jpeg", // or "image/png"
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
    setPosts(data)
  }


  useEffect(() => {
    userinfo()
    fetchPosts()
  }, [])
  return (
    <View style={{flex:1}}>
      
   <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>

      <View style={{ flexDirection: "row", justifyContent: "center", alignItems: "center" }}>
        <ImageBackground
          source={require('./assets/ghost.jpg')}
          style={style.imageBanner}

        >
          <View style={{ backgroundColor: 'rgba(0, 0, 0, 0.6)', borderRadius: hp(2), ...StyleSheet.absoluteFillObject, justifyContent: "center" }}>


            {user ? (
              <>
                <Text style={{
                  fontSize: hp(2.5), color: 'white', fontWeight: 'bold', marginLeft: hp(2.2), marginTop: hp(1.2)
                }}>
                  Welcome, {user.username} 👋
                </Text>
                <Text style={{
                  fontSize: hp(1.7), color: 'white', fontWeight: 'bold', marginLeft: hp(2.2), marginTop: hp(0.2)
                }}>{user.email}</Text>

              </>
            ) : (
              <Text style={{ fontSize: 18 }}>Guest</Text>
            )}

            <Text style={{
              fontSize: hp(1.5), color: 'white', fontWeight: 'bold', marginLeft: hp(2.2), marginTop: hp(1.2)
            }}>Enjoy this App
            </Text>
            <Text style={{
              fontSize: hp(1.5), color: 'white', fontWeight: 'bold', marginLeft: hp(2.2)
            }}>By Interacting with people
            </Text>
            <Text style={{
              fontSize: hp(2.0), color: 'white', fontWeight: 'bold', marginLeft: hp(2.2), marginTop: hp(0.4)
            }}>Create Exciting Posts
            </Text>

          </View>

        </ImageBackground>


      </View>

      <View style={style.card}>
        {/* Image Picker Box */}
        <TouchableOpacity style={style.imageBox} onPress={opengallery} >
          {image ? (
            <Image source={{ uri: image }} style={style.preview} />
          ) : (
            <Text style={style.imageText}>+ Select Image</Text>
          )}
        </TouchableOpacity>

        {/* Caption */}
        <TextInput
          style={style.captionInput}
          placeholder="Write a caption..."
          value={caption}
          onChangeText={setCaption}
          multiline
        />

        {/* Post Button */}
        <TouchableOpacity style={style.postButton} onPress={handlepost} >
          <Text style={style.postText}>Post</Text>
        </TouchableOpacity>
      </View>
      

     {posts.map((item) => (
    <View key={item._id} style={style.postCard}>
      <Text style={{ fontSize: 12, color: "gray", marginLeft: 10 }}>
        Posted by {item.user?.username || "Unknown"}
      </Text>
      <Image
        source={{ uri: `http://10.0.2.2:5000${item.imageurl}` }}
        style={style.postImage}
      />
      <Text style={style.postcaption}>{item.caption}</Text>
    </View>
  ))}
   
    </ScrollView>
    </View>
  )
}

export default Home


const style = StyleSheet.create({
  imageBanner: {
    width: wp('100%'),
    height: hp(20),
    justifyContent: "flex-start",
    alignItems: "flex-start",
  },

  card: {
    width: ("100%"),
    backgroundColor: "#BBDCE5",
    padding: 16,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 4,
    gap: 12
  },
  imageBox: {
    height: 200,
    backgroundColor: "#f2f2f2",
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center"
  },
  imageText: {
    color: "#000000ff",
    fontSize: 16,

  },
  preview: {
    width: "100%",
    height: "100%",
    borderRadius: 12,
  },
  captionInput: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 12,
    padding: 10,
    minHeight: 60,
    textAlignVertical: "top",
    borderColor: "black",
    borderWidth: 1.5
  },
  postButton: {
    backgroundColor: "#111",
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center"
  },
  postText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
    
  },
  postCard: {
     marginTop: 15,
    marginBottom: 15,
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 10,
    elevation: 2,
  },
  postImage: { width: "100%", height: 200, borderRadius: 10 },
  postcaption: { marginTop: 10, fontSize: 14, marginLeft:10 },


})