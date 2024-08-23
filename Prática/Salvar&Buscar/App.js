//Fire base imports
import {db} from './FireBase';
//Importação para criar as collection no banco 
import { doc, setDoc, collection, addDoc, getDoc } from 'firebase/firestore'

import { useState } from 'react'

//importando o alearts
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { toast } from 'react-toastify'

import './app.css'

function App() {

const [titulo, setTitulo] = useState ('');
const [autor, setAutor] = useState ('');

//Deixando a função assíncrona para ter o mesmo tempo de resposta que o banco 
//Funcão para criar,salvar e enviar ao banco
async function handleAdd(){
  //Criando um documento dentro do banco, com id próprio
                        //(Banco, collection)
    await addDoc(collection(db,"posts"),{
      Titulo: titulo,
      Autor: autor,
    })
    .then(()=>{
      toast.success("Dados Registrados!")

      // Limpar os campos após o sucesso
      setTitulo('');
      setAutor('');
    })
    .catch((error) => {
      toast.warn("GEROU ERRO" + error)
    })
  }

//Função para buscar no banco
async function buscarPost(){
  //Buscando o documento
 const postRef = doc(db, "posts", "12345")

 await getDoc(postRef)
 //snapshot = acessar os dados
  .then ((snapshot) => {
                  //Nome da propriedade do banco no final
    setAutor(snapshot.data().Autor)
    setTitulo(snapshot.data().Titulo)
    toast.success("Dados encotrados!")

 })
 .catch(() => {
  toast.warn("Erro ao buscar esse arquivo")
 })

}


  return (
    <div>
      <ToastContainer autoClose={2000}/>
      <h1>Reactjs + FireBase</h1>
      {/* Criando uma estrutura para testar e praticar o uso do banco */}
      <div className="container">
          <label>Titulo:</label>
          <textarea
            type="text"
            placeholder="Digite o titulo"
            // Dando o valor ao espaço
            value={titulo}
            // Fazendo com que tudo que o usuario digite fique armazenado na useState
            onChange={ (e) => setTitulo (e.target.value)}
          />
          <label>Autor:</label>
          <input
            type="text"
            placeholder="Autor do post"
            value={autor}
            onChange={ (e) => setAutor (e.target.value)}
          />
          {/* btn de envio */}
          <button onClick={handleAdd}>Cadastrar</button>
          {/* btn para buscar */}
          <button onClick={buscarPost}>Buscar</button>

      </div>
    </div>
  );
}

export default App;
