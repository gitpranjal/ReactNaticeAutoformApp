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

class LineSuperItem extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      id: props.id,
      name: props.name,
      status: props.status,
      activity: props.activity,
      onSelect: props.onSelect,
      color: props.color,
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
          backgroundColor: state.color,
          flex: 1,
          margin: 5,
          marginLeft: 12,
          shadowColor: "black",
          width: Dimensions.get("window").width / 1.07,
          shadowOpacity: 0.26,
          shadowOffset: { width: 0, height: 2 },
          shadowRadius: 10,
          elevation: 3,
          borderRadius: 3,
          overflow: "hidden",
        }}
        onPress={state.onSelect}
      >
        <TouchableOpacity activeOpacity={0.8} onPress={state.onSelect}>
          <View style={styles.container2}>
            <Text style={styles.title} numberOfLines={1}>
              {state.name}
            </Text>
            <Text style={styles.title} numberOfLines={1}>
              {state.activity}
            </Text>
            <Text style={styles.status} numberOfLines={1}>
              {state.status}
            </Text>
          </View>
        </TouchableOpacity>
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

  title: {
    paddingLeft: 5,
    paddingRight: 2,
    paddingVertical: 3,
    borderRadius: 4,
    fontSize: 18,
    textAlign: "left",
    fontFamily: "robotoRegular",
    fontWeight: "bold",
    color: Colors.accentColor,
  },
  status: {
    marginLeft: 15,
    marginRight: 10,
    fontSize: 15,
    paddingVertical: 3,
    textAlign: "right",
    color: Colors.accentColor,
    textAlign: "center",
    fontFamily: "robotoRegular",
  },
});

export default LineSuperItem;
