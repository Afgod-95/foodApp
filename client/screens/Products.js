import React, { useState, useRef} from 'react'
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Image, KeyboardAvoidingView,  ScrollView, Picker} from 'react-native'
import {  SafeAreaView } from 'react-native-safe-area-context'
import { LinearGradient } from 'expo-linear-gradient'
import List from '../data/List';
import ProductCard from '../components/ProductCard';
import { useNavigation } from '@react-navigation/native';
import SearchQuery from '../components/SearchQuery';
import Avatar from '../components/Avatar';

const Products = () => {

  const navigate = useNavigation()

  const handleSelectedItem = (item) => {
    navigate.navigate('ItemDetails', {
      product: item.productName,
      image: item.productImage,
      price: item.price,
      quantity: item.quantity,
      desc: item.desc,
      rate: item.rate,
    })
  }
  return (
    <SafeAreaView style = {styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View style = {styles.innerContainer}>
            <View style = {styles.top}>
              <SearchQuery />
              <Avatar />
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
    backgroundColor: '#fff',
  },

  innerContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#2e2d2d',
    marginBottom: 15
    
  },

  headerText: {
    color: 'white',
    fontSize: 28,
    fontWeight: 'bold',
  },
  top:{
    margin: Platform.OS === 'ios' ? 25 : 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 15,
    alignItems: 'center',
  },
  filter: {
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'row',
    marginLeft: 20,
    marginBottom: 15,
    width: 150,
    height: 40,
    backgroundColor: '#F2F2F2',
    borderRadius: 15,
    padding: 10,
  },
  
})

export default Products
