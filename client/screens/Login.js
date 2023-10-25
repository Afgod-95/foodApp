import { useNavigation } from '@react-navigation/native'
import React, { useState } from 'react'
import { Image, KeyboardAvoidingView, Platform, SafeAreaView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import {  FontAwesome5 } from '@expo/vector-icons';

const Login = () => {

  const [email, setEmail] = useState('')
  const navigation= useNavigation()
  const [password, setPassword] = useState('')

  const handleSignUp = () => {
    // Navigate to the "register" screen
    navigation.navigate('Register');
  };
  const handleSubmit = async () => {

      navigation.replace('Main')
  }

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
          <View style ={styles.inputBox}>

              <TextInput 
                value= {email}
                onChangeText = {(text) => setEmail(text)}
                keyboardType='email-address'
                placeholder='Enter your email address'
                secureTextEntry = {false}
              />
          </View>
          <View style = {styles.inputBox}>
            <TextInput 
              value= {password}
              onChangeText = {(text) => setPassword(text)}
              placeholder='Enter your password'
              secureTextEntry = {true}
            />
          </View>
          <TouchableOpacity 
            style={styles.button}

            onPress={handleSubmit}>
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



export default Login
