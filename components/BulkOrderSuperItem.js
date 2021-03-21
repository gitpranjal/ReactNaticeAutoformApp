import React, { useState } from "react";
import {
  TouchableOpacity,
  View,
  Text,
  StyleSheet,
  Platform,
  Dimensions,
  FlatList,
  Image,
  TouchableNativeFeedback,
  Switch,
} from "react-native";
import Colors from "../constants/colors";
import moment from "moment"

class BulkOrderSuperItem extends React.Component {

  
  constructor(props) {
    super(props);
    this.state = {
      brandName: props.brandName,
      orderNo: props.orderNo,
      styleNo:props.styleNo,
      brandID: props.brandID,
      orderID: props.orderID,
      styleID: props.styleID,
      colorID: props.colorID,
      colorName: props.colorName,
      inspectionID: props.inspectionID,
      informer: props.informer,
      inspectionOn: props.inspectionOn,
      doneQty: props.doneQty
    };
  }

  render() {
    const state = this.state;
    let TouchableCmp = TouchableOpacity;

    if (Platform.OS === "android" && Platform.Version >= 21) {
      TouchableCmp = TouchableNativeFeedback;
    }
    return (
        <View
        style={{
          backgroundColor: Colors.primaryColor,
          flex: 1,
          margin: 5,
          shadowColor: "black",
          shadowOpacity: 0.26,
          shadowOffset: { width: 0, height: 2 },
          shadowRadius: 10,
          elevation: 3,
          borderRadius: 3,
          overflow: "hidden",
        }}
        // onPress={state.onSelect}
      >
        {/* <TouchableOpacity activeOpacity={0.8} onPress={state.onSelect}> */}
          <View>
          <Text style={{...styles.color, marginTop: 3}} numberOfLines={1}>
              {(state.orderNo).toUpperCase()}
            </Text>
            <Text style={styles.desc} numberOfLines={1}>
              {"Brand:  "+state.brandName.toUpperCase()}
            </Text>
            <Text style={styles.desc} numberOfLines={1}>
              {"Style:  "+state.styleNo}
            </Text>
            <Text style={{...styles.desc, marginBottom: 3}} numberOfLines={1}>
              {"Color:  "+state.colorName}
            </Text>
            <Text style={{...styles.desc, marginBottom: 3}} numberOfLines={1}>
                      {"Quantity Done:  "+state.doneQty}
            </Text>
            {(() => {
              if(state.inspectionOn != "")
                return (
                  <Text style={{...styles.desc, marginBottom: 3}} numberOfLines={1}>
                      {"Date:  "+moment(state.inspectionOn).format('LLL')}
                    </Text>
                )
            })()}

          </View>
          {(() => {
            if(state.inspectionID != 0)
              return(
                <View>
                     
                    <View style={{flexDirection: "row", marginBottom: 10, marginTop: 7, alignSelf: "center"}}> 
                      <TouchableOpacity style={{borderWidth: 2, height: 35,borderColor: "white", borderRadius: 7, width: 150, marginHorizontal: 5, alignItems: "center", justifyContent: "center"}}
                        onPress={() => state.informer("inspection")}
                      >
                        <Text style={{color: "white", fontSize: 15, fontWeight: "bold"}}>View Inspection</Text>
                      </TouchableOpacity>

                      <TouchableOpacity style={{borderWidth: 2, height: 35, borderColor: "white", borderRadius: 7, width: 150, marginHorizontal: 5, alignItems: "center", justifyContent: "center"}}
                        onPress={() => state.informer("report")}
                      >
                        <Text style={{color: "white", fontSize: 15, fontWeight: "bold"}}>View Report</Text>
                      </TouchableOpacity>
                  </View>
                </View>
                

              )

          } )()}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container2: {
    padding: 5,
    flexDirection: "row",
    alignContent: "flex-start",
    justifyContent: "space-between",
  },
  color: {
    paddingRight: 10,
    borderRadius: 4,
    fontSize: 25,
    paddingLeft:10,
    textAlign: "left",
    fontFamily: "robotoRegular",
    fontWeight: "bold",
    maxWidth: Dimensions.get("window").width / 1.2,
    color: Colors.accentColor,
  },
  desc: {
    marginHorizontal: 10,
    textAlignVertical: "top",
    marginBottom: 4,
    borderRadius: 4,
    fontSize: 20,
    textAlign: "left",
    fontFamily: "robotoRegular",
    maxWidth: Dimensions.get("window").width / 1.2,
    color: Colors.accentColor,
  },
  status: {
    marginTop: 6,
    marginLeft: 15,
    marginRight: 10,
    fontSize: 15,
    color: Colors.accentColor,
    textAlign: "center",
    fontFamily: "robotoRegular",
  },
});

export default BulkOrderSuperItem;
