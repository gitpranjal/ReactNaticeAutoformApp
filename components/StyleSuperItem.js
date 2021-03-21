import React, { useState } from "react";
import {
  TouchableOpacity,
  View,
  Text,
  StyleSheet,
  Platform,
  Dimensions,
  FlatList,
  Image,
  TouchableNativeFeedback,
  Switch,
} from "react-native";
import Colors from "../constants/colors";

class StyleSuperItem extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      id: props.id,
      name: props.name,
      uri:props.uri,
      status: props.status,
      color: props.color,
      desc: props.desc,
      onSelect: props.onSelect,
    };
  }

  render() {
    const state = this.state;
    let TouchableCmp = TouchableOpacity;

    if (Platform.OS === "android" && Platform.Version >= 21) {
      TouchableCmp = TouchableNativeFeedback;
    }
    return (
      <View style={{flexDirection:"row"
                    ,backgroundColor: state.color,
                    flex: 1,
                    margin: 3,
                    shadowColor: "black",
                    shadowOpacity: 0.26,
                    shadowOffset: { width: 0, height: 2 },
                    shadowRadius: 10,
                    elevation: 3,
                    borderRadius: 3,
                    overflow: "hidden",}}>
                        
        <Image
                source={{ uri: this.state.uri }}
                style={{
                  width:Dimensions.get("window").width / 5.5,
                  height:Dimensions.get("window").width / 5.5,
                  marginTop: 15,
                  marginLeft:10,
                  marginBottom:10,
                  borderWidth: 2,
                  borderRadius:3
                }}
              />
      <View
        style={{
          backgroundColor: state.color,
          flex: 1,
          margin: 5,
          borderRadius: 3,
          overflow: "hidden",
        }}
        onPress={state.onSelect}
      >
        <TouchableOpacity activeOpacity={0.8} onPress={state.onSelect}>
          <View style={styles.container2}>
            <Text style={styles.color} numberOfLines={1}>
              {state.name}
            </Text>
          </View>
          <View>
            <Text style={styles.desc} numberOfLines={4}>
              {this.state.desc}
            </Text>
          </View>
        </TouchableOpacity>
      </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container2: {
    padding: 5,
    flexDirection: "row",
    alignContent: "flex-start",
    justifyContent: "space-between",
  },
  color: {
    paddingRight: 10,
    borderRadius: 4,
    fontSize: 22,
    textAlign: "left",
    fontFamily: "robotoRegular",
    fontWeight: "bold",
    maxWidth: Dimensions.get("window").width / 1.5,
    color: Colors.accentColor,
  },
  desc: {
    marginHorizontal: 10,
    textAlignVertical: "top",
    marginBottom: 5,
    borderRadius: 4,
    fontSize: 16,
    textAlign: "left",
    fontFamily: "robotoRegular",
    maxWidth: Dimensions.get("window").width / 1.5,
    color: Colors.accentColor,
  },
  status: {
    marginTop: 6,
    marginLeft: 15,
    marginRight: 10,
    fontSize: 15,
    color: Colors.accentColor,
    textAlign: "center",
    fontFamily: "robotoRegular",
  },
});

export default StyleSuperItem;
