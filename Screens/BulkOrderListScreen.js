import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableHighlight,
  View,
  Keyboard,
  ActivityIndicator,
  SafeAreaView, Alert, Modal
} from "react-native";


import SearchableDropdown from 'react-native-searchable-dropdown'
// import { Dropdown } from 'react-native-material-dropdown'


import Colors from "../constants/colors"
import { Dimensions } from 'react-native';
import { TouchableOpacity } from "react-native";
import { FlatList } from "react-native";
import { SearchBar } from "react-native-elements"
import { AntDesign } from '@expo/vector-icons'
import DateTimePickerModal from "react-native-modal-datetime-picker"

import BulkOrderSuperItem from "../components/BulkOrderSuperItem"

import moment from "moment"

const screenHeight = Dimensions.get('window').height
const screenWidth = Dimensions.get('window').width

const BulkOrderListScreen = (props) => {

    const companyID = props.navigation.state.params.companyID
    const userID = props.navigation.state.params.userID
    const ApiUrl = "https://qualitylite.bluekaktus.com"

    // const ApiUrl = "http://c04dae122b77.ngrok.io"


    const [FactoryList, SetFactoryList] = useState([])
    const [BulkOrderList, SetBulkOrderList] = useState([])
    const [Factory, SetFactory] = useState("")
    const [Floor, SetFloor] = useState("")
    const [Line, SetLine] = useState("")
    const [SearchBarText, SetSearchBarText] = useState("")
    const [FilteredList, SetFilteredList] = useState([])
    const [FloorList, SetFloorList] = useState([])
    const [LineList, SetLineList] = useState([])
    const [AuditStatus, SetAuditStatus] = useState("new")
    const [OptionModalVisible, SetOptionModalVisible] = useState(false)
    const [Order, SetOrder] = useState({})
    const [ViewerAction, SetViewerAction] = useState({})
    // const [FilterDateObject, SetFilterDateObject] = useState("")
    const [ListLoaded, SetListLoaded] = useState(false)
    const [FromToFilterVisible, SetFromToFilterVisible] = useState(true)
    const [DatePickerModalVisible, SetDatePickerModalVisible] = useState(false)
    const [FromDateObject, SetFromDateObject] = useState("")
    const [ToDateObject, SetToDateObject] = useState({id: "5", name: moment().format("DD-MMM-YYYY"),  filterDate: moment().format("DD-MMM-YYYY h:mm:ss")})
    const [DateTypeSelected, SetDateTypeSelected] = useState("")


    const searchBarFilter = (text, SelectedAuditStatus = "new", list=BulkOrderList) => {

      const newFilteredList = list.filter((item) => {
        
        // console.log(`${item.brandName.toUpperCase()} ${item.styleNo.toUpperCase()} ${item.orderNo.toUpperCase()}`)
        // console.log(text.toUpperCase())
        // console.log(`${item.brandName.toUpperCase()} ${item.styleNo.toUpperCase()} ${item.orderNo.toUpperCase()}`.includes(text.toUpperCase()))

        return item.auditStatus.toLowerCase() == SelectedAuditStatus.toLowerCase() && `${item.brandName.toUpperCase()} ${item.styleNo.toUpperCase()} ${item.orderNo.toUpperCase()}`.includes(text.toUpperCase())
      })
      
        // console.log("############ Filter Object ############")
        // console.log(FilterDateObject)
        if(FromDateObject != "" && SelectedAuditStatus.toLowerCase() != "new")
          dateFilter(FromDateObject.filterDate, ToDateObject.filterDate , SelectedAuditStatus, newFilteredList)
        else
          SetFilteredList(newFilteredList)
    }

    const dateFilter = (fromDate, toDate, SelectedAuditStatus, list=BulkOrderList) => {
      // date = moment(date).format('DD-MMM-YYYY h:mm:ss')

      const newFilteredList = list.filter((item) => {
        
        // console.log(`Filter date: ${date}`)
        // console.log(`Current object date: ${item.inspectionOn}`)
        // console.log(`is current item valid: ${moment(item.inspectionOn).isAfter(moment(date))}`)
       
        return item.inspectionOn != "" && item.auditStatus.toLowerCase() == SelectedAuditStatus.toLowerCase() && moment(item.inspectionOn).isAfter(moment(fromDate)) && moment(item.inspectionOn).isBefore(moment(toDate))

        // return item.inspectionOn != "" && item.auditStatus.toLowerCase() == AuditStatus.toLowerCase() && moment(item.inspectionOn).isAfter(moment(date))
      })

      SetFilteredList(newFilteredList)
      
    }

    useEffect(() => {

        fetch(
          `${ApiUrl}/api/bkQuality/companyFactory/getAllfactoryDetails`,
          {
            method: "POST",
            body: JSON.stringify({
              basicparams: {
                companyID: companyID,
              //   userID: 13,
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
          // SetUserRoleList(body.result)
          var newFactoryList = []
          // console.log("############ Factory List ##########")
          
          body.result.forEach((factoryObject) => {
            const newFactoryObject = {id: factoryObject.factoryID, name: factoryObject.factoryName, ...factoryObject}
            newFactoryList.push(newFactoryObject)
          })
          // console.log(body.result)
          
          SetFactoryList(newFactoryList)
        })
        .catch((error) => console.log(error)); //to catch the errors if any
  
      }, [])

      useEffect(() => {

        fetch(
          `${ApiUrl}/api/bkQuality/auditing/getBOSCList`,
          {
            method: "POST",
            body: JSON.stringify({
              basicparams: {
                companyID: companyID,
                  userID: userID,
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
          // SetUserRoleList(body.result)
          var newBulkOrderList = []
          // console.log("############ Bulk Order List ##########")
          
          body.result.forEach((bulkOrderObject) => {
            var newBulkOrderObject = {...bulkOrderObject}
            newBulkOrderObject["objectId"] = newBulkOrderList.length
            newBulkOrderList.push(newBulkOrderObject)
          })
          // console.log(newBulkOrderList)
          
          SetBulkOrderList(newBulkOrderList)
          // SetFilteredList(newBulkOrderList)
          searchBarFilter("", "new", newBulkOrderList)
          SetListLoaded(true)
        })
        .catch((error) => console.log(error)); //to catch the errors if any
  
      }, [])


      return (
        <View style={{marginHorizontal: 10}}>

          <DateTimePickerModal
                  mode="date"
                  isVisible={DatePickerModalVisible}
                  // minimumDate={this.state.OrderDateY}
                  onConfirm={(date)=>{
                      
                    console.log(moment(date).format("DD-MMM-YYYY h:mm:ss"))
                    if(DateTypeSelected == "from")
                      {
                        const fromDateObject = {id: "4", name: moment(date).format("DD-MMM-YYYY"),  filterDate: moment(date).format("DD-MMM-YYYY h:mm:ss")}
                        SetFromDateObject(fromDateObject)
                        dateFilter(fromDateObject.filterDate, ToDateObject.filterDate, AuditStatus, BulkOrderList)

                      }
                    else if(DateTypeSelected == "to")
                    {
                      const toDateObject = {id: "5", name: moment(date).format("DD-MMM-YYYY"),  filterDate: moment(date).format("DD-MMM-YYYY h:mm:ss")}
                      SetToDateObject(toDateObject)
                      dateFilter(FromDateObject.filterDate, toDateObject.filterDate, AuditStatus,  BulkOrderList)
                    }

                    SetDatePickerModalVisible(false)
                  }}
                  onCancel={()=>{
                    SetDatePickerModalVisible(false)
                  }}
                />          
            
            <View style={{marginVertical: 5, justifyContent: "center", alignItems: "center",}}>
              <FlatList 
                data={[{id: "new", label: "New"}, {id: "passed", label: "Passed"}, {id: "failed", label: "Failed"},]}
                keyExtractor={(statusObject) => statusObject.id}
                contentContainerStyle={{flexDirection: "row"}}
                renderItem={({item}) => {
                  return (
                    <TouchableOpacity
                    style={{width: 80, height: 45, justifyContent: "center", alignItems: "center",borderRadius: 5,  backgroundColor: item.label.toLowerCase() == AuditStatus.toLowerCase() ? Colors.accentColor : Colors.primaryColor}}
                    onPress={() => {
                      SetAuditStatus(item.label)
                      searchBarFilter(SearchBarText, item.label)
                    }}
                  >
                    <Text style={{fontSize: 15, fontWeight: "bold", color: item.label.toLowerCase() == AuditStatus.toLowerCase() ? Colors.primaryColor :Colors.accentColor}}>{item.label}</Text>
                  </TouchableOpacity>
                  )
                }}
              />
            </View>
            {/* {(() => {
              if(AuditStatus.toLowerCase() != "new")
                return (
                  <TouchableOpacity
                    style={{alignSelf: "flex-end",}}
                    onPress={() => {

                    }}
                  >
                    <Text style={{color: "grey", fontWeight: "bold", fontSize: 15, marginHorizontal: 10}}>Filter</Text>
                  </TouchableOpacity>
                )
            })()} */}
            
            {(() => {
              if(AuditStatus.toLowerCase() == "new")
                return (
                  <View>
                    <Text style={{color: "grey", marginTop: 10}}>Location Information</Text>
                    <SearchableDropdown
                  //On text change listner on the searchable input
                  id="Factory"
                  onTextChange={(text) => console.log(text)}
                  onItemSelect={item => { 
                    SetFactory(item)
                    var newFloorList = []
                    item.locationgroups.forEach((FloorObject => {
                      newFloorList.push({"id": FloorObject.locationgroupID, "name": FloorObject.locationgroupName, "lines": FloorObject.lines})
                    }))

                    SetFloorList(newFloorList)

                  }}
                  selectedItems={Factory}
                  //onItemSelect called after the selection from the dropdown
                  containerStyle={{ padding: 8 ,width:Dimensions.get("window").width / 1.05 ,
                  borderWidth:3,
                  borderRadius:10,
                  borderColor:Colors.primaryColor,
                  marginTop: 10,
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
                  items={FactoryList}
                  //mapping of item array
                  //default selected item index
                  placeholder={"Select factory"}
                  placeholderTextColor="#00334e80"
                  //place holder for the search input
                  // resetValue={AuditStatus.toLowerCase() != "new"}
                  //reset textInput Value with true and false state
                  underlineColorAndroid="transparent"
                  //To remove the underline from the android input
                />
                  </View>
                )
              if(FromToFilterVisible)
                  return (
                    <View>
                          <View id="FromDate" style={Styles.date}>
                            <Text style={{fontSize: 10, fontWeight: "bold", color: "grey"}}>Inspection from</Text>
                            <View style={{flexDirection:"row", justifyContent:"space-between"}}>
                                {(() => {
                                  if(FromDateObject == "")
                                    return (
                                      <Text style={{color :"grey", fontSize: 20}}>Select a date</Text>
                                    )
                                  return (
                                    <Text style={{  marginRight:10,
                                      fontSize: 20,
                                      fontWeight: "bold",
                                      borderRadius: 10,
                                      color: Colors.primaryColor,
                                      width: Dimensions.get("window").width / 1.8
                                      }}>{FromDateObject.name}</Text>
                                  )
                                })()}
                                
                                <TouchableOpacity style={{alignContent:"space-between",width:"10%"}} onPress={()=>{
                                    // this.setState({OrderDatePickerVis:true})
                                    SetDateTypeSelected("from")
                                    SetDatePickerModalVisible(true)
                                }}>
                                    <AntDesign name="calendar" size={28} color={Colors.accentColor} />
                                </TouchableOpacity>
                            </View>
                          </View>

                          <View id="ToDate" style={Styles.date}>
                            <Text style={{fontSize: 10, fontWeight: "bold", color: "grey"}}>Inspection upto</Text>
                            <View style={{flexDirection:"row", justifyContent:"space-between"}}>
                                <Text style={{  marginRight:10,
                                        fontSize: 20,
                                        fontWeight: "bold",
                                        borderRadius: 10,
                                        color: Colors.primaryColor,
                                        width: Dimensions.get("window").width / 1.8
                                        }}>{ToDateObject.name}</Text>
                                <TouchableOpacity style={{alignContent:"space-between",width:"10%"}} onPress={()=>{
                                    // this.setState({OrderDatePickerVis:true})
                                    SetDateTypeSelected("to")
                                    SetDatePickerModalVisible(true)
                                }}>
                                    <AntDesign name="calendar" size={28} color={Colors.accentColor} />
                                </TouchableOpacity>
                            </View>
                          </View>
                    </View>
                  )
              // if(!FromToFilterVisible)
              // return (
              //   <View>
              //     <TouchableOpacity
              //       onPress={() => {
              //         SetFromToFilterVisible(true)
              //       }}
              //     >
              //       <Text style={{color: "grey", marginTop: 10}}>Detailed Datewise filter</Text>
              //     </TouchableOpacity>
                  
              //     <SearchableDropdown
              //   //On text change listner on the searchable input
              //       id="DateFilter"
              //       onTextChange={(text) => console.log(text)}
              //       onItemSelect={dateObject => { 
       
              //         dateFilter(dateObject.filterDate, ToDateObject.filterDate, BulkOrderList)
              //         console.log(dateObject)

              //       }}
              //       selectedItems={FromDateObject}
              //       //onItemSelect called after the selection from the dropdown
              //       containerStyle={{ padding: 8 ,width:Dimensions.get("window").width / 1.05 ,
              //       borderWidth:3,
              //       borderRadius:10,
              //       borderColor:Colors.primaryColor,
              //       marginTop: 10,
              //       }}
              //       //suggestion container style
              //       textInputStyle={{
              //         //inserted text style
              //         paddingLeft:10,
              //         fontSize: 20,
              //         fontWeight: "bold",
              //         color:Colors.primaryColor
          
              //       }}
              //       itemStyle={{
              //         //single dropdown item style
              //         padding: 3,
              //         marginLeft:5,
              //         width:Dimensions.get("window").width / 1.25 ,
              //         marginTop: 2,
              //         borderBottomColor:"#00334e80",
              //         borderBottomWidth: 1,
              //       }}
              //       itemTextStyle={{
              //         //text style of a single dropdown item
              //         fontSize: 18,
              //         fontWeight: "bold",
              //         color:Colors.primaryColor,
              //       }}
              //       itemsContainerStyle={{
              //         //items container style you can pass maxHeight
              //         //to restrict the items dropdown hieght
              //         maxHeight: '100%',
              //       }}
              //       items={[{"id": "1", "name": "Last 7 Days", "filterDate": moment().subtract(7,'d').format('DD-MMM-YYYY h:mm:ss')}, 
              //               {"id": "2", "name": "Last 14 Days", "filterDate": moment().subtract(14,'d').format('DD-MMM-YYYY h:mm:ss')}, 
              //               {"id": "3", "name": "Last month", "filterDate": moment().subtract(30,'d').format('DD-MMM-YYYY h:mm:ss')},]}
              //       //mapping of item array
              //       //default selected item index
              //       placeholder={"View inspection report for date"}
              //       placeholderTextColor="#00334e80"
              //       //place holder for the search input
                    
              //       //reset textInput Value with true and false state
              //       underlineColorAndroid="transparent"
              //       //To remove the underline from the android input
      
              //     />
              //   </View>
              // )
            })()}
            
            

            {/* {(() => {
              if(Factory != "" && AuditStatus.toLowerCase() == "new")
                return (
                  <SearchableDropdown
                      //On text change listner on the searchable input
                      id="Floor"
                      onTextChange={(text) => console.log(text)}
                      onItemSelect={item => { 
                        SetFloor(item)
                        var newLinesList = []
                        item.lines.forEach((LineObject) => {
                          newLinesList.push({"id": LineObject.lineID, "name": LineObject.lineName})
                        })
                        SetLineList(newLinesList)
                      }}
                      selectedItems={Floor}
                      //onItemSelect called after the selection from the dropdown
                      containerStyle={{ padding: 8 ,width:Dimensions.get("window").width / 1.05 ,
                      borderWidth:3,
                      borderRadius:10,
                      borderColor:Colors.primaryColor,
                      marginTop: 10,
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
                      items={FloorList}
                      //mapping of item array
                      //default selected item index
                      placeholder={"Select floor"}
                      placeholderTextColor="#00334e80"
                      //place holder for the search input
                      resetValue={false}
                      //reset textInput Value with true and false state
                      underlineColorAndroid="transparent"
                      //To remove the underline from the android input
                  />
                )
            })()}

              {(() => {
                if(Floor != "" && AuditStatus.toLowerCase() == "new")
                  return (
                    <SearchableDropdown
                        //On text change listner on the searchable input
                        id="Line"
                        onTextChange={(text) => console.log(text)}
                        onItemSelect={item => { SetLine(item)
                        }}
                        selectedItems={Line}
                        //onItemSelect called after the selection from the dropdown
                        containerStyle={{ padding: 8 ,width:Dimensions.get("window").width / 1.05 ,
                        borderWidth:3,
                        borderRadius:10,
                        borderColor:Colors.primaryColor,
                        marginTop: 10,
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
                        items={LineList}
                        //mapping of item array
                        //default selected item index
                        placeholder={"Select line"}
                        placeholderTextColor="#00334e80"
                        //place holder for the search input
                        resetValue={false}
                        //reset textInput Value with true and false state
                        underlineColorAndroid="transparent"
                        //To remove the underline from the android input
                    />
                  )
            })()} */}

            <View>

              <SearchBar
                placeholder="Search by order brand style or color"
                placeholderTextColor={Colors.primaryColor}
              
                containerStyle={{
                  backgroundColor: "#f6f5f5",
                  borderBottomColor: "transparent",
                  borderTopColor: "transparent",
                  
                }}
                inputContainerStyle={{
                  backgroundColor: "#b5b5b580",
                  marginHorizontal: -7,
                  marginVertical: 7,
                  width: Dimensions.get("window").width/1.06
                  
                }}
                editable={true}
                value={SearchBarText}
                onChangeText={(text) => {
                  SetSearchBarText(text)
                  searchBarFilter(text)
                }}
              />
              {/* height: 0.74*Dimensions.get("window").height, marginBottom: 5 */}
              {(() => {
                if(!ListLoaded)
                  return <View style = {{alignSelf: "center", alignItems: "center"}}><ActivityIndicator size="large" color={Colors.primaryColor} /></View>
              })()}

              <View id="Bulk order list" style={{backgroundColor: "#f0f8ff", height: AuditStatus.toLowerCase() == "new" ? 0.63*Dimensions.get("window").height : 0.55*Dimensions.get("window").height}}>
                
                <FlatList 
                    data={FilteredList}
                    keyExtractor={(BulkOrderData) => BulkOrderData.objectId.toString()}
                    // style={{marginBottom: 100}}
                    renderItem={({item}) => {

                      if(AuditStatus.toLowerCase() == "new")
                          return (
              
                          <TouchableOpacity
                            
                            onPress={() => {

                              // if(Line == "" && item.inspectionID == 0)
                              if(Factory == "" && item.inspectionID == 0)
                                {
                                  Alert.alert("Please select location information")
                                  return
                                }
                              var SelectedOrderInfo = {
                                orderInfo: {
                                  "companyID": companyID,
                                  "userID": userID,
                                  "brandID": item.brandID,
                                  "brandName": item.brandName,
                                  "orderID": item.orderID,
                                  "orderNo": item.orderNo,
                                  "styleID": item.styleID,
                                  "styleNo": item.styleNo,
                                  "colorID": item.colorID,
                                  "colorName": item.colorName,
                                  "orderQuantity": item.qty,
                                  // "lineID": Line.id,
                                  "factoryID": Factory.factoryID,
                                  "inspectionID": item.inspectionID,
                                  "auditStatus":item.auditStatus,
                                  "offerQtyMargin": item.offerQtyMargin,
                                  "doneQty": item.doneQty
        
                                }
                              }
                              SetOrder(SelectedOrderInfo)

                              if(item.inspectionID != 0)
                                SetOptionModalVisible(true)
                              else
                                props.navigation.navigate("InspectionForm", SelectedOrderInfo)

                            }}
                          
                          >

                            <BulkOrderSuperItem
                              brandName={item.brandName}
                              orderNo={item.orderNo}
                              orderQuantity={item.qty}
                              styleNo={item.styleNo}
                              brandID={item.brandID}
                              orderID={item.orderID}
                              styleID={item.styleID}
                              colorID={item.colorID}
                              colorName={item.colorName}
                              inspectionID={item.inspectionID}
                              inspectionBy={item.inspectionBy}
                              inspectionOn={item.inspectionOn}
                              doneQty={item.doneQty}
                              informer={(action) => {

                                var currentOrder = {
                                  orderInfo: {
                                    "companyID": companyID,
                                    "userID": userID,
                                    "brandID": item.brandID,
                                    "brandName": item.brandName,
                                    "orderID": item.orderID,
                                    "orderNo": item.orderNo,
                                    "styleID": item.styleID,
                                    "styleNo": item.styleNo,
                                    "colorID": item.colorID,
                                    "colorName": item.colorName,
                                    "orderQuantity": item.qty,
                                    // "lineID": Line.id,
                                    "factoryID": Factory.factoryID,
                                    "inspectionID": item.inspectionID,
                                    "auditStatus":item.auditStatus,
                                    "offerQtyMargin": item.offerQtyMargin
          
                                  }
                                }
                              }}
                            />
                          </TouchableOpacity>
                          )


                      return (
                        <BulkOrderSuperItem
                              brandName={item.brandName}
                              orderNo={item.orderNo}
                              orderQuantity={item.qty}
                              styleNo={item.styleNo}
                              brandID={item.brandID}
                              orderID={item.orderID}
                              styleID={item.styleID}
                              colorID={item.colorID}
                              colorName={item.colorName}
                              inspectionID={item.inspectionID}
                              inspectionBy={item.inspectionBy}
                              inspectionOn={item.inspectionOn}
                              doneQty={item.doneQty}
                              informer={(action) => {

                                var currentOrder = {
                                  orderInfo: {
                                    "companyID": companyID,
                                    "userID": userID,
                                    "brandID": item.brandID,
                                    "brandName": item.brandName,
                                    "orderID": item.orderID,
                                    "orderNo": item.orderNo,
                                    "styleID": item.styleID,
                                    "styleNo": item.styleNo,
                                    "colorID": item.colorID,
                                    "colorName": item.colorName,
                                    "orderQuantity": item.qty,
                                    // "lineID": Line.id,
                                    "factoryID": Factory.factoryID,
                                    "inspectionID": item.inspectionID,
                                    "auditStatus":item.auditStatus,
                                    "offerQtyMargin": item.offerQtyMargin,
                                    "inspectionOn": item.inspectionOn,
                                    "doneQty": item.doneQty
          
                                  }
                                }

                                if(action == "inspection")
                                  props.navigation.navigate("InspectionForm", props.navigation.navigate("InspectionForm", currentOrder))
                                else if(action == "report")
                                  {
                                    console.log("Will open pdf")

                                    fetch(
                                      `${ApiUrl}/api/bkQuality/auditing/getInspectionReport`,
                                      {
                                        method: "POST",
                                        body: JSON.stringify({
                                          basicparams: {
                                            companyID: companyID,
                                            userID: companyID,
                                            inspectionID: item.inspectionID
                                       
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
                                      console.log("########## PDF api response ##########")
                                      console.log(body)
                                      if(body == null)
                                      {
                                        Alert.alert("PDf report couldn't be generated")
                                        return
                                      }
                                      if(body.result == null)
                                      {
                                        Alert.alert(body.message)
                                        return
                                      }
                                      
                                      // makeDownload(body.pdf)
                                      props.navigation.navigate("PDFScreen", {url: body.pdf})
                                      
                                       
                                    })
                                    .catch((error) => {
                                      console.log("##### Error infetching from pdf api #############")
                                      Alert.alert("Pdf couldnot be fetched")
                                      console.log(error)
                                    }); //to catch the errors if any



                                    
                                    // props.navigation.navigate("PDFScreen", {url: "http://samples.leanpub.com/thereactnativebook-sample.pdf"} )
                                  }
                              }}
                            />
                      )
                    }}
                />

              </View>
            </View>  
        </View>

    )



}



const Styles = StyleSheet.create({
    input: {
        borderWidth: 3,
        paddingLeft: 20,
        borderColor: Colors.primaryColor,
        padding: 8,
        marginTop: 40,
        color: Colors.primaryColor,
        fontSize: 20,
        fontWeight: "bold",
        borderRadius: 10,
        width: Dimensions.get("window").width / 1.1,
    },

    date: {
      borderWidth: 3,
      paddingLeft: 20,
      marginTop:10,
      alignContent:"space-between",
      justifyContent:"space-between",
      padding: 8,
      borderColor:Colors.primaryColor,
      fontSize: 20,
      fontWeight: "bold",
      borderRadius: 10,
      // width: Dimensions.get("window").width / 1.1,
    },
    label: {
      backgroundColor: "#f6f5f5",
      justifyContent: "flex-start",
      color: "#00334e",
      fontSize: 15,
      fontWeight: "bold",
      width: Dimensions.get("window").width / 1.8,
    }
})

BulkOrderListScreen.navigationOptions = (navData) => {
  return {
    headerTitle: "Audit",
    headerStyle: {
      backgroundColor: Colors.primaryColor,
    },
    headerTintColor: Colors.accentColor,
  };
}

export default BulkOrderListScreen