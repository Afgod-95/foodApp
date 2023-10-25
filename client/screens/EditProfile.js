import React, { useEffect, useState} from 'react'
import { View, Text, SafeAreaView, Pressable, Image, TouchableOpacity, StyleSheet, Dimensions, Platform, TextInput} from 'react-native'
import { EvilIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';

const EditProfile = ({ route }) => {
    const navigate = useNavigation()
    const updatedImage = route.params?.updatedImage || ''
    const updatedUserName = route.params?.username || ''
    const [image, setImage] = useState(updatedImage);
    const [userName, setUserName] = useState(updatedUserName)
    
    const pickImage = async () => {
      // No permissions request is necessary for launching the image library
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });
  
      console.log(result);
  
      if (!result.canceled) {
        setImage(result.assets[0].uri);
      }
    };

    
    //saving image 
    const saveImage = async () => {
      await AsyncStorage.setItem('userProfileImage', image);
      await AsyncStorage.setItem('username', userName)
      navigate.navigate('Profile', { updatedImage: image, username: userName});
    }


    useEffect(() => {
      if (updatedImage){
        AsyncStorage.getItem('userProfileImage').then(savedImage => {
          if(savedImage){
            setImage(savedImage)
          }
        })
      }
      if (updatedUserName){
        AsyncStorage.getItem('username').then(savedUserName => {
          if(savedUserName){
            setUserName(savedUserName)
          }
        })
      }
      
    },[])
  
  return (
    <SafeAreaView style = {styles.container} >
      <View style = {styles.innerContainer}>
        <View style = {{margin: 20, flexDirection: 'row', alignItems: 'center',}}>
          <TouchableOpacity onPress={() => saveImage()}>
            <EvilIcons name="close" size={24} color="#f2f2f2"  />
          </TouchableOpacity>
          <Text style ={styles.headerText}>Edit Profile</Text>
        </View>
      </View>
      
      <View
        style = {{margin: 20, flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
        <View style = {{ flexDirection: 'column', alignItems: 'center', gap: 20}}>
          
            <View>
              <Image 
                source={{
                uri: image || 'https://www.pngitem.com/pimgs/m/150-1503945_transparent-user-png-default-user-image-png-png.png'
                }}
                style={styles.image}
              />
               
              <Pressable onPress={()=>pickImage()}
                style = {
                  {
                    
                    alignItems: 'center',
                    justtifyContent: 'center',
                    position: 'absolute', 
                    right: 0, 
                    bottom: -5, 
                    backgroundColor: '#d106a2', 
                    width: 50, 
                    height: 50, 
                    borderRadius: 50 
                  }
                }>
                <EvilIcons name="camera" size={35} color="white" 
                  style = {{
                    textAlign: 'center',
                    top: 10
                  }}
                />
              </Pressable>
                
            </View>
                
            <TextInput 
                value= {userName}
                onChange={() => {}}
                style = {styles.input} 
                onChangeText={(text)=> setUserName(text)}               
            />
        </View>
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
    marginTop: 25,
    justifyContent: 'space-between',
    zIndex: 1,
  },

  pressables: {
    margin: 20
  },
  image: {
    width: 150,
    height:150,
    borderRadius: 75,
  },

  headerText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginHorizontal: 120,
  },
  
  input: {
    fontSize: 35,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    width: 350,
    height: 50,
    borderBottomWidth: .5,
    borderColor: '#acadac'
  },
  
})


export default EditProfile
