import { useNavigation } from '@react-navigation/native'
import React, { useState } from 'react'
import { Image, KeyboardAvoidingView, Platform, SafeAreaView, StyleSheet, Text, TextInput, TouchableOpacity, View, Alert } from 'react-native'
import {  FontAwesome5 } from '@expo/vector-icons';
import axios from 'axios'
import AsyncStorage from '@react-native-async-storage/async-storage';

const Login = () => {

  const [user, setUser] = useState({
    email: '',
    password: ''
  })
  const navigation= useNavigation()


  const handleLogin = async () => {
    const { email, password } = user
    try{
      const response = await axios.post('https://restaurantapi-bsc7.onrender.com/auth/login', {
        email: email,
        password: password,
      })
      const token = response.data.token
      
      if(response.data.error){
        console.log(response.data.error)
        Alert.alert(response.data.error)
      }
      else if (response.status === 200){
        console.log(token)
        console.log('An error occured')
        AsyncStorage.setItem('authToken', token)
        navigate.replace('Main')
      }
    }
    catch(error) {
      if (error.response) {
        console.log(error.response.data);
        Alert.alert(error.response.data.error);
      } else if (error.request) {
        console.log('Request made but no response received.');
      } else {
        console.log('Error:', error.message);
        Alert.alert('An error occurred while registering');
      }
    }
  }

  const handleSignUp = () => {
    navigation.navigate('Register');
  };
  

  return (
    <SafeAreaView style = {styles.container}>
      <KeyboardAvoidingView 
          style={styles.innerContainer} 
          behavior= {Platform.OS === 'ios' ? 'padding' : 'height'}>
          
          <Text style ={styles.headerText}>Welcome Back</Text>
          <View style ={styles.displayBox}>
            <Image 
              style={{ width: 30, height: 30, marginLeft: 30}}
              source={{
                uri:
                  'https://static-00.iconduck.com/assets.00/google-icon-2048x2048-czn3g8x8.png',
              }}
            />
            <Text style ={{color: '#fff', fontSize: 18, fontWeight: 'bold'}}>Continue with Google</Text>
          </View>

          <View style ={styles.displayBox}>
            <FontAwesome5 name="facebook" size={35} color="#fff"  style={{ width: 35, height: 37, marginLeft: 30}}/>
            <Text style ={{color: '#fff', fontSize: 18, fontWeight: 'bold'}}>Continue with Facebook</Text>
          </View>

          

          <View style ={styles.combineLine}>
            <View style = {styles.lines}></View>
            <Text style={{fontSize: 20, color: '#fff'}}>or</Text>
            <View style = {styles.lines}></View>
          </View>

          <Text style ={styles.smallText}>Sign in with your email address</Text>
          
          <TextInput 
            value= {user.email}
            onChangeText = {(text) => setUser({...user, email: text })}
            keyboardType='email-address'
            placeholder='Enter your email address'
            label = "Email"
            secureTextEntry = {false}
            style = {styles.inputBox}
          />
        
          <TextInput 
            value= {user.password}
            onChangeText = {(text) => setUser({...user, password: text})}
            placeholder='Enter your password'
            Label = "Password"
            secureTextEntry = {true}
            style = {styles.inputBox}
          />
          <TouchableOpacity 
            style={styles.button}
            onPress={handleLogin}
          >
            <Text style = {{fontSize: 18, color: '#fff', fontWeight: 'bold'}}>Login</Text>
          </TouchableOpacity>
         
          <View style= {{display: 'flex', flexDirection: 'column', alignItems: 'center', margin: 15}}>
            <Text style = {{fontSize: 18, color: '#fff', textAlign: 'center'}}>Forgot your Password?</Text>
          </View>

          <TouchableOpacity 
            onPress = {handleSignUp}
            style= {{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5, margin: 15}}>
            <Text style = {{fontSize: 15, color: '#e6dae5'}}>Don't have an account?</Text>
            <Text style = {{fontSize: 18, color: '#fff', }}>Sign up here</Text>
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
    gap: 3,
    margin: 15,
    width: 350,
    height: 50,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 10,
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



export default Login
