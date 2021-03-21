import React, { useState } from "react";
import {
  TouchableOpacity,
  TouchableNativeFeedback,
  StyleSheet,
  Text,
  View,
  Animated,
  Alert,
  Platform,
  TextInput,
  Dimensions,
} from "react-native";

import FontAwesome from "react-native-vector-icons/FontAwesome";
import * as Animatable from "react-native-animatable";
import Colors from "../constants/colors";
import colors from "../constants/colors";

class LineAdd extends React.Component {
  constructor(props) {
    console.log(props);
    super(props);
    this.state = {
      loading: true,
      enable: true,
      dataSource: [],
      apimsg: "",
      name: "",
      namehint: "Enter Line Name",
      namehintColor: "#00334e80",
      activity: "",
      activityhint: "Enter Activity Name",
      activityhintColor: "#00334e80",
      floorid: props.navigation.state.params.id,
      factid: props.navigation.state.params.factid,
      factoryname: props.navigation.state.params.factory,
      userID: props.navigation.state.params.userID,
      companyID: props.navigation.state.params.companyID,
      floorname: props.navigation.state.params.name,
      animation_login: new Animated.Value(width / 2.4),
    };
  }

  submit = () => {
    var checkflag = 0;
    if (this.state.name === "") {
      checkflag = 1;
      this.setState({
        namehint: "Please Enter Line Name",
        namehintColor: "#fb7a7480",
      });
    }
    if (this.state.activity === "") {
      checkflag = 1;
      this.setState({
        activityhint: "Please Enter Line Activity",
        activityhintColor: "#fb7a7480",
      });
    }
    if (checkflag === 0) {
      fetch(
        "https://qualitylite.bluekaktus.com/api/bkQuality/companyFactory/postFactoryLineDetails",
        {
          method: "POST",
          body: JSON.stringify({
            basicparams: {
              companyID: this.state.companyID,
              userID: this.state.userID,
            },
            lineParams: {
              companyID: this.state.companyID,
              locationgroupID: this.state.floorid,
              lineName: this.state.name,
              lineDesc: this.state.activity,
            },
          }),
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        }
      )
        .then((response) => response.json())
        .then((responseJson) => {
          console.log(responseJson);
          if (responseJson.result === "Record Inserted") {
            Animated.timing(this.state.animation_login, {
              toValue: 60,
              duration: 250,
            }).start();

            setTimeout(() => {
              this.setState({
                enable: false,
              });
            }, 50);

            setTimeout(() => {
              this.props.navigation.pop(1);
            }, 1200);
          }else{
            Alert.alert("Alert!!!  ",responseJson.message)
          }
        })
        .catch((error) =>Alert.alert("Alert!!!  ",error)); //to catch the errors if any
    }
  };

  render() {
    const state = this.state;
    const width = this.state.animation_login;
    return (
      <View style={styles.container}>
        <Text style={styles.title} numberOfLines={1}>
          {this.state.factoryname}
        </Text>
        <Text style={styles.title2} numberOfLines={1}>
          {this.state.floorname}
        </Text>
        <TextInput
          placeholder={this.state.namehint}
          placeholderTextColor={this.state.namehintColor}
          style={styles.input}
          onChangeText={(value) => {
            this.setState({ name: value });
          }}
        />

        <TextInput
          placeholder={this.state.activityhint}
          placeholderTextColor={this.state.activityhintColor}
          style={styles.input}
          onChangeText={(value) => {
            this.setState({ activity: value });
          }}
        />
        <TouchableOpacity activeOpacity={0.8} onPress={this.submit}>
          <View style={styles.button_container}>
            <Animated.View
              style={[
                styles.animation,
                {
                  width,
                },
              ]}
            >
              {this.state.enable ? (
                <Text style={styles.textLogin}>Submit</Text>
              ) : (
                <Animatable.View animation="bounceIn" delay={10}>
                  <FontAwesome
                    name="check"
                    color={Colors.accentColor}
                    size={20}
                    padding={25}
                  />
                </Animatable.View>
              )}
            </Animated.View>
          </View>
        </TouchableOpacity>
        <Text>{this.state.apimsg}</Text>
      </View>
    );
  }
}
const width = Dimensions.get("screen").width;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f6f5f5",
    alignItems: "center",
    justifyContent: "flex-start",
  },
  button: {
    alignContent: "center",
    justifyContent: "center",
    backgroundColor: Colors.primaryColor,
    marginTop: 40,
    width: Dimensions.get("window").width / 3,
    borderRadius: 10,
  },
  title: {
    marginTop: 30,
    fontSize: 40,
    textAlign: "center",
    fontFamily: "effra-heavy",
    color: Colors.primaryColor,
  },
  title2: {
    marginTop: 5,
    fontSize: 32,
    textAlign: "center",
    fontFamily: "effra-heavy",
    color: Colors.primaryColor,
  },
  buttonText: {
    textAlign: "center",
    fontWeight: "bold",
    color: Colors.accentColor,
    fontSize: 25,
    padding: 8,
  },
  input: {
    borderWidth: 3,
    paddingLeft: 20,
    borderColor: Colors.primaryColor,
    padding: 8,
    marginTop: 10,
    color: Colors.primaryColor,
    fontSize: 20,
    fontWeight: "bold",
    borderRadius: 10,
    width: Dimensions.get("window").width / 1.2,
  },

  button_container: {
    alignItems: "center",
    justifyContent: "center",
  },
  textLogin: {
    color: colors.accentColor,
    fontWeight: "bold",
    fontSize: 25,
  },
  animation: {
    backgroundColor: Colors.primaryColor,
    height: 50,
    marginTop: 30,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
});

LineAdd.navigationOptions = (navData) => {
  return {
    headerTitle: "Add Line",
    headerStyle: {
      backgroundColor: Colors.primaryColor,
    },
    headerTintColor: Colors.accentColor,
  };
};

export default LineAdd;
