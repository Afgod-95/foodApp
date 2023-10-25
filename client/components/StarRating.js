import React from 'react'
import { View, Text } from 'react-native'
import { Ionicons } from '@expo/vector-icons';

const StarRating = ({ rate }) => {
    const fullStars = Math.floor(rate);
    const halfStars = rate - fullStars >= 0.5 ? 1 : 0;
    const emptyStars = 5 - fullStars - halfStars;

    const starIcons = [];
    for (let i = 0; i < fullStars; i++){
        starIcons.push(
            <Ionicons name="star-sharp" size={24} color="#FDCA00" />
        )
    }

    if (halfStars){
        starIcons.push(
            <Ionicons name="star-half-sharp" size={24} color="#FDCA00" />
        )
    }
    for (let i = 0; i < emptyStars; i++){
        starIcons.push(
            <Ionicons name="star-outline" size={24} color="#FDCA00" /> 
        )
    }

  return (
    <View>
        
        <Text>{starIcons}</Text>
    </View>
  )
}

export default StarRating
