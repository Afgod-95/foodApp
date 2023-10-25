import React, { useRef } from 'react'
import { SafeAreaView, View, Text, Image, TouchableOpacity, StyleSheet,  Platform, FlatList, Pressable, ScrollView } from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import Slider from '../components/Slider'
import ProductCard from '../components/ProductCard'
import List from '../data/List'
import { useNavigation } from '@react-navigation/native'
import SearchQuery from '../components/SearchQuery'
import Avatar from '../components/Avatar'



const Home = () => {

  const flatListRef = useRef(null)

  const navigation = useNavigation()

  const handleItemPress = (item) => {
    navigation.navigate('ItemDetails', { 
      image: item.productImage,
      product: item.productName,
      price: item.price,
      quantity: item.quantity,
      desc: item.desc,
      rate: item.rate,
    });
  };
 
 
  return (
    
    <SafeAreaView style = {styles.container}>
      <View style = {styles.innerContainer}>
        <View style = {styles.top}>
          <SearchQuery />
          <Avatar />
        </View>
        <Slider />
       
        
      </View>
      <View style = {styles.curvedBox}>
        <View style = {styles.promotionContainer}>
          <Text style = {styles.purpleText}>Promotions</Text>
          <View style = {styles.promotionsBox}>
            <View style = {{width: 161, height: 128, marginLeft: 10}}>
              <Text style = {styles.lightText}>Todays Offer</Text>
              <Text style = {styles.boldText}>Free cup of KFC</Text>
              <Text style = {styles.lightText}>on all orders above $135</Text>
            </View>
            <Image
              source={{
                uri: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSpQ2lsxQKUMKYH6qZUbYdVC5eH6SkiQsNs9g&usqp=CAU'
              }}
              style = {styles.promotionImage}
            />
          </View>
          <Text style = {styles.purpleText2}>Popular</Text>
          
          <View>
              <FlatList 
                showsHorizontalScrollIndicator={false}
                horizontal
                ref = {flatListRef}
                data = {List}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                  <TouchableOpacity style={{ marginHorizontal: 7 }} onPress={() => handleItemPress(item)}>
                    <ProductCard
                      image={item.productImage}
                      productName={item.productName}
                      price={item.price}
                      {...item}
                    />
                  </TouchableOpacity>
               )}      
              />
          </View>
          
          
        </View>  
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
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  gradientBorder: {
    width: 60,
    height: 60,
    borderRadius: 75,  
    padding: 5,         
    justifyContent: 'center',
    alignItems: 'center',
  },

  image: {
    width: 50,
    height: 50,
    borderRadius: 75,
  },

  headerText: {
    color: 'white',
    fontSize: 28,
    fontWeight: 'bold',
  },
  top:{
    marginTop: Platform.OS === 'ios' ? 25 : 40,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '90%',
  },

  curvedBox: {
    width: '100%',
    height: '65%',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 'auto', 
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    backgroundColor: '#fff',
  },

  promotionContainer:{
    flex: 1,
    width: '90%',
    margin: 'auto'
  }, 
  purpleText: {
    color: '#ED9EF4',
    fontWeight: 'bold',
    fontSize: 20,
    paddingTop: 10,
  }, 

  purpleText2: {
    color: '#ED9EF4',
    fontWeight: 'bold',
    fontSize: 20,
    marginTop: -15,
    marginBottom: 10,
  },

  promotionsBox: {
    marginTop: -10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  },

  promotionImage: {
    width: 222, 
    height: 188,
    flexShrink: 0,
    marginRight: 10,
  },

  boldText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#acadac',
    textAlign: 'left',
    alignItems: 'flex-start',
    justifyContent: 'flex-start'
  },
  lightText: {
    fontSize: 18,
    lineHeight: 30,
    color: '#000'
  },
})
export default Home
