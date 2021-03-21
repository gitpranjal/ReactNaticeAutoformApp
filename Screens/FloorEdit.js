import React, { useState } from "react";
import {
  TouchableOpacity,
  View,
  Text,
  StyleSheet,
  Platform,
  FlatList,
  Dimensions,
  TouchableNativeFeedback,
  Switch,
  TextInput,
  Alert,
  ActivityIndicator,
  RefreshControl,
  ScrollView,
} from "react-native";

import { CheckBox } from "react-native-elements";
import Colors from "../constants/colors";
import LineSuperItem from "../components/LineSuperItem";

class FloorEdit extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      checked:false,
      name: props.navigation.state.params.name,
      title: props.navigation.state.params.title,
      id: props.navigation.state.params.id,
      factid: props.navigation.state.params.factid,
      status: props.navigation.state.params.status,
      lines: props.navigation.state.params.lines,
      userID: props.navigation.state.params.userID,
      companyID: props.navigation.state.params.companyID,
      factoryname: props.navigation.state.params.name,
      color: props.navigation.state.params.color,
      savebuttontoggle: false,
      loading: false,
    };
  }

  fetchdata = () => {
    this.setState({
      loading: true,
    });
    fetch(
      "https://qualitylite.bluekaktus.com/api/bkQuality/companyFactory/getLineDetails",
      {
        method: "POST",
        body: JSON.stringify({
          basicparams: {
            companyID: this.state.companyID,
            userID: this.state.userID,
            locationgroupID: this.state.id,
            factoryID: this.state.factid,
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
          lines: responseJson.result,
        });
      })
      .catch((error) => console.log(error)); //to catch the errors if any
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
            locationgroupID: this.state.id,
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
        if (responseJson.result === "Floor inactivated") {
          Alert.alert("Alert!!!  ",responseJson.result)
          this.fetchdata()
          this.setState({
            checked:!this.state.checked
          })
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
        }
        if (responseJson.result === "Floor activated") {
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

  updatedata = () => {
    fetch(
      "https://qualitylite.bluekaktus.com/api/bkQuality/companyFactory/postLocationgroupDetails",
      {
        method: "POST",
        body: JSON.stringify({
          basicparams: {
            companyID: this.state.companyID,
            userID: this.state.userID,
          },
          locationgroupParams: {
            companyID: this.state.companyID,
            FactoryLocationGroupID: this.state.id,
            factoryID: this.state.factid,
            locationgroupDesc: this.state.name,
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
      <LineSuperItem
        name={itemData.item.lineName}
        id={itemData.item.lineID}
        status={itemData.item.status}
        activity={itemData.item.lineDesc}
        color={colorcheck(itemData.item.status)}
        onSelect={() => {
          this.props.navigation.navigate({
            routeName: "LineEdits",
            params: {
              name: itemData.item.lineName,
              id: itemData.item.lineID,
              floorid: this.state.id,
              factid: this.state.factid,
              floorname: this.state.name,
              factory: this.state.title,
              companyID: this.state.companyID,
              userID: this.state.userID,
              status: itemData.item.status,
              activity: itemData.item.lineDesc,
              color: colorcheck(itemData.item.status),
            },
          });
        }}
      />
    );
  };

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
                height: "auto",
                width: Dimensions.get("window").width,
                justifyContent: "flex-start",
                alignItems: "flex-start",
              }}
            >
              <Text style={styles.des}>Name : </Text>
              <TextInput
                style={styles.status}
                value={this.state.name}
                spellCheck={false}
                autoCorrect={false}
                underlineColorAndroid="transparent"
                onChangeText={(value) => {
                  this.setState({ name: value, savebuttontoggle: true });
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
              <Text style={styles.des}>Status : </Text>
              <Text style={styles.statusx}>{state.status}</Text>
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
            </View>
            <View style={{ alignContent: "center", alignItems: "center" }}>
              {this.state.savebuttontoggle ? (
                <TouchableOpacity onPress={this.updatedata}>
                  <Text style={styles.save}>Save</Text>
                </TouchableOpacity>
              ) : null}
            </View>
          </View>
          <TouchableOpacity
              activeOpacity={0.8}
              style={styles.topaddbar}
              onPress={() => {
                this.props.navigation.navigate({
                  routeName: "LineAdd",
                  params: {
                    title: "Add New Line",
                    id: this.state.id,
                    factid: this.state.factid,
                    name: this.state.name,
                    factory: this.state.title,
                    companyID: this.state.companyID,
                    userID: this.state.userID,
                  },
                });
              }}
            >
            <View style={styles.addbutton}>
              <Text style={styles.titlex} numberOfLines={1}>
                +
              </Text>
            </View>
            <Text style={styles.add} numberOfLines={1}>
              Add Line
            </Text>
          </TouchableOpacity>
          <View style={styles.loader}>
            <ActivityIndicator size="large" color={Colors.primaryColor} />
          </View>
        </View>
      );
    } else {
      return (
        <View style={styles.screen}>
          <View style={{ backgroundColor: state.color }}>
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
              <Text style={styles.des}>Name : </Text>
              <TextInput
                style={styles.status}
                value={this.state.name}
                spellCheck={false}
                autoCorrect={false}
                underlineColorAndroid="transparent"
                onChangeText={(value) => {
                  this.setState({ name: value, savebuttontoggle: true });
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
              <Text style={styles.des}>Status : </Text>
              <Text style={styles.statusx}>{state.status}</Text>
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
            </View>
            <View style={{ alignContent: "center", alignItems: "center" }}>
              {this.state.savebuttontoggle ? (
                <TouchableOpacity onPress={this.updatedata}>
                  <Text style={styles.save}>Save</Text>
                </TouchableOpacity>
              ) : null}
            </View>
          </View>
          <TouchableOpacity
              activeOpacity={0.8}
              style={styles.topaddbar}
              onPress={() => {
                this.props.navigation.navigate({
                  routeName: "LineAdd",
                  params: {
                    title: "Add New Line",
                    id: this.state.id,
                    companyID: this.state.companyID,
                    userID: this.state.userID,
                    factid: this.state.factid,
                    name: this.state.name,
                    factory: this.state.title,
                  },
                });
              }}
            >
            <View style={styles.addbutton}>
              <Text style={styles.titlex} numberOfLines={1}>
                +
              </Text>
            </View>
            <Text style={styles.add} numberOfLines={1}>
              Add Line
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
              keyExtractor={(item, index) => item.lineID}
              data={state.lines}
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
    borderWidth: 1,
    borderRadius: 15,
    width: 30,
    height: 30,
  },
  des: {
    paddingTop: 10,
    paddingLeft: 25,
    fontSize: 18,
    fontFamily: "robotoRegular",
    textAlign: "center",
    color: Colors.accentColor,
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
  statusx: {
    paddingTop: 10,
    marginBottom: 5,
    marginLeft: 5,
    fontSize: 18,
    width: "35%",
    fontFamily: "robotoRegular",
    textAlign: "left",
    fontWeight: "bold",
    color: Colors.accentColor,
  },
  gridItem: {
    flex: 1,
    margin: 5,
    justifyContent: "flex-start",
    alignItems: "flex-start",
    overflow: "hidden",
  },
  add: {
    paddingLeft: 15,
    fontSize: 22,
    textAlign: "center",
    color: Colors.primaryColor,
  },
  titlex: {
    paddingBottom: 2,
    fontSize: 25,
    textAlign: "center",
    fontFamily: "effra-heavy",
    color: Colors.accentColor,
  },
  topaddbar: {
    marginHorizontal:10,
    marginTop:10,
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "flex-start",
  },
});

FloorEdit.navigationOptions = (navData) => {
  const dashname = navData.navigation.getParam("title");
  const headcolor = navData.navigation.getParam("color");
  return {
    headerTitle: dashname,
    headerStyle: {
      backgroundColor: Colors.primaryColor,
    },
    headerTintColor: Colors.accentColor,
  };
};

export default FloorEdit;
