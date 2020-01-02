/*
FileName:EditUser.js
Version:1.0.0
Purpose:Modify or Edit option for existing Employee
Devloper:Rishitha,Mahesh
*/
import React, { Component } from 'react';
import { Platform, StyleSheet, Text, View, StatusBar, Dimensions, TouchableOpacity, Linking, TextInput, } from 'react-native';
import { Title, Button, Container, Content, Header, Right, Left, Body, Tab, Tabs, TabHeading, Footer, Item, Input, FooterTab } from 'native-base';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Dropdown } from 'react-native-material-dropdown';
import RadioGroup from 'react-native-radio-button-group';
import AsyncStorage from '@react-native-community/async-storage';
import { API } from "../WebServices/RestClient";
import NetInfo from '@react-native-community/netinfo';
import Snackbar from 'react-native-snackbar';
import log from '../LogFile/Log';
import { ScrollView } from 'react-native-gesture-handler';

export default class EditUser extends Component {

    constructor(props) {
        super(props);

        this.state = {
            maintask: '',
            description: '',
            modalVisible: false,
            empId: this.props.navigation.state.params.empId,
            name: this.props.navigation.state.params.name,
            email: this.props.navigation.state.params.email,
            username: this.props.navigation.state.params.userName,
            mobile: this.props.navigation.state.params.mobile,
            designation: this.props.navigation.state.params.designation,
            role: this.props.navigation.state.params.role,
            workingStatus: this.props.navigation.state.params.workingStatus,
            team: this.props.navigation.state.params.team,
            dataSource: [],

        };
    }

    componentDidMount() {
        log("Debug", "Edit screen is loaded");
        this.empDesignationSearch();//Getting list of Empdesignation
        this.empRoleSearch();//Getting Employees list
        //alert(this.props.navigation.state.params.empId+this.props.navigation.state.params.role+this.props.navigation.state.params.designation)
    }
    //Update employe profile data
    UpdateEmployee() {
        log("Info", " getRequestedIdeas(cropcode,empId,name,email,username,mobile,designation,workingStatus,team,role) is used to get all details of user");
        AsyncStorage.getItem("cropcode", (err, res) => {

            const cropcode = res;

            const { empId } = this.state;
            const { name } = this.state;
            const { email } = this.state;
            const { username } = this.state;
            const { mobile } = this.state;
            const { designation } = this.state;
            const { workingStatus } = this.state;
            const { team } = this.state;
            const { role } = this.state;

            //checking the network connection
            NetInfo.fetch().then(state => {
                if (state.type == "none") {
                    console.log(state.type);
                    log("Warn", "No internet connection");
                    Snackbar.show({
                        title: 'No Internet Connection',
                        backgroundColor: 'red',
                        duration: Snackbar.LENGTH_LONG,
                    });
                } else {


                    fetch(API + 'addEditEmployee.php', {
                        method: 'POST',
                        headers: {
                            'Accept': 'application/json',
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            empId: empId,
                            fullname: name,
                            email: email,
                            username: username,
                            mobile: mobile,
                            designation: designation,
                            user_status: workingStatus,
                            team: team,
                            action: 'update',
                            userType: role,
                            crop: cropcode
                        })

                    }).then((response) => response.json())
                        .then((responseJson) => {
                            if (responseJson.status === 'True') {
                                   // Showing response message coming from server after inserting records.
                                alert("Updated successfully");
                                this.props.navigation.navigate("AdminManageEmployeesTasks")
                               // alert(JSON.stringify(responseJson));
                              }
                         
                       

                        }).catch((error) => {
                            console.error(error);
                            log("Error", " Error in Update employe profile data");
                        });
                }
            });
        });
    }


    //fetch disgnation dropdown 
    empDesignationSearch() {
        log("Info", " empDesignationSearch(cropcode) is used to fetch disgnation dropdown ");
        AsyncStorage.getItem("cropcode", (err, res) => {

            const cropcode = res;
            NetInfo.fetch().then(state => {
                if (state.type == "none") {
                    console.log(state.type);
                    log("Warn", "No internet connection");
                    Snackbar.show({
                        title: 'No Internet Connection',
                        backgroundColor: 'red',
                        duration: Snackbar.LENGTH_LONG,
                    });
                } else {
                    fetch(API + 'spinner.php',
                        {
                            method: 'POST',
                            headers: {
                                Accept: 'application/json',
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify({
                                crop: cropcode,
                                // mainTaskId: taskId,
                                action: 'desig'
                            })
                        })
                        .then((response) => response.json())
                        .then((responseJson) => {

                            this.setState({
                                designationData: [...responseJson.data],
                            });
                        }
                        )
                        .catch((error) => {
                            console.error(error);
                            log("Error", "fetch disgnation dropdown  error");
                        });
                }
            });
        });

    }
    //fetch role dropdown 
    empRoleSearch() {
        log("Info", "     empRoleSearc(cropcode) is used to fetch role dropdown  ");
        AsyncStorage.getItem("cropcode", (err, res) => {

            const cropcode = res;
            NetInfo.fetch().then(state => {
                if (state.type == "none") {
                    console.log(state.type);
                    log("Warn", "No internet connection");
                    Snackbar.show({
                        title: 'No Internet Connection',
                        backgroundColor: 'red',
                        duration: Snackbar.LENGTH_LONG,
                    });
                } else {
                    fetch(API + 'spinner.php',
                        {
                            method: 'POST',
                            headers: {
                                Accept: 'application/json',
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify({
                                crop: cropcode,
                                // mainTaskId: taskId,
                                action: 'team'
                            })
                        })
                        .then((response) => response.json())
                        .then((responseJson) => {

                            this.setState({
                                roleData: [...responseJson.data],
                            });
                        }
                        )
                        .catch((error) => {
                            console.error(error);
                            log("Error", "fetch role dropdown  error");
                        });
                }
            });
        });

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
                        <Icon size={20} name="arrow-left" style={{ color: '#fff' }} onPress={() =>
                            this.props.navigation.goBack(null)} />
                    </Left>
                    <Body style={{ paddingRight: 60, }}>
                        <Title style={{ color: '#fff', fontWeight: '600', }}>Edit details</Title>
                    </Body>

                    <Right>

                    </Right>

                </Header>

                <Content>
                    <View>
                        <ScrollView>
                            <View >

                                <View style={{ paddingLeft: 10, }}>
                                    <Text style={{ fontSize: 20, color: 'black' }}>Edit Employee Details </Text>




                                </View>
                                <View style={{ paddingLeft: 10, }}>

                                    <TextInput style={{ width: wp('95%'), height: 45, borderBottomWidth: 1, }}
                                        placeholder='Employee ID *'
                                        underlineColorAndroid='transparent'


                                        value={this.state.empId}
                                        onChangeText={(empId) => this.setState({ empId })}>

                                    </TextInput>


                                </View>

                                <View style={{ paddingLeft: 10, }}>


                                    <TextInput style={{ width: wp('95%'), height: 45, borderBottomWidth: 1, }}
                                        placeholder='Full Name *'
                                      
                                        underlineColorAndroid='transparent'
                                       // selectionColor='white'
                                        value={this.state.name}
                                        onChangeText={(name) => this.setState({ name })}

                                    />
                                </View>
                                <View style={{ paddingLeft: 10, }}>


                                    <TextInput style={{ width: wp('95%'), height: 45, borderBottomWidth: 1, }}
                                        placeholder='Email *'
                                       
                                        underlineColorAndroid='transparent'
                                        //selectionColor='white'
                                        value={this.state.email}
                                        onChangeText={(email) => this.setState({ email })}

                                    />
                                </View>
                                <View style={{ paddingLeft: 10, }}>


                                    <TextInput style={{ width: wp('95%'), height: 45, borderBottomWidth: 1, }}
                                        placeholder='Username *'
                                        
                                        underlineColorAndroid='transparent'
                                        value={this.state.username}
                                       // selectionColor='white'
                                        onChangeText={(username) => this.setState({ username })}

                                    />
                                </View>
                                <View style={{ paddingLeft: 10, }}>


                                    <TextInput style={{ width: wp('95%'), height: 45, borderBottomWidth: 1, }}
                                        placeholder='Mobile *'
                                        underlineColorAndroid='transparent'
                                        keyboardType={"number-pad"}
                                        value={this.state.mobile}
                                      //  selectionColor='white'
                                        onChangeText={(mobile) => this.setState({ mobile })}

                                    />
                                </View>

                            </View>


                            <Dropdown
                                //   ref={this.nameRef}
                                style={{ paddingLeft: 10 }}
                                value={this.state.designation}
                                onChangeText={typeValue => this.setState({ designation: typeValue })}

                                data={this.state.designationData}
                            />
                            <Dropdown
                                //   ref={this.nameRef}
                                style={{ paddingLeft: 10 }}
                                value={this.state.team}
                                onChangeText={typeValue => this.setState({ team: typeValue })}

                                data={this.state.roleData}
                            />
                            <View style={{ paddingLeft: 10, paddingTop: 10, }}>
                                <Text>User Account Status</Text>
                                <View style={{ flexDirection: 'row', paddingTop: 10, }}>

                                    <RadioGroup
                                        horizontal
                                        options={[
                                            {
                                                id: 'Active',
                                                labelView: (
                                                    <Text>
                                                        <Text style={{ color: 'Black' }}>Active</Text>
                                                    </Text>
                                                ),
                                            },
                                            {
                                                id: 'Inactive',
                                                labelView: (
                                                    <Text>
                                                        <Text style={{ color: 'black' }}>In-Active</Text>
                                                    </Text>
                                                ),
                                            },

                                            {
                                                id: 'Other',
                                                labelView: (
                                                    <Text>
                                                        <Text style={{ color: 'black' }}>Other</Text>
                                                    </Text>
                                                ),
                                            },

                                        ]}
                                        activeButtonId={this.state.workingStatus}
                                        value={this.state.workingStatus}
                                        circleStyle={{ fillColor: 'black', borderColor: 'black' }}
                                        onChange={(options) => this.setState({ workingStatus: options.id })}
                                    />
                                </View>
                            </View>

                            <View style={{ paddingLeft: 10, paddingTop: 10, }}>
                                <Text>Select User Type</Text>
                                <View style={{ flexDirection: 'row', paddingTop: 10, }}>

                                    <RadioGroup
                                        horizontal
                                        options={[
                                            {
                                                id: 'Manager',
                                                labelView: (
                                                    <Text>
                                                        <Text style={{ color: 'Black' }}>Manager</Text>
                                                    </Text>
                                                ),
                                            },
                                            {
                                                id: 'Emp',
                                                labelView: (
                                                    <Text>
                                                        <Text style={{ color: 'black' }}>Employee </Text>
                                                    </Text>
                                                ),
                                            },

                                            {
                                                id: 'Approver',
                                                labelView: (
                                                    <Text>
                                                        <Text style={{ color: 'black' }}>Approver</Text>
                                                    </Text>
                                                ),
                                            },

                                        ]}
                                        activeButtonId={this.state.role}

                                        circleStyle={{ fillColor: 'black', borderColor: 'black' }}
                                        onChange={(options) => this.setState({ role: options.id })}
                                    />
                                </View>
                            </View>
                            {/* update all data  */}
                            <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', }}>
                                <TouchableOpacity onPress={this.UpdateEmployee.bind(this)} style={{ backgroundColor: '#00A2C1', borderRadius: 5, height: 30, alignItems: "center", justifyContent: 'center' }}>
                                    <Text style={{ color: 'white' }}> SUBMIT</Text>
                                </TouchableOpacity>

                            </View>
                        </ScrollView>
                    </View>
                </Content>
            </Container>
        );
    }
}