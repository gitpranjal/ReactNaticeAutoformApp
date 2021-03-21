import React, { useState } from "react";
import {
  TouchableOpacity,
  View,
  Text,
  StyleSheet,
  Platform,
  FlatList,
  ScrollView,
  RefreshControl,
  Dimensions,
  ActivityIndicator,
  Alert,
  TouchableNativeFeedback,
  Switch,
  TextInput,
} from "react-native";

import { CheckBox } from "react-native-elements";
import { AntDesign } from "@expo/vector-icons";
import Colors from "../constants/colors";
import FloorSuperItem from "../components/FloorSuperItem";

class FactoryEdit extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: props.navigation.state.params.name,
      id: props.navigation.state.params.id,
      checked:false,
      address: props.navigation.state.params.address,
      city: props.navigation.state.params.city,
      state: props.navigation.state.params.state,
      country: props.navigation.state.params.country,
      status: props.navigation.state.params.status,
      floors: props.navigation.state.params.floors,
      color: props.navigation.state.params.color,
      companyID: props.navigation.state.params.companyID,
      userID: props.navigation.state.params.userID,
      savebuttontoggle: false,
      loading: false,
    };
  }

  fetchdata = () => {
    this.setState({
      loading: true,
    });
    fetch(
      "https://qualitylite.bluekaktus.com/api/bkQuality/companyFactory/getLocationgroupDetails",
      {
        method: "POST",
        body: JSON.stringify({
          basicparams: {
            companyID: this.state.companyID,
            userID: this.state.userID,
            factoryID: this.state.id,
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
          loading: false,
          floors: responseJson.result,
        });
      })
      .catch((error) => console.log(error)); //to catch the errors if any
  };

  updatedata = () => {
    fetch(
      "https://qualitylite.bluekaktus.com/api/bkQuality/companyFactory/postFactoryDetails",
      {
        method: "POST",
        body: JSON.stringify({
          basicparams: {
            companyID: this.state.companyID,
            userID: this.state.userID,
          },
          factoryParams: {
            companyID: this.state.companyID,
            factoryID: this.state.id,
            factoryName: this.state.name,
            factoryAddress: this.state.address,
            factoryCity: this.state.city,
            factoryState: this.state.state,
            factoryCountry: this.state.country,
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
          this.setState({
            savebuttontoggle: false,
          });
        }else{
          Alert.alert("Alert!!!  ",responseJson.message)
        }
      })
      .catch((error) => Alert.alert("Alert!!!  ",error)); //to catch the errors if any
  };

  renderGridItem = (itemData) => {
    const state = this.state;
    function colorcheck(state) {
      if (state === "INACTIVE") {
        return Colors.inactiveColor;
      } else {
        return Colors.primaryColor;
      }
    }

    return (
      <FloorSuperItem
        name={itemData.item.locationgroupName}
        id={itemData.item.locationgroupID}
        status={itemData.item.status}
        lines={itemData.item.lines}
        color={colorcheck(itemData.item.status)}
        onSelect={() => {
          this.props.navigation.navigate({
            routeName: "FloorEdits",
            params: {
              title: state.name,
              name: itemData.item.locationgroupName,
              id: itemData.item.locationgroupID,
              factid: this.state.id,
              companyID: this.state.companyID,
              userID: this.state.userID,
              status: itemData.item.status,
              lines: itemData.item.lines,
              color: colorcheck(itemData.item.status),
            },
          });
        }}
      />
    );
  };

  changeStatus=()=>{
    fetch(
      "https://qualitylite.bluekaktus.com/api/bkQuality/companyFactory/setFactoryStatus",
      {
        method: "POST",
        body: JSON.stringify({
          basicparams: {
            companyID: this.state.companyID,
            userID: this.state.userID,
          },
          factoryStatusParams: {
            factoryID: this.state.id,
            setActive: !this.state.checked
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
        if (responseJson.result === "Factory inactivated") {
          Alert.alert("Alert!!!  ",responseJson.result)
          this.fetchdata()
          this.setState({
            checked:!this.state.checked
          })
          if(this.state.checked===true){
            this.setState({
              status:"ACTIVE",
              color:Colors.primaryColor
            })
          }
          else{
            this.setState({
              status:"INACTIVE",
              color:Colors.inactiveColor
            })
          }
        }
        if (responseJson.result === "Factory activated") {
          Alert.alert("Alert!!!  ",responseJson.result)
          this.fetchdata()
          this.setState({
            checked:!this.state.checked
          })
          if(this.state.checked===true){
            this.setState({
              status:"ACTIVE",
              color:Colors.primaryColor
            })
          }
          else{
            this.setState({
              status:"INACTIVE",
              color:Colors.inactiveColor
            })
          }
        }
        else{
          Alert.alert("Alert!!!  ",responseJson.result)
        }
      })
      .catch((error) =>{
        console.log(error)
        Alert.alert("Alert!!!  ","An error has occured")}); //to catch the errors if any
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
  // componentDidMount() {
  //   this.fetchdata();
  // }

  render() {
    const state = this.state;

    let TouchableCmp = TouchableOpacity;
    let { gridItem } = styles;
    if (Platform.OS === "android" && Platform.Version >= 21) {
      TouchableCmp = TouchableNativeFeedback;
    }
    if (this.state.loading) {
      return (
        <View style={styles.screen}>
          <View style={{ backgroundColor: state.color }}>
          <View
                style={{
                  flexDirection: "row",
                  flex: 0,
                  alignContent:"center",
                  height: "auto",
                  width: Dimensions.get("window").width,
                  justifyContent: "flex-start",
                  alignItems: "flex-start",
                }}
              >
                <Text style={styles.des2}>Status : </Text>
                <Text style={styles.statusx}>{state.status}</Text>
                {/* <View style={{
                    width: 50,
                    height: 50,
                    margin: 10,
                  }}> */}
                <CheckBox
                  size={20}
                  title={this.state.status}
                  containerStyle={{
                    backgroundColor: "transparent",
                    borderColor: "transparent",
                    margin: 0,
                  }}
                  textStyle={{
                    color: Colors.accentColor,
                    fontSize: 18,
                    margin: 0,
                  }}
                  style={{margin:0,padding: 0,}}
                  checkedColor={Colors.accentColor}
                  uncheckedColor={Colors.accentColor}
                  checked={this.state.checked}
                  onPress={() => {
                    
                    this.setState({
                      // checked:!this.state.checked
                    },()=>{
                      this.changeStatus()
                  })
                  }}
            />
            {/* </View> */}
              </View>
              <View
                style={{
                  flexDirection: "row",
                  flex: 0,
                  height: "auto",
                  width: Dimensions.get("window").width,
                  justifyContent: "flex-start",
                  alignItems: "flex-start",
                }}
              >
                <Text style={styles.des2}>Address : </Text>
                <TextInput
                  style={styles.statusz}
                  value={this.state.address}
                  spellCheck={false}
                  autoCorrect={false}
                  underlineColorAndroid="transparent"
                  onChangeText={(value) => {
                    this.setState({ address: value, savebuttontoggle: true });
                  }}
                />
              </View>
              <View
                style={{
                  flexDirection: "row",
                  flex: 0,
                  height: "auto",
                  width: Dimensions.get("window").width,
                  justifyContent: "flex-start",
                  alignItems: "flex-start",
                }}
              >
                <Text style={styles.des}>City : </Text>
                <TextInput
                  style={styles.status}
                  value={this.state.city}
                  spellCheck={false}
                  autoCorrect={false}
                  underlineColorAndroid="transparent"
                  onChangeText={(value) => {
                    this.setState({ city: value, savebuttontoggle: true });
                  }}
                />
              </View>
              <View
                style={{
                  flexDirection: "row",
                  flex: 0,
                  height: "auto",
                  width: Dimensions.get("window").width,
                  justifyContent: "flex-start",
                  alignItems: "flex-start",
                }}
              >
                <Text style={styles.des}>State : </Text>
                <TextInput
                  style={styles.status}
                  value={this.state.state}
                  spellCheck={false}
                  autoCorrect={false}
                  underlineColorAndroid="transparent"
                  onChangeText={(value) => {
                    this.setState({ state: value, savebuttontoggle: true });
                  }}
                />
              </View>
              <View
                style={{
                  flexDirection: "row",
                  flex: 0,
                  height: "auto",
                  width: Dimensions.get("window").width,
                  justifyContent: "flex-start",
                  alignItems: "flex-start",
                }}
              >
                <Text style={styles.des}>Country : </Text>
                <TextInput
                  style={styles.status2}
                  value={this.state.country}
                  spellCheck={false}
                  autoCorrect={false}
                  underlineColorAndroid="transparent"
                  onChangeText={(value) => {
                    this.setState({ country: value, savebuttontoggle: true });
                  }}
                />
              </View>
              <View style={{ alignContent: "center", alignItems: "center" }}>
                {this.state.savebuttontoggle ? (
                  <TouchableOpacity onPress={this.updatedata}>
                    <Text style={styles.save}>Save</Text>
                  </TouchableOpacity>
                ) : null}
              </View>
              </View>
              <View style={{alignContent:"center",justifyContent:"center",alignItems:"center"}}>
            <ActivityIndicator size="large" color={Colors.primaryColor} />
          </View>
        </View>
      );
    }else{
        return (
          <View style={styles.screen}>
            <View style={{ backgroundColor: state.color }}>
              <View
                style={{
                  flexDirection: "row",
                  flex: 0,
                  alignContent:"center",
                  height: "auto",
                  width: Dimensions.get("window").width,
                  justifyContent: "flex-start",
                  alignItems: "flex-start",
                }}
              >
                <Text style={styles.des2}>Status : </Text>
                <Text style={styles.statusx}>{state.status}</Text>
                {/* <View style={{
                    width: 50,
                    height: 50,
                    margin: 10,
                  }}> */}
                <CheckBox
                  size={20}
                  title={this.state.status}
                  containerStyle={{
                    backgroundColor: "transparent",
                    borderColor: "transparent",
                    margin: 0,
                  }}
                  textStyle={{
                    color: Colors.accentColor,
                    fontSize: 18,
                    margin: 0,
                  }}
                  style={{margin:0,padding: 0,}}
                  checkedColor={Colors.accentColor}
                  uncheckedColor={Colors.accentColor}
                  checked={this.state.checked}
                  onPress={() => {
                    
                    this.setState({
                      // checked:!this.state.checked
                    },()=>{
                      this.changeStatus()
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
            {/* </View> */}
              </View>
              <View
                style={{
                  flexDirection: "row",
                  flex: 0,
                  height: "auto",
                  width: Dimensions.get("window").width,
                  justifyContent: "flex-start",
                  alignItems: "flex-start",
                }}
              >
                <Text style={styles.des2}>Address : </Text>
                <TextInput
                  style={styles.statusz}
                  value={this.state.address}
                  spellCheck={false}
                  autoCorrect={false}
                  underlineColorAndroid="transparent"
                  onChangeText={(value) => {
                    this.setState({ address: value, savebuttontoggle: true });
                  }}
                />
              </View>
              <View
                style={{
                  flexDirection: "row",
                  flex: 0,
                  height: "auto",
                  width: Dimensions.get("window").width,
                  justifyContent: "flex-start",
                  alignItems: "flex-start",
                }}
              >
                <Text style={styles.des}>City : </Text>
                <TextInput
                  style={styles.status}
                  value={this.state.city}
                  spellCheck={false}
                  autoCorrect={false}
                  underlineColorAndroid="transparent"
                  onChangeText={(value) => {
                    this.setState({ city: value, savebuttontoggle: true });
                  }}
                />
              </View>
              <View
                style={{
                  flexDirection: "row",
                  flex: 0,
                  height: "auto",
                  width: Dimensions.get("window").width,
                  justifyContent: "flex-start",
                  alignItems: "flex-start",
                }}
              >
                <Text style={styles.des}>State : </Text>
                <TextInput
                  style={styles.status}
                  value={this.state.state}
                  spellCheck={false}
                  autoCorrect={false}
                  underlineColorAndroid="transparent"
                  onChangeText={(value) => {
                    this.setState({ state: value, savebuttontoggle: true });
                  }}
                />
              </View>
              <View
                style={{
                  flexDirection: "row",
                  flex: 0,
                  height: "auto",
                  width: Dimensions.get("window").width,
                  justifyContent: "flex-start",
                  alignItems: "flex-start",
                }}
              >
                <Text style={styles.des}>Country : </Text>
                <TextInput
                  style={styles.status2}
                  value={this.state.country}
                  spellCheck={false}
                  autoCorrect={false}
                  underlineColorAndroid="transparent"
                  onChangeText={(value) => {
                    this.setState({ country: value, savebuttontoggle: true });
                  }}
                />
              </View>
              <View style={{ alignContent: "center", alignItems: "center" }}>
                {this.state.savebuttontoggle ? (
                  <TouchableOpacity onPress={this.updatedata}>
                    <Text style={styles.save}>Save</Text>
                  </TouchableOpacity>
                ) : null}
              </View>
            </View>
            <TouchableOpacity activeOpacity={0.8} style={styles.topaddbar} onPress={() => {
                  this.props.navigation.navigate({
                    routeName: "FloorAdd",
                    params: {
                      title: "Add New Floor",
                      id: this.state.id,
                      companyID: this.state.companyID,
                      userID: this.state.userID,
                      name: this.state.name,

                    },
                  });
                }}>
            <View style={styles.addbutton}>
              <Text style={styles.title} numberOfLines={1}>
                +
              </Text>
            </View>
            <Text style={styles.add} numberOfLines={1}>
              Add Floor
            </Text>
            </TouchableOpacity>
            <ScrollView
              refreshControl={
                <RefreshControl
                  refreshing={this.state.loading}
                  onRefresh={this.fetchdata}
                />
              }
            >
              <FlatList
                style={{ gridItem }}
                keyExtractor={(item, index) => item.locationgroupID}
                data={state.floors}
                renderItem={this.renderGridItem}
              />
            </ScrollView>
          </View>
        );
      }
  }
}
const styles = StyleSheet.create({
  screen: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "flex-start",
    backgroundColor: "#f6f5f5",
  },
  details: {
    width: Dimensions.get("window").width,
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "flex-start",
  },
  addbutton: {
    backgroundColor: Colors.primaryColor,
    justifyContent: "center",
    alignContent: "center",
    borderRadius: 15,
    width: 30,
    height: 30,
  },
  title: {
    paddingBottom: 2,
    fontSize: 25,
    textAlign: "center",
    fontFamily: "effra-heavy",
    color: Colors.accentColor,
  },
  add: {
    paddingLeft: 15,
    fontSize: 22,
    textAlign: "center",
    paddingBottom: 5,
    textAlignVertical: "center",
    color: Colors.primaryColor,
  },
  status: {
    paddingTop: 8,
    marginLeft: 5,
    fontSize: 18,
    fontFamily: "robotoRegular",
    textAlign: "left",
    fontWeight: "bold",
    minWidth: "10%",
    borderBottomColor: "#ee6f57AA",
    borderBottomWidth: 1,
    color: Colors.accentColor,
  },
  statusz: {
    paddingTop: 8,
    marginLeft: 5,
    fontSize: 18,
    fontFamily: "robotoRegular",
    textAlign: "left",
    fontWeight: "bold",
    minWidth: "10%",
    borderBottomColor: "#ee6f57AA",
    borderBottomWidth: 1,
    color: Colors.accentColor,
  },
  statusx: {
    paddingTop: 10,
    marginLeft: 5,
    fontSize: 18,
    minWidth: "10%",
    width:"30%",
    fontFamily: "robotoRegular",
    textAlign: "left",
    fontWeight: "bold",
    color: Colors.accentColor,
  },
  status2: {
    paddingTop: 5,
    marginLeft: 5,
    marginBottom: 10,
    fontSize: 18,
    fontFamily: "robotoRegular",
    textAlign: "center",
    fontWeight: "bold",
    borderBottomColor: "#ee6f57AA",
    borderBottomWidth: 1,
    color: Colors.accentColor,
  },
  des: {
    paddingTop: 5,
    paddingLeft: 5,
    paddingBottom: 3,
    marginLeft: 15,
    textAlignVertical:"center",
    fontSize: 18,
    fontFamily: "robotoRegular",
    textAlign: "center",
    color: Colors.accentColor,
  },
  des2: {
    paddingTop: 10,
    paddingLeft: 5,
    paddingBottom: 3,
    marginLeft: 15,
    textAlignVertical:"center",
    fontSize: 18,
    fontFamily: "robotoRegular",
    textAlign: "center",
    color: Colors.accentColor,
  },
  save: {
    fontFamily: "robotoRegular",
    textAlign: "center",
    fontWeight: "bold",
    marginBottom: 8,
    fontSize: 18,
    width: "20%",
    backgroundColor: Colors.accentColor,
    color: Colors.primaryColor,
    borderRadius: 3,
    paddingHorizontal: 15,
    paddingVertical: 2,
  },
  gridItem: {
    flex: 1,
    margin: 5,
    justifyContent: "flex-start",
    alignItems: "flex-start",
    overflow: "hidden",
  },
  topaddbar: {
    marginHorizontal:10,
    marginTop:10,
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "flex-start",
  },
});

FactoryEdit.navigationOptions = (navData) => {
  const dashname = navData.navigation.getParam("name");
  const headcolor = navData.navigation.getParam("color");
  return {
    headerTitle: dashname,
    headerStyle: {
      backgroundColor: headcolor,
    },
    headerTintColor: Colors.accentColor,
  };
};

export default FactoryEdit;
