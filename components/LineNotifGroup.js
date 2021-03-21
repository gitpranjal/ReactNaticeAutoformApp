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
} from "react-native";

import { CheckBox } from "react-native-elements";
import Colors from "../constants/colors";
import colors from "../constants/colors";


class LineNotifGroup extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name:props.name,
      SelectedLines:props.SelectedLines,
      id:props.id,
      Checked:props.checked
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
          flex: 1,
        }}
        onPress={state.onSelect}
      >
        <TouchableOpacity activeOpacity={0.8} onPress={state.onSelect}>
          <View style={styles.container2}>
          <CheckBox
            containerStyle={{
              backgroundColor: "transparent",
              borderColor: "transparent",
              margin: 0,
              width: "80%",
            }}
            title={this.state.name}
            textStyle={{ color: "#003344CC", fontSize: 18 }}
            checkedColor={Colors.primaryColor}
            checked={this.state.Checked}
            onPress={() =>{
              this.setState({
                Checked: !this.state.Checked,
              })
            }
          }
          />
          </View>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container2: {
    flex: 1,
    width:Dimensions.get("window").width/1.1,
    margin: 2,
  },
  title: {
    textAlign: "left",
    fontSize: 18,
    fontWeight:"bold",
    color:"#FFFFFF",
    paddingHorizontal:25,
    color: Colors.primaryColor,
  },
});

export default LineNotifGroup;