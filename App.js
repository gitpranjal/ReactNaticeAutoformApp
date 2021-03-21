import React, { useState } from "react";
import { Text, View } from "react-native";
import * as Font from "expo-font";
import AppLoading from 'expo-app-loading'
console.disableYellowBox = true;

import ScreenNavigator from "./Navigation/ScreenNavigator";
const fetchFonts = () => {
  return Font.loadAsync({
    "effra-heavy": require("./assets/fonts/Effra_Std_He.ttf"),
    robotoRegular: require("./assets/fonts/Roboto-Regular.ttf"),
  });
};

export default function App() {
  const [fontLoaded, setFontLoaded] = useState(false);

  if (!fontLoaded) {
    return (
      <AppLoading
        startAsync={fetchFonts}
        onFinish={() => setFontLoaded(true)}
        onError={console.warn}
      />
    );
  }
  return <ScreenNavigator />;
}
