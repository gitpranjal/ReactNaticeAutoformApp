import React from "react"
import { Animated, ActivityIndicator, FlatList, ScrollView, StyleSheet, Text, View,Dimensions,TouchableOpacity } from "react-native"

import {
    VictoryBar,
    VictoryChart,
    VictoryTheme,
    VictoryLabel,
    VictoryAxis,
    VictoryScatter,
    VictoryLine,
  } from "victory-native";

  
import Colors from "../constants/colors";

import * as ScreenOrientation from 'expo-screen-orientation';
import DropDownPicker from 'react-native-dropdown-picker';

class VisualReportsProcess extends React.Component {
  constructor(props) {
    super(props);
    console.log(props)
    this.state = {
      loading: false,
      processes:[],
      selectedprocess:"",
      selectedprocessid:0,
      selectedvalue:"Pcs Pending",
      FromDate:props.navigation.state.params.FromDate,
      ToDate:props.navigation.state.params.ToDate,
      process:props.navigation.state.params.process,
      FromDatex:null,
      pcspending:[],
      pcsok:[],
      pcsalter:[],
      pcsrej:[],
      dhu:[],
      pcspendinglab:[],
      pcsoklab:[],
      pcsalterlab:[],
      pcsrejlab:[],
      dhulab:[],
      data:[],
      label:[],
      OrderDatePickerVis:false,
      OrderDatePickerVis2:false,
      linecolor:"#698bd0",
      today:props.navigation.state.params.today,
      userID: props.navigation.state.params.userID,
      companyID: props.navigation.state.params.companyID,
      dateRange: props.navigation.state.params.dateRange,
      dateRangex: props.navigation.state.params.dateRangex,
      custom: props.navigation.state.params.custom,
      styleName: props.navigation.state.params.style,
      styleID: props.navigation.state.params.styleID,
      orderID: props.navigation.state.params.orderid,
      lineID: props.navigation.state.params.lineID,
      lineName: props.navigation.state.params.lineName,
      alldata: props.navigation.state.params.alldata,
    };
    
  }


  getDatax=()=>{
    // this.setState({
    //   loading: true,
    // });
    console.log(
      JSON.stringify({
        basicparams: {
          companyID: this.state.companyID,
          userID: this.state.userID,
        },
        reportParams:{
          fromDate: this.state.FromDate,
          toDate: this.state.ToDate,
          dateRange:"",
          processID:this.state.selectedprocessid,
          styleID:this.state.styleID,
          orderID:this.state.orderID,
          locationID: this.state.lineID,
          locationLevel:"PROCESS"
        }
      })
    )
    fetch(
      "https://qualitylite.bluekaktus.com/api/bkQuality/reports/getLocationLevelVisualReport",
      {
        method: "POST",
        body:   JSON.stringify({
            basicparams: {
                companyID: this.state.companyID,
                userID: this.state.userID,
              },
              reportParams:{
                fromDate: this.state.FromDate,
                toDate: this.state.ToDate,
                dateRange:"",
                processID:this.state.selectedprocessid,
                styleID:this.state.styleID,
                orderID:this.state.orderID,
                locationID: this.state.lineID,
                locationLevel:"PROCESS"
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
        var pending=[]
        var ok=[]
        var alter=[]
        var rej=[]
        var dhu=[]
        var pendinglab=[]
        var oklab=[]
        var alterlab=[]
        var rejlab=[]
        var dhulab=[]
        var showdata=[]
        var showlabel=[]
        var linecolor="#698bd0"
        responseJson.result[0].locationDetails.forEach(function (item, index) {
            pending.push({x:item.date,y:item.pendingPieces})
            ok.push({x:item.date,y:item.okPieces})
            alter.push({x:item.date,y:item.pcsInAlteration})
            rej.push({x:item.date,y:item.rejectedPieces})
            dhu.push({x:item.date,y:item.dhuValue})
            pendinglab.push(item.pendingPieces)
            oklab.push(item.okPieces)
            alterlab.push(item.pcsInAlteration)
            rejlab.push(item.rejectedPieces)
            dhulab.push(item.dhu)
          });
          if(this.state.selectedvalue=="Pcs Pending"){
              showdata=pending
              showlabel=pendinglab
              linecolor="#698bd0"
          }else if(this.state.selectedvalue=="Ok Pcs"){
            showdata=ok
            showlabel=oklab
            linecolor="#49b675"
          }else if(this.state.selectedvalue=="Pcs in Alter"){
            showdata=alter
            showlabel=alterlab
            linecolor="#fce903"
          }else if(this.state.selectedvalue=="Pcs Rejected"){
            showdata=rej
            showlabel=rejlab
            linecolor="#e71837"
          }else if(this.state.selectedvalue=="DHU%"){
            showdata=dhu
            showlabel=dhulab
            linecolor="#ffaa00"
          }

          this.setState({
              pcspending:pending,
              pcsok:ok,
              pcsalter:alter,
              pcsrej:rej,
              dhu:dhu,
              pcspendinglab:pendinglab,
              pcsoklab:oklab,
              pcsalterlab:alterlab,
              pcsrejlab:rejlab,
              dhulab:dhulab,
              loading:false,
              data:showdata,
              label:showlabel,
              linecolor:linecolor
          })
      })
      .catch((error) => console.log(error)); //to catch the errors if any
  };

  getAllDatax=()=>{
    // this.setState({
    //   loading: true,
    // });
    console.log(
      JSON.stringify({
        basicparams: {
          companyID: this.state.companyID,
          userID: this.state.userID,
        },
        reportParams:{
          fromDate: this.state.FromDate,
          toDate: this.state.ToDate,
          dateRange:"",
          processID:this.state.selectedprocessid,
          styleID:this.state.styleID,
          orderID:this.state.orderID,
          // locationID: this.state.lineID,
          locationLevel:"PROCESS"
        }
      })+"--- AlldataX"
    )
    fetch(
      "https://qualitylite.bluekaktus.com/api/bkQuality/reports/getLocationLevelVisualReport",
      {
        method: "POST",
        body:   JSON.stringify({
            basicparams: {
                companyID: this.state.companyID,
                userID: this.state.userID,
              },
              reportParams:{
                fromDate: this.state.FromDate,
                toDate: this.state.ToDate,
                dateRange:"",
                processID:this.state.selectedprocessid,
                styleID:this.state.styleID,
                orderID:this.state.orderID,
                // locationID: this.state.lineID,
                locationLevel:"PROCESS"
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
        var pending=[]
        var ok=[]
        var alter=[]
        var rej=[]
        var dhu=[]
        var pendinglab=[]
        var oklab=[]
        var alterlab=[]
        var rejlab=[]
        var dhulab=[]
        var showdata=[]
        var showlabel=[]
        var linecolor="#698bd0"
        responseJson.result[0].locationDetails.forEach(function (item, index) {
            pending.push({x:item.date,y:item.pendingPieces})
            ok.push({x:item.date,y:item.okPieces})
            alter.push({x:item.date,y:item.pcsInAlteration})
            rej.push({x:item.date,y:item.rejectedPieces})
            dhu.push({x:item.date,y:item.dhuValue})
            pendinglab.push(item.pendingPieces)
            oklab.push(item.okPieces)
            alterlab.push(item.pcsInAlteration)
            rejlab.push(item.rejectedPieces)
            dhulab.push(item.dhu)
          });
          if(this.state.selectedvalue=="Pcs Pending"){
              showdata=pending
              showlabel=pendinglab
              linecolor="#698bd0"
          }else if(this.state.selectedvalue=="Ok Pcs"){
            showdata=ok
            showlabel=oklab
            linecolor="#49b675"
          }else if(this.state.selectedvalue=="Pcs in Alter"){
            showdata=alter
            showlabel=alterlab
            linecolor="#fce903"
          }else if(this.state.selectedvalue=="Pcs Rejected"){
            showdata=rej
            showlabel=rejlab
            linecolor="#e71837"
          }else if(this.state.selectedvalue=="DHU%"){
            showdata=dhu
            showlabel=dhulab
            linecolor="#ffaa00"
          }

          this.setState({
              pcspending:pending,
              pcsok:ok,
              pcsalter:alter,
              pcsrej:rej,
              dhu:dhu,
              pcspendinglab:pendinglab,
              pcsoklab:oklab,
              pcsalterlab:alterlab,
              pcsrejlab:rejlab,
              dhulab:dhulab,
              loading:false,
              data:showdata,
              label:showlabel,
              linecolor:linecolor
          })
      })
      .catch((error) => console.log(error)); //to catch the errors if any
  };

 
  getData=(daterange)=>{
    this.setState({
      loading: true,
    });
    console.log(
      JSON.stringify({
        basicparams: {
          companyID: this.state.companyID,
          userID: this.state.userID,
        },
        reportParams:{
          fromDate: "",
          toDate: "",
          dateRange:daterange,
          processID:this.state.selectedprocessid,
          styleID:this.state.styleID,
          orderID:this.state.orderID,
          locationID: this.state.lineID,
          locationLevel:"PROCESS"
        }
      })
    )
    fetch(
      "https://qualitylite.bluekaktus.com/api/bkQuality/reports/getLocationLevelVisualReport",
      {
        method: "POST",
        body:   JSON.stringify({
            basicparams: {
              companyID: this.state.companyID,
              userID: this.state.userID,
            },
            reportParams:{
              fromDate: "",
              toDate: "",
              dateRange:daterange,
              processID:this.state.selectedprocessid,
              styleID:this.state.styleID,
              orderID:this.state.orderID,
              locationID: this.state.lineID,
              locationLevel:"PROCESS"
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
        var pending=[]
        var ok=[]
        var alter=[]
        var rej=[]
        var dhu=[]
        var pendinglab=[]
        var oklab=[]
        var alterlab=[]
        var rejlab=[]
        var dhulab=[]
        var showdata=[]
        var showlabel=[]
        var linecolor="#698bd0"
        responseJson.result[0].locationDetails.forEach(function (item, index) {
            pending.push({x:item.date,y:item.pendingPieces})
            ok.push({x:item.date,y:item.okPieces})
            alter.push({x:item.date,y:item.pcsInAlteration})
            rej.push({x:item.date,y:item.rejectedPieces})
            dhu.push({x:item.date,y:item.dhuValue})
            pendinglab.push(item.pendingPieces)
            oklab.push(item.okPieces)
            alterlab.push(item.pcsInAlteration)
            rejlab.push(item.rejectedPieces)
            dhulab.push(item.dhu)
          });
          if(this.state.selectedvalue=="Pcs Pending"){
              showdata=pending
              showlabel=pendinglab
              linecolor="#698bd0"
          }else if(this.state.selectedvalue=="Ok Pcs"){
            showdata=ok
            showlabel=oklab
            linecolor="#49b675"
          }else if(this.state.selectedvalue=="Pcs in Alter"){
            showdata=alter
            showlabel=alterlab
            linecolor="#fce903"
          }else if(this.state.selectedvalue=="Pcs Rejected"){
            showdata=rej
            showlabel=rejlab
            linecolor="#e71837"
          }else if(this.state.selectedvalue=="DHU%"){
            showdata=dhu
            showlabel=dhulab
            linecolor="#ffaa00"
          }

          this.setState({
              pcspending:pending,
              pcsok:ok,
              pcsalter:alter,
              pcsrej:rej,
              dhu:dhu,
              pcspendinglab:pendinglab,
              pcsoklab:oklab,
              pcsalterlab:alterlab,
              pcsrejlab:rejlab,
              dhulab:dhulab,
              data:showdata,
              label:showlabel,
              loading:false,
              linecolor:linecolor
          })
      })
      .catch((error) => console.log(error)); //to catch the errors if any
  };


  getAllData=(daterange)=>{
    this.setState({
      loading: true,
    });
    console.log(
      JSON.stringify({
        basicparams: {
          companyID: this.state.companyID,
          userID: this.state.userID,
        },
        reportParams:{
          fromDate: "",
          toDate: "",
          dateRange:daterange,
          processID:this.state.selectedprocessid,
          styleID:this.state.styleID,
          orderID:this.state.orderID,
          // locationID: this.state.lineID,
          locationLevel:"PROCESS"
        }
      })+"--- AlldataX"
    )
    fetch(
      "https://qualitylite.bluekaktus.com/api/bkQuality/reports/getLocationLevelVisualReport",
      {
        method: "POST",
        body:   JSON.stringify({
            basicparams: {
              companyID: this.state.companyID,
              userID: this.state.userID,
            },
            reportParams:{
              fromDate: "",
              toDate: "",
              dateRange:daterange,
              processID:this.state.selectedprocessid,
              styleID:this.state.styleID,
              orderID:this.state.orderID,
              // locationID: this.state.lineID,
              locationLevel:"PROCESS"
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
        var pending=[]
        var ok=[]
        var alter=[]
        var rej=[]
        var dhu=[]
        var pendinglab=[]
        var oklab=[]
        var alterlab=[]
        var rejlab=[]
        var dhulab=[]
        var showdata=[]
        var showlabel=[]
        var linecolor="#698bd0"
        responseJson.result[0].locationDetails.forEach(function (item, index) {
            pending.push({x:item.date,y:item.pendingPieces})
            ok.push({x:item.date,y:item.okPieces})
            alter.push({x:item.date,y:item.pcsInAlteration})
            rej.push({x:item.date,y:item.rejectedPieces})
            dhu.push({x:item.date,y:item.dhuValue})
            pendinglab.push(item.pendingPieces)
            oklab.push(item.okPieces)
            alterlab.push(item.pcsInAlteration)
            rejlab.push(item.rejectedPieces)
            dhulab.push(item.dhu)
          });
          if(this.state.selectedvalue=="Pcs Pending"){
              showdata=pending
              showlabel=pendinglab
              linecolor="#698bd0"
          }else if(this.state.selectedvalue=="Ok Pcs"){
            showdata=ok
            showlabel=oklab
            linecolor="#49b675"
          }else if(this.state.selectedvalue=="Pcs in Alter"){
            showdata=alter
            showlabel=alterlab
            linecolor="#fce903"
          }else if(this.state.selectedvalue=="Pcs Rejected"){
            showdata=rej
            showlabel=rejlab
            linecolor="#e71837"
          }else if(this.state.selectedvalue=="DHU%"){
            showdata=dhu
            showlabel=dhulab
            linecolor="#ffaa00"
          }

          this.setState({
              pcspending:pending,
              pcsok:ok,
              pcsalter:alter,
              pcsrej:rej,
              dhu:dhu,
              pcspendinglab:pendinglab,
              pcsoklab:oklab,
              pcsalterlab:alterlab,
              pcsrejlab:rejlab,
              dhulab:dhulab,
              data:showdata,
              label:showlabel,
              loading:false,
              linecolor:linecolor
          })
      })
      .catch((error) => console.log(error)); //to catch the errors if any
  };


    componentDidMount() {
    async function changeScreenOrientation() {
        await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE_LEFT);
      }
    changeScreenOrientation()
    var Processes=[]
    this.state.process.forEach(function (item, index) {
        Processes.push({label:item.val,value:item.id})
      });

      this.setState({
          processes:Processes,
          selectedprocess:Processes[0].label,
          selectedprocessid:Processes[0].value
      },()=>{
        if(this.state.custom){
          if(this.state.alldata){
            this.getAllDatax()
          }else{
            this.getDatax()
          }
          }else{
            if(this.state.alldata){
              this.getAllData(this.state.dateRangex)
            }else{
              this.getData(this.state.dateRangex)
          }
        }
      })
     
    
  }

  render () {
    if (this.state.loading) {
        return (
          <View style={styles.loader}>
            <ActivityIndicator size="large" color={Colors.primaryColor} />
          </View>
        );
      }else{
      return (
        <View style={{flex:1}}>
            <View style={{flexDirection:"row",height:40,backgroundColor:"#698bd0",}}>
              {this.state.alldata?(
                            <Text style={{fontWeight:"bold",fontSize:24,color:"#FFFFFF",marginLeft:25,textAlignVertical:"center"}}>
                            {this.state.styleName}</Text>):
                            (            
                            <Text style={{fontWeight:"bold",fontSize:24,color:"#FFFFFF",marginLeft:25,textAlignVertical:"center"}}>
                            {this.state.lineName+"   "+this.state.styleName}</Text>)
              }
            </View>
            
            <View style={{flexDirection:"row"}}>
            <DropDownPicker
                    items={[
                        {label: 'Today', value: 'today', icon: () => null},
                        {label: 'Yesterday', value: 'yesterday', icon: () =>null },
                        {label: 'Last 7 Days', value: 'lastSevenDays', icon: () =>null},
                        {label: 'Last 30 Days', value: 'lastThirtyDays', icon: () =>null},
                        {label: 'Custom', value: 'custom', icon: () =>null},
                    ]}
                    placeholder={this.state.dateRange}
                    containerStyle={{height: 40, width:220,marginTop:5,marginLeft:10,marginBottom:5}}
                    placeholderStyle={{
                      fontWeight: 'bold',
                      textAlign: 'left',
                      fontSize:20,
                      color:Colors.primaryColor,
                  }}
                  labelStyle={{
                    fontSize: 16,
                    textAlign: 'left',
                    color: '#00334eAA'
                }}
                selectedLabelStyle={{
                    fontWeight: 'bold',
                    textAlign: 'left',
                    fontSize:20,
                    color:Colors.primaryColor
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
                            dateRangex:item.value,
                          })
                          if(this.state.alldata){
                            this.getAllData(item.value)
                          }else{
                            this.getData(item.value)
                          }
                         
                    }
                    else{
                      this.setState({
                        custom:true
                      })
                    }
                  }}
                />
                <DropDownPicker
                         items={this.state.processes}
                        placeholder={this.state.selectedprocess}
                        containerStyle={{height: 40, width:220,marginTop:5,marginLeft:10}}
                        placeholderStyle={{
                            fontWeight: 'bold',
                            textAlign: 'left',
                            fontSize:20,
                            color:Colors.primaryColor
                        }}
                        labelStyle={{
                        fontSize: 14,
                        textAlign: 'left',
                        color: '#00334eAA'
                    }}
                    selectedLabelStyle={{
                        fontWeight: 'bold',
                        textAlign: 'left',
                        fontSize:20,
                        color:Colors.primaryColor
                    }}
                        style={{backgroundColor: '#fafafa'}}
                        itemStyle={{
                            justifyContent: 'flex-start'
                        }}
                        dropDownStyle={{backgroundColor: '#fafafa'}}
                        onChangeItem={item =>{
                                this.setState({
                                selectedprocess:item.label,
                                selectedprocessid:item.value,
                                },()=>{
                                    if(this.state.custom){
                                      if(this.state.alldata){
                                        this.getAllDatax()
                                      }else{
                                        this.getDatax()
                                      }
                                        
                                    }
                                    else{
                                      if(this.state.alldata){
                                        this.getAllData(this.state.dateRangex)
                                      }else{
                                        this.getData(this.state.dateRangex)
                                      }
                                        
                                    }
                                    })
                        }}
                    />
           <DropDownPicker
              items={[{label:"Pcs Pending",val:"pending"},
              {label:"Ok Pcs",val:"ok"},
              {label:"Pcs in Alter",val:"alter"},
              {label:"Pcs Rejected",val:"rej"},
              {label:"DHU%",val:"dhu"},]}
              placeholder={this.state.selectedvalue}
              containerStyle={{height: 40, width:180,marginTop:5,marginLeft:10}}
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
          selectedLabelStyle={{
            fontWeight: 'bold',
            textAlign: 'left',
            fontSize:20,
            color:Colors.primaryColor
        }}
              style={{backgroundColor: '#fafafa'}}
              itemStyle={{
                  justifyContent: 'flex-start'
              }}
              dropDownStyle={{backgroundColor: '#fafafa'}}
              onChangeItem={item =>{
                  if(item.val=="pending"){
                    this.setState({
                        selectedvalue:item.label,
                        data:this.state.pcspending,
                        label:this.state.pcspendinglab,
                        linecolor:"#698bd0"
                      })
                  }else  if(item.val=="ok"){
                    this.setState({
                        selectedvalue:item.label,
                        data:this.state.pcsok,
                        linecolor:"#49b675",
                        label:this.state.pcsoklab
                      })
                  }else  if(item.val=="alter"){
                    this.setState({
                        selectedvalue:item.label,
                        data:this.state.pcsalter,
                        linecolor:"#fce903",
                        label:this.state.pcsalterlab
                      })
                  }else  if(item.val=="rej"){
                    this.setState({
                        selectedvalue:item.label,
                        data:this.state.pcsrej,
                        linecolor:"#e71837",
                        label:this.state.pcsrejlab
                      })
                  }else  if(item.val=="dhu"){
                    this.setState({
                        selectedvalue:item.label,
                        data:this.state.dhu,
                        linecolor:"#ffaa00",
                        label:this.state.dhulab
                      })
                  }
                   
            }}
          />
            </View>
            <View style={{flex:1,flexDirection:"row"}}>
            <View style={{marginTop:35}}>
            
            </View>
            <View style={{marginLeft:10,flex:1,}}>
                <View style={{ padding: 5 }}>
                <ScrollView horizontal={true}>
                <VictoryChart animate={{ duration: 500 }} minDomain={{ y: 0 }} height={Dimensions.get("window").height*0.6} width={Dimensions.get("window").width}  domainPadding={{ x: 20, y:0 }} marginBottom={10}>
                    <VictoryLine
                   style={{
                       padding:10,
                    data: { stroke:this.state.linecolor,strokeWidth:5,},
                    
                    parent: { border: "1px solid #ccc"}
                  }}
                //   interpolation="natural"
                    data={this.state.data}
                    alignment="middle"
                   
                    cornerRadius={4}
                    />
                   <VictoryScatter data={this.state.data}
                            size={5}
                            style={{ data: { fill: "#698bd0" } }}
                            labels={this.state.label}
                            labelComponent={
                                <VictoryLabel
                                animate={{
                                    duration: 2000,
                                    onLoad: { duration: 1000 },
                                }}
                                style={{ fill: "#698bd0", fontSize: 13
                             }}
                                />
                            }
                        />        
                    <VictoryAxis
                    fixLabelOverlap
                    style={{
                        axis: { stroke: "#3c67bf",strokeWidth:2 },
                        axisLabel: { fontSize: 14, padding: 30,fontWeight:"bold", fill: "#3c67bf" },
                        label: { fill: "#3c67bf" },

                        ticks: { stroke: "#3c67bf", size: 5 },
                        tickLabels: { fill: "#3c67bf", fontSize: 10, padding:1,fontWeight:"bold" },
                    }}
                    />
                </VictoryChart>
                </ScrollView>
            </View>
            </View>
          </View>        
        </View>       
      )
    }
  }
}
 
  const styles = StyleSheet.create({
    screen: {
      flex: 1,
      flexDirection: "column",
      // justifyContent: "center",
      // alignItems: "center",
      backgroundColor: "#f6f5f5",
    },
    gridItem: {
      flex: 1,
      margin: 5,
      height: 150,
    },
    dateheader:{
        fontSize:20,
        paddingVertical:3,
        marginLeft:25,
        fontWeight:"bold",
        color:"#FFFFFF"
    }
  });

VisualReportsProcess.navigationOptions = (navData) => {
  return {
    headerTitle: "Reports",
    headerStyle: {
      backgroundColor: Colors.primaryColor,
    },
    headerTintColor: Colors.accentColor,
  };
};

export default VisualReportsProcess;
