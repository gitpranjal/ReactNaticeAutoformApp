import React, { useState } from "react";
import PropTypes from "prop-types"
import {
  TouchableOpacity,
  View,
  Text,
  StyleSheet,
  Platform,
  Dimensions,
  FlatList,
  TouchableNativeFeedback,
  Switch,
} from "react-native";
import Colors from "../constants/colors";

class CustomForm extends React.Component {
    static propTypes = {
      content: PropTypes.string.isRequired,
      textStyles: PropTypes.oneOfType([
        PropTypes.array,
        PropTypes.number,
        PropTypes.shape({}),
      ]).isRequired,
      buttonStyles: PropTypes.oneOfType([
        PropTypes.array,
        PropTypes.number,
        PropTypes.shape({}),
      ]).isRequired,
    }

    render = () => {
        const { textStyles, buttonStyles, content } = this.props;
        
        return (
          <TouchableOpacity style={buttonStyles}>
            <Text style={textStyles}>{content}</Text>
          </TouchableOpacity>
        );
      }
    }
  export default CustomForm;