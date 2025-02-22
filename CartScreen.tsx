import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, FlatList, Image, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';

const link_apiCart = 'http://10.0.2.2:3000/cart';

const CartScreen = ({ navigation }) => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchCartData = async (retryCount = 3) => {
    try {
      const response = await fetch(link_apiCart, { timeout: 2000 });
      if (!response.ok) throw new Error(`Lỗi server: ${response.status}`);
      const data = await response.json();
      console.log('Fetched cart data:', data);

      const normalizedData = data.map(item => ({
        ...item,
        quantity: item.quantity || 1,
        gia: typeof item.gia === 'string' ? parseFloat(item.gia.replace('Vnd', '')) || 0 : item.gia || 0,
      }));
      setCartItems(normalizedData);
      setError(null);
    } catch (error) {
      console.error('Error fetching cart data:', error);
      if (retryCount > 0) {
        console.log(`Retrying... Attempts left: ${retryCount}`);
        setTimeout(() => fetchCartData(retryCount - 1), 2000);
      } else {
        setError(error.message || 'Không thể kết nối đến server');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCartData();
    const unsubscribe = navigation.addListener('focus', fetchCartData);
    return unsubscribe;
  }, [navigation]);

  const calculateTotal = () => {
    const total = cartItems.reduce((sum, item) => sum + item.gia * item.quantity, 0);
    return total.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
  };

  const updateQuantity = async (id, change) => {
    try {
      const updatedItems = cartItems.map(item =>
        item.id === id ? { ...item, quantity: Math.max(1, item.quantity + change) } : item
      );
      setCartItems(updatedItems);

      const newQuantity = updatedItems.find(i => i.id === id).quantity;
      console.log(`Updating item ${id} with quantity: ${newQuantity}`);

      const response = await fetch(`${link_apiCart}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ quantity: newQuantity }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Cập nhật thất bại: ${response.status} - ${errorText}`);
      }

      console.log(`Successfully updated quantity for item ${id}`);
    } catch (error) {
      console.error('Error updating quantity:', error.message);
      setError(error.message.includes('404') ? 'Sản phẩm không tồn tại' : 'Lỗi cập nhật số lượng');
      await fetchCartData();
      setTimeout(() => setError(null), 3000);
    }
  };

  const removeItem = (id) => {
    Alert.alert(
      'Xác nhận xóa',
      'Bạn có chắc muốn xóa sản phẩm này khỏi giỏ hàng?',
      [
        { text: 'Hủy', style: 'cancel' },
        {
          text: 'Xóa',
          style: 'destructive',
          onPress: async () => {
            try {
              const response = await fetch(`${link_apiCart}/${id}`, { method: 'DELETE' });
              if (!response.ok) throw new Error('Xóa thất bại');
              setCartItems(prevItems => prevItems.filter(item => item.id !== id));
            } catch (error) {
              console.error('Error deleting item:', error);
              setError('Không thể xóa sản phẩm');
              await fetchCartData();
              setTimeout(() => setError(null), 3000);
            }
          },
        },
      ]
    );
  };

  const renderItem = ({ item }) => (
    <View style={styles.item}>
      <Image source={{ uri: item.image }} style={styles.itemImage} />
      <View style={styles.itemDetails}>
        <Text style={styles.itemName}>{item.name}</Text>
        <Text style={styles.itemPrice}>
          {(item.gia * item.quantity).toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}
        </Text>
        <View style={styles.quantityContainer}>
          <TouchableOpacity
            style={styles.quantityButton}
            onPress={() => updateQuantity(item.id, -1)}
            activeOpacity={0.7}
          >
            <Text style={styles.quantityButtonText}>-</Text>
          </TouchableOpacity>
          <Text style={styles.quantity}>{item.quantity}</Text>
          <TouchableOpacity
            style={styles.quantityButton}
            onPress={() => updateQuantity(item.id, 1)}
            activeOpacity={0.7}
          >
            <Text style={styles.quantityButtonText}>+</Text>
          </TouchableOpacity>
        </View>
      </View>
      <TouchableOpacity
        style={styles.removeButton}
        onPress={() => removeItem(item.id)}
        activeOpacity={0.7}
      >
        <Text style={styles.removeButtonText}>Xóa</Text>
      </TouchableOpacity>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#007bff" />
        <Text style={styles.loadingText}>Đang tải giỏ hàng...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>Lỗi: {error}</Text>
        <TouchableOpacity
          style={styles.retryButton}
          onPress={() => {
            setLoading(true);
            fetchCartData();
          }}
          activeOpacity={0.7}
        >
          <Text style={styles.retryButtonText}>Thử lại</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.headerText}>Danh Sách Giỏ Hàng</Text>
      <FlatList
        data={cartItems}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        ListEmptyComponent={<Text style={styles.emptyText}>Giỏ hàng của bạn đang trống</Text>}
        contentContainerStyle={styles.listContainer}
      />
      <View style={styles.totalContainer}>
        <Text style={styles.totalText}>Tổng cộng: {calculateTotal()}</Text>
        <TouchableOpacity style={styles.checkoutButton} activeOpacity={0.7}>
          <Text style={styles.checkoutButtonText}>Thanh toán</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    paddingHorizontal: 15,
  },
  headerText: {
    fontSize: 28,
    color: '#333',
    fontWeight: '700',
    marginVertical: 20,
    textAlign: 'center',
  },
  listContainer: {
    paddingBottom: 100,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
  },
  item: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    padding: 15,
    marginVertical: 8,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
    alignItems: 'center',
  },
  itemImage: {
    width: 70,
    height: 70,
    borderRadius: 8,
    backgroundColor: '#eee',
  },
  itemDetails: {
    flex: 1,
    marginLeft: 15,
  },
  itemName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  itemPrice: {
    fontSize: 15,
    color: '#e91e63',
    marginVertical: 5,
    fontWeight: '500',
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    // backgroundColor: '#f1f3f5',
    borderRadius: 20,
    padding: 5,
  },
  quantityButton: {
    width: 32,
    height: 32,
    // backgroundColor: '#007bff',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantityButtonText: {
    fontSize: 20,
    color: 'black',
    fontWeight: 'bold',
  },
  quantity: {
    fontSize: 16,
    marginHorizontal: 15,
    color: '#333',
    fontWeight: '500',
  },
  removeButton: {
    backgroundColor: 'orange',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 20,
  },
  removeButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  totalContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderColor: '#e9ecef',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
  },
  totalText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
    textAlign: 'right',
    marginBottom: 10,
  },
  checkoutButton: {
    backgroundColor: '#007bff',
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: 'center',
  },
  checkoutButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  loadingText: {
    marginTop: 15,
    fontSize: 16,
    color: '#666',
    fontStyle: 'italic',
  },
  errorText: {
    fontSize: 16,
    color: '#ff4d4f',
    textAlign: 'center',
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: '#007bff',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 25,
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  emptyText: {
    fontSize: 18,
    color: '#666',
    textAlign: 'center',
    marginTop: 50,
    fontStyle: 'italic',
  },
});

export default CartScreen;