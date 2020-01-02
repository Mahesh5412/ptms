/*
FileName:UserDrawerComponents.js
Version:1.0.0
Purpose:Navgate to all User classes from Here and also logout
Devloper:Rishitha,Naveen,Mahesh
*/
import React, { Component } from 'react';
import { NavigationActions, DrawerLayoutAndroid, DrawerActions } from 'react-navigation';
import { Text, View, StyleSheet, ImageBackground, Dimensions, Image, TouchableOpacity, Alert } from 'react-native'
import { Title, Button, Container, Content, Header, Right, Left, Body, Tab, Tabs, TabHeading, Footer, FooterTab } from 'native-base';
import AsyncStorage from '@react-native-community/async-storage';
import Icon from 'react-native-vector-icons/FontAwesome';
import { white } from 'ansi-colors';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import AutoHeightImage from 'react-native-auto-height-image';
export default class drawerContentComponents extends Component {

    constructor(props) {
        super(props);
        this.state = {
            usertype: '',
            ptime: '0',
        }
    }

    componentDidMount() {

        AsyncStorage.getItem("userName", (err, res) => {
            this.setState({ usertype: res });


        });

    }

    //this methos is used to ask the user about confirm about 
    logOutOption() {
        Alert.alert(
            'Alert',
            'Do you want to Logout',
            [
                {
                    text: 'Cancel',
                    onPress: () => console.log('Cancel Pressed'),
                    style: 'cancel',
                },
                { text: 'OK', onPress: () => this.logOut() },
            ],
            { cancelable: false },
        );
    }

    //this method is used for logout the application and also clear the asyncstorage .
    logOut() {
        AsyncStorage.clear();
        this.props.navigation.navigate('Auth');
    }

    navigateToScreen = (route) => (
        () => {
            const navigateAction = NavigationActions.navigate({
                routeName: route
            });
            this.props.navigation.dispatch(navigateAction);
            this.props.navigation.dispatch(DrawerActions.closeDrawer());
        })



    preferedDays = () => {
        // alert(this.state.nodays);
        const days = this.state.ptime;
        AsyncStorage.setItem('nodays', days);
        AsyncStorage.setItem("levelno",''),
        this.props.navigation.navigate("UserManageTask");

    }

    render() {
        return (
            <View style={styles.container}>
                <View style={styles.headerContainer}>
                    <View style={{ alignItems: 'center', marginTop: 10, }}>
                    </View>
                    <View style={{ alignItems: 'center', marginTop: 10, }}>
                        <Image style={{ width: wp('37%'), height: hp('18%') }} source={require('../Images/drawer.png')} />
                        <Text style={{ color: '#000000', paddingLeft: 10 }}>Welcome,{this.state.usertype}</Text>
                    </View>
                </View>

                <View style={styles.screenContainer}>

                    <TouchableOpacity onPress={this.navigateToScreen('UserMyTask')}>
                        <View style={styles.screenStyle}>
                            <Icon size={25} name="list-alt" style={{ color: '#000000', width: wp('8%') }} />
                            <Text style={{ color: '#000000', marginLeft: 20 }}>My Task</Text>
                        </View>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={this.navigateToScreen('RoadBlockList')}>
                        <View style={styles.screenStyle}>
                            <Icon size={25} name="bitbucket" style={{ color: '#000000', width: wp('8%') }} />
                            <Text style={{ color: '#000000', marginLeft: 20 }}>RoadBlock</Text>
                        </View>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={this.navigateToScreen('UserProfile')}>
                        <View style={styles.screenStyle}>
                            <Icon size={25} name="smile-o" style={{ color: '#000000', width: wp('8%') }} />
                            <Text style={{ color: '#000000', marginLeft: 20 }}>Profile</Text>
                        </View>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={this.navigateToScreen('UserManageProjects')}>
                        <View style={styles.screenStyle}>
                            <Icon size={25} name="home" style={{ color: '#000000', width: wp('8%') }} />
                            <Text style={{ color: '#000000', marginLeft: 20 }}>Manage Projects</Text>
                        </View>
                    </TouchableOpacity>


                    <TouchableOpacity onPress={this.preferedDays}>
                        <View style={styles.screenStyle}>
                            <Icon size={25} name="id-badge" style={{ color: '#000000', width: wp('8%') }} />
                            <Text style={{ color: '#000000', marginLeft: 20 }}>Manage Tasks</Text>
                        </View>
                    </TouchableOpacity>





                    <TouchableOpacity onPress={this.navigateToScreen('UserManageEmployees')}>
                        <View style={styles.screenStyle}>
                            <Icon size={25} name="users" style={{ color: '#000000', width: wp('8%') }} />
                            <Text style={{ color: '#000000', marginLeft: 20 }}>Manage Employees</Text>
                        </View>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={this.navigateToScreen('UserPreference')}>
                        <View style={styles.screenStyle}>
                            <Icon size={25} name="user" style={{ color: '#000000', width: wp('8%') }} />
                            <Text style={{ color: '#000000', marginLeft: 20 }}>User Preference</Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={this.navigateToScreen('UserCompletedProjects')}>
                        <View style={styles.screenStyle}>
                            <Icon size={25} name="lightbulb-o" style={{ color: '#000000', width: wp('8%') }} />
                            <Text style={{ color: '#000000', marginLeft: 20 }}>Completed Projects</Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={this.navigateToScreen('Updates')}>
                        <View style={styles.screenStyle}>
                            <Icon size={25} name="history" style={{ color: '#000000', width: wp('8%') }} />
                            <Text style={{ color: '#000000', marginLeft: 20 }}>Updates</Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={this.logOutOption.bind(this)}>
                        <View style={styles.screenStyle}>
                            <Icon size={25} name="sign-out" style={{ color: '#000000', width: wp('8%') }} />
                            <Text style={{ color: '#00000', marginLeft: 20 }}>Logout</Text>
                        </View>
                    </TouchableOpacity>



                </View>
            </View>

        )
    }
}

const styles = StyleSheet.create({
    container: {

        backgroundColor: '#fff',
        height: Dimensions.get('window').height,


    },
    headerContainer: {
        ///  height: 150,
        height: hp('21%')
    },
    headerText: {
        color: '#fff8f8',
    },
    screenContainer: {
        paddingTop: 20,

    },
    screenStyle: {
        //   height: 30,
        marginTop: 2,
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'grey',
        padding: 10,
        height: hp('7%'),
        borderLeftWidth: 0,
        borderRightWidth: 0,
        borderBottomWidth: 0,



    },
    screenTextStyle: {
        fontSize: 23,
        marginLeft: 40

    },

});