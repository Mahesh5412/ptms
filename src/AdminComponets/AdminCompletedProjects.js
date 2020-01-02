/*
FileName:AdminCompletedProjects.js
Version:1.0.0
Purpose:Getting the List of completed Projects list
Devloper:Raju,Naveen
*/
import React, { Component } from 'react';
import { Alert, Platform, StyleSheet, Text, View, TouchableOpacity, Dimensions, FlatList, TouchableHighlight, Image } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import { Title, Button, Container, Content, Header, Right, Left, Body, Tab, Tabs, TabHeading, Footer, Subtitle, Item, Input, FooterTab } from 'native-base';
import Icon from 'react-native-vector-icons/FontAwesome';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { API } from "../WebServices/RestClient";
import NetInfo from '@react-native-community/netinfo';
import Snackbar from 'react-native-snackbar';
import log from '../LogFile/Log';
import { NavigationEvents } from 'react-navigation';
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

class ListItem extends React.Component {

    //alert for project ReOpen
    ReOpenProjectAction() {
        log("Info", "ReOpenProject() method is used to give alert");
        const { item } = this.props;

        Alert.alert(
            'Alert..!',
            'Do you want to ReOpen the Project ?',
            [
                {
                    text: 'NO',
                    onPress: () => console.log('Cancel Pressed'),
                    style: 'NO',
                },
                { text: 'YES', onPress: () => this.ReOpenProject(item.idea_id) },
            ],
            { cancelable: false },
        );

    }


    //project verification 
    ReOpenProject(projectid) {
        log("Info", "ProjectReOpen(projectid) method is used to Re Open project");
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
                } else {
                    fetch(API + 'getIdeas.php',
                        {
                            method: 'POST',
                            headers: {
                                Accept: 'application/json',
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify({
                                crop: cropcode,
                                ideaId: projectid,
                                action: 'reopen'

                            })
                        })
                        .then((response) => response.json())
                        .then((responseJson) => {
                            if (responseJson.status == 'True') {
                                alert("Project Re Opened")
                            } else {
                                alert(responseJson.message);
                            }
                        })
                        .catch((error) => {
                            console.error(error);
                            log("Error", "Project Reopen Error");
                        });
                }
            });
        });
    }


    render() {
        const { item } = this.props;
        
        return (
            <View style={styles.container}>
                <TouchableOpacity onPress={this.props.Module}>
                    <View style={styles.signup}>
                        <View style={[styles.buttonContainer, styles.signupButton]} >
                            <View style={styles.box}>

                                <View style={{ flexDirection: 'row' }}>
                                    <Text style={styles.signUpText0} >Project No:</Text>
                                    <Text style={styles.signUpText1} >{item.idea_id}</Text>
                                </View>
                                <Text style={styles.signUpText2} >{item.created_on}</Text>
                            </View>
                            <View
                                style={{
                                    borderBottomColor: '#C0C0C0',
                                    borderBottomWidth: 0.3,
                                }}
                            />
                            <View style={{ flexDirection: 'row', paddingRight: 25, }}>
                                <View style={{ width: wp('70%'), flexDirection: 'row' }}>
                                    <Text style={styles.signUpText4} >Title:</Text>
                                    <Text style={styles.signUpText3} >{item.idea_title}</Text>
                                </View>
                                <View>
                                    <TouchableOpacity style={{ width: 100, backgroundColor: '#6cbb3f', marginEnd: 100, marginTop: 15 }} onPress={() => { this.ReOpenProjectAction() }}>
                                        <Text style={{ color: '#fff', textAlign: 'center' }}>Re Open</Text></TouchableOpacity>
                                </View>
                            </View>
                            <View style={{ flexDirection: 'row', paddingRight: 25 }}>
                                <Text style={styles.signUpText4} >Requested By:</Text>
                                <Text style={styles.signUpText3} >{item.userName}</Text>
                            </View>
                        </View>
                    </View>
                </TouchableOpacity>
            </View>

        )
    }
}
export default class AdminCompletedProjects extends Component {
    static navigationOptions = () => {
        return {
            tabBarOnPress({ navigation, defaultHandler }) {
                navigation.state.params.onTabFocus();
                defaultHandler();
                this.onRefresh();
            }
        };
    }

    constructor(props) {
        super(props);
        props.navigation.setParams({
            onTabFocus: this.handleTabFocus
        });
        this.state = {
            isLoading: true,
            dataSource: [],
            isFetching: false,
            role: '',
            userToken: '',
            idea_id: '',
            empId: '',
        }
        this.arrayholder = [];
    }
    handleTabFocus = () => {
        this.onRefresh();
    };

    //For getting the emp role ,user token and cropcode.   
    async componentDidMount() {
        log("Debug", "Admin completed projects screen is loaded");
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

        console.log(this.state.userToken);
        console.log(this.state.role);
        this.adminCompletedProjects(this.state.role, this.state.userToken, this.state.cropcode)
    }
    //Refresh the Completed Project List
    onRefresh() {
        this.setState({
            dataSource:[],
        })

        this.adminCompletedProjects();
    }

    //get AdminApprovedProjects list start
    adminCompletedProjects(role, userToken, cropcode) {
        log("Info", "AdminCompletedProjects:adminCompletedProjects(role, userToken, cropcode) method used to get all completed projects at admin side");
        console.log(userToken);
        console.log(role);

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
                            crop: cropcode,
                            action: 'completed',
                            empId: userToken,
                            userType: role,
                            // empId:empId
                        })
                    })
                    .then((response) => response.json())
                    .then((responseJson) => {
                        //alert(JSON.stringify(responseJson));
                        console.log(responseJson)
                        if (responseJson.status == 'True') {


                            this.setState({
                                isLoading: false,
                                dataSource: responseJson.data,
                                isFetching: false
                            }, function () {

                            });
                            this.arrayholder = responseJson.data;
                        }
                        else {
                            log("Warn", "no completed projects at admin side");
                            this.setState({
                                isLoading: false,
                            })
                            Snackbar.show({
                                title: 'No CompletedProjects',
                                backgroundColor: '#3BB9FF',
                                duration: Snackbar.LENGTH_LONG,
                            });
                        }
                    })
                    .catch((error) => {
                        //console.error(error);
                        log("Error", "Error in getting completed projects at admin side");
                    });
            }
        });
    }
    //get AdminApprovedProjects list end.

    FlatListItemSeparator = Module = (item, index) => {

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

    //For Search 
    SearchFilterFunction(text) {
        log("Info", "AdminCompletedProjects:SearchFilterFunction(text) method used for search functionality");
        console.log(text);
        const newData = this.arrayholder.filter(function (item) {
            const idea_id = item.idea_id.toUpperCase()
            const idea_id1 = text.toUpperCase()
            const idea_title = item.idea_title.toUpperCase()
            const idea_title1 = text.toUpperCase()
            const userName = item.userName.toUpperCase()
            const userName1 = text.toUpperCase()

            return idea_id.indexOf(idea_id1) > -1 ||
                idea_title.indexOf(idea_title1) > -1 ||
                userName.indexOf(userName1) > -1

        })
        this.setState({
            dataSource: newData,
            text: text
        })
    }


    render() {
        if (this.state.isLoading) {
            return (
                <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                    <DotIndicator color='#00A2C1' />
                </View>
            );

        }
        return (
            <Container style={{ height: Dimensions.get('window').height }}>
                <Header
                    androidStatusBarColor="#00A2C1"

                    style={{
                        backgroundColor: '#00A2C1',
                        height: 80,
                        width: Dimensions.get('window').width,
                        borderBottomColor: '#ffffff',
                        justifyContent: 'space-between',
                    }}>
                    <Icon name="navicon" size={25} style={{ color: '#fff', paddingTop: 17 }} onPress={() =>
                        this.props.navigation.toggleDrawer()} />
                    <Body style={{ paddingLeft: 30, }}>
                        <Title style={{ color: '#fff', fontWeight: '600' }}>Completed Projects</Title>
                        <Subtitle></Subtitle>
                    </Body>
                    <Icon name="home" size={25} style={{ color: '#fff', paddingTop: 17 }} onPress={() =>
                        this.props.navigation.navigate('AdminManageProjects')} />
                </Header>

                <Item>
                    <NavigationEvents
                        onDidFocus={() => this.onRefresh()}
                    />
                    <Input placeholder="Search"
                        onChangeText={(text) => this.SearchFilterFunction(text)} />
                    <Icon size={25} style={{ marginLeft: 10 }} name="search" />
                </Item>
                <Content>
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

                                        <ListItem navigation={this.props.navigation}
                                            item={item}
                                            ReOpenProjectAction={() => this.ReOpenProjectAction(item, index)}//For ReOpen Project

                                        />
                                    </View>
                                }
                                keyExtractor={item => item.id}
                                ListEmptyComponent={this._listEmptyComponent}
                            />

                        </View>
                    </View>
                </Content>



            </Container>
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
        fontSize: 13,
        marginLeft: 200,
        fontSize: 13,
        color: 'green',
        paddingTop: 10,
    },
    signUpText3: {

        fontSize: 13,
        paddingTop: 10,
        paddingLeft: 10,

        alignItems: 'center',
    },
    signUpText4: {
        fontSize: 13,
        paddingTop: 10,


        alignItems: 'center',
    },
    signup: {
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
        fontSize: 13,
        justifyContent: 'center',


        color: 'white',
        alignSelf: 'center',
    },
});