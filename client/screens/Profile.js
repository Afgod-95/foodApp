import React, { useEffect, useState} from 'react'
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, Pressable, Image} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Ionicons, AntDesign} from '@expo/vector-icons';
import { useFocusEffect, useNavigation, useRoute } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';


const Profile = () => {
  const navigate = useNavigation()
  const route = useRoute()
  const routeUpdatedImage  = route.params?.updatedImage || ''
  const routeUpdatedUserName  = route.params?.username || ''
  
  const [image, setImage] = useState(routeUpdatedImage)
  const [username, setUsername] = useState(routeUpdatedUserName)

  //retrieving image and userName
  useEffect(() => {
    if (routeUpdatedImage){
      setImage(routeUpdatedImage)
    }
  },[routeUpdatedImage])

  //getting username
  const getUserName = async () => {
    try {
      const user = await AsyncStorage.getItem('username');
      if (user) {
        setUsername(user);
      }
      console.log(image)
    } catch (error) {
      // Handle any errors
      console.log(error)
    }
  };

  useEffect(() => {
    getUserName()
  }, [])

  useFocusEffect(
    React.useCallback(() => {
      getUserName()
    },[])
  )

  
  return (
    <SafeAreaView style = {styles.container}>
      <View style = {styles.innerContainer}>
        <View style = {{width: '90%', margin: 20, flexDirection: 'row', alignItems: 'center', position: 'absolute'}}>
          <TouchableOpacity onPress={() => navigate.goBack()}>
            <Ionicons name="arrow-back" size={24} color="#f2f2f2"  />
          </TouchableOpacity>
          <Text style ={styles.headerText}>Profile</Text>
        </View>
      </View>
      
      <Pressable onPress={() => navigate.navigate('EditProfile', {updatedImage: image, username: username})}
      style = {{margin: 20, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}}>
        <View style = {{ flexDirection: 'row', alignItems: 'center', gap: 20}}>
          <Image 
            source={{
              uri: image || 'https://www.pngitem.com/pimgs/m/150-1503945_transparent-user-png-default-user-image-png-png.png' 
            }}
            style={styles.image}
          />
          <View>
            <Text style = {styles.text}>{username}</Text>
            <Text style = {{color: '#acadac', fontSize: 14}}>View Profile</Text>
          </View>
        </View>
        <AntDesign name="right" size={10} color="#acadac" />
      </Pressable>
      
      <View style = {styles.pressables}>
        <Text style = {styles.text}>Account</Text>
        <Pressable style = {{marginTop: 20}}>
          <Text style = {styles.text}>Email</Text>
          <Text style = {{color: '#acadac', fontSize: 14}}>afgod98@gmail.com</Text>
        </Pressable>

        <Pressable style = {{marginTop: 20}} onPress = {()=> navigate.navigate('Login')}>
          <Text style = {styles.text}>Log out</Text>
          <Text style = {{color: '#acadac', fontSize: 14}}>You are logged in as Afgod</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },

  innerContainer: {
    backgroundColor: '#2e2d2d',
    width: Dimensions.get('window').width,
    height: 60,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },

  pressables: {
    margin: 20
  },
  image: {
    width: 60,
    height: 60,
    borderRadius: 75,
  },

  headerText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginHorizontal: 120,
  },
  
  text: {
    fontSize: 20,
    color: '#fff',
    fontWeight: 'bold',
    marginTop: 5,
    
  },
  
})


export default Profile

