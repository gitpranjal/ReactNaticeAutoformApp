import React from "react";
import {
  TouchableOpacity,
  Alert,
  View,
  Text,
  FlatList,
  StyleSheet,
  Platform,
  Switch,
  Dimensions,
  TouchableNativeFeedback,
} from "react-native";

import COStyleItem from "../components/COStyleItem";

import Colors from "../constants/colors";

class OrderCloseSuperItem extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      id: props.id,
      name: props.name,
      deliveryDate:props.deliveryDate,
      orderQty:props.orderQty,
      stitchedPieces:props.stitchedPieces,
      finishedPieces:props.finishedPieces,
      userID:props.userID,
      companyID:props.companyID,
      audit:props.audit,
      loading:false,
      showlist:false,
      expand:[],
      onSelect: props.onSelect,
      closeOrder:props.closeOrder
    };
  }

  Expand = ()=>{
    var show = this.state.showlist
    this.setState({
        showlist:!this.state.showlist
    })
    if(show==false){
        this.setState({
            loading: true,
          });
          fetch(
            "https://qualitylite.bluekaktus.com/api/bkQuality/order/getOrderStatusDetails",
            {
              method: "POST",
              body: JSON.stringify({
                basicparams: {
                  companyID: parseInt(this.state.companyID),
                  userID: parseInt(this.state.userID),
                  orderID:this.state.id
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
                expand: responseJson.result[0].styleDetails
              });
            })
            .catch((error) => console.log(error)); //to catch the errors if any
    }

  }

  renderGridItem = (itemData) => {

    return (
      <COStyleItem
        id={itemData.item.styleID}
        name={itemData.item.styleNo}
        subdata={itemData.item.orderDtDetails}
      />
    );
  };

  render() {
    const state = this.state;
    let TouchableCmp = TouchableOpacity;

    if (Platform.OS === "android" && Platform.Version >= 21) {
      TouchableCmp = TouchableNativeFeedback;
    }
    return (
      <View
        style={{
          backgroundColor:"#00334e",
          flex: 1,
          margin: 3,
          shadowColor: "black",
          shadowOpacity: 0.26,
          shadowOffset: { width: 0, height: 2 },
          shadowRadius: 10,
          elevation: 3,
          borderRadius: 3,
          overflow: "hidden",
        }}
        onPress={state.onSelect}
      >
        <TouchableOpacity activeOpacity={0.8} onPress={()=>{this.Expand()}}>
          <View style={styles.container2}>
            <Text style={styles.title} numberOfLines={1}>
              {state.name}
            </Text>
          </View>
          <View>
            <Text style={styles.deliveryDate} numberOfLines={1}>
              {"Delivery Date: "+ state.deliveryDate}
            </Text>
            <Text style={styles.deliveryDate} numberOfLines={1}>
              {"Order Qty: "+ state.orderQty}
            </Text>
            <View style={{flexDirection:"row",marginRight:15,justifyContent:"space-between"}}>
                <Text style={styles.stitched} numberOfLines={1}>
                {"Stitched Pcs: "+ state.stitchedPieces}
                </Text>
                <Text style={styles.finished} numberOfLines={1}>
                {"Finished Pcs: "+ state.finishedPieces}
                </Text>
            </View>
            <Text style={styles.deliveryDate} numberOfLines={1}>
              {"Audit Status: "+ state.audit}
            </Text>
            <View>
                {(this.state.showlist)?(
                    <FlatList
                    style={styles.gridItem}
                    keyExtractor={(item, index) => item.colorID+item.sizeID+item.styleID+item.qty+item.colorName}
                    data={this.state.expand}
                    renderItem={this.renderGridItem}
                    />
                ):null}
               
            </View>
            <TouchableOpacity activeOpacity={0.8} onPress={()=>{
                        
                                 Alert.alert(
                                    'Do you want to close the Order?',
                                    "You will no longer be able to conduct Audit or use the Checking Application for the Order. ",
                                    [
                                        {
                                            text: 'No',
                                            onPress: () => {},
                                            style:"cancel"
                                          },
                                      {
                                        text: 'Yes',
                                        onPress: () => {this.state.closeOrder()},
                                      },
                                    ],
                                    { cancelable: true }
                                  )}}>
                <Text style={styles.closeOrder} numberOfLines={1}>
                {"Close Order"}
                </Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container2: {
    paddingTop: 5,
    paddingLeft:5,
    flexDirection: "row",
    alignContent: "flex-start",
    justifyContent: "space-between",
  },

  title: {
    paddingLeft: 5,
    paddingRight: 2,
    paddingVertical: 1,
    borderRadius: 4,
    width: "99%",
    fontSize: 22,
    backgroundColor:"#ffffffAA",
    textAlign: "left",
    fontFamily: "robotoRegular",
    fontWeight: "bold",
    color: Colors.primaryColor,
  },
  deliveryDate: {
    paddingLeft: 10,
    paddingRight: 2,
    borderRadius: 4,
    fontSize: 18,
    textAlign: "left",
    fontFamily: "robotoRegular",
    fontWeight: "bold",
    color: "#ffffffCC",
  },
  finished: {
    paddingLeft: 10,
    paddingRight: 2,
    borderRadius: 4,
    fontSize: 18,
    textAlign: "left",
    fontFamily: "robotoRegular",
    fontWeight: "bold",
    color: "#49b675",
  },
  stitched: {
    paddingLeft: 10,
    paddingRight: 2,
    borderRadius: 4,
    fontSize: 18,
    textAlign: "left",
    fontFamily: "robotoRegular",
    fontWeight: "bold",
    color: "#ffeb7a",
  },
  closeOrder: {
    paddingLeft: 5,
    paddingRight: 2,
    paddingVertical: 3,
    borderRadius: 10,
    fontSize: 20,
    marginBottom:6,
    marginTop:3,
    width:"40%",
    alignSelf:"center",
    textAlign: "center",
    fontFamily: "robotoRegular",
    fontWeight: "bold",
    color: Colors.primaryColor,
    backgroundColor: Colors.accentColor
  },
});

export default OrderCloseSuperItem;
