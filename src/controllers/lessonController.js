import { AppError } from "../utils/AppError.js";
import {
  addLessonToCourse,
  completeLessonForStudent,
  getCourseProgressForStudent,
  getLessonsByCourse,
  getLessonsWithProgress,
} from "../data/dummyData.js";

export const getPublicCourseLessons = (req, res) => {
  // Public previews do not include per-student completion state.
  const lessons = getLessonsByCourse(req.params.courseId);

  return res.status(200).json({
    success: true,
    data: lessons,
  });
};

export const getStudentCourseLessons = (req, res) => {
  // Student lesson pages need both the lesson list and the aggregate progress bar.
  const lessons = getLessonsWithProgress(req.params.courseId, req.user.userId);
  const progress = getCourseProgressForStudent({
    courseId: req.params.courseId,
    studentId: req.user.userId,
  });

  return res.status(200).json({
    success: true,
    data: {
      lessons,
      progress,
    },
  });
};

export const completeStudentLesson = (req, res, next) => {
  // Completion is intentionally idempotent; completing twice returns the same progress.
  const result = completeLessonForStudent({
    lessonId: req.params.lessonId,
    studentId: req.user.userId,
  });

  if (!result) {
    return next(new AppError("Lesson not found", 404, "LESSON_NOT_FOUND"));
  }

  return res.status(200).json({
    success: true,
    data: result,
  });
};

export const getStudentCourseProgress = (req, res) => {
  const progress = getCourseProgressForStudent({
    courseId: req.params.courseId,
    studentId: req.user.userId,
  });

  return res.status(200).json({
    success: true,
    data: progress,
  });
};

export const createInstructorLesson = (req, res, next) => {
  const { title, content, estimatedMinutes } = req.body;

  if (!title || !content) {
    return next(
      new AppError("Lesson title and content are required", 400, "LESSON_FIELDS_REQUIRED"),
    );
  }

  const lesson = addLessonToCourse({
    courseId: req.params.courseId,
    title,
    content,
    estimatedMinutes,
  });

  return res.status(201).json({
    success: true,
    data: lesson,
  });
};
