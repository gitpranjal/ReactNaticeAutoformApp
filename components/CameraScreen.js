import React from 'react'
import {StyleSheet, Text, View, TouchableOpacity, Alert} from 'react-native'
import { Icon } from 'react-native-elements'
import {Camera} from 'expo-camera'
import Colors from "../constants/colors"
import { Dimensions } from 'react-native'

export default function CameraScreen(props) {

  const [Pressed, SetPressed] = React.useState(false)
  const screenWidth = Dimensions.get('window').width
  
  var camera = ""

  // const __startCamera = async () => {
  //   const {status} = await Camera.requestPermissionsAsync()
  //   if (status === 'granted') {
  //     // start the camera
  //     setStartCamera(true)
  //   } else {
  //     Alert.alert('Access denied')
  //   }
  // }

  

  const __takePicture = async () => {
    if (!camera) return
    SetPressed(true)
    const photo = await camera.takePictureAsync()
    // Alert.alert(photo.uri)
    props.callback(photo, props.currentDefectObject)
  }

    return (
        <Camera
        style={{flex: 1,width:"100%"}}
        ref={(r) => {
          camera = r
        }}
      >
          <View style={{alignSelf: "center", borderColor: "green", borderWidth: 3, top: "30%", height: 250, width: 0.95*screenWidth}}>

          </View>
          <TouchableOpacity
            style={{alignSelf: "center", top: "50%", alignItems: "center", justifyContent: "center"}}
            onPress={__takePicture}
          >
              <Icon
                reverse
                name='ios-camera'
                type='ionicon'
                color={ !Pressed ? Colors.primaryColor : "grey"}
                size={40}
              />
          </TouchableOpacity>
      </Camera>
    )

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center'
  }
})