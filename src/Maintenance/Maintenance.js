import React, {Component} from 'react';
import {StyleSheet,View,ImageBackground,} from 'react-native';

import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';

export default class Maintenance extends Component {
  render() {
    return (
      <View >
        <ImageBackground source={require('../Images/main.png')} style={styles.container} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
 
    width: wp('100%'),
        height: hp('100%')
  },
});

