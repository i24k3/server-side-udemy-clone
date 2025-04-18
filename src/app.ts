import http from "node:http";
import { db } from "./db";
import { coursesTable, instructorTable, subjectTable } from "./db/schema";
require("dotenv").config();

const PORT = 3000;

const server = http.createServer(function reqHandler(req, res) {
  res.setHeader("Content-Type", "text/html");
  let body = "";
  //console.log('body: ', body);
  req.on("data", (data) => {
    body += data;
  });

  req.on("end", async () => {
    const bodyObj = new URLSearchParams(body);

    if (req.url === "/course" && req.method === "GET") {
      res.end(`<form action="/course" method="POST">
        <input type='text' name="course_name" placeholder='Enter course name...'/>
        <input type='number' name="course_price" placeholder='Enter course price...'/>
        <input type='text' name="course_description" placeholder='Enter course description...'/>
        <button type="submit">submit</button>
        </form>`);
    }

    const course_name = bodyObj.get("course_name");
    const course_price = bodyObj.get("course_price");
    const course_description = bodyObj.get("course_description");

    if (course_name && course_price && course_description !== null) {
      await db.insert(coursesTable).values({
        courseName: course_name,
        coursePrice: parseInt(course_price),
        courseDescription: course_description,
      });
      res.end("okey");
    }

    if (req.url === "/teacher" && req.method === "GET") {
      res.end(`<form action="/teacher" method="POST">
        <input type='text' name="teacher_name" placeholder='Enter teacher name...'/>
        <input type='email' name="teacher_email" placeholder='Enter teacher email...'/>
        <input type='text' name="teacher_description" placeholder='Enter teacher descption...'/>
        <button type="submit">submit</button>
        </form>`);
    }
    const teacher_name = bodyObj.get("teacher_name");
    const teacher_email = bodyObj.get("teacher_email");
    const teacher_description = bodyObj.get("teacher_description");

    if (teacher_name && teacher_email && teacher_description !== null) {
      await db.insert(instructorTable).values({
        instructorName: teacher_name,
        instructorEmail: teacher_email,
        instructorDescription: teacher_description,
      });
      res.end("okey");
    }

    if (req.url === "/subject" && req.method === "GET") {
      res.end(`<form action="/subject" method="POST">
        <input type='text' name="subject_name" placeholder='Enter subject name...'/>
        <input type='text' name="subject_description" placeholder='Enter subject descption...'/>
        <button type="submit">submit</button>
        </form>`);
    }
    const subject_name = bodyObj.get("subject_name");
    const subject_description = bodyObj.get("subject_description");

    if (subject_name && subject_description !== null) {
      await db.insert(subjectTable).values({
        subName: subject_name,
        subDescription: subject_description,
      });
      res.end("okey");
    }


  });
});
server.listen(PORT, () => {
  console.log("running server on port: " + PORT);
});
