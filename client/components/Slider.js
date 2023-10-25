import React, { useState, useRef } from 'react';
import { View, Text, FlatList, Image, StyleSheet, ScrollView } from 'react-native';

const Slider = () => {
  const data = [
    {
      id: 1,
      title: 'Burger',
      source:
        'https://www.thecookierookie.com/wp-content/uploads/2023/04/featured-stovetop-burgers-recipe.jpg',
    },
    {
      id: 2,
      title: 'Pizza',
      source:
        'https://kauveryhospital.com/blog/wp-content/uploads/2021/04/pizza-5179939_960_720.jpg',
    },
    {
      id: 3,
      title: 'Pasta',
      source:
        'https://www.thecookierookie.com/wp-content/uploads/2023/04/featured-stovetop-burgers-recipe.jpg',
    },
    {
      id: 4,
      title: 'Hot Dog',
      source:
        'https://www.thecookierookie.com/wp-content/uploads/2023/04/featured-stovetop-burgers-recipe.jpg',
    },
    {
      id: 5,
      title: 'Jollof',
      source:
        'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0a/Jollof_Rice_with_Stew.jpg/1200px-Jollof_Rice_with_Stew.jpg',
    },
    {
      id: 6,
      title: 'Jollof',
      source:
        'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0a/Jollof_Rice_with_Stew.jpg/1200px-Jollof_Rice_with_Stew.jpg',
    },
  ];

  const [viewableIndex, setViewableIndex] = useState(0);
  const flatListRef = useRef(null);

  const onScroll = (event) => {
    const offsetX = event.nativeEvent.contentOffset.x;
    const index = Math.floor(offsetX / (width + 20)); 

    if (index !== viewableIndex) {
      setViewableIndex(index);
    }
  };

  const { width } = StyleSheet.flatten(styles.scrollItem);

  return (
    
    <View style={styles.container}>
      <FlatList
        ref={flatListRef}
        data={data}
        horizontal
        renderItem={({ item }) => (
          <View style={styles.scrollItem}>
            <Image source={{ uri: item.source }} style={styles.image} />
            <Text style={styles.title}>{item.title}</Text>
          </View>
        )}
        onScroll={onScroll}
        viewabilityConfig={{
          itemVisiblePercentThreshold: 50, 
        }}
        keyExtractor={(item) => item.id.toString()}
        scrollEventThrottle={16}
      />
      <View style={styles.indicatorContainer}>
        {data.map((_, index) => (
          <View
            key={index}
            style={[
              styles.indicator,
              { backgroundColor: index === viewableIndex ? '#f743ee' : 'gray' },
            ]}
          />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 115, // Adjust the height as needed
    marginVertical: 10,
    width: '90%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollItem: {
    alignItems: 'center',
    width: 68 + 12, // Adjust for item width and margin
  },
  image: {
    width: 68,
    height: 68,
    borderRadius: 20,
  },
  title: {
    color: 'white',
    margin: 10,
    fontSize: 16,
  },
  indicatorContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  indicator: {
    width: 5,
    height: 5,
    borderRadius: 5,
    marginHorizontal: 5,
  },
});

export default Slider;
