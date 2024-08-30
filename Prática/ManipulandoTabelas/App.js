//Fire base imports
import {db} from './FireBase';
//Importação para criar as collection no banco 
import { doc, setDoc, collection, addDoc, getDoc, getDocs } from 'firebase/firestore'

import { useState } from 'react'

//importando o alearts
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { toast } from 'react-toastify'

import './app.css'

function App() {

const [titulo, setTitulo] = useState ('');
const [autor, setAutor] = useState ('');
//Aula 05 = buscando mais de um post
const [posts, setPosts] = useState ([]);

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
  //Criando uma referencia e acessando o banco e pasta que eu quero 
  const postsRef = collection(db, "posts")
  await getDocs(postsRef)

  //snapshot = acessar os dados
  .then((snapshot) =>{
    //criando a variavel lista para percorrer todas as listas pelo snapshot
    let lista = [];

    snapshot.forEach((doc) =>{
      lista.push({
        id: doc.id,
        titulo: doc.data().Titulo,
        autor: doc.data().Autor,
      })
    })

    //Passando tudo que foi carregado pela variavel lista, para o setPosts
    setPosts(lista);
  })
  .catch((error)=>{
    toast.warn("Erro ao buscar os arquivos")
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

          {/* Criando o local onde ira aparecer os posts */}
          <ul>
            {/* Mapeando todos os posts e trazendo como objeto (post) */}
            {posts.map( (post) => {
              return(
                <li key={post.id} >
                  <span>Titulo: {post.titulo}</span> <br/>
                  <span>Autor: {post.autor}</span> <br/> <br/>
                </li>
              )
            })}
          </ul>

      </div>

    </div>
  );
}

export default App;
