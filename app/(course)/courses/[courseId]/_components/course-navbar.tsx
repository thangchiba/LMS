import { Chapter, Course, UserProgress } from '@prisma/client'

import { NavbarRoutes } from '@/components/navbar-routes'

import { CourseMobileSidebar } from './course-mobile-sidebar'
import { Logo } from '@/app/(dashboard)/_components/logo'

interface CourseNavbarProps {
  course: Course & {
    chapters: (Chapter & {
      userProgress: UserProgress[] | null
    })[]
  }
  progressCount: number
}

export const CourseNavbar = ({ course, progressCount }: CourseNavbarProps) => {
  return (
    <div className="px-4 border-b h-full flex items-center bg-white shadow-sm">
      <CourseMobileSidebar course={course} progressCount={progressCount} />
      <p className="text-xl font-bold">{course.title}</p>
      <NavbarRoutes />
    </div>
  )
}
