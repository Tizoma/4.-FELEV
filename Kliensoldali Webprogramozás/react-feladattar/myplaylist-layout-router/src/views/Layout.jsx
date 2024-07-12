import { Menu } from "./menu/Menu";
import { Outlet } from "react-router-dom";

export function Layout() {
  return (
    <div className="ui container">
      <Menu />
      {/* {children} */}

      <Outlet />
    </div>
  );
}
