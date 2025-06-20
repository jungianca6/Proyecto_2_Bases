import {useRouter} from 'expo-router';
import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView } from 'react-native';

export default function Register() {
    const router = useRouter();

    const [data, setData] = useState({
        cedula: '',
        edad: '',
        usuario: '',
        peso: '',
        nombre: '',
        imc: '',
        apellido1: '',
        direccion: '',
        apellido2: '',
        contrasena: '',
        correo: '',
        nacimiento: '',
        telefono: ''
    });

    const handleChange = (name, value) => {
        setData(prev => ({ ...prev, [name]: value }));
    };

    const handleRegister = () => {
        alert('Registro completado (simulado)');
        router.replace('/home');
    };

    return (
        <ScrollView contentContainerStyle={{ flexGrow: 1, padding: 20, backgroundColor: '#56ab2f' }}>
            <Text style={{ fontSize: 26, fontWeight: 'bold', textAlign: 'center', marginBottom: 30 }}>
                Registro de Cliente
            </Text>

            {/* Primera columna */}
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <View style={{ width: '48%' }}>
                    <TextInput
                        placeholder="Cédula"
                        value={data.cedula}
                        onChangeText={(text) => handleChange('cedula', text)}
                        style={styles.input}
                    />

                    <TextInput
                        placeholder="Edad"
                        value={data.edad}
                        onChangeText={(text) => handleChange('edad', text)}
                        keyboardType="numeric"
                        style={styles.input}
                    />

                    {/* Repite para los demás campos de la columna izquierda */}
                    <TextInput
                        placeholder="Usuario"
                        value={data.usuario}
                        onChangeText={(text) => handleChange('usuario', text)}
                        style={styles.input}
                    />

                    <TextInput
                        placeholder="Nombre"
                        value={data.nombre}
                        onChangeText={(text) => handleChange('nombre', text)}
                        style={styles.input}
                    />

                    <TextInput
                        placeholder="Apellido 1"
                        value={data.apellido1}
                        onChangeText={(text) => handleChange('apellido1', text)}
                        style={styles.input}
                    />
                </View>

                {/* Segunda columna */}
                <View style={{ width: '48%' }}>
                    <TextInput
                        placeholder="Peso (kg)"
                        value={data.peso}
                        onChangeText={(text) => handleChange('peso', text)}
                        keyboardType="numeric"
                        style={styles.input}
                    />

                    <TextInput
                        placeholder="IMC"
                        value={data.imc}
                        onChangeText={(text) => handleChange('imc', text)}
                        keyboardType="numeric"
                        style={styles.input}
                    />

                    {/* Repite para los demás campos de la columna derecha */}
                    <TextInput
                        placeholder="Dirección"
                        value={data.direccion}
                        onChangeText={(text) => handleChange('direccion', text)}
                        style={styles.input}
                    />

                    <TextInput
                        placeholder="Contraseña"
                        value={data.contrasena}
                        onChangeText={(text) => handleChange('contrasena', text)}
                        secureTextEntry
                        style={styles.input}
                    />

                    <TextInput
                        placeholder="dd/mm/aaaa"
                        value={data.nacimiento}
                        onChangeText={(text) => handleChange('nacimiento', text)}
                        style={styles.input}
                    />
                </View>
            </View>

            {/* Campos de ancho completo */}
            <TextInput
                placeholder="Apellido 2"
                value={data.apellido2}
                onChangeText={(text) => handleChange('apellido2', text)}
                style={styles.input}
            />

            <TextInput
                placeholder="Correo"
                value={data.correo}
                onChangeText={(text) => handleChange('correo', text)}
                keyboardType="email-address"
                style={styles.input}
            />

            <TextInput
                placeholder="Teléfono"
                value={data.telefono}
                onChangeText={(text) => handleChange('telefono', text)}
                keyboardType="phone-pad"
                style={styles.input}
            />

            {/* Botones */}
            <TouchableOpacity
                onPress={handleRegister}
                style={styles.mainButton}
            >
                <Text style={styles.buttonText}>Registrarse</Text>
            </TouchableOpacity>

            <TouchableOpacity
                onPress={() => router.replace('/')}
                style={styles.secondaryButton}
            >
                <Text style={styles.buttonText}>¿Ya tienes cuenta? Inicia sesión</Text>
            </TouchableOpacity>
        </ScrollView>
    );
}

const styles = {
    input: {
        borderWidth: 1,
        padding: 10,
        borderRadius: 10,
        marginBottom: 15,
        backgroundColor: '#2e7d32',
        color: '#fff'
    },
    mainButton: {
        backgroundColor: '#2e7d32',
        padding: 14,
        borderRadius: 10,
        marginTop: 25,
        alignItems: 'center'
    },
    secondaryButton: {
        padding: 14,
        marginTop: 15,
        alignItems: 'center'
    },
    buttonText: {
        color: '#fff',
        fontWeight: 'bold'
    }
};



