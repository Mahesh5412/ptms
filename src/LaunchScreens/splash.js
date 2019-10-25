import React, { Component } from 'react';
import { NavigationActions, StackActions } from 'react-navigation'
import { AppRegistry, View ,Text, TouchableOpacity,Image,StyleSheet} from 'react-native';

const resetAction=StackActions.reset({
    index:0,
    actions:[
       NavigationActions.navigate({routeName:'NavigationRouter'})
    ]
})


export default class Splash extends Component {

  
  componentDidMount(){
      setTimeout(
          ()=>{
              this.props.navigation.dispatch(resetAction)
        
          },
        2000
      );
  }

render() {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }} >
      <Image style={{ width: '40%', height: '30%' }} source={require('./Images/splash.jpeg')} />
      <Text style={styles.text}>Powered by Cadrac Labsss</Text>
      <Text></Text>
      <Text style={styles.text1}>1.0.0   07-08-2019</Text>
    </View>
  );
}
}
const styles = StyleSheet.create({

text: {

  textAlign: 'center',
  fontSize: 20,
  color: 'black',
  // fontFamily:'bold',

},
text: {

  textAlign: 'center',
  fontSize: 15,
  color: 'black',
  // fontFamily:'bold',

},
})