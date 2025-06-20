import { useRouter } from 'expo-router';
import { View, Text, TouchableOpacity } from 'react-native';

export default function Home() {
    const router = useRouter();

    return (
        <View style={{ flex: 1, justifyContent: 'center', padding: 30, backgroundColor: '#56ab2f' }}>
            <Text style={{ fontSize: 26, fontWeight: 'bold', textAlign: 'center', marginBottom: 30 }}>
                GymTec - Cliente
            </Text>

            <TouchableOpacity
                style={button}
                //onPress={() => router.push('/cuentas')}
            >
                <Text style={buttonText}>Ver plan de trabajo </Text>
            </TouchableOpacity>

            <TouchableOpacity
                style={button}
                //onPress={() => router.push('/tarjetas')}
            >
                <Text style={buttonText}>Unirse a una clase</Text>
            </TouchableOpacity>


            <TouchableOpacity
                style={[button, { backgroundColor: '#2e7d32', borderWidth: 1, borderColor: '#1565C0' }]}
                onPress={() => router.replace('/')}
            >
                <Text style={[buttonText, { color: '#fff' }]}>Cerrar Sesión</Text>
            </TouchableOpacity>
        </View>
    );
}

const button = {
    backgroundColor: '#2e7d32',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 15,
};

const buttonText = {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
};