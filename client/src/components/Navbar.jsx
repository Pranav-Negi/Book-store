import { Link } from "react-router-dom";
import { BiLogOutCircle } from "react-icons/bi";

const Navbar = () => {
  const handlelogout = () => {
    const confirm = window.confirm("Are you sure??");
    if (!confirm) {
      return;
    }
    localStorage.removeItem("token");
  };
  return (
    <nav className="bg-gradient-to-r from-[#1e1e1e] to-[#2c2c2c] shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto  py-3 flex justify-between items-center text-white">
        <div className="text-2xl font-semibold text-[#fbbf24]">BookHeaven</div>
        <ul className="flex space-x-6 font-medium">
          <li>
            <Link
              to="/home"
              className="hover:text-[#fbbf24] transition-colors duration-200"
            >
              Home
            </Link>
          </li>
          <li>
            <Link
              to="/Profile"
              className="hover:text-[#fbbf24] transition-colors duration-200"
            >
              Profile
            </Link>
          </li>
          <li>
            <Link
              to="/Market"
              className="hover:text-[#fbbf24] transition-colors duration-200"
            >
              Market Place
            </Link>
          </li>
          <li>
            <Link
              to="/cart"
              className="hover:text-[#fbbf24] transition-colors duration-200"
            >
              Cart
            </Link>
          </li>
          <li>
            <Link
              className="hover:text-[#fbbf24] transition-colors duration-200"
              onClick={handlelogout}
              to="/"
            >
              <BiLogOutCircle className="text-2xl" />
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
