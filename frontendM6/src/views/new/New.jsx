import React, { useCallback, useState } from "react";
import { Button, Container, Form } from "react-bootstrap";
import { Editor } from 'react-draft-wysiwyg';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import "./styles.css";
import {convertToRaw} from "draft-js"
import draftToHtml from "draftjs-to-html"
import { createOnePost } from "../../data/fetch";
const NewBlogPost = props => {
  const [text, setText] = useState("");
  /* creazione nuovo blogpost con inserimento cover*/
  const[cover, setCover] = useState("")
  const initialFormValue = {
    category: "",
    title: "",
    cover: "",
    readTime: {
      value: 40,
      unit: "sec"
    },
    author: "66d572962444d19f09c0c355",
    content: "",
    tags: []
  }
  const[formValue, setFormValue] = useState(initialFormValue)
  const handleFormValue = (event) => {
    setFormValue({
      ...formValue,
      [event.target.name] : event.target.value
    })
  }
  const handleCover = (event) => {
      handleFormValue(event)
      setCover(event.target.files[0])
  }
  /* creazione nuovo blogpost con inserimento cover */
  const handleChange = useCallback(value => {
    
    setText(draftToHtml(value));
    console.log(text)
    // console.log(convertToRaw(value.getCurrentContent()))
    setFormValue({
      ...formValue,
      content:draftToHtml(value) //questo drafToHtml(value) prende il valore della text area e lo converte in html
    })
  });
  return (
    <Container className="new-blog-container">
      <Form className="mt-5">
        <Form.Group controlId="blog-form" className="mt-3">
          <Form.Label>Titolo</Form.Label>
          <Form.Control size="lg" placeholder="Title" name="title" onChange={(event)=>handleFormValue(event)}/>
        </Form.Group>
        <Form.Group controlId="blog-category" className="mt-3">
          <Form.Label>Categoria</Form.Label>
          <Form.Control size="lg" as="select" name="category" onChange={(event)=>handleFormValue(event)}>
            <option>Categoria 1</option>
            <option>Categoria 2</option>
            <option>Categoria 3</option>
            <option>Categoria 4</option>
            <option>Categoria 5</option>
          </Form.Control>
        </Form.Group>
        <Form.Group controllId="cover" className="my-3">
          <Form.Label>Cover</Form.Label>
          <Form.Control type="file" name="cover" onChange={handleCover} />
        </Form.Group>
        <Form.Group controlId="blog-content" className="mt-3">
          <Form.Label>Contenuto Blog</Form.Label>
          {/*    <Form.Group controlId="cover" className="mt-3 mb-3" >
        <Form.Label>Cover</Form.Label>
        <Form.Control type="file" name="cover" onChange={handleChangeImage} />
      </Form.Group> */}

          <Editor value={text} onChange={handleChange} className="new-blog-content" />
        </Form.Group>
        <Form.Group className="d-flex mt-3 justify-content-end">
          <Button type="reset" size="lg" variant="outline-dark">
            Reset
          </Button>
          <Button
            type="button"
            size="lg"
            variant="dark"
            style={{
              marginLeft: "1em",
            }} onClick={()=>createOnePost(formValue, cover)}
          >
            Invia
          </Button>
        </Form.Group>
      </Form>
    </Container>
  );
};

export default NewBlogPost;
