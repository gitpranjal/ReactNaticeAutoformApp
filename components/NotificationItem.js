import React from "react";
import {
  TouchableOpacity,
  Alert,
  View,
  Text,
  FlatList,
  StyleSheet,
  Platform,
  Switch,
  Dimensions,
  TouchableNativeFeedback,
} from "react-native";

import { AntDesign } from '@expo/vector-icons'; 

import Colors from "../constants/colors";

class NotificationItem extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      id: props.id,
      name: props.name,
      body:props.body,
      date:props.date,
      time:props.time,
      onPress:props.onPress,
      markAsRead:props.markAsRead
    };
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
          backgroundColor:"#00334e",
          flex: 1,
          margin: 3,
          shadowColor: "black",
          shadowOpacity: 0.26,
          shadowOffset: { width: 0, height: 2 },
          shadowRadius: 10,
          elevation: 3,
          borderRadius: 3,
          overflow: "hidden",
        }}
      >
        <View>
          <TouchableOpacity onPress={()=>{this.state.onPress()}}>
          <View style={styles.container2}>
            <Text style={styles.title} numberOfLines={1}>
              {state.name}
            </Text>
          </View>
          <View style={styles.containerx}>
            <Text style={styles.body}>
              {state.body}
            </Text>
          </View>
          </TouchableOpacity>
          </View>
          <View style={{flexDirection:"row", marginLeft:5,flex:1,justifyContent:"space-between"}}>
          <Text style={styles.bodyx}>
              {state.date+"  "+state.time}
            </Text>
            <TouchableOpacity activeOpacity={0.8} onPress={()=>{this.state.markAsRead()}}>
                <View style={{flexDirection:"row",justifyContent:"flex-end",marginRight:22}}>
                    <Text style={styles.closeOrder} numberOfLines={1}>
                    {"Mark As Read"}
                    </Text>
                    <AntDesign name="check" size={35} color={Colors.accentColor} />
                </View>
            </TouchableOpacity>
            </View>
           
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container2: {
    paddingTop: 5,
    paddingLeft:5,
    flexDirection: "row",
    alignContent: "flex-start",
    justifyContent: "space-between",
  },
  containerx: {
    paddingLeft:5,
    flexDirection: "row",
    alignContent: "flex-start",
    justifyContent: "space-between",
  },
  title: {
    paddingLeft: 5,
    paddingRight: 2,
    borderRadius: 4,
    width: "99%",
    fontSize:20,
    textAlign: "left",
    fontFamily: "robotoRegular",
    fontWeight: "bold",
    color: Colors.accentColor,
  },
  date: {
    paddingLeft: 5,
    paddingRight: 2,
    borderRadius: 4,
    fontSize:20,
    textAlign: "left",
    fontFamily: "robotoRegular",
    fontWeight: "bold",
    color: Colors.accentColor,
  },
  body: {
    paddingLeft: 5,
    paddingRight: 2,
    fontSize:16,
    textAlign: "left",
    textAlignVertical:"center",
    color:"#FFFFFFDD",
  },
  bodyx: {
    paddingLeft: 5,
    paddingRight: 2,
    fontSize:15,
    textAlign: "left",
    textAlignVertical:"center",
    color:Colors.accentColor,
  },
  closeOrder: {
    borderRadius: 10,
    fontSize: 20,
    marginBottom:6,
    marginTop:3,
    alignSelf:"flex-end",
    textAlign: "center",
    fontFamily: "robotoRegular",
    color: Colors.accentColor,
  },
});

export default NotificationItem;
