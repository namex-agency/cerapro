import { useState } from 'react';
import { Alert, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

const API_URL = 'http://192.168.100.2:3000';

export default function AdminScreen() {
  const [userId, setUserId] = useState('66d4b3ae-604e-4e05-b1a7-9efba842722a');
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');

  const handleSend = async () => {
    try {
      if (!userId || !title || !message) {
        Alert.alert('Erreur', 'Tous les champs sont obligatoires');
        return;
      }

      const response = await fetch(`${API_URL}/admin/notification`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          source: 'ADMIN',
          title,
          message,
          time: 'Maintenant',
        }),
      });

      const result = await response.json();

      if (result?.success) {
        Alert.alert('Succès', 'Notification envoyée');
        setTitle('');
        setMessage('');
        return;
      }

      Alert.alert('Erreur', 'Notification non envoyée');
    } catch (error) {
      console.log('Erreur admin notification:', error);
      Alert.alert('Erreur', 'Impossible de contacter le serveur');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>ADMIN - Notifications</Text>

      <TextInput
        placeholder="User ID"
        value={userId}
        onChangeText={setUserId}
        style={styles.input}
      />

      <TextInput
        placeholder="Titre"
        value={title}
        onChangeText={setTitle}
        style={styles.input}
      />

      <TextInput
        placeholder="Message"
        value={message}
        onChangeText={setMessage}
        style={[styles.input, styles.messageInput]}
        multiline
      />

      <Pressable style={styles.button} onPress={handleSend}>
        <Text style={styles.buttonText}>Envoyer notification</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    backgroundColor: '#F7FAF9',
  },
  title: {
    fontSize: 22,
    fontWeight: '900',
    marginBottom: 20,
    color: '#062B26',
  },
  input: {
    borderWidth: 1,
    borderColor: '#D8E3E0',
    borderRadius: 12,
    padding: 14,
    marginBottom: 12,
    backgroundColor: '#FFFFFF',
    fontWeight: '700',
    color: '#062B26',
  },
  messageInput: {
    minHeight: 90,
    textAlignVertical: 'top',
  },
  button: {
    backgroundColor: '#0f766e',
    padding: 15,
    borderRadius: 14,
    alignItems: 'center',
    marginTop: 4,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '900',
    fontSize: 15,
  },
});