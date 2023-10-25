import React, { useState } from 'react'
import { SafeAreaView, View, Text, StyleSheet, Image, TouchableOpacity, Button, Pressable, ScrollView } from 'react-native'
import { Ionicons } from '@expo/vector-icons';
import StarRating from './StarRating';
import { useNavigation, useRoute } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { useDispatch } from 'react-redux';
import { addToCart } from '../redux/cartReducer';

const ItemScreen = () => {
    const navigate = useNavigation()
    const route = useRoute()
    const dispatch = useDispatch()
    const {id, image, product, price, quantity, desc, rate } = route.params
    const [buttonClicked, setButtonClicked] = useState(false)
    
    const goBackButton = () => {
      navigate.goBack()
    }

   const addItemToCart = (item) => {
      setButtonClicked(true)
   }

  return (
    <SafeAreaView style = {styles.container} >
        <View style = {styles.innerContainer}>
            <View style = {{flexDirection: 'row', alignItems: 'center', gap: 40, marginLeft: 30, padding: 4}}>
                <TouchableOpacity onPress={goBackButton}>
                    <Ionicons name="arrow-back-outline" size={30} color="#fff" />
                </TouchableOpacity>
                <Text style = {styles.headerText}>View Product</Text>
            </View>
            <View style = {styles.productCard} key={id}>
                <Image 
                  source={{
                      uri: image
                  }}
                  style = {styles.image}
                />
                
                <View style = {{flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', width:'90%', gap: 15}}>
                  <View>
                      <Text style = {{fontWeight: '600', fontSize: 20, paddingBottom: 5, color: '#fff'}}>{product}</Text>
                      <StarRating rate = {rate}/>
                  </View>
                    <Text style ={{color: '#FFCC16', fontSize: 50, fontWeight: 'bold'}}>${price}</Text>
                </View>           
            </View>
        </View>

        <View style = {{flexDirection: 'row',  margin: 20, gap: 10}}>
          <Pressable style = {styles.filter}>
            <Text style = {{fontSize: 18, textAlign: 'center'}}>Description</Text>
          </Pressable>
          <Pressable style = {styles.filter}>
            <Text style = {{fontSize: 18, textAlign: 'center'}}>Category</Text>
          </Pressable>
        </View>
        
        
        <View style = {styles.descContainer}>
            <Text style = {{fontSize: 17, color: '#000', marginTop: -25}}>{desc}</Text>  
            {buttonClicked ? (
              <View style = {{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', width: '90%', marginTop: 10}}>
                <Pressable onPress = {()=> addItemToCart({
                  id: id, image: image, product: product, price: price, quantity: quantity, desc: desc,
                })}>
                  <LinearGradient
                    colors={['purple', '#f743ee']}  
                    start={{ x: 1, y: 0 }}
                    end={{ x: .2, y: .1 }}
                    style = {[styles.button, shadowStyle]}
                  >
                    <Text style = {{fontSize: 18, color: '#fff', fontWeight: 'bold'}} >Add to Cart</Text>
                  </LinearGradient>
                  
                </Pressable>      
              </View>
            ) : (
              <View style = {{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', width: '90%', marginTop: 10}}>
              <Pressable onPress = {()=> addItemToCart({
                id: id, image: image, product: product, price: price, quantity: quantity, desc: desc,
              })}>
                <LinearGradient
                  colors={['purple', '#f743ee']}  
                  start={{ x: 1, y: 0 }}
                  end={{ x: .2, y: .1 }}
                  style = {[styles.button, shadowStyle]}
                >
                  <Text style = {{fontSize: 18, color: '#fff', fontWeight: 'bold'}} >Item added to cart</Text>
                </LinearGradient>
                
              </Pressable>      
            </View>
            )}  
            
        </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
      
    },
    innerContainer: {
      height: '52%',
      borderBottomRightRadius: 20,
      borderBottomLeftRadius: 20,
      backgroundColor: '#000',
      paddingTop: 30,
    },
    filter: {
      height: 40,
      backgroundColor: '#F2F2F2',
      borderRadius: 15,
      padding: 10,
    },

    image: {
      width: 120, 
      height: 113,
      flexShrink: 0,
    },
    productCard: {
        alignItems: 'center',
        justifyContent: 'center'
    },  
    headerText: {
      color: 'white',
      fontSize: 30,
      margin: 15,
      fontWeight: 'bold',
      textAlign: 'center',
    },
    
    image: {
      width: 320,
      height: 190,
      borderRadius: 15,
      objectFit: 'fill',
      flexShrink: 0,
      marginBottom: 15,
    },
    
    button: {
      width: 150,
      height: 45,
      borderRadius: 20,
      padding: 10,
    },
    descContainer: {
      margin: 20,      
   },
    
  });

  const shadowStyle = Platform.select({
    ios: {
        shadowColor: 'rgba(0, 0, 0, 0.25)',
        shadowOffset: {
            width: 0, height: 0.5
        },
        shadowOpacity: 1,
        shadowRadius: 2,
    }, 
    android: {
        elevation: 1,
    }
})
  

export default ItemScreen
