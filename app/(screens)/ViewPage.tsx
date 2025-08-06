import React from 'react';
import { View, Text, StyleSheet, StatusBar } from 'react-native';

export default function ViewPage() {
  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <Text style={styles.title}>Hello World!</Text>
      <Text style={styles.subtitle}>Bienvenue dans chabebtn</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1e3a8a',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 18,
    color: '#e5e7eb',
    marginBottom: 30,
    textAlign: 'center',
  },
});