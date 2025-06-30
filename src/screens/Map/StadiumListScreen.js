import React from 'react';
import { View, Text, FlatList, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const stadiums = [
  {
    id: 1,
    title: 'Wembley Stadium',
    description: 'Sân vận động nổi tiếng ở London',
    image: 'https://www.tsa-uk.org.uk/media/2025/03/Wembley-Stadium-scaled.jpg',
    coordinate: { latitude: 51.556021, longitude: -0.279519 },
  },
  {
    id: 2,
    title: 'Old Trafford',
    description: 'Sân nhà của Manchester United',
    image: 'https://cdn.ca.emap.com/wp-content/uploads/sites/9/2024/07/old-trafford-manchester-united.jpg',
    coordinate: { latitude: 53.463062, longitude: -2.291340 },
  },
  {
    id: 3,
    title: 'Etihad Stadium',
    description: 'Sân nhà của Manchester City',
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/18/Manchester_city_etihad_stadium_%28cropped%29.jpg/1200px-Manchester_city_etihad_stadium_%28cropped%29.jpg',
    coordinate: { latitude: 53.483056, longitude: -2.200278 },
  },
  {
    id: 4,
    title: 'Anfield',
    description: 'Sân nhà của Liverpool',
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRqPBOFJ8HT3N1Abxrwbd1UJff23sB53P_14g&s',
    coordinate: { latitude: 53.430829, longitude: -2.96083 },
  },
  {
    id: 5,
    title: 'Stamford Bridge',
    description: 'Sân nhà của Chelsea',
    image: 'https://images2.minutemediacdn.com/image/upload/c_crop,w_7360,h_4140,x_0,y_434/images/GettyImages/mmsport/310/01j7e8d3a27a6n33jfwy',
    coordinate: { latitude: 51.481663, longitude: -0.190956 },
  },
  {
    id: 6,
    title: 'Emirates Stadium',
    description: 'Sân nhà của Arsenal',
    image: 'https://s44872.pcdn.co/wp-content/uploads/2024/05/AdobeStock_347976887_Editorial_Use_Only-scaled.jpeg.optimal.jpeg',
    coordinate: { latitude: 51.554888, longitude: -0.108438 },
  },
  {
    id: 7,
    title: 'Tottenham Hotspur Stadium',
    description: 'Sân nhà của Tottenham Hotspur',
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSrQtH9QI9kR8Ss88YgoQU5mk5HU-8tEbvL6A&s',
    coordinate: { latitude: 51.604319, longitude: -0.066389 },
  },
  {
    id: 8,
    title: 'St James\' Park',
    description: 'Sân nhà của Newcastle United',
    image: 'https://upload.wikimedia.org/wikipedia/commons/a/a2/Newcastle_st-james-park_stadium.jpg',
    coordinate: { latitude: 54.975556, longitude: -1.621667 },
  },
  {
    id: 9,
    title: 'Villa Park',
    description: 'Sân nhà của Aston Villa',
    image: 'https://upload.wikimedia.org/wikipedia/commons/f/fe/Birmingham_aston_villa_park_stadium.jpg',
    coordinate: { latitude: 52.509167, longitude: -1.884722 },
  },
  {
    id: 10,
    title: 'Goodison Park',
    description: 'Sân nhà của Everton',
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQqGz_QGiThYmc8himJhM_UiUhGwDDhRNgvlA&s',
    coordinate: { latitude: 53.438889, longitude: -2.966389 },
  },
];

export default function StadiumListScreen() {
  const navigation = useNavigation();

  const handlePress = (stadium) => {
    navigation.navigate('Map', { focusStadium: stadium });
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={stadiums}
        keyExtractor={item => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.item} onPress={() => handlePress(item)} activeOpacity={0.85}>
            <Image source={{ uri: item.image }} style={styles.img} />
            <View style={styles.info}>
              <Text style={styles.title}>{item.title}</Text>
              <Text style={styles.desc}>{item.description}</Text>
            </View>
          </TouchableOpacity>
        )}
        contentContainerStyle={{ padding: 16 }}
        ItemSeparatorComponent={() => <View style={{ height: 16 }} />}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    height: 100,
    backgroundColor: '#f7f7f7',
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 10,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  img: {
    width: 110,
    height: 80,
    borderRadius: 10,
    marginRight: 16,
    resizeMode: 'cover',
  },
  info: {
    flex: 1,
    justifyContent: 'center',
  },
  title: {
    fontWeight: 'bold',
    fontSize: 17,
    color: '#222',
    marginBottom: 4,
  },
  desc: {
    fontSize: 14,
    color: '#666',
  },
}); 