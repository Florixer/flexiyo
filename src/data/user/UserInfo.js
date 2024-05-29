import demoPersonImg from "../../assets/media/img/demo-person.jpg";

const randomUsername = () => {
  let username = "";
  const possible = "abcdefghijklmnopqrstuvwxyz_.0123456789";
  for (let i = 0; i < 12; i++) {
    username += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return username;
};

const userInfo = {
  _id: Number,
  username: randomUsername(),
  pfp: demoPersonImg,
};

export { userInfo };
