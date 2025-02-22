import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Image, Alert, TextInput, Modal, Button } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

const link_api = 'http://10.0.2.2:3000/product';

const HomeScreen = ({ navigation }) => {
  const [dsMenu, setDsMenu] = useState(null);
  const [dialog, setDialog] = useState(false);
  const [update, setDialogUpdate] = useState(false);
  const [objUp, setObjUp] = useState(null);

  // Khai báo state cho thêm sản phẩm
  const [name, setName] = useState('');
  const [mota, setMota] = useState('');
  const [image, setImage] = useState('');
  const [gia, setGia] = useState('');

  // Fetch dữ liệu
  const laydulieu = async () => {
    try {
      let kq = await fetch(link_api);
      let arrJson = await kq.json();
      setDsMenu(arrJson);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    laydulieu();
  }, []);

  // Thêm sản phẩm
  const handleAddProduct = async () => {
    try {
      let obj = {
        name: name,
        mota: mota,
        image: image,
        gia: Number(gia), // Chuyển thành số
      };
      await fetch(link_api, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(obj),
      });
      laydulieu();
      setName('');
      setMota('');
      setImage('');
      setGia('');
      setDialog(false);
    } catch (error) {
      Alert.alert("Bug");
      console.log(error);
    }
  };

  // Sửa sản phẩm
  const [nameUp, setNameUp] = useState('');
  const [motaUp, setMotaUp] = useState('');
  const [imageUp, setImageUp] = useState('');
  const [giaUp, setGiaUp] = useState('');

  const handleEditProduct = async () => {
    try {
      let data = {
        name: nameUp,
        mota: motaUp,
        image: imageUp,
        gia: Number(giaUp), // Chuyển thành số
      };
      let kq = await fetch(link_api + '/' + objUp.id, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      let json = await kq.json();
      console.log(json);
      laydulieu();
      setObjUp(null);
      setNameUp('');
      setMotaUp('');
      setImageUp('');
      setGiaUp('');
      setDialogUpdate(false);
    } catch (error) {
      console.log(error);
    }
  };

  const showFormUpdate = (item) => {
    setObjUp(item);
    setNameUp(item.name);
    setMotaUp(item.mota);
    setImageUp(item.image);
    setGiaUp(item.gia);
    setDialogUpdate(true);
  };

  // Xóa sản phẩm
  const handleDeleteProduct = async (id) => {
    try {
      Alert.alert("Thông báo", `Bạn có chắc muốn xóa ${id} không?`, [
        {
          text: 'Không xóa',
          onPress: () => { console.log('Bạn không xóa'); },
          style: 'cancel',
        },
        {
          text: 'Có xóa',
          onPress: async () => {
            await fetch(link_api + '/' + id, { method: 'DELETE' });
            Alert.alert('Đã xóa');
            laydulieu();
          },
        },
      ]);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <View style={st.container}>
      <Text style={st.headerText}>Menu</Text>

      <FlatList
        data={dsMenu}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => navigation.navigate('ProductDetailScreen', { product: item })}>
            <View style={st.productContainer}>
              <Image source={{ uri: item.image }} style={st.productImage} />
              <View style={st.productDetails}>
                <Text style={st.productTitle}>{item.name}</Text>
                <Text style={st.productDescription}>{item.mota}</Text>
                <Text style={st.productPrice}>{Number(item.gia).toLocaleString('vi-VN')} VNĐ</Text>

                <View style={st.productActions}>
                  <TouchableOpacity onPress={() => showFormUpdate(item)} style={st.actionButton}>
                    <Text style={{ color: '#fff', fontSize: 15 }}>Sửa</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => handleDeleteProduct(item.id)} style={st.actionButton}>
                    <Text style={{ color: '#fff', fontSize: 15 }}>Xóa</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </TouchableOpacity>
        )}
        numColumns={2}
        contentContainerStyle={st.productList}
      />

      {/* Modal Thêm */}
      <Modal visible={dialog} transparent={true}>
        <View style={st.modal}>
          <View style={st.modalContent}>
            <Text>Thêm sản phẩm</Text>
            <TextInput style={st.input} placeholder="Tên sản phẩm" onChangeText={setName} value={name} />
            <TextInput style={st.input} placeholder="Mô tả" onChangeText={setMota} value={mota} />
            <TextInput style={st.input} placeholder="Link hình ảnh" onChangeText={setImage} value={image} />
            <TextInput style={st.input} placeholder="Giá" onChangeText={setGia} value={gia} keyboardType="numeric" />
            <Button title="Thêm" onPress={handleAddProduct} />
            <View style={{ marginTop: 10 }}>
              <Button title="Đóng" onPress={() => setDialog(false)} />
            </View>
          </View>
        </View>
      </Modal>

      {/* Modal Sửa */}
      <Modal visible={update} transparent={true} onRequestClose={() => setDialogUpdate(false)}>
        <View style={st.modal}>
          <View style={st.modalContent}>
            <Text>Sửa sản phẩm</Text>
            <TextInput style={st.input} placeholder="Tên sản phẩm" onChangeText={setNameUp} value={nameUp} />
            <TextInput style={st.input} placeholder="Mô tả" onChangeText={setMotaUp} value={motaUp} />
            <TextInput style={st.input} placeholder="Link hình ảnh" onChangeText={setImageUp} value={imageUp} />
            <TextInput style={st.input} placeholder="Giá" onChangeText={setGiaUp} value={giaUp} keyboardType="numeric" />
            <Button title="Cập nhật" onPress={handleEditProduct} />
            <View style={{ marginTop: 10 }}>
              <Button title="Hủy" onPress={() => setDialogUpdate(false)} />
            </View>
          </View>
        </View>
      </Modal>

      <TouchableOpacity style={st.floatingButton} onPress={() => setDialog(true)}>
        <Text style={st.floatingButtonText}>+</Text>
      </TouchableOpacity>
    </View>
  );
};

const st = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
    padding: 10,
  },
  headerText: {
    fontSize: 28,
    color: '#333',
    textAlign: 'center',
    fontWeight: 'bold',
    marginBottom: 20,
  },
  productList: {
    paddingBottom: 20,
  },
  productContainer: {
    flex: 1,
    backgroundColor: '#f8f8f8',
    margin: 10,
    borderRadius: 10,
    overflow: 'hidden',
  },
  productImage: {
    width: 175,
    height: 175,
  },
  productDetails: {
    padding: 10,
  },
  productTitle: {
    fontSize: 18,
    fontWeight: 'bold',
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
    fontWeight: 'bold',
    marginBottom: 10,
  },
  productActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionButton: {
    backgroundColor: '#FF7A3D',
    padding: 5,
    borderRadius: 5,
  },
  floatingButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: '#ff6347',
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
  },
  floatingButtonText: {
    fontSize: 30,
    color: '#fff',
  },
  modal: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    width: '80%',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginVertical: 5,
  },
});

export default HomeScreen;