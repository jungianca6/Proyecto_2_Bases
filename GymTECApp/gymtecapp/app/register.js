import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    ScrollView,
    ImageBackground,
    StyleSheet
} from 'react-native';

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
        <ImageBackground
            source={require('../assets/FondoLogin.jpg')}
            style={styles.backgroundImage}
            resizeMode="cover"
        >
            <ScrollView contentContainerStyle={styles.scrollContainer}>
                <View style={styles.formContainer}>
                    <Text style={styles.title}>Registro de Cliente</Text>

                    {/* Contenido del formulario igual que antes */}
                    <View style={styles.columnsContainer}>
                        <View style={styles.column}>
                            {/* Campos de la columna izquierda */}
                            <TextInput
                                placeholder="Cédula"
                                placeholderTextColor="#fff"
                                value={data.cedula}
                                onChangeText={(text) => handleChange('cedula', text)}
                                style={styles.input}
                            />

                            <TextInput
                                placeholder="Usuario"
                                placeholderTextColor="#fff"
                                value={data.usuario}
                                onChangeText={(text) => handleChange('usuario', text)}
                                style={styles.input}
                            />

                            <TextInput
                                placeholder="Nombre"
                                placeholderTextColor="#fff"
                                value={data.nombre}
                                onChangeText={(text) => handleChange('nombre', text)}
                                style={styles.input}
                            />

                            <TextInput
                                placeholder="Apellido 1"
                                placeholderTextColor="#fff"
                                value={data.apellido1}
                                onChangeText={(text) => handleChange('apellido1', text)}
                                style={styles.input}
                            />

                            <TextInput
                                placeholder="Apellido 2"
                                placeholderTextColor="#fff"
                                value={data.apellido2}
                                onChangeText={(text) => handleChange('apellido2', text)}
                                style={styles.input}
                            />

                            <TextInput
                                placeholder="Correo"
                                placeholderTextColor="#fff"
                                value={data.correo}
                                onChangeText={(text) => handleChange('correo', text)}
                                keyboardType="email-address"
                                style={styles.input}
                            />

                            <TextInput
                                placeholder="Teléfono"
                                placeholderTextColor="#fff"
                                value={data.telefono}
                                onChangeText={(text) => handleChange('telefono', text)}
                                keyboardType="phone-pad"
                                style={styles.input}
                            />

                        </View>


                        <View style={styles.column}>
                            {/* Campos de la columna derecha */}
                            <TextInput
                                placeholder="Edad"
                                placeholderTextColor="#fff"
                                value={data.edad}
                                onChangeText={(text) => handleChange('edad', text)}
                                keyboardType="numeric"
                                style={styles.input}
                            />

                            <TextInput
                                placeholder="Peso (kg)"
                                placeholderTextColor="#fff"
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
                        <Text style={styles.linkText}>¿Ya tienes cuenta? Inicia sesión</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </ImageBackground>
    );
}

const styles = StyleSheet.create({
    backgroundImage: {
        flex: 1,
    },
    scrollContainer: {
        flexGrow: 1,
        padding: 20,
    },
    formContainer: {
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        padding: 20,
        borderRadius: 15,
    },
    title: {
        fontSize: 26,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 30,
        color: '#fff'
    },
    columnsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    column: {
        width: '48%',
    },
    input: {
        borderWidth: 1,
        borderColor: '#2e7d32',
        padding: 12,
        borderRadius: 10,
        marginBottom: 15,
        //backgroundColor: 'rgba(46, 125, 50, 0.7)',
        color: '#fff',
        fontSize: 14
    },
    mainButton: {
        backgroundColor: '#fff',
        padding: 15,
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
        color: 'black',
        fontWeight: 'bold',
        fontSize: 16
    },
    linkText: {
        color: '#fff',
        textDecorationLine: 'underline',
        fontSize: 14
    }
});

