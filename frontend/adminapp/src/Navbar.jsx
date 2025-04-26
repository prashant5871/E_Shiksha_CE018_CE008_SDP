import React, { useContext } from 'react'
import { NavLink } from 'react-router-dom'
import { AuthContext } from './auth-context'


export default function Navbar() {
    const auth = useContext(AuthContext);
    return (
        <>
            <nav className="navbar navbar-dark bg-secondary navbar-expand-lg">
                <div className="container-fluid">
                    {/* <nav>
                        <div className="container">
                            <NavLink className="navbar-brand" to="">
                                <img src="/docs/5.0/assets/brand/bootstrap-logo.svg" alt="" width="30" height="24" />
                            </NavLink>
                        </div>
                    </nav> */}
                    <NavLink className="navbar-brand h1 fw-bold text-info border-top border-bottom rounded-1    " to="/">eShiksha
                    </NavLink>
                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse" id="navbarSupportedContent">
                        <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                            <li className="nav-item">
                                <NavLink className="nav-link" aria-current="page" to="/">Home</NavLink>
                            </li>
                            <li className="nav-item">
                            <button className="nav-link btn text-warning" onClick={()=>auth.logout()}>Logout</button>
                            </li>
                            {/* <li className="nav-item dropdown">
                                <NavLink className="nav-link dropdown-toggle" to="" id="navbarDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                                    Dropdown
                                </NavLink>
                                <ul className="dropdown-menu" aria-labelledby="navbarDropdown">
                                    <li><NavLink className="dropdown-item" to="">Action</NavLink></li>
                                    <li><NavLink className="dropdown-item" to="">Another action</NavLink></li>
                                    <li><hr className="dropdown-divider" /></li>
                                    <li><NavLink className="dropdown-item" to="">Something else here</NavLink></li>
                                </ul>
                            </li> */}
                            {/* <li className="nav-item">
                                <NavLink className="nav-link disabled" to="" tabindex="-1" aria-disabled="true">Disabled</NavLink>
                            </li> */}
                        </ul>
                        <form className="d-flex ms-0">
                            <input className="form-control me-2" type="search" placeholder="Search" aria-label="Search" />
                            <button className="btn btn-outline-light" type="submit">Search</button>
                        </form>
                    </div>
                </div>
            </nav>
        </>
    )
}
