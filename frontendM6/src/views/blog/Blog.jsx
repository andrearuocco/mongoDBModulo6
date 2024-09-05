import React, { useEffect, useState } from "react";
import { Container, Image } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import BlogAuthor from "../../components/blog/blog-author/BlogAuthor";
import BlogLike from "../../components/likes/BlogLike";
import posts from "../../data/posts.json"; 
import { loadPost } from "../../data/fetch";
import "./styles.css";
const Blog = props => {
/*     const [posts, setPosts] = useState([])
  useEffect(()=>{
    loadPosts().then(data=>setPosts(data.dati))
  }, [])  */
  const [blog, setBlog] = useState({});
  const [loading, setLoading] = useState(true);
  const params = useParams();
  const navigate = useNavigate();
  useEffect(() => {
    const { id } = params;

    
    const blogPostDetails = async () => {
      try {
        const res = await loadPost(id); 
        if (res) {
          setBlog(res);
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
        </Container>
      </div>
    );
  }
};

export default Blog;
