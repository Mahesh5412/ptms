import React, { Component } from 'react';
import { NavigationActions, StackActions } from 'react-navigation'
import { AppRegistry, View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import NetInfo from '@react-native-community/netinfo';
import Snackbar from 'react-native-snackbar';
import { API } from "./WebServices/RestClient";

const resetAction = StackActions.reset({
  index: 0,
  actions: [
    NavigationActions.navigate({ routeName: 'NavigationRouter' })
  ]
})

export default class Splash extends Component {

  componentDidMount() {

    setTimeout(
      () => {
        this.Maintenance();
      },
      4000
    );
  }
  //Maintanace Page for Checking the Heathcheck
  Maintenance = () => {
    NetInfo.fetch().then(state => {
      if (state.type == "none" || state.type == "unknown") {
        console.log(state.type);
        Snackbar.show({
          title: 'No Internet Connection',
          backgroundColor: '#b52424',
          textAlign:'center',
          alignItems: 'center',
          duration: Snackbar.LENGTH_LONG,
        });
     
      } 
      else {
        fetch(API + "healthCheck.php")
          .then((response) => response.json())
          .then((responseJson) => {

            if (responseJson.status === 'True') {

              this.props.navigation.dispatch(resetAction)
            }
            else {
              this.props.navigation.navigate('Maintenance');
            }
          })
          .catch((error) => {

            console.log(error);

          });
      }
    });

  };

  render() {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }} >
        <Image style={{ width: '40%', height: '30%' }} source={require('./Images/splashnew.jpeg')} />
        <Text style={styles.text}>Powered by Cadrac Labs</Text>
        <Text></Text>
        <Text style={styles.text1}>1.4  27-12-2019</Text>
      </View>
    );
  }
}
const styles = StyleSheet.create({

  text: {

    textAlign: 'center',
    fontSize: 20,
    color: 'black',


  },
  text: {

    textAlign: 'center',
    fontSize: 15,
    color: 'black',


  },
})
