import React, { useEffect, useState, useRef, useContext } from 'react';
import { useHttpClient } from './http-hook';
import { toast } from 'react-toastify';
import { AuthContext } from './auth-context';
import Loading from './Loading'

export default function Auth() {
    const [values, setValues] = useState({
        email: '',
        password: ''
    });
    const auth = useContext(AuthContext);
    const [errors, setErrors] = useState({});
    const { isLoading, error, sendRequest, clearError } = useHttpClient();
    const closeButtonRef = useRef(null);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setValues({ ...values, [name]: value });
        validate({ ...values, [name]: value });
    };

    useEffect(() => {
        validate(values);
    }, [values]);

    const validate = (values) => {
        let tempErrors = {};
        if (!values.email) tempErrors.email = 'Email is required';
        // else if (!/\S+@\S+\.\S+/.test(values.email)) tempErrors.email = 'Email is invalid';
        if (!values.password) tempErrors.password = 'Password is required';
        else if (values.password.length < 6) tempErrors.password = 'Password must be at least size of 6';
        setErrors(tempErrors);
    };

    const handleSignin = async (e) => {
        e.preventDefault();
        try {
            const responseData = await sendRequest(
                'http://localhost:8000/auth/admin',
                "POST",
                JSON.stringify({
                    email: values.email,
                    password: values.password,
                }),
                {
                    "Content-Type": "application/json",
                }
            );
            auth.login(responseData.token);
            toast.success("Login successfully", { autoClose: 500, hideProgressBar: true });
        } catch (err) { toast.error(err.message) }
        setValues({
            email: '',
            password: '',
        });
        setErrors({});
    };

    return (
        <>
        {isLoading && <Loading/>}
        <div className="container">
            <div className="row justify-content-center" style={{ margin: '10%' }}>
                <div className="col-md-6">
                    <div className="card">
                        <div className="card-header">
                            <h5 className="card-title">Login</h5>
                        </div>
                        <div className="card-body">
                            <form>
                                <div className="mb-3">
                                    <label htmlFor="email" className="form-label">Email</label>
                                    <input type="text" className={`form-control ${errors.email ? 'is-invalid' : ''}`} name='email' id="email" value={values.email} onChange={handleChange} placeholder="Enter your email" />
                                    <div className="invalid-feedback">{errors.email}</div>
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="password" className="form-label">Password</label>
                                    <input type="password" className={`form-control ${errors.password ? 'is-invalid' : ''}`} name='password' value={values.password} onChange={handleChange} id="password" placeholder="Enter your password" />
                                    <div className="invalid-feedback">{errors.password}</div>
                                </div>
                            </form>
                        </div>
                        <div className="card-footer text-center">
                            <button type="button" className="btn btn-primary" onClick={handleSignin}>Submit</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        </>
    );
}
