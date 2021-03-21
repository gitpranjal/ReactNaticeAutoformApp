import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  Modal,
  ImageBackground,
  Alert,
  ActivityIndicator
} from "react-native";

import { FloatingLabelInput } from 'react-native-floating-label-input'
import Colors from "../constants/colors"
import { Dimensions } from 'react-native';
import { TouchableOpacity } from "react-native";
import { FlatList } from "react-native";
import * as ImagePicker from "expo-image-picker"
import RadioButtonRN from 'radio-buttons-react-native';
import { Icon } from 'react-native-elements'
import moment from "moment";

import CameraScreen from "../components/CameraScreen"
import {Camera} from 'expo-camera'
import * as ImageManipulator from 'expo-image-manipulator'




const ApiUrl = "https://qualitylite.bluekaktus.com"
// const ApiUrl = "http://c4013a5418aa.ngrok.io"

const InspectionResult = (props) => {
  
  const InspectionEnteries = props.navigation.getParam("InspectionEnteries")
  const [InspectionOutcome, SetInspectionOutcome] = useState("")
  const [MeasurementDeviation, SetMeasurementDeviation] = useState(InspectionEnteries.inspectionParams["measurementDeviation"])
  const [FinalInspectionImageList, SetFinalInspectionImageList] = useState(props.navigation.getParam("InspectionEnteries").finalInspectionImageObjectList)
  const [FinalInspectionImageCount, SetFinalInspectionImageCount] = useState(props.navigation.getParam("InspectionEnteries").finalInspectionImageObjectList.length)
  const [ImageModalVisible, SetImageModalVisibility] = useState(false)
  const [Remarks, SetRemarks] = useState(InspectionEnteries.inspectionParams["remarks"])
  const [StartCamera, SetStartCamera] = useState(false)
  const [CurrentDefectObject, SetCurrentDefectObject] = useState({})
  const [SubmitButtonPressed, SetSubmitButtonPressed] = useState(false)
  const [OutcomeRadioButtonPressed, SetOutcomeRadioButtonPressed] = useState(false) 
  const [DefaultOutcomeEdited, SetDefaultOutcomeEdited] = useState(false)

  const screenHeight = Dimensions.get('window').height
  const screenWidth = Dimensions.get('window').width

  var outcomeObject = {}

  

  const __startCamera = async () => {
      const {status} = await Camera.requestPermissionsAsync()
      if (status === 'granted') {
        // start the camera
        SetStartCamera(true)
      } else {
        Alert.alert('Access denied')
      }
  }

  const getImageInfo = async (PhotoObject, defectObject) => {
    SetStartCamera(false)
    console.log("############ ImageObject ##################3")
    console.log(PhotoObject)

    var newImageObject = {
        
        name: PhotoObject.uri.split("/").pop(),
        type: "image/jpeg",
        uri: PhotoObject.uri
      }

      const resizedPhoto = await ImageManipulator.manipulateAsync(
        PhotoObject.uri,
        // [{ resize: { width: 300, height: 250} }], // resize to width of 300 and preserve aspect ratio,
        [],
        { compress: 0.2, format: 'jpeg' },
       );

      newImageObject["uri"] = resizedPhoto.uri

      SetFinalInspectionImageList(FinalInspectionImageList.concat([newImageObject]))
      SetFinalInspectionImageCount(FinalInspectionImageCount + 1)

    
}

  const openImagePickerAsync = async () => {
    let permissionResult = await ImagePicker.requestCameraRollPermissionsAsync();

    if (permissionResult.granted === false) {
      alert("Permission to access camera roll is required!");
      return;
    }

    let pickerResult = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [0.95*screenWidth, 250],
    });
    
    var newImageObject = {
        "name": pickerResult.uri.split("/").pop(),
        "type": "image/jpeg",
        "uri": pickerResult.uri
      }

      const resizedPhoto = await ImageManipulator.manipulateAsync(
        pickerResult.uri,
        // [{ resize: { width: 300, height: 250} }], // resize to width of 300 and preserve aspect ratio 
        [],
        { compress: 0.2, format: 'jpeg' },
        );

        newImageObject["uri"] = resizedPhoto.uri

      SetFinalInspectionImageList(FinalInspectionImageList.concat([newImageObject]))
      SetFinalInspectionImageCount(FinalInspectionImageCount + 1)
      

  }

  const UpdateWithEditedImage = (combinedDefectsList, defectImageObjectsList, orignalImageUri, orignalImageName, newImageUri) => {
    // defectObject.imageUris = defectObject.imageUris.filter((ImgObj) => ImgObj.name != orignalImageName)
    // var orignalImageName = orignalImageUri.split("/").pop()
    // console.log("##### combined defects list in UpdateWithEditedImage functuin ################")
    // console.log(combinedDefectsList)

    console.log("##### defectImageObject list in UpdateWithEditedImage functuin ################")
    console.log(defectImageObjectsList)

    
    
    for(var defectObject of combinedDefectsList)
    {   var updated = false
        defectObject.imageNames = defectObject.imageNames.filter((ImgName) => ImgName != orignalImageName)
        for(var ImgObject of defectObject.imageUris)
        {
            if(ImgObject.name == orignalImageName)
            {
                ImgObject.name = newImageUri.split("/").pop()
                ImgObject.uri = newImageUri
                updated = true
                defectObject.imageNames.push(ImgObject.name)
                break
            }
        }
        if(updated)
        {
            SetCurrentSelectedDefectObjectForImageInput(defectObject)
            SetCurrentDefectObject(defectObject)
            break
        }
    }
    
    for(var ImgObject of defectImageObjectsList)
    {
        if(ImgObject.name == orignalImageName)
        {
            ImgObject.name = newImageUri.split("/").pop()
            ImgObject.uri = newImageUri
            break
        }
    }

    // console.log("###### New combined defects list ######")
    // console.log(combinedDefectsList)
    console.log("###### New defectImageObject list ######")
    console.log(defectImageObjectsList)
    // SetCombinedDefectsList(combinedDefectsList)
    // SetDefectImageObjectsList(defectImageObjectsList)

    SetFinalInspectionImageCount(defectImageObjectsList.length)
    SetFinalInspectionImageList(defectImageObjectsList)

  }

  console.log("###### Inspection result object #######")
  console.log(InspectionEnteries)

  const DeleteImage = (defectImageObjectsList, orignalImageName,) => {

   
 
    defectImageObjectsList = defectImageObjectsList.filter((ImgObject) => ImgObject.name != orignalImageName)
    
    console.log("###### New defectImageObject list ######")
    console.log(defectImageObjectsList)
    
    SetFinalInspectionImageList(defectImageObjectsList)
    SetFinalInspectionImageCount(defectImageObjectsList.length)
    SetImageModalVisibility(false)

  }

  const CheckOutcome = (InspectionEnteries) => {
    if(InspectionEnteries.inspectionID != 0)
    {
      console.log("##### Default result present ########")
      return {
        "result": InspectionEnteries.inspectionParams["result"].toLowerCase(),
        "reason": `${InspectionEnteries.defectsSummary["Total Critical Defect"]} Critical defect(s) found`
      }
    }

    if(InspectionEnteries.defectsSummary["Total Critical Defect"] != "" && parseInt(InspectionEnteries.defectsSummary["Total Critical Defect"]) > 0)
    {
      console.log("##### Total critical defect is non zero ########")
      return {
        "result": "failed",
        "reason": `${InspectionEnteries.defectsSummary["Total Critical Defect"]} Critical defect(s) found`
      }
    }

    const majorAcceptance = parseInt(InspectionEnteries.AqlObject.majorAcceptance)
    const minorAcceptance = parseInt(InspectionEnteries.AqlObject.minorAcceptance)

    if(InspectionEnteries.defectsSummary["Total Major Defect"] != "" && parseInt(InspectionEnteries.defectsSummary["Total Major Defect"]) > majorAcceptance)
    { 
      console.log("##### Total major defect greater than accepted ########")
      return {
        "result": "failed",
        "reason": `${InspectionEnteries.defectsSummary["Total Major Defect"]} Major defect(s) found which is greater than the major accepted value ${majorAcceptance}`
      }
    }


    if(InspectionEnteries.defectsSummary["Total Minor Defect"] != "" && parseInt(InspectionEnteries.defectsSummary["Total Minor Defect"]) > minorAcceptance)
    {
      console.log("##### Total minor defect greater than accepted ########")
      return {
        "result": "failed",
        "reason": `${InspectionEnteries.defectsSummary["Total Minor Defect"]} Minor defect(s) found which is greater than the minor accepted value ${minorAcceptance}`
      }
    }

    console.log("##### Result to be selected by user ####")
    return "undecided"


    
  }

  const PossibleInspectionOutcomes = [
    {
      label: 'PASSED'
     },
     {
      label: 'FAILED'
     },
    ];

    if(StartCamera)
    return (
        <CameraScreen 
            // imageObjectList={ImageObjectList}
            callback={getImageInfo}
            currentDefectObject={CurrentDefectObject}
        ></CameraScreen>
    )

    return (
        <View style={{alignItems: "flex-start", marginHorizontal: 10}}>
          {(() => {
            if(SubmitButtonPressed)
              return (<View style = {{alignSelf: "center", alignItems: "center"}}><ActivityIndicator size="large" color={Colors.primaryColor} /></View>)
          })()}

                  <Modal
                    id="ImageListView"
                    animationType="slide"
                    transparent={true}
                    // visible={ShowMessageModal} 
                    visible = {ImageModalVisible}
                    onRequestClose={() => {SetImageModalVisibility(false)}}
                  >
                    <View style={{width: "100%", height: screenHeight, backgroundColor: "white", alignSelf: "center", alignItems: "center"}}>
                        <TouchableOpacity
                            id="ImageModalHeader"
                            style={{height: 0.07*screenHeight, width: screenWidth, backgroundColor: Colors.primaryColor}}
                            onPress={() => {SetImageModalVisibility(false)}}
                        >
                            <View style={{flexDirection: "row", justifyContent: "flex-start", top: 0.022*screenHeight}}>
                                <Text style={{color: Colors.accentColor, marginHorizontal: 10, fontSize: 17}}>Back</Text>
                                <Text style={{color: Colors.accentColor, marginHorizontal: "20%", fontSize: 18, fontWeight: "bold"}}>Inspection Images</Text>
                            </View>
                        </TouchableOpacity>


                        <View style={{marginHorizontal: 10, marginTop: 20, marginBottom: 0.18*screenHeight}}>
                            <FlatList
                                data={FinalInspectionImageList}
                                keyExtractor={(ImageUriObject) => ImageUriObject.uri}
                                style={{marginVertical:5}}
                                renderItem = {({item}) => {
                                    return (
                                        // <Image
                                        //     source={{ uri: item.uri }}
                                        //     style={{
                                        //     width: 0.95*screenWidth,
                                        //     height: 250,
                                        //     marginBottom: 15,
                                        //     marginTop: 5,
                                        //     borderWidth: 2,
                                        //     borderColor: "grey",
                                        //     borderRadius: 5,
                                      
                                        //     }}
                                        // />
                                        <ImageBackground
                                            source={{ uri: item.uri }}
                                            style={{
                                                width: 0.95*screenWidth,
                                                height: 250,
                                                marginBottom: 15,
                                                marginTop: 5,
                                                borderWidth: 2,
                                                borderColor: "grey",
                                                borderRadius: 5,
                                                alignItems: "flex-end",
                                                justifyContent: "flex-start"
                                            }}
                                        >   
                                            <View style={{flexDirection: "row", marginVertical: 5}}>
                                                <TouchableOpacity
                                                    style={{marginRight: 25, width: 20, alignItems: "center", borderRadius: 10, justifyContent: "center"}}
                                                    onPress={() => {
                                                        
                                                      Alert.alert(
                        
                                                        'Image deletion',
                                                        'Are you sure you want to delete the image?',
                                                        [
                                                          {
                                                            text: 'No',
                                                            onPress: () => console.log('####### Image deletion cancelled #######'),
                                             
                                                          },
                                                          {
                                                            text: 'Confirm', 
                                                            onPress: () => DeleteImage( FinalInspectionImageList.slice(),  item.name)
                                                          },
                                                        ],
                                                        {cancelable: false},
                                                      )
                                            
                                                    }}
                                                    disabled={InspectionEnteries.inspectionID != 0}
                                                >
                                                    <Icon
                                                        reverse
                                                        name='ios-trash'
                                                        type='ionicon'
                                                        color={"red"}
                                                        size={20}
                                                    />
                                                </TouchableOpacity>
                                                {/*
                                                <TouchableOpacity
                                                    style={{marginRight: 15, width: 20, alignItems: "center", borderRadius: 10, justifyContent: "center"}}
                                                    onPress={() => {
                                                        console.log("pressed")
                                                        props.navigation.navigate("ImageDrawing")
                                                        SetImageModalVisibility(false)
                                                        props.navigation.navigate("ImageDrawing", { BackgroundImageUri: item.uri , BackgroundImageName: item.name, combinedDefectsList: [], 
                                                                                                    defectImageObjectsList: FinalInspectionImageList.slice(), updateCallback: UpdateWithEditedImage })
                                                        
                                                    }}
                                                    disabled={InspectionEnteries.inspectionID != 0}
                                                >
                                                    <Icon
                                                        reverse
                                                        name='ios-brush'
                                                        type='ionicon'
                                                        color={"red"}
                                                        size={20}
                                                    />
                                                </TouchableOpacity>
                                                  */}
                                            </View>
                                            
                                        </ImageBackground>
                                    )
                                }}
                            />
                        </View>
                            
                        <TouchableOpacity 
                            style={{...styles.addbutton, alignSelf: "flex-start", bottom: 0.16*screenHeight, marginHorizontal: 10}}
                            onPress={() => {
                                // openImagePickerAsync()
                                // __startCamera()
                                Alert.alert(
                        
                                  'Image Source',
                                  'Select the source of Image',
                                  [
                                    {
                                      text: 'Camera',
                                      onPress: () => __startCamera(),
                       
                                    },
                                    {
                                      text: 'Gallery', 
                                      onPress: () => openImagePickerAsync()
                                    },
                                  ],
                                  {cancelable: true},
                                )
                            }}
                        >
                            <Text style={styles.title} numberOfLines={1}>
                            +
                            </Text>
                        </TouchableOpacity>


                    </View>
                    
                </Modal>

          <View id="Audit Result text ad image upload" style={{flexDirection: "row", marginTop: 20, alignItems: "center"}}>
            <Text style={{fontSize: 20, fontWeight: "bold", color: "grey", marginRight: "50%"}}>Audit Result</Text>
            <TouchableOpacity
              style={{width: 60, height: 30, borderColor: "grey", justifyContent: "center", alignItems: "center" , flexDirection: "row"}}
              onPress={() => {
                if(FinalInspectionImageList.length == 0)
                  // openImagePickerAsync()
                  // __startCamera()
                  {
                    Alert.alert(
                        
                      'Image Source',
                      'Select the source of Image',
                      [
                        {
                          text: 'Camera',
                          onPress: () => __startCamera(),
           
                        },
                        {
                          text: 'Gallery', 
                          onPress: () => openImagePickerAsync()
                        },
                      ],
                      {cancelable: true},
                    )
                  }
                else
                  SetImageModalVisibility(true)
              }}
            >
              {/* <Text style={{color: "grey", fontSize: 15, fontWeight: "bold"}}>Img{FinalInspectionImageCount !=0 ?"("+FinalInspectionImageCount+")": ""}</Text> */}
              <Icon
                name='ios-camera'
                type='ionicon'
                color='#517fa4'
                size={30}
              />
              {(() => {
                if(FinalInspectionImageCount !=0)
                  return(
                    <View style={{alignSelf: "flex-start", backgroundColor: "red", borderRadius: 10}}>
                      <Text style={{paddingHorizontal:3,  color: "white", fontSize: 10, fontWeight:"bold"}}>{FinalInspectionImageCount}</Text>
                    </View>
                  )
              })()}
              
              {/* <Text style={{backgroundColor: "red", color: "white", alignSelf: "flex-start", fontSize: 10}}>2</Text> */}
            </TouchableOpacity>
          </View>

          {(() => {
            outcomeObject = CheckOutcome(InspectionEnteries)
            if(outcomeObject != "undecided" && !OutcomeRadioButtonPressed)
              { 
                // useEffect(() => SetInspectionOutcome(outcomeObject.result), [])
                InspectionEnteries.inspectionParams["result"] = outcomeObject.result
                return (
                  <View style={{alignItems: "flex-start", marginTop: 10}}>
                    <View style={{flexDirection: "row"}}>
                      <Text style={{color: "grey", fontWeight: "bold", fontSize: 15}}>Status</Text>
                      <Text style={{color: outcomeObject.result == "passed" ? "green" : "red", fontWeight: "bold", fontSize: 25, marginLeft: "25%"}}>{outcomeObject.result.toUpperCase()}</Text>
                      
                      <TouchableOpacity
                        style={{ marginLeft: "25%"}}
                        disabled={InspectionEnteries.inspectionID != 0}
                        onPress={() => SetOutcomeRadioButtonPressed(true)}
                      >
                        <Text style={{color: InspectionEnteries.inspectionID == 0 ? "grey": "white", fontWeight: "bold", fontSize: 15}}>Edit</Text>
                      </TouchableOpacity>
                    </View>
                    <Text style={{color: "grey", fontSize: 10}}>{outcomeObject.reason}</Text>
                  </View>
                )
              }
              return (
                <RadioButtonRN
                  style={{width: "60%", marginHorizontal: 25, marginVertical: 20}}
                  initial={(() => {
                    if(InspectionOutcome.toLowerCase() == "passed")
                        return 1
                    if (InspectionOutcome.toLowerCase() == "failed")
                        return 2

                    return -1

                })()}
                  textStyle={{marginHorizontal: 10, fontSize: 15, fontWeight: "bold", color: "grey"}}
                  data={PossibleInspectionOutcomes}
                  selectedBtn={(SelectedOutcome) => {
                    SetInspectionOutcome(SelectedOutcome.label)
                    InspectionEnteries.inspectionParams["result"] = SelectedOutcome.label
                    InspectionEnteries.inspectionParams["passFailOn"] = `${moment().format('DD-MMM-YYYY h:mm:ss')}`
                    SetOutcomeRadioButtonPressed(true)
      
                  }}
                  circleSize={10}
                  boxStyle={{height: 45}}
                  deactiveColor="grey"
                  activeColor={Colors.inactiveColor}
                  boxActiveBgColor={InspectionOutcome == "FAILED" ? "#f08080" : "#90ee90"}
                  
                />
              )
          })()}
          
          <View style={{width: Dimensions.get("window").width / 1.07, height: 57, justifyContent: "center",}}>
          <FloatingLabelInput
                 
                  label="Measurement Deviation"
          
                  labelStyles={{color: "grey", fontSize: 15, fontWeight: "bold"}}
              
                  //containerStyles={{...styles.input, width: Dimensions.get("window").width / 1.07, height: 57, justifyContent: "center",}}
                  inputStyles={{fontWeight: "bold", fontSize: 16, color: Colors.primaryColor, top: 5}}
                  maxLength={50}
                  editable={InspectionEnteries.inspectionID == 0}
                  value={MeasurementDeviation}
                  onChangeText = {(newChangedText) => {
                      SetMeasurementDeviation(newChangedText)  
                      // SetLabelFontSize(10)
                  }}
                />
          </View>
              <View style={{width: Dimensions.get("window").width / 1.07, }}>
              <FloatingLabelInput
                 
                 label="Comments"
                 labelStyles={{color: "grey", fontSize: 15, fontWeight: "bold"}}
             
                 //containerStyles={{height: 120, borderWidth: 2}}
                 inputStyles={{fontWeight: "bold", fontSize: 16, color: Colors.primaryColor, }}
                 maxLength={50}
                 showCountdown={true}
                 multiline={true}
                 editable={InspectionEnteries.inspectionID == 0}
                 value={Remarks}
                 onChangeText = {(newChangedText) => {
                     SetRemarks(newChangedText)  
                 }}
               />
               </View>
  

              <TouchableOpacity
                style={{marginTop: 15, width: Dimensions.get("window").width / 1.07, backgroundColor: InspectionEnteries.inspectionID == 0 && !SubmitButtonPressed ? Colors.primaryColor : "grey",  borderRadius: 5, justifyContent: "center", alignItems: "center", height: 45}}
                disabled={InspectionEnteries.inspectionID != 0}
                onPress={() => {
                  SetSubmitButtonPressed(true)
                  if(InspectionOutcome == "" && outcomeObject == "undecided")
                  {
                    Alert.alert("Please select an audit status")
                    return
                  }

                  // if(MeasurementDeviation == "")
                  // {
                  //   Alert.alert("Please enter measurement deviation")
                  //   return
                  // }

                  // if(Remarks == "")
                  // {
                  //   Alert.alert("Please enter remarks")
                  //   return
                  // }
                  
                  
                  
                  InspectionEnteries.inspectionParams["measurementDeviation"] = MeasurementDeviation
                  InspectionEnteries.inspectionParams["remarks"] = Remarks

                  
                  FinalInspectionImageList.forEach((ImageObject) => {
                    InspectionEnteries.inspectionParams["finalInspectionImageNames"].push(ImageObject.name)
                  })

                  // InspectionEnteries.inspectionParams["endTime"] = `${moment().format()}`
                  InspectionEnteries.inspectionParams["endTime"] = `${moment().format('DD-MMM-YYYY h:mm:ss')}`


                  InspectionEnteries.inspectionParams.inspectionDtParams.forEach((defectObject) => {
                    if(defectObject["defectType"] == "main")
                      defectObject["defectType"] = "defect"
                  })
                  
                  // console.log("#### JSON part of form object being sent to api for saving #####")
                  // console.log(InspectionEnteries)

                  // for (var defectObject of InspectionEnteries.inspectionParams.inspectionDtParams)
                  // {
                  //   if(defectObject.defectType == "measurement")
                  //     defectObject.defectsID = "0"
                  //   else if(defectObject.defectType == "missellaneous")
                  //   defectObject.defectsID = "1"
                  // }

                  var formData  = new FormData()
                  formData.append("json", JSON.stringify(InspectionEnteries))

                  // console.log("######## Inspection info request being sent ########")
                  // console.log(InspectionEnteries)

                  
                  // InspectionEnteries.defectImageObjects.forEach(async (ImageObject) => {

                  //   const resizedPhoto = await ImageManipulator.manipulateAsync(
                  //     ImageObject.uri,
                  //     [{ resize: { width: 300, height: 250} }], // resize to width of 300 and preserve aspect ratio 
                  //     { compress: 0.2, format: 'jpeg' },
                  //     );
              
                  //   // formData.append(ImageObject.name, ImageObject)
                  // })

                  for(const ImageObject of InspectionEnteries.defectImageObjects)
                  {
                    formData.append(ImageObject.name, ImageObject)
                  }


                  

                  // FinalInspectionImageList.forEach( async (ImageObject) => {

                  //   const resizedPhoto = await ImageManipulator.manipulateAsync(
                  //     ImageObject.uri,
                  //     [{ resize: { width: 300, height: 250} }], // resize to width of 300 and preserve aspect ratio 
                  //     { compress: 0.2, format: 'jpeg' },
                  //     );
              
                  //   ImageObject["uri"] = resizedPhoto.uri

                  // })

                  for(const ImageObject of FinalInspectionImageList)
                  {
                    formData.append(ImageObject.name, ImageObject)
                  }

                  // formData.append("image", JSON.stringify({...InspectionEnteries.defectImageObjects[0]}))

                  console.log("###################Form data from audit#####################")
                  console.log(formData)

                  fetch(
                    `${ApiUrl}/api/bkQuality/auditing/saveInspectionDetails`,
                    {
                      method: "POST",
                      body: formData,
                      headers: {
                        "Content-Type": "multipart/form-data",
                      },
                    }
                  )
                    .then((response) => {
                        return response.json()
                    })
                    .then((responseJson) => {
                      console.log("##### Response ####")
                      console.log(responseJson)
                      Alert.alert(responseJson.result != null ? responseJson.result : (responseJson.message != null ? responseJson.message : responseJson.errMsg))
                      // props.navigation.navigate("BulkOrderListScreen")
                      props.navigation.navigate("Home")
          
                    })
                    .catch((error) => {
                        console.log("#### Error sending request ######")
                        console.log(error)
                        Alert.alert("Network error")
                    
                    });


                }}
              >
                <Text style={{color: Colors.accentColor, fontWeight: "bold", fontSize: 20}}>Submit</Text>
              </TouchableOpacity>

            
        </View>
    )

}

const styles = StyleSheet.create({
    textInput: {
       
        fontWeight:"bold", 
        justifyContent: 'center', 
        marginVertical: 7, 
        height: 40,  
        borderColor: Colors.inactiveColor, 
        borderWidth:3, 
        borderRadius: 5},

        input: {
            borderWidth: 2,
            paddingLeft: 20,
            borderColor: "grey",
            padding: 3,
            marginTop: 12,
            color: "grey",
            fontSize: 20,
            fontWeight: "bold",
            borderRadius: 7,
            width: Dimensions.get("window").width / 1.4,
          },

    textStyle: {
            color: "white",
            fontWeight: "bold",
            textAlign: "center",
            fontSize: 20
          },

    openButton: {
            backgroundColor: Colors.primaryColor,
            borderRadius: 10,
            padding: 10,
            elevation: 10,
            marginHorizontal: 10,
            marginVertical: 10,
          },
    addbutton: {
            backgroundColor: Colors.primaryColor,
            borderWidth: 1,
            borderRadius: 20,
            width: 40,
            height: 40,
          },
    title: {
            paddingBottom: 2,
            fontSize: 30,
            textAlign: "center",
            fontFamily: "effra-heavy",
            color: Colors.accentColor,
          },

    
})

InspectionResult.navigationOptions = (navData) => {
    return {
      headerTitle: "Inspection Audit Result",
      headerStyle: {
        backgroundColor: Colors.primaryColor,
      },
      headerTintColor: Colors.accentColor,
    };
  }

export default InspectionResult