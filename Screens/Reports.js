import React from "react"
import { Animated, ActivityIndicator, FlatList, ScrollView, StyleSheet, Text, View,Dimensions,TouchableOpacity } from "react-native"

 
import Colors from "../constants/colors";

import * as ScreenOrientation from 'expo-screen-orientation';
import colors from "../constants/colors";
import { CheckBox } from "react-native-elements";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { AntDesign } from '@expo/vector-icons'; 
import { SimpleLineIcons } from '@expo/vector-icons'; 
import { Octicons } from '@expo/vector-icons'; 
import DropDownPicker from 'react-native-dropdown-picker';

const NUM_COLS = 9
const CELL_WIDTH = 150
const CELL_HEIGHT = 45

const styles = StyleSheet.create({
  container: {marginLeft:10,marginRight:10},
  header: { flexDirection: "row"},
  buyer: { position: "absolute", width: CELL_WIDTH },
  order: { position: "absolute", width: CELL_WIDTH ,marginLeft:CELL_WIDTH },
  style: { position: "absolute", width: CELL_WIDTH ,marginLeft:CELL_WIDTH*2},
  body: { marginLeft: 150 },
  cell: {
    width: CELL_WIDTH,
    height: CELL_HEIGHT,
    paddingRight:5,
  },
  cellHeader: {
    width: CELL_WIDTH,
    height: CELL_HEIGHT,
  },
  cellHeaderOSB: {
    width: CELL_WIDTH,
    height:  CELL_HEIGHT,
  },
  cellOSB: {
    width: CELL_WIDTH,
    height:  CELL_HEIGHT,
  },
  headerText: {
    fontSize:17,
    textAlign:"right",
    paddingLeft:5,
    paddingRight:8,
    paddingBottom:3,
    borderBottomColor:"#00334e88",borderBottomWidth:1.5,
    textAlignVertical:"center",
    // fontWeight:"bold",
    color:Colors.primaryColor,
    marginVertical:3
  },
  headerTextOSB: {
    fontSize:17,
    textAlign:"left",
    paddingLeft:5,
    textAlignVertical:"center",
    paddingBottom:3,
    borderBottomColor:"#00334e88",borderBottomWidth:1.5,
    // fontWeight:"bold",
    color:Colors.primaryColor,
    marginVertical:3
  },
  cellText: {
    fontSize:17,
    textAlign:"right",
    paddingLeft:5,  
    paddingRight:8,
    textAlignVertical:"top",
    fontWeight:"bold",
    color:Colors.primaryColor,
    marginVertical:1
  },
  cellTextOSB: {
    fontSize:17,
    textAlign:"left",
    paddingLeft:10, 
    textAlignVertical:"center",
    fontWeight:"bold",
    textDecorationLine:"underline",
    textDecorationColor:"#27357e",
    color:"#31639c",
    marginVertical:1
  },
  column: { flexDirection: "column" },
})

class Reports extends React.Component {
  constructor(props) {
    super(props);
    this.headerScrollView = null
    this.scrollPosition = new Animated.Value(0)
    this.scrollEvent = Animated.event(
      [{ nativeEvent: { contentOffset: { x: this.scrollPosition } } }],
      { useNativeDriver: false },
    )
    this.state = {
      loading: false,
      count:0,
      dataSource: [],
      cards:[],
      factory:[],
      brands:[],
      order:[],
      style:[],
      colors:[],
      sizes:[],
      data:[],
      FromDate:"",
      ToDate:"",
      SelectedDate:"Today",
      DateRange:"Today",
      DateRangex:"Today",
      FromDatex:null,
      OrderDatePickerVis:false,
      OrderDatePickerVis2:false,
      today:true,
      custom:false,
      dateRange:"Today",
      dateRangex:"today",
      userID: props.navigation.state.params.userID,
      companyID: props.navigation.state.params.companyID,
    };
  }
  handleScroll = e => {
    if (this.headerScrollView) {
      let scrollX = e.nativeEvent.contentOffset.x
      this.headerScrollView.scrollTo({ x: scrollX, animated: false })
    }
  }
  
  // scrollLoad = () => this.setState({ loading: false, count: this.state.count})
  
  // handleScrollEndReached = () => {
  //   if (!this.state.loading) {
  //     this.setState({ loading: true }, () => setTimeout(this.scrollLoad, 500))
  //   }
  // }

  formatCell(value,Id,index) {
    //console.log(value+Id+index)
    return (
      <View key={index} style={styles.cell}>
        <Text style={styles.cellText} numberOfLines={1}>{value}</Text>
      </View>
    )
  }

  formatFact(factory,factoryid,index) {
    return (
      <View key={factoryid+factory} style={styles.cellOSB}>
        <TouchableOpacity onPress={()=> {
          this.props.navigation.navigate({
            routeName: "ReportFloors",
            params: {
              factory: factory,
              companyID: this.state.companyID,
              userID: this.state.userID,
              id:factoryid,
              FromDate:this.state.FromDate,
              ToDate:this.state.ToDate,
              today:this.state.today,
              dateRange:this.state.dateRange,
              dateRangex:this.state.dateRangex,
              custom:this.state.custom
            },
          });
        }}>
        <Text style={styles.cellTextOSB} numberOfLines={1}>{factory}</Text>
        </TouchableOpacity>
      </View>
    )
  }

  formatHeaderCell(value) {
    return (
      <View key={value} style={styles.cellHeader}>
        <Text style={styles.headerText} numberOfLines={1}>{value}</Text>
      </View>
    )
  }
  formatHeaderCellOSB(value) {
    return (
      <View key={value} style={styles.cellHeaderOSB}>
        <Text style={styles.headerTextOSB} numberOfLines={1}>{value}</Text>
      </View>
    )
  }
  formatColumn = (section) => {
    let { item } = section
    // console.log(item)
    let cells = []

    for (let i = 0; i < this.state.count; i++) {
      cells.push(this.formatCell(item[i].val,item[i].val,i))
    }

    return <View  key={item.Index} style={styles.column}>{cells}</View>
  }

  formatHeader() {
    let cols = []
    var headers=["Order Qty","Pending","Pcs Stitched","Pcs Produced","OK Pcs","Pcs in Alter","Rejected","DHU%"]
    for (let i = 0; i < headers.length; i++) {
      cols.push(this.formatHeaderCell(headers[i]))
    }

    return (
      <View style={styles.header}>
        {this.formatHeaderCellOSB("Factory")}
        <ScrollView
          ref={ref => (this.headerScrollView = ref)}
          horizontal={true}
          scrollEnabled={false}
          scrollEventThrottle={0}
        >
          {cols}
        </ScrollView>
      </View>
    )
  }
  
 FactoryColumn() {
    let cells = []
    for (let i = 0; i < this.state.count; i++) {
      cells.push(this.formatFact(this.state.factory[i].val,this.state.factory[i].id,i))
    }
    
    return <View style={styles.buyer}>{cells}</View>
  }
  
  formatBody() {
    return (
      <View>
        {this.FactoryColumn()}
        <FlatList
          style={styles.body}
          horizontal={true}
          data={this.state.data}
          renderItem={this.formatColumn}
          stickyHeaderIndices={[0]}
          onScroll={this.scrollEvent}
          keyExtractor={(item, index) => index.toString()}
          scrollEventThrottle={0}
          extraData={this.state}
        />
      </View>
    )
  }
  
  formatRowForSheet = (section) => {
    let { item } = section
  
    return item.render
  }

  getDatax=(daterange)=>{
    this.setState({
      loading: true,
    });
    console.log(JSON.stringify({
      basicparams: {
        companyID: this.state.companyID,
        userID: this.state.userID,
      },
      reportParams:{
        fromDate:"",
        toDate:"",
        dateRange:daterange,
        locationLevel:"FACTORY"
      }
    }))
    fetch(
      "https://qualitylite.bluekaktus.com/api/bkQuality/reports/getLocationLevelOrderQtyReport",
      {
        method: "POST",
        body: JSON.stringify({
          basicparams: {
            companyID: this.state.companyID,
            userID: this.state.userID,
          },
          reportParams:{
            fromDate:"",
            toDate:"",
            dateRange:daterange,
            locationLevel:"FACTORY"
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
        var orderQty=[]
        var passed=[]
        var pending=[]
        var Ok=[]
        var Alter=[]
        var Defect=[]
        var Reject=[]
        var j
        var factory=[]
        var dhu=[]
        var data=[]
        var stitched=[]
        var produced=[]
        for(j of responseJson.result){
          factory.push({val:j.locationName,id:j.locationID})
          orderQty.push({val:j.locationDetails[0].orderQty})
          stitched.push({val:j.locationDetails[0].stitchedPieces})
          produced.push({val:j.locationDetails[0].producedPieces})
          pending.push({val:j.locationDetails[0].pendingPieces})
          Ok.push({val:j.locationDetails[0].okPieces})
          Alter.push({val:j.locationDetails[0].pcsInAlteration})
          Reject.push({val:j.locationDetails[0].rejectedPieces})
          dhu.push({val:j.locationDetails[0].dhu})
        }
        data.push(orderQty)

        data.push(pending)
        data.push(stitched)
        data.push(produced)
        data.push(Ok)
        data.push(Alter)
        data.push(Reject)
        data.push(dhu)
        console.log(responseJson.result.length)
        this.setState({
          loading: false,
          count:responseJson.result.length,
          factory:factory,
          data:data
        });
      })
      .catch((error) => console.log(error)); //to catch the errors if any
  };

  getData=(from,to)=>{
    this.setState({
      loading: true,
    });
    console.log(JSON.stringify({
      basicparams: {
        companyID: this.state.companyID,
        userID: this.state.userID,
      },
      reportParams:{
        fromDate: from+" 00:00:00",
        toDate:to+" 23:59:59",
        dateRange:"",
        locationLevel:"FACTORY"
      }
    }))
    fetch(
      "https://qualitylite.bluekaktus.com/api/bkQuality/reports/getLocationLevelOrderQtyReport",
      {
        method: "POST",
        body: JSON.stringify({
          basicparams: {
            companyID: this.state.companyID,
            userID: this.state.userID,
          },
          reportParams:{
            fromDate: from+" 00:00:00",
            toDate:to+" 23:59:59",
            dateRange:"",
            locationLevel:"FACTORY"
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
        var orderQty=[]
        var passed=[]
        var pending=[]
        var Ok=[]
        var Alter=[]
        var Defect=[]
        var Reject=[]
        var j
        var factory=[]
        var dhu=[]
        var data=[]
        var stitched=[]
        var produced=[]
        for(j of responseJson.result){
          factory.push({val:j.locationName,id:j.locationID})
          orderQty.push({val:j.locationDetails[0].orderQty})
          stitched.push({val:j.locationDetails[0].stitchedPieces})
          produced.push({val:j.locationDetails[0].producedPieces})
          pending.push({val:j.locationDetails[0].pendingPieces})
          Ok.push({val:j.locationDetails[0].okPieces})
          Alter.push({val:j.locationDetails[0].pcsInAlteration})
          Reject.push({val:j.locationDetails[0].rejectedPieces})
          dhu.push({val:j.locationDetails[0].dhu})
        }
        data.push(orderQty)

        data.push(pending)
        data.push(stitched)
        data.push(produced)
        data.push(Ok)
        data.push(Alter)
        data.push(Reject)
        data.push(dhu)
        this.setState({
          loading: false,
          count:responseJson.result.length,
          factory:factory,
          data:data
        });
      })
      .catch((error) => console.log(error)); //to catch the errors if any
  };

    componentDidMount() {
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
      var today = new Date();
      var date=today.getDate() + "-"+ monthNames[(today.getMonth())] +"-"+ today.getFullYear();
      this.setState({
        FromDate:date,
        ToDate:date
      })
    async function changeScreenOrientation() {
        await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE_LEFT);
      }
      this.listener = this.scrollPosition.addListener(position => {
        this.headerScrollView.scrollTo({ x: position.value, animated: false })
      })
    changeScreenOrientation()
    this.getData(date,date)
  }

  componentWillUnmount(){
    async function changeScreenOrientation() {
        await ScreenOrientation.unlockAsync();
      }
      changeScreenOrientation()
  }

  render () {
    let body = this.formatBody()
    
    let data = [{ key: "body", render: body }]

    if (this.state.loading) {
      return (
        <View style={styles.loader}>
          <ActivityIndicator size="large" color={Colors.primaryColor} />
        </View>
      );
    }else{
      return (
        <View>
          <View style={{flexDirection:"row",justifyContent:"space-between"}}>
          <DropDownPicker
              items={[
                  {label: 'Today', value: 'today', icon: () => null},
                  {label: 'Yesterday', value: 'yesterday', icon: () =>null },
                  {label: 'Last 7 Days', value: 'lastSevenDays', icon: () =>null},
                  {label: 'Last 30 Days', value: 'lastThirtyDays', icon: () =>null},
                  {label: 'Custom', value: 'custom', icon: () =>null},
              ]}
              placeholder={this.state.dateRange}
              containerStyle={{height: 40, width:220,marginTop:5,marginLeft:10}}
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
                    this.getDatax(item.value)
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
                        <TouchableOpacity onPress={()=> {
                            this.props.navigation.navigate({
                              routeName: "VisualReportsFactory",
                              params: {
                                factory: this.state.factory,
                                companyID: this.state.companyID,
                                userID: this.state.userID,
                                FromDate:this.state.FromDate,
                                ToDate:this.state.ToDate,
                                dateRange:this.state.dateRange,
                                dateRangex:this.state.dateRangex,
                                custom:this.state.custom
                              },
                            });
                          }}>
                        <View style={{marginRight:30,marginTop:10}}>
                          <Octicons name="graph" size={40} color={"#00334eCC"} />
                        </View>                     
                      </TouchableOpacity>
                       
          </View>
         
          <View style={styles.container}>
          {this.formatHeader()}
          <FlatList
            data={data}
            style={{marginBottom:20}}
            renderItem={this.formatRowForSheet}
            onEndReached={this.handleScrollEndReached}
            onEndReachedThreshold={.005}
            keyExtractor={(item, index) => index.toString()}
          />
          {this.state.loading && <ActivityIndicator />}
        </View>
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
              })
              this.getData(this.state.FromDate,date.getDate()+"-"+monthNames[date.getMonth()]+"-"+date.getFullYear())
          }}
          onCancel={()=>{
              this.setState({OrderDatePickerVis2:false})
          }}
      />

        </View>
        
      )
    }
  }
}
 
Reports.navigationOptions = (navData) => {
  return {
    headerTitle: "Reports",
    headerStyle: {
      backgroundColor: Colors.primaryColor,
    },
    headerTintColor: Colors.accentColor,
  };
};

export default Reports;
