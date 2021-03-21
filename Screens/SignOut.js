import React from "react";
import {
  View,
  TouchableOpacity,
  Text,
  Platform,
  StyleSheet,
  Image,
  TouchableNativeFeedback,
  AsyncStorage,
} from "react-native";

import Colors from "../constants/colors";
import colors from "../constants/colors";
import { HeaderButtons, Item } from "react-navigation-header-buttons";


class SignOut extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
    };
  }

  logout = async () => {
    var check = 0;
    try {
      await AsyncStorage.removeItem("LoginParams");
      check = 1;
    } catch (error) {
      check = 0;
      console.log(error);
    }
    if (check == 1) {
      setTimeout(() => {
        this.props.navigation.navigate("Authcheck");
      }, 500);
    }
  };

  render() {
    let TouchableCmp = TouchableOpacity;

    if (Platform.OS === "android" && Platform.Version >= 21) {
      TouchableCmp = TouchableNativeFeedback;
    }
    return (
      <View style={styles.screen}>
        <Text style={styles.text}>Leave Session ?</Text>
        <TouchableOpacity
          activeOpacity={0.8}
          style={styles.logout}
          onPress={this.logout}
        >
          <Text style={styles.title} numberOfLines={1}>
            Sign Out
          </Text>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.primaryColor,
  },
  logout: {
    borderRadius: 20,
    backgroundColor: "#FFFFFF",
  },
  title: {
    color: Colors.primaryColor,
    fontSize: 28,
    paddingRight: 15,
    marginBottom: 4,
    paddingLeft: 15,
    fontWeight: "bold",
  },
  text: {
    color: "#FFFFFFCC",
    fontSize: 28,
    marginTop: 10,
    marginBottom: 28,
    marginBottom: 4,
    paddingLeft: 15,
    fontWeight: "bold",
  },
});

SignOut.navigationOptions = (navData) => {
  return {
    headerTitle: "Sign out",
    headerStyle: {
      backgroundColor: Colors.primaryColor,
    },
    headerTintColor: "white",
  };
};

export default SignOut;
