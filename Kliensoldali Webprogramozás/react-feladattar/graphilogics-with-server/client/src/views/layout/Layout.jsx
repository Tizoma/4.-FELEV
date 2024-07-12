import { Container, Nav, Navbar } from "react-bootstrap";
import { NavLink, Outlet } from "react-router-dom";

function Layout() {
  return (
    <>
    <Navbar expand="lg" className="bg-body-tertiary">
      <Container>
        <Navbar.Brand href="#home">Graphilogics</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={NavLink} to='/'>Játék</Nav.Link>
            <Nav.Link as={NavLink} to='/login'>Bejelentkezés</Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
    <Outlet />
    </>
  );
}

export default Layout;
