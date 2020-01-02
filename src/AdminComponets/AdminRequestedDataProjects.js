/*
FileName:AdminRequestedDataProjects.js
Version:1.0.0
Purpose:Request the new Project and shows list of projects
Devloper:Rishitha,Harsha
*/
import React, { Component } from 'react';
import { Platform, StyleSheet, Text, View, Dimensions, FlatList, TouchableHighlight, Image } from 'react-native';
import { Icon, Left, Button, Container, Header, Content, Item, Input } from 'native-base';
import AsyncStorage from '@react-native-community/async-storage';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { API } from "../WebServices/RestClient";
import NetInfo from '@react-native-community/netinfo';
import Snackbar from 'react-native-snackbar';

class ListItem extends React.Component {

  render() {
    const { item } = this.props;
    return (

      <View style={styles.container}>
        <View style={styles.signup}>
          <View style={[styles.buttonContainer, styles.signupButton]} >
            <View style={styles.box}>
              <View style={{ flexDirection: 'row' }}>
                <Text style={styles.signUpText0} >Project No:</Text>

                <Text style={styles.signUpText1} >{item.idea_id}</Text>

              </View>
              <Text style={styles.signUpText2} > {item.created_on}</Text>
            </View>
            <View
              style={{
                borderBottomColor: '#C0C0C0',
                borderBottomWidth: 0.3,
              }}
            />

            <View style={{ flexDirection: 'row', paddingRight: 25, }}>
              <Text style={styles.signUpText4} >Title:</Text>
              <Text style={styles.signUpText3} >{item.idea_title}</Text>
            </View>

            <View style={{ flexDirection: 'row', paddingRight: 25 }}>
              <Text style={styles.signUpText4} >Requested By:</Text>
              <Text style={styles.signUpText3} >{item.userName}</Text>
            </View>

            <View style={{ flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center' }}>
              <TouchableOpacity style={{ width: 60, backgroundColor: 'green' }}><Text style={{ color: '#fff', textAlign: 'center' }}>Approve</Text></TouchableOpacity>
              <TouchableOpacity style={{ width: 40, backgroundColor: 'black', marginLeft: 10 }}><Text style={{ color: '#fff', textAlign: 'center' }}>Reject</Text></TouchableOpacity>

            </View>

          </View>

        </View>

      </View>

    )
  }
}
export default class RequestedData extends Component {
  constructor(props) {

    super(props);
    this.state = {
      isLoading: true,
      dataSource: [],
      isFetching: false,


    }
  }


  async componentDidMount() {

    var role = await AsyncStorage.getItem('role')
    var userToken = await AsyncStorage.getItem('userToken')




    this.requestedProjectsList(role, userToken)
  }
  //Refresh the data
  onRefresh() {
    this.setState({ isFetching: true }, function () { this.requestedProjectsList() });
  }



  componentWillReceiveProps(nextProps) {
    console.log(nextProps);
    console.log("re loading...........")
    this.requestedProjectsList();
  }
  //Shows the List of requested projects
  requestedProjectsList(role, userToken) {


    console.log(this.state.userToken);
    console.log(this.state.role);

    NetInfo.fetch().then(state => {
      if (state.type == "none") {
        console.log(state.type);
        Snackbar.show({
          title: 'No Internet Connection',
          backgroundColor: 'red',
          duration: Snackbar.LENGTH_LONG,
        });
      } else {
        fetch(API + 'getIdeas.php',
          {
            method: 'POST',
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({

              action: 'requested',
              empId: userToken,
              userType: role
            })
          })
          .then((response) => response.json())
          .then((responseJson) => {
            //    alert(JSON.stringify(responseJson));
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


  //action for add module
  action(item, index) {

    this.props.navigation.navigate('Module');

  }

  FlatListItemSeparator = () => {
    return (
      <View
        style={{
          //  height: .5,
          width: "100%",
          backgroundColor: "#000",
        }}
      />
    );
  }


  //if data is empty in flatlist we will use _listEmptyComponent method

  _listEmptyComponent = () => {
    return (
      <View style={{ width: '90%', height: '80%' }}>
        <Text></Text>
      </View>
    )
  }


  render() {

    return (
      <View>
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

                <ListItem
                  item={item}
                  action={() => this.action(item, index)}
                />
              </View>
            }
            keyExtractor={item => item.id}
            ListEmptyComponent={this._listEmptyComponent}
          />

        </View>
      </View>
    );
  }
}
const styles = StyleSheet.create({
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
    color: 'green',
    paddingTop: 10,

  },
  signUpText1: {
    fontSize: 13,
    color: 'green',
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

    fontSize: 12,
    paddingTop: 10,
    paddingLeft: 10,

    alignItems: 'center',
  },
  signUpText4: {
    fontSize: 12,
    paddingTop: 10,


    alignItems: 'center',
  },
  signup: {
    //paddingTop:20,
    color: "#FFF",

  },
  boxone: {
    flex: 1,
    marginTop: 5,

  },
  boxtwo: {
    flex: 1,

  },
  boxthree: {
    flex: 1,

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
