import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, Alert } from 'react-native';

const link_ApiUser = 'http://10.0.2.2:3000/user';

const RegisterScreen = ({ navigation }) => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [retypePassword, setRetypePassword] = useState('');
    const [error, setError] = useState('');

    const handleRegister = async () => {
        if (password !== retypePassword) {
            setError('Passwords do not match!');
        } else {
            setError('');
            try {
                const response = await fetch(link_ApiUser, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        username: name,
                        email: email,
                        pwd: password,

                    }),
                });

                if (response.ok) {
                    Alert.alert('Success', 'Registration successful!', [
                        { text: 'OK', onPress: () => navigation.navigate('LoginScreen') },
                    ]);
                } else {
                    Alert.alert('Error', 'Registration failed. Please try again.');
                }
            } catch (error) {
                Alert.alert('Error', 'An error occurred. Please try again.');
            }
        }
    };

    return (
        <View style={styles.container}>
            {/* Logo */}
            <View style={styles.logoContainer}>
                <Image source={require('../assets/images/logo.png')} />
            </View>
            {/* Welcome Text */}
            <Text style={styles.welcomeText}>Welcome</Text>
            <Text style={styles.loginText}>Register to Continue</Text>

            {/* Name Input */}
            <TextInput
                style={styles.input}
                placeholder="Name"
                placeholderTextColor="#A8A8A8"
                value={name}
                onChangeText={setName}
            />

            {/* Email Input */}
            <TextInput
                style={styles.input}
                placeholder="Email Address"
                placeholderTextColor="#A8A8A8"
                value={email}
                onChangeText={setEmail}
            />

            {/* Password Input */}
            <TextInput
                style={styles.input}
                placeholder="Password"
                placeholderTextColor="#A8A8A8"
                secureTextEntry
                value={password}
                onChangeText={setPassword}
            />

            {/* Re-type Password Input */}
            <TextInput
                style={[styles.input, error ? styles.inputError : null]} // Apply error style when there's an error
                placeholder="Re-type Password"
                placeholderTextColor="#A8A8A8"
                secureTextEntry
                value={retypePassword}
                onChangeText={setRetypePassword}
            />

            {/* Error Message */}
            {error ? <Text style={styles.errorText}>{error}</Text> : null}

            {/* Register Button */}
            <TouchableOpacity style={styles.registerButton} onPress={handleRegister}>
                <Text style={styles.buttonText}>Register</Text>
            </TouchableOpacity>

            {/* Sign In Link */}
            <View style={styles.linksContainer}>
                <TouchableOpacity onPress={() => navigation.navigate('LoginScreen')}>
                    <Text style={styles.linkText}>You have an account? Click Sign in</Text>
                </TouchableOpacity>
            </View>
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
    logo: {
        fontSize: 40,
        fontWeight: 'bold',
        color: '#FF7A3D',
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
    registerButton: {
        backgroundColor: 'orange',
        width: '100%',
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 5,
        marginBottom: 15,
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
        color: '#fff',
        marginBottom: 5,
        textAlign: 'center',
    },
});

export default RegisterScreen;