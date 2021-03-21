import React from "react";
import {
  TouchableOpacity,
  View,
  Text,
  StyleSheet,
  Platform,
  TouchableNativeFeedback,
} from "react-native";

import Colors from "../constants/colors";

class Dashlets extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      id: props.id,
      description: props.description,
      title: props.title,
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
      <View style={styles.gridItem}>
        <TouchableCmp style={{ flex: 1 }} onPress={state.onSelect}>
          <View style={styles.container1}>
            <Text style={styles.title} numberOfLines={1}>
              {state.title}
            </Text>
            <Text style={styles.description} numberOfLines={1}>
              {state.description}
            </Text>
          </View>
        </TouchableCmp>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  gridItem: {
    backgroundColor: Colors.primaryColor,
    flex: 1,
    margin: 5,
    height: 150,
    shadowColor: "black",
    shadowOpacity: 0.26,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 10,
    elevation: 3,
    borderRadius: 2,
    overflow: "hidden",
  },
  container: {
    justifyContent: "center",
    alignContent: "center",
    flex: 1,
    backgroundColor: "#003392",
  },
  container2: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: "#003392",
  },
  title: {
    marginTop: 30,
    fontSize: 55,
    textAlign: "center",
    fontFamily: "effra-heavy",
    color: Colors.accentColor,
  },
  description: {
    fontSize: 15,
    marginTop: 5,
    fontFamily: "robotoRegular",
    textAlign: "center",
    color: Colors.accentColor,
  },
});

export default Dashlets;
