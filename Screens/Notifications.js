import React from "react";
import {
  View,
  TouchableOpacity,
  Text,
  Platform,
  ActivityIndicator,
  StyleSheet,
  Image,
  ScrollView,
  RefreshControl,
  FlatList,
  TouchableNativeFeedback,
  AsyncStorage,
} from "react-native";

import * as ScreenOrientation from 'expo-screen-orientation';
import Colors from "../constants/colors";
import NotificationItem from "../components/NotificationItem";

class Notifications extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      userID: props.navigation.state.params.userID,
      companyID: props.navigation.state.params.companyID,
      noData:""
    };
  }


  markAsRead = (id) => {
    fetch(
      "https://qualitylite.bluekaktus.com/api/bkQuality/masters/markNotificationRead",
      {
        method: "POST",
        body: JSON.stringify({
          basicparams: {
            companyID: this.state.companyID,
            userID: this.state.userID,
          },
          notifParams:{
            notifID:[id]
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
        this.fetchdata()
      })
      .catch((error) => console.log(error)); //to catch the errors if any
  };

  
  fetchdata = () => {
    // this.setState({
    //   loading: true,
    // });
    fetch(
      "https://qualitylite.bluekaktus.com/api/bkQuality/masters/getNotificationDetails",
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
        if(responseJson.result.length==0){
          this.setState({
            noData:"No Notifications to Read",
            loading: false,
            dataSource: responseJson.result,
          })
        }else{
          this.setState({
            loading: false,
            dataSource: responseJson.result,
            noData:""
          });
        }
      })
      .catch((error) => console.log(error)); //to catch the errors if any
  };

  componentDidMount() {
    this.fetchdata();
  }

  componentWillUnmount(){
    async function changeScreenOrientation() {
        await ScreenOrientation.unlockAsync();
      }
      changeScreenOrientation()
  }
  renderGridItem = (itemData) => {

    return (
      <NotificationItem 
        name={itemData.item.notifTitle}
        body={itemData.item.notifBody}
        date={itemData.item.notifOn}
        time={itemData.item.notifOnTime}
        onPress={()=> {
          this.props.navigation.navigate({
            routeName: "ReportLine",
            params: {
              factory:itemData.item.factoryName,
              companyID: this.state.companyID,
              userID: this.state.userID,
              id:itemData.item.locationgroupID,
              FromDate:itemData.item.notifOn,
              ToDate:itemData.item.notifOn,
              today:false,
              dateRange:"Custom",
              dateRangex:"custom",
              custom:true
            },
          });
        }}
        markAsRead={()=>{
            this.markAsRead(itemData.item.notifID)}}
      />
    );
  };

  render() {
    let TouchableCmp = TouchableOpacity;

    if (Platform.OS === "android" && Platform.Version >= 21) {
      TouchableCmp = TouchableNativeFeedback;
    }
    let { dataSource } = this.state;
    if (this.state.loading) {
      return (
        <View style={styles.screen}>
          <View style={styles.loader}>
            <ActivityIndicator size="large" color={Colors.primaryColor} />
          </View>
        </View>
      );
    }
    return (
      <View style={styles.screen}>
        <ScrollView
          refreshControl={
            <RefreshControl
              refreshing={this.state.loading}
              onRefresh={this.fetchdata}
            />
          }
        >
          <FlatList
            style={styles.gridItem}
            keyExtractor={(item, index) => item.notifBody}
            data={dataSource}
            renderItem={this.renderGridItem}
          />
          <Text style={{fontSize:25,color:Colors.primaryColor}}>
            {this.state.noData}
          </Text>
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f6f5f5",
  },
});

Notifications.navigationOptions = (navData) => {
  return {
    headerTitle: "Notifications",
    headerStyle: {
      backgroundColor: Colors.primaryColor,
    },
    headerTintColor: Colors.accentColor,
  };
};

export default Notifications;
