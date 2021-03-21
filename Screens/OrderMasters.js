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
} from "react-native";

import { HeaderButtons, Item } from "react-navigation-header-buttons";
import HeaderButton from "../components/HeaderButton";
import Colors from "../constants/colors";
import OrderSuperItem from "../components/OrderSuperItem";

import { SearchBar } from "react-native-elements";

class OrderMasters extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      dataSource: [],
      fullData: [],
      userID: props.navigation.state.params.userID,
      companyID: props.navigation.state.params.companyID,
    };
  }

  fetchdata = () => {
    this.setState({
      loading: true,
    });
    fetch(
      "https://qualitylite.bluekaktus.com/api/bkQuality/order/getOrderList",
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
          loading: false,
          dataSource: responseJson.result,
          fullData: responseJson.result,
        });
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
    function colorcheck(state) {
      if (state === "INACTIVE") {
        return Colors.inactiveColor;
      } else {
        return Colors.primaryColor;
      }
    }

    return (
      <OrderSuperItem
        name={itemData.item.orderNo}
        id={itemData.item.orderID}
        status={itemData.item.status}
        onSelect={() => {
          this.props.navigation.navigate({
            routeName: "OrderEdit",
            params: {
              name: itemData.item.orderNo,
              id: itemData.item.orderID,
              companyID: this.state.companyID,
              userID: this.state.userID,
              address: itemData.item.address,
              status: itemData.item.status,
            },
          });
        }}
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
          <TouchableOpacity
              activeOpacity={0.8}
              style={styles.topaddbar}
              onPress={() => {
                this.props.navigation.navigate({
                  routeName: "OrderAdd",
                  params: {
                    title: "Add New Factory",
                    companyID: this.state.companyID,
                    userID: this.state.userID,
                  },
                });
              }}
            >
          <View style={styles.addbutton}>
              <Text style={styles.title} numberOfLines={1}>
                +
              </Text>
            </View>
            <Text style={styles.des} numberOfLines={1}>
              Add Order
            </Text>
          </TouchableOpacity>
          <View style={styles.loader}>
            <ActivityIndicator size="large" color={Colors.primaryColor} />
          </View>
        </View>
      );
    }
    return (
      <View style={styles.screen}>
                <TouchableOpacity
              activeOpacity={0.8}
              style={styles.topaddbar}
              onPress={() => {
                this.props.navigation.navigate({
                  routeName: "OrderAdd",
                  params: {
                    title: "Add New Factory",
                    companyID: this.state.companyID,
                    userID: this.state.userID,
                  },
                });
              }}
            >
          <View style={styles.addbutton}>
              <Text style={styles.title} numberOfLines={1}>
                +
              </Text>
            </View>
            <Text style={styles.des} numberOfLines={1}>
              Add Order
            </Text>
          </TouchableOpacity>
        <SearchBar
          placeholder="Search Here..."
          placeholderTextColor={Colors.primaryColor}
          round
          containerStyle={{
            backgroundColor: "#f6f5f5",
            borderBottomColor: "transparent",
            borderTopColor: "transparent",
          }}
          inputContainerStyle={{
            backgroundColor: "#b5b5b580",
            marginHorizontal: 5,
          }}
          editable={true}
          value={this.state.search}
          onChangeText={this.searchFilterFunction}
        />
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
            keyExtractor={(item, index) => item.orderNo}
            extraData={this.state}
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
  des: {
    paddingLeft: 15,
    fontSize: 22,
    textAlign: "center",
    paddingBottom: 5,
    textAlignVertical: "center",
    color: Colors.primaryColor,
  },
  topaddbar: {
    marginTop: 10,
    marginHorizontal:10,
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "flex-start",
    backgroundColor: "#f6f5f5",
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
});

OrderMasters.navigationOptions = (navData) => {
  return {
    headerTitle: "Orders",
    headerStyle: {
      backgroundColor: Colors.primaryColor,
    },
    headerTintColor: Colors.accentColor,
  };
};

export default OrderMasters;
