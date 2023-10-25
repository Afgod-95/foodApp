import React from 'react'
import { View, Text, StyleSheet, TouchableWithoutFeedback } from 'react-native'
import { AntDesign } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';


const SearchQuery = () => {
    const navigate = useNavigation()

  return (
    <TouchableWithoutFeedback onPress = {() => navigate.navigate('QueryScreen')} >
      <View style ={styles.inputBox} >
        <AntDesign name="search1" size={24} color="#acadac" style = {{position: 'absolute', left: 12}}/>
        <View style = {styles.input}>
          <Text style = {{color: '#acadac'}}>Search...</Text>
        </View>
      </View>
    </TouchableWithoutFeedback>
    
  )
}

const styles = StyleSheet.create({
    inputBox: {
        display: 'flex',
        alignItems: 'center',
        flexDirection: 'row',
        width: 280,
        height: 45,
        backgroundColor: 'transparent',
        borderWidth: .5,
        borderColor: '#acadac',
        borderRadius: 20,
        padding: 10,
    },
    input: {
        fontSize: 15,
        color: 'gray',
        paddingLeft: 40
    },
    
  })

export default SearchQuery

