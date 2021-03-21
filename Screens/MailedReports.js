import React, { useState } from "react";
import {
  TouchableOpacity,
  TouchableNativeFeedback,
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
  Alert,
  Animated,
  AsyncStorage,
  FlatList,
   ScrollView,
  Platform,
  TextInput,
  Dimensions,
} from "react-native";

import { CheckBox } from "react-native-elements";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import * as Animatable from "react-native-animatable";
import Colors from "../constants/colors";
import colors from "../constants/colors";


class MailedReports extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      enable: true,
      Users:[], 
      animation_login: new Animated.Value(width / 2.4),
    };
    this.retrieveData()
  }


  getUsers = () => {
    this.setState({
      loading: true,
    });
    fetch(
      "https://qualitylite.bluekaktus.com/api/bkQuality/reports/getEmailReportsUsers",
      {
        method: "POST",
        body: JSON.stringify({
          basicparams: {
            companyID: this.state.companyID,
            userID: this.state.userID,
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
          console.log(responseJson)
        this.setState({
          loading:false,
          Users: responseJson.result,
        });
      })
      .catch((error) => console.log(error)); //to catch the errors if any
  };


  retrieveData = async () => {
   
    try {
      const loginstatus = await AsyncStorage.getItem("LoginParams");
      const data = JSON.parse(loginstatus);
      if (data !== null) {
        this.setState({
          companyID: data.companyID,
          userID: data.userID,
          loading:false
        },()=>{
            this.getUsers()});
        
      }
    } catch (error) {}
  };


  renderGridItem = (itemData) => {
    return (
      <View
      style={{
        flex: 1,
      }}
    >
       <CheckBox
        containerStyle={{
            backgroundColor: "transparent",
            borderColor: "transparent",
            margin: 0,
            width: "80%",
        }}
        title={itemData.item.userFName+"  "+itemData.item.userLName}
        textStyle={{ color: "#003344CC", fontSize: 18 }}
        checkedColor={Colors.primaryColor}
        checked={itemData.item.sendEmailReports}
        onPress={() =>{
            var ref = this.state.Users;
            ref[itemData.index].sendEmailReports=! ref[itemData.index].sendEmailReports
            console.log(ref[itemData.index].sendEmailReports)
            // ref[index].isChecked = !ref[index].isChecked;
            this.setState({
            Users: ref,
            })
        }
        }
        />                                                      
    </View>
    );
  };

  submit=()=>{
    var Users = []
    this.state.Users.forEach(function (item, index) {
      Users.push({userID:item.userID,sendEmail:item.sendEmailReports})
      });
    console.log(Users)
      console.log(JSON.stringify({
        basicparams: {
          companyID: this.state.companyID,
          userID: this.state.userID,
        },
        reportParams: {
            userEmails:Users,
        },
      }))
      fetch(
        "https://qualitylite.bluekaktus.com/api/bkQuality/reports/saveEmailReportsUsers",
        {
          method: "POST",
          body: JSON.stringify({
            basicparams: {
              companyID: this.state.companyID,
              userID: this.state.userID,
            },
            reportParams: {
                userEmails:Users,
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
          console.log(responseJson)
          if (responseJson.result === "Data Updated") {
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
        .catch((error) => console.log(error)); //to catch the errors    if any
    }
  
  render() {
    const state = this.state;
    const width = this.state.animation_login;
    if (this.state.loading) {
      return (
        <View style={styles.loader}>
          <ActivityIndicator size="large" color={Colors.primaryColor} />
        </View>
      );
    }else{
    return (
      <View style={styles.container}>
      <ScrollView>
       <View style={{justifyContent:"flex-start",margin:10,borderColor:Colors.primaryColor,borderWidth:3,
                    borderRadius:8,paddingHorizontal:10,paddingVertical:8}}>
           <Text style={styles.title} numberOfLines={2}>Mail Daily Production Reports to: </Text>
           <FlatList
            style={styles.gridItem}
            keyExtractor={(item, index) => item.factoryID+item.factoryName}
            extraData={this.state}
            data={this.state.Users}
            renderItem={this.renderGridItem}
          />
       </View>
       </ScrollView>
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
                <Text style={styles.textLogin}>Save</Text>
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
}
const width = Dimensions.get("screen").width;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f6f5f5",
    alignItems: "center",
    justifyContent: "flex-start",
  },
  title: {
    textAlign: "left",
    fontWeight: "bold",
    color: "#FFFFFF",
    backgroundColor:Colors.primaryColor,
    paddingHorizontal:12,
    borderRadius:5,
    fontSize: 18,
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

MailedReports.navigationOptions = (navData) => {
  return {
    headerTitle: "Notification Settings",
    headerStyle: {
      backgroundColor: Colors.primaryColor,
    },
    headerTintColor: Colors.accentColor,
  };
};

export default MailedReports;
