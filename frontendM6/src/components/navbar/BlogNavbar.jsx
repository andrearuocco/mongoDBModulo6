import React, { useState, useContext } from "react";
import { Button, Container, Navbar, Modal, Form, Image } from "react-bootstrap";
import { register } from "../../data/fetch.js"
import { Link, useNavigate } from "react-router-dom";
import logo from "../../assets/logo.png";
import { AuthorContext } from "../../context/AuthorContextProvider.js";
import "./styles.css";

const NavBar = props => {
  const {token, setToken, authorInfo, setAuthorInfo} = useContext(AuthorContext) // token usato per mostare pagina loggata oppure no
  const navigate = useNavigate()
  const [showRegister, setShowRegister] = useState(false); // stato per mostrare il form di registrazione utente
  // settano lo stato di showRegister per far apparire o scamparire il modal di registrazione
  const handleCloseTwo = () => setShowRegister(false);
  const handleShowTwo = () => setShowRegister(true);
  // inizializzo il form di registrazione utente
  const initialRegistration = {
    name: "",
    surname: "",
    avatar: "",
    birthDate: "",
    email: "",
    password: ""
  }
  const [formRegistration, setFormRegistration] = useState(initialRegistration) // utilizzo uno stato per poter settare il valore del form secondo i dati inseriti dall'utente
  const [avatar, setAvatar] = useState("") // utilizzo uno stato a sè per l'immagine avatar in quanto mi aspetto un tipo file da parte dell'utente

  const handleChangeRegistration = (event) =>{
    setFormRegistration({
      ...formRegistration,
      [event.target.name]: event.target.value
    })
  } 

  const handleChangeImage = (event) =>{
    setAvatar(event.target.files[0])
  }

  const handleRegister = async () => {
    const res = await register(formRegistration, avatar)
    console.log(res)
    handleCloseTwo()
  }  
  const handleLogout = () =>{
    setToken(null)
    setAuthorInfo(null)
    localStorage.removeItem('token')
    navigate('/')
  }
  return (
    <Navbar expand="lg" className="blog-navbar" fixed="top">
      <Container className="justify-content-between">
        <Navbar.Brand as={Link} to="/">
          <img className="blog-navbar-brand" alt="logo" src={logo} />
        </Navbar.Brand>
        
        <Modal show={showRegister} onHide={handleCloseTwo}>
          <Modal.Header closeButton>
            <Modal.Title>Registration</Modal.Title>
          </Modal.Header>

          <Modal.Body>
            <Form>
              <Form.Group className="mb-3" controlId="exampleForm.ControlInput3">
                <Form.Label>Email address</Form.Label>
                <Form.Control type="email" value={formRegistration.email} name="email" onChange={(event) => handleChangeRegistration(event)} placeholder="name@example.com" />
              </Form.Group>

              <Form.Group className="mb-3" controlId="exampleForm.ControlInput4">
                <Form.Label>Password</Form.Label>
                <Form.Control type="password" value={formRegistration.password} name="password" onChange={(event) => handleChangeRegistration(event)} placeholder="la tua password" />
              </Form.Group>

              <Form.Group className="mb-3" controlId="exampleForm.ControlInput5">
                <Form.Label>Name</Form.Label>
                <Form.Control type="name" value={formRegistration.name} name="name" onChange={(event) => handleChangeRegistration(event)} placeholder="il tuo nome" />
              </Form.Group>

              <Form.Group className="mb-3" controlId="exampleForm.ControlInput6">
                <Form.Label>Surname</Form.Label>
                <Form.Control type="surname" value={formRegistration.surname} name="surname" onChange={(event) => handleChangeRegistration(event)} placeholder="il tuo cognome" />
              </Form.Group>

              <Form.Group className="mb-3" controlId="exampleForm.ControlInput7">
                <Form.Label>Avatar</Form.Label>
                <Form.Control type="file" name="avatar" onChange={handleChangeImage} placeholder="il tuo avatar" />
              </Form.Group>

              <Form.Group className="mb-3" controlId="exampleForm.ControlInput8">
                <Form.Label>Avatar</Form.Label>
                <Form.Control type="date" value={formRegistration.date} name="birthDate" onChange={(event) => handleChangeRegistration(event)} placeholder="la tua data di nascita" />
              </Form.Group>
            </Form>
          </Modal.Body>

          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseTwo}>
              Close
            </Button>
            <Button variant="primary" onClick={handleRegister}>
              Register now
            </Button>
          </Modal.Footer>
        </Modal>
<div className="d-flex">
{!token && <Button className="ms-3" variant="secondary" onClick={handleShowTwo}>
          Register
        </Button>}
        {token && <Button as={Link} to="/new" className="blog-navbar-add-button bg-dark me-3" size="lg">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            fill="currentColor"
            className="bi bi-plus-lg"
            viewBox="0 0 16 16"
          >
            <path d="M8 0a1 1 0 0 1 1 1v6h6a1 1 0 1 1 0 2H9v6a1 1 0 1 1-2 0V9H1a1 1 0 0 1 0-2h6V1a1 1 0 0 1 1-1z" />
          </svg>
          Nuovo Articolo
        </Button>}
        {token && <Button className="ms-2 me-2" variant="primary" onClick={handleLogout}>
            Logout
          </Button>}
        {authorInfo && <Image src={authorInfo.avatar} className="authorAvatar me-2" />}  
          </div>
      </Container>
    </Navbar>
  );
};

export default NavBar;
