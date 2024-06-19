import React from "react";

import { Github, Linkedin } from "lucide-react";
import Logo from "../particles/Logo";

const items = [
  {
    id: 1,
    name: "Home",
    link: "/",
  },
  {
    id: 2,
    name: "Courses",
    link: "/courses",
  },
];
const Footer = () => {
  return (
    <footer className="bg-gray-100">
      <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="flex justify-center text-teal-600">
          <Logo />
        </div>

        <p className="mx-auto lg:text-lg mt-6 max-w-md text-center leading-relaxed text-gray-500">
          Access our platform to continue your learning journey on the go, with
          all your courses and materials at your fingertips.
        </p>

        <ul className="mt-5 flex flex-wrap justify-center gap-6 md:gap-8 lg:gap-12">
          {items.map((item) => (
            <li key={item.id}>
              <a
                className="text-gray-700 transition hover:text-gray-700/75"
                href={item.link}
              >
                {item.name}
              </a>
            </li>
          ))}
        </ul>

        <ul className="mt-4 flex justify-center gap-6 md:gap-8">
          <li>
            <a
              href="https://www.linkedin.com/in/pokhrelgopal/"
              rel="noreferrer"
              target="_blank"
              className="text-gray-700 transition hover:text-gray-700/75"
            >
              <span className="sr-only">Linkedin</span>
              <Linkedin size={24} />
            </a>
          </li>

          <li>
            <a
              href="https://github.com/pokhrelgopal/"
              rel="noreferrer"
              target="_blank"
              className="text-gray-700 transition hover:text-gray-700/75"
            >
              <span className="sr-only">GitHub</span>
              <Github size={24} />
            </a>
          </li>
        </ul>
        <p className="pt-6 md:pt-10  text-gray-500 text-center">
          &copy; {new Date().getFullYear()} LearnHub. All rights reserved.
          Created by{" "}
          <a
            className="underline underline-offset-1 text-teal-600 transition hover:text-teal-700/75"
            href="https://www.linkedin.com/in/pokhrelgopal/"
            target="_blank"
          >
            Gopal Pokhrel
          </a>
        </p>
      </div>
    </footer>
  );
};

export default Footer;
