import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import myIcon from "./../../assets/redbrick-white-logo.svg";

const Navbar = () => {
  return (
    <nav className="bg-gradient-to-r from-[#011116] via-[#0f0e11] to-[#605e68] p-4 flex justify-between items-center text-white relative shadow-lg">
      <div className="size-40 h-7">
        <img src={myIcon} alt="my svg loading" />
      </div>

      <Link to="/profile">
        <Button className="bg-gray-100 rounded-full px-4 py-2 hover:bg-slate-500 text-gray-900">
          Profile
        </Button>
      </Link>
    </nav>
  );
};

export default Navbar;
