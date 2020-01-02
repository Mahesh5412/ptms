/*
FileName:ModuleAdd.js
Version:1.0.0
Purpose:Modify the existing module
Devloper:Naveen
*/
import React, { Component } from 'react';
import Requesteddata from '../AdminComponets/AdminRequestedDataProjects';
import { Platform, StyleSheet, Text, View, Dimensions, FlatList, TouchableHighlight, Image, TouchableOpacity, TextInput, Alert } from 'react-native';
import { Left, Button, Container, Header, Content, Item, Input } from 'native-base';
import AsyncStorage from '@react-native-community/async-storage';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import Modal from "react-native-simple-modal";
import { API } from "../WebServices/RestClient";
import NetInfo from '@react-native-community/netinfo';
import Snackbar from 'react-native-snackbar';
import Toast from 'react-native-whc-toast';
import log from '../LogFile/Log';

export default class AddModule extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            open: false,
            modulename: '',
            moduleId: this.props.navigation.state.params.moduleId,
            role: '',
            userToken: '',
            modalVisible: false,
            action: this.props.navigation.state.params.action,//getting action
            idea_id: this.props.navigation.state.params.ideaid,//idea id
            moduledesc: this.props.navigation.state.params.moduledesc,//moduledesc
            error1: '',
           itemPressedDisabled:false,
        };

    }
    //Open the Dialog Modal
    modalDidOpen = () => console.log("Modal did open.");
    //close the Dialog Modal
    modalDidClose = () => {
        this.props.navigation.goBack();
        this.setState({ open: false }); this.setState({ open: false });
        console.log("Modal did close.");

    };

    //Dialog actions start
    moveUp = () => this.setState({ offset: -100 });

    resetPosition = () => {
        this.setState({ offset: 0 });
        this.props.navigation.goBack();
    }

    //open the dialog 
    openModal = () => {
        this.setState({ open: true })

    };
    //close the dialog
    closeModal = () => {
        this.setState({ open: false });
        this.props.navigation.goBack();
    }
    //Dialog actions end
    componentDidMount() {
        log("Debug", "Module Add screen is loaded");
        this.openModal();

        // this.setModalVisible(!this.state.modalVisible);
    }

    //Refresh data
    onRefresh() {
        this.setState({ isFetching: true }, function () { this.add() });
    }

    //Validatios
    isValid() {
        const { moduledesc } = this.state;
        let valid = false;

        if (moduledesc.length === 0) {
            log("Warn", "moduledesc should not be empty");
            this.setState({ error1: 'Enter Module Title ' });
        }

        else {
            valid = true;
        }
        return valid;
    }


    //Modify the existing module
    modifyModule() {
        log("Info", " modifyModule(moduledesc, idea_id, cropcode) is used Modify the existing module");
        const { moduledesc } = this.state;
        const { idea_id } = this.state;
        console.log("idea_id" + idea_id);
     

        //userToken and crop code getting
        AsyncStorage.multiGet(["cropcode", "userToken"], (err, response) => {
            const cropcode = response[0][1];
            const userToken = response[1][1];
            console.log("userToken" + userToken);
            console.log("cropcode" + cropcode);
            //Checking the Network connection
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
                    if (this.isValid()) {
                        this.setState({ itemPressedDisabled: true })
                        fetch(API + 'manageModule.php',
                            {
                                method: 'POST',
                                headers: {
                                    Accept: 'application/json',
                                    'Content-Type': 'application/json',
                                },
                                body: JSON.stringify({
                                    action: this.state.action,
                                    idea_id: idea_id,
                                    crop: cropcode,
                                    moduleId: this.state.moduleId,
                                    moduleDesc: moduledesc,
                                    empId: userToken

                                })
                            })
                            .then((response) => response.json())
                            .then((responseJson) => {
                                console.log(responseJson)

                                if (responseJson.status == 'True') {
                                    this.setState({ open: false });
                                    this.setState({ itemPressedDisabled: false })
                                    
                                    //Navigate to AddModule screen
                                    this.props.navigation.navigate("AddModule", { idea_id: this.state.idea_id });
                                }

                            })
                            .catch((error) => {
                                console.error(error);
                                log("Error", "Modify the existing module error");
                            });
                    }
                }
            });
            this.refs.toast.show('Module Modified', Toast.Duration.long, Toast.Position.center);
        });

    }

    render() {

        return (
            <Modal
                offset={this.state.offset}
                open={this.state.open}
                modalDidOpen={this.modalDidOpen}
                modalDidClose={this.modalDidClose}
                style={{ alignItems: "center" }} >

                <View style={{ alignItems: "center", paddingBottom: 40 }}>
                <Toast ref="toast"/>
                    <Text>Add Module</Text>

                    <TextInput placeholder='Module Title'
                        style={{ height: 40, borderBottomWidth: 1, borderBottomColor: 'black', width: 300, marginTop: 10 }}
                        onChangeText={(text) => this.setState({ moduledesc: text })}
                        value={this.state.moduledesc}
                         />
                    <Text style={{ color: 'red', alignItems: 'flex-start', alignSelf: 'flex-start', justifyContent: 'flex-start', marginLeft: 25 }}>{this.state.error1}</Text>


                </View>
                <View style={{ flexDirection: 'row', marginTop: 20, alignItems: 'center', justifyContent: 'center', alignSelf: 'center', }}>
                    <TouchableOpacity style={styles.opensave} onPress={this.modifyModule.bind(this)} disabled={this.state.itemPressedDisabled}>
                        <Text style={{ color: 'white' }}>SAVE</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.opencancel} onPress={this.closeModal}>
                        <Text style={{ color: 'white' }}>CANCEL</Text>
                    </TouchableOpacity>
                </View>
            </Modal>


        );

    }

}
//Styles for UI
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
            fontSize: 18
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
            marginBottom: 25,
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
        opencancel: {
            flex: 1,
            ...Platform.select({
                ios: {
                    backgroundColor: 'red', margin: 20, height: 30, alignItems:
                        "center", justifyContent: 'center'
                },
                android: {
                    backgroundColor: 'red', margin: 20, height: 30, alignItems:
                        "center", justifyContent: 'center'
                },
            }),
        },
        opensave: {
            flex: 1,
            ...Platform.select({
                ios: {
                    backgroundColor: 'green', margin: 20, height: 30, alignItems:
                        "center", justifyContent: 'center'
                },
                android: {
                    backgroundColor: 'green', margin: 20, height: 30, alignItems:
                        "center", justifyContent: 'center'
                },
            }),
        },
    });