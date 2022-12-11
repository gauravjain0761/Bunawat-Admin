import { useState } from "react";
import { ProSidebar, Menu, MenuItem, SubMenu } from "react-pro-sidebar";
import { Box, IconButton, Typography, useTheme } from "@mui/material";
import { Link } from "react-router-dom";
import "react-pro-sidebar/dist/css/styles.css";
import { tokens } from "../../theme";
import ContactsOutlinedIcon from "@mui/icons-material/ContactsOutlined";
import MenuOutlinedIcon from "@mui/icons-material/MenuOutlined";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
// import PeopleOutlinedIcon from "@mui/icons-material/PeopleOutlined";
// import ReceiptOutlinedIcon from "@mui/icons-material/ReceiptOutlined";
// import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
// import CalendarTodayOutlinedIcon from "@mui/icons-material/CalendarTodayOutlined";
// import HelpOutlineOutlinedIcon from "@mui/icons-material/HelpOutlineOutlined";
// import BarChartOutlinedIcon from "@mui/icons-material/BarChartOutlined";
// import PieChartOutlineOutlinedIcon from "@mui/icons-material/PieChartOutlineOutlined";
// import TimelineOutlinedIcon from "@mui/icons-material/TimelineOutlined";
// import MapOutlinedIcon from "@mui/icons-material/MapOutlined";


const Item = ({ title, to, icon, selected, setSelected }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  return (
    <MenuItem
      active={selected === title}
      style={{
        color: colors.grey[100],
      }}
      onClick={() => setSelected(title)}
      icon={icon}
    >
      <Typography>{title}</Typography>
      <Link to={to} />
    </MenuItem>
  );
};

const SubItem = ({ subMenu, subIcon, title, selected, setSelected }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  return (
    <Menu>
      <SubMenu title={title} icon={subIcon}>
        {subMenu.map(({ title, to, icon }, i) => (
          <MenuItem
            key={i}
            active={selected === title}
            style={{
              color: colors.grey[100],
            }}
            onClick={() => setSelected(title)}
            icon={icon}
          >
            <Typography>{title}</Typography>
            <Link to={to} />
          </MenuItem>
        ))}
      </SubMenu>
    </Menu>
  );
};


const Sidebar = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [selected, setSelected] = useState("User List");

  return (
    <Box
      sx={{
        "& .pro-sidebar-inner": {
          background: `${colors.primary[400]} !important`,
        },
        "& .pro-inner-list-item": {
          background: `transparent !important`,
        },
        "& .pro-icon-wrapper": {
          backgroundColor: "transparent !important",
        },
        "& .pro-inner-item": {
          padding: "5px 35px 5px 20px !important",
        },
        "& .pro-inner-item:hover": {
          color: "#868dfb !important",
        },
        "& .pro-menu-item.active": {
          color: "#6870fa !important",
        },
      }}
    >
      <ProSidebar collapsed={isCollapsed}>
        <Menu iconShape="square">
          {/* LOGO AND MENU ICON */}
          <MenuItem
            onClick={() => setIsCollapsed(!isCollapsed)}
            icon={isCollapsed ? <MenuOutlinedIcon /> : undefined}
            style={{
              margin: "10px 0 20px 0",
              color: colors.grey[100],
            }}
          >
            {!isCollapsed && (
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                ml="15px"
              >
                <Typography variant="h3" color={colors.grey[100]}>
                  Bunawat
                </Typography>
                <IconButton onClick={() => setIsCollapsed(!isCollapsed)}>
                  <MenuOutlinedIcon />
                </IconButton>
              </Box>
            )}
          </MenuItem>

          {!isCollapsed && (
            <Box mb="25px">
              <Box display="flex" justifyContent="center" alignItems="center">
                <img
                  alt="profile-user"
                  width="100px"
                  height="100px"
                  src={`../../assets/user.png`}
                  style={{ cursor: "pointer", borderRadius: "50%" }}
                />
              </Box>
              <Box textAlign="center">
                <Typography
                  variant="h2"
                  color={colors.grey[100]}
                  fontWeight="bold"
                  sx={{ m: "10px 0 0 0" }}
                >
                  Bunawat
                </Typography>
                <Typography variant="h5" color={colors.greenAccent[500]}>
                  Admin
                </Typography>
              </Box>
            </Box>
          )}

          <Box paddingLeft={isCollapsed ? undefined : "5%"}>
            {/* <Item
              title="Dashboard"
              to="/"
              icon={<HomeOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            /> */}

            <SubItem
              subMenu={[
                {
                  title: "User List",
                  to: "/user-list",
                  icon: <MenuOutlinedIcon />
                },
                {
                  title: "User details",
                  to: "/user-details",
                  icon: <MenuOutlinedIcon />
                },
                {
                  title: "User payment",
                  to: "/user-payment",
                  icon: <MenuOutlinedIcon />
                },
                {
                  title: "User payment history",
                  to: "/user-payment-history",
                  icon: <MenuOutlinedIcon />
                },
                {
                  title: "User Cart Details",
                  to: "/user-cart-details",
                  icon: <MenuOutlinedIcon />
                },
                {
                  title: "User wishlist",
                  to: "/user-wishlist",
                  icon: <MenuOutlinedIcon />
                },
                {
                  title: "Guest Login",
                  to: "/guest-list",
                  icon: <MenuOutlinedIcon />
                }
              ]}
              title="User"
              subIcon={<ContactsOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />

            {/* <SubItem
              subMenu={[
                {
                  title: "Category Management",
                  to: "/category-management",
                  icon: <MenuOutlinedIcon />
                },
                {
                  title: "Sub Category Management",
                  to: "/sub-category-management",
                  icon: <MenuOutlinedIcon />
                },
                {
                  title: "Category tree list",
                  to: "/category-tree-list",
                  icon: <MenuOutlinedIcon />
                }
              ]}
              title="Category"
              subIcon={<ContactsOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />

            <SubItem
              subMenu={[
                {
                  title: "Categoory wise list",
                  to: "/category-wise-list",
                  icon: <MenuOutlinedIcon />
                },
                {
                  title: "Add Product",
                  to: "/add-product",
                  icon: <MenuOutlinedIcon />
                },
                {
                  title: "Products with variations",
                  to: "/products-variations",
                  icon: <MenuOutlinedIcon />
                }
              ]}
              title="Product"
              subIcon={<ContactsOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            /> */}
          </Box>
        </Menu>
      </ProSidebar>
    </Box>
  );
};

export default Sidebar;
