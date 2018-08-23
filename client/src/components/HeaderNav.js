import React from "react";
import styled, { css } from "react-emotion";
import { Link, NavLink as RRNavLink } from "react-router-dom";

const Header = styled("header")`
  background: #fff;
  border-bottom: 1px solid #e8e8e8;
  height: 50px;
  width: 100%;
  display: flex;
  align-items: center;
  position: fixed;
  z-index: 1;
`;

const Nav = styled("nav")`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 7px 20px 8px;
`;

const Logo = () => (
  <Link
    to="/"
    className={css`
      color: #fff;
      font-weight: 600;
      font-size: 18px;
      padding: 8px;
      border-radius: 50%;
      background-color: #0f82e6;
      text-decoration: none;
      letter-spacing: -1px;
    `}
  >
    FA
  </Link>
);

const NavLink = props => {
  return (
    <RRNavLink
      className={css`
        padding: 1px 0px;
        margin: 0 20px;
        text-decoration: none;
        color: #5f5f5f;
      `}
      activeClassName={css`
        border-bottom: 3px solid #0f82e6;
        color: black;
      `}
      {...props}
    />
  );
};

export default function HeaderNav() {
  return (
    <Header>
      <Nav>
        <div>
          <Logo />
          <NavLink exact to="/routines">
            Routines
          </NavLink>
        </div>
      </Nav>
    </Header>
  );
}
