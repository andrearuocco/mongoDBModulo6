import React, { useState, useContext, useEffect } from "react";
import { Button, Container, Modal, Form } from "react-bootstrap";
import BlogList from "../../components/blog/blog-list/BlogList";
import {Link, useSearchParams } from "react-router-dom"
import "./styles.css";
import { login, loginGoogle } from "../../data/fetch.js"
import { AuthorContext } from "../../context/AuthorContextProvider.js";

const Home = props => {
  let [searchParams, setSearchParams] = useSearchParams()
  useEffect(()=>{
    console.log(searchParams.get('token'))
    if(searchParams.get('token')) {
      localStorage.setItem('token', searchParams.get('token')) // salva nel localStorage il token 
      setToken(searchParams.get('token')) // aggiorna il token nello stato del contesto
    }
  }, [])
  const {token, setToken} = useContext(AuthorContext)
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const [formValue, setFormValue] = useState({email:"", password:""})

  const handleChange = (event) =>{
    setFormValue({
      ...formValue, 
      [event.target.name] : event.target.value
    })
  }

  const handleLogin = async () => {
    const tokenObj = await login(formValue) // così abbiamo il token da mettere nel localstorage
    localStorage.setItem('token', tokenObj.token) // setitem accetta 2 parametri: la chiave con cui vuoi salvare e poi il valore
    setToken(tokenObj.token) // dentro token obj c'è la risposta completa dell'end point che è un oggetto e noi dobbiamo prendere solo la propiretà token
    handleClose()
  }
  return (
    <Container fluid="sm">
      <h1 className="blog-main-title mb-3">Benvenuto sullo Strive Blog!</h1>
      {!token && <div className="d-flex align-items-center"><Button className="mx-2" variant="primary" onClick={handleShow}>
        Login
      </Button><span>OR</span>
        {/*       // alla pagina del sito ci ha portato express ma da google a express ci ha portato l'Authorized redirect URls di Google Cloud
 */}<Button as={Link} to={'http://localhost:5001/api/v1/login-google'} className="mx-2" variant="primary">Login with Google</Button></div>}

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>LOGIN</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
              <Form.Label>Email address</Form.Label>
              <Form.Control type="email" name="email" onChange={handleChange} placeholder="name@example.com" />
            </Form.Group>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput2">
              <Form.Label>Password</Form.Label>
              <Form.Control type="password" name="password" onChange={handleChange} placeholder="la tua password" />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handleLogin}>
            Login now
          </Button>
        </Modal.Footer>
      </Modal>

      {token && <BlogList />}
    </Container>
  );
};

export default Home;
