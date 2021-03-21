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

import FloorNotifGroup from "../components/FloorNotifGroup";

class FactoryNotifGroup extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name:props.name,
      floors:props.floors,
      SelectedLines:props.SelectedLines
    };
  }
  
  renderGridItem = (itemData) => {
    return (
        <FloorNotifGroup
          name={itemData.item.locationgroupName}
          lines={itemData.item.lines}
          SelectedLines={this.state.SelectedLines}
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
                keyExtractor={(item, index) => item.locationgroupName+item.locationgroupID}
                data={this.state.floors}
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
    margin: 5,
  },
  title: {
    textAlign: "left",
    paddingRight: 5,
    fontSize: 20,
    fontWeight:"bold",
    width:Dimensions.get("window").width/1.1,
    color:"#FFFFFF",
    paddingHorizontal:5,
    color: Colors.primaryColor,
  },
});

export default FactoryNotifGroup;