/*
  Warnings:

  - You are about to drop the `_employee_project` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_employee_project" DROP CONSTRAINT "_employee_project_A_fkey";

-- DropForeignKey
ALTER TABLE "_employee_project" DROP CONSTRAINT "_employee_project_B_fkey";

-- AlterTable
ALTER TABLE "departments" ADD COLUMN     "description" TEXT;

-- DropTable
DROP TABLE "_employee_project";

-- CreateTable
CREATE TABLE "_EmployeeToProject" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_EmployeeToProject_AB_unique" ON "_EmployeeToProject"("A", "B");

-- CreateIndex
CREATE INDEX "_EmployeeToProject_B_index" ON "_EmployeeToProject"("B");

-- AddForeignKey
ALTER TABLE "_EmployeeToProject" ADD CONSTRAINT "_EmployeeToProject_A_fkey" FOREIGN KEY ("A") REFERENCES "employees"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_EmployeeToProject" ADD CONSTRAINT "_EmployeeToProject_B_fkey" FOREIGN KEY ("B") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;
