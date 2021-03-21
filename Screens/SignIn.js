import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Animated,
  SafeAreaView,
  Platform,
  Keyboard,
  KeyboardAvoidingView,
  Image,
  AsyncStorage,
  Dimensions,
  TouchableOpacity,
  Alert
} from "react-native";
import { TypingAnimation } from "react-native-typing-animation";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import * as Animatable from "react-native-animatable";

import Colors from "../constants/colors";
import colors from "../constants/colors";

import Constants from 'expo-constants';
// import * as Notifications from 'expo-notifications';
import {getExpoPushTokenAsync} from 'expo-notifications'
import * as Permissions from 'expo-permissions'

const registerForPushNotificationsAsync = async (data) => {
  let token;
  if (Constants.isDevice) {
    const { status: existingStatus } = await Permissions.getAsync(Permissions.NOTIFICATIONS);
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
      const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
      finalStatus = status;
    }
    if (finalStatus !== 'granted') {
      Alert.alert('Failed to get push token for push notification!');
      return;
    }
    // token = (await Notifications.getExpoPushTokenAsync()).data;
    token = (await getExpoPushTokenAsync()).data;
    console.log(token);
  } else {
    Alert.alert('Must use physical device for Push Notifications');
  }

  // if (Platform.OS === 'android') {
  //   Notifications.setNotificationChannelAsync('default', {
  //     name: 'default',
  //     importance: Notifications.AndroidImportance.MAX,
  //     vibrationPattern: [0, 250, 250, 250],
  //     lightColor: '#FF231F7C',
  //   });
  // }

  fetch(
    `${ApiUrl}/api/bkQuality/users/savePushNotificationToken`,
    {
      method: "POST",
      body: JSON.stringify({
        basicparams: {
          companyID: data.companyID,
          userID: data.userID,
          androidToken: token
        },
      }),
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    }
  )
  .then(res => res.json())
  .then(body => {
    console.log("########## Token saving response ##########")
    console.log(body.result)
    
  })
  .catch((error) => {
    console.log("#### Push notification token couldn't be saved ####")
    console.log(error)
  }); //to catch the errors if any

  //return token;
}
const ApiUrl = "https://qualitylite.bluekaktus.com"

class SignIn extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      dataSource: [],
      typing_user: false,
      typing_password: false,
      errmsg: "",
      username: "",
      usernameHint: "Username",
      usernameHintColor: "#FFFFFFAA",
      password: "",
      passwordHint: "Password",
      passwordHintColor: "#FFFFFFAA",
      animation_login: new Animated.Value(width - 80),
      enable: true,
      androidToken: ""
    };
  }

   

  _foucus(value) {
    if (value == "user") {
      this.setState({
        typing_user: true,
        typing_password: false,
        typing_cc: false,
      });
    } else if (value == "cc") {
      this.setState({
        typing_user: false,
        typing_password: false,
        typing_cc: true,
      });
    } else if (value == "password") {
      this.setState({
        typing_user: false,
        typing_password: true,
        typing_cc: false,
      });
    }
  }

  _typing() {
    return (
      <TypingAnimation
        dotColor="#FFFFFF"
        style={{ marginRight: 30, marginTop: 5 }}
      />
    );
  }


  _animation() {
    Animated.timing(this.state.animation_login, {
      toValue: 40,
      duration: 250,
    }).start();
    Animated.timing(this.state.animation_login, {
      toValue: 40,
      duration: 250,
    }).start();

    setTimeout(() => {
      this.setState({
        enable: false,
        typing_user: false,
        typing_password: false,
      });
    }, 150);
  }

  
  submit = () => {
    
    async function _storeData(data) {
      // registerForPushNotificationsAsync(data).then(token => {
      //   console.log("##### Push Notification Token ######")
      //   console.log(token)
      //   this.setState({androidToken: token})
      // })
      registerForPushNotificationsAsync(data)
      const items = {
        LoggedIn: "true",
        companyID: data.companyID,
        userID: data.userID,
      };
      console.log(items)
      try {
        await AsyncStorage.setItem("LoginParams", JSON.stringify(items));
      } catch (error) {
        console.log(error);
      }
    }

    var loginOK = "Pending";
    var checkflag = 0;
    Keyboard.dismiss();
    var data;
    // ***********************************************************************************
    // .
    //     Input Check
    // .
    // .**********************************************************************************

    if (this.state.username === "")
      (checkflag = 1),
        this.setState({
          usernameHint: "Please Enter Username",
          usernameHintColor: "#fb7a7480",
          typing_user: false,
          typing_password: false,
        });
    if (this.state.password === "")
      (checkflag = 1),
        this.setState({
          passwordHint: "Please Enter Password",
          passwordHintColor: "#fb7a7480",
          typing_user: false,
          typing_password: false,
        });
    // ***********************************************************************************
    // .
    //     API Call
    // .
    // .**********************************************************************************
    if (checkflag === 0) {

      var details = {
        'username': this.state.username,
        'password': this.state.password,
        'appID':"MASTERS",
        'grant_type': 'password'
    };
    var formBody = [];
    for (var property in details) {
      var encodedKey = encodeURIComponent(property);
      var encodedValue = encodeURIComponent(details[property]);
      formBody.push(encodedKey + "=" + encodedValue);
    }
    formBody = formBody.join("&");

      fetch("https://qualitylite.bluekaktus.com/Token", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: formBody
      })
        .then((response) => response.json())
        .then((responseJson) => {
          data = responseJson;
          console.log(data)
          this.setState({
            loading: false,
            dataSource: responseJson,
          });
          // ***********************************************************************************
          // .
          //     ResponseCheck
          // .
          // .**********************************************************************************
          if (this.state.dataSource.error === null||responseJson.error==="") {
            // ***********************************************************************************
            // .
            //     ResponseOK
            // .
            // .**********************************************************************************
            {
              Animated.timing(this.state.animation_login, {
                toValue: 60,
                duration: 250,
              }).start();
              data=responseJson
              setTimeout(() => {
                this.setState({
                  enable: false,
                  typing_user: false,
                  typing_cc: false,
                  errmsg: null,
                  typing_password: false,
                });
              }, 50);

              _storeData(data);

              
              setTimeout(() => {
                this.props.navigation.navigate("Home");
              }, 700);
            }
          } else {
            console.log("Not Logged in")
            // ***********************************************************************************
            // .
            //     Response NOT OK
            // .
            // .**********************************************************************************
            this.setState({
              username: "",
              typing_user: false,
              typing_cc: false,
              typing_password: false,
              usernameHintColor: "#FFFFFFAA",
              password: "",
              clientcode: "",
              passwordHintColor: "#FFFFFFAA",
              clientHintColor: "#FFFFFFAA",
              errmsg: "Incorrect Details entered",
            });
          }
        });
    }
  };

  render() {
    
    const width = this.state.animation_login;
    if (Platform.OS === "ios") {
      console.log(Platform);
      return (
        <KeyboardAvoidingView style={styles.container} behavior="padding">
        <View style={styles.container}>
          <View style={styles.footer}>
            <Image
              style={{
                flex: 1,
                width: 400,
                alignContent: "center",
                resizeMode: "contain",
              }}
              source={require("../assets/BKLOGO.png")}
            />
            <Text
              style={{
                color: "#FFFFFF",
                fontWeight: "bold",
                fontSize: 30,
                textAlign: "center",
                marginBottom: 10,
              }}
            >
              Sign In
            </Text>
            <View style={styles.action}>
              <TextInput
                placeholder={this.state.usernameHint}
                style={styles.textInput}
                placeholderTextColor={this.state.usernameHintColor}
                autoCapitalize="none"
                onFocus={() => this._foucus("user")}
                onChangeText={(value) => {
                  this.setState({ username: value });
                }}
                value={this.state.username}
              />
              {this.state.typing_user ? this._typing() : null}
            </View>

            <View style={styles.action}>
              <TextInput
                secureTextEntry
                placeholder={this.state.passwordHint}
                style={styles.textInput}
                placeholderTextColor={this.state.passwordHintColor}
                autoCapitalize="none"
                onFocus={() => this._foucus("password")}
                onChangeText={(value) => {
                  this.setState({ password: value });
                }}
                value={this.state.password}
              />
              {this.state.typing_password ? this._typing() : null}
            </View>
            <TouchableOpacity onPress={()=>{this.props.navigation.navigate("SignUp");}}>
              <View style={{flexDirection:"row"}}>
                <Text style={{color:"#FFFFFF",fontSize:18,marginTop:10}}>New User ? </Text>
                <Text style={{color:colors.accentColor,fontSize:18,marginTop:10,fontWeight:"bold"}}>Sign Up</Text>
              </View>
            </TouchableOpacity>

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
                    <Text style={styles.textLogin}>Login</Text>
                  ) : (
                    <Animatable.View animation="bounceIn" delay={50}>
                      <FontAwesome name="check" color={Colors.primaryColor} size={25} />
                    </Animatable.View>
                  )}
                </Animated.View>
              </View>
            </TouchableOpacity>
            <Text style={styles.err}>{this.state.errmsg}</Text>
          </View>
        </View>
        </KeyboardAvoidingView>
      );
    } else {
      return (
        <View style={styles.container}>
          <View style={styles.footer}>
            <Image
              style={{
                flex: 1,
                width: 600,
                alignContent: "center",
                resizeMode: "contain",
              }}
              source={require("../assets/BKLOGO.png")}
            />
            <Text
              style={{
                color: "#FFFFFF",
                fontWeight: "bold",
                fontSize: 30,
                textAlign: "center",
                marginBottom: 10,
              }}
            >
              Sign In
            </Text>
            <View style={styles.action}>
              <TextInput
                placeholder={this.state.usernameHint}
                style={styles.textInput}
                placeholderTextColor={this.state.usernameHintColor}
                autoCapitalize="none"
                onFocus={() => this._foucus("user")}
                onChangeText={(value) => {
                  this.setState({ username: value });
                }}
                value={this.state.username}
              />
              {this.state.typing_user ? this._typing() : null}
            </View>

            <View style={styles.action}>
              <TextInput
                secureTextEntry
                placeholder={this.state.passwordHint}
                style={styles.textInput}
                placeholderTextColor={this.state.passwordHintColor}
                autoCapitalize="none"
                onFocus={() => this._foucus("password")}
                onChangeText={(value) => {
                  this.setState({ password: value });
                }}
                value={this.state.password}
              />
              {this.state.typing_password ? this._typing() : null}
            </View>
            <TouchableOpacity onPress={()=>{this.props.navigation.navigate("SignUp");}}>
              <View style={{flexDirection:"row"}}>
                <Text style={{color:"#FFFFFF",fontSize:18,marginTop:10}}>New User?  </Text>
                <Text style={{color:colors.accentColor,fontSize:18,marginTop:10,fontWeight:"bold"}}>Sign Up</Text>
              </View>
            </TouchableOpacity>

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
                    <Text style={styles.textLogin}>Login</Text>
                  ) : (
                    <Animatable.View animation="bounceIn" delay={50}>
                      <FontAwesome name="check" color={Colors.primaryColor} size={25} />
                    </Animatable.View>
                  )}
                </Animated.View>
              </View>
            </TouchableOpacity>
            <Text style={styles.err}>{this.state.errmsg}</Text>
          </View>
        </View>
      );
    }
  }
}

const width = Dimensions.get("screen").width/1.3;

var styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.primaryColor ,
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    backgroundColor: "#FFFFFFAA",
  },
  footer: {
    marginTop: 200,
    flex: 3,
    padding: 20,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.primaryColor,
    borderTopRightRadius: 50,
  },
  title: {
    color: "black",
    fontWeight: "bold",
  },
  action: {
    flexDirection: "row",
    borderWidth: 2.2,
    paddingLeft: 20,
    borderColor: "#FFFFFF",
    padding: 8,
    marginTop: 10,
    borderRadius: 10,
    height: 55,
    width: Dimensions.get("window").width / 1.2,
  },
  textInput: {
    flex: 1,
    fontSize: 17,
    fontWeight: "bold",
    paddingBottom: 5,
    color: "#FFFFFF",
  },
  button_container: {
    alignItems: "center",
    justifyContent: "center",
    marginBottom:100
  },
  animation: {
    backgroundColor: "#FFFFFF",
    paddingVertical: 10,
    marginTop: 30,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  textLogin: {
    color: Colors.primaryColor,
    paddingVertical:1,
    fontWeight: "bold",
    fontSize: 25,
  },
  err: {
    marginTop: 10,
    color: "#e94560CC",
    fontWeight: "bold",
    fontSize: 18,
  },
  signUp: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 20,
  },
});

SignIn.navigationOptions = (navData) => {
  return {
    headerTitle: "Sign In",
    header: null,
  };
};

export default SignIn;
