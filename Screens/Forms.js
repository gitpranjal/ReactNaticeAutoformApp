import React, { useState } from "react";
import {
  TouchableOpacity,
  TouchableNativeFeedback,
  StyleSheet,
  Text,
  View,
  Alert,
  Animated,
  Platform,
  TextInput,
  Dimensions,
} from "react-native";

import CustomForm from "../components/CustomForm";
import Colors from "../constants/colors";

class Forms extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

 
  render() {
    return (
      <View style={styles.container}>
        <CustomForm
            buttonStyles={styles.buttonStyles}
            textStyles={styles.textStyles}
            content={'This is some custom text'}
            />
      </View>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f6f5f5",
    alignItems: "center",
    justifyContent: "flex-start",
  },

});

Forms.navigationOptions = (navData) => {
  return {
    headerTitle: "Forms",
    headerStyle: {
      backgroundColor: Colors.primaryColor,
    },
    headerTintColor: Colors.accentColor,
  };
};

export default Forms;
