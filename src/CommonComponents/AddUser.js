/*
FileName:AddUser.js
Version:1.0.0
Purpose:Add The new user
Devloper:MaheshReddy
*/
import React, { Component } from 'react';
import { Platform, StyleSheet, Text, View, StatusBar, Dimensions, TouchableOpacity, Linking, TextInput } from 'react-native';
import { Title, Button, Container, Content, Header, Right, Left, Body, Tab, Tabs, TabHeading, Footer, Item, Input, FooterTab } from 'native-base';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import Icon from 'react-native-vector-icons/FontAwesome';
import SearchableDropdown from 'react-native-searchable-dropdown';
import AsyncStorage from '@react-native-community/async-storage';
import {API }from "../WebServices/RestClient";
import NetInfo from '@react-native-community/netinfo';
import Snackbar from 'react-native-snackbar';
export default class AddUser extends Component {

    constructor(props) {
        super(props);

        this.state = {
            empId: '',
            fullname: '',
            email: '',
            username: '',
            mobile: '',


            modalVisible: false,
        };
    }

    isValid() {
        var { empId, fullname, email, username, mobile } = this.state;
        let valid = false;

        if (empId.length === 0) {
            alert("Enter Emp Id");
        }

        else if (fullname.length === 0) {
            alert("Enter Fullname");
        }
        else if (email.length === 0) {
            alert("Enter email");
        }
        else if (!this.verifyEmail(email)) {
            alert("Invalid Email");
        }
        else if (username.length === 0) {
            alert("Enter User name");
        }

        else if (mobile.length === 0) {
            alert("Enter phonenumber");
        }
        else if (mobile.length > 10) {
            alert("Invalid phonenumber");
        }
        else if (mobile.length < 10) {
            alert("Invalid phonenumber");
        }

        else {
            valid = true;
        }
        return valid;
    }
    verifyEmail(email) {
        var reg = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return reg.test(email);
    }


    // nav(){
    //     console.log("dvcdwvciuwdviwu");
    //     alert("mahesh");
    //     this.props.navigation.navigate("AddUser1");
    // }

    //Add Employee
    onSignIn() {
        if (this.isValid()) {
            console.log("staredt.,.................");
            console.log(this.state.empId);
            console.log(this.state.fullname);
            console.log(this.state.email);
            console.log(this.state.username);
            console.log(this.state.mobile);

            const { empId, fullname, email, username, mobile } = this.state;

            //  const username = "text";
            //  const password = "text";
            //  const cropcode = "ptmsreact";
            //  const usertype = "aadmin";

            AsyncStorage.getItem("cropcode", (err, res) => {
                const cropcode = res;
                NetInfo.fetch().then(state => {
                    if (state.type == "none") {
                      console.log(state.type);
                      Snackbar.show({
                        title: 'No Internet Connection',
                        backgroundColor: 'red',
                        duration: Snackbar.LENGTH_LONG,
                      });
                    }else{
                fetch(API + 'add_edit_employee.php', {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        empId: empId,
                        fullname: fullname,
                        action: "check",
                        crop: cropcode,
                        email: email,
                        username: username,
                        mobile: mobile,
                    })
                }).then((response) => response.json())
                    .then((responseJson) => {
                        //alert(responseJson);
                        console.log(JSON.stringify(responseJson));
                        console.log(responseJson);

                        if (responseJson.status === 'True') {
 this.props.navigation.navigate('UpdateEmployee', {
                                fullname: fullname,
                                email: email,
                                empId: empId,
                                username: username,
                                mobile: mobile,
                            });

                        }
                        else {

                            alert("this user already exits")

                            console.log(JSON.stringify(responseJson));
                            //alert(responseJson);
                        }

                    }).catch((error) => {
                        console.error(error);
                    });
                }
            });
            });

        }
    }

    save() {
        if (this.isValid()) {
            console.log("staredt.,.................");
            console.log(this.state.empId);
            console.log(this.state.fullname);
            console.log(this.state.email);
            console.log(this.state.username);
            console.log(this.state.mobile);

            const { empId, fullname, email, username, mobile, } = this.state;
            AsyncStorage.getItem("cropcode", (err, res) => {
                const cropcode = res;
                NetInfo.fetch().then(state => {
                    if (state.type == "none") {
                      console.log(state.type);
                      Snackbar.show({
                        title: 'No Internet Connection',
                        backgroundColor: 'red',
                        duration: Snackbar.LENGTH_LONG,
                      });
                    }else{
                fetch(API + 'add_edit_employee.php', {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        empId: empId,
                        fullname: fullname,
                        action: "save",
                        crop: cropcode,
                        email: email,
                        username: username,
                        mobile: mobile,
                        password:"1213",
                        team: "react",
                        designation: "react",
                        userType:"Emp",
                        user_status:1,
                        created_by:"admin",
                    })
                }).then((response) => response.json())
                    .then((responseJson) => {
                        //alert(responseJson);
                        console.log(JSON.stringify(responseJson));
                        console.log(responseJson);
                        alert(JSON.stringify(responseJson));
                        if (responseJson.status == 'True') {
                            this.props.navigation.navigate('UpdateEmployee', {
                                fullname: fullname,
                                email: email,
                                empId: empId,
                                username: username,
                                mobile: mobile,
                            });
                        }
                        else {
                            //alert("User exits");

                            console.log(JSON.stringify(responseJson));
                        }

                    }).catch((error) => {
                        console.error(error);
                    });
                }
            });
            });

        }
    }

    render() {
        return (
            <Container>
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
                        <Icon name="arrow-left" size={25} style={{ color: '#fff', }} onPress={() =>
                            this.props.navigation.navigate('AdminManageEmployees')} />
                    </Left>
                    <Body style={{ paddingRight: 60, }}>
                        <Title style={{ color: '#fff', fontWeight: '600', }}>Add User</Title>
                    </Body>

                    <Right>

                    </Right>

                </Header>


                <View style={{ paddingTop: 30, }}>

                    <View style={{ paddingLeft: 10, }}>
                        <Text style={{ fontSize: 20, color: 'black' }}>Enter Employee Details </Text>




                    </View>
                    <View style={{ paddingLeft: 10, }}>

                        <TextInput style={{ width: wp('95%'), height: 45, borderBottomWidth: 1, }}
                            placeholder='Empid *'
                            underlineColorAndroid='transparent'
                            selectionColor='white'
                            onChangeText={(empId) => this.setState({ empId })}
                        />
                    </View>

                    <View style={{ paddingLeft: 10, }}>


                        <TextInput style={{ width: wp('95%'), height: 45, borderBottomWidth: 1, }}
                            placeholder='Full Name *'
                            underlineColorAndroid='transparent'
                            selectionColor='white'
                            onChangeText={(fullname) => this.setState({ fullname })}

                        />
                    </View>
                    <View style={{ paddingLeft: 10, }}>


                        <TextInput style={{ width: wp('95%'), height: 45, borderBottomWidth: 1, }}
                            placeholder='Email *'
                            underlineColorAndroid='transparent'
                            selectionColor='white'
                            onChangeText={(email) => this.setState({ email })}

                        />
                    </View>
                    <View style={{ paddingLeft: 10, }}>


                        <TextInput style={{ width: wp('95%'), height: 45, borderBottomWidth: 1, }}
                            placeholder='Username *'
                            underlineColorAndroid='transparent'
                            selectionColor='white'
                            onChangeText={(username) => this.setState({ username })}

                        />
                    </View>
                    <View style={{ paddingLeft: 10, }}>


                        <TextInput style={{ width: wp('95%'), height: 45, borderBottomWidth: 1, }}
                            placeholder='Mobile *'
                            maxLength={10}
                            underlineColorAndroid='transparent'
                            selectionColor='white'
                            onChangeText={(mobile) => this.setState({ mobile })}

                        />
                    </View>

                </View>
                <View style={{ paddingTop: 20, }}>


                    <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', paddingTop: 40 }}>
                        <TouchableOpacity onPress={this.onSignIn.bind(this)} style={{ margin: 5, backgroundColor: '#00A2C1', borderRadius: 5, padding: 19, height: 30, alignItems: "center", justifyContent: 'center' }}>
                            <Text style={{ color: 'white' }}> Next</Text>
                        </TouchableOpacity>

                    </View>

                </View>







            </Container>
        );
    }
}