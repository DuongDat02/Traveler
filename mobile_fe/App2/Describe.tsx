import { useNavigation, useRoute } from '@react-navigation/native';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, Image, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import Icon2 from 'react-native-vector-icons/MaterialIcons';
import Icon3 from 'react-native-vector-icons/AntDesign';
import Icon4 from 'react-native-vector-icons/MaterialCommunityIcons';
import React, { useState, useEffect } from 'react';

const windowWidth = Dimensions.get('window').width;
interface LocationData {
  locationId: number;
  imageUrl: string;
  imageDesc: string;
  name: string;
  description: string;
  weather: string;
  traffic: string;
  rating: number;
  totalRate: number;
}

const Describe = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const [locationData, setLocationData] = useState<LocationData | null>(null);
  const locationId = route.params?.locationId;

  useEffect(() => {
    fetchLocationData();
  }, []);

  const fetchLocationData = async () => {
    try {
      const response = await fetch(`http://172.20.10.12:8080/api/v1/locations/${locationId}`);
      if (!response.ok) {
        throw new Error('Error fetching location data');
      }
      const data: LocationData = await response.json();
      setLocationData(data);
    } catch (error) {
      console.error('Error fetching location data:', error);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView>
        {locationData ? (
          <>
            <View style={styles.place}>
              <Image source={{ uri: locationData.imageUrl }} style={styles.locationImage} />
              <View style={styles.textContainer}>
                <Text style={styles.locationText}>{locationData.name}</Text>
              </View>
            </View>
            <View style={styles.box}>
              <Text style={styles.boxTitle}>Giới thiệu</Text>
              <Text style={styles.boxText}>{locationData.description}</Text>
            </View>
            <View style={styles.box}>
              <Text style={styles.boxTitle}>Hình ảnh</Text>
              <View style={styles.imageContainer}>
                
                {locationData.imageDesc.split(';').map((imageUrl, index) => (
                  <Image key={index} source={{ uri: imageUrl.trim() }} style={styles.image} />
                ))}
              </View>
            </View>
          </>
        ) : (
          <Text style={styles.loadingText}>Loading...</Text>
        )}
      </ScrollView>
      <View style={styles.bottomMenu}>
        <View style={styles.bottomMenuContainer}>
          <TouchableOpacity style={styles.menuItem}>
            <Icon name="home" size={30} color="black" />
            <Text style={styles.menuText}>Home</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuItem}>
            <Icon name="calendar" size={30} color="black" />
            <Text style={styles.menuText}>Calendar</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuItem}>
            <Icon name="search" size={30} color="black" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuItem}>
            <Icon3 name="message1" size={30} color="black" />
            <Text style={styles.menuText}>Messages</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuItem}>
            <Icon2 name="person" size={30} color="black" />
            <Text style={styles.menuText}>Profile</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(36, 186, 236, 0.60)',
  },
  place: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  textContainer: {
    position: 'absolute',
    bottom: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 10,
    padding: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  locationText: {
    textAlign: 'center',
    color: 'black',
    fontSize: 24,
    fontWeight: 'bold',
  },
  locationImage: {
    width: windowWidth,
    height: 220,
    resizeMode: 'cover',
  },
  box: {
    width: windowWidth,
    backgroundColor: 'white',
    marginBottom: 10,
    padding: 10,
  },
  boxTitle: {
    color: 'black',
    fontSize: 24,
    fontWeight: 'bold',
  },
  boxText: {
    color: 'black',
    fontSize: 16,
    fontWeight: 'normal',
  },
  imageContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    flexWrap: 'wrap',
    marginBottom: 5,
  },
  image: {
    width: 120,
    height: 120,
    margin: 5,
    resizeMode: 'cover',
  },
  bottomMenu: {
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    bottom: 0,
    width: windowWidth,
  },
  bottomMenuContainer: {
    flexDirection: 'row',
    backgroundColor: 'white',
    overflow: 'hidden',
    width: windowWidth,
  },
  menuItem: {
    flex: 1,
    height: 60,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuText: {
    color: 'black',
    fontSize: 16,
    fontWeight: '500',
    fontFamily: 'Inter',
    marginTop: 5,
  },
  loadingText: {
    textAlign: 'center',
    fontSize: 20,
    marginTop: 20,
    color: 'black',
  },
});

export default Describe;
