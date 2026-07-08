let nextLessonId = 7;

// Temporary in-memory lesson store used until the Supabase lesson tables are wired.
const lessons = [
  {
    lesson_id: "1",
    course_id: "1",
    title: "Course orientation",
    content:
      "Welcome to the course. In this lesson you will understand the course goals, how to use the LMS dashboard, and how to complete each lesson. Read carefully and take notes as you go.",
    order: 1,
    estimatedMinutes: 6,
  },
  {
    lesson_id: "2",
    course_id: "1",
    title: "Core concepts",
    content:
      "This lesson explains the most important ideas you need before moving into practical work. Focus on the vocabulary, the examples, and the small checkpoints inside the content.",
    order: 2,
    estimatedMinutes: 10,
  },
  {
    lesson_id: "3",
    course_id: "1",
    title: "Practice task",
    content:
      "Apply what you learned by completing a simple practice task. Try to solve it first, then compare your approach with the lesson explanation.",
    order: 3,
    estimatedMinutes: 12,
  },
  {
    lesson_id: "4",
    course_id: "2",
    title: "Getting started",
    content:
      "Start by reviewing the course outline and setting up your study plan. This lesson gives you the roadmap for the rest of the course.",
    order: 1,
    estimatedMinutes: 5,
  },
  {
    lesson_id: "5",
    course_id: "2",
    title: "Hands-on walkthrough",
    content:
      "Follow the walkthrough step by step. The goal is to understand the workflow, not memorize the exact words. Pause whenever a section feels unclear.",
    order: 2,
    estimatedMinutes: 14,
  },
  {
    lesson_id: "6",
    course_id: "2",
    title: "Review and next steps",
    content:
      "Use this lesson to review the key points, identify what you can now do confidently, and decide what you should practice next.",
    order: 3,
    estimatedMinutes: 7,
  },
];

const completedLessonIdsByStudent = new Map();

// Each student gets a Set so marking the same lesson complete stays idempotent.
const getStudentLessonSet = (studentId) => {
  const key = String(studentId);

  if (!completedLessonIdsByStudent.has(key)) {
    completedLessonIdsByStudent.set(key, new Set());
  }

  return completedLessonIdsByStudent.get(key);
};

export const getLessonsByCourse = (courseId) =>
  lessons
    .filter((lesson) => String(lesson.course_id) === String(courseId))
    .sort((a, b) => a.order - b.order);

export const getLessonsWithProgress = (courseId, studentId) => {
  const completedLessonIds = getStudentLessonSet(studentId);

  return getLessonsByCourse(courseId).map((lesson) => ({
    ...lesson,
    completed: completedLessonIds.has(String(lesson.lesson_id)),
  }));
};

export const addLessonToCourse = ({ courseId, title, content, estimatedMinutes }) => {
  const courseLessons = getLessonsByCourse(courseId);
  const lesson = {
    lesson_id: String(nextLessonId++),
    course_id: String(courseId),
    title,
    content,
    order: courseLessons.length + 1,
    estimatedMinutes: Number(estimatedMinutes) || 8,
  };

  lessons.push(lesson);
  return lesson;
};

export const completeLessonForStudent = ({ lessonId, studentId }) => {
  const lesson = lessons.find((item) => String(item.lesson_id) === String(lessonId));

  if (!lesson) {
    return null;
  }

  getStudentLessonSet(studentId).add(String(lessonId));

  // Recalculate course progress every time so the frontend can complete courses.
  const courseLessons = getLessonsByCourse(lesson.course_id);
  const completedLessonIds = getStudentLessonSet(studentId);
  const completedCount = courseLessons.filter((item) =>
    completedLessonIds.has(String(item.lesson_id)),
  ).length;

  return {
    lesson,
    completedCount,
    totalLessons: courseLessons.length,
    courseCompleted: courseLessons.length > 0 && completedCount === courseLessons.length,
    progress:
      courseLessons.length > 0
        ? Math.round((completedCount / courseLessons.length) * 100)
        : 0,
  };
};

export const getCourseProgressForStudent = ({ courseId, studentId }) => {
  // Dashboard cards use this lightweight summary instead of loading full lessons.
  const courseLessons = getLessonsByCourse(courseId);
  const completedLessonIds = getStudentLessonSet(studentId);
  const completedCount = courseLessons.filter((lesson) =>
    completedLessonIds.has(String(lesson.lesson_id)),
  ).length;

  return {
    courseId: String(courseId),
    completedCount,
    totalLessons: courseLessons.length,
    courseCompleted: courseLessons.length > 0 && completedCount === courseLessons.length,
    progress:
      courseLessons.length > 0
        ? Math.round((completedCount / courseLessons.length) * 100)
        : 0,
  };
};
