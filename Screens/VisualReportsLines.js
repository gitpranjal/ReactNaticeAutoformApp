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

class VisualReportsLines extends React.Component {
  constructor(props) {
    super(props);
    console.log(props)
    this.state = {
      loading: false,
      lines:[],
      selectedline:"",
      selectedlineid:0,
      selectedvalue:"Pcs Produced",
      FromDate:props.navigation.state.params.FromDate,
      ToDate:props.navigation.state.params.ToDate,
      line:props.navigation.state.params.line,
      FromDatex:null,
      pcsprod:[],
      pcsstitched:[],
      pcsalter:[],
      pcsrej:[],
      dhu:[],
      pcsprodlab:[],
      pcsstitchedlab:[],
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
          locationID: this.state.selectedlineid,
          locationLevel:"LINE"
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
                locationID: this.state.selectedlineid,
                locationLevel:"LINE"
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
        var produced=[]
        var stitched=[]
        var alter=[]
        var rej=[]
        var dhu=[]
        var producedlab=[]
        var stitchedlab=[]
        var alterlab=[]
        var rejlab=[]
        var dhulab=[]
        var showdata=[]
        var showlabel=[]
        var linecolor="#698bd0"
        console.log(responseJson)
        responseJson.result[0].locationDetails.forEach(function (item, index) {
            produced.push({x:item.date,y:item.producedPieces})
            stitched.push({x:item.date,y:item.stitchedPieces})
            alter.push({x:item.date,y:item.pcsInAlteration})
            rej.push({x:item.date,y:item.rejectedPieces})
            dhu.push({x:item.date,y:item.dhuValue})
            producedlab.push(item.producedPieces)
            stitchedlab.push(item.stitchedPieces)
            alterlab.push(item.pcsInAlteration)
            rejlab.push(item.rejectedPieces)
            dhulab.push(item.dhu)
          });
          if(this.state.selectedvalue=="Pcs Produced"){
              showdata=produced
              showlabel=producedlab
              linecolor="#698bd0"
          }else if(this.state.selectedvalue=="Pcs Stitched"){
            showdata=stitched
            showlabel=stitchedlab
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
              pcsprod:produced,
              pcsstitched:stitched,
              pcsalter:alter,
              pcsrej:rej,
              dhu:dhu,
              pcsprodlab:producedlab,
              pcsstitchedlab:stitchedlab,
              pcsalterlab:alterlab,
              pcsrejlab:rejlab,
              dhulab:dhulab,
              data:showdata,
              label:showlabel,
              linecolor:linecolor
          })
      })
      .catch((error) => console.log(error)); //to catch the errors if any
  };


 
  getData=(daterange)=>{
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
          fromDate: "",
          toDate: "",
          dateRange:daterange,
          locationID: this.state.selectedlineid,
          locationLevel:"LINE"
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
              locationID: this.state.selectedlineid,
              locationLevel:"LINE"
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
        var produced=[]
        var stitched=[]
        var alter=[]
        var rej=[]
        var dhu=[]
        var producedlab=[]
        var stitchedlab=[]
        var alterlab=[]
        var rejlab=[]
        var dhulab=[]
        var showdata=[]
        var showlabel=[]
        var linecolor="#698bd0"
        responseJson.result[0].locationDetails.forEach(function (item, index) {
            produced.push({x:item.date,y:item.producedPieces})
            stitched.push({x:item.date,y:item.stitchedPieces})
            alter.push({x:item.date,y:item.pcsInAlteration})
            rej.push({x:item.date,y:item.rejectedPieces})
            dhu.push({x:item.date,y:item.dhuValue})
            producedlab.push(item.producedPieces)
            stitchedlab.push(item.stitchedPieces)
            alterlab.push(item.pcsInAlteration)
            rejlab.push(item.rejectedPieces)
            dhulab.push(item.dhu)
          });
          if(this.state.selectedvalue=="Pcs Produced"){
              showdata=produced
              showlabel=producedlab
              linecolor="#698bd0"
          }else if(this.state.selectedvalue=="Pcs Stitched"){
            showdata=stitched
            showlabel=stitchedlab
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
              pcsprod:produced,
              pcsstitched:stitched,
              pcsalter:alter,
              pcsrej:rej,
              dhu:dhu,
              pcsprodlab:producedlab,
              pcsstitchedlab:stitchedlab,
              pcsalterlab:alterlab,
              pcsrejlab:rejlab,
              dhulab:dhulab,
              data:showdata,
              label:showlabel,
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
    var Lines=[]
    this.state.line.forEach(function (item, index) {
        Lines.push({label:item.val,value:item.id})
      });
      this.setState({
          lines:Lines,
          selectedline:Lines[0].label,
          selectedlineid:Lines[0].value
      },()=>{
        if(this.state.custom){
            this.getDatax()
          }else{
              this.getData(this.state.dateRangex)
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
                          this.getData(item.value)
                    }
                    else{
                      this.setState({
                        custom:true
                      })
                    }
                  }}
                />
                <DropDownPicker
                         items={this.state.lines}
                        placeholder={this.state.selectedline}
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
                                selectedline:item.label,
                                selectedlineid:item.value,
                                },()=>{
                                    if(this.state.custom){
                                        this.getDatax()
                                    }
                                    else{
                                        this.getData(this.state.dateRangex)
                                    }
                                    })
                        }}
                    />
           <DropDownPicker
              items={[{label:"Pcs Produced",val:"prod"},
              {label:"Pcs Stitched",val:"stitch"},
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
                  if(item.val=="prod"){
                    this.setState({
                        selectedvalue:item.label,
                        data:this.state.pcsprod,
                        label:this.state.pcsprodlab,
                        linecolor:"#698bd0"
                      })
                  }else  if(item.val=="stitch"){
                    this.setState({
                        selectedvalue:item.label,
                        data:this.state.pcsstitched,
                        linecolor:"#49b675",
                        label:this.state.pcsstitchedlab
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

VisualReportsLines.navigationOptions = (navData) => {
  return {
    headerTitle: "Reports",
    headerStyle: {
      backgroundColor: Colors.primaryColor,
    },
    headerTintColor: Colors.accentColor,
  };
};

export default VisualReportsLines;
