import * as React from 'react'
import { View, TouchableOpacity, Text, Alert,  ActivityIndicator} from 'react-native'
import PDFReader from 'rn-pdf-reader-js'
import Colors from "../constants/colors"

import * as FileSystem from 'expo-file-system'
import * as MediaLibrary from 'expo-media-library';
import * as Permissions from 'expo-permissions';
import * as Sharing from 'expo-sharing';

import { Icon } from 'react-native-elements'

// import RNFetchBlob from 
// const { config, fs } = RNFetchBlob
class PDFExample extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
          url: props.navigation.getParam("url"),
          downloadedUri: "",
        };
        // let PictureDir = fs.dirs.PictureDir // this is the pictures directory. You can check the available directories in the wiki.
        // let options = {
        //   fileCache: true,
        //   addAndroidDownloads : {
        //     useDownloadManager : true, // setting it to true will use the device's native download manager and will be shown in the notification bar.
        //     notification : false,
        //     path:  PictureDir + "/me_"+Math.floor(date.getTime() + date.getSeconds() / 2), // this is the path where your downloaded file will live in
        //     description : 'Downloading image.'
        //   }

        // }
        // config(options).fetch('GET', "http://www.africau.edu/images/default/sample.pdf").then((res) => {
        //   // do some magic here
        //   console.log("Downloading")
        // })
        this.props.navigation.setParams({downloadedUri: ""})
        this.makeDownload(props.navigation.getParam("url"))
      }

      makeDownload = async (pdfUrl) => {

        const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
              if (status === "granted") {
      
                  FileSystem.downloadAsync(pdfUrl, FileSystem.documentDirectory  +'Audit_Report.pdf')
                  .then( async ({uri}) => {
                      // await MediaLibrary.createAssetAsync(uri)
                      console.log("### File dowloaded with uri########")
                      console.log(uri)
      
                      try {
                        const asset = await MediaLibrary.createAssetAsync(uri);
                        const album = await MediaLibrary.getAlbumAsync('Download');
                        if (album == null) {
                          await MediaLibrary.createAlbumAsync('Downloads', asset, false);
                        } else {
                          await MediaLibrary.addAssetsToAlbumAsync([asset], album, false);
                        }
                        // props.navigation.navigate("PDFScreen", {url: uri} )
                        this.setState({downloadedUri: uri})
                        this.props.navigation.setParams({downloadedUri: uri})
                        

                      } catch (e) {
                        console.log("################## Error in saving to device ###############3")
                        console.log(e);
                      }
                  }).catch((err) => {
                     console.log("#### Error downloading from the url#######")
                     Alert.alert("Unable to download report")
                     console.log(err)
                  })
              }
      }

      render() {

        if(this.state.downloadedUri == "")
          return(
            <View style={{alignItems: "center", justifyContent: "center"}}>
              {/* <ActivityIndicator /> */}
              {/* <ActivityIndicator size="large" /> */}
              {/* <ActivityIndicator size="small" color="#0000ff" /> */}
              <ActivityIndicator size="large" color={Colors.primaryColor} />
            </View>
          )
        
        return (
            <PDFReader
            source={{
              uri: this.state.downloadedUri,
            }}
          />
        );
      }
}
 

// const makeDownload = async () => {

//   const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
//         if (status === "granted") {

//             FileSystem.downloadAsync("http://www.africau.edu/images/default/sample.pdf", FileSystem.documentDirectory  +'test.pdf')
//             .then( async ({uri}) => {
//                 // await MediaLibrary.createAssetAsync(uri)
//                 console.log("### File dowloaded with uri#####")
//                 console.log(uri)

//                 try {
//                   const asset = await MediaLibrary.createAssetAsync(uri);
//                   const album = await MediaLibrary.getAlbumAsync('Download');
//                   if (album == null) {
//                     await MediaLibrary.createAlbumAsync('Downloads', asset, false);
//                   } else {
//                     await MediaLibrary.addAssetsToAlbumAsync([asset], album, false);
//                   }
//                 } catch (e) {
//                   console.log("################## Error in saving to device ###############3")
//                   console.log(e);
//                 }
//             }).catch((err) => {
//                console.log("Error downloading from the url")
//                console.log(err)
//             })
//         }
// }
  


PDFExample.navigationOptions = (props) => {

    return {
      headerTitle: "Audit Report",
      headerRight: (
         
        <TouchableOpacity
         onPress={() => {
            console.log("### URI to share ####")
            console.log(props.navigation.getParam("downloadedUri"))
            Sharing.isAvailableAsync()
            .then((canShare) => {
              if(canShare == true)
                Sharing.shareAsync(props.navigation.getParam("downloadedUri"))
              else
                Alert.alert("Cannot share file, permission denied")
            })
            .catch((e) => {
              console.log("#### Error sharing ####")
              console.log(e)
            })
            }}
        >
            {/* <Text style={{ color: Colors.accentColor, fontWeight: "bold", marginHorizontal: 15, fontSize: 15}}>Share</Text> */}
            <Icon
                reverse
                name='ios-share'
                type='ionicon'
                color={Colors.accentColor}
                size={20}
            />
        </TouchableOpacity>
      ),

      headerStyle: {
        backgroundColor: Colors.primaryColor,
      },
      headerTintColor: Colors.accentColor,
    };
  };
  
export default PDFExample;
