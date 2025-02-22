import React from 'react';
import { StyleSheet, Text, View, Image, Button, TouchableOpacity, Alert } from 'react-native';

const link_apiCart = 'http://10.0.2.2:3000/cart';
const link_apiCategory = 'http://10.0.2.2:3000/category';

const ProductDetailScreen = ({ route, navigation }) => {
  const { product, fetchFavorites } = route.params; // Nhận fetchFavorites từ params

  const addToCart = async () => {
    try {
      const response = await fetch(link_apiCart, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: product.name,
          mota: product.mota,
          image: product.image,
          gia: Number(product.gia), // Chuyển thành số
          id: product.id,
          quantity: 1,
        }),
      });

      if (response.ok) {
        Alert.alert('Đã thêm vào giỏ hàng');
      } else {
        Alert.alert('Có lỗi xảy ra, vui lòng thử lại');
      }
    } catch (error) {
      Alert.alert('Có lỗi xảy ra, vui lòng thử lại');
    }
  };

  const addToCategory = async () => {
    try {
      const response = await fetch(link_apiCategory, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: product.name,
          description: product.mota,
          image: product.image,
          price: Number(product.gia), // Chuyển thành số
          id: product.id,
        }),
      });

      if (response.ok) {
        Alert.alert('Đã thêm vào yêu thích');
        if (fetchFavorites) {
          fetchFavorites();
        }
      } else {
        Alert.alert('Có lỗi xảy ra, vui lòng thử lại');
      }
    } catch (error) {
      Alert.alert('Có lỗi xảy ra, vui lòng thử lại');
    }
  };

  return (
    <View style={styles.container}>
      <Image source={{ uri: product.image }} style={styles.image} />
      <Text style={styles.title}>Tên Pet: {product.name}</Text>
      <Text style={styles.price}>Giá: {Number(product.gia).toLocaleString('vi-VN')} VNĐ</Text>
      <Text style={styles.description}>Mô tả: {product.mota}</Text>
      <View style={styles.actions}>
        <TouchableOpacity style={styles.favoriteButton}>
          <Button title="Yêu thích" onPress={addToCategory} />
        </TouchableOpacity>
        <Button title="Thêm vào giỏ hàng" onPress={addToCart} />
      </View>
    </View>
  );
};

export default ProductDetailScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  image: {
    width: '100%',
    height: 300,
    resizeMode: 'contain',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginVertical: 10,
  },
  price: {
    fontSize: 20,
    color: 'green',
    marginVertical: 10,
  },
  description: {
    fontSize: 16,
    color: '#666',
    marginVertical: 10,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 20,
  },
  favoriteButton: {
    padding: 10,
  },
});