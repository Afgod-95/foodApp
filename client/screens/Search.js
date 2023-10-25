import React, { useState } from 'react'
import { View, SafeAreaView, Text, StyleSheet, KeyboardAvoidingView  } from 'react-native'
import {  Ionicons } from '@expo/vector-icons';




const Search = () => {
  const [query, setQuery] = useState('')
  return (
    <SafeAreaView style = {styles.container}>
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style = {styles.innerContainer}>
          <View style = {styles.top}>
            <SearchQuery />
            <TouchableOpacity>
              <LinearGradient
                colors={['purple', 'transparent']}  
                start={{ x: .8, y: 0 }}
                end={{ x: .8, y: 1 }}
                style={styles.gradientBorder}
              >
                <Image
                  source={{
                    uri: 'https://newprofilepic.photo-cdn.net//assets/images/article/profile.jpg?90af0c8'
                  }}
                  style={styles.image}
                />
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>
       
        <View style ={{flexDirection: 'row', flexWrap: 'wrap', }}>
          <View style = {styles.filter}>
            
            <Text>Category</Text>
          </View>
          <View style = {styles.filter}>
            
            <Text>Filter By: </Text>
          </View>

        </View>
        
          <ScrollView vertical 
            showsVerticalScrollIndicator={true}
          >
            <View 
              style ={
                {flexDirection: 'row', 
                flexWrap: 'wrap', 
                alignItems: 'center', 
                justifyContent:'center', 
                gap: 15,
                
                backgroundColor: '#fff'
                
              }}>
              {List.map((item, index) => {
                return(
                  <TouchableOpacity key = {index}
                    onPress={() => handleSelectedItem(item)}
                  >
                    <ProductCard 
                      image = {item.productImage}
                      productName={item.productName}
                      price={item.price}
                      {...item}
                    />
                  </TouchableOpacity>
                )
              })}
              </View>
            
          </ScrollView>
        
    </KeyboardAvoidingView>
  </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    marginTop: 25
  },
  inputBox: {
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'row',
    gap: 3,
    margin: 15,
    width: 350,
    height: 40,
    border: 3,
    borderRadius: 15,
    padding: 10,
  },

  input: {
    fontSize: 15,
    color: 'gray',
  },
});


export default Search
