import React from 'react'
import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';


const Cart = ({ focused, badgeCount }) => {
    
    return (
        <View style ={{position: 'relative'}}>
            <Ionicons name="cart" size={24} color={focused? 'white' : 'gray'} />  
            {badgeCount > 0 && (
            <View
                style={{
                position: 'absolute',
                top: -2, 
                right: -10,
                backgroundColor: '#f743ee',
                borderRadius: 10,
                width: 18,
                height: 18,
                justifyContent: 'center',
                alignItems: 'center',
                }}
                >
                <Text style={{ color: 'white', fontSize: 12, fontWeight: 'bold' }}>
                {badgeCount}
                </Text>
            </View>
            )}
        </View>
    );
}

export default Cart
