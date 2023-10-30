import React from 'react'
import { Text, View} from 'react-native'
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { Octicons, MaterialCommunityIcons, Ionicons, FontAwesome5 } from '@expo/vector-icons';


import Login from '../screens/Login'
import Register from '../screens/Register'
import Home from '../screens/Home'
import Products from '../screens/Products'
import Profile from '../screens/Profile'
import ProductCard from '../screens/ProductCart'
import ProductCart from '../screens/ProductCart'
import Search from '../screens/Search'
import Cart from '../components/Cart'
import ItemScreen from '../components/ItemScreen'
import Query from '../screens/Query'
import { useSelector } from 'react-redux'
import EditProfile from '../screens/EditProfile'

import OtpVerification from '../screens/OtpVerification'


const NavigationSlack = () => {
    const Stack = createNativeStackNavigator()
    const Tab = createBottomTabNavigator()  
    
    const products = useSelector(state => state.cart.products)
  
    const BottomTabs = () => {
      return (
        
          <Tab.Navigator
            screenOptions={{
              tabBarLabel: { color: 'gray' },
              tabBarStyle: { backgroundColor: '#000', padding: 15},
              tabBarShadowStyle: null,
              tabBarHideOnKeyboard: true,
            }}
          >
            <Tab.Screen 
              name="Home" 
              component={Home} 
              options={{
                tabBarLabel: ({focused}) => {
                  return (
                    <Text style={{ color: focused ? 'white' : 'gray', fontSize: 12 }}>
                      Home
                    </Text>
                  )
                },
                headerShown: false,
                tabBarIcon: ({ focused }) => (
                  focused ?
                  (
                    <Octicons name="home" size={24} color="white" />
                  ) 
                  :
                  (
                    <MaterialCommunityIcons name="home" size={24} color="gray" />
                  )
                ),
              }}

            />

            

            <Tab.Screen 
              name="Products" 
              component={Products} 
              options={{
                tabBarLabel: ({focused}) => {
                  return (
                    <Text style={{ color: focused ? 'white' : 'gray', fontSize: 12 }}>
                      Menu
                    </Text>
                  )
                },
                headerShown: false,
                tabBarIcon: ({ focused }) => (
                  focused ?
                  (
                    <FontAwesome5 name="utensils" size={20} color="white" />
                  ) 
                  :
                  (
                    <FontAwesome5 name="utensils" size={20} color="gray" />
                  )
                ),
              }}
            />  

            <Tab.Screen 
              name="ProductCart" 
              component={ProductCard} 
              options={{
                tabBarLabel: ({focused}) => {
                  return (
                    <Text style={{ color: focused ? 'white' : 'gray', fontSize: 12 }}>
                      Cart
                    </Text>
                  )
                },
                tabBarIcon: ({ focused }) => (
                  <Cart focused = {focused} badgeCount={products.length}/>
                ),
                headerShown: false,
              }}
            />
          </Tab.Navigator>
      );
    };
    

    const ProfilePage = () => {
      <Tab.Navigator
            screenOptions={{
              tabBarLabel: { color: 'gray' },
              tabBarStyle: { backgroundColor: '#000', padding: 15},
              tabBarShadowStyle: null,
              tabBarHideOnKeyboard: true,
            }}
          >
            <Tab.Screen 
              name="Home" 
              component={Home} 
              options={{
                tabBarLabel: ({focused}) => {
                  return (
                    <Text style={{ color: focused ? 'white' : 'gray', fontSize: 12 }}>
                      Home
                    </Text>
                  )
                },
                headerShown: false,
                tabBarIcon: ({ focused }) => (
                  focused ?
                  (
                    <Octicons name="home" size={24} color="white" />
                  ) 
                  :
                  (
                    <MaterialCommunityIcons name="home" size={24} color="gray" />
                  )
                ),
              }}
            />

            <Tab.Screen 
              name="Products" 
              component={Products} 
              options={{
                tabBarLabel: ({focused}) => {
                  return (
                    <Text style={{ color: focused ? 'white' : 'gray', fontSize: 12 }}>
                      Menu
                    </Text>
                  )
                },
                headerShown: false,
                tabBarIcon: ({ focused }) => (
                  focused ?
                  (
                    <FontAwesome5 name="utensils" size={20} color="white" />
                  ) 
                  :
                  (
                    <FontAwesome5 name="utensils" size={20} color="gray" />
                  )
                ),
              }}
            />  

            <Tab.Screen 
              name="ProductCart" 
              component={ProductCard} 
              options={{
                tabBarLabel: ({focused}) => {
                  return (
                    <Text style={{ color: focused ? 'white' : 'gray', fontSize: 12 }}>
                      Cart
                    </Text>
                  )
                },
                tabBarIcon: ({ focused }) => (
                  <Cart focused = {focused} badgeCount={products.length}/>
                ),
                headerShown: false,
              }}
            />

            <Tab.Screen name = 'Profile' component={Profile} options={{headerShown: false}}/>
          </Tab.Navigator>
    }
   
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName='Login' >
        <Stack.Screen name="Login" component={Login} options={{headerShown: false}}/>
        <Stack.Screen name="Register" component={Register} options={{headerShown: false}}/>
        <Stack.Screen name = "OtpVerification" component={OtpVerification} options={{headerShown: false}} />
        <Stack.Screen name="Main" component={BottomTabs} options={{headerShown: false}}/>
        <Stack.Screen name="Products" component={Products} options={{headerShown: false}}/>
        <Stack.Screen name="Cart" component={ProductCart} options={{headerShown: false}}/>
        <Stack.Screen name = "ItemDetails" component = {ItemScreen} options={{headerShown: false}} />
        <Stack.Screen name = "Profile" component = {Profile} options={{headerShown: false}} />
        <Stack.Screen name = 'QueryScreen' component = {Query} options={{headerShown: false}}/>
        <Stack.Screen name = 'EditProfile' component = {EditProfile} options={{headerShown: false}} />
      </Stack.Navigator>
    </NavigationContainer>
  )
}

export default NavigationSlack
