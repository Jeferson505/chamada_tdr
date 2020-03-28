import React from 'react';
import { StyleSheet, Text, TextInput, View, TouchableOpacity, ActivityIndicator, Image} from 'react-native';

import userLogin from '../assets/userLogin.png';
import { colors } from '../Colors';

import * as firebase from 'firebase/app';
import 'firebase/auth';

import {decode, encode} from 'base-64';
if (!global.btoa) {  global.btoa = encode };
if (!global.atob) { global.atob = decode };

export default class Login extends React.Component {
  
    constructor(props){
        super(props);
        this.state = {
            email: '',
            senha: '',
            loading: false,
        }

        this.login = this.login.bind(this);
    }

    login(){
        let { email } = this.state;
        let { senha } = this.state;

        if(email === '' || senha === '') return alert("Preencha o e-mail e senha corretamente.");

        this.setState({loading: true});

        try{
            firebase.auth().signInWithEmailAndPassword(email, senha)
                .then((_user) => { this.setState({loading: false}) })
                .catch((error) => {alert("Email ou senha incorretos! Tente novamente."); this.setState({loading: false})});
        }catch(_error){
            this.setState({loading: false})
        }
    }

    render(){
        return (
            <View style={styles.container}>
                <View style={styles.parteSuperior}>
                    <Image source={userLogin} style={styles.imagem} />

                    <Text style={styles.textLabel}>Email:</Text>
                    <TextInput style={styles.input} onChangeText={ (email) => this.setState({email})}
                        autoCapitalize="none" textContentType="emailAddress" keyboardType="email-address" autoCompleteType="email"/>

                    <Text style={styles.textLabel}>Senha:</Text>
                    <TextInput style={styles.input} onChangeText={ (senha) => this.setState({senha})} secureTextEntry/>
                </View>

                <View style={styles.parteInferior}>
                    { this.state.loading ? <ActivityIndicator size='large' color={colors.accent}/> : <TouchableOpacity onPress={() => this.login()} style={styles.btnLogin}><Text style={styles.textBtnLogin}>Login</Text></TouchableOpacity>}
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.primary,
    },
    parteSuperior: {
        padding: '10%',
        justifyContent: 'center',
        borderBottomLeftRadius: 100,
        borderBottomRightRadius: 100,
        borderTopRightRadius: 100,
        backgroundColor: colors.background,
        marginBottom: 20,
    },
    imagem: {
        alignSelf: 'center',
        width: 150,
        height: 150,
        borderRadius: 100,
        borderWidth: 7,
        borderColor: colors.primary,
    },
    textLabel: {
        color: colors.primary,
        padding: 5,
        fontSize: 18,
        fontWeight: 'bold',
    },
    input: {
        borderRadius: 20,
        margin: 5,
        padding: 10,
        backgroundColor: colors.lightPrimary,
    },
    parteInferior: {
        borderTopRightRadius: 50,
        flex: 1,
        backgroundColor: colors.primary,
        justifyContent: 'center',
        alignSelf: 'center',
    },
    btnLogin: {
        borderRadius: 40,
        backgroundColor: colors.background,
    },
    textBtnLogin: {
        color: colors.primary,
        fontSize: 20,
        fontWeight: 'bold',
        padding: 10,
    }
});
