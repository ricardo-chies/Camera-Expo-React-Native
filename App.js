import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, View, SafeAreaView, TouchableOpacity, Modal, Image } from 'react-native';
import { Camera } from 'expo-camera';
import { FontAwesome } from '@expo/vector-icons';

export default function App() {
  const camRef = useRef(null);
  const [type, setType] = useState(Camera.Constants.Type.back);
  const [permission, setPermission] = useState(null);
  const [capturedPhoto, setCapturedPhoto] = useState(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    (async () => {
      const {status} = await Camera.requestPermissionsAsync();
      setPermission(status === 'granted');
    })();
  },[]);

  if(permission === null){
    return <View/>;
  }

  if(permission === false){
    return <Text> Acesso negado! </Text>
  }

  async function takePicture(){
    if(camRef){
      const data = await camRef.current.takePictureAsync();
      setCapturedPhoto(data.uri)
      setOpen(true);
      console.log(data);
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <Camera style={styles.camera}
      type={type}
      ref={camRef}
      >
        <View style={styles.botaoTrocarCamera}>
        <TouchableOpacity style={styles.touchable}
        onPress={ () => {
          setType(
            type === Camera.Constants.Type.back
            ? Camera.Constants.Type.front
            : Camera.Constants.Type.back
          );
        }}
        >
          <Text style={styles.textoBotao}> Trocar Câmera </Text>
        </TouchableOpacity>
        </View>
      </Camera>

        <TouchableOpacity style={styles.botaoFoto} onPress={takePicture}>
          <FontAwesome name="camera" size={23} color="#FFF"/>
        </TouchableOpacity>

        {capturedPhoto &&
          <Modal 
          animationType='slide'
          transparent={false}
          visible={open}
          >
            <View style={styles.capturarFoto}>
              <TouchableOpacity style={{margin: 10}} onPress={() => setOpen(false)}>
                <FontAwesome name="window-close" size={50} color="#FF0000" />
              </TouchableOpacity>

              <Image style={styles.image} 
              source={{uri: capturedPhoto}}/>

            </View>
          </Modal>
        }

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  camera: {
    flex: 1,
  },
  botaoTrocarCamera: {
    flex: 1,
    backgroundColor: 'transparent',
    flexDirection: 'row'
  },
  touchable: {
    position: 'absolute',
    bottom: 20,
    left: 20
  },
  textoBotao: {
    fontSize: 20,
    marginBottom: 13,
    color: '#FFF'
  },
  botaoFoto: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#121212',
    margin: 20,
    borderRadius: 10,
    height: 50,
  },
  capturarFoto: {
    flex: 1,
    justifyContent: 'center',
    alignItens: 'center',
    margin: 20
  },
  image: {
    width: '100%',
    height: 300,
    borderRadius: 20
  }
});
