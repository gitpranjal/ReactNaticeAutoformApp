import React from "react";
import {
  TouchableOpacity,
  View,
  Text,
  StyleSheet,
  Platform,
  FlatList,
  Switch,
  Dimensions,
  TouchableNativeFeedback,
} from "react-native";
import Colors from "../constants/colors";

class FloorSuperItem extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      id: props.id,
      name: props.name,
      status: props.status,
      lines: props.lines,
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
          flex: 1,
          marginHorizontal: 5,
          width: Dimensions.get("window").width / 1.05,
          overflow: "hidden",
        }}
      >
        <View
          style={{
            backgroundColor: state.color,
            flex: 1,
            margin: 5,
            shadowColor: "black",
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
              <Text style={styles.city} numberOfLines={1}>
                {state.status}
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
  floor: {
    marginLeft: 15,
  },
  titlex: {
    paddingBottom: 2,
    fontSize: 25,
    textAlign: "center",
    fontFamily: "effra-heavy",
    color: "white",
  },
  title: {
    marginLeft: 5,
    paddingLeft: 10,
    paddingRight: 10,
    borderRadius: 4,
    fontSize: 25,
    textAlign: "left",
    fontWeight: "bold",
    fontFamily: "robotoRegular",
    color: Colors.accentColor,
  },
  city: {
    marginTop: 4,
    marginLeft: 15,
    marginRight: 10,
    fontSize: 15,
    color: Colors.accentColor,
    textAlign: "center",
    fontFamily: "robotoRegular",
  },
  topaddbar: {
    marginLeft: 20,
    marginBottom: 5,
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "flex-start",
  },
  addbutton: {
    backgroundColor: "#003392",
    justifyContent: "center",
    alignContent: "center",
    borderWidth: 1,
    borderRadius: 12,
    width: 24,
    height: 24,
  },
  des: {
    paddingLeft: 15,
    fontSize: 18,
    textAlign: "center",
    color: "#003392",
  },
  description: {
    fontSize: 15,
    marginTop: 5,
    fontFamily: "robotoRegular",
    textAlign: "left",
    color: "white",
  },
});

export default FloorSuperItem;
