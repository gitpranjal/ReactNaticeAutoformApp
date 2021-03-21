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

import { CheckBox } from "react-native-elements";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import * as Animatable from "react-native-animatable";
import Colors from "../constants/colors";
import colors from "../constants/colors";

class DefectsAdd extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      enable: true,
      dataSource: [],
      apimsg: "",
      checked: false,
      name: "",
      alternate:"",
      Minor: false,
      userID: props.navigation.state.params.userID,
      companyID: props.navigation.state.params.companyID,
      Major: false,
      Critical: false,
      DefectCode: null,
      DefectlabelColor: "#00334e80",
      Defectlabel: "Select Defect type",
      namehint: "Enter Defect Name",
      namehintColor: "#00334e80",
      alternatehint: "Enter Alternate Description",
      alternatehintColor: "#00334e80",
      animation_login: new Animated.Value(width / 2.4),
    };
  }

  submit = () => {
    var checkflag = 0;
    if (this.state.name === "") {
      checkflag = 1;
      this.setState({
        namehint: "Please Enter Defect Name",
        namehintColor: "#fb7a7480",
      });
    }
    if (
      this.state.Major === false &&
      this.state.Minor === false &&
      this.state.Critical === false
    ) {
      checkflag = 1;
      this.setState({
        Defectlabel: "Please Select Defect type",
        DefectlabelColor: "#fb7a7480",
      });
    }
    if (checkflag === 0) {
      fetch(
        "https://qualitylite.bluekaktus.com/api/bkQuality/masters/PostDefectsDetails",
        {
          method: "POST",
          body: JSON.stringify({
            basicparams: {
              companyID: this.state.companyID,
              userID: this.state.userID,
            },
            defectsParams: {
              companyID: this.state.companyID,
              defectsName: this.state.name,
              defectsType: this.state.DefectCode,
              alternateDescription:this.state.alternate
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
        .catch((error) => console.log(error)); //to catch the errors if any
    }
  };

  render() {
    const state = this.state;
    const width = this.state.animation_login;
    return (
      <View style={styles.container}>
        <TextInput
          placeholder={this.state.namehint}
          placeholderTextColor={this.state.namehintColor}
          style={styles.input}
          onChangeText={(value) => {
            this.setState({ name: value });
          }}
        />
        <Text style={{
          textAlign:"left",
          width:Dimensions.get("window").width / 1.2,
          marginTop:10,
          fontSize:18,
          fontWeight:"bold",
          color:"#00334e80"
        }}>
          * Optional
        </Text>
        <TextInput
          placeholder={this.state.alternatehint}
          placeholderTextColor={this.state.alternatehintColor}
          style={styles.inputx}
          onChangeText={(value) => {
            this.setState({ alternate: value });
          }}
        />
        <View style={styles.type}>
          <Text
            style={{
              fontSize: 20,
              fontWeight: "bold",
              paddingLeft: 10,
              color: this.state.DefectlabelColor,
            }}
          >
            {this.state.Defectlabel}
          </Text>
          <CheckBox
            containerStyle={{
              backgroundColor: "transparent",
              borderColor: "transparent",
              margin: 0,
              width: "80%",
            }}
            title="Minor Defect"
            textStyle={{ color: "#00334eBB", fontSize: 18 }}
            checkedColor={Colors.primaryColor}
            checked={this.state.Minor}
            onPress={() =>
              this.setState({
                Minor: !this.state.Minor,
                Major: false,
                Critical: false,
                DefectCode: 6,
              })
            }
          />
          <CheckBox
            title="Major Defect"
            containerStyle={{
              backgroundColor: "transparent",
              borderColor: "transparent",
              margin: 0,
              width: "80%",
            }}
            textStyle={{ color: "#00334eBB", fontSize: 18 }}
            checkedColor={Colors.primaryColor}
            checked={this.state.Major}
            onPress={() =>
              this.setState({
                Major: !this.state.Major,
                Minor: false,
                Critical: false,
                DefectCode: 4,
              })
            }
          />
          <CheckBox
            title="Critical Defect"
            containerStyle={{
              backgroundColor: "transparent",
              borderColor: "transparent",
              margin: 0,
              width: "80%",
            }}
            textStyle={{ color: "#00334eBB", fontSize: 18 }}
            checkedColor={Colors.primaryColor}
            checked={this.state.Critical}
            onPress={() =>
              this.setState({
                Critical: !this.state.Critical,
                Minor: false,
                Major: false,
                DefectCode: 7,
              })
            }
          />
        </View>
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
  type: {
    backgroundColor: "#f6f5f5",
    justifyContent: "flex-start",
    borderWidth: 3,
    borderColor: Colors.primaryColor,
    padding: 8,
    marginTop: 10,
    color: Colors.primaryColor,
    fontSize: 20,
    fontWeight: "bold",
    borderRadius: 10,
    width: Dimensions.get("window").width / 1.2,
  },
  button: {
    alignContent: "center",
    justifyContent: "center",
    backgroundColor: Colors.primaryColor,
    marginTop: 40,
    width: Dimensions.get("window").width / 3,
    borderRadius: 50,
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
    marginTop: 40,
    color: Colors.primaryColor,
    fontSize: 20,
    fontWeight: "bold",
    borderRadius: 10,
    width: Dimensions.get("window").width / 1.2,
  },
  inputx: {
    borderWidth: 3,
    paddingLeft: 20,
    borderColor: Colors.primaryColor,
    padding: 8,
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

DefectsAdd.navigationOptions = (navData) => {
  return {
    headerTitle: "Add Defects",
    headerStyle: {
      backgroundColor: Colors.primaryColor,
    },
    headerTintColor: Colors.accentColor,
  };
};

export default DefectsAdd;
