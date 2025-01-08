import { useState, useEffect } from "react";
import { Button } from "./button";
import { BiSolidChevronsUp } from "react-icons/bi";

/**
 * Button to scroll back to the top of the page
 */
export default function BackToTopButton() {
  const [isVisible, setIsVisible] = useState(false);

  const handleScroll = () => {
    const scrolled = window.scrollY > window.innerHeight;
    setIsVisible(scrolled);
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <Button
      size={"icon"}
      title="Up to top"
      onClick={scrollToTop}
      className={`fixed bottom-4 right-4 p-3 transition-opacity duration-300 ${
        isVisible ? "opacity-100" : "pointer-events-none opacity-0"
      }`}
    >
      <BiSolidChevronsUp />
    </Button>
  );
}
