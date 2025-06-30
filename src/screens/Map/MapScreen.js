import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, Dimensions, Platform, Text, TouchableOpacity } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE, MapType } from 'react-native-maps';
import * as Location from 'expo-location';
import { Ionicons } from '@expo/vector-icons';

const stadiums = [
  {
    id: 1,
    title: 'Wembley Stadium',
    description: 'Sân vận động nổi tiếng ở London',
    coordinate: { latitude: 51.556021, longitude: -0.279519 },
  },
  {
    id: 2,
    title: 'Old Trafford',
    description: 'Sân nhà của Manchester United',
    coordinate: { latitude: 53.463062, longitude: -2.291340 },
  },
  {
    id: 3,
    title: 'Etihad Stadium',
    description: 'Sân nhà của Manchester City',
    coordinate: { latitude: 53.483056, longitude: -2.200278 },
  },
  {
    id: 4,
    title: 'Anfield',
    description: 'Sân nhà của Liverpool',
    coordinate: { latitude: 53.430829, longitude: -2.96083 },
  },
  {
    id: 5,
    title: 'Stamford Bridge',
    description: 'Sân nhà của Chelsea',
    coordinate: { latitude: 51.481663, longitude: -0.190956 },
  },
  {
    id: 6,
    title: 'Emirates Stadium',
    description: 'Sân nhà của Arsenal',
    coordinate: { latitude: 51.554888, longitude: -0.108438 },
  },
  {
    id: 7,
    title: 'Tottenham Hotspur Stadium',
    description: 'Sân nhà của Tottenham Hotspur',
    coordinate: { latitude: 51.604319, longitude: -0.066389 },
  },
  {
    id: 8,
    title: "St James' Park",
    description: 'Sân nhà của Newcastle United',
    coordinate: { latitude: 54.975556, longitude: -1.621667 },
  },
  {
    id: 9,
    title: 'Villa Park',
    description: 'Sân nhà của Aston Villa',
    coordinate: { latitude: 52.509167, longitude: -1.884722 },
  },
  {
    id: 10,
    title: 'Goodison Park',
    description: 'Sân nhà của Everton',
    coordinate: { latitude: 53.438889, longitude: -2.966389 },
  },
];

export default function MapScreen({ route }) {
  const [region, setRegion] = useState({
    latitude: 51.509865,
    longitude: -0.118092,
    latitudeDelta: 0.2,
    longitudeDelta: 0.2,
  });
  const [location, setLocation] = useState(null);
  const [mapType, setMapType] = useState('standard');
  const mapRef = useRef(null);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        return;
      }
      let loc = await Location.getCurrentPositionAsync({});
      setLocation(loc.coords);
      if (!route?.params?.focusStadium) {
        setRegion({
          latitude: loc.coords.latitude,
          longitude: loc.coords.longitude,
          latitudeDelta: 0.1,
          longitudeDelta: 0.1,
        });
      }
    })();
  }, []);

  useEffect(() => {
    if (route?.params?.focusStadium) {
      const { coordinate } = route.params.focusStadium;
      setRegion({
        latitude: coordinate.latitude,
        longitude: coordinate.longitude,
        latitudeDelta: 0.04,
        longitudeDelta: 0.04,
      });
      // Optional: animate camera
      setTimeout(() => {
        mapRef.current?.animateToRegion({
          latitude: coordinate.latitude,
          longitude: coordinate.longitude,
          latitudeDelta: 0.04,
          longitudeDelta: 0.04,
        }, 800);
      }, 400);
    }
  }, [route?.params?.focusStadium]);

  const handleMapType = () => {
    setMapType((prev) =>
      prev === 'standard' ? 'satellite' : prev === 'satellite' ? 'hybrid' : 'standard'
    );
  };

  // Chỉ hiển thị marker của sân được chọn nếu có focusStadium, ngược lại hiển thị tất cả
  const stadiumMarkers = route?.params?.focusStadium
    ? [route.params.focusStadium]
    : stadiums;

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        style={styles.map}
        provider={PROVIDER_GOOGLE}
        region={region}
        mapType={mapType}
        showsUserLocation={true}
        showsMyLocationButton={true}
      >
        {stadiumMarkers.map((stadium) => (
          <Marker
            key={stadium.id}
            coordinate={stadium.coordinate}
            title={stadium.title}
            description={stadium.description}
          >
            <Ionicons name="football" size={32} color="#e60000" />
          </Marker>
        ))}
      </MapView>
      <TouchableOpacity style={styles.mapTypeBtn} onPress={handleMapType}>
        <Ionicons name="layers" size={22} color="#fff" />
        <Text style={{ color: '#fff', marginLeft: 6 }}>
          {mapType === 'standard' ? 'Chuẩn' : mapType === 'satellite' ? 'Vệ tinh' : 'Kết hợp'}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
  mapTypeBtn: {
    position: 'absolute',
    top: 50,
    right: 20,
    backgroundColor: '#111',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    opacity: 0.92,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
}); 