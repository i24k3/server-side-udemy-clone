import { integer, pgTable, primaryKey, serial, varchar } from "drizzle-orm/pg-core";
export const coursesTable = pgTable("courses", {
  courseId: serial().primaryKey(),
  courseName: varchar({ length: 255 }).notNull().unique(),
  coursePrice: integer().notNull(),
  courseDescription: varchar({length: 1000}).notNull()

});


export const subjectTable = pgTable("subject", {
    subId:serial().primaryKey(),
    subName:varchar({ length: 255 }).notNull(),
    subDescription: varchar({length: 1000}).notNull()
})

export const instructorTable = pgTable("instructor", {
    instructorId:serial().primaryKey(),
    instructorName:varchar({ length: 255 }).notNull(),
    instructorEmail: varchar({length : 255}).notNull().unique(),
    instructorDescription: varchar({length: 1000}).notNull()
})

export const instructorSubjectTable = pgTable("instructorsubject", {
    instructorId: integer().notNull().references(() => instructorTable.instructorId),
    subId: integer().notNull().references(() => subjectTable.subId),
},function (table) {
    return [primaryKey({ columns: [table.instructorId,table.subId] })]
});

export const instructorCourseTable = pgTable("instructorcourse", {
    instructorId: integer().notNull().references(()=> instructorTable.instructorId),
    courseId: integer().notNull().references(()=> coursesTable.courseId)
},function (table) {
    return [primaryKey({ columns: [table.instructorId,table.courseId] })]
})

//or we can also use the composite function as 
export const subjectCourseTable = pgTable("subjectcourse", {
    subId: integer().notNull().references(()=> subjectTable.subId),
    courseId: integer().notNull().references(()=> coursesTable.courseId)
},(table) => [
    primaryKey({ columns: [table.subId, table.courseId] }),
]);
