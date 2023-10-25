import React, { useEffect, useState } from 'react';
import {
  View,
  SafeAreaView,
  StyleSheet,
  TextInput,
  Text,
  KeyboardAvoidingView,
  Platform,
  Dimensions,
  TouchableOpacity,
  ScrollView,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import List from '../data/List';
import AsyncStorage from '@react-native-async-storage/async-storage';

const getRecentSearches = async () => {
  try {
    const recentSearches = await AsyncStorage.getItem('recentSearches');
    return recentSearches ? JSON.parse(recentSearches) : [];
  } catch (error) {
    console.error('Error getting recent searches:', error);
    return [];
  }
};

const storeRecentSearches = async (searches) => {
  try {
    await AsyncStorage.setItem('recentSearches', JSON.stringify(searches));
  } catch (error) {
    console.error('Error storing recent searches:', error);
  }
};

const Query = () => {
  const [search, setSearch] = useState('');
  const [searchedResult, setSearchedResult] = useState([]);
  const [recentSearches, setRecentSearches] = useState([]);
  const screenWidth = Dimensions.get('window').width;
  const navigate = useNavigation();

  const handleItemClick = (item) => {
    navigate.navigate('ItemDetails', {
      product: item.productName,
      image: item.productImage,
      price: item.price,
      quantity: item.quantity,
      desc: item.desc,
      rate: item.rate,
    })
  }

  const handleSearch = (text) => {
    setSearch(text);
    if (text === '') {
      setSearchedResult([]);
    } else {
      const filteredProducts = List.filter((product) =>
        product.productName.toLowerCase().includes(text.toLowerCase())
      );
      setSearchedResult(filteredProducts);
    }
  };

  const handleRecentSearchSelect = (recentSearch) => {
    setSearch(recentSearch);
    // Call the handleSearch function to update searchedResult with the selected recent search
    handleSearch(recentSearch);
  };

  const addRecentSearch = (newSearch) => {
    // Ensure that newSearch is not an empty string
    if (newSearch) {
      const updatedRecentSearch = [newSearch, ...recentSearches.filter((search) => search !== newSearch)];
      setRecentSearches(updatedRecentSearch);
      storeRecentSearches(updatedRecentSearch);
    }
  };

  useEffect(() => {
    getRecentSearches().then((searches) => {
      setRecentSearches(searches);
    });
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'height' : 'padding'}>
        <View style={[styles.top, { width: screenWidth }]}>
          <View style={styles.inputBox}>
            <TouchableOpacity onPress={() => navigate.goBack()}>
              <Ionicons name="arrow-back" size={24} color="#f2f2f2"/>
            </TouchableOpacity>
            <TextInput
              value={search}
              onChangeText={handleSearch}
              placeholder="Search..."
              secureTextEntry={false}
              placeholderTextColor="#acadac"
              style={styles.input}
            />
          </View>
        </View>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.innerContainer}>
            {searchedResult.length > 0 && search !== '' ? (
              searchedResult.map((item, index) => {
                return (
                  <TouchableOpacity
                    key={index}
                    style={styles.searchContainer}
                    onPress={() => handleItemClick(item)} // Pass the product name to addRecentSearch
                  >
                    <Image source={{ uri: item.productImage }} style={styles.image} />
                    <View>
                      <Text style={{ color: '#fff' }}>{item.productName}</Text>
                      <Text style={{ color: '#fff', fontSize: 17 }}><Text style={{ fontSize: 15,color: '#FFCC16' }}>Price: </Text>${item.price}</Text>
                    </View>
                  </TouchableOpacity>
                );
              })
            ) : search !== '' && searchedResult.length === 0 ? (
              <View style={{ alignItems: 'center', justifyContent: 'center', marginTop: 150}}>
                  <Text style={{ color: '#acadac', fontSize: 30, alignItems: 'center', justifyContent: 'center', textAlign: 'center'}}>No results found</Text>
              </View>
              
            ) : null}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  innerContainer: {
    flex: 1,
    margin: 15,
  },
  top:{
    marginTop: 25,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    borderWidth: .5,
    borderBottomColor: '#f2f2f2',
    backgroundColor: '#2e2d2d'
  },

  inputBox: {  
    alignItems: 'center',
    flexDirection: 'row',
    height: 45,
    backgroundColor: 'transparent',
    marginLeft: 10    
  },
  input: {
    width: 320,
    fontSize: 15,
    color: '#acadac',
    paddingLeft: 20
  },
  searchContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    height: 62,
    gap: 10,
    backgroundColor: 'tra',
    marginVertical: 10,
  },
  image: {
    width: 60,
    height: 60,
    flexShrink: 0,
    objectFit: 'cover',
  }
  
  
})


export default Query

