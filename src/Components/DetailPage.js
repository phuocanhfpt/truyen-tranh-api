import axios from "axios";
import React, { useEffect, useState } from "react";
import {
  Badge,
  Button,
  Card,
  Col,
  Container,
  ListGroup,
  Modal,
  Row,
} from "react-bootstrap";
import { Helmet } from "react-helmet";
import { useParams } from "react-router-dom";
import Menu from "./include/Menu";

const DetailPage = () => {
  const { slug } = useParams();
  const [getdata, setData] = useState([]);
  const [getDataChapter, setDataChapter] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const item = getdata?.data?.data?.item;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `https://otruyenapi.com/v1/api/truyen-tranh/${slug}`
        );
        setData(response);
        setLoading(false);
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    };
    fetchData();
  }, [slug]);

  const handleReadChapter = async (chapter_api) => {
    try {
      const response = await axios.get(chapter_api);
      setDataChapter(response.data);
      setIsModalOpen(true);
    } catch (error) {
      setError(error.message);
    }
  };

  const handleClose = () => {
    setIsModalOpen(false);
    setDataChapter(null);
  };

  if (loading) return <p className="text-center mt-5">Loading...</p>;
  if (error) return <p className="text-center mt-5 text-danger">Error: {error}</p>;

  return (
    <>
      <Helmet>
        <title>{getdata.data.data.seoOnPage.titleHead}</title>
      </Helmet>
      <Container>
        <Menu />

        {/* SEO Header */}
        <Row className="mb-4">
          <Col>
            <Card>
              <Card.Body>
                <Card.Title className="text-center">{getdata.data.data.seoOnPage.titleHead}</Card.Title>
                <Card.Text className="text-center">{getdata.data.data.seoOnPage.descriptionHead}</Card.Text>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Comic Details and Chapter List */}
        <Row>
          {/* Comic Detail */}
          <Col md={4}>
            <Card>
              <Card.Img
                variant="top"
                src={`https://img.otruyenapi.com/uploads/comics/${item.thumb_url}`}
              />
              <Card.Body>
                <Card.Title>{item.name || "No Title"}</Card.Title>
                <Card.Text className="text-muted">{item.updatedAt || "Cập nhật chưa rõ"}</Card.Text>
                <Card.Text dangerouslySetInnerHTML={{ __html: item.content }}></Card.Text>
                <Card.Text><strong>Trạng thái:</strong> {item.status || "Chưa rõ"}</Card.Text>
                <Card.Text>
                  {item.category?.length > 0 ? (
                    item.category.map((category, index) => (
                      <Badge bg="info" key={index} className="me-1">
                        {category.name}
                      </Badge>
                    ))
                  ) : (
                    <Badge bg="secondary">Other</Badge>
                  )}
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>

          {/* Chapter List */}
          <Col md={8}>
            <Card>
              <Card.Body>
              <Card.Title style={{ textAlign: 'center' }}>Danh sách chương</Card.Title>
                <ListGroup className="scrollable-list">
                  {item.chapters?.length > 0 ? (
                    item.chapters.map((chapterGroup, index) => (
                      <div key={index}>
                        <h6 className="text-primary">{chapterGroup.server_name}</h6>
                        <ListGroup variant="flush">
                          {chapterGroup.server_data?.map((chapter, subIndex) => (
                            <ListGroup.Item
                              key={subIndex}
                              action
                              onClick={() => handleReadChapter(chapter.chapter_api_data)}
                              className="d-flex justify-content-between align-items-center"
                            >
                              {chapter.chapter_name}
                              <Badge bg="light" text="dark">Xem truyện</Badge>
                            </ListGroup.Item>
                          ))}
                        </ListGroup>
                      </div>
                    ))
                  ) : (
                    <span>Chapters đang cập nhật...</span>
                  )}
                </ListGroup>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Modal Reader */}
        {isModalOpen && getDataChapter && (
          <Modal size="lg" show={isModalOpen} onHide={handleClose}>
            <Modal.Header closeButton>
              <Modal.Title>
                {getDataChapter.data.item.chapter_name} - {getDataChapter.data.item.comic_name}
              </Modal.Title>
            </Modal.Header>
            <Modal.Body>
              {getDataChapter.data.item.chapter_image?.length > 0 ? (
                getDataChapter.data.item.chapter_image.map((img, idx) => (
                  <img
                    key={idx}
                    src={`${getDataChapter.data.domain_cdn}/${getDataChapter.data.item.chapter_path}/${img.image_file}`}
                    alt={`Page ${idx + 1}`}
                    style={{ width: "100%", marginBottom: "10px" }}
                  />
                ))
              ) : (
                <p>Không tìm thấy hình ảnh.</p>
              )}
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={handleClose}>
                Đóng
              </Button>
            </Modal.Footer>
          </Modal>
        )}
      </Container>
    </>
  );
};

export default DetailPage;
