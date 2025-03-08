import MainNavbar from "./main-navbar";
import MobileNavbar from "./mobile-navbar";

export default function Navbar() {
  return (
    <header
    /* className="absolute top-0 inset-x-0 z-10 w-full bg-transparent" */
    >
      <MainNavbar />
      <MobileNavbar />
    </header>
  );
}
