import React from "react";
import { Text, StyleSheet, View, Button} from "react-native";
import Colors from "../constants/colors"

const UserCard = (props) => {
  return (
    <View style={styles.card}>
    <Text style={styles.title}>{props.userCardData.userFName}</Text>
    <Text >{props.userCardData.loginID}</Text>
    <Text >{props.userCardData.phoneNo}</Text>
  </View>
  )
};

const styles = StyleSheet.create({
  title: {
    fontSize: 30,
    alignSelf: "stretch",
    color: "white",
    backgroundColor: Colors.primaryColor
  },
  card: {
    borderColor: Colors.primaryColor,
    borderWidth: 2,
    height: 100,
    marginHorizontal: 7
    

  }
});

export default UserCard;
