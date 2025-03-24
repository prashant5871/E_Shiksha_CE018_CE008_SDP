import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from '@headlessui/react'
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline'
import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../shared/context/auth-context'
import { useHttpClient } from '../shared/hooks/http-hook'
import Loading from '../shared/components/Loading'
import { toast } from 'react-toastify';
import Logo from '../shared/components/Logo';

export default function Auth({ isOpen, onClose }) {
    const [isLoggedInPage, setIsLoggedInPage] = useState(true);
    const [showVerificationModal, setShowVerificationModal] = useState(false);
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
    const [email, setEmail] = useState("");

    const handleChange = (e) => {
        const { name, value } = e.target;
        setValues({ ...values, [name]: value });
        validate({ ...values, [name]: value });
        if (name == "email") {
            setEmail(value);
        }
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

    const handleResendVerification = async () => {

        let str = auth.isStudent ? "student" : "teacher";
        try {


            // const response = await fetch(`http://localhost:8000/auth/send-varification-code/${email}`, {
            //     method: 'POST',
            // });

            await sendRequest(
                `http://localhost:8000/auth/send-varification-code/${email}`,
                "POST",
                null,
                {}
            );
            setShowVerificationModal(false);
            toast.success("Verification email resent!", { autoClose: 1500, hideProgressBar: true });
        } catch (err) {
            setShowVerificationModal(false);
            toast.error(err.message);
        }
    };



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
            toast.success("Varification Mail has been sent on " + values.email, { autoClose: 1500, hideProgressBar: true });


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
            if (responseData?.enabled == false) {
                console.log("if gets executed of the varification model...");
                setShowVerificationModal(true);
            } else {
                console.log(responseData.enabled);
                auth.login(responseData.userId, responseData.username, responseData.token, responseData.student, responseData.enabled);
                toast.success("Login successful", { autoClose: 500, hideProgressBar: true });
                resetVal();
                onClose();
            }
        } catch (err) {
            toast.error(err.message)
            onClose();
        }
        resetVal();
        // onClose();
    }


    return (
        <>
            {isLoading && <Loading />}
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
                                        <div className='mx-auto w-23'>
                                            <Logo h={"20"} w={"20"} color={"#000000"} />
                                        </div>

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
                                                onChange={() =>{
                                                     auth.setIsStudent(!auth.isStudent)
                                                     if(localStorage.getItem("isStudent"))
                                                     {
                                                        localStorage.removeItem("isStudent");
                                                     }else{
                                                        localStorage.setItem("isStudent",true);
                                                     }
                                                
                                                }}
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
                                                }} className="font-semibold cursor-pointer text-indigo-600 hover:text-indigo-500">
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
                                                }} className="font-semibold cursor-pointer text-indigo-600 hover:text-indigo-500">
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

            {/* Verification Modal */}
            <Dialog open={showVerificationModal} onClose={() => setShowVerificationModal(false)} className="relative z-10">
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
                            <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                                <div className="sm:flex sm:items-start">
                                    <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                                        <ExclamationTriangleIcon className="h-6 w-6 text-red-600" aria-hidden="true" />
                                    </div>
                                    <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                                        <DialogTitle as="h3" className="text-lg leading-6 font-medium text-gray-900">
                                            Verification Required
                                        </DialogTitle>
                                        <div className="mt-2">
                                            <p className="text-sm text-gray-500">
                                                Your account is not verified. Please verify your email address. We have sent you a verification email.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                                    <button
                                        type="button"
                                        className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
                                        onClick={handleResendVerification}
                                    >
                                        Resend Verification Email
                                    </button>
                                    <button
                                        type="button"
                                        className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:w-auto sm:text-sm"
                                        onClick={() => setShowVerificationModal(false)}
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        </DialogPanel>
                    </div>
                </div>
            </Dialog>
        </>
    )
}
