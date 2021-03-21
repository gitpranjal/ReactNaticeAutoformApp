import React, { useState } from "react";
import {
  TouchableOpacity,
  TouchableNativeFeedback,
  StyleSheet,
  Text,
  View,
  Animated,
  FlatList,
  ScrollView,
  RefreshControl,
  ActivityIndicator,
  Platform,
  Image,
  Alert,
  Button,
  TextInput,
  Dimensions,
} from "react-native";

import * as ImagePicker from "expo-image-picker";
import * as ImageManipulator from 'expo-image-manipulator';
import { CheckBox } from "react-native-elements";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import * as Animatable from "react-native-animatable";
import Colors from "../constants/colors";
import colors from "../constants/colors";

class StyleEdit extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      loading1: false,
      loading2: false,
      loading3: false,
      loading4: false,
      enable: true,
      dataSource: [],
      apimsg: "",
      checkedx:true,
      checked: false,
      status: props.navigation.state.params.status,
      userID: props.navigation.state.params.userID,
      companyID: props.navigation.state.params.companyID,
      name: "",
      namehint: "Enter Style No.",
      namehintColor: "#00334e80",
      description: "",
      descriptionhint: "Enter Style Description",
      descriptionhintColor: "#00334e80",
      Brands: [],
      SelectedBrands: [],
      Colors: [],
      SelectedColors: [],
      Sizes: [],
      SelectedSizes: [],
      Defects: [],
      SelectedDefects: [],
      Processes: [],
      Minor: false,
      Major: false,
      Critical: false,
      frontpath: "",
      backpath: "",
      id: props.navigation.state.params.id,
      BrandslabelColor: "#00334eDD",
      Brandslabel: "Select Brands",
      FrontImagelabelColor: "#00334eDD",
      FrontImagelabel: "Select Front Image",
      BackImagelabelColor: "#00334eDD",
      BackImagelabel: "Select Back Image",
      ColorslabelColor: "#00334eDD",
      Colorslabel: "Select Colors",
      DefectslabelColor: "#00334eDD",
      Defectslabel: "Select Defects",
      SizeslabelColor: "#00334eDD",
      Sizeslabel: "Select Sizes",
      ProcesslabelColor: "#00334eDD",
      Processlabel: "Select Processes",
      frontcontour:"",
      backcontour:"",
      FCX:"",
      BCX:"",
      animation_login: new Animated.Value(width / 2.4),
    };
  }
  openImagePickerAsync = async () => {
    let permissionResult = await ImagePicker.requestCameraRollPermissionsAsync();

    if (permissionResult.granted === false) {
      alert("Permission to access camera roll is required!");
      return;
    }

    let pickerResult = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      quality:0.5,
      aspect: [3, 4],
    });
    let resize = await ImageManipulator.manipulateAsync(pickerResult.uri,[{ resize:{width:600,height:800} },],
      { compress: 1, format: ImageManipulator.SaveFormat.PNG }
    );
    this.setState({
      frontpath: resize.uri,
    });

    this.contourgen1(resize.uri)
  };

  openCameraAsync = async () => {
    let permissionResult = await ImagePicker.requestCameraPermissionsAsync();

    if (permissionResult.granted === false) {
      alert("Permission to access camera is required!");
      return;
    }

    let pickerResult = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      quality:0.5,
      aspect: [3, 4],
    });
    let resize = await ImageManipulator.manipulateAsync(pickerResult.uri,[{ resize:{width:600,height:800} },],
      { compress: 1, format: ImageManipulator.SaveFormat.PNG }
    );
    this.setState({
      frontpath: resize.uri,
    });

    this.contourgen1(resize.uri)
  };

  openCameraAsync2 = async () => {
    let permissionResult = await ImagePicker.requestCameraPermissionsAsync();

    if (permissionResult.granted === false) {
      alert("Permission to access camera is required!");
      return;
    }

    let pickerResult = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      quality:0.5,
      aspect: [3, 4],
    });
    let resize = await ImageManipulator.manipulateAsync(pickerResult.uri,[{ resize:{width:600,height:800} },],
      { compress: 1, format: ImageManipulator.SaveFormat.PNG }
    );
    this.setState({
      backpath: resize.uri,
    });

    this.contourgen2(resize.uri)
  };

  contourgen1=(urix)=>{
    var formdata = new FormData();
    formdata.append("image", {
      uri: urix,
      name: "image1.jpg",
      type: "image/jpeg",
    });
    this.setState({
      loading2:true,
      frontcontour:"https://www.google.com/url?sa=i&url=https%3A%2F%2Fgfycat.com%2Fdearwellinformeddalmatian&psig=AOvVaw2EraaQAvbsH7YfnzxUzTpL&ust=1609311938024000&source=images&cd=vfe&ved=0CAIQjRxqFwoTCJC086bQ8u0CFQAAAAAdAAAAABBG"
    })
 
    fetch(
      "http://ai.bluekaktus.com/api/contourApi/getContourImage",
      {
        method: "POST",
        body: formdata,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    )
      .then((response) => response.json())
      .then((responseJson) => {
        this.setState({
          frontcontour:responseJson.contour,
          FCX:responseJson.contour
        })
      })
      .catch((error) => {Alert.alert("An error has occured!!","This seems to be a server issue. Pls wait and try again later...")}); //to catch the errors if any
  }

  openImagePickerAsync2 = async () => {
    let permissionResult = await ImagePicker.requestCameraRollPermissionsAsync();

    if (permissionResult.granted === false) {
      alert("Permission to access camera roll is required!");
      return;
    }

    let pickerResult = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      quality:0.5,
      aspect: [3, 4],
    });
    let resize = await ImageManipulator.manipulateAsync(pickerResult.uri,[{ resize:{width:600,height:800} },],
      { compress: 1, format: ImageManipulator.SaveFormat.PNG }
    );
    this.setState({
      backpath: resize.uri,
    });
    this.contourgen2(resize.uri)
  };

  contourgen2=(urix)=>{
    var formdata = new FormData();
    formdata.append("image", {
      uri: urix,
      name: "image1.jpg",
      type: "image/jpeg",
    });
   this.setState({
     loading3:true,
     backcontour:"https://www.google.com/url?sa=i&url=https%3A%2F%2Fgfycat.com%2Fdearwellinformeddalmatian&psig=AOvVaw2EraaQAvbsH7YfnzxUzTpL&ust=1609311938024000&source=images&cd=vfe&ved=0CAIQjRxqFwoTCJC086bQ8u0CFQAAAAAdAAAAABBG"
   })

    fetch(
      "http://ai.bluekaktus.com/api/contourApi/getContourImage",
      {
        method: "POST",
        body: formdata,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    )
      .then((response) => response.json())
      .then((responseJson) => {
        this.setState({
          backcontour:responseJson.contour,
          BCX:responseJson.contour
        })
      })
      .catch((error) => {Alert.alert("An error has occured!!","This seems to be a server issue. Pls wait and try again later...")}); //to catch the errors if any
    }


  submit = () => {
    var checkflag = 0;
    var selectedbrands = [];
    var selectedcolors = [];
    var selecteddefects = [];
    var selectedsizes = [];
    var selectedprocess = [];
    var errmsg = "";
    this.state.Brands.forEach(function (item, index) {
      if (item.isChecked === true) {
        selectedbrands.push({ brandId: item.brandID });
      }
    });
    if (selectedbrands.length === 0) {
      checkflag = 1;
      errmsg = "Please select Brand";
      this.setState({
        Brandslabel: "Please select Brand",
        apimsg: "Please select Brand",
        BrandslabelColor: "#fb7a7480",
      });
    }
    if (selectedbrands.length > 1) {
      checkflag = 1;
      errmsg = "Please select only One Brand";
      this.setState({
        Brandslabel: "Please select Only One Brand",
        apimsg: "Please select Only One Brand",
        BrandslabelColor: "#fb7a7480",
      });
    } else {
      this.setState({
        Brandslabel: "Select Brand",
        apimsg: "",
        BrandslabelColor: "#00334eDD",
      });
    }

    this.state.Processes.forEach(function (item, index) {
      if (item.isChecked === true) {
        selectedprocess.push({ processId: item.processID,finalFinishing:item.finishingFinal,finalStitching:item.stitchingFinal });
      }
    });
    if (selectedprocess.length === 0) {
      checkflag = 1;
      errmsg = "Please select Process";
      this.setState({
        Processlabel: "Please select Process",
        apimsg: "Please select Process",
        ProcesslabelColor: "#fb7a7480",
      });
    } else {
      this.setState({
        Processlabel: "Select Processes",
        apimsg: "",
        ProcesslabelColor: "#00334eDD",
      });
    }

    this.state.Colors.forEach(function (item, index) {
      if (item.isChecked === true) {
        selectedcolors.push({ colorId: item.colorID });
      }
    });
    if (selectedcolors.length === 0) {
      checkflag = 1;
      errmsg = "Please select Color";
      this.setState({
        Colorslabel: "Please select Color",
        apimsg: "Please select Color",
        ColorslabelColor: "#fb7a7480",
      });
    } else {
      this.setState({
        Colorslabel: "Select Color",
        apimsg: "",
        ColorslabelColor: "#00334eDD",
      });
    }
    if (this.state.frontpath === "") {
      checkflag = 1;
      errmsg = "Please select Front Image";
    }

    if (this.state.backpath === "") {
      checkflag = 1;
      errmsg = "Please select Front Image";
    }

    if (this.state.loading2===true) {
      checkflag = 1;
      errmsg = "Generating Front Contour";
    }

        if (this.state.loading3===true) {
      checkflag = 1;
      errmsg = "Generating Back Contour";
    }

    this.state.Defects.forEach(function (item, index) {
      if (item.isChecked === true) {
        selecteddefects.push({ defectsId: item.defectID });
      }
    });
    if (selecteddefects.length === 0) {
      checkflag = 1;
      errmsg = "Please select Defect";
      this.setState({
        Defectslabel: "Please select Defect",
        apimsg: "Please select Defect",
        DefectslabelColor: "#fb7a7480",
      });
    } else {
      this.setState({
        Defectslabel: "Select Defect",
        apimsg: "",
        DefectslabelColor: "#00334eDD",
      });
    }

    this.state.Sizes.forEach(function (item, index) {
      if (item.isChecked === true) {
        selectedsizes.push({ sizeId: item.sizeID });
      }
    });
    if (selectedsizes.length === 0) {
      checkflag = 1;
      errmsg = "Please select Size";
      this.setState({
        Sizeslabel: "Please select Sizes",
        apimsg: "Please select Sizes",
        SizeslabelColor: "#fb7a7480",
      });
    } else {
      this.setState({
        Sizeslabel: "Select Sizes",
        apimsg: "",
        SizeslabelColor: "#00334eDD",
      });
    }

    if (this.state.name === "") {
      checkflag = 1;
      errmsg = "Please Enter Style No.";
      this.setState({
        namehint: "Please Enter Style No.",
        apimsg: "Please Enter Style No.",
        namehintColor: "#fb7a7480",
      });
    }
    if (this.state.description === "") {
      checkflag = 1;
      errmsg = "Please Enter Style Description";
      this.setState({
        descriptionhint: "Please Enter Style Description",
        apimsg: "Please Enter Style Description",
        descriptionhintColor: "#fb7a7480",
      });
    }
    if (checkflag === 1) {
      Alert.alert("Alert!!!  ",errmsg);
    }
    if (checkflag === 0) {
      var body;
      var formdata = new FormData();
      body = JSON.stringify({
        basicparams: {
          companyID: this.state.companyID,
          userID: this.state.userID,
        },
        styleParams: {
          companyID: this.state.companyID,
          styleNo: this.state.name,
          styleId: this.state.id,
          styleDesc: this.state.description,
          colors: selectedcolors,
          sizes: selectedsizes,
          brandID: selectedbrands[0].brandId,
          defects: selecteddefects,
          processes:selectedprocess,
          status:this.state.status,
          FC:this.state.frontcontour,
          BC:this.state.backcontour
        },
      });
      formdata.append("json", body);
      if(this.state.FCX!=""){
        formdata.append("FA", {
        uri: this.state.frontpath,
        name: "image1.jpg",
        type: "image/jpeg",
      });}
      
      if(this.state.BCX!=""){
        formdata.append("BA", {
          uri: this.state.backpath,
          name: "image2.jpg",
          type: "image/jpeg",
        });
      }
      console.log(formdata)
      fetch(
        "https://qualitylite.bluekaktus.com/api/bkQuality/masters/PostStyleDetails",
        {
          method: "POST",
          body: formdata,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      )
        .then((response) => response.json())
        .then((responseJson) => {
          if (responseJson.result === "Record Updated") {
            Animated.timing(this.state.animation_login, {
              toValue: 60,
              duration: 250,
            }).start();

            setTimeout(() => {
              this.setState({
                enable: false,
              });
            }, 50);

            setTimeout(() => {
              this.props.navigation.pop(1);
            }, 1200);
          }else{
            Alert.alert("Alert!!!  ",responseJson.message)
          }
        })
        .catch((error) => console.log(error)); //to catch the errors if any
    }
  };

  fetchdata = () => {
    fetch("https://qualitylite.bluekaktus.com/api/bkQuality/masters/getBCSD", {
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
    })
      .then((response) => response.json())
      .then((responseJson) => {
        this.getProcess();
        this.setState({
          Brands: responseJson.brands.result,
          Colors: responseJson.colors.result,
          Sizes: responseJson.sizes.result,
          Defects: responseJson.defects.result,
        });
        
      })
      .catch((error) => console.log(error)); //to catch the errors if any
  };

  getProcess = () => {
    this.setState({
      loading: true,
    });
    fetch(
      "https://qualitylite.bluekaktus.com/api/bkQuality/masters/getProcessDetails",
      {
        method: "POST",
        body: JSON.stringify({
          basicparams: {
            companyID: this.state.companyID,
            userID: this.state.userID,
            showInactive:false
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
        var temp=[]
        responseJson.result.forEach(function (item, index) {
          tempItem={alternateDescription:item.alternateDescription,
                    isChecked:false,processID:item.processID,
                    processName:item.processName,status:item.status,
                    stitchingFinal:false,finishingFinal:false
                  }
          temp.push(tempItem)
        })
        this.setState({
          loading: false,
          Processes:temp
        });
        this.checkData();
      })
      .catch((error) => console.log(error)); //to catch the errors if any
  };

  checkData = () => {
    fetch(
      "https://qualitylite.bluekaktus.com/api/bkQuality/masters/getStyleDetails",
      {
        method: "POST",
        body: JSON.stringify({
          basicparams: {
            companyID: this.state.companyID,
            userID: this.state.userID,
            styleID: this.state.id,
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
          name: responseJson.result[0].styleNo,
          description: responseJson.result[0].styleDesc,
        });
        responseJson.result[0].images.forEach((item, index) => {
          if (item.imageType === "FA") {
            this.setState({
              frontpath: item.uri,
            });
          }

          if (item.imageType === "FC") {
            this.setState({
              frontcontour: item.uri,
            });
          }

          if (item.imageType === "BC") {
            this.setState({
              backcontour: item.uri,
            });
          }

          if (item.imageType === "BA") {
            this.setState({
              backpath: item.uri,
            });
          }
        });
        var DefectTemp = this.state.Defects;
        responseJson.result[0].styleDefects.forEach((itemx, indexx) => {
          DefectTemp.forEach(function (item, index) {
            if (itemx.defectsID === item.defectID) {
              DefectTemp[index].isChecked = true;
            }
          });
        });

        var ProcessTemp = this.state.Processes;
        console.log("#####################aaaaaaa######################")
        console.log(responseJson.result[0].processes)
        responseJson.result[0].processes.forEach((itemx, indexx) => {
          ProcessTemp.forEach(function (item, index) {
            if (itemx.processID === item.processID) {
              ProcessTemp[index].isChecked = true;
              console.log(itemx)
              if (itemx.finalFinishing==true) {
                ProcessTemp[index].finishingFinal = true;
              }
              if (itemx.finalStitching==true) {
                ProcessTemp[index].stitchingFinal = true;
              }
            }
          });
        });
        console.log("#####################hhhhhh######################")
        console.log(ProcessTemp)
        var ColorTemp = this.state.Colors;
        responseJson.result[0].colors.forEach(function (itemx, indexx) {
          ColorTemp.forEach(function (item, index) {
            if (itemx.colorID === item.colorID) {
              ColorTemp[index].isChecked = true;
            }
          });
        });

        var SizeTemp = this.state.Sizes;
        responseJson.result[0].sizes.forEach(function (itemx, indexx) {
          SizeTemp.forEach(function (item, index) {
            if (itemx.sizeID === item.sizeID) {
              SizeTemp[index].isChecked = true;
            }
          });
        });

        var BrandTemp = this.state.Brands;
          BrandTemp.forEach(function (item, index) {
            if (responseJson.result[0].brandID === item.brandID) {
              BrandTemp[index].isChecked = true;
            }
          });

        this.setState({
          Colors: ColorTemp,
          Brands: BrandTemp,
          Defects: DefectTemp,
          Sizes: SizeTemp,
          Processes: ProcessTemp
        });
      })
      .catch((error) => console.log(error)); //to catch the errors if any
  };

  componentDidMount() {
    if(this.state.status==="ACTIVE"){
      this.setState({
        checkedx:true
      })
    }else{
      this.setState({
        checkedx:false
      })
    }
    this.fetchdata();
  }

  renderbrands = (itemData) => {
    return (
      <CheckBox
        title={itemData.item.brandName}
        containerStyle={{
          backgroundColor: "transparent",
          borderColor: "transparent",
          margin: 0,
          width: "45%",
        }}
        textStyle={{ color: "#00334eBB", fontSize: 18 }}
        checkedColor={Colors.primaryColor}
        checked={itemData.item.isChecked}
        onPress={() => {
          var ref = this.state.Brands;
          var index = this.state.Brands.indexOf(itemData.item);
          ref[index].isChecked = !ref[index].isChecked;
          this.setState({
            Brands: ref,
          });
        }}
      />
    );
  };

  rendercolors = (itemData) => {
    return (
      <CheckBox
        title={itemData.item.colorName}
        containerStyle={{
          backgroundColor: "transparent",
          borderColor: "transparent",
          margin: 0,
          width: "45%",
        }}
        textStyle={{
          color: "#00334eBB",
          fontSize: 18,
          margin: 0,
        }}
        checkedColor={Colors.primaryColor}
        checked={itemData.item.isChecked}
        onPress={() => {
          var ref = this.state.Colors;
          var index = this.state.Colors.indexOf(itemData.item);
          ref[index].isChecked = !ref[index].isChecked;
          this.setState({
            Colors: ref,
          });
        }}
      />
    );
  };

  rendersizes = (itemData) => {
    return (
      <CheckBox
        title={itemData.item.sizeName}
        containerStyle={{
          backgroundColor: "transparent",
          borderColor: "transparent",
          margin: 0,
          width: "45%",
        }}
        textStyle={{ color: "#00334eBB", fontSize: 18 }}
        checkedColor={Colors.primaryColor}
        checked={itemData.item.isChecked}
        onPress={() => {
          var ref = this.state.Sizes;
          var index = this.state.Sizes.indexOf(itemData.item);
          ref[index].isChecked = !ref[index].isChecked;
          this.setState({
            Sizes: ref,
          });
        }}
      />
    );
  };

  renderdefects = (itemData) => {
    return (
      <CheckBox
        title={itemData.item.defectName}
        containerStyle={{
          backgroundColor: "transparent",
          borderColor: "transparent",
          margin: 0,
          width: "45%",
        }}
        textStyle={{ color: "#00334eBB", fontSize: 18 }}
        checkedColor={Colors.primaryColor}
        checked={itemData.item.isChecked}
        onPress={() => {
          var ref = this.state.Defects;
          var index = this.state.Defects.indexOf(itemData.item);
          ref[index].isChecked = !ref[index].isChecked;
          this.setState({
            Defects: ref,
          });
        }}
      />
    );
  };

  renderprocess = (itemData) => {
    console.log(itemData.item)
    return (
      <View style={itemData.item.isChecked?{backgroundColor:"#5d8aa866",borderRadius:9,marginBottom:3}:{borderRadius:0}}>
        <CheckBox
        title={itemData.item.processName}
        containerStyle={{
          backgroundColor: "transparent",
          borderColor: "transparent",
          marginBottom:-10,
          width: "85%",
        }}
        textStyle={{ color: "#00334eBB", fontSize: 18 }}
        checkedColor={Colors.primaryColor}
        checked={itemData.item.isChecked}
        onPress={() => {
          var ref = this.state.Processes;
          var index = this.state.Processes.indexOf(itemData.item);
          ref[index].isChecked = !ref[index].isChecked;
          this.setState({
            Processes: ref,
          });
        }}
      />

        {itemData.item.isChecked ? (
                <View style={{flexDirection:"row"}}>
                   <CheckBox
                      title={"Stitching Final"}
                      containerStyle={{
                        backgroundColor: "transparent",
                        borderColor: "transparent",
                        margin: 0,
                        width: "45%",
                      }}
                      textStyle={{ color: "#00334eBB", fontSize: 12 }}
                      checkedColor={Colors.primaryColor}
                      uncheckedColor={Colors.primaryColor}
                      checked={itemData.item.stitchingFinal}
                      size={20}
                      onPress={() => {
                        var ref = this.state.Processes;
                        var index = this.state.Processes.indexOf(itemData.item);
                        var flag=false
                        ref.forEach(function (item, index) {
                          if(item.stitchingFinal){
                            flag=true
                          }
                          // if (item.finishingFinal === true && ref[index].stitchingFinal==false ) {
                          //   {// Works on both Android and iOS
                          //     Alert.alert(
                          //       'Alert',
                          //       'Only One Process can be assigned as Final Stitching Stage',
                          //       [
                          //         {
                          //           text: 'Close',
                          //           onPress: () => {},
                          //           style:"cancel"
                          //         },
                          //       ],
                          //       { cancelable: true }
                          //     )}
                          // }
                        });
                        if(itemData.item.stitchingFinal==false){
                          if(flag){
                            Alert.alert(
                                    'Alert',
                                    'Only One Process can be assigned as Final Stitching Stage',
                                    [
                                      {
                                        text: 'Close',
                                        onPress: () => {},
                                        style:"cancel"
                                      },
                                    ],
                                    { cancelable: true }
                                  )
                          }
                        }
                        if(itemData.item.stitchingFinal==false){
                          if(!flag){
                            ref[index].stitchingFinal = !ref[index].stitchingFinal;
                            this.setState({
                              Processes: ref,
                            });
                          }
                        }
                        else{
                          ref[index].stitchingFinal = !ref[index].stitchingFinal;
                          this.setState({
                            Processes: ref,
                          });
                        }
                      }}
                    />
                    <CheckBox
                      title={"Finishing Final"}
                      containerStyle={{
                        backgroundColor: "transparent",
                        borderColor: "transparent",
                        margin: 0,
                        width: "45%",
                      }}
                      textStyle={{ color: "#00334eBB", fontSize: 12 }}
                      checkedColor={Colors.primaryColor}
                      uncheckedColor={Colors.primaryColor}
                      checked={itemData.item.finishingFinal}
                      size={20}
                      onPress={() => {
                        var ref = this.state.Processes;
                        var index = this.state.Processes.indexOf(itemData.item);
                        var flag=false
                        ref.forEach(function (item, index) {
                          if(item.finishingFinal){
                            flag=true
                          }
                        });
                        if(itemData.item.finishingFinal==false){
                          if(flag){
                            Alert.alert(
                                    'Alert',
                                    'Only One Process can be assigned as Final Finishing Stage',
                                    [
                                      {
                                        text: 'Close',
                                        onPress: () => {},
                                        style:"cancel"
                                      },
                                    ],
                                    { cancelable: true }
                                  )
                          }
                        }
                        if(itemData.item.finishingFinal==false){
                          if(!flag){
                            ref[index].finishingFinal = !ref[index].finishingFinal;
                            this.setState({
                              Processes: ref,
                            });
                      }
                    }
                      else{
                        ref[index].finishingFinal = !ref[index].finishingFinal;
                        this.setState({
                          Processes: ref,
                        });
                      }
                    }
                  }
                    />
          </View>
              ) : null}
      </View>
      
    );
  };

  render() {
    const state = this.state;
    const width = this.state.animation_login;
    if (this.state.loading) {
      return (
        <View style={styles.loader}>
          <ActivityIndicator size="large" color={Colors.primaryColor} />
        </View>
      );
    } else {
      return (
        <ScrollView
          refreshControl={
            <RefreshControl
              refreshing={this.state.loading}
              onRefresh={this.fetchdata}
            />
          }
        >
          <View style={styles.container}>
          <CheckBox
                  size={25}
                  title={this.state.status}
                  containerStyle={{
                    backgroundColor: "transparent",
                    borderColor: "transparent",
                    margin: 0,
                    width: "45%",
                  }}
                  textStyle={{
                    color: "#00334eBB",
                    fontSize: 24,
                    margin: 0,
                  }}
                  checkedColor={Colors.primaryColor}
                  checked={this.state.checkedx}
                  onPress={() => {
                    this.setState({
                      checkedx:!this.state.checkedx
                    },()=>{
                      if(this.state.checkedx===true){
                      this.setState({
                        status:"ACTIVE"
                      })
                    }
                    else{
                      this.setState({
                        status:"INACTIVE"
                      })
                    }
                  })
                  }}
            />
            <TextInput
              placeholder={this.state.namehint}
              placeholderTextColor={this.state.namehintColor}
              value={this.state.name}
              style={styles.input}
              onChangeText={(value) => {
                this.setState({ name: value });
              }}
            />
            <TextInput
              placeholder={this.state.descriptionhint}
              placeholderTextColor={this.state.descriptionhintColor}
              style={styles.inputx}
              value={this.state.description}
              multiline={true}
              onChangeText={(value) => {
                this.setState({ description: value });
              }}
            />
            <View style={styles.type}>
              <Text
                style={{
                  fontSize: 20,
                  textAlign: "center",
                  fontWeight: "bold",
                  paddingLeft: 10,
                  color: this.state.BrandslabelColor,
                }}
              >
                {this.state.Brandslabel}
              </Text>
              <FlatList
                numColumns={2}
                data={this.state.Brands}
                keyExtractor={(item, index) => item.brandID}
                extraData={this.state.Brands}
                renderItem={this.renderbrands}
              />
            </View>
            <View style={styles.type}>
              <Text
                style={{
                  fontSize: 20,
                  textAlign: "center",
                  fontWeight: "bold",
                  paddingLeft: 10,
                  color: this.state.ColorslabelColor,
                }}
              >
                {this.state.Colorslabel}
              </Text>
              <FlatList
                numColumns={2}
                data={this.state.Colors}
                keyExtractor={(item, index) => item.colorID}
                renderItem={this.rendercolors}
              />
            </View>
            <View style={styles.type}>
              <Text
                style={{
                  fontSize: 20,
                  textAlign: "center",
                  fontWeight: "bold",
                  paddingLeft: 10,
                  color: this.state.SizeslabelColor,
                }}
              >
                {this.state.Sizeslabel}
              </Text>
              <FlatList
                numColumns={2}
                data={this.state.Sizes}
                keyExtractor={(item, index) => item.sizeID}
                renderItem={this.rendersizes}
              />
            </View>
            <View style={styles.type}>
              <Text
                style={{
                  fontSize: 20,
                  textAlign: "center",
                  fontWeight: "bold",
                  paddingLeft: 10,
                  color: this.state.DefectslabelColor,
                }}
              >
                {this.state.Defectslabel}
              </Text>
              <FlatList
                numColumns={2}
                data={this.state.Defects}
                keyExtractor={(item, index) => item.defectID}
                renderItem={this.renderdefects}
              />
            </View>
            <View style={styles.type}>
              <Text
                style={{
                  fontSize: 20,
                  textAlign: "center",
                  fontWeight: "bold",
                  paddingLeft: 10,
                  color: this.state.ProcesslabelColor,
                }}
              >
                {this.state.Processlabel}
              </Text>
              <FlatList
                numColumns={1}
                data={this.state.Processes}
                extraData={this.state.Processes}
                keyExtractor={(item, index) => item.processID}
                renderItem={this.renderprocess}
              />
            </View>
            <View style={styles.imageframe}>
              <Text
                style={{
                  fontSize: 20,
                  textAlign: "center",
                  fontWeight: "bold",
                  paddingLeft: 10,
                  color: this.state.FrontImagelabelColor,
                }}
              >
                {this.state.FrontImagelabel}
              </Text>
              <Image
                source={{ uri: this.state.frontpath }}
                style={{
                  width: 300,
                  height: 400,
                  marginBottom: 15,
                  marginTop: 5,
                  borderWidth: 2,
                }}
                onLoadStart={() =>{
                  this.setState({loading1: true})}}
                onLoadEnd={() => {
                    this.setState({loading1: false})
                  }}
              />
              {this.state.loading1 ? (
                <View style={{alignContent:"center",justifyContent:"center",flexDirection:"row"}}>
                <Text style={{ fontSize: 18,
                  textAlign: "center",
                  fontWeight: "bold",
                  paddingLeft: 10,
                  color: this.state.frontContourColor,}} >Loading Image </Text>
                <ActivityIndicator size="small" color={Colors.primaryColor} />
              </View>):null}
              <TouchableOpacity onPress={()=>{// Works on both Android and iOS
                                                Alert.alert(
                                                  'Pick Front Image',
                                                  'Choose Source',
                                                  [
                                                    {
                                                      text: 'Gallery',
                                                      onPress: () => {this.openImagePickerAsync()}
                                                    },
                                                    { text: 'Camera', onPress: () => this.openCameraAsync()}
                                                  ],
                                                  { cancelable: true }
                                                )}}>
                <View>
                  <Text style={styles.imageupload}>Choose Front Image</Text>
                </View>
              </TouchableOpacity>
            </View>

            <View style={styles.imageframe}>
              <Text
                style={{
                  fontSize: 20,
                  textAlign: "center",
                  fontWeight: "bold",
                  paddingLeft: 10,
                  color: this.state.FrontImagelabelColor,
                }}
              >
                Front Contour
              </Text>
              <Image
                source={{ uri: this.state.frontcontour }}
                style={{
                  width: 300,
                  height: 400,
                  marginBottom: 15,
                  marginTop: 5,
                  borderWidth: 2,
                }}
                onLoadStart={() =>{
                  this.setState({loading3: true})}}
                onLoadEnd={() => {
                    this.setState({loading3: false})
                  }}
              />
              {this.state.loading3 ? (
                <View style={{alignContent:"center",justifyContent:"center",flexDirection:"row"}}>
                <Text style={{ fontSize: 18,
                  textAlign: "center",
                  fontWeight: "bold",
                  paddingLeft: 10,
                  color: this.state.frontContourColor,}} >Loading Image </Text>
                <ActivityIndicator size="small" color={Colors.primaryColor} />
              </View>):null}
            </View>

            <View style={styles.imageframe}>
              <Text
                style={{
                  fontSize: 20,
                  textAlign: "center",
                  fontWeight: "bold",
                  paddingLeft: 10,
                  color: this.state.BackImagelabelColor,
                }}
              >
                {this.state.BackImagelabel}
              </Text>
              <Image
                source={{ uri: this.state.backpath }}
                style={{
                  width: 300,
                  height: 400,
                  marginBottom: 15,
                  marginTop: 5,
                  borderWidth: 2,
                }}
                onLoadStart={() =>{
                  this.setState({loading2: true})}}
                onLoadEnd={() => {
                    this.setState({loading2: false})
                  }}
                  
              />
              {this.state.loading2 ? (
                <View style={{alignContent:"center",justifyContent:"center",flexDirection:"row"}}>
                <Text style={{ fontSize: 18,
                  textAlign: "center",
                  fontWeight: "bold",
                  paddingLeft: 10,
                  color: this.state.frontContourColor,}} >Loading Image </Text>
                <ActivityIndicator size="small" color={Colors.primaryColor} />
              </View>):null}
              <TouchableOpacity onPress={()=>{// Works on both Android and iOS
                                                Alert.alert(
                                                  'Pick Back Image',
                                                  'Choose Source',
                                                  [
                                                    {
                                                      text: 'Gallery',
                                                      onPress: () => {this.openImagePickerAsync2()}
                                                    },
                                                    { text: 'Camera', onPress: () => this.openCameraAsync2()}
                                                  ],
                                                  { cancelable: true }
                                                )}}>
                <View>
                  <Text style={styles.imageupload}>Choose Back Image</Text>
                </View>
              </TouchableOpacity>
            </View>
            <View style={styles.imageframe}>
              <Text
                style={{
                  fontSize: 20,
                  textAlign: "center",
                  fontWeight: "bold",
                  paddingLeft: 10,
                  color: this.state.FrontImagelabelColor,
                }}
              >
                Back Contour
              </Text>
              <Image
                source={{ uri: this.state.backcontour }}
                style={{
                  width: 300,
                  height: 400,
                  marginBottom: 15,
                  marginTop: 5,
                  borderWidth: 2,
                }}
                onLoadStart={() =>{
                  this.setState({loading4: true})}}
                onLoadEnd={() => {
                    this.setState({loading4: false})
                  }}
              />
              {this.state.loading4 ? (
                <View style={{alignContent:"center",justifyContent:"center",flexDirection:"row"}}>
                <Text style={{ fontSize: 18,
                  textAlign: "center",
                  fontWeight: "bold",
                  paddingLeft: 10,
                  color: this.state.frontContourColor,}} >Loading Image </Text>
                <ActivityIndicator size="small" color={Colors.primaryColor} />
              </View>):null}
            </View>

            <TouchableOpacity activeOpacity={0.8} onPress={this.submit}>
              <View style={styles.button_container}>
                <Animated.View
                  style={[
                    styles.animation,
                    {
                      width,
                    },
                  ]}
                >
                  {this.state.enable ? (
                    <Text style={styles.textLogin}>Update</Text>
                  ) : (
                    <Animatable.View animation="bounceIn" delay={10}>
                      <FontAwesome
                        name="check"
                        color={Colors.accentColor}
                        size={20}
                        padding={25}
                      />
                    </Animatable.View>
                  )}
                </Animated.View>
              </View>
            </TouchableOpacity>
            <Text>{this.state.apimsg}</Text>
          </View>
        </ScrollView>
      );
    }
  }
}
const width = Dimensions.get("screen").width;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f6f5f5",
    alignItems: "center",
    justifyContent: "flex-start",
  },
  type: {
    backgroundColor: "#f6f5f5",
    justifyContent: "flex-start",
    borderWidth: 3,
    borderColor: Colors.primaryColor,
    padding: 8,
    marginTop: 10,
    color: Colors.primaryColor,
    fontSize: 20,
    fontWeight: "bold",
    borderRadius: 10,
    width: Dimensions.get("window").width / 1.2,
  },
  imageframe: {
    backgroundColor: "#f6f5f5",
    alignItems: "center",
    borderWidth: 3,
    borderColor: Colors.primaryColor,
    padding: 8,
    marginTop: 10,
    color: Colors.primaryColor,
    fontSize: 20,
    fontWeight: "bold",
    borderRadius: 10,
    width: Dimensions.get("window").width / 1.2,
  },
  button: {
    alignContent: "center",
    justifyContent: "center",
    backgroundColor: Colors.primaryColor,
    marginTop: 40,
    width: Dimensions.get("window").width / 3,
    borderRadius: 50,
  },
  buttonText: {
    textAlign: "center",
    fontWeight: "bold",
    color: Colors.accentColor,
    fontSize: 25,
    padding: 8,
  },
  imageupload: {
    color: Colors.accentColor,
    backgroundColor: Colors.primaryColor,
    borderRadius: 15,
    paddingVertical: 7,
    paddingHorizontal: 25,
    fontSize: 20,
    textAlign: "center",
    fontWeight: "bold",
  },
  input: {
    borderWidth: 3,
    paddingLeft: 20,
    borderColor: Colors.primaryColor,
    padding: 8,
    marginTop: 20,
    color: Colors.primaryColor,
    fontSize: 20,
    fontWeight: "bold",
    borderRadius: 10,
    width: Dimensions.get("window").width / 1.2,
  },
  inputx: {
    borderWidth: 3,
    paddingLeft: 20,
    borderColor: Colors.primaryColor,
    padding: 8,
    marginTop: 10,
    color: Colors.primaryColor,
    fontSize: 20,
    fontWeight: "bold",
    borderRadius: 10,
    width: Dimensions.get("window").width / 1.2,
  },
  button_container: {
    alignItems: "center",
    justifyContent: "center",
  },
  textLogin: {
    color: colors.accentColor,
    fontWeight: "bold",
    fontSize: 25,
  },
  type: {
    backgroundColor: "#f6f5f5",
    justifyContent: "center",
    borderWidth: 3,
    borderColor: Colors.primaryColor,
    padding: 8,
    marginTop: 10,
    color: Colors.primaryColor,
    fontSize: 20,
    fontWeight: "bold",
    borderRadius: 10,
    width: Dimensions.get("window").width / 1.2,
  },
  animation: {
    backgroundColor: Colors.primaryColor,
    height: 50,
    marginTop: 30,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
});

StyleEdit.navigationOptions = (navData) => {
  return {
    headerTitle: "Update Style",
    headerStyle: {
      backgroundColor: Colors.primaryColor,
    },
    headerTintColor: Colors.accentColor,
  };
};

export default StyleEdit;
