import React from "react";
import {
  TouchableOpacity,
  View,
  Text,
  StyleSheet,
  Platform,
  Switch,
  Dimensions,
  TouchableNativeFeedback,
} from "react-native";

import Colors from "../constants/colors";

class SubOrderItem extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      color:props.color,
      size:props.size,
      deliveryDate:props.deliveryDate,
      stitched:props.stitchedPieces,
      finished:props.finishedPieces,
      qty:props.qty,
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
          backgroundColor:"#FFFFFFAA",
          flex: 1,
          margin: 3,
          borderRadius: 3,
          overflow: "hidden",
        }}
        onPress={state.onSelect}
      >
        <View style={styles.container2}>
            <Text style={styles.title} numberOfLines={1}>
              {state.color+" - "+state.size}
            </Text>
            <Text style={styles.title} numberOfLines={1}>
              {state.deliveryDate}
            </Text>
        </View>
        <View style={styles.container2}>
            <Text style={styles.title} numberOfLines={1}>
              {"Order Qty" + " - "+state.qty}
            </Text>
        </View>
        <View style={styles.container2}>
            <Text style={styles.title} numberOfLines={1}>
              {"Stitched" + " - "+state.stitched}
            </Text>
            <Text style={styles.title} numberOfLines={1}>
              {"Finished" + " - "+state.finished}
            </Text>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container2: {
    flexDirection: "row",
    alignContent: "flex-start",
    justifyContent: "space-between",
  },

  title: {
    paddingLeft: 5,
    borderRadius: 4,
    paddingRight:8,
    fontSize:18,
    textAlign: "left",
    fontFamily: "robotoRegular",
    fontWeight: "bold",
    color: Colors.primaryColor,
  },
});

export default SubOrderItem;
