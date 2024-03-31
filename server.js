const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const bcrypt = require("bcrypt");

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "root",
  database: "form_data"
});

connection.connect((err) => {
  if (err) {
    console.error("Error connecting to MySQL database: " + err.stack);
    return;
  }
  console.log("MySQL Database Connected");
});

app.post("/register", async (req, res) => {
  const { fname, lname, email, password, confirm_password, dob, gender, terms } = req.body;

  if (!fname || !lname || !email || !password || !confirm_password || !dob || !gender) {
    return res.json({ status: "error", error: "Please enter all details!" });
  }

  if (password.length <= 4) {
    return res.json({ status: "error", error: "Password must be greater than four characters!" });
  }

  if (password !== confirm_password) {
    return res.json({ status: "error", error: "Password and confirm password do not match!" });
  }

  try {
    const salt = await bcrypt.genSalt(10); 
    const hashedPassword = await bcrypt.hash(password, salt); 

    const userData = {
      fname,
      lname,
      email,
      password: hashedPassword, 
      dob,
      gender,
      terms
    };

    connection.query("INSERT INTO registration_data SET ?", userData, (error, results) => {
      if (error) {
        console.error("Error storing data to MySQL: ", error);
        return res.json({ status: "error", success: "Internal Server Error" });
      }
      console.log("Data stored successfully in MySQL Database");
      return res.json({ status: "success", success: "User has been registered successfully!" });
    });
  } catch (error) {
    console.error("Error hashing password: ", error);
    return res.json({ status: "error", error: "Internal Server Error" });
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});