import React, { useState } from "react";
import {
  TouchableOpacity,
  TouchableNativeFeedback,
  StyleSheet,
  Text,
  View,
  ScrollView,
  Animated,
  Platform,
  AsyncStorage,
  Alert,
  TextInput,
  Dimensions,
} from "react-native";

import FontAwesome from "react-native-vector-icons/FontAwesome";
import * as Animatable from "react-native-animatable";
import Colors from "../constants/colors";
import colors from "../constants/colors";


class SignUp extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      enable: true,
      dataSource: [],
      apimsg: "",
      err:"",
      companyName: "",
      companyNamehint: "Enter Company Name",
      companyNamehintColor: "#FFFFFFCC",
      address: "",
      addresshint: "Enter Address",
      addresshintColor: "#FFFFFFCC",
      city: "",
      cityhint: "Enter City",
      cityhintColor: "#FFFFFFCC",
      state: "",
      statehint: "Enter State",
      statehintColor: "#FFFFFFCC",
      country: "",
      countryhint: "Enter Country",
      countryhintColor: "#FFFFFFCC",
      GST: "",
      GSThint: "Enter GST No",
      GSThintColor: "#FFFFFFCC",
      zipcode: "",
      zipcodehint: "Enter Zipcode",
      zipcodehintColor: "#FFFFFFCC",
      contactPerson: "",
      contactPersonhint: "Enter Contact Person",
      contactPersonhintColor: "#FFFFFFCC",
      contactEmail: "",
      contactEmailhint: "Enter Contact Email",
      contactEmailhintColor: "#FFFFFFCC",
      contactNo: "",
      contactNohint: "Enter Contact No",
      contactNohintColor: "#FFFFFFCC",
      username: "",
      usernamehint: "Enter Username",
      usernamehintColor: "#FFFFFFCC",
      firstname: "",
      firstnamehint: "Enter First Name",
      firstnamehintColor: "#FFFFFFCC",
      lastname: "",
      lastnamehint: "Enter Last Name",
      lastnamehintColor:"#FFFFFFCC",
      email: "",
      emailhint: "Enter Email",
      emailhintColor: "#FFFFFFCC",
      password: "",
      passwordhint: "Enter Password",
      passwordhintColor: "#FFFFFFCC",
      conpassword: "",
      conpasswordhint: "Confirm Password",
      conpasswordhintColor: "#FFFFFFCC",
      contact: "",
      contacthint: "Enter Contact Number",
      contacthintColor: "#FFFFFFCC",
      animation_login: new Animated.Value(width / 2.4),
    };
  }

  submit = () => {

    async function _storeData(data) {
      console.log(data.companyID)
      const items = {
        LoggedIn: "true",
        companyID: data.companyID,
        userID: data.userID,
      };
      try {
        await AsyncStorage.setItem("LoginParams", JSON.stringify(items));
        
      } catch (error) {
        console.log(error);
      }
    }
    var data;
    var checkflag = 0;
    var errmsg="";
    if (this.state.companyName === "") {
      errmsg="Please Enter Company Name"
      checkflag = 1;
      this.setState({
        companyNamehint: "Please Enter Company Name",
        companyNamehintColor: "#fb7a7480",
        err:errmsg
      });
    }
    if (this.state.address === "") {
      checkflag = 1;
      errmsg="Please Enter Address"
      this.setState({
        addresshint: "Please Enter Address",
        addresshintColor: "#fb7a7480",
        err:errmsg
      });
    }
    if (this.state.city === "") {
      checkflag = 1;
      errmsg="Please Enter City"
      this.setState({
        cityhint: "Please Enter City",
        cityhintColor: "#fb7a7480",
        err:errmsg
      });
    }
    if (this.state.state === "") {
      checkflag = 1;
      errmsg="Please Enter State"
      this.setState({
        statehint: "Please Enter State",
        statehintColor: "#fb7a7480",
        err:errmsg
      });
    }
    if (this.state.country === "") {
      checkflag = 1;
      errmsg="Please Enter Country"
      this.setState({
        countryhint: "Please Enter Country",
        countryhintColor: "#fb7a7480",
        err:errmsg
      });
    }
    if (this.state.zipcode === "") {
        checkflag = 1;
        errmsg="Please Enter Zipcode"
        this.setState({
          zipcodehint: "Please Enter Zipcode",
          zipcodehintColor: "#fb7a7480",
          err:errmsg
        });
      }
      if (this.state.contactPerson === "") {
        checkflag = 1;
        errmsg="Please Enter Contact Person"
        this.setState({
          contactPersonhint: "Please Enter Contact Person",
          contactPersonhintColor: "#fb7a7480",
          err:errmsg
        });
      }
      if (this.state.contactEmail === "") {
        checkflag = 1;
        errmsg="Please Enter Contact Email"
        this.setState({
          contactEmailhint: "Please Enter Contact Email",
          contactEmailhintColor: "#fb7a7480",
          err:errmsg
        });
      }
      if (this.state.contactNo === "") {
        checkflag = 1;
        errmsg="Please Enter Contact No"
        this.setState({
          contactNohint: "Please Enter Contact No",
          contactNohintColor: "#fb7a7480",
          err:errmsg
        });
      }
      if (this.state.GST === "") {
        checkflag = 1;
        errmsg="Please Enter GST No"
        this.setState({
          GSThint: "Please Enter GST No",
          GSThintColor: "#fb7a7480",
          err:errmsg
        });
      }
      if (this.state.password === "") {
        checkflag = 1;
        errmsg="Please Enter Password"
        this.setState({
          passwordhint: "Please Enter Password",
          passwordhintColor: "#fb7a7480",
          err:errmsg
        });
      }
      if (this.state.conpassword === "") {
        checkflag = 1;
        errmsg="Please Confirm Password"
        this.setState({
          conpasswordhint: "Please Confirm Password",
          conpasswordhintColor: "#fb7a7480",
          err:errmsg
        });
      }
      if (this.state.password != this.state.conpassword) {
        checkflag = 1;
        errmsg="Passwords Do Not Match"
        this.setState({
          err:errmsg
        });
      }
    
    if (checkflag === 0) {
        this.setState({
            err:""
        })
      fetch(
        "https://qualitylite.bluekaktus.com/api/bkQuality/users/registerCompany",
        {
          method: "POST",
          body: JSON.stringify({
            registrationParams: {
                companyParams: {
                    companyName:this.state.companyName,
                    companyGSTN: this.state.GST,
                    companyAddress: this.state.address,
                    companyCountry: this.state.country,
                    companyState : this.state.state,
                    companyCity : this.state.city,
                    companyZipcode : this.state.zipcode,
                    contactPerson : this.state.contactPerson,
                    contactPersonEmail : this.state.contactEmail,
                    contactPersonPhone : this.state.contactNo
                },
                 userParams : {
                    userFName: this.state.contactPerson,
                    userLName: this.state.lastname,
                    loginID: this.state.contactEmail,
                    emailID: this.state.contactEmail,
                    loginPwd: this.state.password,
                    contactNo: this.state.contactNo,
                    userRoleID: 4,
                    userPermissionsParams: {
                        editBrand : 1,
                        editSize : 1,
                        editStyle : 1,
                        editColor : 1,
                        editDefects :1,
                        editOrders:1,
                        editReports:1,
                        editCompany : 1,
                        editFactory : 1
                    }
                }
            }
          }),
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        }
      )
        .then((response) => response.json())
        .then((responseJson) => {
          console.log(responseJson)
          if (responseJson.result === "Registration Successful") {
            Animated.timing(this.state.animation_login, {
              toValue: 60,
              duration: 250,
            }).start();
            data=responseJson.loginDetails[0]
            _storeData(data);
            setTimeout(() => {
              this.setState({
                enable: false,
              });
            }, 50);
            setTimeout(() => {
              this.props.navigation.navigate("Home");
            }, 1000);
          }else{
            Alert.alert("Alert!!!  ",responseJson.message);
         }
        })
        .catch((error) => console.log(error)); //to catch the errors if any
     }
     else{
        Alert.alert("Alert!!!  ",errmsg);
     }
  };

  render() {
    const state = this.state;
    const width = this.state.animation_login;
    return (
        <ScrollView keyboardShouldPersistTaps={'handled'}>
            <View style={styles.container}>
                <TextInput
                placeholder={this.state.companyNamehint}
                placeholderTextColor={this.state.companyNamehintColor}
                style={styles.input}
                autoCapitalize="none"
                onChangeText={(value) => {
                    this.setState({ companyName: value });
                }}
                />
                <TextInput
                placeholder={state.GSThint}
                placeholderTextColor={state.GSThintColor}
                style={styles.inputx}
                autoCapitalize="characters"
                onChangeText={(value) => {
                    this.setState({ GST:value });
                }}
                />
                <TextInput
                placeholder={state.addresshint}
                multiline={true}
                placeholderTextColor={state.addresshintColor}
                style={styles.inputx}
                autoCapitalize="none"
                onChangeText={(value) => {
                    this.setState({ address: value });
                }}
                />
                <TextInput
                placeholder={state.cityhint}
                placeholderTextColor={state.cityhintColor}
                style={styles.inputx}
                autoCapitalize="none"
                onChangeText={(value) => {
                    this.setState({ city: value });
                }}
                />
                <TextInput
                placeholder={state.statehint}
                placeholderTextColor={state.statehintColor}
                style={styles.inputx}
                autoCapitalize="none"
                onChangeText={(value) => {
                    this.setState({ state: value });
                }}
                />
                <TextInput
                placeholder={state.countryhint}
                placeholderTextColor={state.countryhintColor}
                style={styles.inputx}
                autoCapitalize="none"
                onChangeText={(value) => {
                    this.setState({ country: value });
                }}
                />
                <TextInput
                placeholder={state.zipcodehint}
                placeholderTextColor={state.zipcodehintColor}
                style={styles.inputx}
                autoCapitalize="none"
                keyboardType="number-pad"
                onChangeText={(value) => {
                    this.setState({ zipcode: value });
                }}
                />
                <TextInput
                placeholder={state.contactPersonhint}
                placeholderTextColor={state.contactPersonhintColor}
                style={styles.inputx}
                autoCapitalize="none"
                onChangeText={(value) => {
                    this.setState({ contactPerson: value });
                }}
                />
                <TextInput
                placeholder={state.contactEmailhint}
                placeholderTextColor={state.contactEmailhintColor}
                style={styles.inputx}
                autoCapitalize="none"
                onChangeText={(value) => {
                    this.setState({ contactEmail: value });
                }}
                />
                <TextInput
                placeholder={state.contactNohint}
                placeholderTextColor={state.contactNohintColor}
                style={styles.inputx}
                keyboardType="number-pad"
                autoCapitalize="none"
                onChangeText={(value) => {
                    this.setState({ contactNo:value });
                }}
                />
                <TextInput
                secureTextEntry
                placeholder={state.passwordhint}
                placeholderTextColor={state.passwordhintColor}
                style={styles.inputx}
                autoCapitalize="none"
                onChangeText={(value) => {
                    this.setState({ password : value });
                }}
                />
                <TextInput
                secureTextEntry
                placeholder={state.conpasswordhint}
                placeholderTextColor={state.conpasswordhintColor}
                style={styles.inputx}
                autoCapitalize="none"
                onChangeText={(value) => {
                    this.setState({ conpassword: value });
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
                <Text style={{color:Colors.accentColor,marginBottom:15,fontSize:20}}>{this.state.err}</Text>
         </View>
      </ScrollView>
    );
  }
}
const width = Dimensions.get("screen").width;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.primaryColor,
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
    borderColor: "white",
    padding: 8,
    marginTop: 20,
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
    borderRadius: 10,
    width: Dimensions.get("window").width / 1.2,
  },
  inputx: {
    borderWidth: 3,
    paddingLeft: 20,
    borderColor: "white",
    padding: 8,
    marginTop: 10,
    color: "white",
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
    color: colors.primaryColor,
    fontWeight: "bold",
    fontSize: 25,
  },
  animation: {
    backgroundColor:"white",
    height: 50,
    marginTop: 30,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
});

SignUp.navigationOptions = (navData) => {
  return {
    headerTitle: "Sign Up",
    headerStyle: {
      backgroundColor: Colors.primaryColor,
    },
    headerTintColor: Colors.accentColor,
  };
};

export default SignUp;
