import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableHighlight,
  View,
  Keyboard,
  ScrollView,
  ActivityIndicator, 
  Modal,
  Image,
  Alert,
  ImageBackground
} from "react-native";

import SearchableDropdown from 'react-native-searchable-dropdown'
import { FloatingLabelInput } from 'react-native-floating-label-input'
import Colors from "../constants/colors"
import { Dimensions } from 'react-native';
import { TouchableOpacity } from "react-native";
import { FlatList } from "react-native";
import * as ImagePicker from "expo-image-picker"
import { Icon } from 'react-native-elements'
import moment from "moment";

import CameraScreen from "../components/CameraScreen"
import {Camera} from 'expo-camera'
import * as ImageManipulator from 'expo-image-manipulator'
import RadioButtonRN from 'radio-buttons-react-native';





const ApiUrl = "https://qualitylite.bluekaktus.com"
// const ApiUrl = "http://7d3c0b9a97be.ngrok.io"


const InspectionForm = (props) => {


    // const SelectedOrderInfo = props.navigation.getParam("orderInfo")
    const [SelectedOrderInfo, SetSelectedOrderInfo] = useState(props.navigation.getParam("orderInfo"))
    

    const [MainDefectsList, SetMainDefectsList] = useState([])
    const [AQIlevels, SetAQIlevels] = useState([])
    const [BuyerName, SetBuyerName] = useState("")
    const [AqlObject, SetAqlObject] =useState({})
    const [NestedAqlObject, SetNestedAqlObject] = useState("")
    const [OrderQuantity, SetOrderQuantity] = useState(SelectedOrderInfo.orderQuantity)
    const [OfferedQuantity, SetOfferedQuantity] = useState("")
    const [ExcessQuantity, SetExcessQuantity] = useState("")
    const [factoryRepresentative, SetFactoryRepresentative] = useState("")
    const [PackedQuantity, SetPackedQuantity] = useState("")
    const [SampleSize, SetSampleSize] = useState("")
    const [Fg1Quantity, SetFg1Quantity] = useState("")
    const [Fg2Quantity, SetFg2Quantity] = useState("")
    const [CartonSampleSize, SetCartonSampleSize] = useState("")
    const [CartonSelected, SetCartonSelected] = useState("")
    const [TotalCartons, SetTotalCartons] = useState("")
    const [MainDefect, SetMainDefect] = useState("")
    const [MainDefectExtent, SetMainDefectExtent] = useState({"critical": "", "major": "", "minor": ""})
    const [MissDefectExtent, SetMissDefectExtent] = useState({"critical": "", "major": "", "minor": ""})
    const [MeasurementDefectExtent, SetMeasurementDefectExtent] = useState({"critical": "", "major": "", "minor": ""})
    const [DefectsSummary, SetDefectsSummary] = useState({"Total Critical Defect": 0, "Total Major Defect": 0, "Total Minor Defect": 0, "Total Defect": 0, "Defect Rate": 0})
    const [MissellaneousDefect, SetMissellaneousDefect] = useState("")
    const [MeasurementDefect, SetMeasurementDefect] = useState("")
    const [CombinedDefectsList, SetCombinedDefectsList] = useState([])
    const [CurrentSelectedDefectObjectForImageInput, SetCurrentSelectedDefectObjectForImageInput] = useState({})
    const [DefectImageObjectsList, SetDefectImageObjectsList] = useState([])
    const [FinalInspectionImageObjectList, SetFinalInspectionImageObjectList] = useState([])
    const [StartCamera, SetStartCamera] = useState(false)
    const [CurrentDefectObject, SetCurrentDefectObject] = useState({})
    const [DataLoaded, SetDataLoaded] = useState(false)
    const [IsPartInspection, SetIsPartInspection] = useState("undecided")
    const [InspectionTypeSelected, SetInspectionTypeSelected] = useState(false)
    // [{"key": "imageA.jpg",
    // "type": "file",
    // "src": "/E:/Random Shit/garment images/imageA.jpg"
    // },]

    const [MeasurementDeviation, SetMeasurementDeviation] = useState("")
    const [Result, SetResult] = useState("")
    const [Remarks, SetRemarks] = useState("")

    const [ShowImageModal, SetImageModalVisibility] = useState(false)
    const [DisableMainMeasurement, SetDisableMainMeasurement] = useState(false)
    
    // const [RequestBody, SetRequestBody] = useState({})


    const screenHeight = Dimensions.get('window').height
    const screenWidth = Dimensions.get('window').width
    
    // console.log("###### Selected Order #########")
    // console.log(SelectedOrderInfo)
    
    const __startCamera = async (DefectObject) => {
        SetCurrentDefectObject(DefectObject)
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
        // console.log("############ ImageObject ##################3")
        // console.log(PhotoObject)
        var newImageObject = {
            
            name: PhotoObject.uri.split("/").pop(),
            type: "image/jpeg",
            uri: PhotoObject.uri
          }

          const resizedPhoto = await ImageManipulator.manipulateAsync(
            PhotoObject.uri,
            // [{ resize: { width: 300, height: 250} }], // resize to width of 300 and preserve aspect ratio 
            [],
            { compress: 0.2, format: 'jpeg' },
           );

        newImageObject["uri"] = resizedPhoto.uri
    
        SetDefectImageObjectsList(DefectImageObjectsList.concat([newImageObject]))
    
        defectObject.imageNames.push(newImageObject.name)
        defectObject.imageUris.push({...newImageObject})


        console.log("###### Modified defect object with defect ID "+defectObject.id+" to: ")
        console.log(defectObject)
    }

    const UpdateSampleSize = (NestedAQLObject, packedQty = PackedQuantity) => {
        // console.log("##### AQL object ########")
        // console.log(NestedAQLObject)
        // console.log("####Packed qty#####")
        // console.log(packedQty)
        if(packedQty == null || packedQty == "")
        {
            SetSampleSize("")
            return
        }
        var maxVal = Number.MIN_VALUE
        var minVal = Number.MAX_VALUE
        var largestMaxValObject = {}
        var smallestMinValObject = {}
        var found = false

        for (const rangeObject of NestedAQLObject.aqlDtDetails)
        {
           if(rangeObject.maxValue > maxVal)
           {
               maxVal = rangeObject.maxValue
               largestMaxValObject = rangeObject
           }
           if(rangeObject.minValue < minVal)
           {
               minVal = rangeObject.minValue
               smallestMinValObject = rangeObject
           }
               
           if(parseInt(packedQty) <= rangeObject.maxValue && (parseInt(packedQty) >= rangeObject.minValue))
           {
               SetSampleSize(rangeObject.sampleSize)
               SetAqlObject({...rangeObject, aqlLevel: NestedAQLObject.aqlLevel,})
               var newDefectsSummary = {...DefectsSummary}
               newDefectsSummary["Defect Rate"] = ((newDefectsSummary["Total Defect"]/parseInt(rangeObject.sampleSize))*100).toFixed(1)
               SetDefectsSummary(newDefectsSummary)
               found = true
               break
           }
        }

        if( !found )
        {
        //    SetAqlObject({...largestMaxValObject, aqlLevel: NestedAQLObject.aqlLevel,})
        //    SetSampleSize(largestMaxValObject.sampleSize)
        //    var newDefectsSummary = {...DefectsSummary}
        //    newDefectsSummary["Defect Rate"] = ((newDefectsSummary["Total Defect"]/parseInt(largestMaxValObject.sampleSize))*100).toFixed(1)
        //    SetDefectsSummary(newDefectsSummary)

           SetAqlObject({...smallestMinValObject, aqlLevel: NestedAQLObject.aqlLevel,})
           SetSampleSize(smallestMinValObject.sampleSize)
           var newDefectsSummary = {...DefectsSummary}
           newDefectsSummary["Defect Rate"] = ((newDefectsSummary["Total Defect"]/parseInt(smallestMinValObject.sampleSize))*100).toFixed(1)
           SetDefectsSummary(newDefectsSummary)
        }

     }

      console.log("### Selected oder quantity ###")
      console.log(SelectedOrderInfo)
      const UpdateDefectsSummary = (NewDefectObject, operation, MissellaneousAddPressed = false) => {
         
            var newDefectsSummary = {...DefectsSummary}
            console.log("## Currrect defects summary#####")
            console.log(newDefectsSummary)
            console.log("### New object to update defects summary ####")
            console.log(NewDefectObject)
           if(operation == "add")
            {
                newDefectsSummary["Total Critical Defect"] = NewDefectObject.criticalDefectCount != "" ?  parseInt(NewDefectObject.criticalDefectCount)+ parseInt(newDefectsSummary["Total Critical Defect"]) : newDefectsSummary["Total Critical Defect"]
                newDefectsSummary["Total Major Defect"] = NewDefectObject.majorDefectCount != "" ?  parseInt(NewDefectObject.majorDefectCount)+ parseInt(newDefectsSummary["Total Major Defect"]): newDefectsSummary["Total Major Defect"]
                newDefectsSummary["Total Minor Defect"] = NewDefectObject.minorDefectCount != "" ?  parseInt(NewDefectObject.minorDefectCount) + parseInt(newDefectsSummary["Total Minor Defect"]) : newDefectsSummary["Total Minor Defect"]
                
            
                newDefectsSummary["Total Defect"] = parseInt(newDefectsSummary["Total Critical Defect"]) + parseInt(newDefectsSummary["Total Major Defect"]) +  parseInt(newDefectsSummary["Total Minor Defect"] )
                newDefectsSummary["Defect Rate"] = 0

                if(NewDefectObject.criticalDefectCount != "" && parseInt(NewDefectObject.criticalDefectCount) != 0 && !DisableMainMeasurement && SelectedOrderInfo.inspectionID == 0)
                {
                    Alert.alert(
                        
                        'Critical defect found',
                        'Do you want to continue inspection?',
                        [
                          {
                            text: 'No',
                            onPress: () => {SetDisableMainMeasurement(true)},
             
                          },
                          {
                            text: 'Yes', 
                            onPress: () => console.log('Inspection continued even after critical defect')
                          },
                        ],
                        {cancelable: false},
                      )
                }

                
            }

            else 
            {
                newDefectsSummary["Total Critical Defect"] = NewDefectObject.criticalDefectCount != "" ? parseInt(newDefectsSummary["Total Critical Defect"]) - parseInt(NewDefectObject.criticalDefectCount): newDefectsSummary["Total Critical Defect"]
                newDefectsSummary["Total Major Defect"] = NewDefectObject.majorDefectCount != "" ? parseInt(newDefectsSummary["Total Major Defect"]) - parseInt(NewDefectObject.majorDefectCount): newDefectsSummary["Total Major Defect"]
                newDefectsSummary["Total Minor Defect"] = NewDefectObject.minorDefectCount != "" ? parseInt(newDefectsSummary["Total Minor Defect"]) - parseInt(NewDefectObject.minorDefectCount) : newDefectsSummary["Total Minor Defect"]
                
            
                newDefectsSummary["Total Defect"] = parseInt(newDefectsSummary["Total Critical Defect"]) + parseInt(newDefectsSummary["Total Major Defect"]) +  parseInt(newDefectsSummary["Total Minor Defect"] )
                newDefectsSummary["Defect Rate"] = 0

                if(parseInt(newDefectsSummary["Total Critical Defect"]) == 0)
                    SetDisableMainMeasurement(false)

                
            }

            if(SampleSize != "")
                newDefectsSummary["Defect Rate"] =  ((newDefectsSummary["Total Defect"]/parseInt(SampleSize))*100).toFixed(1)

            SetDefectsSummary(newDefectsSummary)
            console.log("#### Updated defects summary #####")
            console.log(newDefectsSummary)
            
   
      }

      const UpdateWithEditedImage = (combinedDefectsList, defectImageObjectsList, orignalImageUri, orignalImageName, newImageUri) => {
        // defectObject.imageUris = defectObject.imageUris.filter((ImgObj) => ImgObj.name != orignalImageName)
        // var orignalImageName = orignalImageUri.split("/").pop()
        console.log("##### combined defects list in UpdateWithEditedImage functuin ################")
        console.log(combinedDefectsList)

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

        console.log("###### New combined defects list ######")
        console.log(combinedDefectsList)
        console.log("###### New defectImageObject list ######")
        console.log(defectImageObjectsList)
        SetCombinedDefectsList(combinedDefectsList)
        SetDefectImageObjectsList(defectImageObjectsList)

      }

      const DeleteImage = (combinedDefectsList, defectImageObjectsList, orignalImageName,) => {

    
        for(var defectObject of combinedDefectsList)
        {   
            defectObject.imageNames = defectObject.imageNames.filter((ImgName) => ImgName != orignalImageName)
            defectObject.imageUris = defectObject.imageUris.filter((ImgObject) => ImgObject.name != orignalImageName)
        }
        
        defectImageObjectsList = defectImageObjectsList.filter((ImgObject) => ImgObject.name != orignalImageName)
        
        console.log("###### New combined defects list ######")
        console.log(combinedDefectsList)
        console.log("###### New defectImageObject list ######")
        console.log(defectImageObjectsList)
        SetCombinedDefectsList(combinedDefectsList)
        SetDefectImageObjectsList(defectImageObjectsList)
        SetImageModalVisibility(false)

      }

      const openImagePickerAsync = async (defectObject) => {
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
            
            name: pickerResult.uri.split("/").pop(),
            type: "image/jpeg",
            uri: pickerResult.uri
          }
    
        const resizedPhoto = await ImageManipulator.manipulateAsync(
        pickerResult.uri,
        // [{ resize: { width: 300, height: 250} }], // resize to width of 300 and preserve aspect ratio 
        [],
        { compress: 0.2, format: 'jpeg' },
        );

        newImageObject["uri"] = resizedPhoto.uri

        SetDefectImageObjectsList(DefectImageObjectsList.concat([newImageObject]))
    
        defectObject.imageNames.push(newImageObject.name)
        defectObject.imageUris.push({...newImageObject})


        console.log("###### Modified defect object with defect ID "+defectObject.id+" to: ")
        console.log(defectObject)
        
      }

      const UpdateStates = (requestObject) => {
        
        console.log("####### Updating states accoring to result from get inspection API ########")
        SetOfferedQuantity(requestObject.offerQty.toString())
        SetFactoryRepresentative(requestObject.factoryRepresentative)
        SetPackedQuantity(requestObject.packedQty)
        SetSampleSize(requestObject.sampleSize)
        SetFg1Quantity(requestObject.fg1Qty)
        SetFg2Quantity(requestObject.fg2Qty)
        SetCartonSampleSize(requestObject.cartonSampleSize)
        SetCartonSelected(requestObject.cartonSelected)
        SetTotalCartons(requestObject.totalCartons)
        SetIsPartInspection(requestObject.partInspection)

        

        var newCombinedDefectsList = []

        // for (var defectObject of requestObject.inspectionDtDetails)
        
        requestObject.inspectionDtDetails.forEach((defectObject) => {

            defectObject["defectType"] = defectObject["defectType"].toLowerCase() == "defect" ? "main" : defectObject["defectType"]
            defectObject["objectID"] = defectObject["defectsName"]
            defectObject["imageUris"] = []
            defectObject["imageNames"] = []
            defectObject["defectsName"] = defectObject["defectsName"] + defectObject["miscellaneousValue"] + defectObject["measurementValue"]

            for(var ImageObject of defectObject.defectImageUrls)
            {
                defectObject["imageUris"].push({"name": ImageObject.defectImageUrl.split("/").pop(),  "uri": ImageObject.defectImageUrl, "type": "image/jpeg"})
                // defectObject["imageUris"].push({"key": ImageObject.defectType,  "src": ImageObject.defectType })
                defectObject["imageNames"].push(ImageObject.defectImageUrl.split("/").pop())
                // defectObject["imageNames"].push(ImageObject.defectType)
            }
            newCombinedDefectsList.push(defectObject)
            // UpdateDefectsSummary(defectObject, "add")
            
        })

        SetCombinedDefectsList(newCombinedDefectsList)

        // for(var defectObject of newCombinedDefectsList)
        //     UpdateDefectsSummary(defectObject, "add")

        
        // {
        //     "result": [
        //         {
        //             "inspectionID": 191,
        //             "orderID": 1045,
        //             "orderNo": "Brahmos",
        //             "styleID": 77,
        //             "styleNo": "Floral Dress",
        //             "colorID": 41,
        //             "colorName": "Red",
        //             "offerQty": 25,
        //             "packedQty": 25.0,
        //             "sampleSize": 3,
        //             "factoryRepresentative": "ABC sharma ",
        //             "result": "FAILED",
        //             "remarks": "Good work",
        //             "lineID": 1090,
        //             "lineName": "Line 1",
        //             "startTime": "11-Nov-2020 12:00:00",
        //             "endTime": "11-Nov-2020 01:00:00",
        //             "maxMajorAcc": 1,
        //             "maxMinorAcc": 2,
        //             "aqlLevel": 15.0,
        //             "fg1Qty": 20,
        //             "fg2Qty": 5,
        //             "totalCartons": "56",
        //             "cartonSampleSize": "23",
        //             "cartonSelected": "5",
        //             "measurementDeviation": "High",
        //             "finalImageUrls": [
        //                 {
        //                     "finalImageUrl": "https://localhost:44367/InspectionImages/84/338540b5-91c3-41e6-8c00-66bb65eabe3e.jpg"
        //                 }
        //             ],
        //             "inspectionDtDetails": [
        //                 {
        //                     "defectType": "main",
        //                     "defectsID": 41,
        //                     "defectsName": "Loose thread",
        //                     "measurementValue": "",
        //                     "miscellaneousValue": "",
        //                     "majorDefectCount": 1,
        //                     "minorDefectCount": 2,
        //                     "criticalDefectCount": 0,
        //                     "defectImageUrls": [
        //                         {
        //                             "defectImageUrl": "https://localhost:44367/InspectionImages/84/cfa6c45b-04c7-4f1c-ae24-49addd7d8ba6.jpg"
        //                         },
        //                         {
        //                             "defectImageUrl": "https://localhost:44367/InspectionImages/84/594b38e2-c6ec-4e5a-8d86-2d1f0400b782.jpg"
        //                         },
        //                         {
        //                             "defectImageUrl": "https://localhost:44367/InspectionImages/84/d1f32c55-fe84-4dd3-b65b-ccf90bfc26d2.jpg"
        //                         },
        //                         {
        //                             "defectImageUrl": "https://localhost:44367/InspectionImages/84/2c76e6c0-6f2f-491a-936a-12e8e0ce7559.jpg"
        //                         }
        //                     ]
        //                 }
        //             ]
        //         }
        //     ]
        // }

      }


     

    useEffect(() => {

        fetch(
          `${ApiUrl}/api/bkQuality/auditing/getDefectList`,
          {
            method: "POST",
            body: JSON.stringify({
              basicparams: {
                companyID: SelectedOrderInfo.companyID,
                userID: SelectedOrderInfo.userID,
                styleID: SelectedOrderInfo.styleID
           
              },
      
            }),
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
            },
          }
        )
        .then(res => res.json())
        .then(body => {
          console.log("########## Defect List ##########")
        //   console.log(body.result)
          var newDefects = []
          body.result.forEach((DefectObject) => {
            const newDefectObject = {id: DefectObject.defectsID, name: DefectObject.defectsName, ...DefectObject}
            newDefects.push(newDefectObject)
            
          })
           console.log(newDefects)
          SetMainDefectsList(newDefects)
        })
        .catch((error) => console.log(error)); //to catch the errors if any
  
      }, [])

      useEffect(() => {

        fetch(
        //   `${ApiUrl}/api/bkQuality/auditing/getAQLDetails`,
        `${ApiUrl}/api/bkQuality/auditing/getNestedAQLDetails`,
          {
            method: "POST",
            body: JSON.stringify({
              basicparams: {
                companyID: SelectedOrderInfo.companyID,
                userID: SelectedOrderInfo.userID,
           
              },
      
            }),
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
            },
          }
        )
        .then(res => res.json())
        .then(body => {
          console.log("########## AQI List ##########")
          console.log(body.result)
          var newAQIlevels = []
          body.result.forEach((obj) => {
            const newObj = {...obj, id: obj.aqlLevel, name: obj.aqlLevel.toString()}
            newAQIlevels.push(newObj)
            
          })
        //   console.log(newAQIlevels)
          SetAQIlevels(newAQIlevels)
        })
        .catch((error) => console.log(error)); //to catch the errors if any
  
      }, [])



    var requestBody = {
        "basicParams": {
            "companyID": SelectedOrderInfo.companyID,
            "userID": SelectedOrderInfo.userID
        },
        "inspectionParams": {
            "orderID": SelectedOrderInfo.orderID,
            "styleID": SelectedOrderInfo.styleID,
            "colorID": SelectedOrderInfo.colorID,
            "packedQty": PackedQuantity!="" ? PackedQuantity : 0,
            "offerQty": OfferedQuantity,
            "sampleSize": SampleSize!="" ? SampleSize : 0,
            "result": Result,
            "remarks": Remarks,
            // "lineID": 1259,
            "factoryID": SelectedOrderInfo.factoryID,
            "startTime": `${moment().format('DD-MMM-YYYY h:mm:ss')}`,
            "endTime": `${moment().format('DD-MMM-YYYY h:mm:ss')}`,
            
            "maxMajorAcceptance": AqlObject.majorAcceptance != null ? AqlObject.majorAcceptance: 0,
            "maxMinorAcceptance": AqlObject.minorAcceptance != null ? AqlObject.minorAcceptance: 0,
            "aqlLevel": AqlObject.aqlLevel != null ? AqlObject.aqlLevel : 0,
            "fg1Qty": Fg1Quantity != "" ? Fg1Quantity : 0,
            "fg2Qty": Fg2Quantity != "" ? Fg2Quantity : 0,
            "cartonSampleSize": CartonSampleSize,
            "cartonSelected": CartonSelected,
            "totalCartons": TotalCartons,
            "factoryRepresentative": factoryRepresentative,
            "partInspection": IsPartInspection,
            "passFailBy": SelectedOrderInfo.userID,
            // "passFailOn": "11-Nov-2020 13:05:00",
            "passFailOn": `${moment().format('DD-MMM-YYYY h:mm:ss')}`,
            "measurementDeviation": MeasurementDeviation,
            "inspectionDtParams": CombinedDefectsList,
            "finalInspectionImageNames": []
        },

        "defectImageObjects": DefectImageObjectsList,
        "defectsSummary": DefectsSummary,
        "inspectionID": SelectedOrderInfo.inspectionID,
        "finalInspectionImageObjectList": FinalInspectionImageObjectList,
        "AqlObject": AqlObject
    }

      if(SelectedOrderInfo.inspectionID != 0) // ############# For viewing past inspection ###############
      {
        useEffect(() => {

            fetch(
              `${ApiUrl}/api/bkQuality/auditing/getInspectionDetails`,
              {
                method: "POST",
                body: JSON.stringify({
                  basicparams: {
                    companyID: SelectedOrderInfo.companyID,
                    userID: SelectedOrderInfo.userID,
                    inspectionID: SelectedOrderInfo.inspectionID,
                  },
          
                }),
                headers: {
                  "Content-Type": "application/json",
                  Accept: "application/json",
                },
              }
            )
            .then(res => res.json())
            .then(body => {
              console.log("########## Audit information from get inspectiondetails ##########")
              console.log(body.result)
                
            //   console.log(newAQIlevels)
              UpdateStates(body.result[0])
              var newDefectsSummary = {...DefectsSummary}
              body.result[0].inspectionDtDetails.forEach((defectObject) => {
                //   UpdateDefectsSummary(defectObject, "add")
                newDefectsSummary["Total Critical Defect"] = parseInt(newDefectsSummary["Total Critical Defect"]) + parseInt(defectObject.criticalDefectCount)
                newDefectsSummary["Total Major Defect"] = parseInt(newDefectsSummary["Total Major Defect"]) + parseInt(defectObject.majorDefectCount)
                newDefectsSummary["Total Minor Defect"] = parseInt(newDefectsSummary["Total Minor Defect"]) + parseInt(defectObject.minorDefectCount)
                newDefectsSummary["Total Defect"] = newDefectsSummary["Total Critical Defect"] + newDefectsSummary["Total Major Defect"] + newDefectsSummary["Total Minor Defect"]
                newDefectsSummary["Defect Rate"] = (newDefectsSummary["Total Defect"]/parseInt(body.result[0].sampleSize)*100).toFixed(1)
              })

              SetDefectsSummary(newDefectsSummary)
              SetExcessQuantity((parseInt(body.result[0].offerQty) - parseInt(SelectedOrderInfo.orderQuantity)).toString())
              SetAqlObject({aqlLevel: body.result[0].aqlLevel.toString()})
              SetRemarks(body.result[0].remarks)
              SetResult(body.result[0].result)
              SetMeasurementDeviation(body.result[0].measurementDeviation)

              const finalInspectiomImageObjectList = []
            
              body.result[0].finalImageUrls.forEach((ImageUrlObject) => {
                finalInspectiomImageObjectList.push({
                    "name": ImageUrlObject.finalImageUrl.split("/").pop(),
                    "type":"image/jpeg",
                    "uri": ImageUrlObject.finalImageUrl
                })
                
              })

              SetFinalInspectionImageObjectList(finalInspectiomImageObjectList)
              SetDataLoaded(true)

            })
            .catch((error) => console.log(error)); //to catch the errors if any
      
          }, [])


          useEffect(() => {props.navigation.setParams({requestBody: requestBody})}, [])
    
      }
    
    
  if(StartCamera)
    return (
        <CameraScreen 
            // imageObjectList={ImageObjectList}
            callback={getImageInfo}
            currentDefectObject={CurrentDefectObject}
        ></CameraScreen>
    )
      


    return (
        <ScrollView style={{marginHorizontal: 10, alignContent: "center"}}
            keyboardShouldPersistTaps="always"
        >
            {(() => {
            if(SelectedOrderInfo.inspectionID != 0 &&  ! DataLoaded)
                return (<View style = {{alignSelf: "center", alignItems: "center"}}><ActivityIndicator size="large" color={Colors.primaryColor} /></View>)
            })()}

                <Modal
                    id="ImageListView"
                    animationType="slide"
                    transparent={true}
                    // visible={ShowMessageModal} 
                    visible = {ShowImageModal}
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
                                <Text style={{color: Colors.accentColor, marginHorizontal: "20%", fontSize: 18, fontWeight: "bold"}}>Defect Images</Text>
                            </View>
                        </TouchableOpacity>


                        <View style={{marginHorizontal: 10, marginTop: 20, marginBottom: 0.18*screenHeight}}>
                            <FlatList
                                data={CurrentSelectedDefectObjectForImageInput.imageUris}
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
                                        //     borderRadius: 5
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
                                            <View style={{flexDirection: "row", marginTop: 5, marginHorizontal: 7}}>
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
                                                                onPress: () => DeleteImage(CombinedDefectsList.slice(), DefectImageObjectsList.slice(),  item.name)
                                                              },
                                                            ],
                                                            {cancelable: false},
                                                          )
                                                        
                                                        
                                                    }}
                                                    disabled={SelectedOrderInfo.inspectionID != 0}
                                                >
                                                    <Icon
                                                        reverse
                                                        name='ios-trash'
                                                        type='ionicon'
                                                        color={"red"}
                                                        size={20}
                                                    />
                                                </TouchableOpacity>
                                                {/*<TouchableOpacity
                                                    style={{marginRight: 10, width: 20, alignItems: "center", borderRadius: 10, justifyContent: "center"}}
                                                    onPress={() => {
                                                        console.log("pressed")
                                                        props.navigation.navigate("ImageDrawing")
                                                        SetImageModalVisibility(false)
                                                        props.navigation.navigate("ImageDrawing", { BackgroundImageUri: item.uri , BackgroundImageName: item.name, combinedDefectsList: CombinedDefectsList.slice(), 
                                                                                                    defectImageObjectsList: DefectImageObjectsList.slice(), updateCallback: UpdateWithEditedImage })
                                                        
                                                    }}
                                                    disabled={SelectedOrderInfo.inspectionID != 0}
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
                                // openImagePickerAsync(CurrentSelectedDefectObjectForImageInput)
                                // __startCamera(CurrentSelectedDefectObjectForImageInput)
                                Alert.alert(
                        
                                    'Image Source',
                                    'Select the source of Image',
                                    [
                                      {
                                        text: 'Camera',
                                        onPress: () => __startCamera(CurrentSelectedDefectObjectForImageInput),
                         
                                      },
                                      {
                                        text: 'Gallery', 
                                        onPress: () => openImagePickerAsync(CurrentSelectedDefectObjectForImageInput)
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

                <TextInput
                    // style= {{marginLeft: 4, color: Colors.primaryColor}}
                    id="buyerNameTextInput"
                    style={{...styles.input}}
                    placeholder="Buyer Name"
                    editable={false}
                    
                    // keyboardType = {item.fieldType == 'numeric'}
                    placeholderTextColor={"grey"}
                    maxLength={50}
                    // editable={TextFieldStatus[item.fieldType]}
                    // onBlur={Keyboard.dismiss}
                    value={SelectedOrderInfo.brandName}
                    onChangeText = {(newChangedText) => {SetBuyerName(newChangedText)}}
                />


                {/* <View id=" AQI Index" style={{borderColor: Colors.inactiveColor, borderWidth:3, borderRadius: 5, justifyContent: "center", marginVertical: 10, height: 55}}> */}
                
                {(() => {
                    if(SelectedOrderInfo.inspectionID == 0)
                        return(

                        <SearchableDropdown
              //On text change listner on the searchable input
                        // defaultIndex={2}
                        onTextChange={(text) => console.log(text)}
                        onItemSelect={item => { 
                            SetNestedAqlObject(item)
                            SetPackedQuantity("")
                            SetOfferedQuantity("")
                            // SetSampleSize(item.sampleSize)
                            // var newDefectsSummary = {...DefectsSummary}
                            // newDefectsSummary["Defect Rate"] = ((newDefectsSummary["Total Defect"]/parseInt(item.sampleSize))*100).toFixed(1)
                            // SetDefectsSummary(newDefectsSummary)
                        }}
                        selectedItems={NestedAqlObject}
                        //onItemSelect called after the selection from the dropdown
                        containerStyle={{ padding: 8,
                        borderWidth:2,
                        borderRadius:10,
                        borderColor:Colors.primaryColor,
                        marginTop: 15,
                        }}
                        //suggestion container style
                        textInputStyle={{
                            //inserted text style
                            paddingLeft:10,
                            fontSize: 20,
                            fontWeight: "bold",
                            color:Colors.primaryColor
                
                        }}
                        itemStyle={{
                            //single dropdown item style
                            padding: 3,
                            marginLeft:5,
                            width:Dimensions.get("window").width / 1.25 ,
                            marginTop: 2,
                            borderBottomColor:"#00334e80",
                            borderBottomWidth: 1,
                        }}
                        itemTextStyle={{
                            //text style of a single dropdown item
                            fontSize: 18,
                            fontWeight: "bold",
                            color:Colors.primaryColor,
                        }}
                        itemsContainerStyle={{
                            //items container style you can pass maxHeight
                            //to restrict the items dropdown hieght
                            maxHeight: '100%',
                        }}
                        items={AQIlevels}
                        defaultIndex={(() => {
                            var index = 0
                            for(obj of AQIlevels)
                            {
                                if(obj.aqlLevel == NestedAqlObject.aqlLevel)
                                    return index.toString()
                                index = index +1
                            }
                            return null
                        })()}
                        //mapping of item array
                        //default selected item index
                        placeholder={"AQL Index"}
                        placeholderTextColor="#00334e80"
                        //place holder for the search input
                        resetValue={false}
                        //reset textInput Value with true and false state
                        underlineColorAndroid="transparent"
                        //To remove the underline from the android input
                        />

                        )


                    return (
                        <View style={{flexDirection: "row", alignContent: "center", marginVertical: 10, alignItems: "center"}}>
                            <Text style={{color: "grey", fontWeight: "bold", fontSize: 15}}>AQL Index</Text>
                            <Text style={{color: "blue", fontSize: 20, fontWeight: "bold", marginLeft: 5}}>{AqlObject.aqlLevel}</Text>
                        </View>
                    )

                })()}
                
                
                {/* </View> */}


  
                
                <View id="PO Wise Quantity" style={{borderColor: Colors.primaryColor, borderWidth: 1, marginVertical: 10, borderRadius: 5, justifyContent: "center", alignItems: "center", padding: 5}}>
                    

                    <View  style={{ width: Dimensions.get("window").width / 1.2, marginVertical: 5, backgroundColor: "white", }}>
                        <FloatingLabelInput
                                label="Order"
                                labelStyles={{color: "grey", fontSize: 12, fontWeight: "bold"}}
                                //containerStyles={{...styles.input, paddingVertical: 5}}
                                inputStyles={{fontWeight: "bold", fontSize: 18, color: Colors.primaryColor, marginVertical: 5}}
                                maxLength={50}
                                editable={false}
                                value={SelectedOrderInfo.orderNo}
                                // onChangeText = {(newChangedText) => {console.log(newChangedText)}}
                        />
                        </View>
                    <View id="OrderOfferQuantities" style={{flexDirection: "row", marginVertical: 5}}>
                        
                            <View  style={{ width: "45%", backgroundColor: "white"}}>
                            <FloatingLabelInput
                                label="Ordered Quantity"
                                labelStyles={{color: "grey", fontSize: 12, fontWeight: "bold"}}
                            
                                inputStyles={{fontWeight: "bold", fontSize: 18, color: Colors.primaryColor, marginVertical: 2}}
                                //containerStyles={{...styles.input, width: Dimensions.get("window").width / 2.5, height: 45, marginHorizontal: 5,  backgroundColor: "white"}}
                                //inputStyles={{fontWeight: "bold", fontSize: 14, color: Colors.primaryColor}}
                                keyboardType='numeric'
                                maxLength={50}
                                editable={false}
                                value={OrderQuantity.toString()}
                            //     onChangeText = {(newOrderQuantity) => {
                            //     SetOrderQuantity(newOrderQuantity)
                                
                            //     if(newOrderQuantity != "" && OfferedQuantity != "")
                            //     {
                            //         const newExcessQuantity = (parseInt(newOrderQuantity) -parseInt(OfferedQuantity)).toString()
                            //         SetExcessQuantity(newExcessQuantity)
                            //     }
                            // }}
                            />
                            </View>

                            <View style={{width: "45%", marginHorizontal: 5,  backgroundColor: "white"}}>
                            <FloatingLabelInput
                                label="Offered Quantity"
                                labelStyles={{color: "grey", fontSize: 12, fontWeight: "bold"}}
                            
                                
                                //containerStyles={{...styles.input, width: Dimensions.get("window").width / 2.5, height: 45, marginHorizontal: 5,  backgroundColor: "white"}}
                                inputStyles={{fontWeight: "bold", fontSize: 18, color: Colors.primaryColor, marginVertical: 2}} 
                                keyboardType='numeric'
                                maxLength={50}
                                editable={SelectedOrderInfo.inspectionID == 0}
                                
                                value={OfferedQuantity.toString()}
                                onChangeText = {(newOfferedQuantity) => {
                                    if(NestedAqlObject == "")
                                    {
                                        Alert.alert("Please select an aql value")
                                        return
                                    }
                                    const offerQtyMargin = parseFloat(SelectedOrderInfo.offerQtyMargin.split("%")[0])*OrderQuantity/100
                                    
                                    if(newOfferedQuantity != "" && parseInt(newOfferedQuantity) > parseInt(OrderQuantity) - parseInt(SelectedOrderInfo.doneQty) + parseInt(offerQtyMargin))
                                    {
                                        console.log("#### New offered quantity ####")
                                        console.log(newOfferedQuantity)
                                        
                                        console.log("###### offer quantity margin #####")
                                        console.log(offerQtyMargin)
                                        console.log("##### Max allowed offered quantity ######")
                                        console.log(parseInt(OrderQuantity) - parseInt(SelectedOrderInfo.doneQty) + parseInt(offerQtyMargin))
                                        Alert.alert("Offered quantity out of range")
                                        return
                                    }
                                    SetOfferedQuantity(newOfferedQuantity)
                                    SetPackedQuantity(newOfferedQuantity)
                                    if(newOfferedQuantity != "")
                                    {
                                        const newExcessQuantity = (parseInt(newOfferedQuantity) - parseInt(OrderQuantity))
                                        if(newExcessQuantity < 0)
                                        {
                                            SetIsPartInspection(true)
                                            SetInspectionTypeSelected(false)
                                        }
                                        else
                                        SetIsPartInspection("undecided")

                                        SetExcessQuantity(newExcessQuantity.toString())
                                        UpdateSampleSize(NestedAqlObject, newOfferedQuantity)
                                    }
                                    else
                                    {
                                        SetExcessQuantity("")
                                        SetIsPartInspection("undecided")
                                    }
                                }}
                            />
                            </View>
                            
                    </View>


                    {/* <TextInput
                            // style= {{marginLeft: 4, color: Colors.primaryColor}}
                            id="Excess Quantity"
                            style={{...styles.input, width: Dimensions.get("window").width / 1.2, marginHorizontal: 5}}
                            placeholder="Excess Quantity"
                            
                            // keyboardType = {item.fieldType == 'numeric'}
                            placeholderTextColor={"grey"}
                            maxLength={50}
                            // editable={false}
                            value={ExcessQuantity}
                            onChangeText = {(newExcessQuantity) => {
                                SetExcessQuantity(newExcessQuantity)

                            }}
                        /> */}
                            <View  style={{ width: Dimensions.get("window").width / 1.2, marginVertical: 5, backgroundColor: "white"}}>
                            <FloatingLabelInput
                                label="Excess Quantity"
                                labelStyles={{color: "grey", fontSize: 12, fontWeight: "bold"}}
                            
                
                                //containerStyles={{...styles.input, width: Dimensions.get("window").width / 1.2, marginHorizontal: 5, marginBottom: 20,  height: 45,  backgroundColor: "white"}}
                                inputStyles={{fontWeight: "bold", fontSize: 18, color: Colors.primaryColor, marginVertical: 2}}
                                editable={false}
                                keyboardType='numeric'
                                maxLength={50}
                                value={parseInt(ExcessQuantity) < 0 ? "0" : ExcessQuantity}
                                
                            />
                            </View>
                    
                                
                   
                </View>
                
                {/*<View id="factoryRepresentative" style={{...styles.textInput}}>
                    <TextInput 
                        placeholder="Factory representative person"
                        style={{marginLeft: 2}}
                        placeholderTextColor={"grey"}
                        value={factoryRepresentative}
                        onChangeText = {(newChangedText) => {SetFactoryRepresentative(newChangedText)}}
                    />
                    </View>*/}

                {/* <TextInput
                    // style= {{marginLeft: 4, color: Colors.primaryColor}}
                    style={{...styles.input, width: Dimensions.get("window").width / 1.05}}
                    placeholder="Factory representative person"
                    
                    // keyboardType = {item.fieldType == 'numeric'}
                    placeholderTextColor={"grey"}
                    maxLength={50}
                    // editable={TextFieldStatus[item.fieldType]}
                    // onBlur={Keyboard.dismiss}
                    value={factoryRepresentative}
                    onChangeText = {(newChangedText) => {SetFactoryRepresentative(newChangedText)}}
                /> */}
                <View  style={{ width: "100%", justifyContent: "center"}}>
                <FloatingLabelInput
                        // style={{...styles.input, width: Dimensions.get("window").width / 1.05}}
                        // placeholder="Factory representative person"
                        label="Factory representative person"
                        // placeholder= "Factory representative person"
                        // keyboardType = {item.fieldType == 'numeric'}
                        // placeholderTextColor={"grey"}
                        labelStyles={{color: "grey", fontSize: 12, fontWeight: "bold"}}
                    
                        //containerStyles={{...styles.input, height: 50, justifyContent: "center", marginTop: 15, marginBottom: 5}}
                        inputStyles={{fontWeight: "bold", fontSize: 16, color: Colors.primaryColor, marginVertical:2}}
                        maxLength={50}
                        // editable={TextFieldStatus[item.fieldType]}
                       // onBlur={Keyboard.dismiss}
                        editable={SelectedOrderInfo.inspectionID == 0}
                        value={factoryRepresentative}
                        onChangeText = {(newChangedText) => {
                            SetFactoryRepresentative(newChangedText)  
                            // props.navigation.setParams({requestBody: requestBody})
                            // SetLabelFontSize(10)
                        }}
                />
                </View>

            
                {(() => {
                    if(IsPartInspection == "undecided" || InspectionTypeSelected)
                        return (
                            <View style={{borderColor: Colors.primaryColor, borderRadius: 5, marginBottom: 5, borderWidth: 1}}>
                                <Text style={{color: Colors.inactiveColor, fontSize: 15, marginHorizontal: 10, marginTop: 10}}>Inspection Type</Text>
                                <RadioButtonRN
                                    style={{width: "80%", marginHorizontal: 25, marginBottom: 15}}
                                    textStyle={{marginHorizontal: 10, fontSize: 12, fontWeight: "bold", color: "grey"}}
                                    data={[
                                        {
                                        label: 'Part Inspection'
                                        },
                                        {
                                        label: 'Normal Inspection'
                                        },
                                        ]}
                                    selectedBtn={(SelectedOutcome) => {
                                    
                                    if(SelectedOutcome.label.toLowerCase() == "part inspection")
                                        SetIsPartInspection(true)
                                    else
                                        SetIsPartInspection(false)

                                    SetInspectionTypeSelected(true)
                                    
                                    }}
                                    circleSize={10}
                                    boxStyle={{height: 45}}
                                    deactiveColor="grey"
                                    activeColor={Colors.inactiveColor}
                                    initial={(() => {
                                        if(IsPartInspection == true)
                                            return 1
                                        if (IsPartInspection == false)
                                            return 2

                                        return -1

                                    })()}
                                    // boxActiveBgColor={InspectionOutcome == "FAILED" ? "#f08080" : "#90ee90"}
                
                                />   
                            </View>
                        )

                    return (
                        <View style={{flexDirection: "row", marginTop: 10, alignItems: "center", borderColor: Colors.primaryColor, borderRadius: 7, borderWidth: 2}}>
                            <Text style={{color: "grey", fontSize: 15, marginHorizontal: 10, marginVertical: 10}}>Inspection Type: </Text>
                            <Text style={{color: Colors.accentColor, fontWeight: "bold", fontSize: 16, marginHorizontal: 5, marginVertical: 10}}>{IsPartInspection? "PART INSPECTION" : "NORMAL INSPECTION"}</Text>
                            <TouchableOpacity
                                style={{borderRadius: 5, borderColor: "grey", height: 20, alignItems: 'center', justifyContent: "center", marginHorizontal: 20}}
                                onPress={() => SetIsPartInspection("undecided")}
                            >
                                {/* <Text style={{fontSize: 10, color: "grey", marginHorizontal: 5, marginVertical: 5}}>Edit</Text> */}
                                {(() => {
                                    if(SelectedOrderInfo.inspectionID == 0)
                                        return (
                                            <Icon
                                                // reverse
                                                name='ios-create'
                                                type='ionicon'
                                                color={Colors.primaryColor}
                                                size={22}
                                            />
                                        )
                                })()}
                                
                            </TouchableOpacity>
                        </View>
                    )
                })()}
                 
               
            <View id="inspectionParams" style={{borderWidth: 1, borderColor: Colors.primaryColor, marginTop: 20}}>
            <View id="QuanityParams" style={{flexDirection: "row", alignSelf: "center", marginVertical: 10}}>
                    <Text style={{marginHorizontal: 10}}>PR Quantity {OrderQuantity}</Text>
                    <Text style={{marginHorizontal: 10}}>Done Quantity {SelectedOrderInfo.doneQty}</Text>
            </View>

            <View id="PackedSampledSize" style={{flexDirection: "row", alignSelf: "center", marginVertical: 5}}>
                    <View style={{borderColor: Colors.primaryColor, marginHorizontal: 20, width: "40%", height: 45}}>
                    <FloatingLabelInput
                        // style={{...styles.input, width: Dimensions.get("window").width / 1.05}}
                        // placeholder="Factory representative person"
                        label="Packed Qty"
                        // placeholder= "Factory representative person"
                        keyboardType = "numeric"
                        // placeholderTextColor={"grey"}
                        labelStyles={{color: "grey", fontWeight: "bold"}}
                    
                        //containerStyles={{borderColor: Colors.primaryColor, marginHorizontal: 20, width: "40%", height: 45}}
                        inputStyles={{fontWeight: "bold", color: Colors.primaryColor}}
                        maxLength={5}
                        // editable={SelectedOrderInfo.inspectionID == 0}
                        editable={false}
        
                        value={PackedQuantity.toString()}
                        // onChangeText = {(newPackedQuantity) => {
                        //     if(NestedAqlObject.aqlLevel == null)
                        //     {
                        //         Alert.alert("Please select AQL index first")
                        //         return
                        //     }
                        //     SetPackedQuantity(newPackedQuantity)
                        //     UpdateSampleSize(NestedAqlObject, newPackedQuantity)
                        // }}
                    />
                    </View>

                    <View style={{borderColor: Colors.primaryColor, marginHorizontal: 20, width: "40%", height: 45}}>
                    <FloatingLabelInput
                       
                        label="Sample Size"
                        // placeholder= "Factory representative person"
                        keyboardType = "numeric"
                        // placeholderTextColor={"grey"}
                        labelStyles={{color: "grey", fontWeight: "bold"}}
                    
                        //containerStyles={{borderColor: Colors.primaryColor, marginHorizontal: 20, width: "40%", height: 45}}
                        inputStyles={{fontWeight: "bold", color: Colors.primaryColor}}
                        maxLength={5}
                        editable={false}
                        // onBlur={Keyboard.dismiss}
    
                        value={SampleSize.toString()}
                       
                    />
                    </View>
                
                
            </View>

            {/* <View id="fg1fg2" style={{flexDirection: "row", alignSelf: "center", marginBottom: 15}}>
            
                    
                    
                    <FloatingLabelInput
                        // style={{...styles.input, width: Dimensions.get("window").width / 1.05}}
                        // placeholder="Factory representative person"
                        label="FG1 Qty"
                        // placeholder= "Factory representative person"
                        keyboardType = "numeric"
                        // placeholderTextColor={"grey"}
                        labelStyles={{color: "grey", fontWeight: "bold"}}
                    
                        inputStyles={{color: "grey", fontWeight: "bold"}}
                        containerStyles={{borderColor: Colors.primaryColor, marginHorizontal: 20, width: "40%", height: 45}}
                        inputStyles={{fontWeight: "bold", color: Colors.primaryColor}}
                        maxLength={5}
                        editable={SelectedOrderInfo.inspectionID == 0}
                        // onBlur={Keyboard.dismiss}
    
                        value={Fg1Quantity.toString()}
                        onChangeText = {(newFg1Quantity) => {
                            if(PackedQuantity == "")
                            {
                                Alert.alert("Please enter packed quantity first")
                                return
                            }
                            if(newFg1Quantity != "" &&  parseInt(newFg1Quantity) > parseInt(PackedQuantity))
                            {
                                Alert.alert("FG quantities cannot be greter than packed quantities")
                                return
                            }
                            SetFg1Quantity(newFg1Quantity)
                            if(newFg1Quantity != "" && PackedQuantity != "")
                            {
                                var NewFg2Quantity = (parseInt(PackedQuantity) - parseInt(newFg1Quantity)).toString()
                                SetFg2Quantity(NewFg2Quantity)
                            }
                            else
                                SetFg2Quantity("")
                        }}
                    />

                   
                    <FloatingLabelInput
                        // style={{...styles.input, width: Dimensions.get("window").width / 1.05}}
                        // placeholder="Factory representative person"
                        label="FG2 Qty"
                        // placeholder= "Factory representative person"
                        keyboardType = "numeric"
                        // placeholderTextColor={"grey"}
                        labelStyles={{color: "grey", fontWeight: "bold"}}
                    
                        inputStyles={{color: "grey", fontWeight: "bold"}}
                        containerStyles={{borderColor: Colors.primaryColor, marginHorizontal: 20, width: "40%", height: 45}}
                        inputStyles={{fontWeight: "bold", color: Colors.primaryColor}}
                        maxLength={5}
                        editable={false}
                        // onBlur={Keyboard.dismiss}
    
                        value={Fg2Quantity.toString()}
                    />

            </View> */}

                <View id="totalCartons" style={{flexDirection: "row", alignSelf: "center", marginVertical: 5}}>
                <View style={{borderColor: Colors.primaryColor, marginHorizontal: 20, width: "90%", height: 45}}>
                    <FloatingLabelInput
                        // style={{...styles.input, width: Dimensions.get("window").width / 1.05}}
                        // placeholder="Factory representative person"
                        editable={SelectedOrderInfo.inspectionID == 0}
                        label="Total cartons"
                        // placeholder= "Factory representative person"
                        keyboardType = "numeric"
                        // placeholderTextColor={"grey"}
                        labelStyles={{color: "grey", fontWeight: "bold"}}
                    
                        //containerStyles={{borderColor: Colors.primaryColor, marginHorizontal: 20, width: "90%", height: 45}}
                        inputStyles={{fontWeight: "bold", color: Colors.primaryColor}}
                        maxLength={5}
                        editable={SelectedOrderInfo.inspectionID == 0}
                        // onBlur={Keyboard.dismiss}
    
                        value={TotalCartons.toString()}
                        onChangeText = {(newTotalCartons) => {
                            SetTotalCartons(newTotalCartons)
                        }}
                    />
                    </View>
                
            </View>

            <View id="cartonInfo" style={{flexDirection: "row", alignSelf: "center", marginVertical: 5, marginBottom: 10}}>
                
                <View style={{borderColor: Colors.primaryColor, marginHorizontal: 20, width: "40%", height: 45}}>
                <FloatingLabelInput
                        // style={{...styles.input, width: Dimensions.get("window").width / 1.05}}
                        // placeholder="Factory representative person"
                        label="Carton sample size"
                        // placeholder= "Factory representative person"
                        keyboardType = "numeric"
                        // placeholderTextColor={"grey"}
                        labelStyles={{color: "grey", fontWeight: "bold"}}
                    
                        //containerStyles={{borderColor: Colors.primaryColor, marginHorizontal: 20, width: "40%", height: 45}}
                        inputStyles={{fontWeight: "bold", color: Colors.primaryColor}}
                        maxLength={5}
                        editable={SelectedOrderInfo.inspectionID == 0}
                        // onBlur={Keyboard.dismiss}
    
                        value={CartonSampleSize.toString()}
                        onChangeText = {(newCartonSampleSize) => {
                            if(TotalCartons == "")
                            {
                                Alert.alert("Enter total number of cartons first")
                                return
                            }
                            if(parseInt(TotalCartons) < parseInt(newCartonSampleSize))
                            {
                                Alert.alert("Carton sample size cannot be greater than total cartons")
                                return
                            }



                            SetCartonSampleSize(newCartonSampleSize)
                        }}
                    />
                    </View>
                
                    <View style={{borderColor: Colors.primaryColor, marginHorizontal: 20, width: "40%", height: 45}}>
                    <FloatingLabelInput
                        // style={{...styles.input, width: Dimensions.get("window").width / 1.05}}
                        // placeholder="Factory representative person"
                        label="Carton Selected"
                        // placeholder= "Factory representative person"
                        keyboardType = "numeric"
                        // placeholderTextColor={"grey"}
                        labelStyles={{color: "grey", fontWeight: "bold"}}
                    
                        //containerStyles={{borderColor: Colors.primaryColor, marginHorizontal: 20, width: "40%", height: 45}}
                        inputStyles={{fontWeight: "bold", color: Colors.primaryColor}}
                        // maxLength={5}
                        editable={SelectedOrderInfo.inspectionID == 0}
                        // onBlur={Keyboard.dismiss}
    
                        value={CartonSelected.toString()}
                        onChangeText = {(newEnteredCartonNumber) => {
                            SetCartonSelected(newEnteredCartonNumber)
                        }}
                    />
                    </View>

            </View>

            

        </View>


        <View id="defectsInfo">

            <View id="mainDefect" style={{borderColor: Colors.primaryColor, borderWidth: 1 , marginTop: 20, alignItems: "center"}}>
                {/* <View id=" Main defect dropdown" style={{borderColor: Colors.inactiveColor, borderWidth:3, borderRadius: 5, width: "90%", justifyContent: "center", marginVertical: 20, height: 53}}> */}
                <SearchableDropdown
              //On text change listner on the searchable input
                        onTextChange={(text) => console.log(text)}
                        onItemSelect={item => { 
                            console.log("### Selected defect #####")
                            console.log(item)
                            SetMainDefect(item)
                        }}
                        selectedItems={MainDefect}
                        //onItemSelect called after the selection from the dropdown
                        containerStyle={{ padding: 8 ,width:Dimensions.get("window").width / 1.2 ,
                        borderWidth:3,
                        borderRadius:10,
                        borderColor:Colors.primaryColor,
                        marginTop: 25,
                        }}
                        //suggestion container style
                        textInputStyle={{
                            //inserted text style
                            paddingLeft:10,
                            fontSize: 20,
                            fontWeight: "bold",
                            color:Colors.primaryColor
                
                        }}
                        itemStyle={{
                            //single dropdown item style
                            padding: 3,
                            marginLeft:5,
                            width:Dimensions.get("window").width / 1.35 ,
                            marginTop: 2,
                            borderBottomColor:"#00334e80",
                            borderBottomWidth: 1,
                        }}
                        itemTextStyle={{
                            //text style of a single dropdown item
                            fontSize: 18,
                            fontWeight: "bold",
                            color:Colors.primaryColor,
                        }}
                        itemsContainerStyle={{
                            //items container style you can pass maxHeight
                            //to restrict the items dropdown hieght
                            maxHeight: '100%',
                        }}
                        items={MainDefectsList}
                        //mapping of item array
                        //default selected item index
                        placeholder="Select Main Defect"
                        placeholderTextColor="#00334e80"
                        //place holder for the search input
                        resetValue={false}
                        //reset textInput Value with true and false state
                        underlineColorAndroid="transparent"
                        //To remove the underline from the android input
                        
                        />
                {/* </View> */}

                <View id="MainDefectExtent" style={{flexDirection: "row", alignSelf: "center", marginTop: 10}}>
                    <TextInput 
                        placeholder="Critical"
                        keyboardType = 'numeric'
                        placeholderTextColor={"grey"}
                        style={{borderBottomColor: Colors.primaryColor, borderBottomWidth: 2, width: "17%", marginHorizontal: 10, height: "75%"}}
                        value={MainDefectExtent.critical}
                        // editable={false}
                        onChangeText = {(value) => {
                            var newMainDefectExtent = {"critical": value, "major": MainDefectExtent.major, "minor": MainDefectExtent.minor}
                            SetMainDefectExtent(newMainDefectExtent)
                        }}

                    /> 
                    <TextInput 
                        placeholder="Major"
                        keyboardType = 'numeric'
                        placeholderTextColor={"grey"}
                        style={{borderBottomColor: Colors.primaryColor, borderBottomWidth: 2, width: "17%", marginHorizontal: 10, height: "75%"}}
                        value={MainDefectExtent.major}
                        // editable={false}
                        onChangeText = {(value) => {
                            var newMainDefectExtent = {"critical": MainDefectExtent.critical, "major": value, "minor": MainDefectExtent.minor}
                            SetMainDefectExtent(newMainDefectExtent)
                        }}

                    /> 
                    <TextInput 
                        placeholder="Minor"
                        keyboardType = 'numeric'
                        placeholderTextColor={"grey"}
                        style={{borderBottomColor: Colors.primaryColor, borderBottomWidth: 2, width: "17%", marginHorizontal: 10, height: "75%"}}
                        value={MainDefectExtent.minor}
                        // editable={false}
                        onChangeText = {(value) => {
                            var newMainDefectExtent = {"critical": MainDefectExtent.critical,"major": MainDefectExtent.major, "minor": value}
                            SetMainDefectExtent(newMainDefectExtent)
                        }}
                    /> 

                    <TouchableHighlight
                        style={{ ...styles.openButton, backgroundColor: DisableMainMeasurement || SelectedOrderInfo.inspectionID != 0 ? "grey": Colors.primaryColor, marginHorizontal: 10, width: "20%"}}
                        disabled={SelectedOrderInfo.inspectionID != 0 || DisableMainMeasurement}
                        onPress={() => {
                            if(SampleSize == "")
                            {
                                Alert.alert("Please enter packed quantity and AQL Index first")
                                return
                            }
                            if(MainDefect == "")
                            {
                                Alert.alert("Please select a defect.")
                                return
                            }
                            if(MainDefectExtent.critical == "" && MainDefectExtent.minor == "" && MainDefectExtent.major == "")
                            {
                                Alert.alert("Enter atleast one defect")
                                return
                            }
                            for(const defectObj of CombinedDefectsList)
                            {   
                                console.log("######### here")
                                if(defectObj.defectsID == MainDefect.defectsID)
                                   {
                                    Alert.alert("Defect already selected! Please select another defect.")
                                    return
                                   }
                            }

                            var newMainDefectExtent = {...MainDefectExtent}
                            newMainDefectExtent["critical"] = newMainDefectExtent["critical"] != "" ? parseInt(newMainDefectExtent["critical"]) : 0
                            newMainDefectExtent["major"] = newMainDefectExtent["major"] != "" ? parseInt(newMainDefectExtent["major"]) : 0
                            newMainDefectExtent["minor"] = newMainDefectExtent["minor"] != "" ? parseInt(newMainDefectExtent["minor"]) : 0
                            
                            // console.log("###### Main defect extent #####")
                            // console.log(MainDefectExtent)
                            // console.log("###### new main defect extent ##############3")
                            // console.log(newMainDefectExtent)
                            newMainDefectExtent.major = newMainDefectExtent.major + (newMainDefectExtent.minor - newMainDefectExtent.minor % parseInt(NestedAqlObject.minorToMajorValue))/parseInt(NestedAqlObject.minorToMajorValue)
                            newMainDefectExtent.minor = newMainDefectExtent.minor % parseInt(NestedAqlObject.minorToMajorValue)
                            
                            if(MainDefectExtent.minor != newMainDefectExtent.minor)
                                Alert.alert(`${MainDefectExtent.minor} minor defects equivalent to ${newMainDefectExtent.major - MainDefectExtent.major} major and ${newMainDefectExtent.minor} minor defects`)
                            
                            SetMainDefectExtent(newMainDefectExtent)

                            var defectObject = {
                                "defectsID": MainDefect.id,
                                'defectsName': MainDefect.defectsName,
                                "majorDefectCount": newMainDefectExtent.major,
                                "minorDefectCount": newMainDefectExtent.minor,
                                "criticalDefectCount": newMainDefectExtent.critical,
                                "defectType": "main",
                                "measurementValue": "",
                                "miscellaneousValue": "",
                                "imageNames": [
                                ],
                                "imageUris":[

                                ]
                              }
                           

                            console.log("######### New Added defect object ##############")
                            SetCombinedDefectsList(CombinedDefectsList.concat([defectObject]))
                            UpdateDefectsSummary(defectObject, "add")
                            // props.navigation.setParams({requestBody: requestBody})

                            SetMainDefectExtent({"critical": "", "major": "", "minor": ""})
                            
                            console.log(defectObject)
                            
                        }}
                        
                    >
                       <Text style={{...styles.textStyle, color: Colors.accentColor}}>Add</Text>

                   </TouchableHighlight>

                </View>

                <View id ="MainDefetctsTable" style={{marginVertical: 10, width: "90%", marginLeft: "1%"}}>
                    {(() => {
                        if(CombinedDefectsList.filter((item) => {return item.defectType == "main"}).length != 0)
                            return (<View style={{flexDirection: "row", height: 35, backgroundColor: Colors.primaryColor, justifyContent: "flex-start", alignItems: "center", borderRadius: 5}}>
                                        <Text style={{marginHorizontal: "7%", fontSize: 10, fontWeight: "bold", color: "white"}}>Defect</Text>
                                        <Text style={{marginHorizontal: "3%", fontSize: 10, fontWeight: "bold", color: "white"}}>Critical</Text>
                                        <Text style={{marginHorizontal: "5%", fontSize: 10, fontWeight: "bold", color: "white"}}>Major</Text>
                                        <Text style={{marginHorizontal: "3%", fontSize: 10, fontWeight: "bold", color: "white"}}>Minor</Text>
                            </View>)
                    })()}
                    <FlatList 
                        data={CombinedDefectsList.filter((item) => {
                            return item.defectType == "main"
                        })}
                        keyExtractor={(DefectObject) => DefectObject.defectsID != null ? DefectObject.defectsID.toString() : "Defect Id coming null"}
                        style={{}}
                        renderItem = {({item}) => {
                        return (
                            <View style={{flexDirection: "row", alignContent: "center", alignItems: "center",  height: 35, borderWidth: 1, justifyContent: "flex-start", borderRadius: 5}}>
                                <Text  numberOfLines={2} style={{marginHorizontal: "1%", fontSize: 10, fontWeight: "bold", color: "grey", textAlign: 'center', width: "25%"}}>{item.defectsName}</Text>
                                <Text style={{marginHorizontal: "7%", fontSize: 10, fontWeight: "bold", color: "grey"}}>{item.criticalDefectCount!=null &&  item.criticalDefectCount!=""? item.criticalDefectCount: 0}</Text>
                                <Text style={{marginHorizontal: "5%", fontSize: 10, fontWeight: "bold", color: "grey"}}>{item.majorDefectCount!=null && item.majorDefectCount!="" ? item.majorDefectCount: 0}</Text>
                                <Text style={{marginLeft: "7%", fontSize: 10, fontWeight: "bold", color: "grey"}}>{item.minorDefectCount!=null && item.minorDefectCount!=""? item.minorDefectCount: 0}</Text>
                                <TouchableHighlight
                                    //style={{ ...styles.openButton, backgroundColor: "white", borderColor: Colors.primaryColor, borderWidth: 3, marginHorizontal: 10, width: "20%", marginVertical: 5, justifyContent: "center", alignContent: "center"}}
                                    style={{marginLeft: "5%", justifyContent: "center", marginHorizontal: 10, marginVertical: 5, width: "20%", alignItems: "center"}}
                                    onPress={() => {
                                        // SetCurrentDefectObject(item)
                                        if(item.imageUris.length == 0)
                                            {
                                                Alert.alert(
                        
                                                    'Image Source',
                                                    'Select the source of Image',
                                                    [
                                                      {
                                                        text: 'Camera',
                                                        onPress: () => __startCamera(item),
                                         
                                                      },
                                                      {
                                                        text: 'Gallery', 
                                                        onPress: () => openImagePickerAsync(item)
                                                      },
                                                    ],
                                                    {cancelable: true},
                                                  )
                                            }
                                        else{
                                            SetCurrentSelectedDefectObjectForImageInput(item)
                                            SetImageModalVisibility(true)
                                        }

                                        // props.navigation.setParams({requestBody: requestBody})

                                    }}
                                >
                                    {/* <Text style={{fontSize: 15, fontWeight: "bold", color: "grey"}}>Img{item.imageNames.length!=0 ? `(${item.imageNames.length.toString()})` : ""}</Text> */}
                                    <View id="Image icon" style={{flexDirection: "row", justifyContent: "flex-start"}}>
                                        <Icon
                                            name='ios-camera'
                                            type='ionicon'
                                            color={Colors.primaryColor}
                                            size={30}
                                        />
                                        {(() => {
                                            if(item.imageNames.length!=0)
                                            return(
                                                <View style={{alignSelf: "flex-start", backgroundColor: "red", borderRadius: 10}}>
                                                    <Text style={{paddingHorizontal:3,  color: "white", fontSize: 10, fontWeight:"bold"}}>{item.imageNames.length}</Text>
                                                </View>
                                            )
                                        })()}
                                    </View>
                                    
                                </TouchableHighlight>
                                <TouchableOpacity
                                    style={{backgroundColor: Colors.accentColor, marginRight: 2, width: 20, alignItems: "center", borderRadius: 10, justifyContent: "center"}}
                                    onPress={() => {
                                        const newCombineddefectsList = []
                                        console.log(" #### Combined defect list before deletion #####")
                                        console.log(CombinedDefectsList)
                                        for(const defectObj of CombinedDefectsList)
                                        {   
                                            if(defectObj.defectsID != item.defectsID)
                                                 newCombineddefectsList.push(defectObj)
                                            else
                                                UpdateDefectsSummary(defectObj, "delete")
                                        }
                                        console.log(" #### Combined defect list adter deletion #####")
                                        console.log(newCombineddefectsList)
                                        SetCombinedDefectsList(newCombineddefectsList)
                                        // Alert.alert("Defect deleted !!!")
                                        // props.navigation.setParams({requestBody: requestBody})
                                        
                                    }}
                                    disabled={SelectedOrderInfo.inspectionID != 0}
                                >
                                    <Text style={{color: "white", fontSize: 15}}>X</Text>
                                </TouchableOpacity>
                            </View>
                        )}}

                    />
                </View>

            </View>


 
            <View id="MeasurementDefect" style={{borderColor: Colors.primaryColor, borderWidth: 1 , marginVertical: 20, alignItems: "center"}}>

            <TextInput
                // style= {{marginLeft: 4, color: Colors.primaryColor}}
        
                style={{...styles.input, width: Dimensions.get("window").width / 1.2, height: 50, marginTop:25}}
                placeholder="Measurement Defect"

                
                // keyboardType = {item.fieldType == 'numeric'}
                placeholderTextColor={"grey"}
                maxLength={50}
                editable={SelectedOrderInfo.inspectionID == 0}
                // onBlur={Keyboard.dismiss}
                value={MeasurementDefect}
                onChangeText = {(newChangedText) => {SetMeasurementDefect(newChangedText)}}
            />

                <View id="MeasurementDefectExtent" style={{flexDirection: "row", alignSelf: "center", marginTop: 10}}>
                    <TextInput 
                        placeholder="Critical"
                        keyboardType = 'numeric'
                        placeholderTextColor={"grey"}
                        style={{borderBottomColor: Colors.primaryColor, borderBottomWidth: 2, marginHorizontal: 10, width: "17%", height: "75%"}}
                        value={MeasurementDefectExtent.critical}
                        onChangeText = {(value) => {
                            var newMeasurementDefectExtent = {"critical": value, "major": MeasurementDefectExtent.major, "minor": MeasurementDefectExtent.minor}
                            SetMeasurementDefectExtent(newMeasurementDefectExtent)
                        }}
                        

                    />
                    <TextInput 
                        placeholder="Major"
                        keyboardType = 'numeric'
                        placeholderTextColor={"grey"}
                        style={{borderBottomColor: Colors.primaryColor, borderBottomWidth: 2, width: "17%", marginHorizontal: 10, height: "75%"}}
                        value={MeasurementDefectExtent.major}
                        // editable={false}
                        onChangeText = {(value) => {
                            var newMeasurementDefectExtent = {"critical": MeasurementDefectExtent.critical, "major": value, "minor": MeasurementDefectExtent.minor}
                            SetMeasurementDefectExtent(newMeasurementDefectExtent)
                        }}

                    /> 
                    <TextInput 
                        placeholder="Minor"
                        keyboardType = 'numeric'
                        placeholderTextColor={"grey"}
                        style={{borderBottomColor: Colors.primaryColor, borderBottomWidth: 2, width: "17%", marginHorizontal: 10, height: "75%"}}
                        value={MeasurementDefectExtent.minor}
                        // editable={false}
                        onChangeText = {(value) => {
                            var newMeasurementDefectExtent = {"critical": MeasurementDefectExtent.critical, "major": MeasurementDefectExtent.major, "minor": value}
                            SetMeasurementDefectExtent(newMeasurementDefectExtent)
                        }}
                    /> 

                    <TouchableHighlight
                        style={{ ...styles.openButton, backgroundColor: DisableMainMeasurement || SelectedOrderInfo.inspectionID != 0 ? "grey": Colors.primaryColor, marginHorizontal: 10, width: "20%"}}
                        disabled={SelectedOrderInfo.inspectionID != 0 || DisableMainMeasurement}
                        onPress={() => {
                            if(SampleSize == "")
                            {
                                Alert.alert("Please enter packed quantity alongside AQL Index")
                                return
                            }
                            if(MeasurementDefect == "")
                            {
                                Alert.alert("Defect field cannot be empty")
                                return
                            }
                            if(MeasurementDefectExtent.critical == "" && MeasurementDefectExtent.minor == "" && MeasurementDefectExtent.major == "")
                            {
                                Alert.alert("Enter atleast one defect")
                                return
                            }
                            for(const defectObj of CombinedDefectsList)
                            {   
                                console.log("######### here")
                                if(defectObj.defectsID == MeasurementDefect.toLowerCase())
                                   {
                                    Alert.alert("Defect already entered! Please enter another defect.")
                                    return
                                   }
                            }

                            var newMeasurementDefectExtent = {...MeasurementDefectExtent}
                            newMeasurementDefectExtent["critical"] = newMeasurementDefectExtent["critical"] != "" ? parseInt(newMeasurementDefectExtent["critical"]) : 0
                            newMeasurementDefectExtent["major"] = newMeasurementDefectExtent["major"] != "" ? parseInt(newMeasurementDefectExtent["major"]) : 0
                            newMeasurementDefectExtent["minor"] = newMeasurementDefectExtent["minor"] != "" ? parseInt(newMeasurementDefectExtent["minor"]) : 0
                            
                            // console.log("###### Main defect extent #####")
                            // console.log(MainDefectExtent)
                            // console.log("###### new main defect extent ##############3")
                            // console.log(newMainDefectExtent)
                            newMeasurementDefectExtent.major = newMeasurementDefectExtent.major + (newMeasurementDefectExtent.minor - newMeasurementDefectExtent.minor % parseInt(NestedAqlObject.minorToMajorValue))/parseInt(NestedAqlObject.minorToMajorValue)
                            newMeasurementDefectExtent.minor = newMeasurementDefectExtent.minor % parseInt(NestedAqlObject.minorToMajorValue)
                            
                            if(MeasurementDefectExtent.minor != newMeasurementDefectExtent.minor)
                                Alert.alert(`${MeasurementDefectExtent.minor} minor defects equivalent to ${newMeasurementDefectExtent.major - MeasurementDefectExtent.major} major and ${newMeasurementDefectExtent.minor} minor defects`)
                            
                            SetMeasurementDefectExtent(newMeasurementDefectExtent)

                            var defectObject = {
                                "defectsID": 0,
                                "objectID": MeasurementDefect.toLowerCase(),
                                'defectsName': MeasurementDefect,
                                "majorDefectCount": newMeasurementDefectExtent.major,
                                "minorDefectCount": newMeasurementDefectExtent.minor,
                                "criticalDefectCount": newMeasurementDefectExtent.critical,
                                "defectType": "measurement",
                                "measurementValue": MeasurementDefect,
                                "miscellaneousValue": "",
                                "imageNames": [
                                ],
                                "imageUris":[

                                ]
                              }
                           

                            console.log("######### New Added defect object ##############")
                            SetCombinedDefectsList(CombinedDefectsList.concat([defectObject]))
                            UpdateDefectsSummary(defectObject, "add")
                            // props.navigation.setParams({requestBody: requestBody})
                            SetMeasurementDefect("")
                            SetMeasurementDefectExtent({"critical": "", "major": "", "minor": ""})
                            
                            console.log(defectObject)
                            
                        }}
                    >
                       <Text style={{...styles.textStyle, color: Colors.accentColor}}>Add</Text>

                   </TouchableHighlight>

                </View>


                <View id ="MeasurementDefetctsTable" style={{marginVertical: 10, width: "90%", marginLeft: "1%"}}>
                    {(() => {
                        if(CombinedDefectsList.filter((item) => {return item.defectType == "measurement"}).length != 0)
                            return (<View style={{flexDirection: "row", height: 35, backgroundColor: Colors.primaryColor, justifyContent: "flex-start", alignItems: "center", borderRadius: 5}}>
                                        <Text style={{marginHorizontal: "7%", fontSize: 10, fontWeight: "bold", color: "white"}}>Defect</Text>
                                        <Text style={{marginHorizontal: "3%", fontSize: 10, fontWeight: "bold", color: "white"}}>Critical</Text>
                                        <Text style={{marginHorizontal: "5%", fontSize: 10, fontWeight: "bold", color: "white"}}>Major</Text>
                                        <Text style={{marginHorizontal: "3%", fontSize: 10, fontWeight: "bold", color: "white"}}>Minor</Text>
                            </View>)
                    })()}
                    <FlatList 
                        data={CombinedDefectsList.filter((item) => {
                            return item.defectType == "measurement"
                        })}
                        keyExtractor={(DefectObject) => DefectObject.objectID != null ? DefectObject.objectID.toString() : "Defect Id coming null"}
                        style={{}}
                        renderItem = {({item}) => {
                        return (
                            <View style={{flexDirection: "row", alignContent: "center", alignItems: "center",  height: 35, borderWidth: 1, justifyContent: "flex-start", borderRadius: 5}}>
                                <Text  numberOfLines={2} style={{marginHorizontal: "1%", fontSize: 10, fontWeight: "bold", color: "grey", textAlign: 'center', width: "25%"}}>{item.defectsName}</Text>
                                <Text style={{marginHorizontal: "7%", fontSize: 10, fontWeight: "bold", color: "grey"}}>{item.criticalDefectCount!=null &&  item.criticalDefectCount!=""? item.criticalDefectCount: 0}</Text>
                                <Text style={{marginHorizontal: "5%", fontSize: 10, fontWeight: "bold", color: "grey"}}>{item.majorDefectCount!=null && item.majorDefectCount!="" ? item.majorDefectCount: 0}</Text>
                                <Text style={{marginLeft: "7%", fontSize: 10, fontWeight: "bold", color: "grey"}}>{item.minorDefectCount!=null && item.minorDefectCount!=""? item.minorDefectCount: 0}</Text>
                                <TouchableHighlight
                                    //style={{ ...styles.openButton, backgroundColor: "white", borderColor: Colors.primaryColor, borderWidth: 3, marginHorizontal: 10, width: "20%", marginVertical: 5, justifyContent: "center", alignContent: "center"}}
                                    style={{marginLeft: "5%", justifyContent: "center", marginHorizontal: 10, marginVertical: 5, width: "20%", alignItems: "center"}}
                                    onPress={() => {
                                        if(item.imageUris.length == 0)
                                        {
                                            Alert.alert(
                        
                                                'Image Source',
                                                'Select the source of Image',
                                                [
                                                  {
                                                    text: 'Camera',
                                                    onPress: () => __startCamera(item),
                                     
                                                  },
                                                  {
                                                    text: 'Gallery', 
                                                    onPress: () => openImagePickerAsync(item)
                                                  },
                                                ],
                                                {cancelable: true},
                                              )
                                        }
                                        else{
                                            SetCurrentSelectedDefectObjectForImageInput(item)
                                            SetImageModalVisibility(true)
                                        }
                                        // props.navigation.setParams({requestBody: requestBody})
                                    }}
                                >
                                    {/* <Text style={{fontSize: 15, fontWeight: "bold", color: "grey"}}>Img{item.imageNames.length!=0 ? `(${item.imageNames.length.toString()})` : ""}</Text> */}
                                    <View id="Image icon measurement" style={{flexDirection: "row"}}>
                                        <Icon
                                            name='ios-camera'
                                            type='ionicon'
                                            color={Colors.primaryColor}
                                            size={30}
                                        />
                                        {(() => {
                                            if(item.imageNames.length!=0)
                                            return(
                                                <View style={{alignSelf: "flex-start", backgroundColor: "red", borderRadius: 10}}>
                                                    <Text style={{paddingHorizontal:3,  color: "white", fontSize: 10, fontWeight:"bold"}}>{item.imageNames.length}</Text>
                                                </View>
                                            )
                                        })()}
                                    </View>
                                    
                                </TouchableHighlight>
                                <TouchableOpacity
                                    style={{backgroundColor: Colors.accentColor, marginRight: 2, width: 20, alignItems: "center", borderRadius: 10, justifyContent: "center"}}
                                    onPress={() => {
                                        const newCombineddefectsList = []
                                        console.log(" #### Combined defect list before deletion #####")
                                        console.log(CombinedDefectsList)
                                        for(const defectObj of CombinedDefectsList)
                                        {   
                                            if(defectObj.objectID != item.objectID)
                                                 newCombineddefectsList.push(defectObj)
                                            else
                                                 UpdateDefectsSummary(defectObj, "delete")
                                        }
                                        console.log(" #### Combined defect list adter deletion #####")
                                        console.log(newCombineddefectsList)
                                        SetCombinedDefectsList(newCombineddefectsList)
                                        // Alert.alert("Defect deleted !!!")
                                        // props.navigation.setParams({requestBody: requestBody})
                                        
                                    }}
                                >
                                    <Text style={{color: "white", fontSize: 15}}>X</Text>
                                </TouchableOpacity>
                            </View>
                        )}}

                    />
                </View>

            </View>

            <View id="Missellaneous Defect" style={{borderColor: Colors.primaryColor, borderWidth: 1 , marginBottom: 10, alignItems: "center"}}>

            <TextInput
                // style= {{marginLeft: 4, color: Colors.primaryColor}}
                id="Missellaneous defect text input"
                style={{...styles.input, width: Dimensions.get("window").width / 1.2, height: 50, marginTop:25}}
                placeholder="Miscellaneous Defect"
                
                // keyboardType = {item.fieldType == 'numeric'}
                placeholderTextColor={"grey"}
                maxLength={50}
                editable={SelectedOrderInfo.inspectionID == 0}
                // onBlur={Keyboard.dismiss}
                value={MissellaneousDefect}
                onChangeText = {(newChangedText) => {SetMissellaneousDefect(newChangedText)}}
            />

            <View id="MissellaneousDefectExtent" style={{flexDirection: "row", alignSelf: "center", marginTop: 10}}>
                <TextInput 
                    placeholder="Critical"
                    keyboardType = 'numeric'
                    placeholderTextColor={"grey"}
                    style={{borderBottomColor: Colors.primaryColor, borderBottomWidth: 2, marginHorizontal: 10, width: "17%", height: "75%"}}
                    value={MissDefectExtent.critical}
                    onChangeText = {(value) => {
                        var newMissDefectExtent = {"critical": value, "major": MissDefectExtent.major, "minor": MissDefectExtent.minor}
                        SetMissDefectExtent(newMissDefectExtent)
                    }}
                   

            />
            <TextInput 
                placeholder="Major"
                keyboardType = 'numeric'
                placeholderTextColor={"grey"}
                style={{borderBottomColor: Colors.primaryColor, borderBottomWidth: 2, width: "17%", marginHorizontal: 10, height: "75%"}}
                value={MissDefectExtent.major}
                // editable={false}
                onChangeText = {(value) => {
                    var newMissDefectExtent = {"critical": MissDefectExtent.critical, "major": value, "minor": MissDefectExtent.minor}
                    SetMissDefectExtent(newMissDefectExtent)
                }}

            /> 
            <TextInput 
                placeholder="Minor"
                keyboardType = 'numeric'
                placeholderTextColor={"grey"}
                style={{borderBottomColor: Colors.primaryColor, borderBottomWidth: 2, width: "17%", marginHorizontal: 10, height: "75%"}}
                value={MissDefectExtent.minor}
                // editable={false}
                onChangeText = {(value) => {
                    var newMissDefectExtent = {"critical": MissDefectExtent.critical,"major": MissDefectExtent.major, "minor": value}
                    SetMissDefectExtent(newMissDefectExtent)
                }}
            /> 

            <TouchableHighlight
                style={{ ...styles.openButton, backgroundColor: SelectedOrderInfo.inspectionID == 0 ? Colors.primaryColor: "grey", marginHorizontal: 10, width: "20%"}}
                disabled={SelectedOrderInfo.inspectionID != 0}
                onPress={() => {
                    // if(SampleSize == "")
                    // {
                    //     Alert.alert("Please select AQL Index first")
                    //     return
                    // }
                    if(MissellaneousDefect == "")
                    {
                        Alert.alert("Defect input field cannot be empty")
                        return
                    }
                    if(MissDefectExtent.critical == "" && MissDefectExtent.minor == "" && MissDefectExtent.major == "")
                    {
                        Alert.alert("Enter atleast one defect")
                        return
                    }
                
                    for(const defectObj of CombinedDefectsList)
                    {   
                        console.log("######### here")
                        if(defectObj.defectsID == MissellaneousDefect.toLowerCase())
                        {
                            Alert.alert("Defect already entered! Please enter another defect.")
                            return
                        }
                    }

                    var newMissDefectExtent = {...MissDefectExtent}
                    newMissDefectExtent["critical"] = newMissDefectExtent["critical"] != "" ? parseInt(newMissDefectExtent["critical"]) : 0
                    newMissDefectExtent["major"] = newMissDefectExtent["major"] != "" ? parseInt(newMissDefectExtent["major"]) : 0
                    newMissDefectExtent["minor"] = newMissDefectExtent["minor"] != "" ? parseInt(newMissDefectExtent["minor"]) : 0
                    
                    // console.log("###### Main defect extent #####")
                    // console.log(MainDefectExtent)
                    // console.log("###### new main defect extent ##############3")
                    // console.log(newMainDefectExtent)
                    newMissDefectExtent.major = newMissDefectExtent.major + (newMissDefectExtent.minor - newMissDefectExtent.minor % parseInt(NestedAqlObject.minorToMajorValue))/parseInt(NestedAqlObject.minorToMajorValue)
                    newMissDefectExtent.minor = newMissDefectExtent.minor % parseInt(NestedAqlObject.minorToMajorValue)
                    
                    if(MissDefectExtent.minor != newMissDefectExtent.minor)
                        Alert.alert(`${MissDefectExtent.minor} minor defects equivalent to ${newMissDefectExtent.major - MainDefectExtent.major} major and ${newMissDefectExtent.minor} minor defects`)
                    
                    SetMissDefectExtent(newMissDefectExtent)

                    var defectObject = {
                        "defectsID": 0,
                        "objectID": MissellaneousDefect.toLowerCase(),
                        'defectsName': MissellaneousDefect,
                        "majorDefectCount": newMissDefectExtent.major,
                        "minorDefectCount": newMissDefectExtent.minor,
                        "criticalDefectCount": newMissDefectExtent.critical,
                        "defectType": "miscellaneous",
                        "measurementValue": "",
                        "miscellaneousValue": MissellaneousDefect,
                        "imageNames": [
                        ],
                        "imageUris":[

                        ]
                    }
                

                    console.log("######### New Added defect object ##############")
                    SetCombinedDefectsList(CombinedDefectsList.concat([defectObject]))
                    UpdateDefectsSummary(defectObject, "add", true)
                    // props.navigation.setParams({requestBody: requestBody})
                    SetMissellaneousDefect("")
                    SetMissDefectExtent({"critical": "", "major": "", "minor": ""})
                    
                    console.log(defectObject)
                    
                }}
                
            >
                <Text style={{...styles.textStyle, color: Colors.accentColor}}>Add</Text>

            </TouchableHighlight>

        </View>

        <View id ="MissellaneousDefetctsTable" style={{marginVertical: 10, width: "90%", marginLeft: "1%"}}>
            {(() => {
                if(CombinedDefectsList.filter((item) => {return item.defectType == "miscellaneous"}).length != 0)
                    return (<View style={{flexDirection: "row", height: 35, backgroundColor: Colors.primaryColor, justifyContent: "flex-start", alignItems: "center", borderRadius: 5}}>
                                <Text style={{marginHorizontal: "7%", fontSize: 10, fontWeight: "bold", color: "white"}}>Defect</Text>
                                <Text style={{marginHorizontal: "3%", fontSize: 10, fontWeight: "bold", color: "white"}}>Critical</Text>
                                <Text style={{marginHorizontal: "5%", fontSize: 10, fontWeight: "bold", color: "white"}}>Major</Text>
                                <Text style={{marginHorizontal: "3%", fontSize: 10, fontWeight: "bold", color: "white"}}>Minor</Text>
                    </View>)
            })()}
            <FlatList 
                data={CombinedDefectsList.filter((item) => {
                    return item.defectType == "miscellaneous"
                })}
                keyExtractor={(DefectObject) => DefectObject.objectID != null ? DefectObject.objectID.toString() : "Defect Id coming null"}
                style={{}}
                renderItem = {({item}) => {
                return (
                    <View style={{flexDirection: "row", alignContent: "center", alignItems: "center",  height: 35, borderWidth: 1, justifyContent: "flex-start", borderRadius: 5}}>
                        <Text  numberOfLines={2} style={{marginHorizontal: "1%", fontSize: 10, fontWeight: "bold", color: "grey", textAlign: 'center', width: "25%"}}>{item.defectsName}</Text>
                        <Text style={{marginHorizontal: "7%", fontSize: 10, fontWeight: "bold", color: "grey"}}>{item.criticalDefectCount!=null &&  item.criticalDefectCount!=""? item.criticalDefectCount: 0}</Text>
                        <Text style={{marginHorizontal: "5%", fontSize: 10, fontWeight: "bold", color: "grey"}}>{item.majorDefectCount!=null && item.majorDefectCount!="" ? item.majorDefectCount: 0}</Text>
                        <Text style={{marginLeft: "7%", fontSize: 10, fontWeight: "bold", color: "grey"}}>{item.minorDefectCount!=null && item.minorDefectCount!=""? item.minorDefectCount: 0}</Text>
                        <TouchableHighlight
                            //style={{ ...styles.openButton, backgroundColor: "white", borderColor: Colors.primaryColor, borderWidth: 3, marginHorizontal: 10, width: "20%", marginVertical: 5, justifyContent: "center", alignContent: "center"}}
                            style={{marginLeft: "5%", justifyContent: "center", marginHorizontal: 10, marginVertical: 5, width: "20%", alignItems: "center"}}
                            onPress={() => {  
                                if(item.imageUris.length == 0)
                                {
                                    Alert.alert(
                        
                                        'Image Source',
                                        'Select the source of Image',
                                        [
                                          {
                                            text: 'Camera',
                                            onPress: () => __startCamera(item),
                             
                                          },
                                          {
                                            text: 'Gallery', 
                                            onPress: () => openImagePickerAsync(item)
                                          },
                                        ],
                                        {cancelable: true},
                                      )
                                      // openImagePickerAsync(item)
                                    
                                }
                                    
                                else{
                                    SetCurrentSelectedDefectObjectForImageInput(item)
                                    SetImageModalVisibility(true)
                                }
                                // props.navigation.setParams({requestBody: requestBody})
                            }}
                        >
                            {/* <Text style={{fontSize: 15, fontWeight: "bold", color: "grey"}}>Img{item.imageNames.length!=0 ? `(${item.imageNames.length.toString()})` : ""}</Text> */}
                                <View id="Image icon misclaneous" style={{flexDirection: "row"}}>
                                        <Icon
                                            name='ios-camera'
                                            type='ionicon'
                                            color={Colors.primaryColor}
                                            size={30}
                                        />
                                        {(() => {
                                            if(item.imageNames.length!=0)
                                            return(
                                                <View style={{alignSelf: "flex-start", backgroundColor: "red", borderRadius: 10}}>
                                                    <Text style={{paddingHorizontal:3,  color: "white", fontSize: 10, fontWeight:"bold"}}>{item.imageNames.length}</Text>
                                                </View>
                                            )
                                        })()}
                                </View>
                       
                        </TouchableHighlight>
                        <TouchableOpacity
                            style={{backgroundColor: Colors.accentColor, marginRight: 2, width: 20, alignItems: "center", borderRadius: 10, justifyContent: "center"}}
                            onPress={() => {
                                const newCombineddefectsList = []
                                console.log(" #### Combined defect list before deletion #####")
                                console.log(CombinedDefectsList)
                                for(const defectObj of CombinedDefectsList)
                                {   
                                    if(defectObj.objectID != item.objectID)
                                        newCombineddefectsList.push(defectObj)
                                    else
                                        UpdateDefectsSummary(defectObj, "delete")
                                }
                                console.log(" #### Combined defect list adter deletion #####")
                                console.log(newCombineddefectsList)
                                SetCombinedDefectsList(newCombineddefectsList)
                                // Alert.alert("Defect deleted !!!")
                                // props.navigation.setParams({requestBody: requestBody})
                                
                            }}
                            disabled={SelectedOrderInfo.inspectionID != 0}
                        >
                        <Text style={{color: "white", fontSize: 15}}>X</Text>
                    </TouchableOpacity>
                </View>
                )}}

                />
            </View>

        </View>

        
            <View id="DefectsSummary" style={{ borderColor: Colors.primaryColor, borderWidth: 1, marginTop: 10}}>
                <FlatList
                    data={Object.keys(DefectsSummary)}
                    keyExtractor={(textInputField) => textInputField}
                    style={{marginVertical: 15, elevation: 5}}
                    renderItem = {({item}) => {

                    return (
                        
                        <View style={{flexDirection: "row", alignContent: "center", alignItems: "center", justifyContent: "center", marginVertical: 5, borderWidth: 2, borderColor: "grey", marginHorizontal: 20, borderRadius: 8, backgroundColor: "#f0f8ff", height: 50}}>
                            <Text numberOfLines={1} style={{fontSize: 15, fontWeight: "bold", color: "grey", textAlign: "left", width: "55%"}}>{item}</Text>
                            <Text style= {{marginLeft: item == "Defect Rate" ? "12%": "18%" , color: Colors.primaryColor, fontSize: 20, fontWeight: "bold", color: "grey"}}>{item == "Defect Rate" ? DefectsSummary[item]+"%" : DefectsSummary[item]}</Text>
                
                        </View>

                       
                    )

                    }}
                />
            </View>
        </View>

        <TouchableOpacity
            style={{alignItems: "center", justifyContent: "center", borderColor: Colors.primaryColor, borderRadius: 5, borderWidth: 2, width: 80, height: 35, alignSelf: "center", marginVertical: 10}}
            onPress={() => {
                if(SampleSize == "")
                {
                    Alert.alert("Please select an AQL index")
                    return
                }
                if(OfferedQuantity == "")
                {
                    Alert.alert("Please enter an offer quantity")
                    return
                }
                if(IsPartInspection == "undecided")
                {
                    Alert.alert("Please specify an inspection type")
                    return
                }
                if(CartonSampleSize == "" || CartonSelected == "" || TotalCartons == "")
                {
                    Alert.alert("Please enter carton information")
                    return
                }
                props.navigation.navigate("InspectionResult", {InspectionEnteries: requestBody})
            }}
        >
            <Text style={{color: Colors.primaryColor, fontSize: 15, fontWeight: "bold"}}>{SelectedOrderInfo.inspectionID == 0 ? "Save": "Next"}</Text>
        </TouchableOpacity>

        </ScrollView>
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
            borderColor: Colors.primaryColor,
            padding: 3,
            marginTop: 12,
            color: Colors.primaryColor,
            fontSize: 20,
            fontWeight: "bold",
            borderRadius: 10,
            // width: Dimensions.get("window").width / 1.4,
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

        // labelStyle = {
        // position: 'absolute',
        // left: 0,
        // top: !isFocused ? 18 : 0,
        // // fontSize: !isFocused ? 20 : 14,
        // color: !isFocused ? '#aaa' : '#000',
        // }
    
})




  

InspectionForm.navigationOptions = (props) => {
    var requestObj = props.navigation.getParam("requestBody")
    
    return {
      
      headerTitle: "Inspection Form",

    //   headerRight: (
         
    //     <TouchableOpacity
    //      onPress={() => {
    //          props.navigation.navigate("InspectionResult", {InspectionEnteries: {}})
    //          console.log(props.navigation)
    //         }}
    //     >
    //         {/* <Text style={{color: Colors.accentColor, fontWeight: "bold"}}>{requestObj.inspectionID !=  0 ? "View": ""}</Text> */}
    //         <Text style={{color: Colors.accentColor, fontWeight: "bold"}}> View</Text>
    //     </TouchableOpacity>
    //   ),
      headerStyle: {
        backgroundColor: Colors.primaryColor,
      },
      headerTintColor: Colors.accentColor,
    };
  }

export default InspectionForm

