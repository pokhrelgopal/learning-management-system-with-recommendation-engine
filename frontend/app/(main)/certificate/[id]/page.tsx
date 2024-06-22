"use client";
import { mediaUrl } from "@/app/endpoints";
import { getCertificate } from "@/app/server";
import Spinner from "@/components/elements/Spinner";
import { Button } from "@/components/ui/button";
import showToast from "@/lib/toaster";
import { useQuery } from "@tanstack/react-query";
import { ArrowRightCircle, Download, ShieldAlert } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const CertificatePage = ({ params }: any) => {
  const { data, isLoading } = useQuery<any>({
    queryKey: ["certificate"],
    queryFn: () => getCertificate(params.id),
    enabled: !!params.id,
    retry: 1,
  });
  const handleDownloadCertificate = async () => {
    try {
      const response = await fetch(mediaUrl + data?.file);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `certificate-${data.user?.full_name || "download"}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } catch (error) {
      console.error("Error downloading certificate:", error);
      showToast("error", "Error downloading certificate");
    }
  };
  if (isLoading) return <Spinner />;
  return (
    <>
      {!data ? (
        <div>
          <div className="bg-gray-100 mt-10">
            <div className="bg-white p-6  md:mx-auto">
              <ShieldAlert className="w-16 h-16 text-red-500 mx-auto mb-5" />
              <div className="text-center">
                <h3 className="md:text-3xl text-base text-gray-900 font-semibold text-center">
                  Certificate not found.
                </h3>
                <p className="text-gray-600 my-2 text-lg">
                  You may be trying to access an invalid certificate.
                </p>

                <div className="py-10 text-center">
                  <Link href={`/`} passHref>
                    <Button size={"lg"} className="text-lg">
                      Go to course
                      <ArrowRightCircle className="w-5 h-5 inline-block ml-2" />
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div>
          <div className="grid grid-cols-6 gap-10">
            <div className="col-span-4">
              <Image
                src={mediaUrl + data?.file}
                alt={data?.user?.full_name || "Certificate"}
                width={1000}
                height={1000}
                className="rounded-lg border w-full object-cover"
              />
              <div className="mt-6 text-lg text-gray-600">
                This certificate above verifies that{" "}
                <span className="text-indigo-600">
                  {data?.user?.full_name || "User"}
                </span>{" "}
                successfully completed the course{" "}
                <span className="text-indigo-600">
                  {data?.course?.title || "Course"}{" "}
                </span>
                {new Date(data.created_at).toDateString()} as taught by{" "}
                <span className="text-indigo-600">
                  {data?.course?.instructor?.full_name || "Instructor"}
                </span>{" "}
                on Learnify. The certificate indicates the entire course was
                completed as validated by the student.
              </div>
            </div>
            <div className="col-span-2">
              <div>
                <h3 className="text-xl font-bold mb-2">
                  Certificate Recipient
                </h3>
                <div className="flex items-center gap-4 text-lg">
                  <Image
                    src={
                      mediaUrl + data?.user?.profile_image ||
                      "/images/avatar.png"
                    }
                    alt={data?.user?.full_name || "User"}
                    width={100}
                    height={100}
                    className="rounded-full object-cover border-2 border-indigo-500 p-1 w-16 h-16"
                  />
                  <div>
                    <p>{data?.user?.full_name || "User"}</p>
                    <p>{data?.user?.email || "User"}</p>
                  </div>
                </div>
              </div>
              <div className="mt-6">
                <h3 className="text-xl font-bold mb-2">About the course</h3>
                <div className="">
                  <Image
                    src={mediaUrl + data?.course?.thumbnail}
                    alt={data?.user?.full_name || "course"}
                    width={300}
                    height={300}
                    className="p-2 border w-full"
                  />
                  <div>
                    <p className="text-lg font-bold mt-2">
                      {data?.course?.title}
                    </p>
                    <p>{data?.course?.instructor?.full_name}</p>
                  </div>
                </div>
              </div>
              <div className="mt-4">
                <Button
                  onClick={handleDownloadCertificate}
                  className="text-lg"
                  size={"lg"}
                >
                  <Download
                    size={20}
                    className="text-white mr-2 cursor-pointer"
                  />
                  Download
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CertificatePage;
