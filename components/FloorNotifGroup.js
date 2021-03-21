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
import Colors from "../constants/colors";
import colors from "../constants/colors";

import LineNotifGroup from "../components/LineNotifGroup";

class FloorNotifGroup extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name:props.name,
      lines:props.lines,
      SelectedLines:props.SelectedLines
    };
  }
  
  renderGridItem = (itemData) => {
    return (
        <LineNotifGroup
          name={itemData.item.lineName}
          SelectedLines={this.state.SelectedLines}
          id={itemData.item.lineID}
          checked={itemData.item.checked}
        />
      );
  };


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
            <Text style={styles.title} numberOfLines={2}>
              {state.name}
            </Text>
              <FlatList
                style={styles.gridItem}
                scrollEnabled={true}
                keyExtractor={(item, index) => item.lineName+item.lineID}
                data={this.state.lines}
                renderItem={this.renderGridItem}
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
    paddingHorizontal:15,
    color: Colors.primaryColor,
  },
});

export default FloorNotifGroup;