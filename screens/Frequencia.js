import React from 'react';
import { StyleSheet, Text, View, ScrollView, Switch, TouchableOpacity, ActivityIndicator, ToastAndroid} from 'react-native';

import { colors } from '../Colors';

import * as firebase from 'firebase/app';
import 'firebase/firestore';
let db = firebase.firestore();

export default class Frequencia extends React.Component {
  
    constructor(props){
        super(props);
        this.state = {
            loadingSalvar: false,
            idDoc: this.props.navigation.getParam("idDoc"),
            chamada: this.props.navigation.getParam("alunos"),
            dataChamada: this.props.navigation.getParam("data"),
        }
        this.mostrarLista = this.mostrarLista.bind(this);
        this.mostrarChamada = this.mostrarChamada.bind(this);
        this.alterarPresenca = this.alterarPresenca.bind(this);
        this.salvarChamada = this.salvarChamada.bind(this);
    }

    alterarPresenca(key){
        let chamada = this.state.chamada;
        let faltou = !chamada[key].datas[0].faltou;
        chamada[key].datas[0].faltou = faltou;
        this.setState({chamada});
    }

    mostrarLista(){
        let { dataChamada } = this.state;

        let dia = dataChamada.toDate().getDate();
        let mes = dataChamada.toDate().getMonth() + 1;
        let ano = dataChamada.toDate().getFullYear();

        if(mes < 10) mes = '0' + mes;
        let dataExibida = dia + '/' + mes + '/' + ano;

        return(
            <View style={styles.lista}>

              <View style={styles.headerChamada}>
                <Text style={styles.headerChamadaData}>Chamada: {dataExibida}</Text>
              </View>
              
              <View style={styles.headerChamada}>
                  <Text style={styles.headerChamadaNome}>Nome</Text>
                  
                  <View style={styles.headerChamadaPresenca}>
                      <Text style={styles.headerChamadaPresencaText}>Presença</Text>
                  </View>
              </View>

              <View style={styles.content}>
                  <ScrollView>
                      {this.mostrarChamada()}
                  </ScrollView>
              </View>

              {this.state.loadingSalvar ?
              <ActivityIndicator size='large'  color={colors.accent}/> :
              <TouchableOpacity onPress={() => this.salvarChamada()} style={styles.footer}><Text style={styles.btnSalvar}>SALVAR</Text></TouchableOpacity>}
                
            </View>
        );
    }

    mostrarChamada(){
      let { chamada } = this.state;  
      let { dataChamada } = this.state;
      let dataChamadaPadrao = dataChamada.toDate().toLocaleDateString(); 

      chamada.sort((a, b) => a.numero - b.numero);

      return chamada.map((aluno, key) => {
          let numeroAluno = aluno.numero;
          let nome = aluno.nome_aluno;

          let presenca = false;
          aluno.datas.forEach((data) => {
            let dataAluno = data.dia.toDate().toLocaleDateString();
            dataAluno === dataChamadaPadrao ? presenca = !data.faltou : null;
          });
          return(
              <View key={key} style={styles.rowChamada}>
                  <View style={styles.nomeAluno}>
                      <Text>{numeroAluno}. {nome}</Text>
                  </View>

                  <View style={styles.presenca}>
                      <Switch onValueChange={() => this.alterarPresenca(key)} value={presenca}/>
                  </View>
              </View>
          );
      });
    }

    salvarChamada(){
      this.setState({loadingSalvar: true});
      let { chamada } = this.state;
      let { idDoc } = this.state;

      let docRef = db.collection('chamada').doc(idDoc);

      docRef.update({
        alunos: chamada
      }).then((_res) => {
        ToastAndroid.show("Chamada salva!", ToastAndroid.SHORT);
        this.setState({loadingSalvar: false});
      });
    }

    render(){
        Frequencia.navigationOptions = {
          title: this.props.navigation.getParam("nomeMateria"),
          headerStyle: {
            backgroundColor: colors.primary,
          },
          headerTintColor: 'white',
          headerTitleStyle: {
            color: 'white',
          },
        };

        return (
            <View style={styles.container}>
                <View style={styles.lista}>
                    { this.state.chamada.length === 0 ? <ActivityIndicator size='large' color={colors.accent}/> : this.mostrarLista() }
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
  headerChamadaData: {
    color: colors.textIcons,
  },
  headerChamadaNome: {
    flex: 1,
    color: colors.textIcons,
  },
  headerChamadaPresenca: {
    flex: 1,
    alignItems: 'flex-end',
  },
  headerChamadaPresencaText: {
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
  nomeAluno: {
    flex: 1,
  },
  presenca: {
    flex: 1,
    alignItems: 'flex-end',
  },
  footer: {
    borderRadius: 10,
    backgroundColor: colors.primary,
    alignSelf: 'center',
  },
  btnSalvar: {
    padding: 10,
    color: colors.textIcons,
  }
});
