import React from "react";
import { Platform } from "react-native";
import { HeaderButton } from "react-navigation-header-buttons";
import { Ionicons } from "@expo/vector-icons";

import Colors from "../constants/colors";

const CustomHeaderButton = (props) => {
  return (
    <HeaderButton
      {...props}
      iconSize={29}
      IconComponent={Ionicons}
      color={Colors.accentColor}
    />
  );
};

export default CustomHeaderButton;
