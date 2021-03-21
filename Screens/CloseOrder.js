import React from "react";
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
  Platform,
  RefreshControl,
  Switch,
  ScrollView,
  Alert,
} from "react-native";

import Colors from "../constants/colors";
import OrderCloseSuperItem from "../components/OrderCloseSuperItem";
import { SearchBar } from "react-native-elements";
import { CheckBox } from "react-native-elements";

class CloseOrder extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      showShipped:false,
      showShippedx:0,
      shipped:1,
      dataSource: [],
      fullData: [],
      search: "",
      userID: props.navigation.state.params.userID,
      companyID: props.navigation.state.params.companyID,
    };
  }

  fetchdata = () => {
    this.setState({
      loading: true,
    });
    console.log(JSON.stringify({
      basicparams: {
        companyID: this.state.companyID,
        userID: this.state.userID,
        isShipped:this.state.showShippedx
      },
    }))
    fetch(
      "https://qualitylite.bluekaktus.com/api/bkQuality/order/getOrderStatusList",
      {
        method: "POST",
        body: JSON.stringify({
          basicparams: {
            companyID: this.state.companyID,
            userID: this.state.userID,
            isShipped:this.state.showShippedx
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
          loading: false,
          dataSource: responseJson.result,
          fullData: responseJson.result,
        });
      })
      .catch((error) => console.log(error)); //to catch the errors if any
  };

  closeOrder = (id) => {
    console.log(JSON.stringify({
      basicparams: {
        companyID: this.state.companyID,
        userID: this.state.userID,
        orderId:id,
        markShipped:this.state.shipped
      },
    }))
    fetch(
      "https://qualitylite.bluekaktus.com/api/bkQuality/order/setOrderShipped",
      {
        method: "POST",
        body: JSON.stringify({
          basicparams: {
            companyID: this.state.companyID,
            userID: this.state.userID,
            orderId:id,
            markShipped:this.state.shipped
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
        if(responseJson.result=="Order Marked Shipped"){
            Alert.alert("Order has been Shipped","",
            [
              {
                text: 'Ok',
                onPress: () => {},
                style:"cancel"
              }
            ],
            { cancelable: true }
            )
            this.fetchdata()
        }
        if(responseJson.result=="Order Marked Unshipped"){
          Alert.alert("Order has been Unshipped","",
          [
            {
              text: 'Ok',
              onPress: () => {},
              style:"cancel"
            }
          ],
          { cancelable: true }
          )
          this.fetchdata()
      }
      })
      .catch((error) => console.log(error)); //to catch the errors if any
  };

  searchFilterFunction = (text) => {
    this.setState({
      search: text,
    });
    if (!text || text == "") {
      this.setState({
        dataSource: this.state.fullData,
      });
    } else {
      const newData = this.state.fullData.filter((item) => {
        const itemData = `${item.orderNo.toUpperCase()}`;
        const textData = text.toUpperCase();
        return itemData.includes(textData); // this will return true if our itemData contains the textData
      });

      this.setState({
        dataSource: newData,
      });
    }
  };

  renderGridItem = (itemData) => {

    return (
      <OrderCloseSuperItem
        name={itemData.item.orderNo}
        id={itemData.item.orderID}
        companyID={this.state.companyID}
        userID={this.state.userID}
        deliveryDate={itemData.item.deliveryDate}
        orderQty={itemData.item.orderQty}
        finishedPieces={itemData.item.finishedPieces}
        stitchedPieces={itemData.item.stitchedPieces}
        audit={itemData.item.auditResult}
        closeOrder={()=>{
            this.closeOrder(itemData.item.orderID)}}
      />
    );
  };

  componentDidMount() {
    this.fetchdata();
  }

  render() {
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
        <View style={{flexDirection:"row"}}>
        <SearchBar
          placeholder="Search Here..."
          placeholderTextColor={Colors.primaryColor}
          round
          containerStyle={{
            backgroundColor: "#f6f5f5",
            borderBottomColor: "transparent",
            borderTopColor: "transparent",
            width:250
          }}
          inputContainerStyle={{
            backgroundColor: "#b5b5b580",
            marginHorizontal: 5,
          }}
          editable={true}
          value={this.state.search}
          onChangeText={this.searchFilterFunction}
        />
                <CheckBox
                  size={22}
                  title="Shipped"
                  containerStyle={{
                    backgroundColor: "transparent",
                    borderColor: "transparent",
                    margin:0,
                    marginTop:10,
                    width: "45%",
                    height:40
                  }}
                  textStyle={{
                    color: "#00334eBB",
                    fontSize: 20,
                    margin: 0,
                  }}
                  checkedColor={Colors.primaryColor}
                  checked={this.state.showShipped}
                  onPress={() => {
                    if(this.state.showShipped){
                      this.setState({
                        showShipped: !this.state.showShipped,
                        showShippedx: 0,
                        shipped:1
                      },()=>{this.fetchdata()});
                    }
                    else{
                      this.setState({
                        showShipped: !this.state.showShipped,
                        showShippedx: 1,
                        shipped:0
                      },()=>{this.fetchdata()});
                    }
                    
                  }}
            />
        </View>
       
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
            keyExtractor={(item, index) => item.orderID+item.orderNo+index}
            data={dataSource}
            renderItem={this.renderGridItem}
          />
        </ScrollView>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  gridItem: {
    flex: 1,
    margin: 5,
  },
  screen: {
    flex: 1,
    flexDirection: "column",
    backgroundColor: "#f6f5f5",
  },
  title: {
    paddingBottom: 2,
    fontSize: 25,
    textAlign: "center",
    fontFamily: "effra-heavy",
    color: Colors.accentColor,
  },
});

CloseOrder.navigationOptions = (navData) => {
  return {
    headerTitle: "Close Order",
    headerStyle: {
      backgroundColor: Colors.primaryColor,
    },
    headerTintColor: Colors.accentColor,
  };
};

export default CloseOrder;
