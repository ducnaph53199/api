import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Image, ActivityIndicator, Alert } from 'react-native';

const link_apiCategory = 'http://10.0.2.2:3000/category';

const FavoriteList = ({ navigation }) => {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchFavorites = async () => {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);

      const response = await fetch(link_apiCategory, { signal: controller.signal });
      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`Lỗi server: ${response.status}`);
      }

      const data = await response.json();
      console.log('Dữ liệu từ API:', data);
      if (!Array.isArray(data)) {
        throw new Error('Dữ liệu không đúng định dạng');
      }

      // Chuẩn hóa dữ liệu
      const normalizedData = data.map(item => ({
        ...item,
        price: typeof item.price === 'string' ? parseFloat(item.price.replace('VND', '')) || 0 : item.price || item.gia || 0,
        title: item.title || item.name || 'Không có tiêu đề',
        description: item.description || item.mota || 'Không có mô tả',
      }));

      setFavorites(normalizedData);
      setError(null);
    } catch (err) {
      console.error('Error fetching favorites:', err);
      setError(err.message || 'Không thể tải danh sách yêu thích');
    } finally {
      setLoading(false);
    }
  };

  const removeFavorite = (id) => {
    Alert.alert(
      'Xác nhận xóa',
      'Bạn có chắc muốn xóa sản phẩm này khỏi danh sách yêu thích?',
      [
        { text: 'Hủy', style: 'cancel' },
        {
          text: 'Xóa',
          style: 'destructive',
          onPress: async () => {
            try {
              setLoading(true);
              setFavorites(prev => prev.filter(item => item.id !== id));

              const response = await fetch(`${link_apiCategory}/${id}`, {
                method: 'DELETE',
              });

              if (!response.ok) {
                throw new Error('Xóa thất bại');
              }
            } catch (err) {
              console.error('Error removing favorite:', err);
              setError('Không thể xóa, đang đồng bộ lại...');
              await fetchFavorites();
              setTimeout(() => setError(null), 3000);
            } finally {
              setLoading(false);
            }
          },
        },
      ]
    );
  };

  useEffect(() => {
    fetchFavorites();
    const unsubscribe = navigation.addListener('focus', fetchFavorites);
    return unsubscribe;
  }, [navigation]);

  const renderItem = ({ item }) => (
    <View style={styles.favoriteItem}>
      <Image source={{ uri: item.image }} style={styles.productImage} />
      <View style={styles.productDetails}>
        <Text style={styles.productTitle}>{item.title}</Text>
        <Text style={styles.productDescription}>{item.description}</Text>
        <Text style={styles.productPrice}>
          {item.price.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}
        </Text>
        <TouchableOpacity
          style={styles.removeButton}
          onPress={() => removeFavorite(item.id)}
          disabled={loading}
          activeOpacity={0.7}
        >
          <Text style={styles.removeButtonText}>Xóa</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  if (loading && favorites.length === 0) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#FF7A3D" />
        <Text style={styles.loadingText}>Đang tải danh sách yêu thích...</Text>
      </View>
    );
  }

  if (error && favorites.length === 0) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>Lỗi: {error}</Text>
        <TouchableOpacity
          style={styles.retryButton}
          onPress={() => {
            setLoading(true);
            fetchFavorites();
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
      <Text style={styles.headerText}>Danh Sách Yêu Thích</Text>
      <FlatList
        data={favorites}
        renderItem={renderItem}
        keyExtractor={item => item.id ? item.id.toString() : Math.random().toString()}
        contentContainerStyle={styles.productList}
        ListEmptyComponent={<Text style={styles.emptyText}>Danh sách yêu thích trống</Text>}
      />
      {loading && <ActivityIndicator size="small" color="#FF7A3D" style={styles.loadingOverlay} />}
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
  favoriteItem: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    marginVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
    alignItems: 'center',
  },
  productImage: {
    width: 100,
    height: 100,
    borderRadius: 8,
    backgroundColor: '#eee',
    marginRight: 15,
  },
  productDetails: {
    flex: 1,
  },
  productTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 5,
  },
  productDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  productPrice: {
    fontSize: 16,
    color: '#FF7A3D',
    fontWeight: '500',
    marginBottom: 10,
  },
  removeButton: {
    backgroundColor: 'orange',
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 20,
    alignItems: 'center',
  },
  removeButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
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
    backgroundColor: '#FF7A3D',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 25,
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  productList: {
    paddingBottom: 20,
  },
  emptyText: {
    fontSize: 18,
    color: '#666',
    textAlign: 'center',
    marginTop: 50,
    fontStyle: 'italic',
  },
  loadingOverlay: {
    position: 'absolute',
    top: 10,
    right: 10,
  },
});

export default FavoriteList;