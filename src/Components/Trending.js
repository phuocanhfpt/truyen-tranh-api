import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Badge, Button, Card, Col, Container, Row, Pagination } from 'react-bootstrap';
import { Helmet } from 'react-helmet';
import { Link, useParams } from 'react-router-dom';
import Menu from './include/Menu';

const Trending = () => {
  const { slug } = useParams();
  const [getdata, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 24;

  const items = getdata?.data?.data?.items;
  const totalItems = getdata?.data?.data?.params?.pagination?.totalItems || 0;
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`https://otruyenapi.com/v1/api/danh-sach/${slug}?page=${currentPage}`);
        setData(response);
        setLoading(false);
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    };
    fetchData();
  }, [slug, currentPage]);

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <>
      <Helmet>
        <title>{getdata.data.data.seoOnPage.titleHead}</title>
      </Helmet>
      <Container>
        <Menu />
        <Row>
          <Col>
            <Card className="mb-4">
              <Card.Body>
                <Card.Title className="text-center">
                  {getdata.data.data.seoOnPage.titleHead}
                </Card.Title>
                <Card.Text className="text-center">
                  {getdata.data.data.seoOnPage.descriptionHead}
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        <Row>
          {items && items.length > 0 ? (
            items.map((item, index) => (
              <Col key={index} xs={12} sm={6} md={4} lg={3} className="mb-4">
                <Card className="h-100">
                  <Card.Img
                    variant="top"
                    src={`https://img.otruyenapi.com/uploads/comics/${item.thumb_url}`}
                  />
                  <Card.Body className="d-flex flex-column">
                    <Card.Title>{item.name || "No Title"}</Card.Title>
                    <Card.Text>{item.updatedAt || "Null"}</Card.Text>
                    <Card.Text>
                      {item.category && item.category.length > 0 ? (
                        item.category.map((category, idx) => (
                          <Badge bg="info" key={idx} className="me-1">
                            {category.name}
                          </Badge>
                        ))
                      ) : (
                        "Other"
                      )}
                    </Card.Text>
                    <div className="mt-auto text-center">
                      <Button
                        variant="outline-primary"
                        size="sm"
                        as={Link}
                        to={`/comics/${item.slug}`}
                        className="rounded-pill px-4"
                      >
                        Xem chi tiết
                      </Button>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            ))
          ) : (
            <Col>
              <Card.Body>No Content Available.</Card.Body>
            </Col>
          )}
        </Row>

        <Row>
          <Col className="d-flex justify-content-center mt-4">
            <Pagination>
              <Pagination.Prev
                onClick={() => currentPage > 1 && paginate(currentPage - 1)}
                disabled={currentPage === 1}
              />

              {[...Array(totalPages)].map((_, index) => {
                const pageNumber = index + 1;
                const rangeStart = Math.floor((currentPage - 1) / 5) * 5 + 1;
                const rangeEnd = Math.min(rangeStart + 4, totalPages);

                if (pageNumber >= rangeStart && pageNumber <= rangeEnd) {
                  return (
                    <Pagination.Item
                      key={pageNumber}
                      active={pageNumber === currentPage}
                      onClick={() => paginate(pageNumber)}
                    >
                      {pageNumber}
                    </Pagination.Item>
                  );
                }

                return null;
              })}

              <Pagination.Next
                onClick={() => currentPage < totalPages && paginate(currentPage + 1)}
                disabled={currentPage === totalPages}
              />
            </Pagination>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default Trending;
