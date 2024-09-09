import React, { useContext, useEffect, useState } from "react";
import { Col, Row, Form, Button } from "react-bootstrap";
import BlogItem from "../blog-item/BlogItem";
import { loadPosts } from "../../../data/fetch";
import { AuthorContext } from "../../../context/AuthorContextProvider";
const BlogList = props => {
  const {token,setToken} = useContext(AuthorContext)
  const [posts, setPosts] = useState([])
  const [result, setResult] = useState('')
  const [aggiornaBlogList, setAggiornaBlogList] = useState(false)
  const [current, setCurrent] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
 const handleSearch = async (event) => {
  setResult(!event.target.value ? '' : event.target.value)
 }
  useEffect(()=>{
    loadPosts(result, current).then((data) => {
      setPosts(data.dati);
      setTotalPages(data.totalPages); // Imposta il numero totale di pagine
    });
  }, [result, current, aggiornaBlogList]);

  const goToNextPage = () => {
    if (current < totalPages) {
      setCurrent(current + 1);
    }
  };

  const goToPreviousPage = () => {
    if (current > 1) {
      setCurrent(current - 1);
    }
  };
  return (<><div className="d-flex flex-column">
    <Form.Control
      className="mb-2"
      type="text"
      placeholder="Disabled input"
      aria-label="Disabled input example"
      onChange={handleSearch}
    />
    <Row>
      {posts.map((post, i) => (
        <Col
          key={`item-${i}`}
          md={4}
          style={{
            marginBottom: 50,
          }}
        >
          <BlogItem key={post.title} {...post} aggiornaBlogList={aggiornaBlogList} setAggiornaBlogList={setAggiornaBlogList} />
        </Col>
      ))}
    </Row></div>
          <div className="pagination-controls">
          <Button onClick={goToPreviousPage} disabled={current === 1}>
            Previous
          </Button>
          <span>
            Page {current} of {totalPages}
          </span>
          <Button onClick={goToNextPage} disabled={current === totalPages}>
            Next
          </Button>
        </div></>
  );
};

export default BlogList;
