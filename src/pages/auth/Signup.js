import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import {
  Container,
  Alert,
  Avatar,
  Typography,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
} from "@mui/material";
import TypewriterComponent from "typewriter-effect";
import { useFormik } from "formik";
import logo from "../../assets/media/img/logo/flexomate_gradient.jpg";
import * as Yup from "yup";

const Signup = () => {
  document.title = "Flexiyo | Sign Up";

  const [isMobile, setIsMobile] = useState(false);
  const [userOtpValue, setUserOtpValue] = useState("");
  const [emailHelperText, setEmailHelperText] = useState("");
  const [alertText, setAlertText] = useState("");
  const [isSendOtpError, setIsSendOtpError] = useState(false);
  const [isVerifyOtpError, setIsVerifyOtpError] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] =
    useState(false);
  const [isSendOtpReqLoading, setIsSendOtpReqLoading] = useState(false);
  const [isVerifyOtpReqLoading, setIsVerifyOtpReqLoading] = useState(false);
  const [isCreateUserAccountReqLoading, setIsCreateUserAccountReqLoading] =
    useState(false);
  const [isSendOtpBtnDisabled, setIsSendOtpBtnDisabled] = useState(false);
  const [isVerifyOtpBtnDisabled, setIsVerifyOtpBtnDisabled] = useState(true);
  const [isEmailFieldDisabled, setIsEmailFieldDisabled] = useState(false);
  const [sendOtpBtnText, setSendOtpBtnText] = useState("Send");
  const [firstFormikValues, setFirstFormikValues] = useState({});
  const [secondFormikValues, setSecondFormikValues] = useState({});
  const [thirdFormikValues, setThirdFormikValues] = useState({});
  const [fourthFormikValues, setFourthFormikValues] = useState({});
  const [isEmailVerified, setIsEmailVerified] = useState(false);

  useEffect(() => {
    const mediaQuery = matchMedia("(max-width: 600px)");
    const handleMediaQueryChange = () => {
      setIsMobile(mediaQuery.matches);
    };

    mediaQuery.addListener(handleMediaQueryChange);
    handleMediaQueryChange();

    return () => {
      mediaQuery.removeListener(handleMediaQueryChange);
    };
  }, []);

  const professionList = [
    "Accountant",
    "Account Manager",
    "Administrator",
    "Artist",
    "Architect",
    "Brand Manager",
    "Business Analyst",
    "Business Development Manager",
    "Chef",
    "Clinical Research Coordinator",
    "Compliance Officer",
    "Consultant",
    "Content Writer",
    "Copywriter",
    "Customer Service Representative",
    "Customer Success Manager",
    "Data Analyst",
    "Data Entry Clerk",
    "Data Scientist",
    "Dental Hygienist",
    "Doctor",
    "Electrician",
    "Engineer",
    "Entrepreneur",
    "Event Coordinator",
    "Event Planner",
    "Executive Assistant",
    "Executive Director",
    "Financial Advisor",
    "Financial Analyst",
    "Financial Consultant",
    "Financial Controller",
    "Financial Planner",
    "Graphic Designer",
    "HR Specialist",
    "Human Resources Manager",
    "Insurance Agent",
    "Interior Designer",
    "Investment Analyst",
    "Investment Banker",
    "IT Specialist",
    "Lawyer",
    "Legal Advisor",
    "Logistics Coordinator",
    "Market Research Analyst",
    "Marketing Coordinator",
    "Marketing Manager",
    "Marketing Specialist",
    "Mechanic",
    "Mechanical Engineer",
    "Musician",
    "Network Administrator",
    "Operations Analyst",
    "Operations Coordinator",
    "Operations Manager",
    "Personal Trainer",
    "Photographer",
    "Plumber",
    "Product Manager",
    "Project Administrator",
    "Project Coordinator",
    "Project Engineer",
    "Project Manager",
    "Public Relations Specialist",
    "Quality Assurance Specialist",
    "Real Estate Agent",
    "Recruiter",
    "Registered Nurse",
    "Research Analyst",
    "Researcher",
    "Sales Manager",
    "Sales Representative",
    "SEO Specialist",
    "Social Media Manager",
    "Social Worker",
    "Software Developer",
    "Software Engineer",
    "Software Tester",
    "Specialist",
    "Student",
    "Systems Analyst",
    "Teacher",
    "Technical Writer",
    "Therapist",
    "Translator",
    "UX/UI Designer",
    "Web Designer",
    "Writer",
    "Other",
  ];

  const SignupFirstSchema = Yup.object().shape({
    firstName: Yup.string().required("First Name is required"),
    lastName: Yup.string(),
    username: Yup.string().required("Username is required"),
    accountType: Yup.string().required("Please select an Account type"),
  });

  const SignupSecondSchema = Yup.object().shape({
    dob: Yup.date()
      .required("DOB is required")
      .max(new Date(), "DOB can't be in the future"),
    gender: Yup.string()
      .required("Gender is required")
      .oneOf(["male", "female"], "Inappropriate Gender value"),
    profession: Yup.string()
      .required("Profession is required")
      .oneOf(professionList, "Inappropriate Profession value"),
  });

  const SignupThirdSchema = Yup.object().shape({
    password: Yup.string()
      .min(6, "Password must be at least 6 characters")
      .required("Password is required"),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("password"), null], "Passwords must match")
      .required("Confirm Password is required"),
  });

  const SignupFourthSchema = Yup.object().shape({
    email: Yup.string().email("Invalid email").required("Email is required"),
  });

  const firstFormik = useFormik({
    initialValues: {
      firstName: "",
      lastName: "",
      username: "",
      accountType: "",
    },
    validationSchema: SignupFirstSchema,
    onSubmit: (values) => {
      setFirstFormikValues(values);
      switchToForm("signupForm2");
    },
  });

  const secondFormik = useFormik({
    initialValues: {
      dob: "",
      gender: "",
      profession: "",
    },
    validationSchema: SignupSecondSchema,
    onSubmit: (values) => {
      setSecondFormikValues(values);
      switchToForm("signupForm3");
    },
  });

  const thirdFormik = useFormik({
    initialValues: {
      password: "",
      confirmPassword: "",
    },
    validationSchema: SignupThirdSchema,
    onSubmit: (values) => {
      setThirdFormikValues(values);
      switchToForm("signupForm4");
    },
  });

  const fourthFormik = useFormik({
    initialValues: {
      email: "",
    },
    validationSchema: SignupFourthSchema,
    onSubmit: (values) => {
      setFourthFormikValues(values);
      sendSignupEmailOtp(values.email);
    },
  });

  const switchToForm = (form) => {
    const forms = ["signupForm1", "signupForm2", "signupForm3", "signupForm4"];
    forms.forEach((f) => {
      document.getElementById(f).style.display = "none";
    });
    document.getElementById(form).style.display = "block";
  };

  const sendSignupEmailOtp = async (userEmail) => {
    try {
      setIsSendOtpReqLoading(true);
      const response = await axios.post(
        `${process.env.REACT_APP_FMAPI_BASEURL}/mailer/send_signup_email_otp`,
        {
          userEmail: userEmail,
        },
      );
      setAlertText(response.data.msg);
      setIsSendOtpReqLoading(false);
      setIsVerifyOtpError(false);
      setIsSendOtpError(response.data.type === "error");
      if (response.data.type === "success") {
        setIsEmailFieldDisabled(true);
        setIsSendOtpBtnDisabled(true);
        setIsVerifyOtpBtnDisabled(false);
        let count = 30;
        const sendOtpTimer =
          setInterval(
            () =>
              count > 0
                ? (count--, setSendOtpBtnText(`${count} s`))
                : clearInterval(sendOtpTimer),
            1000,
          ) &&
          setTimeout(() => {
            clearInterval(sendOtpTimer);
            setSendOtpBtnText("Resend");
            setIsSendOtpBtnDisabled(false);
          }, 30000);

        setEmailHelperText(
          <Button
            variant="text"
            color="primary"
            size="small"
            onClick={() => {
              setIsEmailFieldDisabled(false);
              setIsVerifyOtpBtnDisabled(false);
            }}
          >
            Change email
          </Button>,
        );
      }
    } catch (error) {
      setEmailHelperText(error.message);
      setIsSendOtpReqLoading(false);
      setIsSendOtpError(true);
    }
  };

  const verifySignupEmailOtp = async () => {
    try {
      setIsVerifyOtpReqLoading(true);
      const response = await axios.post(
        `${process.env.REACT_APP_FMAPI_BASEURL}/mailer/verify_signup_email_otp`,
        {
          userEmail: fourthFormik.values.email,
          userOtp: userOtpValue,
        },
      );
      setAlertText(response.data.msg);
      setIsVerifyOtpReqLoading(false);
      setIsVerifyOtpError(response.data.type === "error");
      if (response.data.type === "success") {
        setIsEmailFieldDisabled(true);
        setIsSendOtpBtnDisabled(true);
        setIsVerifyOtpBtnDisabled(true);
        setIsEmailVerified(true);
      }
    } catch (error) {
      setEmailHelperText(error.message);
      setIsVerifyOtpReqLoading(false);
      setIsVerifyOtpError(true);
      setIsSendOtpBtnDisabled(false);
      setIsVerifyOtpBtnDisabled(false);
    }
  };

  const createUserAccount = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_FMAPI_BASEURL}/users/create_account`,
        {
          firstName: firstFormikValues.firstName,
          lastName: firstFormikValues.lastName,
          username: firstFormikValues.username,
          accountType: firstFormikValues.accountType,
          dob: secondFormikValues.dob,
          gender: secondFormikValues.gender,
          profession: secondFormikValues.profession,
          password: thirdFormikValues.password,
          email: fourthFormikValues.email,
        },
      );
      setAlertText(response.data.message);
      window.location = "/";
    } catch (error) {
      setAlertText(error.message);
    }
  };
  return (
    <section id="signup">
      <div className="auth-main">
        {!isMobile && (
          <Container
            className="auth-main--cover"
            component="div"
            maxWidth="md"
            disableGutters
          >
            <Typography
              component="div"
              variant="h4"
              className="auth-main--cover-title"
              style={{ fontFamily: "SpotifyMedium" }}
            >
              <Avatar
                src={logo}
                alt="logo"
                sx={{ mb: 3 }}
                style={{ width: "4rem", height: "4rem" }}
              />
              <br />
              <TypewriterComponent
                onInit={(typewriter) => {
                  typewriter.typeString("Welcome to Flexiyo").start();
                }}
              />
              <TypewriterComponent
                options={{ autoStart: true, loop: true }}
                onInit={(typewriter) => {
                  typewriter
                    .typeString("")
                    .pauseFor(3500)
                    .typeString("Let's dive in")
                    .pauseFor(1300)
                    .changeDeleteSpeed(10)
                    .deleteChars(7)
                    .typeString("make friends")
                    .pauseFor(1300)
                    .deleteChars(12)
                    .typeString("flex initials")
                    .pauseFor(1300)
                    .deleteChars(13)
                    .typeString("share music")
                    .pauseFor(1300)
                    .deleteChars(5)
                    .typeString("clips")
                    .pauseFor(1300)
                    .deleteChars(11)
                    .typeString("do more!")
                    .pauseFor(1300)
                    .start();
                }}
              />
            </Typography>
          </Container>
        )}
        <Container className="auth-main--forms" component="div" maxWidth="md">
          <Typography
            component="h1"
            variant="h5"
            fontWeight="bold"
            sx={{ mb: 1 }}
          >
            Hi Stranger!
          </Typography>
          <Typography component="label" variant="label">
            Please let us know who you are
          </Typography>
          <br />
          <br />
          <form
            id="signupForm1"
            onSubmit={firstFormik.handleSubmit}
            style={{ display: "block" }}
          >
            <Container
              component="div"
              maxWidth="md"
              style={{ display: "flex" }}
              disableGutters
            >
              <TextField
                margin="normal"
                type="text"
                label="First Name *"
                variant="outlined"
                placeholder="John"
                InputProps={{ style: { borderRadius: ".7rem" } }}
                style={{ marginRight: "1rem" }}
                fullWidth
                name="firstName"
                value={firstFormik.firstName}
                onChange={firstFormik.handleChange}
                error={
                  firstFormik.touched.firstName &&
                  Boolean(firstFormik.errors.firstName)
                }
                helperText={
                  firstFormik.touched.firstName && firstFormik.errors.firstName
                }
              />
              <TextField
                margin="normal"
                type="text"
                variant="outlined"
                label="Last Name"
                placeholder="Doe"
                InputProps={{ style: { borderRadius: ".7rem" } }}
                fullWidth
                name="lastName"
                value={firstFormik.lastName}
                onChange={firstFormik.handleChange}
                error={
                  firstFormik.touched.lastName &&
                  Boolean(firstFormik.errors.lastName)
                }
                helperText={firstFormik.lastName && firstFormik.errors.lastName}
              />
            </Container>
            <TextField
              margin="normal"
              type="text"
              label="Create Username *"
              variant="outlined"
              placeholder="johndoe123"
              InputProps={{ style: { borderRadius: ".7rem" } }}
              fullWidth
              name="username"
              value={firstFormik.values.username}
              onChange={firstFormik.handleChange}
              error={
                firstFormik.touched.username &&
                Boolean(firstFormik.errors.username)
              }
              helperText={
                firstFormik.touched.username && firstFormik.errors.username
              }
            />
            <FormControl
              maxWidth="xl"
              fullWidth
              sx={{ textAlign: "left", mt: 2 }}
              error={
                firstFormik.touched.accountType &&
                Boolean(firstFormik.errors.accountType)
              }
            >
              <InputLabel>Account Type *</InputLabel>
              <Select
                label="Account Type *"
                variant="outlined"
                sx={{ borderRadius: ".7rem" }}
                style={{ marginRight: "1rem" }}
                fullWidth
                error={
                  firstFormik.touched.accountType &&
                  Boolean(firstFormik.errors.accountType)
                }
                helperText={
                  firstFormik.touched.accountType &&
                  firstFormik.errors.accountType
                }
                name="accountType"
                value={firstFormik.accountType}
                onChange={firstFormik.handleChange}
              >
                <MenuItem value="personal">Personal</MenuItem>
                <MenuItem value="creator">Creator</MenuItem>
                <MenuItem value="business">Business</MenuItem>
              </Select>
            </FormControl>
            <Container
              component="div"
              fullWidth="md"
              sx={{ mt: 3 }}
              style={{ display: "flex", justifyContent: "flex-end" }}
              disableGutters
            >
              <Button
                type="submit"
                variant="contained"
                style={{ borderRadius: "2rem", padding: ".5rem 1.5rem" }}
              >
                Next
              </Button>
            </Container>
          </form>
          <form
            id="signupForm2"
            style={{ display: "none" }}
            onSubmit={secondFormik.handleSubmit}
          >
            <TextField
              margin="normal"
              id="dob"
              type="text"
              onFocus={() => {
                document.getElementById("dob").type = "date";
              }}
              onBlur={() => {
                document.getElementById("dob").type = "text";
              }}
              label="Date Of Birth *"
              variant="outlined"
              placeholder="MM/DD/YYYY"
              InputProps={{ style: { borderRadius: ".7rem" } }}
              fullWidth
              name="dob"
              value={secondFormik.values.dob}
              onChange={secondFormik.handleChange}
              error={
                secondFormik.touched.dob && Boolean(secondFormik.errors.dob)
              }
              helperText={secondFormik.touched.dob && secondFormik.errors.dob}
            />
            <FormControl
              maxWidth="xl"
              fullWidth
              sx={{ textAlign: "left", mt: 2 }}
              error={
                secondFormik.touched.gender &&
                Boolean(secondFormik.errors.gender)
              }
            >
              <InputLabel>Gender *</InputLabel>
              <Select
                label="Gender *"
                variant="outlined"
                sx={{ borderRadius: ".7rem" }}
                style={{ marginRight: "1rem" }}
                fullWidth
                error={
                  secondFormik.touched.gender &&
                  Boolean(secondFormik.errors.gender)
                }
                helperText={
                  secondFormik.touched.gender && secondFormik.errors.gender
                }
                name="gender"
                value={secondFormik.values.gender}
                onChange={secondFormik.handleChange}
              >
                <MenuItem value="male">Male</MenuItem>
                <MenuItem value="female">Female</MenuItem>
                <MenuItem value="other">Other</MenuItem>
              </Select>
            </FormControl>
            <FormControl
              maxWidth="xl"
              fullWidth
              sx={{ textAlign: "left", mt: 3 }}
              error={
                secondFormik.touched.profession &&
                Boolean(secondFormik.errors.profession)
              }
            >
              <InputLabel>Choose Profession *</InputLabel>
              <Select
                label="Choose Profession *"
                defaultValue="Other"
                variant="outlined"
                sx={{ borderRadius: ".7rem" }}
                fullWidth
                error={
                  secondFormik.touched.profession &&
                  Boolean(secondFormik.errors.profession)
                }
                helperText={
                  secondFormik.touched.profession &&
                  secondFormik.errors.profession
                }
                name="profession"
                value={secondFormik.profession}
                onChange={secondFormik.handleChange}
              >
                {professionList.map((profession) => (
                  <MenuItem value={profession}>{profession}</MenuItem>
                ))}
              </Select>
            </FormControl>
            <Container
              component="div"
              fullWidth="md"
              sx={{ mt: 3 }}
              style={{ display: "flex", justifyContent: "space-between" }}
              disableGutters
            >
              <Button
                variant="text"
                style={{ borderRadius: "2rem", padding: ".5rem 1rem" }}
                startIcon={<i className="fa fa-arrow-left" />}
                onClick={() => switchToForm("signupForm1")}
              >
                Back
              </Button>
              <Button
                variant="contained"
                type="submit"
                style={{ borderRadius: "2rem", padding: ".5rem 1.5rem" }}
              >
                Next
              </Button>
            </Container>
          </form>
          <form
            id="signupForm3"
            style={{ display: "none" }}
            onSubmit={thirdFormik.handleSubmit}
          >
            <TextField
              id="passwordInputField"
              margin="normal"
              type={isPasswordVisible ? "text" : "password"}
              label="Create Password *"
              variant="outlined"
              autoComplete="off"
              InputProps={{
                endAdornment: (
                  <i
                    className={`bi bi-${
                      isPasswordVisible ? "eye-slash" : "eye"
                    }`}
                    variant="text"
                    style={{
                      borderRadius: ".3rem",
                      fontWeight: "bold",
                      fontSize: "1.3rem",
                      cursor: "pointer",
                    }}
                    onClick={() => setIsPasswordVisible(!isPasswordVisible)}
                  ></i>
                ),
                style: { borderRadius: ".7rem" },
              }}
              fullWidth
              name="password"
              value={thirdFormik.values.password}
              onChange={thirdFormik.handleChange}
              error={
                secondFormik.touched.password &&
                Boolean(thirdFormik.errors.password)
              }
              helperText={
                thirdFormik.touched.password && thirdFormik.errors.password
              }
            />
            <br />
            <TextField
              id="confirmPasswordInputField"
              margin="normal"
              type={isConfirmPasswordVisible ? "text" : "password"}
              label="Confirm Password *"
              variant="outlined"
              autoComplete="off"
              InputProps={{
                endAdornment: (
                  <i
                    className={`bi bi-${
                      isConfirmPasswordVisible ? "eye-slash" : "eye"
                    }`}
                    variant="text"
                    style={{
                      borderRadius: ".3rem",
                      fontWeight: "bold",
                      fontSize: "1.3rem",
                      cursor: "pointer",
                    }}
                    onClick={() =>
                      setIsConfirmPasswordVisible(!isConfirmPasswordVisible)
                    }
                  ></i>
                ),
                style: { borderRadius: ".7rem" },
              }}
              fullWidth
              name="confirmPassword"
              value={thirdFormik.values.confirmPassword}
              onChange={thirdFormik.handleChange}
              error={
                thirdFormik.touched.confirmPassword &&
                Boolean(secondFormik.errors.confirmPassword)
              }
              helperText={
                thirdFormik.touched.confirmPassword &&
                thirdFormik.errors.confirmPassword
              }
            />
            <Container
              component="div"
              fullWidth="md"
              sx={{ mt: 3 }}
              style={{ display: "flex", justifyContent: "space-between" }}
              disableGutters
            >
              <Button
                variant="text"
                style={{ borderRadius: "2rem", padding: ".5rem 1rem" }}
                startIcon={<i className="fa fa-arrow-left" />}
                onClick={() => switchToForm("signupForm2")}
              >
                Back
              </Button>
              <Button
                type="submit"
                variant="contained"
                style={{ borderRadius: "2rem", padding: ".5rem 1.5rem" }}
              >
                Next
              </Button>
            </Container>
          </form>
          <form
            id="signupForm4"
            style={{ display: "none" }}
            onSubmit={createUserAccount}
          >
            {alertText ? (
              <Alert
                color={isSendOtpError || isVerifyOtpError ? "error" : "success"}
                severity={
                  isSendOtpError || isVerifyOtpError ? "error" : "success"
                }
                sx={{ mb: 3 }}
              >
                {alertText}
              </Alert>
            ) : null}
            <TextField
              id="emailInputField"
              margin="normal"
              type="email"
              label="Email *"
              variant="outlined"
              autoComplete="off"
              helperText={emailHelperText}
              value={fourthFormik.values.email}
              onChange={fourthFormik.handleChange}
              placeholder="john@example.com"
              InputProps={{
                endAdornment: (
                  <Button
                    id="sendEmailOtpBtn"
                    variant="text"
                    style={{ borderRadius: ".3rem", fontWeight: "bold" }}
                    color="secondary"
                    onClick={fourthFormik.handleSubmit}
                    size="large"
                    disabled={isSendOtpBtnDisabled}
                  >
                    {isSendOtpReqLoading ? (
                      <i
                        style={{ fontSize: "1.5rem" }}
                        className="fa fa-spinner-third fa-spin"
                      ></i>
                    ) : (
                      sendOtpBtnText
                    )}
                  </Button>
                ),
                disabled: isEmailFieldDisabled,
                style: { borderRadius: ".7rem" },
              }}
              fullWidth
              name="email"
            />
            <TextField
              type="number"
              label="Enter OTP"
              placeholder="XXXXXX"
              onChange={(e) => setUserOtpValue(e.target.value)}
              sx={{ mt: 2 }}
              InputProps={{
                endAdornment: (
                  <Button
                    id="sendEmailOtpBtn"
                    variant="text"
                    style={{ borderRadius: ".3rem", fontWeight: "bold" }}
                    color="success"
                    onClick={verifySignupEmailOtp}
                    size="large"
                    disabled={isVerifyOtpBtnDisabled}
                  >
                    {isVerifyOtpReqLoading ? (
                      <i
                        style={{ fontSize: "1.5rem" }}
                        className="fa fa-spinner-third fa-spin"
                      ></i>
                    ) : (
                      "Verify"
                    )}
                  </Button>
                ),
                style: { borderRadius: ".7rem" },
              }}
              onInput={(e) => {
                e.target.value = Math.max(0, parseInt(e.target.value))
                  .toString()
                  .slice(0, 6);
              }}
              fullWidth
              name="userOtpValue"
              value={userOtpValue}
            />
            <Container
              component="div"
              fullWidth="md"
              sx={{ mt: 4 }}
              style={{ display: "flex", justifyContent: "space-between" }}
              disableGutters
            >
              <Button
                variant="text"
                style={{ borderRadius: "2rem", padding: ".5rem 1rem" }}
                startIcon={<i className="fa fa-arrow-left" />}
                onClick={() => switchToForm("signupForm3")}
              >
                Back
              </Button>
              <Button
                type="submit"
                variant="contained"
                onClick={createUserAccount}
                style={{ borderRadius: "2rem", padding: ".5rem 1.5rem" }}
                disabled={!isEmailVerified}
              >
                {isCreateUserAccountReqLoading ? (
                  <i
                    style={{ fontSize: "1.5rem" }}
                    className="fa fa-spinner-third fa-spin"
                  ></i>
                ) : (
                  "Create Account"
                )}
              </Button>
            </Container>
          </form>
          <br />
          <br />
          Already have an account? &nbsp;
          <Link
            href="/auth/login"
            variant="body1"
            sx={{ alignSelf: "center" }}
          >
            Login
          </Link>
        </Container>
      </div>
    </section>
  );
};

export default Signup;
