import React from "react";
import { Logo } from "./Icons/Icon";

const Navbar = () => {
  return (
    <div className="w-[100vw] h-10 flex flex-row">
      <div className="w-40 bg-red-500">
        <Logo className={``} />
      </div>
      <div>navbar</div>
    </div>
  );
};

export default Navbar;
