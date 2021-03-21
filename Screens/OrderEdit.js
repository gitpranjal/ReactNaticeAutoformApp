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

import { AntDesign } from '@expo/vector-icons'; 
import DateTimePickerModal from "react-native-modal-datetime-picker";
import SearchableDropdown from 'react-native-searchable-dropdown';
import FontAwesome from "react-native-vector-icons/FontAwesome";

import * as Animatable from "react-native-animatable";
import Colors from "../constants/colors";
import colors from "../constants/colors";

import OrderDetailsSuperItem from "../components/OrderDetailsSuperItem";

class OrderEdit extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      loadingStyles:false,
      enable: true,
      dataSource: [],
      Allstyles:[],
      apimsg: "",
      Index:null,
      id: props.navigation.state.params.id,
      checked: false,
      orderno: "",
      errmsg:"",
      tempqty:"",
      TempItem:null,
      qtytotal:0,
      selectable:false,
      ordernohint: "Enter Order No.",
      ordernohintColor: "#00334e80",
      orderqty: 0,
      orderqtyhint: "Enter Order Qty",
      orderqtyhintColor: "#00334e",
      description: "",
      descriptionhint: "Enter Style Description",
      descriptionhintColor: "#00334e80",
      stylePlaceholder:"Add Style",
      Brands: [],
      SelectedBrands:null,
      SelectedStyle:null,
      Styles:[],
      brandPlaceHolder:"",
      BrandID:0,
      Minor: false,
      Major: false,
      Critical: false,
      frontpath: "",
      backpath: "",
      Orders:[],
      stylereset:false,
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
      OrderDate:"Select Order Date",
      OrderDatex:"Select Order Date",
      OrderDateColor:"#00334e",
      OrderDatePickerVis:false,
      selectedBrandID:0,
      DeliveryDate:"Select Delivery Date",
      DeliveryDatex:"Select Delivery Date",
      DeliveryDateColor:"#00334e",
      DeliveryDate2:"Select Del Date",
      DeliveryDatePickerVis:false,
      DeliveryDatePickerVis2:false,
      userID: props.navigation.state.params.userID,
      companyID: props.navigation.state.params.companyID,
      animation_login: new Animated.Value(width / 2.4),
    };
  }

  savestyle = (item) =>{
    var styleTemp=null;
    var tempOrder=this.state.Orders
    var tempsuborders=[];
    item.orderDtDetails.forEach((itemx2)=>{
      var tempsuborder={sizeName:itemx2.sizeName,sizeID:itemx2.sizeID,colorName:itemx2.colorName,colorID:itemx2.colorID,qty:itemx2.qty,date:itemx2.deliveryDate,datepickvis:false,date2:itemx2.deliveryDate}
      tempsuborders.push(tempsuborder)
    })
    var suborder = {styleNo:item.styleNo,styleID:item.styleID,details:tempsuborders}
    tempOrder.push(suborder)
    this.setState({
      Orders:tempOrder,
      stylePlaceholder:"Add Style"
    })
  }

  addstyle = (item) =>{
    var styleTemp=null;
    var date = this.state.DeliveryDate2
    var date2 = this.state.DeliveryDatex
    var tempOrder=this.state.Orders
    this.state.Allstyles.forEach(function (itemx) {
      if(item.id===itemx.styleID){
          styleTemp=itemx
      }
    })
    var tempsuborders=[];
    styleTemp.colors.forEach(function (itemx) {
      styleTemp.sizes.forEach(function (itemx2) {
      var tempsuborder={sizeName:itemx2.sizeName,sizeID:itemx2.sizeID,colorName:itemx.colorName,colorID:itemx.colorID,qty:"",date:date,datepickvis:false,date2:date2}
      tempsuborders.push(tempsuborder)
      })
    })
    var suborder = {styleNo:item.name,styleID:item.id,details:tempsuborders}
    tempOrder.push(suborder)
    this.setState({
      Orders:tempOrder,
      stylePlaceholder:"Add Style"
    })
  }

  submit = () => {
    var checkflag = 0;
    var errmsg=""
    if(this.state.orderno===""||this.state.orderno===null){
      checkflag=1
      errmsg="Enter Order No"
      this.setState({
        ordernohint:"Please Enter Order No",
        ordernohintColor:"#fb7a7480",
        errmsg:"Enter Order No"
      })
    }

    else if(this.state.OrderDate===""||this.state.OrderDate===null||this.state.OrderDate==="Select Order Date"){
      checkflag=1
      errmsg="Select Order Date"
      this.setState({
        OrderDateColor:"#fb7a7480",
        errmsg:"Select Order Date"
      })
    }
    else if(this.state.DeliveryDate===""||this.state.DeliveryDate===null||this.state.DeliveryDate==="Select Delivery Date"){
      checkflag=1
      errmsg="Select Delivery Date"
      this.setState({
        DeliveryDateColor:"#fb7a7480",
        errmsg:"Select Delivery Date"
      })
    }

    else if(this.state.brandPlaceHolder===null||this.state.brandPlaceHolder===""){
        checkflag=1
        errmsg="Select Brand"
    }
    else if(this.state.Orders.length===0){
      checkflag=1
      errmsg="Select Style"
  }
  else if(this.state.orderqty===0){
    checkflag=1
    errmsg="Enter Qty"
}
    if (checkflag === 1) {
      Alert.alert("Alert!!!  " + errmsg);
    }
    if (checkflag === 0) {
      var body;
      var orderParams=[];
      this.state.Orders.forEach(function(item){
        var tempx=[]
        item.details.forEach(function(itemx){
          var temp2={sizeID:itemx.sizeID,colorID:itemx.colorID,qty:itemx.qty,deliveryDate:itemx.date}
          tempx.push(temp2)
        })
        var temp={styleID:item.styleID,orderDtParams:tempx}
        orderParams.push(temp)
      })
      body = JSON.stringify({
        basicparams: {
          companyID: this.state.companyID,
          userID: this.state.userID,
        },
        orderParams: {
          companyID: this.state.companyID,
          orderID:this.state.id,
          orderNo: this.state.orderno,
          brandID:this.state.BrandID,
          orderDate:this.state.OrderDate,
          deliveryDate:this.state.DeliveryDate,
          orderqty:this.state.orderqty,
          orderStyleParams:orderParams
        },
      });
      console.log(body)
      fetch(
        "https://qualitylite.bluekaktus.com/api/bkQuality/order/postOrderDetails",
        {
          method: "POST",
          body: body,
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        }
      )
        .then((response) => response.json())
        .then((responseJson) => {
          console.log(responseJson)
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
        .catch((error) => Alert.alert("Alert!!!  " + "an error has occured")); //to catch the errors if any
    }
  };

  deleteitem=()=>{

  }

  datepick = (index,item) =>{
    this.setState({
      Index:index,
      DeliveryDatePickerVis2:true,
      TempItem:item
    })                                
  }

  getstyle = (id) => {
    this.setState({
      loadingStyles:true
    })
    console.log( JSON.stringify({
      basicparams: {
        companyID: 1,
        userID: 13,
        brandID:id
      },
    }))
    fetch("https://qualitylite.bluekaktus.com/api/bkQuality/masters/getStyleDetails", {
      method: "POST",
      body: JSON.stringify({
        basicparams: {
          companyID: this.state.companyID,
          userID: this.state.userID,
          brandID:id
        },
      }),
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    })
      .then((response) => response.json())
      .then((responseJson) => {
        var styles=[];
      
        responseJson.result.forEach((item)=> {
            var Style = {name:item.styleNo,id:item.styleID}
            styles.push(Style)
          })

        this.setState({
          loadingStyles: false,
          Styles: styles,
          Allstyles:responseJson.result,
          stylePlaceholder:"Add Style"
        });
        }
      )
      .catch((error) => console.log(error)); //to catch the errors if any
  };

  getorderdeets = (brands)=>{

    fetch("https://qualitylite.bluekaktus.com/api/bkQuality/order/getOrderDetails", {
      method: "POST",
      body: JSON.stringify({
        basicparams: {
          companyID: this.state.companyID,
          userID: this.state.userID,
          orderID:this.state.id
        },
      }),
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    })
      .then((response) => response.json())
      .then((responseJson) => {
       var order = responseJson.result[0]
       this.setState({
         orderno:order.orderNo,
         OrderDate:order.orderDate,
         DeliveryDate:order.deliveryDate,
         orderqty:order.orderQty
       })
       brands.forEach((item,index)=>{
            if(item.id===order.brandID){
            console.log(item.name)
            this.getstyle(item.id)
            this.setState({
              brandPlaceHolder:item.name,
              BrandID:item.id,
              loading:false
            })
      }
       })
       order.orderStyleDetails.forEach((item=>{
         this.savestyle(item)
       }))
       
      })
      .catch((error) => console.log(error)); //to catch the errors if any


  }

  fetchdata = () => {

    fetch("https://qualitylite.bluekaktus.com/api/bkQuality/masters/getBrandDetails", {
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
        var temp =[];
        responseJson.result.forEach((item)=> {
            var Brand = {name:item.brandName,id:item.brandID}
            temp.push(Brand)
          })
          this.getorderdeets(temp)
        this.setState({
          Brands: temp,
        });
      })
      .catch((error) => console.log(error)); //to catch the errors if any
  };

  componentDidMount() {
    this.fetchdata();
  }

  renderGridItem = (itemData) => {
    const state = this.state;
    return (
      <OrderDetailsSuperItem
        name={itemData.item.styleNo}
        id={itemData.item.styleID}
        colorName={itemData.item.colorName}
        colorID={itemData.item.colorID}
        sizeName={itemData.item.sizeName}
        sizeID={itemData.item.sizeID}
        qty={itemData.item.qty}
      />
    );
  };

  render() {
    const state = this.state;
    const width = this.state.animation_login;
    let TouchableCmp = TouchableOpacity;
    if (Platform.OS === "android" && Platform.Version >= 21) {
      TouchableCmp = TouchableNativeFeedback;
    }
    if (this.state.loading) {
      return (
        <View style={styles.loader}>
          <ActivityIndicator size="large" color={Colors.primaryColor} />
        </View>
      );
    } else {
      return (
        <ScrollView
        keyboardShouldPersistTaps="handled"
        >
          <View style={styles.container}>
            <TextInput
              placeholder={this.state.ordernohint}
              placeholderTextColor={this.state.ordernohintColor}
              style={styles.input}
              value={this.state.orderno}
              onChangeText={(value) => {
                this.setState({ orderno: value });
              }}
            />
            <View style={styles.date}>
                <Text style={styles.label}>Order Date</Text>
                <View style={{flexDirection:"row", justifyContent:"space-between"}}>
                    <Text style={{  marginRight:10,
                            fontSize: 20,
                            fontWeight: "bold",
                            borderRadius: 10,
                            color:this.state.OrderDateColor,
                            width: Dimensions.get("window").width / 1.8
                            }}>{this.state.OrderDate}</Text>
                    <TouchableOpacity style={{alignContent:"space-between",width:"10%"}} onPress={()=>{
                        this.setState({OrderDatePickerVis:true})
                    }}>
                        <AntDesign name="calendar" size={28} color={Colors.accentColor} />
                    </TouchableOpacity>
                </View>
            </View>

            <View style={styles.date}>
                <Text style={styles.label}>Delivery Date</Text>
                <View style={{flexDirection:"row", justifyContent:"space-between"}}>
                    <Text style={{  marginRight:10,
                            fontSize: 20,
                            fontWeight: "bold",
                            borderRadius: 10,
                            color:this.state.DeliveryDateColor,
                            width: Dimensions.get("window").width / 1.8
                            }}>{this.state.DeliveryDate}</Text>
                    <TouchableOpacity style={{alignContent:"space-between",width:"10%"}} onPress={()=>{
                        this.setState({DeliveryDatePickerVis:true})
                    }}>
                        <AntDesign name="calendar" size={28} color={Colors.accentColor} />
                    </TouchableOpacity>
                </View>
            </View> 
            <View style={styles.container}>
            {/* <TextInput
              placeholder={this.state.orderqtyhint}
              placeholderTextColor={this.state.orderqtyhintColor}
              style={styles.inputx}
              keyboardType="numeric"
              onChangeText={(value) => {
                this.setState({ orderqty: value });
              }}
            />  */}
            </View>

 
      <SearchableDropdown
          //On text change listner on the searchable input
          onTextChange={(text) => console.log(text)}
          onItemSelect={item => {this.setState({
            SelectedBrands:item,
            selectable:true,
            Orders:[],
          })
          this.getstyle(item.id)
        }}
          //onItemSelect called after the selection from the dropdown
          containerStyle={{ padding: 8 ,width:Dimensions.get("window").width / 1.1 ,
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
            marginLeft:10,
            width:Dimensions.get("window").width / 1.8 ,
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
          placeholder={this.state.brandPlaceHolder}
          placeholderTextColor="#00334e"
          items={this.state.Brands}
          //mapping of item array
          defaultIndex={null}
          // placeholder="Select Brand"
          // placeholderTextColor="#00334e80"
          //place holder for the search input
          resetValue={false}
          //reset textInput Value with true and false state
          underlineColorAndroid="transparent"
          //To remove the underline from the android input
        />

        <SearchableDropdown
          //On text change listner on the searchable input
          onTextChange={(text) => console.log(text)}
          onItemSelect={item => {this.addstyle(item)
          }}
          //onItemSelect called after the selection from the dropdown
          containerStyle={{ padding: 8 ,width:Dimensions.get("window").width / 1.1 ,
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
            marginLeft:10,
            width:Dimensions.get("window").width / 1.8 ,
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
          items={this.state.Styles}
          //mapping of item array
          //default selected item index
          placeholder={this.state.stylePlaceholder}
          placeholderTextColor="#00334e80"
          //place holder for the search input
          resetValue={this.state.stylereset}
          //reset textInput Value with true and false state
          underlineColorAndroid="transparent"
          //To remove the underline from the android input
        />
        <Text style={{borderWidth: 3,
                      paddingLeft: 20,
                      borderColor: Colors.primaryColor,
                      padding: 8,
                      marginTop: 12,
                      color: this.state.orderqtyhintColor,
                      fontSize: 20,
                      fontWeight: "bold",
                      borderRadius: 10,
                      width: Dimensions.get("window").width / 1.1,}}>{"Qty: "+this.state.orderqty}</Text>


        <View style={styles.orderdeets}>
          <Text style={{  marginRight:10,
                          fontSize: 20,
                          fontWeight: "bold",
                          textAlign:"center",
                          color:Colors.primaryColor}}>Order Details</Text>
        {this.state.loadingStyles ? (
                <View style={{alignContent:"center",justifyContent:"center"}}>
                  <Text style={{ fontSize: 18,
                    textAlign: "center",
                    fontWeight: "bold",
                    paddingLeft: 10,
                    color: this.state.frontContourColor,}} >Loading Data</Text>
                  <ActivityIndicator size="large" color={Colors.primaryColor} />
              </View>):
              <View style={{alignContent:"center",justifyContent:"center"}}>
                 <FlatList
                    extraData={this.state}
                    data={this.state.Orders}
                    keyExtractor={(item, index) => item.styleID.toString()}
                    renderItem={({ item, index}) => (
                      <View>
                        <View style={{width:Dimensions.get("window").width / 1.2,backgroundColor:Colors.primaryColor,
                                      marginLeft:5,flexDirection:"row",marginBottom:5,borderRadius:6,
                                      alignItems:"center",justifyContent:"space-between"
                                      }} >
                        <Text style={{textAlign:"left",marginLeft:15,backgroundColor:Colors.primaryColor,
                                      fontSize: 26,fontFamily: "effra-heavy",
                                      color:"#f6f5f5",
                                      paddingVertical:2,paddingHorizontal:10,
                                      
                                      }}>
                          {item.styleNo}
                          </Text>
                          {/* <TouchableOpacity onPress={this.deleteitem()} style={{marginRight:20}}>
                             <AntDesign name="minuscircleo" size={20} color="#f6f5f5"  />
                          </TouchableOpacity> */}
                          </View>
                          <View style={{flexDirection:"row",backgroundColor:Colors.primaryColor,borderRadius:3}}>
                              <Text style={{width:"25%",textAlign:"center",color:Colors.accentColor,
                                            fontSize:20,paddingVertical:3,fontWeight:"bold"}}>
                                              Color
                              </Text>
                              <Text style={{width:"20%",textAlign:"center",color:Colors.accentColor,
                                            fontSize:20,paddingVertical:3,fontWeight:"bold"}}>
                                              Size
                              </Text>
                              <Text style={{width:"20%",textAlign:"center",color:Colors.accentColor,
                                            fontSize:20,paddingVertical:3,fontWeight:"bold"}}>
                                              Qty
                              </Text>
                              <Text style={{width:"35%",textAlign:"center",color:Colors.accentColor,
                                            fontSize:20,paddingVertical:3,fontWeight:"bold"}}> 
                                            Date
                              </Text>
                          </View>
                        <FlatList
                            data={item.details}
                            renderItem={({ item }) => (
                              <View style={{flexDirection:"row",marginBottom:2}}>
                              <Text style={{width:"25%",textAlign:"center",color:Colors.primaryColor,
                                            fontSize:15,paddingVertical:3,fontWeight:"bold"}}>
                                             {item.colorName}
                              </Text>
                              <Text style={{width:"20%",textAlign:"center",color:Colors.primaryColor,
                                            fontSize:15,paddingVertical:3,fontWeight:"bold"}}>
                                             {item.sizeName}
                              </Text>
                              <TextInput style={{width:"15%",textAlign:"right",color:Colors.primaryColor,
                                            fontSize:15,fontWeight:"bold",marginLeft:5,textAlignVertical:"center",
                                            borderBottomColor:Colors.primaryColor,borderBottomWidth:2,
                                          }}
                                          placeholder="Qty"
                                          placeholderTextColor="#00334e80"
                                          keyboardType="numeric"
                                          value={item.qty.toString()}
                                          onChangeText={(value) => {
                                           var tempOrder = this.state.Orders
                                           var total = 0
                                           
                                           tempOrder[index].details[tempOrder[index].details.findIndex(x => x===item)].qty = value
                                           tempOrder.forEach(function(item){
                                            item.details.forEach(function(itemx){
                                              total=total+Number(itemx.qty)
                                            })
                                          })
                                           this.setState({
                                             Orders:tempOrder,
                                             orderqty:total
                                           })

                                          }}
                                          />
                                      <TouchableOpacity style={{width:"40%",paddingVertical:3,}} onPress={()=>this.datepick(index,item)}>
                                                                                                        
                                      <Text style={{  marginLeft:5,
                                          fontSize: 15,
                                          fontWeight: "bold",
                                          borderRadius: 10,

                                          textAlign:"center",
                                          color:Colors.primaryColor
                                          }}
                                          numberOfLines={1}
                                          >{item.date}
                                      </Text>
                                      </TouchableOpacity>

                                      
                              </View>
                            )}
                            listKey={index.toString()}
                            keyExtractor={(item, index) => index.toString()}
                        />

                        </View>
                    )} 
                  />
              </View>
        }       
        </View>

        <TouchableOpacity onPress={this.submit}>
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
                  <Text style={{fontWeight:"bold",color:Colors.accentColor}}>{this.state.errmsg}</Text>

<DateTimePickerModal
        isVisible={this.state.OrderDatePickerVis}
        mode="date"
        onConfirm={(date)=>{
            var monthNames= [
                "Jan",
                "Feb",
                "Mar",
                "Apr",
                "May",
                "Jun",
                "Jul",
                "Aug",
                "Sep",
                "Oct",
                "Nov",
                "Dec",
              ]
            this.setState({
                OrderDatePickerVis:false,
                OrderDateColor:"#00334eDD",
                OrderDate:date.getDate()+" "+monthNames[date.getMonth()]+" "+date.getFullYear(),
                OrderDatex:date.getMonth()+"-"+date.getDate()+"-"+date.getFullYear(),
            })
        }}
        onCancel={()=>{
            this.setState({OrderDatePickerVis:false})
        }}
      />

<DateTimePickerModal
        isVisible={this.state.DeliveryDatePickerVis}
        mode="date"
        onConfirm={(date)=>{
            var monthNames= [
              "Jan",
              "Feb",
              "Mar",
              "Apr",
              "May",
              "Jun",
              "Jul",
              "Aug",
              "Sep",
              "Oct",
              "Nov",
              "Dec",
              ]
              if(this.state.Orders.length>0){
                var tempOrder = this.state.Orders
                var delDate =  this.state.DeliveryDate
                tempOrder.forEach(function(item){
                  item.details.forEach(function(itemx){
                      if(itemx.date==="Select Del Date"||itemx.date==delDate){
                        itemx.date=date.getDate()+" "+monthNames[date.getMonth()]+" "+date.getFullYear()
                        itemx.date2=date.getMonth()+"-"+date.getDate()+"-"+date.getFullYear()
                      }
                  })
                })
                this.setState({
                  Orders:tempOrder
                })
              }
            this.setState({
                DeliveryDatePickerVis:false,
                DeliveryDateColor:"#00334eDD",
                DeliveryDate:date.getDate()+" "+monthNames[date.getMonth()]+" "+date.getFullYear(),
                DeliveryDatex:date.getMonth()+"-"+date.getDate()+"-"+date.getFullYear(),
                DeliveryDate2:date.getDate()+" "+monthNames[date.getMonth()]+" "+date.getFullYear()
            })
        }}
        onCancel={()=>{
            this.setState({DeliveryDatePickerVis:false})
        }}
      />
      <DateTimePickerModal
        mode="date"
        isVisible={this.state.DeliveryDatePickerVis2}
        onConfirm={(date)=>{
            var monthNames= [
              "Jan",
              "Feb",
              "Mar",
              "Apr",
              "May",
              "Jun",
              "Jul",
              "Aug",
              "Sep",
              "Oct",
              "Nov",
              "Dec",
              ]

              var tempOrder = this.state.Orders
              tempOrder[this.state.Index].details[tempOrder[this.state.Index].details.findIndex(x => x===this.state.TempItem)].date = date.getDate()+" "+monthNames[date.getMonth()]+" "+date.getFullYear()
              tempOrder[this.state.Index].details[tempOrder[this.state.Index].details.findIndex(x => x===this.state.TempItem)].date2 = date.getMonth()+"-"+date.getDate()+"-"+date.getFullYear(),
              this.setState({
                DeliveryDatePickerVis2:false,
                Orders:tempOrder
            })
        }}
        onCancel={()=>{
          this.setState({
            DeliveryDatePickerVis2:false,
        })
        }}
      />                                    
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
  gridItem: {
    flex: 1,
    marginVertical: 5,
    // justifyContent: "flex-start",
    // alignItems: "flex-start",
    overflow: "hidden",
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
    width: Dimensions.get("window").width / 1.1,
  },
  label: {
    backgroundColor: "#f6f5f5",
    justifyContent: "flex-start",
    color: "#00334e",
    fontSize: 15,
    fontWeight: "bold",
    width: Dimensions.get("window").width / 1.8,
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
    marginTop: 40,
    color: Colors.primaryColor,
    fontSize: 20,
    fontWeight: "bold",
    borderRadius: 10,
    width: Dimensions.get("window").width / 1.1,
  },
  add: {
    fontFamily: "robotoRegular",
    textAlign: "center",
    marginTop:10,
    fontSize: 25,
    fontWeight:"bold",
    marginRight:25,
    backgroundColor: Colors.primaryColor,
    color: Colors.accentColor,
    borderRadius: 3,
    paddingHorizontal: 25,
    paddingVertical: 2,
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
    width: Dimensions.get("window").width / 1.1,
  },
  orderdeets: {
    borderWidth: 3,
    paddingLeft: 5,
    marginTop:10,
    alignContent:"center",justifyContent:"center",
    padding: 8,
    borderColor:Colors.primaryColor,
    fontSize: 20,
    fontWeight: "bold",
    borderRadius: 10,
    width: Dimensions.get("window").width / 1.1,
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
    width: Dimensions.get("window").width / 1.1,
  },
  inputx2: {
    borderBottomWidth: 2,
    borderColor: "#00334e80",
    marginTop: 10,
    color: Colors.primaryColor,
    fontSize: 20,
    fontWeight: "bold",
    minWidth: "30%",
    maxWidth: "50%",
    marginBottom:20,
  },
  button_container: {
    alignItems: "center",
    marginBottom:15,
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
    width: Dimensions.get("window").width / 1.1,
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

OrderEdit.navigationOptions = (navData) => {
  return {
    headerTitle: "Order Details",
    headerStyle: {
      backgroundColor: Colors.primaryColor,
    },
    headerTintColor: Colors.accentColor,
  };
};

export default OrderEdit;
