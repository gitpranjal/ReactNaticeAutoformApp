import React from "react";
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  StyleSheet,
  AsyncStorage,
  TouchableOpacity,
  Button,
  Dimensions,
  Platform,
  TouchableHighlightBase,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { HeaderButtons, Item } from "react-navigation-header-buttons";
import * as ScreenOrientation from 'expo-screen-orientation';
import Dashlets from "../components/Dashlets";
import HeaderButton from "../components/HeaderButton";
import NotificationBell from "../components/NotificationBell";
import TimedSlideshow from 'react-native-timed-slideshow';
import Colors from "../constants/colors";

import { MaterialIcons } from '@expo/vector-icons';  

class Home extends React.Component {
  constructor(props) {
    super(props);
    this._retrieveData()
    this.state = {
      loading: true,
      cards:[],
      dataSource: [],
      companyID:null,
      userID:null,
      loading:true,
      showAdds:true,
      banners:[ {
        uri: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/98/International_Pok%C3%A9mon_logo.svg/1200px-International_Pok%C3%A9mon_logo.svg.png",
        title: "Victor Fallon",
        text: "Val di Sole, Italy",
        duration: 3500
    }],
      count:0
    };
  }

  getCards=()=>{
    this.setState({
      loading: true,
    });
    fetch(
      "https://qualitylite.bluekaktus.com/api/bkQuality/users/getHomeCards",
      {
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
      }
    )
      .then((response) => response.json())
      .then((responseJson) => {
        this.setState({
          loading: false,
          cards: responseJson.result.cardDetails,
          count:responseJson.result.unreadNotifCount
        });
      })
      .catch((error) => console.log(error)); //to catch the errors if any
  };

  getBanner=()=>{
    this.setState({
      loading: true,
    });
    fetch(
      "https://qualitylite.bluekaktus.com/api/bkQuality/ads/getBannerAds",
      {
        method: "POST",
        body: JSON.stringify({
          basicparams: {
            companyID: this.state.companyID,
            userID: this.state.userID,
            showInactive: false
          },
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
        var banners=[]
        if(responseJson.result.length==0){
          this.setState({
            showAdds:false,
            loading:false,
            banners:[  {
              uri: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/98/International_Pok%C3%A9mon_logo.svg/1200px-International_Pok%C3%A9mon_logo.svg.png",
              title: "Victor Fallon",
              text: "Val di Sole, Italy",
              duration: 3500
          }]
          })
        }else{
        responseJson.result.forEach(function (item, index) {
            banners.push({uri:item.imageUrl,title:item.adTitle,text:item.adBody,onClick:item.adUrl,duration:3500})
            })
        console.log(banners)
        this.setState({
          loading: false,
          banners:banners
        });
        }
      })
      .catch((error) => console.log(error)); //to catch the errors if any
  };


  getNotification=()=>{
    fetch(
      "https://qualitylite.bluekaktus.com/api/bkQuality/users/getHomeCards",
      {
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
      }
    )
      .then((response) => response.json())
      .then((responseJson) => {
        this.setState({
          count:responseJson.result.unreadNotifCount
        });
      })
      .catch((error) => console.log(error)); //to catch the errors if any
  };

  _retrieveData = async () => {
   
    try {
      const loginstatus = await AsyncStorage.getItem("LoginParams");
      const data = JSON.parse(loginstatus);
      if (data !== null) {
        this.setState({
          companyID: data.companyID,
          userID: data.userID,
          loading:false
        });
        this.getCards()
        this.getBanner()
      }
    } catch (error) {}
  };


  renderGridItem = (itemData) => {
    function pathcheck(title) {
      if (title === "Factory Details") {
        return "FactoryMaster";
      }
      else if (title === "Masters") {
        return "Masters";
      }
      else if (title === "Orders") {
        return "OrderMasters";
      }
      else if (title === "Users") {
        return "Users";
      }
      else if (title === "Users2") { 
        return "User2";
      }
      else if (title === "Reports") {
        return "Reports";
      }
      else if (title === "Ship Orders") {
        return "CloseOrder";
      }
      else if (title === "Audit")
      {
        return "BulkOrderListScreen"
      }
      else {
        return "Masters";
      }
    }

    return (
      <Dashlets
        title={itemData.item.screenCode}
        key={itemData.item.screenNo}
        id={itemData.item.screenNo}
        description={itemData.item.screenName}
        onSelect={() => {
          this.props.navigation.navigate({
            routeName: pathcheck(itemData.item.screenName),
            params: {
              id: itemData.item.screenNo,
              title: itemData.item.screenName,
              companyID : this.state.companyID,
              userID : this.state.userID
            },
          });
        }}
      />
    );
  };



  componentDidMount() {
    async function changeScreenOrientation() {
        await ScreenOrientation.unlockAsync();
      }
      this.timer = setInterval(()=> this.getNotification(), 1000)
    changeScreenOrientation()
  }


  render() {
    let { gridItem } = styles;
    const items = [
      {
          uri: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/98/International_Pok%C3%A9mon_logo.svg/1200px-International_Pok%C3%A9mon_logo.svg.png",
          title: "Victor Fallon",
          text: "Val di Sole, Italy",
          duration: 3500
      },
      {
          uri: "https://s3.amazonaws.com/sensortower-itunes/blog/2019/04/pokemon-go-revenue-2.5-billion.jpg",
          title: "Mary Gomes",
          text: "Alps",
          duration: 3500
      },
      {
        uri: "https://images.nintendolife.com/3fff0556a21cf/new-pokemon-snap.900x.jpg",
        title: "Mary Gomes",
        text: "Alps",
        duration: 3500
    }
  ]
    if (this.state.loading) {
      return (       
        <View style={styles.loader}>
         <View style={{flexDirection:"column-reverse",height: Dimensions.get("window").height*0.12,backgroundColor:Colors.primaryColor}}>
             <View style={{flexDirection:"row",marginLeft:10,marginRight:15,justifyContent:"space-between"}}>
               <TouchableOpacity onPress={()=>{this.props.navigation.toggleDrawer()}}>
                  <Ionicons name="ios-menu" size={35} color={Colors.accentColor} />
               </TouchableOpacity>
               <Text style={{color:Colors.accentColor,fontWeight:"700",fontSize:24,marginLeft:25,marginBottom:8}}>
                 Home
               </Text>
               <View style={{marginBottom:-10}}>
                <TouchableOpacity style={{marginBottom:-10}} onPress={()=>{this.props.navigation.navigate({routeName:"Notifications",
                                                                                params:{
                                                                                  companyID : this.state.companyID,
                                                                                  userID : this.state.userID
                                                                                }})}}>
                        <MaterialIcons name="notifications" size={35} color={Colors.accentColor} style={{marginRight:10,marginBottom:-10}}/>
                        <View style={{borderRadius:40,backgroundColor:Colors.accentColor,position:"absolute",left:-20,top:-5,}}>
                            <Text style={{color:Colors.primaryColor,padding:5,fontSize:8,fontWeight:"bold",width:22,height:22,textAlign:"center"}} numberOfLines={1}>
                                {this.state.count}
                            </Text>
                        </View>
                </TouchableOpacity>
                </View>
             </View>
              
           </View>
          <ActivityIndicator size="large" color={Colors.primaryColor} />
        </View>
      );
    }else{
      return (
        <View style={styles.screen}>
           <View style={{flexDirection:"column-reverse",height: Dimensions.get("window").height*0.12,backgroundColor:Colors.primaryColor}}>
             <View style={{flexDirection:"row",marginLeft:10,marginRight:15,justifyContent:"space-between"}}>
               <TouchableOpacity onPress={()=>{this.props.navigation.toggleDrawer()}}>
                  <Ionicons name="ios-menu" size={35} color={Colors.accentColor} />
               </TouchableOpacity>
               <Text style={{color:Colors.accentColor,fontWeight:"700",fontSize:24,marginLeft:25,marginBottom:8}}>
                 Home
               </Text>
               <View style={{marginBottom:-10}}>
                <TouchableOpacity style={{marginBottom:-10}} onPress={()=>{this.props.navigation.navigate({routeName:"Notifications",
                                                                                params:{
                                                                                  companyID : this.state.companyID,
                                                                                  userID : this.state.userID
                                                                                }})}}>
                        <MaterialIcons name="notifications" size={35} color={Colors.accentColor} style={{marginRight:10,marginBottom:-10}}/>
                        <View style={{borderRadius:40,backgroundColor:Colors.accentColor,position:"absolute",left:-20,top:-5,}}>
                            <Text style={{color:Colors.primaryColor,padding:5,fontSize:8,fontWeight:"bold",width:22,height:22,textAlign:"center"}} numberOfLines={1}>
                                {this.state.count}
                            </Text>
                        </View>
                </TouchableOpacity>
                </View>
             </View>
              
           </View>
          <FlatList
            style={styles.gridItem}
            keyExtractor={(item, index) => item.screenNo}
            data={this.state.cards}
            renderItem={this.renderGridItem}
            numColumns={2}
          />
          {(this.state.showAdds)?(
            <View style={{height:180}}>
             <TimedSlideshow startideshow
             items={this.state.banners}
             onClose={()=>{
               this.setState({
                 showAdds:false
               })
             }}
         />
         </View>
          ):null}
         
        </View>
      );
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
});

Home.navigationOptions = (navData) => {
  return {
    headerShown:false,
    headerTitle: "  Home",
    headerLeft: ()=>
      <HeaderButtons HeaderButtonComponent={HeaderButton}>
        <Item
          title="Menu"
          iconName="ios-menu"
          onPress={() => {
            navData.navigation.toggleDrawer();
          }}
        />
      </HeaderButtons>,
    headerStyle: {
      backgroundColor:Colors.primaryColor,
    },
    headerTintColor: Colors.accentColor,
  };
};

export default Home;
