import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Container, Navbar, Nav, NavDropdown, Form, Row, Col, Button } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';

const SearchForm = ({ onSearch }) => (
  <Form inline autoComplete="off" method="GET" onSubmit={onSearch}>
    <Row>
      <Col xs="auto">
        <Form.Control
          type="text"
          name="keyword"
          placeholder="Tìm kiếm truyện tranh ..."
          className="mr-sm-2"
        />
      </Col>
      <Col xs="auto">
        <Button type="submit">Tìm kiếm</Button>
      </Col>
    </Row>
  </Form>
);

const NavGenreDropdown = ({ items, loading, error }) => (
  <NavDropdown title="Loại truyện" id="basic-nav-dropdown">
    {loading ? (
      <NavDropdown.Item disabled>Loading...</NavDropdown.Item>
    ) : error ? (
      <NavDropdown.Item disabled>{error}</NavDropdown.Item>
    ) : items?.length > 0 ? (
      items.map(({ slug, name }) => (
        <NavDropdown.Item key={slug} as={Link} to={`/genre/${slug}`}>
          {name}
        </NavDropdown.Item>
      ))
    ) : (
      <NavDropdown.Item as={Link} to={"/"}>Newest</NavDropdown.Item>
    )}
  </NavDropdown>
);

const Menu = () => {
  const navigate = useNavigate();
  const [getdata, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const items = getdata?.data?.items;

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const { data } = await axios.get("https://otruyenapi.com/v1/api/the-loai");
        setData(data);
      } catch (err) {
        setError("Failed to load categories. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleSearch = (event) => {
    event.preventDefault();
    const query = new FormData(event.currentTarget).get("keyword");
    navigate(`/search?query=${query}`);
  };

  return (
    <Navbar expand="lg" className="bg-body-tertiary">
      <Container>
        <Navbar.Brand as={Link} to={"/"}>PHƯỚC ANH 2025</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={Link} to={"/trending/dang-phat-hanh"}>Đang phát hành</Nav.Link>
            <Nav.Link as={Link} to={"/trending/hoan-thanh"}>Hoàn thành</Nav.Link>
            <Nav.Link as={Link} to={"/trending/sap-ra-mat"}>Sắp ra mắt</Nav.Link>

            <NavGenreDropdown items={items} loading={loading} error={error} />
            <SearchForm onSearch={handleSearch} />
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Menu;
