import http from "node:http";
import { db } from "./db";
import { coursesTable, instructorTable, subjectTable } from "./db/schema";
import { eq } from "drizzle-orm";
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

    let ID;
    try {
      ID = typeof Number(req.url?.split("/").at(-1))
        ? Number(req.url?.split("/").at(-1))
        : null;
    } catch (e) {
      console.error(e);
    }

    console.log("id", ID);

    if (req.method === "GET") {
      switch (req.url) {
        case "/":
          res.end(`
            <a href="/addcourse">add Course</a>
            <a href="/addsubject">add Subject</a>
            <a href="/addinstructor">add instructor</a>  
            <br>
            <a href="/courses/all">get all courses</a>
            <br>
            
            `);
          break;

        case "/addcourse":
          res.end(`<form action="/courses" method="POST">
            <input type='text' name="course_name" placeholder='Enter course name...'/>
            <input type='number' name="course_price" placeholder='Enter course price...'/>
            <input type='text' name="course_description" placeholder='Enter course description...'/>
            <button type="submit">submit</button>
            </form>`);
          break;

        case "/addinstructor":
          res.end(`<form action="/instructor" method="POST">
            <input type='text' name="teacher_name" placeholder='Enter teacher name...'/>
            <input type='email' name="teacher_email" placeholder='Enter teacher email...'/>
            <input type='text' name="teacher_description" placeholder='Enter teacher descption...'/>
            <button type="submit">submit</button>
            </form>`);
          break;

        case "/addsubject":
          res.end(`<form action="/subject" method="POST">
            <input type='text' name="subject_name" placeholder='Enter subject name...'/>
            <input type='text' name="subject_description" placeholder='Enter subject descption...'/>
            <button type="submit">submit</button>
            </form>`);
          break;

        case `/delete/${ID}`:
          if (ID !== null) {
            await db
              .delete(coursesTable)
              .where(eq(coursesTable.courseId, Number(ID)));

            res.end(`<h2>course deleted</h2>
              <br>
              <a href="/courses/all">see all courses</a>
              `);
          } else {
            res.end(`<h1> invalid id passed at: /delete/${ID}`);
          }
          break;

        case `/update/${ID}`:
          const course = await db
            .select()
            .from(coursesTable)
            .where(eq(coursesTable.courseId, Number(ID)));

          res.end(`<form action="/update/${ID}" method="POST">
            <p>current course name:<b> ${course[0].courseName} </b> </p>
            <input type='text' name="course_name" placeholder='Enter course name...'/>
            <p>current course price:<b> ${course[0].coursePrice} </b></p>
            <input type='number' name="course_price"  placeholder='Enter course price...'/>
            <p>current coures description:<b> ${course[0].courseDescription} </b></p>
              <input type='text' name="course_description"  placeholder='Enter course description...'/>
              <button  action="/update/${ID}" type="submit" >change data</button>
              </form>`);
          break;

        case `/view/${ID}`:
          const currentCourse = await db
            .select()
            .from(coursesTable)
            .where(eq(coursesTable.courseId, Number(ID)));

          let c = `<h1> course </h1> 
            <table border="2">
            <tr>
            <th>course name</th>
            <th>course price</th>
            <th>course desc.</th>
            <tr>`;
          currentCourse.forEach((course) => {
            c += `
                <tr>
                <td>${course.courseName}</td>
                <td>${course.coursePrice}</td>
                <td>${course.courseDescription}</td>
                </tr>
                `;
          });
          c += `</table> <br><a href="/">Back to Home</a>`;
          res.end(c);
          break;

        case "/courses/all":
          try {
            const allCourses = await db.select().from(coursesTable);

            let html = `<h1> All courses </h1> 
            <table border="2">
            <tr>
            <th>course name</th>
            <th>course price</th>
            <th>course desc.</th>

            <th> delete course</th>
            <th> edit course</th>
            <th> view course</th>

            <tr>
            `;

            allCourses.forEach((course) => {
              html += `
                    <tr>
                    <td>${course.courseName}</td>
                    <td>${course.coursePrice}</td>
                    <td>${course.courseDescription}</td>
                    <td><a href="/delete/${course.courseId}">Delete course</a></td>
                    <td><a href="/update/${course.courseId}">Edit course</a></td>
                    <td><a href="/view/${course.courseId}">view Course</a></td>
                    </tr>

                    `;
            });
            html += `</table> <br><a href="/">Back to Home</a>`;
            res.end(html);
          } catch (err) {
            res.statusCode = 500;
            res.end("<h2>Internal Server Error</h2>");
          }
          break;

        default:
          res.statusCode = 404;
          res.end("<h1> not found </h1>");
          break;
      }
    } else if (req.method === "POST") {
      switch (req.url) {
        case "/courses":
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
          <a href="/addcourse">Create another course</a><br/>
          <a href="/courses/all">get All courses</a>
        `);
          }
          break;

        case "/instructor":
          const teacher_name = bodyObj.get("teacher_name");
          const teacher_email = bodyObj.get("teacher_email");
          const teacher_description = bodyObj.get("teacher_description");

          if (teacher_name && teacher_email && teacher_description) {
            await db.insert(instructorTable).values({
              instructorName: teacher_name,
              instructorEmail: teacher_email,
              instructorDescription: teacher_description,
            });
            res.end(`
              <p style ="background-color: lightseagreen; color: red; font-family: monospace">teacher Name: ${teacher_name}</p>
              <p>teacher Email: ${teacher_email}</p>
              <p>teacher description: ${teacher_description}</p>
              <a href="/addinstructor">Create another teachers</a><br/>
              <a href="/teachers/all">get All teachers</a>
            `);
          }
          break;

        case "/subject":
          const subject_name = bodyObj.get("subject_name");
          const subject_description = bodyObj.get("subject_description");

          if (subject_name && subject_description) {
            await db.insert(subjectTable).values({
              subName: subject_name,
              subDescription: subject_description,
            });
            res.end(`
              <p style ="background-color: lightseagreen; color: red; font-family: monospace">subject Name: ${subject_name}</p>
              <p>subject description: ${subject_description}</p>
              <a href="/addsubject">Create another subject</a><br/>
              <a href="/subjects/all">get All subjects</a>
            `);
          }
          break;

        case `/update/${ID}`:
          const updated_course_name = bodyObj.get("course_name");
          const updated_course_price = bodyObj.get("course_price");
          const updated_course_description = bodyObj.get("course_description");

          await db
            .update(coursesTable)
            .set({
              courseName: String(updated_course_name),
              coursePrice: Number(updated_course_price),
              courseDescription: String(updated_course_description),
            })
            .where(eq(coursesTable.courseId, Number(ID)));

          res.end(
            `<h1> the data is updated</h1>
              <br>
              <a href="/courses/all">get All courses</a>`
          );
          break;
      }
    }
  });
});

server.listen(PORT, () => {
  console.log("running server on port: " + PORT);
});
