import { useState, useEffect } from "react";
//Fire base imports
import { db, auth } from "./FireBase";
//Importação para criar as collection no banco
import {
  doc,
  setDoc,
  collection,
  addDoc,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  onSnapshot,
} from "firebase/firestore";

//Import para cadastro.
import { createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from "firebase/auth";

//importando o alerts
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { toast } from "react-toastify";

import "./app.css";

function App() {
  const [titulo, setTitulo] = useState("");
  const [autor, setAutor] = useState("");
  const [idPost, setIdPost] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [user, setUser] = useState(false)
  const [userDetail, setUserDetail] = useState({})

  //Aula 05 = buscando mais de um post
  const [posts, setPosts] = useState([]);

  //utilizando o useEffect para depois da montagem do site carregar já algo que eu quero
  //Carregando ao vivo tudo que envolve meu banco com essa aplicação
  useEffect(() => {
    async function loadPosts() {
      //Usando o onSnapshot
      const onsub = onSnapshot(collection(db, "posts"), (snapshot) => {
        //criando a variavel lista para percorrer todas as listas pelo snapshot
        let listaPost = [];

        snapshot.forEach((doc) => {
          listaPost.push({
            id: doc.id,
            titulo: doc.data().Titulo,
            autor: doc.data().Autor,
          });
        });

        //Passando tudo que foi carregado pela variavel lista, para o setPosts
        setPosts(listaPost);
      });
    }

    loadPosts();
  }, []);

  //Metodo de verificação se tem ou não usuario logado
  useEffect(()=>{
    async function checkLogin() {
      onAuthStateChanged(auth, (user) =>{
        if(user){
          //Se tiver usuario ele entra aqui
          console.log(user);
          setUser(true)
          setUserDetail({
            uid: user.uid,
            email: user.email,
          })
        }else{
          //Não possui nehum usuario logado 
          setUser(false);
          setUserDetail({})
        }
      })
    }

    checkLogin()
  }, [])

  //Deixando a função assíncrona para ter o mesmo tempo de resposta que o banco
  //Funcão para criar,salvar e enviar ao banco
  async function handleAdd() {
    //Criando um documento dentro do banco, com id próprio
    //(Banco, collection)
    await addDoc(collection(db, "posts"), {
      Titulo: titulo,
      Autor: autor,
    })
      .then(() => {
        toast.success("Dados Registrados!");

        // Limpar os campos após o sucesso
        setTitulo("");
        setAutor("");
      })
      .catch((error) => {
        toast.warn("GEROU ERRO" + error);
      });
  }

  //Função para buscar no banco
  async function buscarPost() {
    //Criando uma referencia e acessando o banco e pasta que eu quero
    const postsRef = collection(db, "posts");
    await getDocs(postsRef)
      //snapshot = acessar os dados
      .then((snapshot) => {
        //criando a variavel lista para percorrer todas as listas pelo snapshot
        let lista = [];

        snapshot.forEach((doc) => {
          lista.push({
            id: doc.id,
            titulo: doc.data().Titulo,
            autor: doc.data().Autor,
          });
        });

        //Passando tudo que foi carregado pela variavel lista, para o setPosts
        setPosts(lista);

        toast.success("Arquivos encontrados com sucesso!");
      })
      .catch((error) => {
        toast.warn("Erro ao buscar os arquivos");
      });
  }

  //Função para dar update/editar os posts
  async function editarPost() {
    const docRef = doc(db, "posts", idPost);

    await updateDoc(docRef, {
      Titulo: titulo,
      Autor: autor,
    })
      .then(() => {
        toast.success("Post atualizado com sucesso");
        setIdPost("");
        setAutor("");
        setTitulo("");
      })
      .catch((error) => {
        toast.warn("Erro ao atualizar o post");
      });
  }

  //Função para excluir posts
  async function excluirPost(id) {
    const docRef = doc(db, "posts", id);
    await deleteDoc(docRef)
      .then(() => {
        toast.success("Post deletado com sucesso");
      })
      .catch((error) => {
        toast.warn("Erro ao deletar post");
      });
  }

  //Função para cadastrar o novo usuario
  async function novoUsuario(){
    await createUserWithEmailAndPassword(auth, email, senha)
    .then(() => {
      toast.success("CADASTRADO COM SUCESSO!")
    
      setEmail('')
      setSenha('')
    })
    .catch((error) => {
      
      //Criando um forma de validação de senha, no caso da senha ser fraca ou email já existir
      if(error.code === 'auth/weak-password'){
        toast.warn("Senha muito fraca.")
      }else if(error.code === 'auth/email-already-in-use'){
        toast.warn("Email já existe!")
      }

    })
  }

  //Função para logar o usuario
  async function logarUsuario() {
    await signInWithEmailAndPassword(auth, email, senha)
    .then((value)=>{
      toast.success("Logado com sucesso!")
      console.log(value.user)
      //Sistema para mostrar as informações
      setUserDetail({
        uid: value.user.uid,
        email: value.user.email,
      })
      //Para afirmar que esta logado 
      setUser(true)

      setEmail('')
      setSenha('')
    })
    .catch(() =>{
      toast.warn("Email ou senha estão incorretos")
    })
  }

  async function fazerLogout() {
    await signOut(auth)
    .then(()=>{
      setUser(false);
      setUserDetail({})
      toast.error("Você nos deixou !!")
    })
  }


  return (
    <div>
      <ToastContainer autoClose={2000} />
      <h1>Reactjs + FireBase</h1>

      {/* Quando o usuario estiver logado mostrar essas informações */}
      {/* && verificando se a variavel é verdadeira */}
      { user && (
        <div>
          <strong>Seja bem vindo(a)  (Você está logado!)</strong><br/>
          <span>ID: {userDetail.uid} - Email: {userDetail.email}</span>
          <br/>
          <button onClick={fazerLogout}>Sair</button>
          <br/><br/>
        </div>
      )}


      {/* Criando um sistema de autenticação para o usuario com campos de EMAIL e SENHA */}
      <h2>Usuarios</h2>
      <div className="container">
        <label>Email</label>
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Digite seu email"
        />{" "}
        <br />
        <label>Senha</label>
        <input
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
          placeholder="Digite uma palavra chave"
          type="password"
        />{" "}
        <br />
        <button onClick={novoUsuario}>Cadastrar</button> <br/>
        <button onClick={logarUsuario}>Login</button>
      </div>
      <br /> <br />
      <hr />
      <h2>O seu Post</h2>
      {/* Criando uma estrutura para testar e praticar o uso do banco */}
      <div className="container">
        <label>ID do Post:</label>
        <input
          placeholder="Digite o id do post"
          value={idPost}
          onChange={(e) => setIdPost(e.target.value)}
        />{" "}
        <br />
        <label>Titulo:</label>
        <textarea
          type="text"
          placeholder="Digite o titulo"
          // Dando o valor ao espaço
          value={titulo}
          // Fazendo com que tudo que o usuario digite fique armazenado na useState
          onChange={(e) => setTitulo(e.target.value)}
        />
        <br />
        <label>Autor:</label>
        <input
          type="text"
          placeholder="Autor do post"
          value={autor}
          onChange={(e) => setAutor(e.target.value)}
        />
        <br />
        {/* btn de envio */}
        <button onClick={handleAdd}>Cadastrar</button> <br />
        {/* btn para buscar */}
        <button onClick={buscarPost}>Buscar</button> <br />
        <button onClick={editarPost}>Atualizar Post</button> <br />
        {/* Criando o local onde ira aparecer os posts */}
        <ul>
          {/* Mapeando todos os posts e trazendo como objeto (post) */}
          {posts.map((post) => {
            return (
              <li key={post.id}>
                <strong>ID: {post.id}</strong> <br />
                <span>Titulo: {post.titulo}</span> <br />
                <span>Autor: {post.autor}</span> <br />
                <button onClick={() => excluirPost(post.id)}>Excluir</button>
                <br /> <br />
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}

export default App;
