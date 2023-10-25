import React, { useCallback, useEffect, useState } from 'react'
import { TouchableOpacity, Image, StyleSheet} from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import { useFocusEffect, useIsFocused, useNavigation } from '@react-navigation/native'
import AsyncStorage from '@react-native-async-storage/async-storage'

const Avatar = () => {
  const navigate = useNavigation()
  const [userImage, setUserImage] = useState('');

  const isFocused = useIsFocused()

    // Retrieve the user's profile image from AsyncStorage
    const getUserImage = async () => {
      try {
        const image = await AsyncStorage.getItem('userProfileImage');
        if (image) {
          setUserImage(image);
        }
      } catch (error) {
        console.log(error)
      }
    };

    useEffect(() => {
      getUserImage()
    }, [])

    useEffect(() => {
      if(isFocused){
        getUserImage()
      }
    }, [isFocused])

    useFocusEffect(
      React.useCallback(() => {
        getUserImage()
      },[])
  )

  return (
    <TouchableOpacity onPress={()=> navigate.navigate('Profile', { updatedImage: userImage })}>
        <LinearGradient
          colors={['purple', 'transparent']}  
          start={{ x: .8, y: 0 }}
          end={{ x: .8, y: 1 }}
          style={styles.gradientBorder}
        >
          <Image
          source={{
              uri: userImage || 'https://www.pngitem.com/pimgs/m/150-1503945_transparent-user-png-default-user-image-png-png.png'
          }}
          style={styles.image}
          />
        </LinearGradient>
    </TouchableOpacity>
  )
}
const styles = StyleSheet.create({
    image: {
      width: 50,
      height: 50,
      borderRadius: 75,
    },
    gradientBorder: {
      width: 60,
      height: 60,
      borderRadius: 75,  
      padding: 5,         
      justifyContent: 'center',
      alignItems: 'center',
    },
})

export default Avatar
