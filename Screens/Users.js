import React, { useState, useEffect } from "react"
import { View, Text, Alert, TouchableHighlight, TouchableOpacity, FlatList, StyleSheet, Modal, TextInput, Picker , Keyboard, ScrollView, ActivityIndicator} from "react-native"
import { Dimensions } from 'react-native';
import { withOrientation } from "react-navigation";
import {Platform} from 'react-native'

import { CheckBox } from "react-native-elements"

import UserSuperItem from "../components/UserSuperItem"

import Colors from "../constants/colors"
import { SearchBar } from "react-native-elements"
import SearchableDropdown from 'react-native-searchable-dropdown'


const Users =  (props) => {
    // Send company ID in prop and then SetCompanyID(prop.companyID)
    const ApiUrl = "https://qualitylite.bluekaktus.com"


    const CompanyID = props.navigation.state.params.companyID
    // const CompanyID = props.navigation.state.params.companyID
    
    
    const screenHeight = Dimensions.get('window').height
    const screenWidth = Dimensions.get('window').width

    
    const [UserAdditionModalVisible, SetUserAdditionModalVisible] = useState(false)
    const [LocationModalVisible, SetLocationModalVisibility] = useState(false)
    const [UserFirstName, SetUserFirstName] = useState("")
    const [UserLastName, SetUserLastName] = useState("")
    const [EmailId, SetEmailId] = useState("")
    const [userID, SetUserId] = useState(EmailId)
    const [Phone, SetPhone] = useState("")
    const [Password, SetPassword] = useState("")
    const [ConfirmPassword, SetConfirmPassword] = useState("")
    const [ShowMessageModal, SetShowMessageModal] = useState(false)
    const [AlertMessage, SetAlterMessage] = useState("")
    const [UserRole, SetUserRole] = useState("")
    const [UserRoleList, SetUserRoleList] = useState([])
    const [Pickers, SetPickers] = useState([<Picker.Item label="Please select a user role" value={false} />])
    const [FactoryPickerList, SetFactoryPickerList] = useState([<Picker.Item label="Factory" value={false} />])
    const [FloorPickerList, SetFloorPickerList] = useState([<Picker.Item label="Select a floor" value={false} />])
    const [LinePickerList, SetLinePickerList] = useState([<Picker.Item label="Select a line" value={false} />])
    const [Factory, SetFactory] = useState("")
    const [Floor, SetFloor] = useState("")
    const [Line, SetLine] = useState("")
    const [FactoryList, SetFactoryList] = useState("")
    const [FloorList, SetFloorList] = useState("")
    const [LineList, SetLineList] = useState("")
    const [ShowLocationOptions, SetLicationOptionVisibility] = useState(false)
    const [TextFieldStatus, SetTextFieldStatus] = useState({"Name": true, "Email ID": true, "Contact": true, "Password": true, "Confirm Password": true})
    const [SearchBarText, SetSearchBarText] = useState("")
    const [EnableParentScroll, SetEnableParentScroll] =  useState(true)
    const [ListLoaded, SetListLoaded] = useState(false)
    const [UpdationMode, SetUpdationMode] = useState(false)
    
    

    const permissionNames = ["Edit Brand", "Edit Style", "Edit Size", "Edit Color", "Edit Company", "Edit Factory", "Edit Orders", "Edit Reports", "Edit Defects", "Edit Users"]
    const [permissions, SetPermissions] = useState({"Edit Brand": true, "Edit Style": true, "Edit Color": true, 
                                              "Edit Company": true, "Edit Factory": true, "Edit Size": true,
                                                "Edit Orders": true, "Edit Reports": true, "Edit Defects": true, "Edit Users": true})

    const textInputsList =[
      {
        fieldType: "Name",
        fieldValue: UserFirstName,
        setterFunction: SetUserFirstName,
      },

      {
        fieldType: "Last Name",
        fieldValue: UserLastName,
        setterFunction: SetUserLastName,
      },
      
      {
        fieldType: "Email ID",
        fieldValue: EmailId,
        setterFunction: SetEmailId,
      },

      {
        fieldType: "Contact",
        fieldValue: Phone,
        setterFunction: SetPhone,
      },

      {
        fieldType: "Password",
        fieldValue: Password,
        setterFunction: SetPassword,
      },

      {
        fieldType: "Confirm Password",
        fieldValue: ConfirmPassword,
        setterFunction: SetConfirmPassword,
      },

    ]
    const locationParams = ["factory", "floor", "line"]

    const [userList, SetUserList] = useState([])
    const [FilteredUserList, SetFilteredUserList] = useState([])

    const searchBarFilter = (searchtext) => {

      const newUserList = userList.filter((userObject) => {

        searchtext = searchtext.toUpperCase()
        const userName = (userObject.userFName+" "+userObject.userLname).toUpperCase()
        return userName.includes(searchtext)
      })

      SetFilteredUserList(newUserList)

    }

    useEffect(() => {

      fetch(
        `${ApiUrl}/api/bkquality/users/getUserList`,
        {
          method: "POST",
          body: JSON.stringify({
            basicparams: {
              companyID: CompanyID,
         
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
        console.log("########## User List ##########")
        console.log(body.result)
        var newUserList = []
        body.result.forEach((UserObject) => {
          UserObject["ObjectID"] = newUserList.length
          newUserList.push(UserObject)
        })
        SetUserList(newUserList)
        SetFilteredUserList(newUserList)
        SetListLoaded(true)
      })
      .catch((error) => console.log(error)); //to catch the errors if any

    }, [])

    useEffect(() => {

      fetch(
        `${ApiUrl}/api/bkquality/users/getUserRoles`,
        {
          method: "POST",
          body: JSON.stringify({
            basicparams: {
              companyID: CompanyID,
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
        SetUserRoleList(body.result)
        var newUserRoleList = []
        var newPickers = [<Picker.Item label="Please select a user role" value={false} />]
        body.result.forEach((roleObject) => {
          newPickers.push(<Picker.Item label={roleObject.userRoleDesc} value={roleObject.userRoleDesc+":"+roleObject.userRoleID} />)
          newUserRoleList.push({...roleObject, name: roleObject.userRoleDesc, id: roleObject.userRoleID})
        })
        SetPickers(newPickers)
        SetUserRoleList(newUserRoleList)
      })
      .catch((error) => console.log(error)); //to catch the errors if any

    }, [])

    useEffect(() => {

      fetch(
        `${ApiUrl}/api/bkQuality/companyFactory/getAllfactoryDetails`,
        {
          method: "POST",
          body: JSON.stringify({
            basicparams: {
              companyID: CompanyID,
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
        var newPickers = [<Picker.Item label={"Select a factory"} value={false} />]
        var newFactoryList = []
        console.log("############ Factory List ##########")
        console.log(body.result)
        body.result.forEach((factoryObject) => {
          newPickers.push(<Picker.Item label={factoryObject.factoryName.toUpperCase()} value={factoryObject} />)
          newFactoryList.push({...factoryObject, name: factoryObject.factoryName, id: factoryObject. factoryID})
          
        })
        
        SetFactoryPickerList(newPickers)
        SetFactoryList(newFactoryList)
      })
      .catch((error) => console.log(error)); //to catch the errors if any

    }, [])
    
    
     
  
    return (

        <View>
              
            <TouchableOpacity onPress={() => SetUserAdditionModalVisible(true)} activeOpacity={0.8}>
                {/* <View style={{alignItems:"center", marginTop: 20, borderColor: Colors.primaryColor, borderWidth: 2}}>
                    <Text style={{color: Colors.primaryColor , marginVertical: 5, fontWeight: "bold"}}>Add new user</Text>
                </View> */}
              <View style={{marginHorizontal: 10, marginTop: 10}}>
                  <View style={styles.addbutton}>
                    <Text style={styles.title} numberOfLines={1}>
                      +
                    </Text>
                  </View>
                  <Text style={styles.des} numberOfLines={1}>
                    Add new user
                  </Text>
              </View>
            </TouchableOpacity>

            <SearchBar
              placeholder="Search Here..."
              placeholderTextColor={Colors.primaryColor}
            
              containerStyle={{
                backgroundColor: "#f6f5f5",
                borderBottomColor: "transparent",
                borderTopColor: "transparent",
              }}
              inputContainerStyle={{
                backgroundColor: "#b5b5b580",
                marginHorizontal: 5,
              }}
              editable={true}
              value={SearchBarText}
              onChangeText={(text) => {
                SetSearchBarText(text)
                searchBarFilter(text)
              }}
            />
            {(() => {
                if(!ListLoaded)
                  return <View style = {{alignSelf: "center", alignItems: "center"}}><ActivityIndicator size="large" color={Colors.primaryColor} /></View>
              })()}
            <View style={{marginTop: 15, marginBottom: "60%"}}>

            <FlatList 
                data={FilteredUserList}
                keyExtractor={(userCardData) => userCardData.ObjectID.toString()}
                renderItem={({item}) => {
                return (
                 

                <TouchableOpacity
                  
                  onPress={() => {
                    SetListLoaded(false)   // To enable activity indicator
                    SetUpdationMode(true)
                    fetch(
                      `${ApiUrl}/api/bkquality/users/getUserDetails`,
                      {
                        method: "POST",
                        body: JSON.stringify({
                          basicparams: {
                            companyID: CompanyID,
                            userID: item.userID,
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
                      
                      console.log("############ Selected user details ##########")

                      console.log(body.result[0])
                      const userDetails = body.result[0]
                      SetPermissions({"Edit Brand": userDetails.editBrand, "Edit Style": userDetails.editStyle, "Edit Color": userDetails.editColor, 
                      "Edit Company": userDetails.editCompany, "Edit Factory": userDetails.editFactory, "Edit Size": userDetails.editSize,
                        "Edit Orders": userDetails.editOrders, "Edit Reports": userDetails.editReports, "Edit Defects": userDetails.editDefects, 
                        "Edit Users": userDetails.editUsers})
                      // SetFactoryPickerList(newPickers)
                      // SetFactoryList(newFactoryList)
                      for(var roleObj of UserRoleList)
                      {
                        if(roleObj.userRoleDesc.toLowerCase() == userDetails.userRoleDesc.toLowerCase())
                        {
                          SetUserRole(roleObj)
                          break
                        }
                      }

                    SetUserFirstName(item.userFName)
                    SetUserLastName(item.userLName)
                    SetEmailId(item.loginID)
                    SetPhone(item.contactNo)
                    SetPassword(item.loginPwd)
                    SetConfirmPassword(item.loginPwd)
                    SetTextFieldStatus({"Name": true, "Last Name": true, "Email ID": false, "Contact": true, "Password": true, "Confirm Password": true})
                    SetUserId(item.userID)
                    SetListLoaded(true)         //To disable activity indicator
                    SetUserAdditionModalVisible(true)
                    })
                    .catch((error) => console.log(error))

                    
                    
                
                  }}
                
                >

                  <UserSuperItem
                    username={item.loginID}
                    fn={item.userFName}
                    ln={item.userLName}
                    phNo={item.contactNo}
                    roleDesc={item.userRoleDesc}
                    
                  />
             </TouchableOpacity>
                  
                )
                }}
            />
            </View>

            <Modal
                animationType="slide"
                transparent={true}
                // visible={ShowMessageModal} 
                visible = {ShowMessageModal}
            >
                  <View style={styles.centeredView} >
                  <View style={{...styles.modalView, width:"60%", height: "30%", backgroundColor: Colors.primaryColor}}>
                      
                  <Text style={{color:"white", fontWeight:"bold", alignSelf: "center"}}>{AlertMessage}</Text>
                     
                      <TouchableHighlight
                        style={{ ...styles.openButton, backgroundColor: Colors.accentColor, bottom:"9%" , position: "absolute"}}
                        onPress={() => {
                            SetShowMessageModal(!ShowMessageModal);
                        }}
                        >
                        <Text style={{...styles.textStyle}}>Okay</Text>
                    </TouchableHighlight>
                    </ View>
                  </ View>
                  
            </Modal>

            {/* <Modal
              animationType="slide"
              transparent={true}
              visible = {LocationModalVisible}
              onRequestClose={() => {
                SetLocationModalVisibility(false)

               }}
            >
              
                
            
              <View style={styles.centeredView} >
              <View style={{...styles.modalView, width:0.5*screenWidth, height: 0.25*screenHeight, backgroundColor: Colors.primaryColor}}> 
                  
                <View style={{...styles.floatView, elevation: 25, borderRadius: 5, height: 0.19*screenHeight, width: 0.5*screenWidth, top: 0.0*screenHeight}}>

                        <View>
                          <FlatList 
                              data={permissionNames}
                              keyExtractor={(permissionName) => permissionName.split(" ")[1]}  
                              renderItem = {({item}) => {

                                  return (

                                      <View style={styles.checkboxContainer}>
                      
                                          <CheckBox
                                              style={{borderColor: "white"}}
                                              value={permissions[item]}
                                              tintColors={{ true: '#191970', false: 'white' }}
                                              onValueChange={() => {
                                                  const newPermissions = {...permissions}
                                                  newPermissions[item] = !permissions[item]
                                                  
                                                  SetPermissions(newPermissions)
                                              }}
                                              // style={styles.checkbox}
                                          />
                                          <Text style={{marginVertical:3, color: "white"}}>{item}</Text>
                                      </View>

                                  )

                              }}  
                          
                          />
                        </View>

                    </View>

                    <TouchableHighlight
                      style={{ ...styles.openButton, backgroundColor: Colors.accentColor, bottom: 0.007*screenHeight , position:"absolute"}}
                      onPress={() => {SetLocationModalVisibility(false)}}
                    >
                      <Text style={{...styles.textStyle, fontSize: 10}}>Set permissions</Text>
                    </TouchableHighlight>
                  </View>
                  </View>

                  
                
              
            </Modal> */}


            <Modal
                animationType="slide"
                transparent={true}
                visible={UserAdditionModalVisible}
                onBackdropPres={() => {
                  SetUserAdditionModalVisible(false)
                  console.log("Clicked")
                }}
                onRequestClose={() => {
                  SetUserAdditionModalVisible(!UserAdditionModalVisible);
                  SetUserFirstName("")
                  SetUserLastName("")
                  SetEmailId("")
                  SetPassword("")
                  SetConfirmPassword("")
                  SetPhone("")
                  SetUserRole(false)
                  SetFactory(false)
                  SetFloor(false)
                  SetLine(false)
                  SetTextFieldStatus({"Name": true, "Last name": true, "Email ID": true, "Contact": true, "Password": true, "Confirm Password": true})
                  SetLicationOptionVisibility(false)
                  SetUpdationMode(false)
              
                }}
                propagateSwipe={true}
            >
                
                
                  <View
                    onStartShouldSetResponderCapture={() => {
                      SetEnableParentScroll(true)
                  }}
                  >
                  <ScrollView 
                  // containerStyle={{...styles.modalView, width:"90%", backgroundColor: "#f0f8ff"}} 
                  keyboardShouldPersistTaps="always"
                  contentContainerStyle={{alignItems: "center", }}
                  scrollEnabled={EnableParentScroll}
                  style={{...styles.modalScrollView, width:"90%", backgroundColor: "#f0f8ff",  marginBottom: 50}}
                  >
                     
                    {/* <Text style={{color:"white", marginLeft: 7}}>FIRST NAME</Text> */}
                    
                    
                    {/* <View style={{marginTop: 0.035*screenHeight}} > */}

                      <FlatList
                        data={textInputsList}
                        keyExtractor={(textInputField) => textInputField["fieldType"]}
                        renderItem = {({item}) => {

                          return (
                            // <View style={styles.textInput}>
                              <TextInput
                                  // style= {{marginLeft: 4, color: Colors.primaryColor}}
                                  style={styles.input}
                                  placeholder={item.fieldType}
                                  
                                  keyboardType = {item.fieldType == "Contact" ?'numeric': "default"}
                                  secureTextEntry = {item.fieldType == "Password" || item.fieldType == "Confirm Password"}
                                  placeholderTextColor={"grey"}
                                  maxLength={50}
                                  editable={TextFieldStatus[item.fieldType]}
                                  // onBlur={Keyboard.dismiss}
                                  value={item.fieldValue}
                                  onChangeText={(newText) => {
                                      item.setterFunction(newText)
                                      if(item.fieldType == "Email ID")
                                        SetUserId(item.fieldValue)
                                  }}
                              />
                            // </View>
                          )

                        }}
                      />

                      {/* <View style={{ width: 250, height: 40, borderRadius: 5, borderWidth: 2, margin: 7, backgroundColor: Colors.accentColor,  bottom: 0.16*screenHeight}}>
                        <TouchableHighlight onPress={() => {

                          SetLocationModalVisibility(true) 

                        }}
                        
                        
                        >
                          <Text style={{margin: 5, color: "white", fontWeight: "bold", alignSelf: "center"}}>LOCATION DETAILS</Text>
                        </TouchableHighlight>
                      </View> */}
                    
                    {/* </View> */}
          
                    
                    {/* <View> */}

                    <SearchableDropdown
                  //On text change listner on the searchable input
                        id="User roles"
                        onTextChange={(text) => console.log(text)}
                        defaultIndex={(() => {
                          if (UserRole == "")
                            return null

                          var index = 0
                          for(obj of UserRoleList)
                          {
                              if(obj.userRoleDesc.toLowerCase() == UserRole.userRoleDesc.toLowerCase())
                                  return index.toString()
                              index = index +1
                          }
                          return null
                      })()}
                        onItemSelect={item => { 
                        
                           if(item.userRoleDesc.toLowerCase() == "admin")
                           {
                             SetPermissions({"Edit Brand": true, "Edit Style": true, "Edit Color": true, 
                                             "Edit Company": true, "Edit Factory": true, 
                                             "Edit Size": true, "Edit Defects": true, "Edit Reports": true, "Edit Orders": true, "Edit Users": true})
                             
                             SetUserRole(item)
                             SetLicationOptionVisibility(false)
                           }
                           else if(item.userRoleDesc.toLowerCase() == "quality auditor" || item.userRoleDesc.toLowerCase() == "quality controller")
                           {
                             SetPermissions({"Edit Brand": false, "Edit Style": false, "Edit Color": false,
                                            "Edit Company": false, "Edit Factory": false, "Edit Size": false,
                                             "Edit Orders": false, "Edit Reports": false, "Edit Defects": false, "Edit Users": false})
                 
                             SetUserRole(item)
                             if(item.userRoleDesc.toLowerCase() === "quality controller")
                               SetLicationOptionVisibility(true)
                           }
                           else
                             {
                               SetPermissions({"Edit Brand": false, "Edit Style": false, "Edit Color": false,
                                            "Edit Company": false, "Edit Factory": false, "Edit Size": false,
                                             "Edit Orders": false, "Edit Reports": false, "Edit Defects": false, "Edit Users": false})
                               SetUserRole(item)
                               SetLocationModalVisibility(true)
                               SetLicationOptionVisibility(false)
                             }
                          

                        }}
                        selectedItems={UserRole}
                        //onItemSelect called after the selection from the dropdown
                        containerStyle={{ padding: 8 ,
                        width: "75%" ,
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
                          width: "75%" ,
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
                        items={UserRoleList}
                        //mapping of item array
                        //default selected item index
                        placeholder={"Select user role"}
                        placeholderTextColor="#00334e80"
                        //place holder for the search input
                        // resetValue={AuditStatus.toLowerCase() != "new"}
                        //reset textInput Value with true and false state
                        underlineColorAndroid="transparent"
                        //To remove the underline from the android input
                      />

                    {/* <Picker
                      selectedValue={UserRole}
                      style={{width: 250, color: Colors.primaryColor}}
                      
                      // style={styles.input}
                      // opacityOfOtherItems={Platform.OS == "ios" ? 0 : 1}
                      onValueChange={(itemValue, itemIndex) => {

                       if(itemValue != null && itemValue != false)
                       {
                        if(itemValue.split(":")[0] === "Admin")
                        {
                          SetPermissions({"Edit Brand": true, "Edit Style": true, "Edit Color": true, 
                                          "Edit Company": true, "Edit Factory": true, 
                                          "Edit Size": true, "Edit Defects": true, "Edit Reports": true, "Edit Orders": true, "Edit Users": true})
                          
                          SetUserRole(itemValue)
                          SetLicationOptionVisibility(false)
                        }
                        else if(itemValue.split(":")[0] === "Quality Auditor" || itemValue.split(":")[0] === "Quality Controller")
                        {
                          SetPermissions({"Edit Brand": false, "Edit Style": false, "Edit Color": false,
                                         "Edit Company": false, "Edit Factory": false, "Edit Size": false,
                                          "Edit Orders": false, "Edit Reports": false, "Edit Defects": false, "Edit Users": false})
              
                          SetUserRole(itemValue)
                          if(itemValue.split(":")[0] === "Quality Controller")
                            SetLicationOptionVisibility(true)
                        }
                        else
                          {
                            SetPermissions({"Edit Brand": false, "Edit Style": false, "Edit Color": false,
                                         "Edit Company": false, "Edit Factory": false, "Edit Size": false,
                                          "Edit Orders": false, "Edit Reports": false, "Edit Defects": false, "Edit Users": false})
                            SetUserRole(itemValue)
                            SetLocationModalVisibility(true)
                            SetLicationOptionVisibility(false)
                          }
                       }
                        
                      }}>
                      {Pickers}
                      
                    </Picker> */}
                    

                    
                    {/* </View> */}
                    {/* Conditional rendering based on user role */}
                    {(() => {
                      if(UserRole != "" && UserRole.userRoleDesc.toLowerCase() == "quality controller")
                        return (
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
                      containerStyle={{ padding: 8 ,
                      width: "75%" ,
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
                        width: "75%" ,
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
                        )
                    })()}

                    {(() => {
                      if(FloorList != "" && UserRole != "" && UserRole.userRoleDesc.toLowerCase() == "quality controller")
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
                      containerStyle={{ padding: 8 ,
                      width: "75%" ,
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
                        width: "75%" ,
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
                      if(LineList != "" && UserRole != "" && UserRole.userRoleDesc.toLowerCase() == "quality controller")
                        return (
                          <SearchableDropdown
                        //On text change listner on the searchable input
                        id="Line"
                        onTextChange={(text) => console.log(text)}
                        onItemSelect={item => { SetLine(item)
                        }}
                        selectedItems={Line}
                        //onItemSelect called after the selection from the dropdown
                        containerStyle={{ padding: 8 ,
                        width: "75%" ,
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
                          width: "75%",
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
                    })()}
                    { (() => {
                      // if(UserRole != "" && UserRole.userRoleDesc.toLowerCase() == "quality controller")
                      //    return (<View style={{height: 0.22*screenHeight}}>
                        
                      //     <FlatList 

                      //     data={locationParams}
                      //     keyExtractor={(paramType) => paramType}
                      //     renderItem = {({item}) => {

                            
                      //       var currentValue = Factory
                      //       var currentSetterFunction = SetFactory
                      //       var currentPickerList = FactoryPickerList

                      //       if(item == "floor")
                      //       {
                      //         currentValue = Floor
                      //         currentSetterFunction = SetFloor
                      //         currentPickerList = FloorPickerList
                      //       }

                      //       if(item == "line")
                      //       {
                      //         currentValue = Line
                      //         currentSetterFunction = SetLine
                      //         currentPickerList = LinePickerList
                      //       }
                            
                      //       return (
                      //             <View style={{...styles.input, height: 40, justifyContent:"center"}}>

                      //               <Picker
                      //                 selectedValue={currentValue}
                      //                 enabled={ShowLocationOptions}
                      //                 style={{ height: 0.05*screenHeight, width: 250, color: Colors.primaryColor }}
                      //                 // style={}
                      //                 onValueChange={(itemValue, itemIndex) => {

                                        
                      //                     if(itemValue != false)
                      //                     {
                      //                       currentSetterFunction(itemValue)

                      //                       if(item == "factory")
                      //                       {
                      //                           var newFloorPickerList = [<Picker.Item label= "Select a floor" value={false} />]
                      //                           itemValue.locationgroups.forEach((floorObject) => {
                      //                             newFloorPickerList.push(<Picker.Item label={floorObject.locationgroupName.toUpperCase()} value={floorObject} />)
                      //                           })
                      //                           SetFloorPickerList(newFloorPickerList)
                      //                       }
                                            
                      //                       else if (item == "floor")
                      //                       {
                      //                         var newLinePickerList = [<Picker.Item label= "Select a line" value={false} />]

                      //                         itemValue.lines.forEach((LineObject) => {
                      //                           newLinePickerList.push(<Picker.Item label={LineObject.lineName.toUpperCase()} value={LineObject} />)
                      //                         })
                      //                         SetLinePickerList(newLinePickerList)
                      //                       }

                      //                       else
                      //                       {
                      //                         if(itemValue != null && itemValue != false)
                      //                           SetLine(itemValue)
                      //                       }
                                                                                      
                      //                     }                 
                                        
                      //                 }}>
                                      
                      //                 {currentPickerList}
                                      
                      //               </Picker>
                                    

                      //         </View>
                      //       )

                      //   }}
                      //     />

                      // </View>)
                      
                      if(UserRole != "" && (UserRole.userRoleDesc.toLowerCase() == "merchant" || UserRole.userRoleDesc.toLowerCase() == "quality manager"))
                      {
                        return (
                          // <View style={styles.centeredView} >
                          //   <View style={{width:0.5*screenWidth, height: 0.25*screenHeight, backgroundColor: Colors.primaryColor}}> 
                                
                              <View style={{...styles.floatView, borderRadius: 5, height: 0.18*screenHeight, width: 0.6*screenWidth}}>

                                      <View
                                        onStartShouldSetResponderCapture={() => {
                                          SetEnableParentScroll(false)
                                      }}
                                      >
                                        <FlatList 
                                            data={permissionNames}
                                            keyExtractor={(permissionName) => permissionName.split(" ")[1]}  
                                            
                                            renderItem = {({item}) => {

                                                return (

                                                    // <View style={styles.checkboxContainer}>
                                    
                                                        <CheckBox
                                                            title={item}
                                                            style={{margin:0,padding: 0,}}
                                                            containerStyle={{
                                                              backgroundColor: "transparent",
                                                              borderColor: "transparent",
                                                              borderRadius: 7,
                                                              margin: 0,
                                                              backgroundColor: "white",
                                                              borderColor: Colors.inactiveColor,
                                                              borderWidth: 3,
                                                              width: "93%",
                                                              height: 46.5
                                                           
                                                            }}
                                                            textStyle={{
                                                              color: Colors.inactiveColor,
                                                              fontSize: 18,
                                                              margin: 0,
                                                            }}
                                                            // value={permissions[item]}
                                                            
                                                            checkedColor={Colors.inactiveColor}
                                                            uncheckedColor={Colors.inactiveColor}
                                                            checked={permissions[item]}
                                                            onPress={() => {
                                                                const newPermissions = {...permissions}
                                                                newPermissions[item] = !permissions[item]
                                                                
                                                                SetPermissions(newPermissions)
                                                            }}
                                                            // style={styles.checkbox}
                                                        />
                                                        // <Text style={{marginVertical:3, color: "white"}}>{item}</Text>
                                                    // </View>

                                                )

                                            }}  
                                        
                                        />
                                      {/* </View>

                                  </View> */}

                                  {/* <TouchableHighlight
                                    style={{ ...styles.openButton, backgroundColor: Colors.accentColor, bottom: 0.007*screenHeight , position:"absolute"}}
                                    onPress={() => {SetLocationModalVisibility(false)}}
                                  >
                                    <Text style={{...styles.textStyle, fontSize: 10}}>Set permissions</Text>
                                  </TouchableHighlight> */}
                                </View>
                                </View>

                                      )
                                    }

                                    return <View></View>
                                  })()
                      
                 }

                    
                    

                    <TouchableHighlight
                    style={{width: 100, height: 45, backgroundColor: Colors.primaryColor, justifyContent: "center", alignItems: "center", borderRadius: 8, marginTop: 10, marginBottom: 60}}
                    onPress={() => {

                      if(!EmailId.includes("@"))
                      {
                        Alert.alert("Please enter a valid email ID")
                        return
                      }

                      if(UserFirstName == "" || EmailId == "")
                      {
                        Alert.alert("Please fill the empty fields")
                        return
                      }
                      if(!UpdationMode && (Password == "" || ConfirmPassword == ""))
                      {
                        Alert.alert("Please confirm a password")
                        return
                      }
                      if(Password != ConfirmPassword)
                        {
                          Alert.alert("Password and confirm password do not match")
                          return
                        }
                        if(UserRole == "")
                        {
                          Alert.alert("Please select a user role")
                          return
                        }
                        if((Factory == "" || Floor == "" || Line == "" ) && UserRole.userRoleDesc.toLowerCase() === "quality controller")
                          {
                            Alert.alert("Please select location information")
                            return
                          }

                        const request = {
                            "method": "POST",
                            "header": [],
                            "body": {
                              "mode": "raw",
                              "raw": {
                                "basicparams": {
                                  "companyID": CompanyID,
                                  "userID": props.navigation.state.params.userID.toString()
                                },
                                "userParams": {
                                  "companyID": CompanyID,
                                  "userFname": UserFirstName,
                                  "userLname": UserLastName,
                                  "loginID": EmailId,
                                  "emailID": EmailId,
                                  "loginPwd": Password,
                                  "contactNo": Phone.toString(),
                                  "mobileNo": Phone.toString(),
                                  "userRoleID": UserRole.userRoleID,
                                  "userPermissionsParams": {
                                    "editBrand": (permissions["Edit Brand"] === true) ? 1 : 0,
                                    "editSize": (permissions["Edit Size"] === true) ? 1 : 0,
                                    "editStyle": (permissions["Edit Style"] === true) ? 1 : 0,
                                    "editColor": (permissions["Edit Color"] === true) ? 1 : 0,
                                    "editCompany": (permissions["Edit Company"] === true) ? 1 : 0,
                                    "editFactory": (permissions["Edit Factory"] === true) ? 1 : 0,
                                    "editReports": (permissions["Edit Reports"] === true) ? 1 : 0,
                                    "editOrders" : (permissions["Edit Orders"] === true) ? 1 : 0,
                                    "editDefects": (permissions["Edit Defects"] === true) ? 1 : 0,
                                    "editUsers"  : (permissions["Edit Users"] === true) ? 1 : 0,
                                  },
                                  "userLocationParams": {
                                    "factoryID":  Factory.factoryID == false || Factory.factoryID == null ? "0" :Factory.factoryID.toString(), 
                                    "locationgroupID": Floor.locationgroupID == false || Floor.locationgroupID == null ? "0": Floor.locationgroupID.toString(),
                                    "lineID":  Line.lineID == false ||  Line.lineID == null ? "0" : Line.lineID.toString()
                                  }
                                }
                                
                              },
                              "options": {
                                "raw": {
                                  "language": "json"
                                }
                              }
                            }
                          }

                        console.log("#### Request Object: ")
                        console.log(request)

                        
                       
                      
                            fetch(
                              `${ApiUrl}/api/bkquality/users/saveUserDetails`,
                              {
                                method: "POST",
                                body: JSON.stringify({
                                  "basicparams": {
                                    "companyID": CompanyID,
                                    "userID": props.navigation.state.params.userID.toString()
                                  },
                                  "userParams": {
                                    "companyID": CompanyID,
                                    "userID": userID,
                                    "userFname": UserFirstName,
                                    "userLname": UserLastName,
                                    "loginID": EmailId,
                                    "emailID": EmailId,
                                    "loginPwd": Password,
                                    "contactNo": Phone.toString(),
                                    "mobileNo": Phone.toString(),
                                    "userRoleID": UserRole.userRoleID,
                                    "userPermissionsParams": {
                                      "editBrand": (permissions["Edit Brand"] === true) ? 1 : 0,
                                      "editSize": (permissions["Edit Size"] === true) ? 1 : 0,
                                      "editStyle": (permissions["Edit Style"] === true) ? 1 : 0,
                                      "editColor": (permissions["Edit Color"] === true) ? 1 : 0,
                                      "editCompany": (permissions["Edit Company"] === true) ? 1 : 0,
                                      "editFactory": (permissions["Edit Factory"] === true) ? 1 : 0,
                                      "editReports": (permissions["Edit Reports"] === true) ? 1 : 0,
                                      "editOrders" : (permissions["Edit Orders"] === true) ? 1 : 0,
                                      "editDefects": (permissions["Edit Defects"] === true) ? 1 : 0,
                                      "editUsers"  : (permissions["Edit Users"] === true) ? 1 : 0,
                                    },
                                    "userLocationParams": {
                                      "factoryID": Factory.factoryID == false || Factory.factoryID == null ? "0" :Factory.factoryID.toString(), 
                                      "locationgroupID": Floor.id == null ? "0": Floor.id.toString(),
                                      "lineID": Line.id == null ? "0" : Line.id.toString()
                                    }
                                  }
                                  
                                }),
                                headers: {
                                  "Content-Type": "application/json",
                                  Accept: "application/json",
                                },
                              }
                            )
                            .then(res => res.json())
                            .then(body => {
                              console.log(body)
                              if(body["result"] != null)
                                {
                                  // SetAlterMessage(body["result"])
                                  // SetShowMessageModal(true)
                                  Alert.alert(body["result"])
                                }
                              
                              else
                                {
                                  if(body["message"] != null)
                                    Alert.alert(body["message"])
                                  else
                                    Alert.alert("User couldn't be added. Please check you entry.")
                                }
    
                              // SetShowMessageModal(!ShowMessageModal)
                              // SetUserList(body.result)
                            })
                          
                          
  
                          SetUserAdditionModalVisible(!UserAdditionModalVisible);
                          SetUserFirstName("")
                          SetUserLastName("")
                          SetEmailId("")
                          SetPassword("")
                          SetConfirmPassword("")
                          SetPhone("")
                          SetUserRole(false)
                          SetFactory(false)
                          SetFloor(false)
                          SetLine(false)
                          SetTextFieldStatus({"Name": true, "Last name": true, "Email ID": true, "Contact": true, "Password": true, "Confirm Password": true})
                          SetLicationOptionVisibility(false)
                          
                          props.navigation.navigate("Home")
                    
                    }}
                    >
                    <Text style={{...styles.textStyle, color: Colors.accentColor}}>Submit</Text>
                </TouchableHighlight>


                  </ ScrollView>
                  {/* </ View> */}
                    
                  </View>     
                
            </Modal>

        </View>
        
       
    )
}

const styles = StyleSheet.create({
    // title: {
    //   fontSize: 30,
    //   alignSelf: "stretch",
    //   color: "white",
    //   backgroundColor: "#00008b"
    // },
    
    card: {
      borderColor: "#00008b",
      borderWidth: 2,
      height: 100,
    
    },
    openButton: {
        backgroundColor: Colors.primaryColor,
        borderRadius: 10,
        padding: 10,
        elevation: 10,
        width: "50%"        
        // position: "absolute"
      },
      modalScrollView: {
        marginHorizontal: 20,
        marginTop: 60,
        backgroundColor: "white",
        borderRadius: 10,
        borderColor: "#00008b",
        // padding: 35,
        paddingVertical: 50,
        // alignItems: "center",
        shadowColor: "#000",

        // shadowOffset: {
        //   width: 0,
        //   height: 2
        // },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5
      },
      modalView: {

        marginHorizontal: 20,
        marginTop: 60,
        backgroundColor: "white",
        borderRadius: 10,
        borderColor: "#00008b",
        // padding: 35,
        paddingVertical: 50,
        alignItems: "center",
        shadowColor: "#000",

        // shadowOffset: {
        //   width: 0,
        //   height: 2
        // },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5
      },
      centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 20
      },
      textStyle: {
        color: "white",
        fontWeight: "bold",
        fontSize:20,
        textAlign: "center"
      },
      floatView: {
        // position: 'absolute',
        // height: "23%",
        // bottom: "24%" ,
        alignSelf: 'center',
        alignItems: "stretch",
        marginVertical: 10,
        backgroundColor: 'white',
      },
      checkboxContainer: {
        flexDirection: "row",
        marginBottom: 5,
        backgroundColor: Colors.inactiveColor
      },

      textInput: {
       
        fontWeight:"bold", 
        justifyContent: 'center', 
        margin: 7, 
        height: 40,  
        width: 250, 
        borderColor: Colors.inactiveColor, 
        borderWidth:5, 
        borderRadius: 5},

        des: {
          paddingLeft: 0.1*Dimensions.get("window").width,
          position: "absolute",
          fontSize: 22,
          textAlign: "center",
          paddingBottom: 5,
          textAlignVertical: "center",
          color: Colors.primaryColor,
        },
        addbutton: {
          backgroundColor: Colors.primaryColor,
          justifyContent: "center",
          alignContent: "center",
          borderWidth: 1,
          borderRadius: 15,
          width: 30,
          height: 30,
        },
        title: {
          paddingBottom: 2,
          fontSize: 25,
          textAlign: "center",
          fontFamily: "effra-heavy",
          color: Colors.accentColor,
        },

        overlay: {
          position: "absolute",
          top: 0,
          right: 0,
          bottom: 0,
          left: 0,
          backgroundColor: "gray",
          opacity: 0.5,
        },

        dropdownStyle: {
          backgroundColor: "white", 
          borderColor: Colors.primaryColor,
          borderWidth: 5,
          position: "absolute", 
          height: 40,
          justifyContent: "center"

        },
        input: {
          borderWidth: 3,
          paddingHorizontal: 20,
          borderColor: Colors.primaryColor,
          padding: 3,
          marginTop: 12,
          color: Colors.primaryColor,
          fontSize: 20,
          fontWeight: "bold",
          borderRadius: 10,
          width: Dimensions.get("window").width / 1.5,
         
         
        }

  });

 Users.navigationOptions = (navData) => {
    return {
      headerTitle: "Users",
      headerStyle: {
        backgroundColor: Colors.primaryColor,
      },
      headerTintColor: Colors.accentColor,
    };
  }

export default Users