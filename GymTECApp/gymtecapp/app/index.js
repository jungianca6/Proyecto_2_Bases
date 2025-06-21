import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
    Text,
    View,
    TextInput,
    TouchableOpacity,
    ImageBackground,
    StyleSheet
} from "react-native";

export default function Login() {
    const router = useRouter();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = () => {
        if (username === 'cliente' && password === 'cliente123') {
            alert('Logeo exitoso');
            router.replace('/home');
        } else {
            alert('Credenciales incorrectas');
        }
    };

    return (
        <ImageBackground
            source={require('../assets/FondoLogin.jpg')}
            style={styles.backgroundImage}
            resizeMode="cover"
        >
            <View style={styles.container}>
                <Text style={styles.title}>GymTec</Text>

                <TextInput
                    placeholder="Usuario"
                    placeholderTextColor="#fff"
                    value={username}
                    onChangeText={setUsername}
                    autoCapitalize="none"
                    style={styles.input}
                />

                <TextInput
                    placeholder="Contraseña"
                    placeholderTextColor="#fff"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                    onSubmitEditing={handleLogin}
                    style={styles.input}
                />

                <TouchableOpacity
                    onPress={handleLogin}
                    style={styles.loginButton}
                >
                    <Text style={styles.buttonText}>Ingresar</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    onPress={() => router.replace('/register')}
                    style={styles.registerLink}
                >
                    <Text style={styles.linkText}>
                        ¿No tienes cuenta? Regístrate
                    </Text>
                </TouchableOpacity>
            </View>
        </ImageBackground>
    );
}

const styles = StyleSheet.create({
    backgroundImage: {
        flex: 1,
        justifyContent: 'center',
    },
    container: {
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        padding: 20,
        margin: 20,
        borderRadius: 15,
    },
    title: {
        fontSize: 26,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 30,
        color: '#fff'
    },
    input: {
        borderWidth: 1,
        borderColor: 'black',
        padding: 15,
        borderRadius: 10,
        marginBottom: 15,
        //backgroundColor: 'rgba(46, 125, 50, 0.7)',
        color: '#fff',
        fontSize: 16
    },
    loginButton: {
        backgroundColor: '#fff',
        padding: 15,
        borderRadius: 10,
        marginTop: 25,
        alignItems: 'center'
    },
    buttonText: {
        color: 'black',
        fontWeight: 'bold',
        fontSize: 16
    },
    registerLink: {
        padding: 14,
        marginTop: 15,
        alignItems: 'center'
    },
    linkText: {
        color: '#fff',
        textDecorationLine: 'underline',
        fontSize: 14
    }
});