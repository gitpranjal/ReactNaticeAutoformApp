import React from "react";
import { View, FlatList, StyleSheet,ActivityIndicator } from "react-native";

import Dashlets from "../components/Dashlets";
import Colors from "../constants/colors";

class Masters extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      dataSource: [],
      cards:[],
      userID: props.navigation.state.params.userID,
      companyID: props.navigation.state.params.companyID,
    };
  }

  getCards=()=>{
    this.setState({
      loading: true,
    });
    fetch(
      "https://qualitylite.bluekaktus.com/api/bkQuality/users/getMastersCards",
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
          cards: responseJson.result.cardDetails,
        });
      })
      .catch((error) => console.log(error)); //to catch the errors if any
  };

  renderGridItem = (itemData) => {
    function pathcheck(title) {
      if (title === "Colors") {
        return "ColorMasters";
      }
      if (title === "Brands") {
        return "BrandMasters";
      }
      if (title === "Sizes") {
        return "SizeMasters";
      }
      if (title === "Processes") {
        return "ProcessMaster";
      }
      if (title === "Styles") {
        return "StylesMasters";
      }
      if (title === "Defects") {
        return "DefectsMasters";
      } else {
        return "Masters";
      }
    }

    return (
      <Dashlets
        title={itemData.item.screenCode}
        key={itemData.item.screenNo}
        id={itemData.item.screenNo}
        description={itemData.item.screenName}
        onSelect={() => {
          this.props.navigation.navigate({
            routeName: pathcheck(itemData.item.screenName),
            params: {
              id: itemData.item.screenNo,
              title: itemData.item.screenName,
              companyID: this.state.companyID,
              userID: this.state.userID,
            },
          });
        }}
      />
    );
  };

    componentDidMount() {
    this.getCards();
  }

  render() {
    let { gridItem } = styles;
    if (this.state.loading) {
      return (
        <View style={styles.loader}>
          <ActivityIndicator size="large" color={Colors.primaryColor} />
        </View>
      );
    }else{
    return (
      <View style={styles.screen}>
        <FlatList
          style={styles.gridItem}
          keyExtractor={(item, index) => item.screenNo}
          data={this.state.cards}
          renderItem={this.renderGridItem}
          numColumns={2}
        />
      </View>
    );
  }
}
}
const styles = StyleSheet.create({
  screen: {
    flex: 1,
    flexDirection: "column",
    // justifyContent: "center",
    // alignItems: "center",
    backgroundColor: "#f6f5f5",
  },
  gridItem: {
    flex: 1,
    margin: 5,
    height: 150,
  },
});

Masters.navigationOptions = (navData) => {
  return {
    headerTitle: "Masters",
    headerStyle: {
      backgroundColor: Colors.primaryColor,
    },
    headerTintColor: Colors.accentColor,
  };
};

export default Masters;
