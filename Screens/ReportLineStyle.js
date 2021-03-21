import React, { useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  ScrollView,
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Alert,
  Platform,
} from "react-native";

import Colors from "../constants/colors";

import * as ScreenOrientation from 'expo-screen-orientation';
import { CheckBox } from "react-native-elements";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { AntDesign } from '@expo/vector-icons'; 
import { Octicons } from '@expo/vector-icons'; 
import DropDownPicker from 'react-native-dropdown-picker';

import DefectsStyleItem from "../components/DefectsStyleItem";
import colors from "../constants/colors";

class ReportLineStyle extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      userID: props.navigation.state.params.userID,
      alldata: props.navigation.state.params.alldata,
      companyID: props.navigation.state.params.companyID,
      style: props.navigation.state.params.style,
      styleID: props.navigation.state.params.id,
      lineID: props.navigation.state.params.lineID,
      lineName: "",
      processID:props.navigation.state.params.process,
      orderID: props.navigation.state.params.orderid,
      DefectList:[],
      FromDate:props.navigation.state.params.from,
      ToDate:props.navigation.state.params.to,
      FromDatex:null,
      OrderDatePickerVis:false,
      OrderDatePickerVis2:false,
      today:props.navigation.state.params.today,
      Order:"",
      Buyer:"",
      FrontURL:"",
      ProcessName:"",
      BackURL:"",
      Ok:null,
      Alter:null,
      Reject:null,
      Defect:null,
      showdata:false,
      dateRange: props.navigation.state.params.dateRange,
      dateRangex: props.navigation.state.params.dateRangex,
      custom: props.navigation.state.params.custom,
    };
  }

  getData=(daterange)=>{
    var alldata=this.state.alldata
    var line=this.state.lineID
    if(alldata){
      line=0
    }
    this.setState({
      loading: true,
    });
    console.log(JSON.stringify({
      basicparams: {
        companyID: this.state.companyID,
        userID: this.state.userID,
      },
      reportParams:{
        fromDate: "",
        toDate:"",
        daterange:daterange,
        styleID: this.state.styleID,
        lineID:line,
        orderID:this.state.orderID,
        processID:this.state.processID
      }
    }))
    fetch(
      "https://qualitylite.bluekaktus.com/api/bkQuality/reports/getStyleDefectsReport",
      {
        method: "POST",
        body: JSON.stringify({
          basicparams: {
            companyID: this.state.companyID,
            userID: this.state.userID,
          },
          reportParams:{
            fromDate: "",
            toDate:"",
            daterange:daterange,
            styleID: this.state.styleID,
            lineID:line,
            orderID:this.state.orderID,
            processID:this.state.processID
          }
        }),
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      }
    )
      .then((response) => response.json())
      .then((responseJson) => {
          console.log(responseJson)
          if(responseJson.result.length==0){
            Alert.alert("No Data Available for the Day")
            this.setState({
              loading:false,
              Ok:0,
              Reject:0,
              Defect:0,
              Alter:0,
              FrontURL:[],
              BackURL:[],
              DefectList:[]
            })
          }else{
        var temp=[]
        var i
        var frontURL=""
        var backURL=""
        for(i of responseJson.result[0].imageDetails){
            if(i.imageType=="FC"){
                frontURL=i.imageUrl
            }
            if(i.imageType=="BC"){
                backURL=i.imageUrl
            }
        }
        for(i of responseJson.result[0].defectsDetails){
            var tempx={Defect:i.defectsName,frequency:i.frequency,FrontDefects:[],BackDefects:[]}
            i.coordDetails.forEach(itemx=>{
                if(itemx.coord_type=="F"){
                  var tempxx={X:itemx.coord_X,
                              Y:itemx.coord_Y,
                            }
                  tempx.FrontDefects.push(tempxx)
                }
                if(itemx.coord_type=="B"){
                  var tempxx={X:itemx.coord_X,
                              Y:itemx.coord_Y,
                            }
                  tempx.BackDefects.push(tempxx)
                }
              }) 
            temp.push(tempx)
        }
        this.setState({
          loading: false,
          Order:responseJson.result[0].orderNo,
          Buyer:responseJson.result[0].brandName,
          Ok:responseJson.result[0].okPieces,
          Reject:responseJson.result[0].rejectedPieces,
          Defect:responseJson.result[0].defectedPieces,
          Alter:responseJson.result[0].alteredPieces,
          ProcessName:responseJson.result[0].processName,
          lineName:responseJson.result[0].lineName,
          Line:responseJson.result[0].lineName,
          FrontURL:frontURL,
          BackURL:backURL,
          DefectList:temp
        });
      }
      })
      .catch((error) => console.log(error)); //to catch the errors if any
  };


  getDatax=()=>{
    var alldata=this.state.alldata
    var line=this.state.lineID
    if(alldata){
      line=0
    }
    this.setState({
      loading: true,
    });
    console.log(JSON.stringify({
      basicparams: {
        companyID: this.state.companyID,
        userID: this.state.userID,
      },
      reportParams:{
        fromDate: this.state.FromDate+" 00:00:00",
        toDate:this.state.ToDate+" 23:59:59",
        daterange:"",
        styleID: this.state.styleID,
        lineID:line,
        orderID:this.state.orderID,
        processID:this.state.processID
      }
    }))
    fetch(
      "https://qualitylite.bluekaktus.com/api/bkQuality/reports/getStyleDefectsReport",
      {
        method: "POST",
        body: JSON.stringify({
          basicparams: {
            companyID: this.state.companyID,
            userID: this.state.userID,
          },
          reportParams:{
            fromDate: this.state.FromDate+" 00:00:00",
            toDate:this.state.ToDate+" 23:59:59",
            daterange:"",
            styleID: this.state.styleID,
            lineID:line,
            orderID:this.state.orderID,
            processID:this.state.processID
          }
        }),
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      }
    )
      .then((response) => response.json())
      .then((responseJson) => {
          console.log(responseJson)
          if(responseJson.result.length==0){
            Alert.alert("No Data Available for the Day")
            this.setState({
              loading:false,
              Ok:0,
              Reject:0,
              Defect:0,
              Alter:0,
              FrontURL:[],
              BackURL:[],
              DefectList:[]
            })
          }else{
        var temp=[]
        var i
        var frontURL=""
        var backURL=""
        for(i of responseJson.result[0].imageDetails){
            if(i.imageType=="FC"){
                frontURL=i.imageUrl
            }
            if(i.imageType=="BC"){
                backURL=i.imageUrl
            }
        }
        for(i of responseJson.result[0].defectsDetails){
            var tempx={Defect:i.defectsName,frequency:i.frequency,FrontDefects:[],BackDefects:[]}
            i.coordDetails.forEach(itemx=>{
                if(itemx.coord_type=="F"){
                  var tempxx={X:itemx.coord_X,
                              Y:itemx.coord_Y,
                            }
                  tempx.FrontDefects.push(tempxx)
                }
                if(itemx.coord_type=="B"){
                  var tempxx={X:itemx.coord_X,
                              Y:itemx.coord_Y,
                            }
                  tempx.BackDefects.push(tempxx)
                }
              }) 
            temp.push(tempx)
        }
        this.setState({
          loading: false,
          Order:responseJson.result[0].orderNo,
          Buyer:responseJson.result[0].brandName,
          Ok:responseJson.result[0].okPieces,
          Reject:responseJson.result[0].rejectedPieces,
          Defect:responseJson.result[0].defectedPieces,
          Alter:responseJson.result[0].alteredPieces,
          ProcessName:responseJson.result[0].processName,
          lineName:responseJson.result[0].lineName,
          Line:responseJson.result[0].lineName,
          FrontURL:frontURL,
          BackURL:backURL,
          DefectList:temp
        });
      }
      })
      .catch((error) => console.log(error)); //to catch the errors if any
  };


  componentDidMount() {
    this.setState({
      loading:true
    })
    async function changeScreenOrientation() {
        await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE_LEFT);
      }
    changeScreenOrientation()
    if(this.state.custom){
      this.getDatax()
    }else{
        this.getData(this.state.dateRangex)
    }
  }

  renderGridItem = (itemData) => {
    return (
      <DefectsStyleItem
        Defect={itemData.item.Defect}
        Frequency={itemData.item.frequency}
        FrontURL={this.state.FrontURL}
        BackURL={this.state.BackURL}
        FrontDefects={itemData.item.FrontDefects}
        BackDefects={itemData.item.BackDefects}
        // assigned={itemData.item.ASSIGNED_TO_NAME}
        // commitdate={itemData.item.TARGET_COMMIT_DATE}
        // completedate={itemData.item.ACTIVITY_COMPLETE_DATE}
      />
    );
  };


  render() {
    if(this.state.loading){
      return(
        <View style={styles.screen}>
          <ActivityIndicator size="large" color={Colors.primaryColor} />
        </View>
      )
    }
    else
    {
      return (
        <View style={styles.screen}>
        <ScrollView>
          <View style={{flexDirection:"row",marginBottom:5}}>
          <DropDownPicker
                      items={[
                          {label: 'Today', value: 'today', icon: () => null},
                          {label: 'Yesterday', value: 'yesterday', icon: () =>null },
                          {label: 'Last 7 Days', value: 'lastSevenDays', icon: () =>null},
                          {label: 'Last 30 Days', value: 'lastThirtyDays', icon: () =>null},
                          {label: 'Custom', value: 'custom', icon: () =>null},
                      ]}
                      placeholder={this.state.dateRange}
                      containerStyle={{height: 40, width:140,alignSelf:"flex-start",marginTop:5,marginLeft:10}}
                      placeholderStyle={{
                        fontWeight: 'bold',
                        textAlign: 'left',
                        fontSize:20,
                        color:Colors.primaryColor
                    }}
                    labelStyle={{
                      fontSize: 16,
                      textAlign: 'left',
                      color: '#00334eAA'
                  }}
                      style={{backgroundColor: '#fafafa'}}
                      itemStyle={{
                          justifyContent: 'flex-start'
                      }}
                      dropDownStyle={{backgroundColor: '#fafafa'}}
                      onChangeItem={item =>{if(item.label!="Custom"){
                            this.setState({
                              custom:false,
                              dateRange:item.label,
                              dateRangex:item.value
                            })
                            this.getData(item.value)
                      }
                      else{
                        this.setState({
                          custom:true,
                          dateRange:item.label,
                          dateRangex:item.value
                        })
                      }
                    }}
                  />
                        <View style={{flexDirection:"row"}}>
                        {this.state.custom ? (
                          <View style={{flexDirection:"row"}}>
                            <View style={{fontWeight:"bold",fontSize:25,backgroundColor:Colors.primaryColor,color:"#FFFFFF",
                                          borderRadius:10,width:200,marginLeft:5,marginVertical:5,
                                          justifyContent:"center"}}>
                              <View style={{flexDirection:"row", justifyContent:"space-evenly",}}>
                                  <Text  style={{
                                              fontSize: 16,
                                              fontWeight: "bold",
                                              color:"#FFFFFF"
                                              }}>From:
                                  </Text>
                                  <Text style={{
                                          fontSize: 16,
                                          fontWeight: "bold",
                                          color:"#FFFFFF"
                                          }}>{this.state.FromDate}
                                  </Text>
                                  <TouchableOpacity style={{alignContent:"flex-end",alignItems:"flex-end",alignSelf:"center",}} onPress={()=>{
                                      this.setState({OrderDatePickerVis:true})
                                  }}>
                                      <AntDesign name="calendar" size={20} color={"#FFFFFF"} />
                                  </TouchableOpacity>
                                </View>
                            </View>

                              <View style={{fontWeight:"bold",fontSize:25,backgroundColor:Colors.primaryColor,color:"#FFFFFF",
                                                        borderRadius:10,width:200,marginLeft:5,marginVertical:5,
                                                        paddingLeft:8,paddingRight:8,justifyContent:"center"}}>
                                            <View style={{flexDirection:"row", justifyContent:"space-evenly",}}>
                                                <Text  style={{
                                                            fontSize: 16,
                                                            fontWeight: "bold",
                                                            color:"#FFFFFF"
                                                            }}>To:
                                                </Text>
                                                <Text style={{
                                                        fontSize: 16,
                                                        fontWeight: "bold",
                                                        color:"#FFFFFF"
                                                        }}>{this.state.ToDate}
                                                </Text>
                                                <TouchableOpacity style={{alignContent:"flex-end",alignItems:"flex-end",alignSelf:"center",}} onPress={()=>{
                                                    this.setState({OrderDatePickerVis2:true})
                                                }}>
                                                    <AntDesign name="calendar" size={20} color={"#FFFFFF"} />
                                                </TouchableOpacity>
                                  </View>
                              </View>
                            </View>
                          ):null}
                        </View>
                    </View>
                    <View flexDirection={"row"} style={{backgroundColor:Colors.primaryColor,justifyContent:"space-between",borderRadius:8,marginHorizontal:10}}>
                        <Text style={styles.header}>{this.state.style}</Text>   
                        <Text style={styles.header}>{this.state.Order}</Text>
                        <Text style={styles.header}>{this.state.Buyer}</Text>    
                        <Text style={styles.header}>{this.state.lineName}</Text>     
                        <Text style={styles.header}>{this.state.ProcessName}</Text>          
                    </View>

                    <View flexDirection={"row"} style={{borderRadius:8,justifyContent:"space-between",marginHorizontal:10}}>
                        <Text style={styles.headerOK} >{"OK:"+this.state.Ok}</Text>   
                        <Text style={styles.headerAlter}>{"Alter:"+this.state.Alter}</Text>
                        <Text style={styles.headerDef}>{"Def:"+this.state.Defect}</Text>    
                        <Text style={styles.headerRej}>{"Rej :"+this.state.Reject}</Text>          
                    </View>
                    {this.state.alldata?(<Text style={{marginLeft:25,fontSize:15,fontWeight:"bold",color:Colors.primaryColor}}>**Data Across ALL LINES</Text>):null}
                    <View flexDirection={"row"} 
                        style={{justifyContent:"space-between",borderRadius:8,marginHorizontal:10}}>
                        <Text style={styles.headerx}>{"Defect"}</Text>   
                        <Text style={styles.headerxx}>{"Frequency"}</Text>          
                    </View>
                    <FlatList
                        keyExtractor={(item, index) => item.Defect }
                        extraData={this.state.DefectList}
                        style={{marginHorizontal:10,marginBottom:20}}
                        data={this.state.DefectList}
                        renderItem={this.renderGridItem}
                        numColumns={1}
                      />        
                </ScrollView>
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
                  FromDatex:date,
                  FromDate:date.getDate()+"-"+monthNames[date.getMonth()]+"-"+date.getFullYear(),
              })
          }}
          onCancel={()=>{
              this.setState({OrderDatePickerVis:false})
          }}
      />

<DateTimePickerModal
          isVisible={this.state.OrderDatePickerVis2}
          minimumDate={this.state.FromDatex}
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
                  OrderDatePickerVis2:false,
                  FromDateX:date,
                  ToDate:date.getDate()+"-"+monthNames[date.getMonth()]+"-"+date.getFullYear(),
              },()=>{
                this.getDatax()
              })
              
          }}
          onCancel={()=>{
              this.setState({OrderDatePickerVis2:false})
          }}
      />
        </View>
      );
    }
  }
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  dataWrapper: {
    marginTop: -1,
  },
  header:{
      fontSize:20,
      color:"#fff",
      paddingVertical:4,
      marginHorizontal:8,
      width:130,
      textAlign:"center",
      fontWeight:"bold"
  },
  headerx:{
    fontSize:20,
    color:Colors.primaryColor,
    paddingVertical:4,
    paddingLeft:8,
    marginHorizontal:8,
    width:Dimensions.get("window").width/2,
    textAlign:"left",
    fontWeight:"bold"
},
headerxx:{
    fontSize:20,
    color:Colors.primaryColor,
    paddingVertical:4,
    paddingRight:8,
    marginHorizontal:8,
    width:Dimensions.get("window").width/3,
    textAlign:"right",
    fontWeight:"bold"
},
  headerOK:{
    fontSize:20,
    paddingVertical:4,
    color:"#49b675",
    marginHorizontal:8,
    width:Dimensions.get("window").width/4.5,
    textAlign:"center",
    fontWeight:"bold"
},
headerAlter:{
    fontSize:20,
    paddingVertical:4,
    color:"#20a2eb",
    marginHorizontal:8,
    width:Dimensions.get("window").width/4.5,
    textAlign:"center",
    fontWeight:"bold"
},
headerDef:{
    fontSize:20,
    paddingVertical:4,
    color:"#ffae42",
    marginHorizontal:8,
    width:Dimensions.get("window").width/4.5,
    textAlign:"center",
    fontWeight:"bold"
},
headerRej:{
    fontSize:20,
    paddingVertical:4,
    color:"#e94560",
    marginHorizontal:8,
    width:Dimensions.get("window").width/4.5,
    textAlign:"center",
    fontWeight:"bold"
},
  gridItem: {
    flex: 1,
    marginHorizontal: 3,
    marginTop:5,
  },
});

ReportLineStyle.navigationOptions = (navData) => {
    return {
        headerTitle: "Reports",
        headerStyle: {
          backgroundColor: Colors.primaryColor,
        },
        headerTintColor: Colors.accentColor,
      };
    };

export default ReportLineStyle;
