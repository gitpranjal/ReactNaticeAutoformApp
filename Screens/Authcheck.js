import React from "react";
import {
  View,
  Image,
  FlatList,
  ActivityIndicator,
  StyleSheet,
  AsyncStorage,
} from "react-native";

import Colors from "../constants/colors";
import colors from "../constants/colors";

class Authcheck extends React.Component {
  constructor(props) {
    super(props);
    this._retrieveData();
    this.state = {
      loading: true,
      dataSource: [],
    };
  }

  _retrieveData = async () => {
    try {
      const data = await AsyncStorage.getItem("LoginParams");
      if (data !== null) {
        setTimeout(() => {
          this.props.navigation.navigate("Home");
        }, 1200);
      } else {
        setTimeout(() => {
          this.props.navigation.navigate("SignIn");
        }, 1000);
      }
    } catch (error) {}
  };

  render() {
    return (
      <View style={styles.screen}>
        <Image
          style={{ flex: 1, width: 410, height: 100, resizeMode: "contain" }}
          source={require("../assets/BKLOGO.png")}
        />
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
});

Authcheck.navigationOptions = (navData) => {
  return {
    headerTitle: "Authcheck",
    header: null,
  };
};

export default Authcheck;
