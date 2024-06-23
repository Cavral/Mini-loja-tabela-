import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, Alert, StyleSheet } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';

const App = () => {
  const [animeTitle, setAnimeTitle] = useState('');
  const [animeData, setAnimeData] = useState(null);
  const [location, setLocation] = useState(null);
  const [region, setRegion] = useState({
    latitude: 37.78825,
    longitude: -122.4324,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });

  const apikey = 'OAuth2'; 

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permissão de localização negada');
        return;
      }

      let loc = await Location.getCurrentPositionAsync({});
      setLocation(loc.coords);
      setRegion({
        ...region,
        latitude: loc.coords.latitude,
        longitude: loc.coords.longitude,
      });
    })();
  }, []);

  const handleSearch = async () => {
    if (animeTitle.trim() === '') {
      Alert.alert('Aviso', 'Por favor, insira um título de anime válido.');
      return;
    }
    try {
      const apiUrl = `https://api.myanimelist.net/v2/anime?q=${encodeURIComponent(animeTitle)}&limit=1`;
      const response = await fetch(apiUrl, {
        headers: {
          'Authorization': `Bearer ${YOUR_ACCESS_TOKEN}`
        }
      });
      const data = await response.json();
      if (data.data && data.data.length > 0) {
        setAnimeData(data.data[0].node);
      } else {
        Alert.alert('Erro', 'Anime não encontrado. Verifique o título e tente novamente.');
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Erro', 'Houve um problema na busca do anime. Tente novamente mais tarde.');
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <Text style={styles.title}>
        Busca de Animes
      </Text>
      <TextInput
        style={styles.input}
        placeholder="Digite o nome do anime"
        value={animeTitle}
        onChangeText={(text) => setAnimeTitle(text)}
      />
      <Button title="Buscar Anime" onPress={handleSearch} />
      {animeData && (
        <View style={styles.animeInfo}>
          <Text style={styles.animeTitle}>{animeData.title}</Text>
          <Text>Rank: {animeData.rank}</Text>
          <Text>Sinopse: {animeData.synopsis}</Text>
        </View>
      )}
      <MapView
        style={styles.map}
        region={region}
        showsUserLocation={true}
        onRegionChangeComplete={setRegion}
      >
        {location && (
          <Marker
            coordinate={location}
            title="Você está aqui"
          />
        )}
      </MapView>
    </View>
  );
};

const styles = StyleSheet.create({
  title: {
    fontSize: 20,
    textAlign: 'center',
    marginTop: 20,
  },
  input: {
    borderWidth: 1,
    margin: 10,
    padding: 8,
  },
  animeInfo: {
    margin: 20,
  },
  animeTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  map: {
    flex: 1,
    height: 100,  
    margin: 20,
  },
});

export default App;
