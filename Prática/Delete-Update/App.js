//Fire base imports
import {db} from './FireBase';
//Importação para criar as collection no banco 
import { doc, setDoc, collection, addDoc, getDoc, getDocs, updateDoc, deleteDoc } from 'firebase/firestore'

import { useState } from 'react'

//importando o alerts
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { toast } from 'react-toastify'

import './app.css'

function App() {

const [titulo, setTitulo] = useState ('');
const [autor, setAutor] = useState ('');
const [idPost, setIdPost] = useState ('');

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
      //Atualizar sozinho a lista
      buscarPost()
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

    toast.success("Arquivos encontrados com sucesso!")
  })
  .catch((error)=>{
    toast.warn("Erro ao buscar os arquivos")
  })
}

//Função para dar update/editar os posts
async function editarPost(){
  const docRef = doc(db, "posts", idPost)
  
  await updateDoc(docRef, {
    Titulo: titulo,
    Autor: autor
  })
  .then(()=>{
    toast.success("Post atualizado com sucesso")
    setIdPost('')
    setAutor('')
    setTitulo('')
    buscarPost()
  }) 
  .catch((error)=>{
    toast.warn("Erro ao atualizar o post")
  })
}


//Função para excluir posts
async function excluirPost(id) {
  const docRef = doc(db, "posts", id)
  await deleteDoc(docRef)
  .then(()=>{
    toast.success("Post deletado com sucesso")
    buscarPost()
  })
  .catch((error)=>{
    toast.warn("Erro ao deletar post")
  })
}

  return (
    <div>
      <ToastContainer autoClose={2000}/>
      <h1>Reactjs + FireBase</h1>


      {/* Criando uma estrutura para testar e praticar o uso do banco */}
      <div className="container">

        <label>ID do Post:</label>
        <input
          placeholder='Digite o id do post'
          value={idPost}
          onChange={(e) => setIdPost(e.target.value)}
        /> <br/>

          <label>Titulo:</label>
          <textarea
            type="text"
            placeholder="Digite o titulo"
            // Dando o valor ao espaço
            value={titulo}
            // Fazendo com que tudo que o usuario digite fique armazenado na useState
            onChange={ (e) => setTitulo (e.target.value)}
          /><br/>


          <label>Autor:</label>
          <input
            type="text"
            placeholder="Autor do post"
            value={autor}
            onChange={ (e) => setAutor (e.target.value)}
          /><br/> 


          {/* btn de envio */}
          <button onClick={handleAdd}>Cadastrar</button> <br/>
          {/* btn para buscar */}
          <button onClick={buscarPost}>Buscar</button> <br/>

          <button onClick={editarPost}>Atualizar Post</button> <br/>

          

          {/* Criando o local onde ira aparecer os posts */}
          <ul>
            {/* Mapeando todos os posts e trazendo como objeto (post) */}
            {posts.map( (post) => {
              return(
                <li key={post.id} >
                  <strong>ID: {post.id}</strong> <br/>
                  <span>Titulo: {post.titulo}</span> <br/>
                  <span>Autor: {post.autor}</span> <br/> 
                  <button onClick={() => excluirPost(post.id)}>Excluir</button> <br/> <br/>
                </li>
              )
            })}
          </ul>

      </div>

    </div>
  );
}

export default App;
