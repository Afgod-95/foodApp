import React, { useState } from 'react'
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { FontAwesome5 } from '@expo/vector-icons';
import { useDispatch, useSelector } from 'react-redux';
import { removeItem, resetCart, incrementQuantity, decrementQuantity } from '../redux/cartReducer';
import List from '../data/List';

const ProductCart = () => {
  const dispatch = useDispatch()

  const handleDecrement = (item) => {
    if(item.quantity == 1){
      dispatch(removeItem(item))
    }
    else{
      dispatch(decrementQuantity(item))
    }
  };
  
  const handleIncrement = (item) => {
    dispatch(incrementQuantity(item))
  };

  const subTotal = () => {
    let total = 0
    List.forEach(data => total += (data.quantity) * data.price )
    return total.toFixed(2)
  }



  return (
    <SafeAreaView style = {styles.container}>
      <View style = {styles.innerContainer}>
        <View style = {styles.top}>
          <Text style = {styles.headerText}>My Cart</Text>
          <Text style = {styles.text}>{List.length} Items</Text>
        </View>

        <ScrollView showsVerticalScrollIndicator = {false}>
          <View style = {{height: 350}}>
            {List.map(item => {
              return(
                <View style = {styles.productContainer} key = {item.id}>
                  <Image source={{uri: item.image}} style = {styles.image}/>
                  <View style = {styles.productCont1}>
                    <View style = {{width: 300, flexDirection: 'row', gap: 70, alignItems: 'flex-start'}}>
                      <View>
                        <Text style = {styles.lightText}>{item.product}</Text>
                        <Text style = {styles.text}>{item.desc}</Text>
                      </View>
                      <TouchableOpacity onPress={()=> dispatch(removeItem(item.id))}>
                        <FontAwesome5 name="times-circle" size={24} color="purple" />
                      </TouchableOpacity>
                    </View>

                    <View style = {{width: 300, flexDirection: 'row', alignItems: 'center', gap: 80,}}>
                      <Text style = {styles.text}>${item.price}</Text>
                      <View style = {{flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
                        <TouchableOpacity style = {[styles.decreaseQuantity, shadowStyle]}>
                          <Text 
                            style = {{fontSize: 18, color: '#acadac',  fontWeight: 'bold'}}
                            onPress={()=>handleDecrement}
                          >-</Text>
                        </TouchableOpacity >
                        <Text style = {{fontSize: 18, color: '#acadac', fontWeight: 'bold', padding: 10}}>{item.quantity}</Text>
                    
                        <TouchableOpacity  style = {[styles.addQuantity, shadowStyle]}>
                          <Text 
                            onPress={()=>handleIncrement}
                            style = {{fontSize: 18, color: '#000', fontWeight: 'bold'}}
                          
                          >+</Text>
                        </TouchableOpacity >
                      </View>
                    </View>
                  </View>
                </View>

              )
            })}
          </View>
        </ScrollView>
        <View style = {{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 10, borderTopWidth: .5, borderColor: '#acadac'}}>
          <Text style = {styles.text}>Sub Total</Text>
          <Text style = {styles.text}>${subTotal()}</Text>
        </View>
        
        <TouchableOpacity>
          <Text style ={{color: 'red', fontSize: 18, marginTop: 10}}>Reset Cart</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.button} >
          <Text style = {{fontSize: 18, color: '#fff', fontWeight: 'bold'}}>Checkout</Text>
        </TouchableOpacity>
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
    width: '90%',
    margin: 20
  },

  image: {
    width: 100,
    height: 100,
    objectFit: 'cover',
    marginBottom: 10,
  },

  headerText: {
    color: '#acadac',
    fontSize: 28,
    fontWeight: 'bold',
  },
  top:{
    marginTop: Platform.OS === 'ios' ? 'padding' : 'height',
    flexDirection: 'column',
    justifyContent: 'space-between',
    borderBottomWidth: .5,
    borderColor: '#acadac'
  },

  text: {
    fontSize: 15,
    color: '#acadac',
    marginTop: 5,
    
  },

  lightText: {
    fontSize: 18,
    lineHeight: 30,
    color: '#fff'
  },
  decreaseQuantity: {
    width: 35,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
    borderRadius: 10,
    borderWidth: .5, 
    borderColor: '#acadac',
  },

  productContainer: {
    flexDirection: 'row',
    gap: 15,
    alignItems: 'center',
    borderBottomWidth: .5,
    borderColor: '#acadac',
    marginTop: 9,
  },

  productCont1: {
    flexDirection: 'column',
    gap: 20,
    justifyContent: 'space-between',
    alignItems: 'center',
  },



  addQuantity: {
    width: 35,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderWidth: .5,
    borderColor: '#000',
    borderRadius: 10,
  },
  button: {
    width: 350,
    height: 40,
    marginTop: 15,
    
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f743ee',
    borderRadius: 10,
  }
})


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


export default ProductCart
