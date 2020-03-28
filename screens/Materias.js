import React from 'react';
import { StyleSheet, Text, View, ScrollView, ActivityIndicator} from 'react-native';

import { Entypo } from '@expo/vector-icons';
import { colors } from '../Colors';

import { firebaseConfig } from '../firebase/Config';
import * as firebase from 'firebase/app';
import 'firebase/firestore';

import {decode, encode} from 'base-64';
if (!global.btoa) {  global.btoa = encode };
if (!global.atob) { global.atob = decode };

firebase.initializeApp(firebaseConfig);
let db = firebase.firestore();

export default class Materias extends React.Component {
  
    constructor(props){
        super(props);
        this.state = {
            idsMaterias: [],
            materias: [],
        }
        this.mostrarLista = this.mostrarLista.bind(this);
        this.mostrarMaterias = this.mostrarMaterias.bind(this);
    }

    async componentDidMount(){
        let materias = [];
        let idsMaterias = [];

        try{
          await db.collection("chamada").get()
            .then((snapshot) => {
              snapshot.forEach( (materia) => {
                idsMaterias.push(materia.id);
                materias.push(materia.data());
              });
              materias.sort();
              this.setState({materias, idsMaterias});
            });
        }catch(error){
          console.log(error);
        }
    }

    mostrarLista(){
        return(
            <View style={styles.lista}>

                <View style={styles.headerChamada}>
                    <Text style={styles.headerChamadaMateria}>Matéria</Text>
                    
                    <View style={styles.headerChamadaAcoes}>
                        <Text style={styles.headerChamadaAcoesText}>Entrar</Text>
                    </View>
                </View>

                <View style={styles.content}>
                    <ScrollView>
                        {this.mostrarMaterias()}
                    </ScrollView>
                </View>
                
            </View>
        );
    }

    mostrarMaterias(){
        let { materias } = this.state;
        let { idsMaterias } = this.state;

        return materias.map((materia, key) => {
            let alunos = materia.alunos;
            let datas = materia.datas;
            let nomeMateria = materia.nome;

            return(
                <View key={key} style={styles.rowChamada}>
                    <View style={styles.nomeMateria}>
                        <Text>{nomeMateria}</Text>
                    </View>

                    <View style={styles.visualizarMateria}>
                        <Entypo color={colors.accent} size={30} onPress={() => this.props.navigation.navigate( 'Datas', {datas, alunos, nomeMateria, idDoc: idsMaterias[key]} )} name="eye"/>
                    </View>
                </View>
            );
        });
    }

    render(){
        return (
            <View style={styles.container}>
                <View style={styles.lista}>
                    { this.state.materias.length === 0 ? <ActivityIndicator size='large' color={colors.accent}/> : this.mostrarLista() }
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: colors.background,
  },
  headerChamada: {
    backgroundColor: colors.darkPrimary,
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
    flexDirection: 'row',
  },
  headerChamadaMateria: {
    flex: 1,
    color: colors.textIcons,
  },
  headerChamadaAcoes: {
    flex: 1,
    alignItems: 'flex-end',
  },
  headerChamadaAcoesText: {
    color: colors.textIcons,
  },
  lista: {
    justifyContent: 'center',
    flex: 1,
  },
  content: {
    flex: 9,
  },
  rowChamada: {
    flex: 1,
    flexDirection: 'row',
    padding: 10,
  },
  nomeMateria: {
    flex: 1,
  },
  visualizarMateria: {
    flex: 1,
    alignItems: 'flex-end',
    paddingRight: 10,
  }
});
