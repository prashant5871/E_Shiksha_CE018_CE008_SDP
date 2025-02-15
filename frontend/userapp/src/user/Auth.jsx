import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from '@headlessui/react'
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline'
import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../shared/context/auth-context'
import { useHttpClient } from '../shared/hooks/http-hook'
import Loading from '../shared/components/Loading'
import { toast } from 'react-toastify';

export default function Auth({ isOpen, onClose }) {
    const [isLoggedInPage, setIsLoggedInPage] = useState(true);
    const [values, setValues] = useState({
        email: '',
        password: '',
        firstName: '',
        lastName: '',
        repeat_password: ''
    });
    const [errors, setErrors] = useState({});
    const auth = useContext(AuthContext);
    const { isLoading, error, sendRequest, clearError } = useHttpClient();

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

        if (!isLoggedInPage) {
            if (values.password !== values.repeat_password) {
                tempErrors.password = 'Password and Confirm password should match!';
            }
            if (!values.firstName) {
                tempErrors.firstName = 'First Name is required';
            }
            if (!values.lastName) {
                tempErrors.lastName = 'Last name is required';
            }
        }

        if (!values.email) {
            tempErrors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(values.email)) {
            tempErrors.email = 'Email is invalid';
        }

        if (!values.password) {
            tempErrors.password = 'Password is required';
        } else if (values.password.length < 6) {
            tempErrors.password = 'Password must be at least size of 6';
        }

        // Additional validation for logged-in page


        // Mobile validation (optional, currently commented)
        // if (!values.mobile) tempErrors.mobile = 'Mobile number is required';
        // else if (!/^\+?\d{10,15}$/.test(values.mobile)) tempErrors.mobile = 'Mobile number is invalid';

        setErrors(tempErrors);
    };
    const resetVal = () => {
        setValues({
            email: '',
            password: '',
            firstName: '',
            lastName: '',
            repeat_password: ''
        });
    }


    const handleSignup = async (e) => {
        e.preventDefault();
        let str = auth.isStudent ? "student" : "teacher";
        // console.log(str);
        try {
            const responseData = await sendRequest(
                'http://localhost:8000/auth/' + str + '/signup',
                "POST",
                JSON.stringify({
                    firstName: values.firstName,
                    lastName: values.lastName,
                    email: values.email,
                    password: values.password,
                    // profilePath: '/images/user.png'
                }),
                {
                    "Content-Type": "application/json",
                }
            );
            // auth.login(responseData.user._id, responseData.authToken);
            // closeButtonRef.current.click();
            console.log(responseData);
            toast.success("Varification Mail has been sent on "+values.email, { autoClose: 1500, hideProgressBar: true });


            // Navigate('/');
        } catch (err) { toast.error(err.message) }
        resetVal();
        onClose();
    };

    const handleSignin = async (e) => {
        e.preventDefault();
        let str = auth.isStudent ? "student" : "teacher";

        try {
            const responseData = await sendRequest(
                'http://localhost:8000/auth/' + str + '/login',
                "POST",
                JSON.stringify({
                    email: values.email,
                    password: values.password,
                }),
                {
                    "Content-Type": "application/json",
                }
            );
            // auth.login(responseData.user._id, responseData.authToken);
            // localStorage.setItem("authToken", responseData.authToken);
            // let token = localStorage.getItem("authToken");
            // const decoded = jwt.decode(token);
            // console.log(decoded);
            console.log(responseData)
            auth.login(responseData.userId, responseData.username, responseData.token);
            toast.success("Login successfully", { autoClose: 500, hideProgressBar: true });
        } catch (err) { toast.error(err.message) }
        resetVal();
        onClose();
    }


    return (
        <>
        {isLoading && <Loading/>}
        <Dialog open={isOpen} onClose={onClose} className="relative z-10">
            <DialogBackdrop
                transition
                className="fixed inset-0 bg-gray-500/75 transition-opacity"
            />
            <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
                <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                    <DialogPanel
                        transition
                        className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg"
                    >
                        <form>
                            <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4 max-w-md mx-auto">
                                {/* <div className="sm:flex sm:items-start"> */}

                                <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                                    <img
                                        alt="Your Company"
                                        src="logo.png"
                                        className="mx-auto h-20 w-auto"
                                    />
                                    <h5 className="mt-2  font-mono italic font-light  text-gray-900 text-center"> Welcome to ई-शिक्षा :)</h5>
                                    <h2 className="my-3 text-center text-2xl/9 font-bold tracking-tight text-gray-900">
                                        {isLoggedInPage === true ? 'Good to see you Again' : 'Create an Account'}
                                    </h2>
                                </div>

                                {/* ........................................... it is switcher code */}
                                <div className="flex items-center justify-center space-x-4">
                                    <span className={`text-sm ${auth.isStudent ? 'text-green-700 font-bold' : 'text-gray-700'}`}>Student</span>
                                    <label className="relative inline-flex cursor-pointer items-center">
                                        <input
                                            type="checkbox"
                                            checked={auth.isStudent}
                                            onChange={() => auth.setIsStudent(!auth.isStudent)}
                                            className="sr-only"
                                        />
                                        <div className="w-16 h-8 bg-gray-300 rounded-full">
                                            <div
                                                className={`w-8 h-8 bg-blue-500 rounded-full transition-transform transform ${auth.isStudent ? '' : 'translate-x-8'
                                                    }`}
                                            />
                                        </div>
                                    </label>
                                    <span className={`text-sm  ${!auth.isStudent ? 'text-green-700 font-bold' : 'text-gray-700'}`}> Teacher</span>
                                </div>


                                {/* ...................................field should be changed */}
                                {isLoggedInPage === false ? (
                                    <div>
                                        <div className="relative z-0 w-full mb-5 group">

                                            <input type="email" name="email" id="email" value={values.email} onChange={handleChange} className={`block py-2.5 px-0 w-full text-sm text-gray-900 border-0 border-b-2 border-gray-300 none focus:outline-none focus:ring-0 peer ${errors.email ? 'border-red-500' : 'border-green-500'}`} placeholder=" " required />
                                            <label for="email" className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Email address</label>
                                            <div class="text-sm text-red-500 mt-1">{errors.email}</div>
                                        </div>
                                        <div className="grid md:grid-cols-2 md:gap-6">
                                            <div className="relative z-0 w-full mb-5 group">
                                                <input type="text" name="firstName" id="firstName" value={values.firstName} onChange={handleChange} className={`block py-2.5 px-0 w-full text-sm text-gray-900 border-0 border-b-2 border-gray-300 none focus:outline-none focus:ring-0 peer ${errors.firstName ? 'border-red-500' : 'border-green-500'}`} placeholder=" " required />
                                                <label for="firstName" className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">First name</label>
                                                <div class="text-sm text-red-500 mt-1">{errors.firstName}</div>
                                            </div>
                                            <div className="relative z-0 w-full mb-5 group">
                                                <input type="text" name="lastName" id="lastName" value={values.lastName} onChange={handleChange} className={`block py-2.5 px-0 w-full text-sm text-gray-900 border-0 border-b-2 border-gray-300 none focus:outline-none focus:ring-0 peer ${errors.lastName ? 'border-red-500' : 'border-green-500'}`} placeholder=" " required />
                                                <label for="lastName" className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Last name</label>
                                                <div class="text-sm text-red-500 mt-1">{errors.lastName}</div>
                                            </div>
                                        </div>
                                        <div className="relative z-0 w-full mb-5 group">
                                            <input type="password" name="password" id="password" value={values.password} onChange={handleChange} className="block py-2.5 px-0 w-full text-sm text-gray-900 border-0 border-b-2 border-gray-300 none focus:outline-none focus:ring-0 peer" placeholder=" " required />
                                            <label for="password" className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Password</label>
                                        </div>
                                        <div className="relative z-0 w-full mb-5 group">
                                            <input type="password" name="repeat_password" id="repeat_password" value={values.repeat_password} onChange={handleChange} className="block py-2.5 px-0 w-full text-sm text-gray-900 border-0 border-b-2 border-gray-300 none focus:outline-none focus:ring-0 peer" placeholder=" " required />
                                            <label for="repeat_password" className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Confirm password</label>
                                        </div>
                                        <div class="text-sm text-red-500 mt-1">{errors.password}</div>
                                        <p className="text-center text-sm/6 text-gray-500">
                                            Already have account?{' '}
                                            <a onClick={() => {
                                                setIsLoggedInPage(!isLoggedInPage); resetVal();
                                            }} className="font-semibold text-indigo-600 hover:text-indigo-500">
                                                Sign in
                                            </a>
                                        </p>
                                    </div>
                                ) : (
                                    <div>
                                        <div className="relative z-0 w-full mb-5 group">

                                            <input type="email" name="email" id="email" value={values.email} onChange={handleChange} className={`block py-2.5 px-0 w-full text-sm text-gray-900 border-0 border-b-2 border-gray-300 none focus:outline-none focus:ring-0 peer ${errors.email ? 'border-red-500' : 'border-green-500'}`} placeholder=" " required />
                                            <label for="email" className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Email address</label>
                                            <div class="text-sm text-red-500 mt-1">{errors.email}</div>
                                        </div>
                                        <div className="relative z-0 w-full mb-5 group">
                                            <input type="password" name="password" id="password" value={values.password} onChange={handleChange} className="block py-2.5 px-0 w-full text-sm text-gray-900 border-0 border-b-2 border-gray-300 none focus:outline-none focus:ring-0 peer" placeholder=" " required />
                                            <label for="password" className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Password</label>
                                        </div>
                                        <div class="text-sm text-red-500 mt-1">{errors.password}</div>
                                        <p className="text-center text-sm/6 text-gray-500">
                                            Create new Account?{' '}
                                            <a onClick={() => {
                                                setIsLoggedInPage(!isLoggedInPage); resetVal()
                                            }} className="font-semibold text-indigo-600 hover:text-indigo-500">
                                                Sign up
                                            </a>
                                        </p>
                                    </div>

                                )}
                            </div>

                            {/* ...................................field for logged in */}

                            <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                                <button
                                    type="button"
                                    onClick={isLoggedInPage ? handleSignin : handleSignup}
                                    disabled={Object.keys(errors).length !== 0}
                                    className="inline-flex w-full justify-center rounded-md bg-green-600 px-3 py-2 text-sm font-semibold text-white shadow-xs hover:bg-green-500 sm:ml-3 sm:w-auto disabled:bg-gray-400 disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    Submit
                                </button>
                                <button
                                    type="button"
                                    onClick={onClose}
                                    className="mt-3 inline-flex w-full justify-center rounded-md bg-red px-3 py-2 text-sm font-semibold text-gray-900 ring-1 shadow-xs ring-gray-300 ring-inset hover:bg-red-100 sm:mt-0 sm:w-auto"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </DialogPanel>
                </div>
            </div>
        </Dialog>
        </>
    )
}
