import React from "react"
import { Animated, ActivityIndicator, FlatList, ScrollView, StyleSheet, Text, View,Dimensions,TouchableOpacity } from "react-native"
 
import Colors from "../constants/colors";

import * as ScreenOrientation from 'expo-screen-orientation';
import colors from "../constants/colors";
import { CheckBox } from "react-native-elements";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { AntDesign } from '@expo/vector-icons'; 
import { Octicons } from '@expo/vector-icons'; 
import DropDownPicker from 'react-native-dropdown-picker';

const NUM_COLS = 9
const CELL_WIDTH = 150
const CELL_HEIGHT = 42

const black = "#000"
const white = "#fff"

const styles = StyleSheet.create({
  container: {marginLeft:10,marginRight:10,height:250},
  header: { flexDirection: "row",},
  buyer: { position: "absolute", width: 200 },
  stylecol: { position: "absolute", width: CELL_WIDTH ,marginLeft:CELL_WIDTH },
  style: { position: "absolute", width: CELL_WIDTH ,marginLeft:CELL_WIDTH*2+50},
  body: { marginLeft: 200 },
  cell: {
    width: CELL_WIDTH,
    height: CELL_HEIGHT,
    paddingRight:5,
  },
  cellorder: {
    width: CELL_WIDTH+50,
    height: CELL_HEIGHT,
    paddingRight:5,
  },
  cellHeader: {
    width: CELL_WIDTH,
    height: CELL_HEIGHT,
  },

  cellHeaderOrder: {
    width: CELL_WIDTH+50,
    height: CELL_HEIGHT,
  },
  cellHeaderOSB: {
    width: CELL_WIDTH,
    height:  CELL_HEIGHT,
  },
  cellHeaderStyle: {
    width: 200,
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
    textAlignVertical:"center",
    paddingBottom:3,
    borderBottomColor:"#00334e88",borderBottomWidth:1.5,
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
  cellTextOSBS: {
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

class ReportProcess extends React.Component {
  constructor(props) {
    super(props);
    this.headerScrollView = null
    this.scrollPosition = new Animated.Value(0)
    this.scrollEvent = Animated.event(
      [{ nativeEvent: { contentOffset: { x: this.scrollPosition } } }],
      { useNativeDriver: false },
    )
    console.log(props.navigation.state.params)
    this.state = {
      loading: false,
      count:0,
      dataSource: [],
      cards:[],
      process:[],
      style:[],
      data:[],
      alldata:false,
      orderID:props.navigation.state.params.orderid,
      FromDate:props.navigation.state.params.FromDate,
      ToDate:props.navigation.state.params.ToDate,
      FromDatex:null,
      OrderDatePickerVis:false,
      OrderDatePickerVis2:false,
      today:props.navigation.state.params.today,
      userID: props.navigation.state.params.userID,
      companyID: props.navigation.state.params.companyID,
      styleName: props.navigation.state.params.style,
      styleID: props.navigation.state.params.id,
      lineID: props.navigation.state.params.lineID,
      lineName: props.navigation.state.params.lineName,
      dateRange: props.navigation.state.params.dateRange,
      dateRangex: props.navigation.state.params.dateRangex,
      custom: props.navigation.state.params.custom,
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

  formatCellOrder(value,Id,index) {
    //console.log(value+Id+index)
    return (
      <View key={index} style={styles.cellorder}>
        <Text style={styles.cellText} numberOfLines={1}>{value}</Text>
      </View>
    )
  }

  formatFact(factory,factoryid,index) {
    return (
      <View key={factoryid+index} style={styles.cellOSB}>
         <TouchableOpacity onPress={()=> {
        
            this.props.navigation.navigate({
                routeName: "ReportLineStyle",
                params: {
                  style: this.state.styleName,
                  companyID: this.state.companyID,
                  userID: this.state.userID,
                  id:this.state.styleID,
                  alldata:this.state.alldata,
                  from:this.state.FromDate,
                  to:this.state.ToDate,
                  today:this.state.today,
                  orderid:this.state.orderID,
                  lineID:this.state.lineID,
                  lineName:this.state.lineName,
                  process:this.state.process[index].id,
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

  formatHeaderCellOrder(value) {
    return (
      <View key={value} style={styles.cellHeaderOrder}>
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
  formatHeaderCellStyle(value) {
    return (
      <View key={value} style={styles.cellHeaderStyle}>
        <Text style={styles.headerTextOSB} numberOfLines={1}>{value}</Text>
      </View>
    )
  }
  formatColumn = (section) => {
    let { item } = section
    let cells = []

    for (let i = 0; i < this.state.count; i++) {
      if(section.index==1){
        
        cells.push(this.formatCellOrder(item[i].val,item[i].val,i))
      }
      else{
        cells.push(this.formatCell(item[i].val,item[i].val,i))
      }
    }

    return <View  key={item.Index} style={styles.column}>{cells}</View>
  }

  formatHeader() {
    let cols = []
    var headers=["Buyer","Order","Order Qty","Pending","OK Pcs","Pcs in Alter","Rejected","DHU%"]
    for (let i = 0; i < headers.length; i++) {
      if(headers[i]=="Order"){
        cols.push(this.formatHeaderCellOrder(headers[i]))
      }
      else{
        cols.push(this.formatHeaderCell(headers[i]))
      }
      
    }

    return (
      <View style={styles.header}>
        {this.formatHeaderCellStyle("Process")}
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
      cells.push(this.formatFact(this.state.process[i].val,this.state.process[i].id,i))
    }
    
    return <View style={styles.buyer}>{cells}</View>
  }

  StyleColumn() {
    let cells = []
    for (let i = 0; i < this.state.count; i++) {
      cells.push(this.formatStyle(this.state.style[i].val,this.state.style[i].id,i))
    }
    
    return <View style={styles.stylecol}>{cells}</View>
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
          keyExtractor={(item, index) => index}
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

  getData=(daterange)=>{
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
          locationID: this.state.lineID,
          styleID:this.state.styleID,
          orderID:this.state.orderID,
          locationLevel:"PROCESS"
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
            fromDate: "",
            toDate:"",
            daterange:daterange,
            locationID: this.state.lineID,
            styleID:this.state.styleID,
            orderID:this.state.orderID,
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
        var orderQty=[]
        var passed=[]
        var pending=[]
        var Ok=[]
        var Alter=[]
        var Defect=[]
        var Reject=[]
        var j
        var floor=[]
        var buyer=[]
        var style=[]
        var process=[]
        var order=[]
        var dhu=[]
        var data=[]
        var orderids=[]
        var stitched=[]
        var produced=[]
        for(j of responseJson.result){
        var i 
        for(i of j.locationDetails){
            floor.push({val:j.locationName,id:j.locationID})
            process.push({val:i.processName,id:i.processID})
            order.push({val:i.orderNo})
            buyer.push({val:i.brandName})
            orderids.push({val:i.orderID})
            orderQty.push({val:i.orderQty})
            pending.push({val:i.pendingPieces})
            Ok.push({val:i.okPieces})
            Alter.push({val:i.pcsInAlteration})
            Reject.push({val:i.rejectedPieces})
            dhu.push({val:i.dhu})
            i++
        }  
        }
        data.push(buyer)
        data.push(order)
        data.push(orderQty)
        data.push(pending)
        data.push(Ok)
        data.push(Alter)
        data.push(Reject)
        data.push(dhu)
        this.setState({
          loading: false,
          count:floor.length,
          process:process,
          style:style,
          OrderId:orderids,
          data:data
        });
      })
      .catch((error) => console.log(error)); //to catch the errors if any
  };

  getDatax=()=>{
    this.setState({
      loading: true,
    });
    console.log("kjsdflm")
    console.log(JSON.stringify({
        basicparams: {
          companyID: this.state.companyID,
          userID: this.state.userID,
        },
        reportParams:{
          fromDate: this.state.FromDate+" 00:00:00",
          toDate:this.state.ToDate+" 23:59:59",
          daterange:"",
          locationID: this.state.lineID,
          styleID:this.state.styleID,
          orderID:this.state.orderID,
          locationLevel:"PROCESS"
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
            fromDate: this.state.FromDate+" 00:00:00",
          toDate:this.state.ToDate+" 23:59:59",
            daterange:"",
            locationID: this.state.lineID,
            styleID:this.state.styleID,
            orderID:this.state.orderID,
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
        var orderQty=[]
        var passed=[]
        var pending=[]
        var Ok=[]
        var Alter=[]
        var Defect=[]
        var Reject=[]
        var j
        var floor=[]
        var buyer=[]
        var style=[]
        var process=[]
        var order=[]
        var dhu=[]
        var data=[]
        var orderids=[]
        var stitched=[]
        var produced=[]
        for(j of responseJson.result){
        var i 
        for(i of j.locationDetails){
            floor.push({val:j.locationName,id:j.locationID})
            process.push({val:i.processName,id:i.processID})
            order.push({val:i.orderNo})
            buyer.push({val:i.brandName})
            orderids.push({val:i.orderID})
            orderQty.push({val:i.orderQty})
            pending.push({val:i.pendingPieces})
            Ok.push({val:i.okPieces})
            Alter.push({val:i.pcsInAlteration})
            Reject.push({val:i.rejectedPieces})
            dhu.push({val:i.dhu})
            i++
        }  
        }
        data.push(buyer)
        data.push(order)
        data.push(orderQty)
        data.push(pending)
        data.push(Ok)
        data.push(Alter)
        data.push(Reject)
        data.push(dhu)
        this.setState({
          loading: false,
          count:floor.length,
          process:process,
          style:style,
          OrderId:orderids,
          data:data
        });
      })
      .catch((error) => console.log(error)); //to catch the errors if any
  };
  getAllDatax=()=>{
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
          styleID:this.state.styleID,
          orderID:this.state.orderID,
          locationLevel:"PROCESS"
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
            fromDate: this.state.FromDate+" 00:00:00",
            toDate:this.state.ToDate+" 23:59:59",
              daterange:"",
            styleID:this.state.styleID,
            orderID:this.state.orderID,
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
        var orderQty=[]
        var passed=[]
        var pending=[]
        var Ok=[]
        var Alter=[]
        var Defect=[]
        var Reject=[]
        var j
        var floor=[]
        var buyer=[]
        var style=[]
        var process=[]
        var order=[]
        var dhu=[]
        var data=[]
        var orderids=[]
        var stitched=[]
        var produced=[]
        for(j of responseJson.result){
        var i 
        for(i of j.locationDetails){
            floor.push({val:j.locationName,id:j.locationID})
            process.push({val:i.processName,id:i.processID})
            order.push({val:i.orderNo})
            buyer.push({val:i.brandName})
            orderids.push({val:i.orderID})
            orderQty.push({val:i.orderQty})
            pending.push({val:i.pendingPieces})
            Ok.push({val:i.okPieces})
            Alter.push({val:i.pcsInAlteration})
            Reject.push({val:i.rejectedPieces})
            dhu.push({val:i.dhu})
            i++
        }  
        }
        data.push(buyer)
        data.push(order)
        data.push(orderQty)
        data.push(pending)
        data.push(Ok)
        data.push(Alter)
        data.push(Reject)
        data.push(dhu)
        this.setState({
          loading: false,
          count:floor.length,
          process:process,
          style:style,
          OrderId:orderids,
          data:data
        });
      })
      .catch((error) => console.log(error)); //to catch the errors if any
  };


  getAllData= (daterange)=>{
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
          styleID:this.state.styleID,
          orderID:this.state.orderID,
          locationLevel:"PROCESS"
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
            fromDate: "",
            toDate:"",
            daterange:daterange,
            styleID:this.state.styleID,
            orderID:this.state.orderID,
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
        var orderQty=[]
        var passed=[]
        var pending=[]
        var Ok=[]
        var Alter=[]
        var Defect=[]
        var Reject=[]
        var j
        var floor=[]
        var buyer=[]
        var style=[]
        var process=[]
        var order=[]
        var dhu=[]
        var data=[]
        var orderids=[]
        var stitched=[]
        var produced=[]
        for(j of responseJson.result){
        var i 
        for(i of j.locationDetails){
            floor.push({val:j.locationName,id:j.locationID})
            process.push({val:i.processName,id:i.processID})
            order.push({val:i.orderNo})
            buyer.push({val:i.brandName})
            orderids.push({val:i.orderID})
            orderQty.push({val:i.orderQty})
            pending.push({val:i.pendingPieces})
            Ok.push({val:i.okPieces})
            Alter.push({val:i.pcsInAlteration})
            Reject.push({val:i.rejectedPieces})
            dhu.push({val:i.dhu})
            i++
        }  
        }
        data.push(buyer)
        data.push(order)
        data.push(orderQty)
        data.push(pending)
        data.push(Ok)
        data.push(Alter)
        data.push(Reject)
        data.push(dhu)
        this.setState({
          loading: false,
          count:floor.length,
          process:process,
          style:style,
          OrderId:orderids,
          data:data
        });
      })
      .catch((error) => console.log(error)); //to catch the errors if any
  };

    componentDidMount() {
    async function changeScreenOrientation() {
        await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE_LEFT);
      }
      this.listener = this.scrollPosition.addListener(position => {
        this.headerScrollView.scrollTo({ x: position.value, animated: false })
      })
    changeScreenOrientation()
    console.log(this.state.custom)
    if(this.state.custom){
      this.getDatax()
    }else{
        this.getData(this.state.dateRangex)
    }
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
          <View style={{flexDirection:"row"}}>
          {this.state.alldata ? null : (
                <Text style={{
                    fontSize:18,
                    marginLeft:10,
                    paddingLeft:5,
                    marginTop:5,
                    marginBottom:5,  
                    paddingRight:8,
                    textAlignVertical:"center",
                    fontWeight:"bold",
                    maxWidth:Dimensions.get("window").width*0.25,
                    borderRadius:10,
                    backgroundColor:Colors.primaryColor,
                    color:"#fff",
                    marginVertical:1}}>{this.state.lineName}</Text>
          )}
          <View style={{
                        marginLeft:10,
                        marginTop:5,
                        marginBottom:5,  
                        maxWidth:Dimensions.get("window").width*0.21,
                        borderRadius:10,
                        backgroundColor:Colors.primaryColor,
                        marginVertical:1}}>
             <TouchableOpacity onPress={()=> {
                    this.props.navigation.navigate({
                        routeName: "ReportStyle",
                        params: {
                        companyID: this.state.companyID,
                        userID: this.state.userID,
                        id:this.state.styleID,
                        from:this.state.FromDate,
                        to:this.state.ToDate,
                        today:this.state.today,
                        orderid:this.state.orderID,
                        dateRange:this.state.dateRange,
                        dateRangex:this.state.dateRangex,
                        style:this.state.styleName,
                        styleID:this.state.styleID,
                        lineName:this.state.lineName,
                        lineID:this.state.lineID,
                        custom:this.state.custom
                        },
                    }); 
                }}>
                    <Text style={{
                        fontSize:22,
                        paddingLeft:12, 
                        paddingRight:12,
                        textAlignVertical:"center",
                        fontWeight:"bold",
                        textDecorationLine:"underline",
                        textDecorationColor:"#fff",
                        color:"#fff",
                        marginVertical:1}}>
                            {this.state.styleName}
                    </Text>
                </TouchableOpacity>
            </View>
            <DropDownPicker
                      items={[
                          {label: 'Today', value: 'today', icon: () => null},
                          {label: 'Yesterday', value: 'yesterday', icon: () =>null },
                          {label: 'Last 7 Days', value: 'lastSevenDays', icon: () =>null},
                          {label: 'Last 30 Days', value: 'lastThirtyDays', icon: () =>null},
                          {label: 'Custom', value: 'custom', icon: () =>null},
                      ]}
                      placeholder={this.state.dateRange}
                      containerStyle={{height: 40, width:180,alignSelf:"flex-start",marginTop:5,marginLeft:10}}
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
                        <View style={{flexDirection:"row",width:Dimensions.get("window").width*0.35}}>
                        <ScrollView horizontal={true}>
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
                          </ScrollView>
                        </View>
                        <TouchableOpacity onPress={()=> {
                            this.props.navigation.navigate({
                              routeName: "VisualReportsProcess",
                              params: {
                                process: this.state.process,
                                companyID: this.state.companyID,
                                userID: this.state.userID,
                                FromDate:this.state.FromDate,
                                ToDate:this.state.ToDate,
                                dateRange:this.state.dateRange,
                                dateRangex:this.state.dateRangex,
                                style:this.state.styleName,
                                styleID:this.state.styleID,
                                lineName:this.state.lineName,
                                lineID:this.state.lineID,
                                custom:this.state.custom,
                                orderid:this.state.orderID,
                                alldata:this.state.alldata
                              },
                            });
                          }}>
                        <View style={{marginTop:10,marginHorizontal:20}}>
                          <Octicons name="graph" size={40} color={"#00334eCC"} />
                        </View>                     
                      </TouchableOpacity>
          </View>
         <View>
         <CheckBox
                          title={"View Data for All Lines"}
                          containerStyle={{
                            backgroundColor: "transparent",
                            borderColor: "transparent",
                            marginBottom:-10,
                            marginTop:-10,
                            // width: "45%",
                          }}
                          textStyle={{ color: "#00334eBB", fontSize: 15 }}
                          size={20}
                          checkedColor={Colors.primaryColor}
                          checked={this.state.alldata}
                          onPress={() => {
                            var alldata=this.state.alldata
                            this.setState({
                              alldata:!this.state.alldata
                            },()=>{
                                if(alldata){
                                  if(this.state.custom){
                                    this.getDatax()
                                  }else{
                                    this.getData(this.state.dateRangex)
                                  }
                                   
                                }
                                else{
                                  if(this.state.custom){
                                    this.getAllDatax()
                                  }else{
                                    this.getAllData(this.state.dateRangex)
                                  }
                                   
                                }
                            })
                          }}
                        />
         </View>
          <View style={styles.container}>
          {this.formatHeader()}
          <FlatList
            data={data}
            style={{marginBottom:20}}
            scrollEnabled={true}
            renderItem={this.formatRowForSheet}
            onEndReached={this.handleScrollEndReached}
            onEndReachedThreshold={.005}
            keyExtractor={(item, index) => index}
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
              },()=>{this.getDatax()})
              
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
 
ReportProcess.navigationOptions = (navData) => {
  return {
    headerTitle: "Reports",
    headerStyle: {
      backgroundColor: Colors.primaryColor,
    },
    headerTintColor: Colors.accentColor,
  };
};

export default ReportProcess;
