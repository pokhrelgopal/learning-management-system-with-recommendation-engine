import React from "react";

const page = ({ params }: any) => {
  console.log(params.slug);
  return <div>page</div>;
};

export default page;
