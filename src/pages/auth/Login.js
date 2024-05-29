import { useState, useEffect } from "react";
import axios from "axios";
import { Container, Typography, TextField, Button, Link } from "@mui/material";
import TypewriterComponent from "typewriter-effect";
import * as Yup from "yup";
import { useFormik } from "formik";
import { LazyLoadImage } from "react-lazy-load-image-component";
import logo from "../../assets/media/img/logo/flexomate_gradient.jpg";

const Login = () => {
  document.title = "Flexiyo | Login";

  const [isMobile, setIsMobile] = useState(false);
  const [alertText, setAlertText] = useState("");
  const [isForgotPasswordClicked, setIsForgotPasswordClicked] = useState(false);

  const LoginSchema = Yup.object().shape({
    emailOrUsername: Yup.string().required("Email or Username is required"),
    password: Yup.string().required("Password is required"),
  });

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

  const formik = useFormik({
    initialValues: {
      emailOrUsername: "",
      password: "",
    },
    validationSchema: LoginSchema,
    onSubmit: (values) => {
      loginUser(values);
    },
  });

  const loginUser = async (values) => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_FMAPI_BASEURL}/users/login`,
        {
          emailOrUsername: values.emailOrUsername,
          password: values.password,
        },
      );
      // Handle login success
      console.log(response.data);
    } catch (error) {
      // Handle login failure
      console.error(error.message);
    }
  };

  const handleForgotPasswordClick = () => {
    setIsForgotPasswordClicked(true);
    // Add logic to handle forgot password functionality
  };

  return (
    <section id="login">
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
              <LazyLoadImage
                src={logo}
                alt="logo"
                style={{
                  width: "4rem",
                  height: "4rem",
                  marginBottom: "1rem",
                  borderRadius: "50%",
                }}
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
                    .typeString("Let's explore.")
                    .pauseFor(1300)
                    .changeDeleteSpeed(10)
                    .deleteChars(8)
                    .typeString("grow together.")
                    .pauseFor(1300)
                    .deleteChars(14)
                    .typeString("create joy.")
                    .pauseFor(1300)
                    .deleteChars(11)
                    .typeString("make memories.")
                    .pauseFor(1300)
                    .deleteChars(14)
                    .typeString("find happiness.")
                    .pauseFor(1300)
                    .deleteChars(10)
                    .typeString("friends.")
                    .pauseFor(1300)
                    .deleteChars(13)
                    .typeString("embrace life.")
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
            Welcome back!
          </Typography>
          <Typography component="label" variant="label">
            Please enter your credentials to continue
          </Typography>
          <br />
          <br />
          <form onSubmit={formik.handleSubmit}>
            <TextField
              margin="normal"
              id="emailOrUsername"
              type="text"
              label="Email or Username *"
              variant="outlined"
              fullWidth
              name="emailOrUsername"
              value={formik.values.emailOrUsername}
              onChange={formik.handleChange}
              error={
                formik.touched.emailOrUsername &&
                Boolean(formik.errors.emailOrUsername)
              }
              helperText={
                formik.touched.emailOrUsername && formik.errors.emailOrUsername
              }
              InputProps={{
                style: { borderRadius: ".7rem" },
              }}
            />
            <TextField
              margin="normal"
              id="password"
              type="password"
              label="Password *"
              variant="outlined"
              fullWidth
              name="password"
              value={formik.values.password}
              onChange={formik.handleChange}
              error={formik.touched.password && Boolean(formik.errors.password)}
              helperText={formik.touched.password && formik.errors.password}
              InputProps={{
                style: { borderRadius: ".7rem" },
              }}
            />
            <Container
              component="div"
              fullWidth="md"
              sx={{ mt: 2 }}
              style={{ display: "flex", justifyContent: "space-between" }}
              disableGutters
            >
              <Link
                href="#"
                variant="body1"
                onClick={handleForgotPasswordClick}
                sx={{ alignSelf: "center" }}
              >
                Forgot password?
              </Link>
              <Button
                type="submit"
                variant="contained"
                style={{ borderRadius: "2rem", padding: ".5rem 1.5rem" }}
              >
                Login
              </Button>
            </Container>
          </form>
        </Container>
      </div>
    </section>
  );
};

export default Login;
