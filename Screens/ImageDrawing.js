
import React, { Component, useState } from 'react';
import {
  Image,
  StyleSheet,
  View,
  ImageBackground,
  ScrollView,
  TouchableOpacity,
  Text,
  FlatList,
} from 'react-native';


// import ExpoPixi from 'expo-pixi'

import {captureRef as takeSnapShotAsync} from "react-native-view-shot"
import ViewShot from "react-native-view-shot"

import Colors from "../constants/colors"

import Slider from 'react-native-slider'
import { Dimensions } from 'react-native'

const ImageDrawing = (props) => {

  
   const [CurrentUri, SetCurrentUri] = useState("bhupp bhosdike")
   const [Color, SetColor] = useState({colorName: "red", colorVal: 0xffff0000})
   const [MarkerWidth, SetMarkerWidth] = useState(5)
//    const [BackgroundImageUri, SetBackgroundImageUri] = useState("https://asia.olympus-imaging.com/content/000107507.jpg")
   
var BackgroundImageUri = props.navigation.getParam("BackgroundImageUri")
var BackgroundImageName = props.navigation.getParam("BackgroundImageName")
var combinedDefectsList = props.navigation.getParam("combinedDefectsList")
var defectImageObjectsList = props.navigation.getParam("defectImageObjectsList")
const updateCallback = props.navigation.getParam("updateCallback")


    // const color = 0xff0000;
    const width = 5;
    const alpha = 0.5;
    var sketch = ""
    var drawingBoard = ""

    const onChange = async () => {
      const options = {
        format: 'jpg', /// PNG because the view has a clear background
        quality: 0.1, /// Low quality works because it's just a line
        // result: 'file',
        // height,
        // width: 300
      };
      /// Using 'Expo.takeSnapShotAsync', and our view 'this.sketch' we can get a uri of the image
      // const uri = await takeSnapShotAsync(sketch, options);
       const uri = await sketch.capture()
       console.log(uri)
      
      SetCurrentUri(uri)
      
      updateCallback(combinedDefectsList, defectImageObjectsList, BackgroundImageUri, BackgroundImageName,  uri)
    };

    return (

      <ScrollView style={styles.container}>
        <ViewShot ref={ref => sketch = ref} options={{ format: "jpg", quality: 0.5 }}>
          <ImageBackground 
            source={{uri: BackgroundImageUri}} 
            style={{width: "100%", height: 300,}}
            // ref={ref => sketch = ref}
            >
            {/* <ExpoPixi.Sketch
              strokeColor={Color.colorVal}
              ref={ref => drawingBoard = ref}
              strokeWidth={MarkerWidth}
              strokeAlpha={alpha}
              
              style={{ flex: 1 }}
              
              // onChange={onChange}
            /> */}
          </ImageBackground>

        </ViewShot>
        
        <FlatList 
          data={[{colorName: "blue", colorVal: 0xff0000ff}, {colorName: "green", colorVal: 0xff00ff00},
                 {colorName: "red", colorVal: 0xffff0000},{colorName:"yellow", colorVal: 0xffffff00}]}
          keyExtractor={(colorObj) => colorObj.colorName} 
          style={{marginVertical: 10, alignSelf: "center"}} 
          contentContainerStyle={{flexDirection: "row"}}
          renderItem={({item}) => {
            return <TouchableOpacity style={{width: item.colorName == Color.colorName? 25*1.2 : 25, height: item.colorName == Color.colorName? 25*1.2 :25, backgroundColor: item.colorName, marginHorizontal: 2}}
                      onPress={() => SetColor(item)}
                    >
                    </TouchableOpacity>
          }}

        />
         <View style={{flexDirection: "row", alignSelf: "center"}}>
          <Slider
            style={{width: 200, height: 40, alignSelf: "center"}}
            minimumValue={2}
            maximumValue={20}
            value={MarkerWidth}
            minimumTrackTintColor="#008b8b"
            maximumTrackTintColor="#c0c0c0"
            thumbTintColor="#4b0082"
            onValueChange={(value) => SetMarkerWidth(value)}
          />

          <TouchableOpacity
            style={{borderWidth: 3, borderColor: "grey", width: 80, height: 30, alignItems: "center", justifyContent: "center", marginLeft: "10%", borderRadius: 5}}
            onPress={() => {
              drawingBoard.stage.removeChildren()
              drawingBoard.renderer._update()
            }}
          >
            <Text style={{color: "grey", fontSize: 12, fontWeight: "bold"}}>Refresh</Text>
          </TouchableOpacity>
           
         </View> 
         

        <TouchableOpacity
          style={{width: 200, height: 50, backgroundColor: Colors.primaryColor, borderRadius: 7, alignItems: "center", justifyContent: "center", alignSelf: "center", marginVertical: 10}}
          onPress={() => onChange()}
          
        >
          <Text style={{color: Colors.accentColor, fontWeight: "bold", fontSize: 20}}>Save</Text>
        </TouchableOpacity>
        
        <Image
          source={{ uri: CurrentUri }}
          style={{ width: "100%", height: 300, marginBottom: 20}}
        />

        
    </ScrollView>
    // <ExpoPixi.Sketch 
      // ref={ref => this.sketch = ref}
      // onChange={onChange}
    // />
    )
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 10,
    backgroundColor: '#ecf0f1',
    marginHorizontal: 10
  },
  
})
ImageDrawing.navigationOptions = (navData) => {
    return {
      headerTitle: "Mark Defects",
      headerStyle: {
        backgroundColor: Colors.primaryColor,
      },
      headerTintColor: Colors.accentColor,
    };
  }


export default ImageDrawing