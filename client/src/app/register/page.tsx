import React, { Suspense } from "react";
import Register from "./Register";
import Loader from "@/components/Loader";

const page = () => {
  return (
    <Suspense fallback={<Loader />}>
      <Register />
    </Suspense>
  );
};

export default page;
