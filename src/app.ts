import http from "node:http";
import { db } from "./db";
import { coursesTable, instructorTable, subjectTable } from "./db/schema";
require("dotenv").config();

const PORT = 3000;

const server = http.createServer(function reqHandler(req, res) {
  res.setHeader("Content-Type", "text/html");
  let body = "";
  req.on("data", (data) => {
    body += data;
  });

  req.on("end", async () => {
    const bodyObj = new URLSearchParams(body);

    if (req.method === "GET") {
      switch (req.url) {
        case "/":
          res.end(`
            <a href="/courses">add Course</a>
            <a href="/subjects">add Subject</a>
            <a href="/instructors">add instructor</a> 
            `);
          break;

        case "/courses":
          res.end(`<form action="/courses/all" method="POST">
            <input type='text' name="course_name" placeholder='Enter course name...'/>
            <input type='number' name="course_price" placeholder='Enter course price...'/>
            <input type='text' name="course_description" placeholder='Enter course description...'/>
            <button type="submit">submit</button>
            </form>`);
          break;

        case "/instructors":
          res.end(`<form action="/instructors/all" method="POST">
            <input type='text' name="teacher_name" placeholder='Enter teacher name...'/>
            <input type='email' name="teacher_email" placeholder='Enter teacher email...'/>
            <input type='text' name="teacher_description" placeholder='Enter teacher descption...'/>
            <button type="submit">submit</button>
            </form>`);
          break;

        case "/subjects":
          res.end(`<form action="/subjects/all" method="POST">
            <input type='text' name="subject_name" placeholder='Enter subject name...'/>
            <input type='text' name="subject_description" placeholder='Enter subject descption...'/>
            <button type="submit">submit</button>
            </form>`);
          break;

        default:
          res.statusCode = 404;
          res.end("<h1> not found </h1>");
          break;
      }
    } else if (req.method === "POST") {
    }

    //=======================================================

    if (req.method === "POST" && req.url === "/courses/all") {
      const course_name = bodyObj.get("course_name");
      const course_price = bodyObj.get("course_price");
      const course_description = bodyObj.get("course_description");

      if (course_name && course_price && course_description) {
        await db.insert(coursesTable).values({
          courseName: course_name,
          coursePrice: parseInt(course_price),
          courseDescription: course_description,
        });
        res.end(`
          <p style ="background-color: lightseagreen; color: red; font-family: monospace">Course Name: ${course_name}</p>
          <p>Course price: ${course_price}</p>
          <p>Course description: ${course_description}</p>
          <a href="/course">Create another course</a>
        `);
      }
    }
    //=======================================================

    if (req.method === "POST" && req.url === "/instructors/all") {
      const teacher_name = bodyObj.get("teacher_name");
      const teacher_email = bodyObj.get("teacher_email");
      const teacher_description = bodyObj.get("teacher_description");

      if (teacher_name && teacher_email && teacher_description) {
        await db.insert(instructorTable).values({
          instructorName: teacher_name,
          instructorEmail: teacher_email,
          instructorDescription: teacher_description,
        });

      }
    }
    //=======================================================

    if (req.method === "POST" && req.url === "/subjects/all") {
      const subject_name = bodyObj.get("subject_name");
      const subject_description = bodyObj.get("subject_description");

      if (subject_name && subject_description) {
        await db.insert(subjectTable).values({
          subName: subject_name,
          subDescription: subject_description,
        });

      }
    }
  });
});

server.listen(PORT, () => {
  console.log("running server on port: " + PORT);
});
