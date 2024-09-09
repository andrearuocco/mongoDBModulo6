import React, { useContext, useState } from "react";
import { Card, Button, Modal, Form } from "react-bootstrap";
import { Link } from "react-router-dom";
import BlogAuthor from "../blog-author/BlogAuthor";
import "./styles.css";
import { AuthorContext } from "../../../context/AuthorContextProvider";

import {jwtDecode} from "jwt-decode"; // Fix jwtDecode import
import { deletePost } from '../../../data/fetch'

const BlogItem = (props) => {
  const { title, cover, author, _id, category, content, setAggiornaBlogList, aggiornaBlogList } = props; // Include all necessary props
  const { token, authorInfo } = useContext(AuthorContext);
  const [show, setShow] = useState(false);
  const [formValue, setFormValue] = useState({
    title: "",
    category: "",
    content: ""
  }); // Initialize formValue
  
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const decodedToken = jwtDecode(token);
 
   const handleDelete = async () =>{
    try {
      await deletePost(_id)
      alert('Post deleted!')
  
      setAggiornaBlogList(!aggiornaBlogList)
      // navigate ('/')
    } catch (error) {
      console.error("Errore durante l'eliminazione del post:", error);
      alert ('Unable to delete the post')
    }
  } 
 
  // When clicking "Edit", populate formValue with the post's current values
  const handleEditPost = () => {
    setFormValue({
      title: title,
      category: category,
      content: content,
    });
    handleShow();
  };

  const handleChangeFormValue = (event) => {
    setFormValue({
      ...formValue,
      [event.target.name]: event.target.value,
    });
  };

  const handleSaveChanges = async () => {
    try {
      const response = await fetch(`http://localhost:5001/blogpost/${_id}`, {
        method: 'PUT', // or PATCH
        headers: {
          'Content-Type': 'application/json',
          "Authorization": `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(formValue), // Send updated form data
      });

      if (response.ok) {
        const updatedPost = await response.json();
        // Handle success, e.g., update the post list
        console.log('Post updated successfully:', updatedPost);
        handleClose(); // Close the modal after saving
        setAggiornaBlogList(!aggiornaBlogList);
      } else {
        console.error('Error updating the post:', response.status);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <Card className="blog-card">
      <Link to={`/blog/${_id}`} className="blog-link">
        <Card.Img variant="top" src={cover} className="blog-cover" />
        <Card.Body>
          <Card.Title>{title}</Card.Title>
        </Card.Body>
      </Link>
      <Card.Footer>
        <BlogAuthor {...author} />
        {authorInfo._id === author._id && (
          <Button variant="success" className="ms-2" onClick={handleEditPost}>
            Edit
          </Button>
        )}
          {authorInfo._id === author._id ? <Button variant="danger"className="ms-2"onClick={handleDelete} >Delete</Button> : ""} 
        <Modal show={show} onHide={handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>Edit Post</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form className="mt-5">
              <Form.Group controlId="blog-form" className="mt-3">
                <Form.Label>Title</Form.Label>
                <Form.Control
                  size="lg"
                  placeholder="Title"
                  name="title"
                  value={formValue.title}
                  onChange={handleChangeFormValue}
                />
              </Form.Group>
              <Form.Group controlId="blog-category" className="mt-3">
                <Form.Label>Category</Form.Label>
                <Form.Control
                  size="lg"
                  as="select"
                  name="category"
                  value={formValue.category}
                  onChange={handleChangeFormValue}
                >
                  <option>Categoria 1</option>
                  <option>Categoria 2</option>
                  <option>Categoria 3</option>
                  <option>Categoria 4</option>
                  <option>Categoria 5</option>
                </Form.Control>
              </Form.Group>
              <Form.Group controlId="blog-content" className="mt-3">
                <Form.Label>Content</Form.Label>
                <Form.Control
                  size="lg"
                  placeholder="Content"
                  name="content"
                  value={formValue.content}
                  onChange={handleChangeFormValue}
                />
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              Close
            </Button>
            <Button variant="primary" onClick={handleSaveChanges}>
              Save Changes
            </Button>
          </Modal.Footer>
        </Modal>
      </Card.Footer>
    </Card>
  );
};

export default BlogItem;
