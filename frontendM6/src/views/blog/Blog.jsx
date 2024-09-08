import React, { useEffect, useState, useContext } from "react";
import { Container, Image, Modal, Form, Button, Col, Row } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import BlogAuthor from "../../components/blog/blog-author/BlogAuthor";
import BlogLike from "../../components/likes/BlogLike";
import { loadPost, newComment, loadComments, deleteComment, updateComment } from "../../data/fetch";
import "./styles.css";
import { jwtDecode } from "jwt-decode";
import { AuthorContext } from "../../context/AuthorContextProvider";

const Blog = () => {
  const [editMode, setEditMode] = useState(false);
  const [editCommentId, setEditCommentId] = useState(null);
  const [show, setShow] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [commentToDelete, setCommentToDelete] = useState(null);

  const [blog, setBlog] = useState({});
  const [loading, setLoading] = useState(true);
  const [comments, setComments] = useState([]);
  const { token } = useContext(AuthorContext);
  const decodedToken = jwtDecode(token);
  const params = useParams();
  const navigate = useNavigate();
  const { id } = params;

  const handleClose = () => {
    setShow(false);
    setEditMode(false);
    setFormValue(initialFormState);
  };

  const handleShow = () => setShow(true);

  const initialFormState = {
    content: "",
    blogpost: id,
    author: decodedToken.authorId,
  };
  const [formValue, setFormValue] = useState(initialFormState);

  const handleChange = event => {
    const { name, value } = event.target;
    setFormValue({
      ...formValue,
      [name]: value,
    });
  };

  const handleSaveComment = async () => {
    try {
      if (editMode) {
        await updateComment(id, editCommentId, formValue);
      } else {
        await newComment(id, formValue);
      }
      const commentsRes = await loadComments(id);
      console.log("Comments after save:", commentsRes.dati);
      setComments(commentsRes.dati);
      setFormValue(initialFormState);
      handleClose();
    } catch (error) {
      console.error("Errore durante il salvataggio del commento:", error);
    }
  };

  const handleEditComment = comment => {
    setEditMode(true);
    setEditCommentId(comment._id);
    setFormValue({ ...formValue, content: comment.content });
    handleShow();
  };

  const handleShowConfirmModal = commentId => {
    setCommentToDelete(commentId);
    setShowConfirmModal(true);
  };

  const handleCloseConfirmModal = () => {
    setCommentToDelete(null);
    setShowConfirmModal(false);
  };

  const confirmDeleteComment = async () => {
  /*   try { */
      await deleteComment(id, commentToDelete);
      
      const commentsRes = await loadComments(id);
      setComments(commentsRes.dati);  // Aggiorna i commenti dopo l'eliminazione
      handleCloseConfirmModal();
/*     } catch (error) {
      console.error('Errore durante la conferma dell\'eliminazione del commento:', error);
    } */
  };

  useEffect(() => {
    const blogPostDetails = async () => {
      try {
        const res = await loadPost(id);
        const commentsRes = await loadComments(id);
        if (res) {
          setBlog(res);
          setComments(commentsRes.dati);
          setLoading(false);
        } else {
          navigate("/not-found");
        }
      } catch (error) {
        console.error(error);
        setLoading(false);
      }
    };
    blogPostDetails();
  }, [id, navigate]);

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
              <div style={{ marginTop: 20 }}>
                <BlogLike defaultLikes={["123"]} onChange={console.log} />
              </div>
            </div>
          </div>

          <div dangerouslySetInnerHTML={{ __html: blog.content }}></div>

          <div className="mt-5">Post comments:</div>
          <Row>
            {comments.map((comment) => (
              <Col
                key={comment._id}
                md={8}
                className="mb-3"
                style={{ marginBottom: 20 }}
              >
                <div className="mt-2 border rounded bg-light">{comment.content}</div>
                <div className="mt-2 border rounded bg-light">
                  {comment.author.name}
                  {comment.author._id === decodedToken.authorId && (
                    <>
                      <i
                        className="fa-solid fa-pen"
                        style={{ cursor: "pointer", marginLeft: 10 }}
                        onClick={() => handleEditComment(comment)}
                      ></i>
                      <i
                        className="fa-solid fa-trash"
                        style={{ cursor: "pointer", marginLeft: 10 }}
                        onClick={() => handleShowConfirmModal(comment._id)}
                      ></i>
                    </>
                  )}
                </div>
              </Col>
            ))}
          </Row>

          <Button variant="primary" onClick={handleShow}>
            Add Comment
          </Button>

          <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
              <Modal.Title>{editMode ? "Edit Comment" : "New Comment"}</Modal.Title>
            </Modal.Header>
            <Form.Control
              size="sm"
              type="text"
              placeholder="Max 100 characters"
              name="content"
              value={formValue.content}
              onChange={handleChange}
            />
            <Modal.Footer>
              <Button variant="secondary" onClick={handleClose}>
                Close
              </Button>
              <Button variant="primary" onClick={handleSaveComment}>
                {editMode ? "Save Changes" : "Save Comment"}
              </Button>
            </Modal.Footer>
          </Modal>

          <Modal show={showConfirmModal} onHide={handleCloseConfirmModal}>
            <Modal.Header closeButton>
              <Modal.Title>Conferma Eliminazione</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              Sei sicuro di voler eliminare questo commento? Questa azione è irreversibile.
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={handleCloseConfirmModal}>
                Annulla
              </Button>
              <Button variant="danger" onClick={confirmDeleteComment}>
                Elimina
              </Button>
            </Modal.Footer>
          </Modal>
        </Container>
      </div>
    );
  }
};

export default Blog;