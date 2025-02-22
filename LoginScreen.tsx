import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const link_ApiUser = 'http://10.0.2.2:3000/user';

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async () => {
    try {
      const response = await fetch(link_ApiUser);
      const users = await response.json();
      const user = users.find(user => user.email === email && user.pwd === password);

      if (user) {
        setError('');
        navigation.navigate('Menu'); // Navigate to Menu (BottomTabNavigator)
      } else {
        setError('Invalid email or password. Try again!');
      }
    } catch (error) {
      Alert.alert('Error', 'An error occurred. Please try again.');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <Image source={require('../assets/images/logo.png')} />
      </View>

      <Text style={styles.welcomeText}>Welcome</Text>
      <Text style={styles.loginText}>Login to Continue</Text>

      <TextInput
        style={styles.input}
        placeholder="Email Address"
        placeholderTextColor="#A8A8A8"
        value={email}
        onChangeText={setEmail}
      />

      <TextInput
        style={[styles.input, error ? styles.inputError : null]}
        placeholder="Password"
        placeholderTextColor="#A8A8A8"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      {error ? <Text style={styles.errorText}>{error}</Text> : null}

      <TouchableOpacity style={styles.signInButton} onPress={handleLogin}>
        <Text style={styles.buttonText}>Sign In</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('RegisterScreen')} style={styles.googleButton}>
        <Text style={styles.buttonText}>Sign up</Text>
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
  logoContainer: {
    marginBottom: 30,
  },
  welcomeText: {
    fontSize: 28,
    color: '#fff',
    fontWeight: 'bold',
  },
  loginText: {
    fontSize: 16,
    color: '#fff',
    marginBottom: 40,
  },
  input: {
    width: '100%',
    height: 50,
    backgroundColor: '#1D2329',
    color: '#fff',
    paddingLeft: 10,
    marginBottom: 15,
    borderRadius: 5,
  },
  inputError: {
    borderWidth: 1,
    borderColor: 'red',
  },
  errorText: {
    color: 'red',
    marginBottom: 15,
    fontSize: 14,
    fontWeight: 'bold',
  },
  signInButton: {
    backgroundColor: 'orange',
    width: '100%',
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
    marginBottom: 15,
  },
  googleButton: {
    backgroundColor: 'orange',
    width: '100%',
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
    marginBottom: 30,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  linksContainer: {
    width: '100%',
    alignItems: 'center',
  },
  linkText: {
    color: '#FF7A3D',
    marginBottom: 5,
    textAlign: 'center',
  },
});

export default LoginScreen;