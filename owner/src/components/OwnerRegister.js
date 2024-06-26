import React, { useState, useEffect } from "react";
import axios from "axios";
import { createSearchParams, Link, useNavigate } from "react-router-dom";

import swal from "sweetalert";
import InlineButtonLoader from "./InlineButtonLoader";
import { FcGoogle } from "react-icons/fc";
import { toast } from "react-toastify";
import { Images } from "../Assets";
import { setCurrentColor } from "../redux/user/userSlice";
const BgImages = [Images.Bg_LogIn1, Images.Bg_LogIn2, Images.Bg_LogIn3];
export default function OwnerRegister() {
  const [name, setName] = useState("");
  const [nameError, setNameError] = useState("");
  const [number, setNumber] = useState("");
  const [numberError, setNumberError] = useState("");
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [pass, setPass] = useState("");
  const [passError, setPassError] = useState("");
  const [cpass, setCpass] = useState("");
  const [cpassError, setCpassError] = useState("");
  const [check, SetCheck] = useState(false);
  const [loading, setLoading] = useState(false);
  const [disabled, setDisabled] = useState(true);

  const navigate = useNavigate();
  useEffect(() => {
    setCurrentColor("white");
  }, []);

  const handleSignUp = () => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;
    const nameRegex = /^[\sA-Za-z]+$/;
    const regx = /^[789]\d{9}$/;
    if (name.trim() == "") {
      toast.error("Name is required!", { duration: 1000 });
    } else if (!nameRegex.test(name)) {
      toast.error("Name is not valid!", { duration: 1000 });
    } else if (number.trim() == "") {
      toast.error("Mobile number is required!", { duration: 1000 });
    } else if (!regx.test(number)) {
      toast.error("Mobile number is not valid!", { duration: 1000 });
    } else if (email.trim() == "") {
      toast.error("Email is required!", { duration: 1000 });
    } else if (!regex.test(email)) {
      toast.error("This is not a valid email format!", { duration: 1000 });
    } else if (pass.trim() == "") {
      toast.error("Password is not valid", { duration: 1000 });
    } else if (pass.length < 5) {
      toast.error("Password must be more than 4 characters", {
        duration: 1000,
      });
    } else if (cpass.trim() == "") {
      toast.error("Confirm password is not valid", { duration: 1000 });
    } else if (cpass != pass) {
      toast.error("Confirm password does not match", { duration: 1000 });
    } else if (!check) {
      toast.error("Please agree with our privacy", { duration: 1000 });
    } else {
      handleSubmit();
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    console.log("hey");
    console.log(name, email, number, pass);
    try {
      let fcmToken = "";
      const temp = localStorage.getItem("fcmTokenOwner");
      if (temp != null) {
        fcmToken = temp;
      }
      const response = await axios.post(
        "http://localhost:4000/resturant/register",
        {
          name,
          email,
          password: pass,
          number,
          fcmToken,
        }
      );
      setLoading(false);
      console.log(response.data);

      navigate({
        pathname: "/otp",
        search: createSearchParams({
          id: response.data.restuarnt._id,
          email: response.data.restuarnt.email,
        }).toString(),
      });
    } catch (err) {
      console.log(err);
      if (err?.response?.status === 400) {
        swal(`${err?.response?.data?.messag}`, "", "error");
        setLoading(false);
        return;
      }
    }
  };
  return (
    <div className="flex items-center justify-center flex-1 min-h-screen bg-black bg-opacity-30 backdrop-blur-sm">
      <img
        src={BgImages[0]}
        className="w-full h-full object-cover absolute mix-blend-overlay"
      />
      <div className="relative flex flex-col m-6 space-y-8 bg-white shadow-md rounded-2xl md:flex-row md:space-y-0 mt-24">
        <div className="flex flex-col justify-center p-8 md:p-10">
          <span className="mb-3 text-4xl font-bold">Sign up</span>
          <span className="font-light text-gray-400 mb-8">
            {`${"Wellcome ,"} Please enter your details`}
          </span>
          <div className="pb-4">
            <span className="mb-2 text-md">Name</span>
            <input
              type="text"
              className="w-full p-2 border border-gray-300 rounded-md placeholder:font-light placeholder:text-gray-500"
              name="email"
              value={name}
              placeholder="Enter name"
              id="email"
              onChange={(event) => setName(event.target.value)}
            />
          </div>
          <div className="pb-4">
            <span className="mb-2 text-md">Phone no.</span>
            <input
              type="text"
              className="w-full p-2 border border-gray-300 rounded-md placeholder:font-light placeholder:text-gray-500"
              name="email"
              value={number}
              maxLength={10}
              placeholder="Enter mobile no"
              id="email"
              onChange={(event) => setNumber(event.target.value)}
            />
          </div>
          <div className="pb-4">
            <span className="mb-2 text-md">Email</span>
            <input
              type="text"
              className="w-full p-2 border border-gray-300 rounded-md placeholder:font-light placeholder:text-gray-500"
              name="email"
              value={email}
              placeholder="example@company.com"
              id="email"
              onChange={(event) => setEmail(event.target.value)}
            />
          </div>
          <div className="pb-4">
            <span className="mb-2 text-md">Password</span>
            <input
              type="password"
              name="pass"
              placeholder="Enter password"
              id="pass"
              value={pass}
              className="w-full p-2 border border-gray-300 rounded-md placeholder:font-light placeholder:text-gray-500"
              onChange={(event) => setPass(event.target.value)}
            />
          </div>
          <div className="pb-4">
            <span className="mb-1 text-md">Confirm Password</span>
            <input
              type="password"
              name="pass"
              id="pass"
              placeholder="Re-enter password"
              value={cpass}
              className="w-full p-2 border border-gray-300 rounded-md placeholder:font-light placeholder:text-gray-500"
              onChange={(event) => setCpass(event.target.value)}
            />
          </div>
          <div className="flex justify-between w-full pb-2">
            <div className="mr-24">
              <input
                type="checkbox"
                name="ch"
                id="ch"
                className="mr-2"
                checked={check}
                onChange={(e) => {
                  SetCheck(!check);
                }}
              />
              <span className="ml-2 text-sm font-semibold text-blueGray-600">
                I agree with the{" "}
                <Link
                  to="/privacyPolicy"
                  className="text-blue-500 border-b-[1px] border-blue-500"
                >
                  Privacy Policy
                </Link>
              </span>
            </div>
            <span className="w-36" />
          </div>
          <button
            className="w-full bg-black text-white p-2 rounded-lg hover:bg-white hover:text-black hover:border duration-200 border border-gray-300"
            onClick={handleSignUp}
            disabled={loading}
          >
            {loading ? <InlineButtonLoader /> : "Sign up"}
          </button>
          <Link
            className="w-full mt-3 hover:bg-black text-center text-black hover:text-white p-2 rounded-lg duration-200 border border-gray-300"
            to="/"
          >
            Sign in
          </Link>
         
        </div>
        <div className="relative">
          <img
            src={Images.Product1}
            alt="img"
            className="w-[400px] h-full hidden rounded-r-2xl md:block object-cover"
          />
          <div className="absolute hidden bottom-10 right-6 p-6 bg-white bg-opacity-30 backdrop-blur-sm rounded drop-shadow-lg md:block">
            <span className="text-white text-xl">
              Our aim is not just to serve meal, it's a journey through taste
              and ambiance.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
