// Import thêm Modal từ thư viện React Native
import { useNavigation, useRoute } from '@react-navigation/native';
import { Alert } from 'react-native';
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, Image, TextInput, Modal } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import Icon2 from 'react-native-vector-icons/MaterialIcons';
import Icon3 from 'react-native-vector-icons/AntDesign';
import Icon4 from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';

const windowWidth = Dimensions.get('window').width;
interface LocationData {
  locationId: number;
  imageUrl: string;
  name: string;
  description: string;
  weather: string;
  traffic: string;
  rating: number;
  totalRate: number;
}

const Comment = () => {
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [rating, setRating] = useState<number | null>(null);
    const navigation = useNavigation();
  const route = useRoute();
  const [locationData, setLocationData] = useState<LocationData | null>(null);
  const locationId = route.params?.locationId;
  const userId=2;
  const [userReview, setUserReview] = useState(null);

  useEffect(() => {
    fetchLocationData();
  }, []);
  useEffect(() => {
    // Gọi backend để kiểm tra đánh giá của người dùng cho địa điểm
    checkUserReview();
  }, []);

  const checkUserReview = async () => {
    try {
        const response = await fetch(`http://172.20.10.12:8080/api/v1/review/rating/${locationId}/${userId}`);
        if (response.ok) {
            const reviewData = await response.json();
            setUserReview(reviewData);
        } else {
            console.error('Error checking user review:', response.status);
        }
    } catch (error) {
        console.error('Error checking user review:', error);
    }
  };

  const getUserInfo = async () => {
    try {
        const response = await fetch(`http://172.20.10.12:8080/api/v1/user/${userId}`);
        if (!response.ok) {
            throw new Error('Failed to fetch user info');
        }
        const userData = await response.json();
        console.log('User info:', userData);
        return userData;
    } catch (error) {
        console.error('Error fetching user info:', error);
        return null;
    }
};

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
  
    const toggleModal = () => {
      setIsModalVisible(!isModalVisible);
    };
  
    const handleRating = (stars: number) => {
        setRating(stars);
      };
  const handleOk = () => {
    // Xử lý khi người dùng nhấn OK
    if (rating !== null) {
      handleReview(rating);
      console.log('Đã đánh giá:', rating);
      checkUserReview();
    } else {
      // Xử lý khi người dùng chưa chọn rating
      Alert.alert('Vui lòng chọn rating trước khi đánh giá');
    }
    toggleModal();
  };
  const handleReview = async (stars: number) => {
    try {
        // Lấy thông tin user
        const userInfo = await getUserInfo();
        
        if (!userInfo) {
            throw new Error('User info not available');
        }

        // Tạo request body với thông tin user đã lấy được
        const requestBody = {
            location: locationData,
            user: userInfo,
            rating: stars,
        };

        console.log('Request body:', JSON.stringify(requestBody)); // Ghi log ra body của request

        const response = await fetch(`http://172.20.10.12:8080/api/v1/review/rating`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestBody),
        });

        if (!response.ok) {
            throw new Error('Error updating or creating review');
        }

        // Xử lý khi cập nhật hoặc tạo mới thành công
        console.log('Đánh giá đã được cập nhật hoặc tạo mới');
    } catch (error) {
        console.error('Error updating or creating review:', error);
        // Xử lý lỗi (nếu cần)
        Alert.alert('Có lỗi xảy ra khi cập nhật hoặc tạo mới đánh giá');
    }
};


  return (
    <View style={styles.container}>
      {locationData && (
        <View style={styles.place}>
          <Image source={{ uri: locationData.imageUrl }} style={styles.locationImage} />
          <View style={styles.textContainer}>
            <Text style={styles.locationText}>{locationData.name}</Text>
          </View>
        </View>
      )}

      {locationData && (  // Kiểm tra nếu locationData không null
        <View style={styles.box}>
          <Text style={styles.boxTitle}>Đánh giá</Text>
          <View style={styles.staritem}>
            {[...Array(Math.round(locationData.rating))].map((_, index) => (
              <Icon2 key={index} name="star" size={30} color="yellow" />
            ))}
          </View>
          <Text style={styles.boxtext1}>Từ {locationData.totalRate} đánh giá</Text>
          <Text style={styles.boxtext2}>Đánh giá của bạn</Text>
          <View style={styles.evaluate}>
            {userReview !== null ? (
              <View style={styles.staritem}>
                  {[...Array(Math.round(userReview.rating))].map((_, index) => (
                      <Icon2 key={index} name="star" size={30} color="yellow" />
                  ))}
              </View>
            ) : (
            <Text style={styles.boxtext1}>Chưa đánh giá</Text>
            )}
            <TouchableOpacity onPress={toggleModal}>
                <Text style={styles.boxtext3}>Đánh giá</Text>
            </TouchableOpacity>
          </View>

        </View>
      )}
      

      <View style={styles.box}>
        <Text style={styles.boxTitle}>Bình luận</Text>
        {/* <View style={styles.commentContainer}>
          <Icon4 name="person-circle" size={40} color="black" />
          <View style={styles.commentContent}>
            <View style={styles.commentHeader}>
              <Text style={styles.commenterName}>Dương Văn A</Text>
            </View>
            <Text style={styles.commentText}>Amazing!!!</Text>
          </View>
        </View>
        <View style={styles.commentContainer}>
          <Icon4 name="person-circle" size={40} color="black" />
          <View style={styles.commentContent}>
            <View style={styles.commentHeader}>
              <Text style={styles.commenterName}>Nguyễn Văn B</Text>
            </View>
            <Text style={styles.commentText}>thật là tuyện vời</Text>
          </View>
        </View> */}
        <View style={styles.mycommentContainer}>
          <Icon4 name="person-circle" size={40} color="black" />
          <TextInput
            style={styles.input}
            placeholder="Write a comment"
          />
          <TouchableOpacity>
            <Icon4 name="send" size={30} color="blue" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Thêm Modal */}
      <Modal visible={isModalVisible} transparent={true} animationType="fade">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Đánh giá</Text>
            <View style={styles.starContainer}>
              {[1, 2, 3, 4, 5].map((index) => (
                <TouchableOpacity key={index} onPress={() => handleRating(index)}>
                  <Icon2 name={index <= (rating || 0) ? 'star' : 'star-border'} size={40} color={index <= (rating || 0) ? 'yellow' : '#D3D3D3'} />
                </TouchableOpacity>
              ))}
            </View>
            <TouchableOpacity style={styles.okButton} onPress={handleOk}>
              <Text style={styles.okButtonText}>OK</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

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
  },
  boxTitle: {
    color: 'black',
    fontSize: 24,
    padding: 5,
    fontFamily: 'Inter',
    marginLeft: 10,
    fontWeight: 'bold',
  },
  staritem: {
    marginLeft: 10,
    flexDirection: 'row',
  },
  boxtext1: {
    marginLeft: 10,
    fontStyle: 'italic',
    fontSize: 20,
  },
  boxtext2: {
    color: 'black',
    fontSize: 20,
    padding: 5,
    fontFamily: 'Inter',
    marginLeft: 10,
  },
  boxtext3: {
    marginLeft: 10,
    fontStyle: 'italic',
    fontSize: 20,
    color: 'rgba(36, 186, 236, 0.60)',
  },
  evaluate: {
    flexDirection: 'row',
  },
  commentContainer: {
    marginLeft: 10,
    flexDirection: 'row',
    alignItems: 'center',
    width: 400,
  },
  commentContent: {
    marginLeft: 10,
    backgroundColor: '#D3D3D3',
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
  },
  commentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  commenterInfo: {
    backgroundColor: '#A9A9A9',
    padding: 5,
    borderRadius: 5,
  },
  commenterName: {
    color: 'black',
    fontSize: 16,
    fontWeight: 'bold',
  },
  commentText: {
    color: 'black',
    fontSize: 16,
  },
  mycommentContainer: {
    marginLeft: 10,
    flexDirection: 'row',
    alignItems: 'center',
    width: 400,
    marginBottom: 15,
  },
  input: {
    flex: 1,
    height: 40,
    paddingHorizontal: 10,
    backgroundColor: '#D3D3D3',
    borderRadius: 10,
  },
  bottomMenu: {
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    bottom: 0,
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
  // Thêm phần style cho Modal
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Màu nền mờ
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    width: 300,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  starContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 20,
  },
  okButton: {
    backgroundColor: 'blue',
    padding: 10,
    borderRadius: 5,
  },
  okButtonText: {
    color: 'white',
    fontSize: 18,
    textAlign: 'center',
  },
});

export default Comment;
