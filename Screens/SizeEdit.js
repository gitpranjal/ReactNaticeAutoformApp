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

class SizeEdit extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      enable: true,
      dataSource: [],
      apimsg: "",
      checked: false,
      status: props.navigation.state.params.status,
      name: props.navigation.state.params.name,
      id: props.navigation.state.params.id,
      userID: props.navigation.state.params.userID,
      companyID: props.navigation.state.params.companyID,
      namehint: "Enter Size",
      namehintColor: "#00334e80",
      animation_login: new Animated.Value(width / 2.4),
    };
  }


  componentDidMount() {
    if(this.state.status==="ACTIVE"){
      this.setState({
        checked:true
      })
    }else{
      this.setState({
        checked:false
      })
    }
  }


  submit = () => {
    var checkflag = 0;
    if (this.state.name === "") {
      checkflag = 1;
      this.setState({
        namehint: "Please Enter Size",
        namehintColor: "#fb7a7480",
      });
    }
    if (checkflag === 0) {
      fetch(
        "https://qualitylite.bluekaktus.com/api/bkQuality/masters/PostSizeDetails",
        {
          method: "POST",
          body: JSON.stringify({
            basicparams: {
              companyID: this.state.companyID,
              userID: this.state.userID,
            },
            sizeParams: {
              companyID: this.state.companyID,
              sizeId: this.state.id,
              sizeName: this.state.name,
              status:this.state.status,
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
          if (responseJson.result === "Record Updated") {
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
        .catch((error) =>  Alert.alert("Alert!!!  ",error)); //to catch the errors if any
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
          value={this.state.name}
          style={styles.input}
          onChangeText={(value) => {
            this.setState({ name: value });
          }}
        />
        <CheckBox
                  size={25}
                  title={this.state.status}
                  containerStyle={{
                    backgroundColor: "transparent",
                    borderColor: "transparent",
                    margin: 0,
                    width: "45%",
                  }}
                  textStyle={{
                    color: "#00334eBB",
                    fontSize: 24,
                    margin: 0,
                  }}
                  checkedColor={Colors.primaryColor}
                  checked={this.state.checked}
                  onPress={() => {
                    this.setState({
                      checked:!this.state.checked
                    },()=>{
                      if(this.state.checked===true){
                      this.setState({
                        status:"ACTIVE"
                      })
                    }
                    else{
                      this.setState({
                        status:"INACTIVE"
                      })
                    }
                  })
                  }}
            />
        <TouchableOpacity onPress={this.submit}>
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
                <Text style={styles.textLogin}>Update</Text>
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

SizeEdit.navigationOptions = (navData) => {
  return {
    headerTitle: "Edit Size",
    headerStyle: {
      backgroundColor: Colors.primaryColor,
    },
    headerTintColor: Colors.accentColor,
  };
};

export default SizeEdit;
