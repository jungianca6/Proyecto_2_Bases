import { useRouter } from 'expo-router';
import { useState } from 'react';
import {Text, View, TextInput, TouchableOpacity, Button} from "react-native";


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
        <View style={{ flex: 1, justifyContent: 'center', padding: 20, backgroundColor: '#56ab2f' }}>
            <Text style={{ fontSize: 26, fontWeight: 'bold', textAlign: 'center', marginBottom: 30 }}>
                GymTec
            </Text>

            <TextInput
                placeholder="Usuario"
                value={username}
                onChangeText={setUsername}
                autoCapitalize="none"
                style={{ borderWidth: 1, padding: 10, borderRadius: 10, marginBottom: 15, backgroundColor: '#2e7d32' }}

            />

            <TextInput
                placeholder="Contraseña"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                onSubmitEditing={handleLogin}
                style={{ borderWidth: 1, padding: 10, borderRadius: 10, backgroundColor: '#2e7d32' }}
            />

            <TouchableOpacity
                onPress={handleLogin}
                style={{
                    backgroundColor: '#2e7d32',
                    padding: 14,
                    borderRadius: 10,
                    marginTop: 25,
                }}
            >
                <Text style={{ color: 'white', textAlign: 'center', fontWeight: 'bold' }}>Entrar</Text>
            </TouchableOpacity>

            <TouchableOpacity
                onPress={() => router.replace('/register')}
                style={{
                    padding: 14,
                    marginTop: 15,
                    alignItems: 'center'
                }}
            >
                <Text style={{ color: '#fff', textDecorationLine: 'underline' }}>
                    ¿No tienes cuenta? Regístrate
                </Text>
            </TouchableOpacity>
        </View>
    );

}
