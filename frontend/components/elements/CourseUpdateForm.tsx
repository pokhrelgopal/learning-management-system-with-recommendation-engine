import React from "react";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { useQuery } from "@tanstack/react-query";
import { updateCourse, getCategories, deleteCourse } from "@/app/server";
import Spinner from "./Spinner";
import { Button } from "../ui/button";
import showToast from "@/lib/toaster";
import Image from "next/image";
import {
  CircleDollarSign,
  Edit,
  ImagePlusIcon,
  List,
  PenLine,
  Trash2,
} from "lucide-react";
import SectionContainer from "./SectionContainer";
import ConfirmationDialog from "./ConfirmationDialog";
import { useRouter } from "next/navigation";
import Link from "next/link";

type Props = {
  course: any;
};

const CourseUpdateForm = ({ course }: Props) => {
  const router = useRouter();
  const { data, isLoading, error } = useQuery<any>({
    queryKey: ["categories"],
    queryFn: () => getCategories(),
  });

  const [title, setTitle] = React.useState(course.title);
  const [description, setDescription] = React.useState(
    course.description || ""
  );
  const [category, setCategory] = React.useState(course.category?.id || null);
  const [price, setPrice] = React.useState(course.price);
  const [thumbnail, setThumbnail] = React.useState(course.thumbnail);
  const [thumbnailFile, setThumbnailFile] = React.useState<File | null>(null);
  const [isPublished, setIsPublished] = React.useState(course.is_published);
  const [updating, setUpdating] = React.useState(false);

  React.useEffect(() => {
    setTitle(course.title);
    setDescription(course.description || "");
    setCategory(course.category?.id || null);
    setPrice(course.price);
    setThumbnail(course.thumbnail);
    setIsPublished(course.is_published);
  }, [course]);

  const handleUpdate = async () => {
    if (title.trim() === "") {
      showToast("error", "Title is required.");
      return;
    }
    // title cannot have only numbers
    if (/^\d+$/.test(title.trim())) {
      showToast("error", "Title must contain letters.");
      return;
    }
    if (description.length < 15) {
      showToast("error", "Description must be at least 15 characters.");
      return;
    }
    // description cannot have only numbers
    if (/^\d+$/.test(description.trim())) {
      showToast("error", "Description must contain letters.");
      return;
    }
    if (title.length > 70) {
      showToast("error", "Title must be at most 70 characters.");
      return;
    }
    if (!category) {
      showToast("error", "Category is required.");
      return;
    }
    if (!description.trim()) {
      showToast("error", "Description is required.");
      return;
    }

    if (price < 10) {
      showToast("error", "Price must be greater than $10.");
      return;
    }
    //price must be less than 1000
    if (price > 1000) {
      showToast("error", "Price must be less than $1000.");
      return;
    }

    try {
      setUpdating(true);
      const payload = new FormData();
      payload.append("title", title.trim());
      payload.append("description", description.trim());
      payload.append(
        "category_id",
        category || data.find((cat: any) => cat.name === category).id
      );
      payload.append("price", price.toString());
      payload.append("is_published", isPublished.toString());
      if (thumbnailFile) {
        payload.append("thumbnail", thumbnailFile);
      }

      const res = await updateCourse(course.slug, payload);
      if (res.status === 200) {
        showToast("success", "Course updated successfully.");

        if (title !== course.title) {
          const newURL = title
            .replace(/[^a-zA-Z0-9 ]/g, "")
            .replace(/\s+/g, "-");
          let finalURL = newURL.toLowerCase();
          if (finalURL.charAt(finalURL.length - 1) === "-") {
            finalURL = finalURL.slice(0, -1);
          }
          router.push(`/instructor/courses/${finalURL}`);
        }
      }
    } catch (error) {
      showToast("error", "Failed to update course.");
      console.log(error);
    } finally {
      setUpdating(false);
    }
  };

  if (isLoading) return <Spinner />;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setThumbnailFile(e.target.files[0]);
      setThumbnail(URL.createObjectURL(e.target.files[0]));
    }
  };

  const handlePublishStatus = async () => {
    if (!title.trim() || !category || price < 10 || !description.trim()) {
      showToast("error", "Please fill all the fields first.");
      return;
    }
    if (course?.sections?.length === 0) {
      showToast("error", "Please add sections to the course first.");
      return;
    }
    try {
      setUpdating(true);
      const res = await updateCourse(course.slug, {
        is_published: !isPublished,
      });
      if (res.status === 200) {
        setIsPublished(!isPublished);
        showToast(
          "success",
          `Course ${isPublished ? "unpublished" : "published"} successfully.`
        );
      }
    } catch (error: any) {
      if (error?.request?.status === 403) {
        showToast(
          "error",
          "You cannot un-publish a course with students enrolled."
        );
        return;
      }
      showToast("error", "Failed to update course.");
    } finally {
      setUpdating(false);
    }
  };

  const handleDelete = async () => {
    try {
      setUpdating(true);
      const res = await deleteCourse(course.slug);
      if (res.status === 204) {
        showToast("success", "Course deleted successfully.");
        router.push("/instructor/courses");
      }
    } catch (error: any) {
      if (error?.response?.data?.detail) {
        showToast(
          "error",
          "You cannot delete a course with students enrolled."
        );
        return;
      }
      showToast("error", "Failed to delete course.");
    } finally {
      setUpdating(false);
    }
  };

  return (
    <>
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold mb-6">Course Details</h1>
        <div className="flex items-center gap-2">
          {isPublished && (
            <Link href={`/my-courses/${course.slug}`} passHref>
              <Button className={`text-lg`} variant={"default"}>
                View as Student
              </Button>
            </Link>
          )}
          <ConfirmationDialog
            title="Are you sure?"
            description="Are you sure you want to delete this course? This action cannot be undone."
            onConfirm={handleDelete}
            buttonContent={
              <Button
                variant={"destructive"}
                loading={isLoading}
                className="text-lg w-full flex items-center gap-3"
              >
                <Trash2 className="w-5 h-5 inline-block" />
                Delete Course
              </Button>
            }
          />
          <Button
            loading={updating || isLoading}
            onClick={handlePublishStatus}
            className={`text-lg`}
            variant={isPublished ? "destructive" : "default"}
          >
            {isPublished ? "UnPublish" : "Publish"}
          </Button>
        </div>
      </div>
      <div className="mb-10">
        <form
          className="mt-4 grid grid-cols-2 gap-6"
          onSubmit={(e) => e.preventDefault()}
        >
          <div className="form-group mb-3 p-5 bg-gray-50 shadow-sm rounded-xl">
            <div className="flex items-center gap-2">
              <PenLine size={20} className="text-gray-500" />
              <Label htmlFor="title" className="text-lg">
                Course Title
              </Label>
            </div>
            <Input
              type="text"
              className="text-lg mt-2 py-6"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <div className="form-group mb-3 p-5 bg-gray-50 shadow-sm rounded-xl">
            <div className="flex items-center gap-2">
              <List size={20} className="text-gray-500" />
              <Label htmlFor="category" className="text-lg">
                Course Category
              </Label>
            </div>
            <select
              className="text-lg mt-2 border rounded p-2.5 w-full"
              value={category || ""}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="">Select Category</option>
              {data.map((cat: any) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>
          <div className="form-group mb-3 p-5 bg-gray-50 shadow-sm rounded-xl">
            <div className="flex items-center gap-2">
              <Edit size={20} className="text-gray-500" />
              <Label htmlFor="description" className="text-lg">
                Description
              </Label>
            </div>
            <Textarea
              className="text-lg mt-2"
              rows={7}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div className="form-group mb-3 p-5 bg-gray-50 shadow-sm rounded-xl">
            <div className="flex items-center gap-2">
              <ImagePlusIcon size={20} className="text-gray-500" />
              <Label htmlFor="thumbnail" className="text-lg">
                Course Thumbnail
              </Label>
            </div>
            <Image
              src={thumbnail}
              alt={title}
              width={300}
              height={200}
              className="rounded-lg border object-cover mt-2"
            />
            <Input
              id="picture"
              type="file"
              className="mt-2"
              onChange={handleFileChange}
            />
          </div>
          <div className="form-group mb-3 p-5 bg-gray-50 shadow-sm rounded-xl">
            <div className="flex items-center gap-2">
              <CircleDollarSign size={20} className="text-gray-500" />
              <Label htmlFor="price" className="text-lg">
                Price
              </Label>
            </div>
            <Input
              type="number"
              className="text-lg mt-2 py-6"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            />
          </div>
        </form>
        <div className="form-group py-3">
          <Button
            type="submit"
            loading={updating || isLoading}
            size={"lg"}
            variant={"default"}
            className="text-lg"
            onClick={handleUpdate}
          >
            Update Course
          </Button>
        </div>
      </div>
      <div className="py-16 border-t">
        <SectionContainer sections={course.sections} courseId={course.id} />
      </div>
    </>
  );
};

export default CourseUpdateForm;
