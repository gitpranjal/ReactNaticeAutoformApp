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

import FactoryNotifGroup from "../components/FactoryNotifGroup";

class NotificationSettings extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      enable: true,
      dataSource: [],
      Lines:[],
      SelectedLines:[],
      apimsg: "",
      userID: 0,
      companyID: 0,
      DHUTimelabelColor: "#00334e80",
      DHUTimelabel: "",
      DHUTime:"",
      DHUVallabelColor: "#00334e80",
      DHUVallabel: "",
      DHUVal:"",
      RejTimelabelColor: "#00334e80",
      RejTimelabel: "",
      RejTime:"",
      RejVallabelColor: "#00334e80",
      RejVallabel: "",
      RejVal:"",
      NOPTimelabelColor: "#00334e80",
      NOPTimelabel: "",
      NOPTime:"",
      DHUID:0,
      RejID:0,
      NOPID:0,
      animation_login: new Animated.Value(width / 2.4),
    };
    this.retrieveData()
  }


  getLines = () => {
    this.setState({
      loading: true,
    });
    fetch(
      "https://qualitylite.bluekaktus.com/api/bkQuality/companyFactory/getAllfactoryDetails",
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
        this.setState({
          Lines: responseJson.result,
        });
        this.fetchdata()
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
            this.getLines()});
        
      }
    } catch (error) {}
  };

  fetchdata = () => {
    // this.setState({
    //   loading: true,
    // });
    fetch(
      "https://qualitylite.bluekaktus.com/api/bkQuality/notifications/getNotifConfiguration",
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
        var DHUTime=0
        var DHUVal=0
        var RejTime=0
        var RejVal=0
        var NOPTime=0
        var SelectedLines=[]
        var DHUID=0
        var REJID=0
        var NOPID=0
        SelectedLines=responseJson.result.notifLineDetails
        responseJson.result.notifConfigDetails.forEach(function (item, index) {
          if(item.notifName=="DHU_THRESHOLD"){
           DHUTime=item.notifIntervalMinutes
           DHUVal=item.notifThreshold
           DHUID=item.notifConfigID
          }
          if(item.notifName=="REJECTION_THRESHOLD"){
            RejTime=item.notifIntervalMinutes
            RejVal=item.notifThreshold
            REJID=item.notifConfigID
           }
           if(item.notifName=="NO_CHECKING"){
            NOPTime=item.notifIntervalMinutes
            NOPID=item.notifConfigID
           }
          });
          this.state.Lines.forEach(function (item, index) {
            item.locationgroups.forEach(function  (itemx, index) {
              var NewSubline=[]
              itemx.lines.forEach(function  (itemxx, index) {
                var NewLineItem={lineID:itemxx.lineID,lineName:itemxx.lineName,checked:false}
                SelectedLines.forEach(function  (itemxxx, index) {
                  if(NewLineItem.lineID==itemxxx.lineID){
                    NewLineItem.checked=true
                  }
                })
                NewSubline.push(NewLineItem)
              })
              itemx.lines=NewSubline
            })
            });
          this.setState({
            loading: false,
            DHUTimelabel:DHUTime.toString(),
            DHUVallabel:DHUVal.toString(),
            RejTimelabel:RejTime.toString(),
            RejVallabel:RejVal.toString(),
            NOPTimelabel:NOPTime.toString(),
            DHUID:DHUID,
            RejID:REJID,
            NOPID:NOPID,
            SelectedLines:SelectedLines
        })
      })
      .catch((error) => console.log(error)); //to catch the errors if any
  };

  renderGridItem = (itemData) => {
    return (
      // <FactoryNotifGroup
      //   name={itemData.item.factoryName}
      //   floors={itemData.item.locationgroups}
      //   SelectedLines={this.state.SelectedLines}
      // />
      <View
      style={{
        flex: 1,
      }}
    >
      <TouchableOpacity activeOpacity={0.8}>
        <View style={styles.container2}>
          <Text style={{    textAlign: "left",
                            paddingRight: 5,
                            fontSize: 22,
                            fontWeight:"bold",
                            width:Dimensions.get("window").width/1.1,
                            paddingHorizontal:5,
                            color: Colors.primaryColor,}} numberOfLines={2}>
            {itemData.item.factoryName}
          </Text>
            <FlatList
              style={styles.gridItem}
              scrollEnabled={true}
              keyExtractor={(item, index) => item.locationgroupName+item.locationgroupID}
              data={itemData.item.locationgroups}
              renderItem={(itemDatax)=>{
                return(
                  <View
                  style={{
                    flex: 1,
                  }}
                >
                  <TouchableOpacity activeOpacity={0.8}>
                    <View style={styles.container2}>
                      <Text style={{
                            textAlign: "left",
                            paddingRight: 5,
                            fontSize: 18,
                            fontWeight:"bold",
                            width:Dimensions.get("window").width/1.3,
                            paddingLeft:25,
                            color:"#00334eCC",
                      }} numberOfLines={2}>
                        {itemDatax.item.locationgroupName}
                      </Text>
                        <FlatList
                          style={styles.gridItem}
                          scrollEnabled={true}
                          keyExtractor={(item, index) => item.lineName+item.lineID}
                          data={itemDatax.item.lines}
                          renderItem={(itemDataxx)=>{
                            return(
                              <View
                              style={{
                                flex: 1,
                              }}
                            >
                              <TouchableOpacity activeOpacity={0.8}>
                                <View style={{marginLeft:20,marginBottom:-5}}>
                                <CheckBox
                                  containerStyle={{
                                    backgroundColor: "transparent",
                                    borderColor: "transparent",
                                    margin: 0,
                                    width: "80%",
                                  }}
                                  title={itemDataxx.item.lineName}
                                  textStyle={{ color: "#003344CC", fontSize: 18 }}
                                  checkedColor={Colors.primaryColor}
                                  checked={itemDataxx.item.checked}
                                  onPress={() =>{
                                    console.log(itemData)
                                    var ref = this.state.Lines;
                                    ref[itemData.index].locationgroups[itemDatax.index].lines[itemDataxx.index].checked=! ref[itemData.index].locationgroups[itemDatax.index].lines[itemDataxx.index].checked
                                    console.log(ref[itemData.index].locationgroups[itemDatax.index].lines[itemDataxx.index])
                                    // ref[index].isChecked = !ref[index].isChecked;
                                    this.setState({
                                      Lines: ref,
                                    })
                                  }
                                }
                                />
                                </View>
                              </TouchableOpacity>
                            </View>
                            )
                          }}
                        />
                    </View>
                  </TouchableOpacity>
                </View>
                )
              }}
            />
        </View>
      </TouchableOpacity>
    </View>
    );
  };

  submit=()=>{
    var SelectedLines = []
    this.state.Lines.forEach(function (item, index) {
      item.locationgroups.forEach(function  (itemx, index) {
        itemx.lines.forEach(function  (itemxx, index) {
          if(itemxx.checked){
            SelectedLines.push(itemxx.lineID)
          }
        })
      })
      });
      var DHUTime=""
      if(this.state.DHUTime==""){
        DHUTime=this.state.DHUTimelabel
      }else{
        DHUTime=this.state.DHUTime
      }

      var DHUVal=""
      if(this.state.DHUVal==""){
        DHUVal=this.state.DHUVallabel
      }else{
        DHUVal=this.state.DHUVal
      }

      var RejTime=""
      if(this.state.RejTime==""){
        RejTime=this.state.RejTimelabel
      }else{
        RejTime=this.state.RejTime
      }

      var RejVal=""
      if(this.state.RejVal==""){
        RejVal=this.state.RejVallabel
      }else{
        RejVal=this.state.RejVal
      }

      var NOPTime=""
      if(this.state.NOPTime==""){
        NOPTime=this.state.NOPTimelabel
      }else{
        NOPTime=this.state.NOPTime
      }
      console.log(JSON.stringify({
        basicparams: {
          companyID: this.state.companyID,
          userID: this.state.userID,
        },
        notifParams: {
          notifConfigDetails:[
            {
              notifConfigID: this.state.DHUID,
              notifName: "DHU_THRESHOLD",
              notifThreshold:DHUVal,
              notifMinPcs:"20",
              notifIntervalMinutes:DHUTime,
              notifStatus:true,
              notifDtDetails:[],
            },
            {
              notifConfigID: this.state.RejID,
              notifName: "REJECTION_THRESHOLD",
              notifThreshold:RejVal,
              notifMinPcs:"20",
              notifIntervalMinutes:RejTime,
              notifStatus:true,
              notifDtDetails:[],
            },
            // {
            //   notifConfigID: this.state.NOPID,
            //   notifName: "NO_CHECKING",
            //   notifThreshold:null,
            //   notifMinPcs:null,
            //   notifIntervalMinutes:NOPTime,
            //   notifStatus:true,
            //   notifDtParams: [
            //     {
            //         paramName: "START_TIME",
            //         paramIntValue: 540,
            //         paramDecimalValue: null,
            //         paramDatetimeValue: null
            //     },
            //     {
            //         paramName: "END_TIME",
            //         paramIntValue: 1080,
            //         paramDecimalValue: null,
            //         paramDatetimeValue: null
            //     }
            // ],
            // }
          ],
          notifLineDetails:SelectedLines
        },
      }))
      fetch(
        "https://qualitylite.bluekaktus.com/api/bkQuality/notifications/saveNotifConfiguration",
        {
          method: "POST",
          body: JSON.stringify({
            basicparams: {
              companyID: this.state.companyID,
              userID: this.state.userID,
            },
            notifParams: {
              notifConfigParams:[
                {
                  notifConfigID: this.state.DHUID,
                  notifName: "DHU_THRESHOLD",
                  notifThreshold:DHUVal,
                  notifMinPcs:"20",
                  notifIntervalMinutes:DHUTime,
                  notifStatus:true,
                  notifDtParams:[],
                },
                {
                  notifConfigID: this.state.RejID,
                  notifName: "REJECTION_THRESHOLD",
                  notifThreshold:RejVal,
                  notifMinPcs:"20",
                  notifIntervalMinutes:RejTime,
                  notifStatus:true,
                  notifDtParams:[],
                },
                // {
                //   notifConfigID: this.state.NOPID,
                //   notifName: "NO_CHECKING",
                //   notifThreshold:null,
                //   notifMinPcs:null,
                //   notifIntervalMinutes:NOPTime,
                //   notifStatus:true,
                //   notifDtParams: [
                //     {
                //         paramName: "START_TIME",
                //         paramIntValue: 540,
                //         paramDecimalValue: null,
                //         paramDatetimeValue: null
                //     },
                //     {
                //         paramName: "END_TIME",
                //         paramIntValue: 1080,
                //         paramDecimalValue: null,
                //         paramDatetimeValue: null
                //     }
                // ],
                // }
              ],
              notifUserParams:{
                notifLineIDs:SelectedLines
              }
              
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
          if (responseJson.result === "Data Saved") {
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
           <Text style={styles.title}>DHU</Text>
           <View style={{flexDirection:"row",justifyContent:"flex-start",flexWrap:'wrap'}}>
               <Text  style={styles.body}>{"Send Notification every  "}</Text>
               <TextInput
                placeholder={this.state.DHUTimelabel}
                placeholderTextColor={this.state.DHUTimelabelColor}
                style={styles.input}
                keyboardType="number-pad"
                onChangeText={(value) => {
                    this.setState({ DHUTime: value });
                }}
                />
                <Text style={styles.body}>{" minutes "}</Text>
                <Text style={styles.body}>{"when "}</Text>
                <Text style={styles.body}>{"DHU "}</Text>
                <Text  style={styles.body}>{"exceeds "}</Text>
               <TextInput
                placeholder={this.state.DHUVallabel}
                placeholderTextColor={this.state.DHUVallabelColor}
                style={styles.input}
                keyboardType="number-pad"
                onChangeText={(value) => {
                    this.setState({ DHUVal: value });
                }}
                />
                <Text style={styles.body}>{" %"}</Text>
           </View>
       </View>
       <View style={{justifyContent:"flex-start",margin:10,borderColor:Colors.primaryColor,borderWidth:3,
                    borderRadius:8,paddingHorizontal:10,paddingVertical:8}}>
           <Text style={styles.title}>Rejection</Text>
           <View style={{flexDirection:"row",justifyContent:"flex-start",flexWrap:'wrap'}}>
               <Text  style={styles.body}>{"Send Notification every  "}</Text>
               <TextInput
                placeholder={this.state.RejTimelabel}
                placeholderTextColor={this.state.RejTimelabelColor}
                style={styles.input}
                keyboardType="number-pad"
                onChangeText={(value) => {
                    this.setState({ RejTime: value });
                }}
                />
                <Text style={styles.body}>{" minutes "}</Text>
                <Text style={styles.body}>{"when "}</Text>
                <Text style={styles.body}>{"Rejected Pcs. "}</Text>
                <Text  style={styles.body}>{"exceeds "}</Text>
               <TextInput
                placeholder={this.state.RejVallabel}
                placeholderTextColor={this.state.RejVallabelColor}
                style={styles.input}
                keyboardType="number-pad"
                onChangeText={(value) => {
                    this.setState({ RejVal: value });
                }}
                />
           </View>
       </View>
       <View style={{justifyContent:"flex-start",margin:10,borderColor:Colors.primaryColor,borderWidth:3,
                    borderRadius:8,paddingHorizontal:10,paddingVertical:8}}>
           <Text style={styles.title}>No Pcs Checked</Text>
           <View style={{flexDirection:"row",justifyContent:"flex-start",flexWrap:'wrap'}}>
               <Text  style={styles.body}>{"Send Notification every  "}</Text>
               <TextInput
                placeholder={this.state.NOPTimelabel}
                placeholderTextColor={this.state.NOPTimelabelColor}
                style={styles.input}
                keyboardType="number-pad"
                onChangeText={(value) => {
                    this.setState({ NOPTime: value });
                }}
                />
                <Text style={styles.body}>{" minutes "}</Text>
                <Text style={styles.body}>{"no "}</Text>
                <Text style={styles.body}>{"Pcs. "}</Text>
                <Text  style={styles.body}>{"is checked "}</Text>
           </View>
       </View>
       <View style={{justifyContent:"flex-start",margin:10,borderColor:Colors.primaryColor,borderWidth:3,
                    borderRadius:8,paddingHorizontal:10,paddingVertical:8}}>
           <Text style={styles.title}>Line filters</Text>
           <FlatList
            style={styles.gridItem}
            keyExtractor={(item, index) => item.factoryID+item.factoryName}
            extraData={this.state}
            data={this.state.Lines}
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
  input: {
    color: Colors.primaryColor,
    fontSize: 18,
    fontWeight: "bold",
    borderBottomColor:Colors.primaryColor,
    borderBottomWidth:2
  },
  title: {
    textAlign: "left",
    fontWeight: "bold",
    color: "#FFFFFF",
    backgroundColor:Colors.primaryColor,
    paddingLeft:15,
    borderRadius:5,
    fontSize: 20,
  },
  body: {
    textAlign: "left",
    fontWeight: "bold",
    color: Colors.primaryColor,
    fontSize: 18,
  },
  bodyx: {
    textAlign: "left",
    fontWeight: "bold",
    color: Colors.primaryColor,
    fontSize: 18,
    marginLeft:10
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

NotificationSettings.navigationOptions = (navData) => {
  return {
    headerTitle: "Notification Settings",
    headerStyle: {
      backgroundColor: Colors.primaryColor,
    },
    headerTintColor: Colors.accentColor,
  };
};

export default NotificationSettings;
