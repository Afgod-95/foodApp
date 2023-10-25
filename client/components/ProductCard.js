import React from 'react'
import {View, Image, StyleSheet, Text, Platform} from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'

const ProductCard = ({image, productName, price }) => {
  
  
    return (
    <View style = {styles.productCard}>
        <Image 
            source={{
                uri: image
            }}
            style = {styles.image}
        />
        <Text style = {{fontWeight: '600', fontSize: 15, padding: 5, color: '#000'}}>{productName}</Text>
        <View style = {{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', width: '80%'}}>
            <Text style ={{color: '#FFCC16', fontSize: 30, fontWeight: 'bold'}}>${ price }</Text>
            <LinearGradient 
                colors={['#0AC01C', 'rgba(13, 243, 36, 0.53) 100%)']}  
                start={{ x: .8, y: 0 }}
                end={{ x: .8, y: 1 }}
                style = {[styles.addSymbol, shadowStyle]}>
                <Text style = {{fontSize: 25, color: '#fff', textAlign: 'center'}}>+</Text>
            </LinearGradient>
        </View>
    </View>
  )
}

const styles = StyleSheet.create({
    productCard: {
        width: 165,
        height: 205,
        backgroundColor: '#F2F2F2',
        borderRadius: 15,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column'
      },

      addSymbol: {
        width: 30,
        height: 30,
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center',
      },
      image: {
        width: 150, 
        borderRadius:10,
        height: 113,
        flexShrink: 0,
      },
    
})

const shadowStyle = Platform.select({
    ios: {
        shadowColor: 'rgba(0, 0, 0, 0.25)',
        shadowOffset: {
            width: 0, height: 0.5
        },
        shadowOpacity: 0.3,
        shadowRadius: 2,
    }, 
    android: {
        elevation: 2,
    }
})

export default ProductCard
