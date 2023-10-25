import React, { useState } from 'react'
import { useNavigation } from '@react-navigation/native'
import { Image, KeyboardAvoidingView, Platform, SafeAreaView, StyleSheet, Text, TextInput, TouchableOpacity, View, Alert} from 'react-native'
import axios from 'axios'
import {  FontAwesome5 } from '@expo/vector-icons';

const Register = () => {

  const [user, setUser] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  })

  const handleRegister = async () => {
    const { name, email, password, confirmPassword} = user
    if (password !== confirmPassword){
      Alert.alert('Password mismatch')
    }
    try{
      const data = await axios.post('http://192.168.18.123:8000/auth/register', {
        name: name,
        email: email,
        password: password
      })
      if (data.error){
        console.log(data.error)
        Alert.alert(data.error)
      }
      else{
        Alert.alert('Registraion successful')
        setUser({
          name: '',
          email: '',
          password: '',
          confirmPassword: ''
        })
      }
    }
    catch (error){ 
      Alert.alert('An error occured whilst registering')
      console.log(`Error: ${error.message}`)
    }
  }


  const navigation= useNavigation()
    

  const handleSignIn = () => {
    // Navigate to the "register" screen
    navigation.navigate('Login');
  };
 

  return (
    <SafeAreaView style = {styles.container}>
      <KeyboardAvoidingView 
          style={styles.innerContainer} 
          behavior= {Platform.OS === 'ios' ? 'padding' : 'height'}>
          
          <Text style ={styles.headerText}>Sign up for free</Text>
          <View style ={styles.displayBox}>
            <Image 
              style={{ width: 30, height: 30, marginLeft: 30}}
              source={{
                uri:
                  'https://static-00.iconduck.com/assets.00/google-icon-2048x2048-czn3g8x8.png',
              }}
            />
            <Text style ={{color: '#fff', fontSize: 18, fontWeight: 'bold'}}>Sign up with Google</Text>
          </View>

          <View style ={styles.displayBox}>
            <FontAwesome5 name="facebook" size={35} color="#fff"  style={{ width: 35, height: 37, marginLeft: 30}}/>
            <Text style ={{color: '#fff', fontSize: 18, fontWeight: 'bold'}}>Sign up with Facebook</Text>
          </View>

          <View style ={styles.combineLine}>
            <View style = {styles.lines}></View>
            <Text style={{fontSize: 20, color: '#fff'}}>or</Text>
            <View style = {styles.lines}></View>
          </View>

          <Text style ={styles.smallText}>Sign up with your email address</Text>
          <View style ={styles.inputBox}>
            <TextInput 
              value= {user.name}
              onChangeText = {(text) => setUser({...user, name: text})}
              keyboardType='text'
              placeholder='Username'
              secureTextEntry = {false}
            />
          </View>
          <View style ={styles.inputBox}>
            <TextInput 
              value= {user.email}
              onChangeText = {(text) => setUser({...user, email: text})}
              keyboardType='email-address'
              placeholder='Enter your email address'
              secureTextEntry = {false}
            />
          </View>
          <View style = {styles.inputBox}>
              <TextInput 
                value= {user.password}
                onChangeText = {(text) => setUser({...user, password: text})}
                placeholder='Enter your password'
                secureTextEntry = {true}
              />
          </View>
          <View style = {styles.inputBox}>
              <TextInput 
                value= {user.confirmPassword}
                onChangeText = {(text) => setUser({...user, confirmPassword: text})}
                placeholder='Confirm your password'
                secureTextEntry = {true}
              />
          </View>
          <TouchableOpacity 
            style={styles.button}
            onPress={handleRegister}>
            <Text style = {{fontSize: 18, color: '#fff', fontWeight: 'bold'}}>Sign up</Text>
          </TouchableOpacity>
      
          <TouchableOpacity 
            onPress = {handleSignIn}
            style= {{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5, margin: 15}}>
            <Text style = {{fontSize: 15, color: '#e6dae5'}}>Already have an account?</Text>
            <Text style = {{fontSize: 18, color: '#fff', }}>Login up here</Text>
          </TouchableOpacity>
        </KeyboardAvoidingView>
    </SafeAreaView>
    
  )
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },

  innerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerText: {
    color: 'white',
    fontSize: 40,
    margin: 15,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  smallText: {
    color: 'white',
    fontSize: 20,
    marginBottom: 10,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  displayBox: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-start',
    flexDirection: 'row',
    gap: 35,
    margin: 10,
    width: 350,
    height: 50,
    backgroundColor: 'transparent',
    borderWidth: .5,
    borderColor: '#acadac',
    borderRadius: 20,
    padding: 10,
  },
  inputBox: {
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'row',
    gap: 3,
    margin: 15,
    width: 350,
    height: 50,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 10,
  },
  input: {
    fontSize: 15,
    color: 'gray',
  },
  lines: {
    width: 100,
    height: 1,
    backgroundColor: '#fff',
  },

  combineLine: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 5,
    margin: 10
  },

  button: {
    margin: 15,
    width: 350,
    height: 50,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f743ee',
    borderRadius: 20,
    padding: 10,
  }
  
});

export default Register
