import React, { useEffect, useState } from "react";
import { Col, Row } from "react-bootstrap";
import BlogItem from "../blog-item/BlogItem";
import { loadPosts } from "../../../data/fetch";

const BlogList = props => {
  const [posts, setPosts] = useState([])
  useEffect(()=>{
    loadPosts('prendi').then(data=>setPosts(data.dati))
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
