import React, { useEffect, useState, useContext } from "react";
import { Container, Image, Modal, Form, Button, Col, Row } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import BlogAuthor from "../../components/blog/blog-author/BlogAuthor";
import BlogLike from "../../components/likes/BlogLike";
/* import posts from "../../data/posts.json";  */
import { loadPost, newComment, loadComments } from "../../data/fetch";
import "./styles.css";
import { jwtDecode } from "jwt-decode";
import { AuthorContext } from "../../context/AuthorContextProvider";
const Blog = props => {
/*     const [posts, setPosts] = useState([])
  useEffect(()=>{
    loadPosts().then(data=>setPosts(data.dati))
  }, [])  */
  const [show, setShow] = useState(false);  
  const [blog, setBlog] = useState({});
  const [loading, setLoading] = useState(true);
  const [comments, setComments] = useState([])
  const {token} = useContext(AuthorContext)
  const decodedToken = jwtDecode(token)
  const params = useParams();
  const navigate = useNavigate();
  const { id } = params;
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const initialFormState = {

      content: "",
      blogpost: id,
      author: decodedToken.authorId,
    };
    const [formValue, setFormValue] = useState(initialFormState)
    const handleChange = (event) => {
      const { name, value } = event.target;
      setFormValue({
        ...formValue,
        [name]: value,
      });
      
    };
    const handleSaveComment = async () =>{
      try {
        await newComment(id,formValue)
        const commentsRes = await loadComments(id)
        setComments(commentsRes.dati)
        console.log(comments)
        setFormValue(initialFormState)
        handleClose()
      } catch (error) {
        console.error("Errore durante il salvataggio del commento:", error);
      }
    }
  useEffect(() => {
    
    
    const blogPostDetails = async () => {
      try {
        const res = await loadPost(id); 
        const commentsRes = await loadComments(id)
        console.log(res)
        if (res) {
          setBlog(res)
          setComments(commentsRes.dati)
          console.log(comments)
          /* console.log(...blog.author) */
          setLoading(false); 
        } else {
          console.log("non trovato");
          navigate("/not-found"); // ??
        }
      } catch (error) {
        console.error(error);
      
        setLoading(false);
      }
    };

    blogPostDetails(); 
  }, [params, navigate]);
console.log(blog)
  if (loading) {
    return <div>loading</div>;
  } else {
    return (
      <div className="blog-details-root">
        <Container>
          <Image className="blog-details-cover" src={blog.cover} fluid />
          <h1 className="blog-details-title">{blog.title}</h1>

          <div className="blog-details-container">
            <div className="blog-details-author">
              <BlogAuthor {...blog.author} />
            </div>
            <div className="blog-details-info">
              <div>{blog.createdAt}</div>
              <div>{`lettura da ${blog.readTime.value} ${blog.readTime.unit}`}</div>
              <div
                style={{
                  marginTop: 20,
                }}
              >
                <BlogLike defaultLikes={["123"]} onChange={console.log} />
              </div>
            </div>
          </div>

          <div
            dangerouslySetInnerHTML={{
              __html: blog.content,
            }}
          ></div>



           <div className="mt-5">Post comments:</div>
          <Row>
          {comments.map((comment, i) => (
          <Col
          key={`item-${i}`}
          md={8} className="mb-3"
          style={{
            marginBottom: 20,
          }}
        >
          <div className="mt-2 border rounded bg-light">{comment.content}</div> 
           
          <div className="mt-2 border rounded bg-light">{comment.author.name}</div> 
           
        </Col>
      ))}
    </Row>
    <Button variant="primary" onClick={handleShow}>
      Add Comment
    </Button>
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>New comment</Modal.Title>
      </Modal.Header>
      <Form.Control size="sm" type="text" placeholder="Max 100 characters" name="content" value={formValue.content} onChange={handleChange} />
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
        <Button variant="primary" onClick={handleSaveComment}>
          Save Changes
        </Button>
      </Modal.Footer>
    </Modal>




        </Container>
      </div>
    );
  }
};

export default Blog;
