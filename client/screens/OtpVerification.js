import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Pressable, Image, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AntDesign } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios'

const OtpVerification = (route) => {
    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const navigate = useNavigation()
    const email  = route.params
    
    //function to checkOtpVerification
    const handleOTPVerification = async () => {
        const { verificationCode } = otp
        try{
          const response = await axios.post('https://restaurantapi-bsc7.onrender.com/auth/otpVerification', {
              enteredCode: verificationCode, 
              email: email
          })

          if(response.data.error){
              Alert.alert(response.data.error)
              console.log(response.data.error)
          }

          else if (response.status === 200){
            Alert.alert(response.data.message)
            navigate.navigate('Main')
          }
        }
        catch(error){
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

    
    //function to handle goBack navition
    const handleGoBack = () => {
        navigate.goBack()
    }
    const refs = Array(6).fill().map((_, i) => React.createRef());

    const handleOTPEnter = (text, index) => {
        if (text === "") {
          // Handle delete key press
          const updatedOtp = [...otp];
          updatedOtp[index] = text;
          setOtp(updatedOtp);
      
          // Move focus to the previous input box if available
          if (index > 0) {
            const prevRef = refs[index - 1];
            if (prevRef && prevRef.current && prevRef.current.focus) {
              prevRef.current.focus();
            }
          }
        } else {
          // Handle numeric digit input
          const updatedOtp = [...otp];
          updatedOtp[index] = text;
          setOtp(updatedOtp);
      
          // Move focus to the next input box if available
          if (index < refs.length - 1) {
            const nextRef = refs[index + 1];
            if (nextRef && nextRef.current && nextRef.current.focus) {
              nextRef.current.focus();
            }
          }
        }
    };
      
      

  return (
    <SafeAreaView style={styles.container}>
        <View style = {{margin: 20, }}>
            <Pressable 
                onPress={handleGoBack}
                style = {
                    {flexDirection: 'row', alignItems: 'center', gap: 8, marginTop : -10}
                }
            >
                <AntDesign name="left" size={18} color="#acadac" />
                <Text style = {{color: '#acadac', fontSize: 20}}>Sign up</Text>
            </Pressable>

            <Text style = {{color: '#fff', fontWeight: 'bold', fontSize: 30, textAlign: 'center', marginTop: 20}}>OTP Verification </Text>
            <View style = {{alignItems: 'center', justifyContent: 'center', marginVertical: 15}}>
                <Image style = {styles.image}
                    source = {{
                        uri: 'https://img.freepik.com/free-vector/private-data-concept-illustration_114360-5003.jpg?w=740&t=st=1698505904~exp=1698506504~hmac=d19076e5d152d78a9f4cb3f763acd182eeb0daeaea1bce4bcc4a14f2fdaa1243'
                    }}
                
                />
            </View>
            
            <Text style = {{color: '#acadac', fontSize: 18, textAlign: 'center', marginBottom: 15}}>
                Please enter the 6-digit verification code sent to your email address. 
            </Text>
            <View style = {styles.inputBoxes}>
                {otp.map((digit, index) => (
                    <TextInput
                        key={index}
                        value={digit}
                        onChangeText={(text) => handleOTPEnter(text, index)}
                        maxLength={1}
                        keyboardType="numeric"
                        ref={refs[index]}
                        style={styles.inputBox}
                    />
                ))}
            </View>

            <View style = {{alignItems: 'center', justifyContent: 'center', marginVertical: 15}}>
                <Pressable style={styles.button} onPress={handleOTPVerification}>
                    <Text style = {{fontSize: 18, color: '#fff', fontWeight: 'bold', textAlign: 'center'}}>Verify</Text>
                </Pressable>   
            </View>
        </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000'
  },
  image: {
    flexShrink: 0,
    width: 150,
    height: 150,
    margin: 5,
    borderRadius: 80,
  },
  inputBoxes: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 7,
  },
  inputBox: {
    width: 50,
    height: 50,
    color: '#acadac',
    borderWidth: .5,
    borderColor: '#acadac',
    textAlign: 'center',
    fontSize: 20,
    borderRadius: 10
  },

  button: {
    width: 250,
    height: 45,
    marginTop: 10,
    backgroundColor: '#f743ee',
    borderRadius: 20,
    padding: 10,
  }
});

export default OtpVerification;
