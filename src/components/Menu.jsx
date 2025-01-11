import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  BarChart,
  Home,
  FileCheck2,
  LayoutDashboard,
  LogOut,
  User,
} from "lucide-react";
import SparklesText from "@/components/ui/sparkles-text";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarHeader,
  SidebarTrigger,
  SidebarFooter,
  SidebarProvider,
} from "@/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import EditProfileDialog from "@/components/EditProfile";

const Menu = ({ user, onLogout, children, items }) => {
  const [isOpen, setIsOpen] = useState(true);
  const { pathname } = useLocation();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleSaveProfile = (updatedData) => {
    // API call to save the updated profile information
    console.log("Updated Data:", updatedData);
  };
  const getPageTitle = () => {
    const currentItem = items.find((item) => item.path === pathname);
    return currentItem ? currentItem.label : "Dashboard";
  };
  return (
    <SidebarProvider>
      <Sidebar>
        {/* Sidebar Header */}
        <SidebarHeader>
          <div className="p-4 text-lg font-bold text-gray-900">
            Dashboard Admin
          </div>
        </SidebarHeader>

        {/* Sidebar Content */}
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu>
                {items.map((item) => (
                  <SidebarMenuItem key={item.label}>
                    <SidebarMenuButton asChild>
                      <Link
                        to={item.path}
                        className={`flex items-center px-4 py-2 rounded-md text-base transition ${
                          pathname === item.path
                            ? "bg-blue-50 text-blue-600"
                            : "hover:bg-gray-100 text-gray-800"
                        }`}
                      >
                        <item.icon className="w-5 h-5 mr-3" />
                        <span>{item.label}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>

        {/* Sidebar Footer */}
        <SidebarFooter>
          <div className="flex items-center justify-between p-4">
            <div>
              <p className="text-sm font-medium text-gray-900">{user.name}</p>
              <p className="text-sm text-gray-600">{user.email}</p>
            </div>

            {/* Dropdown Menu for Profile and Logout */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center justify-center w-10 h-10 bg-gray-200 rounded-full text-gray-900">
                  <span className="text-lg font-bold">
                    {user.name?.charAt(0)}
                  </span>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem>
                  <button
                    onClick={() => setIsDialogOpen(true)}
                    className="flex items-center gap-2 w-full text-blue-600"
                  >
                    <User className="w-4 h-4" />
                    Edit Profile
                  </button>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <button
                    onClick={onLogout}
                    className="flex items-center gap-2 w-full text-red-600"
                  >
                    <LogOut className="w-4 h-4" />
                    Logout
                  </button>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </SidebarFooter>
      </Sidebar>
      <EditProfileDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        user={user}
        onSave={handleSaveProfile}
      />
      {/* Main Content */}

      <main className="relative w-full min-h-screen bg-gray-50">
        {/* Navbar */}
        <div className="sticky top-0 z-10 flex items-center justify-between px-4 py-2 bg-white shadow-sm">
          <SidebarTrigger className="text-gray-900" />
          <h4 className="text-gray-800 font-semibold">
            <SparklesText text={getPageTitle()} />
          </h4>
          <h1></h1>
        </div>

        {/* Page Content */}
        <div className="p-6">{children}</div>
      </main>
    </SidebarProvider>
  );
};

export default Menu;
