import React from "react";
import { Platform,Text,TouchableOpacity,View } from "react-native";
import Colors from "../constants/colors";
import { MaterialIcons } from '@expo/vector-icons';  

const CustomHeaderButton = (props) => {
    console.log(props)
  return (
    <TouchableOpacity onPress={props.onPress}>
        <View stye={{margin:10,flexDirection:"row"}}>
            <MaterialIcons name="notifications" size={28} color={Colors.accentColor} style={{marginRight:20}}/>
            <View style={{borderRadius:40,backgroundColor:Colors.accentColor,position:"absolute",left:-20,top:-5,}}>
                <Text style={{color:Colors.primaryColor,padding:5,fontSize:8,fontWeight:"bold",width:22,height:22}} numberOfLines={1}>
                    99
                </Text>
            </View>
        </View>
    </TouchableOpacity>
  );
};

export default CustomHeaderButton;
