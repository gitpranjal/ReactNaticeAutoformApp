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
import FactorySuperItem from "../components/FactorySuperItem";

class FactoryMasters extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      dataSource: [],
      companyID: props.navigation.state.params.companyID,
      userID: props.navigation.state.params.userID,
    };
  }

  fetchdata = () => {
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
          loading: false,
          dataSource: responseJson.result,
        });
      })
      .catch((error) => console.log(error)); //to catch the errors if any
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
      <FactorySuperItem
        name={itemData.item.factoryName}
        id={itemData.item.factoryID}
        address={itemData.item.address}
        city={itemData.item.city}
        state={itemData.item.state}
        status={itemData.item.status}
        country={itemData.item.country}
        floors={itemData.item.locationgroups}
        color={colorcheck(itemData.item.status)}
        onSelect={() => {
          this.props.navigation.navigate({
            routeName: "FactoryEdits",
            params: {
              name: itemData.item.factoryName,
              id: itemData.item.factoryID,
              address: itemData.item.address,
              city: itemData.item.city,
              state: itemData.item.state,
              status: itemData.item.status,
              floors: itemData.item.locationgroups,
              country: itemData.item.country,
              companyID:this.state.companyID,
              userID:this.state.userID,
              color: colorcheck(itemData.item.status),
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
                  routeName: "FactoryAdd",
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
              Add Factory
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
                  routeName: "FactoryAdd",
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
              Add Factory
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
            style={styles.gridItem}
            keyExtractor={(item, index) => item.factoryID+item.factoryName}
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
    marginHorizontal:10,
    marginTop:10,
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

FactoryMasters.navigationOptions = (navData) => {
  return {
    headerTitle: "Factory Masters",
    headerStyle: {
      backgroundColor: Colors.primaryColor,
    },
    headerTintColor: Colors.accentColor,
  };
};

export default FactoryMasters;
