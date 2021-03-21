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
  Switch,
} from "react-native";
import Colors from "../constants/colors";
import SubOrderItem from "../components/SubOrderItem"

class COStyleItem extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      id: props.id,
      name: props.name,
      subdata:props.subdata,
      onSelect: props.onSelect,
    };
  }

  renderGridItem = (itemData) => {

    return (
      <SubOrderItem
        color={itemData.item.colorName}
        size={itemData.item.sizeName}
        qty={itemData.item.qty}
        deliveryDate={itemData.item.deliveryDate}
        finishedPieces={itemData.item.finishedPieces}
        stitchedPieces={itemData.item.stitchedPieces}
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
          backgroundColor:"#FFFFFF88",
          flex: 1,
          margin: 3,
          borderRadius: 3,
          overflow: "hidden",
        }}
        onPress={state.onSelect}
      >
        <View style={styles.container2}>
            <Text style={styles.color} numberOfLines={1}>
              {state.name}
            </Text>
        </View>
        <FlatList
         style={styles.gridItem}
         keyExtractor={(item, index) => item.styleNo}
         data={this.state.subdata}
         renderItem={this.renderGridItem}
         />           
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
    paddingLeft: 5,
    paddingRight: 2,
    fontSize: 20,
    textAlign: "left",
    fontFamily: "robotoRegular",
    fontWeight: "bold",
    color:  Colors.primaryColor,
  },
  status: {
    marginTop: 4,
    marginLeft: 15,
    marginRight: 10,
    fontSize: 15,
    color: Colors.accentColor,
    textAlign: "center",
    fontFamily: "robotoRegular",
  },
});

export default COStyleItem;
