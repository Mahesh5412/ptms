/*
FileName:RoadBlock.js
Version:1.0.0
Purpose:listing Roadblocks
Devloper:Rishitha
*/
import React, { Component } from 'react';
import { Platform, StyleSheet, Text, View, Dimensions, TouchableOpacity, FlatList, TextInput, Alert,ToastAndroid} from 'react-native';
import { Left, Button, Container, Header,Body,Title, Content, Item, Input, Right } from 'native-base';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Modal from "react-native-simple-modal";
import AsyncStorage from '@react-native-community/async-storage';
import { API } from "../WebServices/RestClient";
import NetInfo from '@react-native-community/netinfo';
import Snackbar from 'react-native-snackbar';
import RadioGroup from 'react-native-radio-button-group';

FOOTER_MAX_HEIGHT = 50
FOOTER_MIN_HEIGHT = 40

class ListItem extends React.Component {

  UpdateRoadBlock(){

    const { item } = this.props;

    AsyncStorage.getItem("cropcode", (err, res) => {
      const crop = res;
      NetInfo.fetch().then(state => {
        if (state.type == "none") {
          console.log(state.type);
          Snackbar.show({
            title: 'No Internet Connection',
            backgroundColor: 'red',
            duration: Snackbar.LENGTH_LONG,
          });
        }else{
      fetch(API + 'roadblock.php', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
      
          action:"solved",
          crop: crop,
          subTaskId:item.subTaskId,
          sno:item.sno

        })
      }).then((response) => response.json())
        .then((responseJson) => {
          //console.log(JSON.stringify(responseJson));
          console.log(responseJson);
          if (responseJson.status == 'true') {
          }
        }).catch((error) => {
          console.error(error);
        });
      }
    });
    });
  };
  render() {
    const { item } = this.props;
    return (

      <View style={styles.container}>
        <TouchableOpacity >
          <View style={styles.signup}>
            <View style={[styles.buttonContainer, styles.signupButton]} >
            <View style={{ flexDirection: 'row', paddingRight: 25, }}>
                <Text style={styles.signUpText4} >#RoadBlockID:</Text>
                <Text style={styles.signUpText3} >{item.sno}</Text>
              </View>
              <View style={styles.box}>

            
                <View style={{ flexDirection: 'row' }}>
                  <Text style={styles.signUpText0} >Description:</Text>
                  <Text style={styles.signUpText1} >{item.roadBlockDescription}</Text>
                </View>
                <View >
                <RadioGroup 
                      options={[
                      {
                      id: 'solved',
                      labelView: (
                      <Text>
                      <Text style={{ color: 'Green' }}></Text>
                      </Text>
                      ),
                      },
                      ]}
                       activeButtonId={item.roadBlockStatus}
                       value={item.roadBlockStatus}
                      //circleStyle={{ fillColor: 'black', borderColor: 'black' }} 
                      // onChange={() => this.userActiveTaskStatusUpdate()}
                      onChange={(options) => {this.UpdateRoadBlock()}}
                      />
                </View>
              </View>
            </View>

          </View>
        </TouchableOpacity>
      </View>

    )
  }
}

export default class Roadblock extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      dataSource: [],
      isFetching: false,
      open: false,
      roadblockdescription: "",
      role: '',
      userToken: '',
      subtaskId:this.props.navigation.state.params.subtaskid

    };
  }


  modalDidOpen = () => { }
  modalDidClose = () => { this.setState({ open: false }); };

  //dialog actions start
  moveUp = () => this.setState({ offset: -100 });

  resetPosition = () => this.setState({ offset: 0 });

  openModal = () => this.setState({ open: true });

  closeModal = () => this.setState({ open: false });
  //dialog actions close

  componentDidMount() {
    this.ideas();
  }

  //get the IdeasList or projects
  async ideas() {
    await AsyncStorage.getItem("emp_role", (err, res) => {
      console.log(res);
      this.setState({ role: res });
    });

    await AsyncStorage.getItem("userToken", (err, res) => {
      console.log(res);
      this.setState({ userToken: res });
    });
    await AsyncStorage.getItem("cropcode", (err, res) => {
      console.log(res);
      this.setState({ cropcode: res });
    });

    this.getRoadBlocks(this.state.role, this.state.userToken, this.state.cropcode);
  }


  onRefresh() {
    this.setState({ isFetching: true }, function () { this.ideas() });
  }
 
  //getting the Requested projects List
  getRoadBlocks(role, userToken, cropcode) {

    NetInfo.fetch().then(state => {
      if (state.type == "none") {
        console.log(state.type);
        Snackbar.show({
          title: 'No Internet Connection',
          backgroundColor: 'red',
          duration: Snackbar.LENGTH_LONG,
        });
      }else{
    fetch(API + 'roadblock.php',
      {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          crop: cropcode,
          action: 'getting',
          subTaskId:this.state.subtaskId,
        })
      })
      .then((response) => response.json())
      .then((responseJson) => {
        console.log(responseJson)
        this.setState({
          isLoading: false,
          dataSource: responseJson.data,
          isFetching: false
        }, function () {

        });
      })
      .catch((error) => {
        console.error(error);
      });
    }
  });

  }


  //Adding roadblock
  addRoadBlock = () => {
    AsyncStorage.getItem("cropcode", (err, res) => {
      const crop = res;
      NetInfo.fetch().then(state => {
        if (state.type == "none") {
          console.log(state.type);
          Snackbar.show({
            title: 'No Internet Connection',
            backgroundColor: 'red',
            duration: Snackbar.LENGTH_LONG,
          });
        }else{
      fetch(API + 'roadblock.php', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
      
          action:"insert",
          crop: crop,
          roadBlockDescription:this.state.roadblockdescription,
          subTaskId:this.state.subtaskId,

        })
      }).then((response) => response.json())
        .then((responseJson) => {
          //console.log(JSON.stringify(responseJson));
          if (responseJson.status === 'True') {
            this.getRoadBlocks(this.state.role, this.state.userToken, this.state.cropcode);
            this.setState({ open: false })
          }
        }).catch((error) => {
          console.error(error);
        });
      }
    });
    });
  };

  render() {
    return (
      <Container >
       <Header 
            androidStatusBarColor="#00A2C1"
            style={{
            backgroundColor: '#00A2C1', 
            height: 80,
            width: Dimensions.get('window').width, 
            borderBottomColor: '#ffffff',
            justifyContent: 'space-between', 
        }}>
          <Left>
              <Icon size={25} name="arrow-left" style={{color: '#fff'}}onPress={() =>
                this.props.navigation.goBack(null)}  />
              
          </Left>
          <Body>
            <Title style={{color: '#fff', fontWeight: '600' }}>RoadBlock</Title>
          </Body>
          <Right></Right>
     </Header>


        <View style={styles.MainContainer}>
          <View style={{ height: '96%' }}>

            <FlatList

              extraData={this.state}
              keyExtractor={this._keyExtractor}
              renderItem={this._renderItem}

              data={this.state.dataSource}

              onRefresh={() => this.onRefresh()}
              refreshing={this.state.isFetching}

              ItemSeparatorComponent={this.FlatListItemSeparator}
              renderItem={({ item, index }) =>
                <View>

                  <ListItem navigation={this.props.navigation}
                    item={item}/>
                </View>
              }
              keyExtractor={item => item.id}
              ListEmptyComponent={this._listEmptyComponent}
            />

          </View>

          <TouchableOpacity onPress={this.openModal} style={styles.bottomView}>
            <View style={styles.bottomView} >
              
              <Text style={styles.textStyle}>  Add RoadBlock</Text>


            </View>
          </TouchableOpacity>
          <Modal
            offset={this.state.offset}
            open={this.state.open}
            modalDidOpen={this.modalDidOpen}
            modalDidClose={this.modalDidClose}
            style={{ alignItems: "center" }} >

            <View style={{ alignItems: "center", paddingBottom: 40 }}>

              <Text>RoadBlock Info</Text>

              <TextInput placeholder='RoadBlock Title'
                style={{ height: 40, borderBottomWidth: 1, borderBottomColor: 'black', width: 300, marginTop: 10 }}
                onChangeText={(text) => this.setState({ roadblockdescription: text })}
                value={this.state.text} />
              <View style={{ flexDirection: 'row', marginTop: 30 }}>
                <TouchableOpacity style={{ margin: 5, backgroundColor: 'red', padding: 19, height: 30, alignItems: "center", justifyContent: 'center' }} onPress={this.closeModal}>
                  <Text style={{ color: 'white' }}>CANCEL</Text>
                </TouchableOpacity>
                <TouchableOpacity style={{ margin: 5, backgroundColor: 'green', padding: 20, height: 30, alignItems: "center", justifyContent: 'center' }} onPress={this.addRoadBlock}>
                  <Text style={{ color: 'white' }}>SAVE</Text>

                </TouchableOpacity>
              </View>
            </View>
          </Modal>
        </View>
      </Container>
    );
  }
}

const styles = StyleSheet.create(
  {
    MainContainer:
    {
      flex: 1,
      width: Dimensions.get('window').width,
      height: Dimensions.get('window').height
    },

    bottomView: {
      flexDirection: 'row',
      justifyContent: 'center',
      position: 'absolute',
      height: FOOTER_MAX_HEIGHT,
      bottom: 0,
      left: 0,
      right: 0,
      backgroundColor: 'black',
      alignItems: 'center'
    },

    textStyle: {

      color: '#fff',
      fontSize: 22
    },
    container: {
      flex: 1,
      width: '90%',
      paddingLeft: hp('2%'),
    },
    footer: {
      position: 'absolute',
      flex: 0.1,
      left: 0,
      right: 0,
      bottom: -10,
      backgroundColor: 'green',
      flexDirection: 'row',
      height: 80,
      alignItems: 'center',
    },
    bottomButtons: {
      alignItems: 'center',
      justifyContent: 'center',
      flex: 1,
    },
    footerText: {
      color: 'white',
      fontWeight: 'bold',
      alignItems: 'center',
      fontSize: 18,
    },
    buttonContainer: {
      width: wp('90%'),
      alignSelf: 'baseline',
      marginBottom: 10,
      color: '#d2691e',
      marginLeft: 4,



    },
    signupButton: {

      backgroundColor: '#ffffff',
    },
    subcontainer: {
      flex: 2,
      flexDirection: 'row',
      paddingTop: 40
    },
    signUpText0: {
      fontSize: 13,
    
      paddingTop: 10,

    },
    signUpText1: {
      fontSize: 13,
     width:'70%',
      paddingTop: 10,

      paddingLeft: 10,
    },
    end: {

      alignItems: 'flex-end',

    },
    end1: {
      flex: 2,
      height: '50%',
      paddingTop: 20,
      justifyContent: 'space-between',

      flexDirection: 'row',
    },
    s: {
      justifyContent: 'center',

      backgroundColor: '#ed7070',
      shadowOffset: { width: 50, height: 50 },
      alignItems: 'center',
      width: wp('40%'),
      height: hp('12%'),

    },
    signUpText2: {
      fontSize: 10,
      marginLeft: 200,
      fontSize: 13,
      color: 'green',
      paddingTop: 10,

      //  marginRight: 10,
      //textAlign: "right"

    },
    signUpText3: {
      color: 'green',
      fontSize: 14,
      paddingTop: 10,
      paddingLeft: 10,

      alignItems: 'center',
    },
    signUpText4: {
      fontSize: 14,
      paddingTop: 10,
      color: 'green',

      alignItems: 'center',
    },
    signup: {
      //paddingTop:20,
      color: "#FFF",

    },
   
    box: {
      flexDirection: 'row',
      position: 'relative',
      marginBottom: 10,

    },
    signUpText: {
      fontSize: 20,
      justifyContent: 'center',
      color: 'white',
      alignSelf: 'center',

    },
  });