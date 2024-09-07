import React, { useContext, useEffect, useState } from "react";
import { Col, Row, Form} from "react-bootstrap";
import BlogItem from "../blog-item/BlogItem";
import { loadPosts } from "../../../data/fetch";
import { AuthorContext } from "../../../context/AuthorContextProvider";
const BlogList = props => {
  const {token,setToken} = useContext(AuthorContext)
  const [posts, setPosts] = useState([])
  const [result, setResult] = useState('')
 const handleSearch = async (event) => {
  setResult(event.target.value ? event.target.value : '')
 }
  useEffect(()=>{
    loadPosts(result).then(data=>setPosts(data.dati))
  }, [])
  return (
    <Row>
      {posts.map((post, i) => (
        <Col
          key={`item-${i}`}
          md={4}
          style={{
            marginBottom: 50,
          }}
        >
          <BlogItem key={post.title} {...post} />
        </Col>
      ))}
    </Row>
  );
};

export default BlogList;
