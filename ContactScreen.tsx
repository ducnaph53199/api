// ContactScreen.js
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Linking } from 'react-native';

const ContactScreen = () => {
  const handleEmailPress = () => {
    Linking.openURL('mailto:support@example.com');
  };

  const handlePhonePress = () => {
    Linking.openURL('tel:+1234567890');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.headerText}>Liên Hệ</Text>
      <Text style={styles.subHeaderText}>Chúng tôi luôn sẵn sàng hỗ trợ bạn</Text>

      <TouchableOpacity style={styles.contactButton} onPress={handlePhonePress}>
        <Text style={styles.contactText}>Gọi Điện: +1234567890</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.contactButton} onPress={handleEmailPress}>
        <Text style={styles.contactText}>Email: support@example.com</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'gray',
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerText: {
    fontSize: 28,
    color: '#fff',
    fontWeight: 'bold',
    marginBottom: 20,
  },
  subHeaderText: {
    fontSize: 18,
    color: 'black',
    marginBottom: 20,
  },
  contactButton: {
    backgroundColor: 'orange',
    padding: 15,
    borderRadius: 10,
    width: '80%',
    marginBottom: 15,
    alignItems: 'center',
  },
  contactText: {
    fontSize: 18,
    color: '#fff',
  },
});

export default ContactScreen;
