import React, { useState } from "react";
import {
  TouchableOpacity,
  View,
  Text,
  StyleSheet,
  Platform,
  Dimensions,
  FlatList,
  TouchableNativeFeedback,
  ImageBackground,
} from "react-native";
import { CheckBox } from "react-native-elements";

import { Entypo } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons'; 
import Colors from "../constants/colors";

class DefectsStyleItem extends React.Component {
  constructor(props) {
    console.log(props)
    super(props);
    this.state = {
      Defect:props.Defect,
      Frequency:props.Frequency,
      FrontURL: props.FrontURL,
      BackURL: props.BackURL,
      FrontDefects: props.FrontDefects,
      BackDefects: props.BackDefects,
      ShowImage:false
    };
  }

  FrontDefects = ()=>{
    return this.state.FrontDefects.map((data) => {
      return (
        <View key={data.Id} style={{left:data.X*(Dimensions.get("window").width*(0.15/3))-0.02*Dimensions.get("window").height,
                                    top:data.Y*(Dimensions.get("window").width*(0.6/12))-0.02*Dimensions.get("window").height,position:"absolute"}}>
                                        <Entypo name="cross" size={0.04*Dimensions.get("window").height} color={"#e94560"} />
        </View>
      )
    })
  }

  BackDefects = ()=>{
    return this.state.BackDefects.map((data) => {
      return (
        <View key={data.Id} style={{left:data.X*(Dimensions.get("window").width*(0.15/3))-0.02*Dimensions.get("window").height,
                                    top:data.Y*(Dimensions.get("window").width*(0.6/12))-0.02*Dimensions.get("window").height,position:"absolute"}}>
                                        <Entypo name="cross" size={0.04*Dimensions.get("window").height} color={"#e94560"} />
        </View>
      )
    })
  }


  render() {
    const state = this.state;
    let TouchableCmp = TouchableOpacity;

    if (Platform.OS === "android" && Platform.Version >= 21) {
      TouchableCmp = TouchableNativeFeedback;
    }
    return (
      <View
        style={{
          backgroundColor:"#FFFFFFAA",
          flex: 1,
        }}
      >
         <TouchableOpacity activeOpacity={0.8} onPress={()=>{this.setState({
                    ShowImage:!this.state.ShowImage
                })}}>
          <View style={styles.brand}>
              <View style={{flexDirection:"row",justifyContent:"flex-start",alignItems:"flex-start"}}>
                <Text style={styles.size}>{state.Defect}</Text>
            </View>
            <View style={{alignItems:"flex-end",alignSelf:"center"}}>
            <Text style={styles.size}>{state.Frequency}</Text>
            </View>               
          </View>
          {this.state.ShowImage?(
              <View style={{flexDirection:"row",justifyContent:"center"}}>
                                      <ImageBackground style={{width:Dimensions.get("window").width*0.15, height:Dimensions.get("window").width*(0.6/3),marginHorizontal:Dimensions.get("window").width*0.02}}
                                        source={{
                                        uri: this.state.FrontURL,
                                        // flex:1
                                        }}
                                      >
                                      {this.FrontDefects()}
                                      </ImageBackground>
                                        <ImageBackground style={{width:Dimensions.get("window").width*0.15, height:Dimensions.get("window").width*(0.6/3),marginHorizontal:Dimensions.get("window").width*0.02}}
                                        source={{
                                        uri: this.state.BackURL,
                                        // flex:1
                                        }}
                                      >
                                      {this.BackDefects()}
                                      </ImageBackground>                      
                                        
              </View>
          ):null}
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  brand: {
    padding: 5,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  size: {
    marginLeft: 10,
    paddingRight: 15,
    borderRadius: 4,
    width:"90%",
    fontSize: 18,
    textAlign: "left",
    fontWeight: "bold",
    color: '#1284c4',
  },
});

export default DefectsStyleItem;
