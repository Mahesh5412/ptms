/*
FileName:EmployeeInfo.js
Version:1.1.0
Purpose:Getting the List of all the employees list 
Devloper:Rishitha,Naveen,Mahesh
*/
import React, { Component } from 'react';
import { Platform, Linking, StyleSheet, Text, FlatList, TouchableOpacity, View, Image, ImageBackground, StatusBar, Dimensions, Alert } from 'react-native';
import { Title, Button, Container, Content, Header, Right, Left, Body, Tab, Tabs, TabHeading, Footer, Item, Input, FooterTab, Subtitle } from 'native-base';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import AsyncStorage from '@react-native-community/async-storage';
import Icon from 'react-native-vector-icons/FontAwesome';
import Communications from 'react-native-communications';
import { API } from "../WebServices/RestClient";
import NetInfo from '@react-native-community/netinfo';
import Snackbar from 'react-native-snackbar';
import {
    BallIndicator,
    BarIndicator,
    DotIndicator,
    MaterialIndicator,
    PacmanIndicator,
    PulseIndicator,
    SkypeIndicator,
    UIActivityIndicator
} from 'react-native-indicators';


export default class EmployeeInfo extends Component {


    constructor(props) {
        super(props);
        this.state = {
            isLoading: true,
            dataSource: [],
            isFetching: false,
            result: '',
            emp_role: '',
            //empId: this.props.navigation.state.params.empId,
            empStatus: this.props.navigation.state.params.empStatus,
        }
        this.arrayholder = [];
    }
    componentDidMount() {
        //to get the lsit of list of employees
        this.UserManageEmployees()
    }
    //to refresh the data
    onRefresh() {
        this.setState({ isFetching: true }, function () { this.UserManageEmployees() });

    }
    componentWillReceiveProps(nextProps) {
        //to get the lsit of list of employees
        this.UserManageEmployees();
    }

    //to get the lsit of list of employees
    UserManageEmployees() {

        AsyncStorage.getItem("cropcode", (err, res) => {
            const cropcode = res;

            AsyncStorage.getItem("emp_role", (err, res) => {
                const emp_role = res;
                //Checking the Internet Connection
                NetInfo.fetch().then(state => {
                    if (state.type == "none") {

                        Snackbar.show({
                            title: 'No Internet Connection',
                            backgroundColor: 'red',
                            duration: Snackbar.LENGTH_LONG,
                        });
                    } else {

                        fetch(API + 'getEmployeeInfo.php',
                            {
                                method: 'POST',
                                headers: {
                                    Accept: 'application/json',
                                    'Content-Type': 'application/json',
                                },
                                body: JSON.stringify({
                                    crop: cropcode,
                                    empId: this.props.navigation.state.params.empId,
                                })
                            })
                            .then((response) => response.json())
                            .then((responseJson) => {

                                console.warn(JSON.stringify(responseJson))
                                this.setState({
                                    isLoading: false,
                                    IdeaCount: responseJson.IdeaCount,
                                    mainTaskCount: responseJson.mainTaskCount,
                                    subTaskCount: responseJson.subTaskCount,
                                    RoadBlockCount: responseJson.RoadBlockCount,
                                    isFetching: false
                                }, function () {
                                });
                                this.arrayholder = responseJson.data;

                            })
                            .catch((error) => {
                                console.error(error);
                            });

                    }
                });

            });

        });

        // });
    }

    UserCheck() {
        AsyncStorage.getItem("emp_role", (err, res) => {
            console.log(res)
            const emp_role1 = res;
            this.setState({ emp_role: emp_role1 })
            if (emp_role1 === 'admin') {
                this.props.navigation.navigate('AdminManageEmployeesTasks', { empId: this.props.navigation.state.params.empId, emp_role: this.props.navigation.state.params.role })

            }
            else {
                this.props.navigation.navigate('UserManageEmployeesTasks', { empId: this.props.navigation.state.params.empId, emp_role: this.props.navigation.state.params.role })

            }
        });


    }
    //Seperate the List date
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
    //For Empty list
    _listEmptyComponent = () => {
        return (
            <View>
                <Text></Text>

            </View>
        )
    }



    render() {
        // alert(this.props.navigation.state.params.empId);
        if (this.state.isLoading) {
            return (
                <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                    <DotIndicator color='#00A2C1' />
                </View>
            );

        }

        return (
            <Container>
                <Header
                    androidStatusBarColor="#00A2C1"

                    style={{
                        backgroundColor: '#00A2C1',
                        height: 60,
                        width: Dimensions.get('window').width,
                        borderBottomColor: '#ffffff',
                        justifyContent: 'space-between',
                    }}>
                    {/* <Left>
                        <Icon size={25} name="navicon" style={{ color: '#fff' }} onPress={() =>
                            this.props.navigation.toggleDrawer()} />
                    </Left>
                    <Body>
                        <Title style={{ color: '#fff', fontWeight: '600' }}>Manage Employees</Title>
                    </Body>

                    <Right>
                        <Icon size={25} name="home" style={{ color: '#fff' }}
                            onPress={() => this.props.navigation.navigate('UserProfile')} />
                    </Right> */}

                    <Icon name="arrow-left" size={25} style={{ color: '#fff', paddingTop: 17 }} onPress={() =>
                        this.props.navigation.goBack(null)} />
                    <Body style={{ paddingLeft: 30,paddingTop:17 }}>
                        <Title style={{ color: '#fff', fontWeight: '600', }}>Employees Info</Title>
                        <Subtitle></Subtitle>
                    </Body>
                    <Right>
            <Icon size={20} name="pencil" style={{ color: '#fff' }}
              onPress={() => this.props.navigation.navigate("EditUser", {
                empId: this.props.navigation.state.params.empId,
                name: this.props.navigation.state.params.name,
                mobile: this.props.navigation.state.params.mobile,
                email: this.props.navigation.state.params.email,
                designation: this.props.navigation.state.params.designation,
                userName: this.props.navigation.state.params.userName,
                team: this.props.navigation.state.params.team,
                empStatus: this.props.navigation.state.params.empStatus,
                role: this.props.navigation.state.params.role,
                workingStatus: this.props.navigation.state.params.workingStatus,
              })} />
          </Right>

                </Header>





                <View style={styles.container}>
                    <View style={{ paddingLeft: '5%', }}>
                        < View style={styles.statusButton}>
                            <View style={{ flexDirection: 'row',paddingTop:hp('2%'),justifyContent:'space-around',alignItems:'center',alignContent:'center' }}>
                                <View>
                                    <Text style={{ color: '#00A2C1' ,textAlign:'center'}}>{this.props.navigation.state.params.name}</Text>
                                </View>
                                <View>

                                    <Text style={{ textAlign:'center'}}>{this.props.navigation.state.params.empStatus}</Text>
                                </View>
                            </View>
                        </ View>
                    </View>
                    <View style={{ paddingTop: 20 }}>
                        <View style={{ height: hp('25%') }}>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                <View style={{ paddingLeft: 20 }}>
                                    <TouchableOpacity onPress={() => this.props.navigation.navigate('ManageProjects', { empId: this.props.navigation.state.params.empId, emp_role: this.props.navigation.state.params.role })}>
                                        <ImageBackground source={require('../Images/projectinvolved.png')} style={{ width: wp('40%'), height: hp('22%'), margin: 10, }} >
                                            <Text style={{ paddingLeft: '85%', paddingTop: 20, fontWeight: 'bold', fontSize: 15 }}>{this.state.IdeaCount}</Text>

                                        </ImageBackground>
                                    </TouchableOpacity>
                                </View>
                                <View style={{ paddingRight: 40 }}>
                                    <TouchableOpacity onPress={() => this.props.navigation.navigate('EmployeeManageTask', { empId: this.props.navigation.state.params.empId, emp_role: this.props.navigation.state.params.role })}>
                                        <ImageBackground source={require('../Images/maintask.png')} style={{ width: wp('40%'), height: hp('22%'), margin: 10, }} >
                                            <Text style={{ paddingLeft: '85%', paddingTop: 20, fontWeight: 'bold', fontSize: 15 }}>{this.state.mainTaskCount}</Text>

                                        </ImageBackground>
                                    </TouchableOpacity>
                                </View>
                            </View>

                        </View>

                    </View>
                    <View style={{ paddingTop: 20 }}>
                        <View style={{ height: hp('35%') }}>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                <View style={{ paddingLeft: 20 }}>
                                    <TouchableOpacity onPress={() => this.UserCheck()}>
                                        <ImageBackground source={require('../Images/subtask.png')} style={{ width: wp('40%'), height: hp('22%'), margin: 10, }} >
                                            <Text style={{ paddingLeft: '85%', paddingTop: 20, fontWeight: 'bold', fontSize: 15 }}>{this.state.subTaskCount}</Text>

                                        </ImageBackground>
                                    </TouchableOpacity>
                                </View>
                                <View style={{ paddingRight: 40 }}>
                                    <TouchableOpacity onPress={() => this.props.navigation.navigate('RoadBlockInfo', { empId: this.props.navigation.state.params.empId, emp_role: this.props.navigation.state.params.role })}>
                                        <ImageBackground source={require('../Images/roadblocks.png')} style={{ width: wp('40%'), height: hp('22%'), margin: 10, }} >
                                            <Text style={{ paddingLeft: '85%', paddingTop: 20, fontWeight: 'bold', fontSize: 15 }}>{this.state.RoadBlockCount}</Text>

                                        </ImageBackground>
                                    </TouchableOpacity>
                                </View>
                            </View>

                        </View>

                    </View>
                </View>




            </Container>
        );
    }
}

//Styles for UI
const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 15,
        backgroundColor: '#EBEDEE',


    },
    statusButton: {

        // paddingLeft: '0%',
        height: hp('8%'),
        width: wp('90%'),
        // justifyContent: 'center',
        // alignContent: 'center',
        // alignItems: 'center',
        borderRadius: 25,
        backgroundColor: 'white',
        alignSelf: 'baseline',

    },
});